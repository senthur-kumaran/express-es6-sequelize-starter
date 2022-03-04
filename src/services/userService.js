import randtoken from 'rand-token';
import { hash } from '../utils/hashing';

/**
 * Check the user has permission.
 * @param {object} user
 * @param {object} permission
 * @returns boolean
 */
const hasPermission = async (user, permission) => {
  if (!permission || permission === 'undefined') {
    return false;
  }
  const permissions = await user.getPermissions();
  return !!permissions.map(({ name }) => name)
    .includes(permission.name);
};

/**
 * Check the user has permission through role.
 * @param {object} user
 * @param {object} permission
 * @returns boolean
 */
const hasPermissionThroughRole = async (user, permission) => {
  if (!permission || permission === 'undefined') {
    return false;
  }
  const roles = await user.getRoles();
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of permission.roles) {
    if (roles.filter((role) => role.name === item.name).length > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Check the user has permission or permission through role.
 * @param {object} user
 * @param {object} permission
 * @returns boolean
 */
export const hasPermissionTo = async (user, permission) => {
  if (!permission || permission === 'undefined') {
    return false;
  }
  return await hasPermissionThroughRole(user, permission) || hasPermission(user, permission);
};

/**
 * Create new token.
 * @param {object} user
 * @param {string} deviceName
 * @returns object
 */
export const newToken = async (user, deviceName = 'Web FE') => {
  const plainTextToken = randtoken.generate(40);

  const token = await user.createToken({
    name: deviceName,
    token: hash(plainTextToken),
  });

  return {
    accessToken: token,
    plainTextToken: `${token.id}|${plainTextToken}`,
  };
};
