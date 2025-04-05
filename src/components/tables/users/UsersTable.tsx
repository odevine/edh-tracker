import { Stack } from "@mui/material";
import { DataGrid, GridRowClassNameParams } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";

import {
  UsersTableFilters,
  UsersTableToolbar,
  getUsersColumns,
} from "@/components";
import {
  useFormat,
  useMatch,
  useTheme,
  useUser,
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

  const {
    filterFormat,
    setFilterFormat,
    includeUnranked,
    setIncludeUnranked,
    activeRecentOnly,
    setActiveRecentOnly,
  } = useUsersFilters();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const userColorClasses = useMemo(() => {
    const styles: Record<string, any> = {};
    allUsers.forEach((user) => {
      const userColor =
        mode === "light" ? user.lightThemeColor : user.darkThemeColor;
      styles[`.user-row-${user.id}`] = {
        backgroundColor: userColor ? `${userColor}26` : "inherit",
        border: `1px solid transparent`,
        "&:hover": {
          border: (theme: any) => `1px solid ${theme.palette.primary.main}`,
        },
      };
    });
    return styles;
  }, [allUsers, mode]);

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
    const formatName = allFormats.find(
      (f) => f.id === filterFormat,
    )?.displayName;
    const clauses = ["showing stats for users"];
    if (activeRecentOnly) {
      clauses.push("active in the last 30 days");
    }
    if (formatName) {
      clauses.push(`for the format \"${formatName}\"`);
    }
    if (!formatName && includeUnranked) {
      clauses.push("(including unranked matches)");
    }
    return clauses.join(" ");
  }, [filterFormat, includeUnranked, allFormats]);

  return (
    <Stack height="100%" minWidth={740}>
      <DataGrid
        ref={gridRef}
        pagination
        disableRowSelectionOnClick
        loading={usersLoading}
        initialState={{
          density: "compact",
          pagination: { paginationModel: { pageSize: 15 } },
        }}
        pageSizeOptions={[15, 25, 50]}
        getRowHeight={() => "auto"}
        rows={usersLoading ? [] : filteredUsers}
        columns={columns}
        sx={userColorClasses}
        slots={{
          toolbar: () => (
            <UsersTableToolbar
              customButtons={customButtons}
              onFilterClick={() => setAnchorEl(gridRef.current)}
              filterDescription={filterDescription}
              gridRef={gridRef}
            />
          ),
        }}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        getRowClassName={(params: GridRowClassNameParams<User>) =>
          `user-row-${params.row.id}`
        }
      />
      <UsersTableFilters
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
