export const ROLES = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  USER: "USER",
} as const;

export type RoleName =
  (typeof ROLES)[keyof typeof ROLES];