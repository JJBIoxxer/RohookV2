const RohookErrorCodes = require('./errorCodes');

const statusMessages = {
    [400]: 'Bad Request',
    [401]: 'Unauthorized',
    [403]: 'Forbidden',
    [404]: 'Not Found',
    [405]: 'MethodNotAllowed',
    [410]: 'Gone',
    [429]: 'Too Many Requests',
    [500]: 'Internal Server Error'
};

const get = (statusCode) => { return {statusCode, statusMessage: statusMessages[statusCode]} };

module.exports = {
    [RohookErrorCodes.BadRequest]: get(400),
    [RohookErrorCodes.Unauthorized]: get(401),
    [RohookErrorCodes.Forbidden]: get(403),
    [RohookErrorCodes.NotFound]: get(404),
    [RohookErrorCodes.MethodNotAllowed]: get(405),
    [RohookErrorCodes.Gone]: get(410),
    [RohookErrorCodes.TooManyRequests]: get(429),
    [RohookErrorCodes.InternalServerError]: get(500),

    [RohookErrorCodes.MissingRohookAuthToken]: get(401),
    [RohookErrorCodes.InvalidRohookAuthToken]: get(401),

    [RohookErrorCodes.AccessDeniedGuildBanned]: get(403)
};