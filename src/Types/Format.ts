export interface Format {
  id: string;
  name: string;
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
  Omit<Format, "createdAt" | "updatedAt">
> & {
  id: string;
};
