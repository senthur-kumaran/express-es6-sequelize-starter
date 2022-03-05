import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import statusCode from '../utils/statusCode';

const { User } = model;

export default {
  /**
   * Get all users.
   * @param {object} req
   * @param {object} res
   * @returns {object}
   */
  async users(req, res) {
    try {
      return sendSuccessResponse(res, statusCode.CREATED, await User.findAll(), 'All registered users');
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

  /**
   * Access the admin dashboard.
   * @param {object} req
   * @param {object} res
   * @returns {object}
   */
  async dashboard(req, res) {
    try {
      return sendSuccessResponse(res, 200, '', 'Admin dashboard access allowed.');
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
};
