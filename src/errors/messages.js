const RohookErrorCodes = require('./errorCodes');

module.exports = {
    [RohookErrorCodes.BadRequest]: '400: Bad Request',
    [RohookErrorCodes.Unauthorized]: '401: Unauthorized',
    [RohookErrorCodes.Forbidden]: '403: Forbidden',
    [RohookErrorCodes.NotFound]: '404: Not Found',
    [RohookErrorCodes.MethodNotAllowed]: '405: Method Not Allowed',
    [RohookErrorCodes.Gone]: '410: Gone',
    [RohookErrorCodes.Teapot]: '418: I\'m a teapot',
    [RohookErrorCodes.TooManyRequests]: '429: Too Many Requests',
    [RohookErrorCodes.InternalServerError]: '500: Internal Server Error',

    [RohookErrorCodes.MissingRohookAuthToken]: 'Missing required "X-API-KEY" header.',
    [RohookErrorCodes.InvalidRohookAuthToken]: 'The provided token is not a valid RohookAuthToken.',

    [RohookErrorCodes.AccessDeniedGuildBanned]: 'Access Denied: Your guild and all associated users and games have been banned for misuse of the RohookV2 API.'
};