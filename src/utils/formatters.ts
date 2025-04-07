export const percentFormatter = new Intl.NumberFormat("en-us", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});
