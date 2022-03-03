/**
 * Send error response format.
 * @param {object} res
 * @param {number} code
 * @param {string} errorMessage
 * @param {null|string} e
 * @returns {object}
 */
export const sendErrorResponse = (res, code, errorMessage, e = null) => res.status(code).send({
  status: 'error',
  error: errorMessage,
  e: e?.toString(),
});

/**
 * Send success response format.
 * @param {object} res
 * @param {number} code
 * @param {object} data
 * @param {string} message
 * @returns {object}
 */
export const sendSuccessResponse = (res, code, data, message = 'Successful') => res.status(code).send({
  status: 'success',
  data,
  message,
});
