import { Stack } from "@mui/material";
import { DataGrid, GridRowClassNameParams } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";

import {
  GenericTableToolbar,
  UsersTableFilters,
  buildUserFilterDescription,
  defaultGridOptions,
  getUsersColumns,
} from "@/components";
import {
  useFormat,
  useMatch,
  useTheme,
  useUser,
  useUserColorRowClasses,
  useUsersFilters,
} from "@/hooks";
import { User, UserWithStats } from "@/types";
import { computeUserStats } from "@/utils";

interface IUsersTableProps {
  customButtons: JSX.Element[];
}

export const UsersTable = ({ customButtons }: IUsersTableProps) => {
  const { allUsers, usersLoading } = useUser();
  const { getUsersActiveInLast60Days } = useMatch();
  const { allFormats } = useFormat();
  const { mode } = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const userColorClasses = useUserColorRowClasses(allUsers, mode);

  const {
    filterFormat,
    setFilterFormat,
    includeUnranked,
    setIncludeUnranked,
    activeRecentOnly,
    setActiveRecentOnly,
    resetUserFilters,
  } = useUsersFilters();

  const columns = useMemo(() => getUsersColumns(), []);

  const filteredUsers: UserWithStats[] = useMemo(() => {
    let baseUsers = allUsers;
    if (activeRecentOnly) {
      const activeUserIds = getUsersActiveInLast60Days();
      baseUsers = allUsers.filter((user) => activeUserIds.includes(user.id));
    }

    return computeUserStats(baseUsers, {
      includeUnranked,
      formatId: filterFormat,
    });
  }, [
    includeUnranked,
    filterFormat,
    activeRecentOnly,
    allUsers,
    getUsersActiveInLast60Days,
  ]);

  const filterDescription = useMemo(() => {
    return buildUserFilterDescription({
      allFormats,
      activeRecentOnly,
      includeUnranked,
      filterFormat,
    });
  }, [filterFormat, includeUnranked, allFormats, activeRecentOnly]);

  return (
    <Stack height="100%" minWidth={740}>
      <DataGrid
        {...defaultGridOptions}
        ref={gridRef}
        loading={usersLoading}
        rows={usersLoading ? [] : filteredUsers}
        columns={columns}
        sx={userColorClasses}
        getRowClassName={(params: GridRowClassNameParams<User>) =>
          `user-row-${params.row.id}`
        }
        slots={{
          toolbar: () => (
            <GenericTableToolbar
              customButtons={customButtons}
              onFilterClick={() => setAnchorEl(gridRef.current)}
              filterDescription={filterDescription}
              quickFilterPlaceholder="search users..."
            />
          ),
        }}
      />
      <UsersTableFilters
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        resetUserFilters={resetUserFilters}
        filterFormat={filterFormat}
        setFilterFormat={setFilterFormat}
        includeUnranked={includeUnranked}
        setIncludeUnranked={setIncludeUnranked}
        activeRecentOnly={activeRecentOnly}
        setActiveRecentOnly={setActiveRecentOnly}
      />
    </Stack>
  );
};
