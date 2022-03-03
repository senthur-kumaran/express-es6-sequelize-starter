import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import statusCode from '../utils/statusCode';

const { User } = model;

export default {
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
};
