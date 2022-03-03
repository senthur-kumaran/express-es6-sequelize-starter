import { Op } from 'sequelize';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import { hash, hashCompare } from '../utils/hashing';
import constants from '../utils/constants';
import statusCode from '../utils/statusCode';

const { User, Role } = model;

export default {
  async signUp(req, res) {
    const {
      email, password, name, phone,
    } = req.body;
    try {
      let user = await User.findOne({ where: { [Op.or]: [{ phone }, { email }] } });
      if (user) {
        return sendErrorResponse(res, statusCode.UNPROCESSABLE_ENTITY, 'User with that email or phone already exists');
      }
      const settings = {
        notification: {
          push: true,
          email: true,
        },
      };
      user = await User.create({
        name,
        email,
        password: hash(password),
        phone,
        settings,
      });

      const userRole = await Role.findOne({ where: { name: constants.ROLE_AUTHENTICATED } });
      user.addRole(userRole);

      return sendSuccessResponse(res, statusCode.CREATED, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }, 'Account created successfully');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        statusCode.INTERNAL_SERVER_ERROR,
        'Could not perform operation at this time, kindly try again later.',
        e,
      );
    }
  },

  async login(req, res) {
    const { login, password } = req.body;

    try {
      const user = await User.findOne({ where: { email: login } });

      if (!user) {
        return sendErrorResponse(res, statusCode.NOT_FOUND, 'Incorrect login credentials. Kindly check and try again');
      }
      const checkPassword = hashCompare(hash(password), user.password);
      if (!checkPassword) {
        return sendErrorResponse(
          res,
          statusCode.BAD_REQUEST,
          'Incorrect login credentials. Kindly check and try again',
        );
      }

      if (user.status !== 'active') {
        return sendErrorResponse(res, statusCode.UNAUTHORIZED, 'Your account has been suspended. Contact admin');
      }

      const token = await user.newToken();
      return sendSuccessResponse(res, statusCode.OK, {
        token: token.plainTextToken,
        user: {
          name: user.name,
          id: user.id,
          email: user.email,
        },
      }, 'Login successfully');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        statusCode.INTERNAL_SERVER_ERROR,
        'Server error, contact admin to resolve issue',
        e,
      );
    }
  },
};
