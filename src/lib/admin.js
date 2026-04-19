export const ADMIN_EMAIL = "nathnaeltmk@gmail.com"

export function isAdminEmail(email) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL
}
