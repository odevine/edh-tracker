export interface Format {
  id: string;
  displayName: string;
  inactive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateFormatInput = Omit<
  Format,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

export type UpdateFormatInput = Partial<
  Omit<Format, "id" | "createdAt" | "updatedAt">
>;
