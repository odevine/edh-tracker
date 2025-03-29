export const parseJsonBody = <T>(body: string | null): T | null => {
  try {
    return body ? JSON.parse(body) : null;
  } catch {
    return null;
  }
};
