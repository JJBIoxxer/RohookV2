const errorCodes = [
    'BadRequest',
    'Unauthorized',
    'Forbidden',
    'NotFound',
    'MethodNotAllowed',
    'Gone',
    'TooManyRequests',
    'InternalServerError',
    
    'MissingRohookAuthToken',
    'InvalidRohookAuthToken',

    'AccessDeniedGuildBanned'
];

module.exports = Object.fromEntries(errorCodes.map(code => [code, code]));