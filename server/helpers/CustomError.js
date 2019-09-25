module.exports = class CustomError extends Error {
  constructor(msg, extra) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'CustomError';

    if (Array.isArray(msg)) {
      this.errors = msg;
    } else {
      this.errors = [{ msg }];
    }

    if (extra) this.extra = extra;
  }
};
