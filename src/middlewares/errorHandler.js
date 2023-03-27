const RohookError = require('../errors/RohookError');

module.exports = (err, req, res, next) => {
    if (!err instanceof RohookError) {
        const code = RohookError.ErrorCodes.InternalServerError;
        const status = RohookError.StatusCodes[code]; 
        
        err.code = code;
        err.statusCode = status.statusCode;
        err.statusMessage = status.statusMessage; 
    }

    res.status(err.statusCode).json({
        error: {
            code: err.toString(),
            message: err.message,
            statusCode: err.statusCode,
            statusMessage: err.statusMessage
        }
    });
}