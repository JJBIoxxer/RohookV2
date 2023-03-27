const errorCodes = require('./errorCodes');
const statusCodes = require('./statusCodes');
const messages = require('./messages');

const getMessage = (code, message) => {
    if (!code in errorCodes) throw new Error(`"${code}" is not a valid RohookErrorCode.`);
    if (typeof message === 'string') return message;

    message = messages[code];

    if (!message) throw new Error(`There isn't a message associated with the RohookErrorCode "${code}".`);

    return message;
}

const getHttpStatus = (code) => {
    if (!code in statusCodes) throw new Error(`There isn't an HTTP status accociated with the RohookErrorCode "${code}".`);
    return statusCodes[code];
}

module.exports = class RohookError extends Error {
    constructor(code, message) {
        super(getMessage(code, message));

        this.code = code;

        const status = getHttpStatus(code);

        this.statusCode = status.statusCode;
        this.statusMessage = status.statusMessage;

        Error.captureStackTrace(this, this.constructor);
    }

    toString() {
        return `RohookError.ErrorCodes.${this.code}`
    }
}