import { Model } from 'sequelize';
import Random from '../utils/random';
import { hash } from '../utils/hashing';

const PROTECTED_ATTRIBUTES = ['password'];

export default (sequelize, DataTypes) => {
  class User extends Model {
    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your email address',
      },
      unique: {
        args: true,
        msg: 'Email already exists',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address',
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your phone number',
      },
      unique: {
        args: true,
        msg: 'Phone number already exists',
      },
    },
    password: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('inactive', 'active', 'suspended'),
      defaultValue: 'active',
    },
    settings: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'User',
  });

  User.prototype.hasRole = async function hasRole(role) {
    if (!role || role === 'undefined') {
      return false;
    }
    const roles = await this.getRoles();
    return !!roles.map(({ name }) => name)
      .includes(role);
  };

  User.prototype.hasPermission = async function hasPermission(permission) {
    if (!permission || permission === 'undefined') {
      return false;
    }
    const permissions = await this.getPermissions();
    return !!permissions.map(({ name }) => name)
      .includes(permission.name);
  };

  User.prototype.hasPermissionThroughRole = async function hasPermissionThroughRole(permission) {
    if (!permission || permission === 'undefined') {
      return false;
    }
    const roles = await this.getRoles();
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of permission.roles) {
      if (roles.filter((role) => role.name === item.name).length > 0) {
        return true;
      }
    }
    return false;
  };

  User.prototype.hasPermissionTo = async function hasPermissionTo(permission) {
    if (!permission || permission === 'undefined') {
      return false;
    }
    return await this.hasPermissionThroughRole(permission) || this.hasPermission(permission);
  };

  /**
   * Create a new personal access token for the user.
   *
   * @return Object
   * @param device_name
   */
  User.prototype.newToken = async function newToken(deviceName = 'Web FE') {
    const plainTextToken = Random(40);

    const token = await this.createToken({
      name: deviceName,
      token: hash(plainTextToken),
    });

    return {
      accessToken: token,
      plainTextToken: `${token.id}|${plainTextToken}`,
    };
  };

  return User;
};
