import type { UserRole } from '@/types';

/** Roles that use the back-office (admin) area rather than the storefront. */
export const STAFF_ROLES: UserRole[] = ['admin', 'manager', 'superadmin'];

export function isStaff(role?: UserRole | null): boolean {
  return !!role && STAFF_ROLES.includes(role);
}

export function isManagerPlus(role?: UserRole | null): boolean {
  return role === 'manager' || role === 'superadmin';
}

export function isSuperAdmin(role?: UserRole | null): boolean {
  return role === 'superadmin';
}

/** UI display labels for internal role values. */
export const ROLE_LABEL: Record<UserRole, string> = {
  customer: 'Customer',
  admin: 'Store Owner',
  manager: 'Manager',
  superadmin: 'Super Admin',
};

export function roleLabel(role?: UserRole | null): string {
  return role ? ROLE_LABEL[role] : '';
}
