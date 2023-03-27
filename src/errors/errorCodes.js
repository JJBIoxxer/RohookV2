const errorCodes = [
    'BadRequest',
    'Unauthorized',
    'Forbidden',
    'NotFound',
    'MethodNotAllowed',
    'Gone',
    'Teapot',
    'TooManyRequests',
    'InternalServerError',
    
    'MissingRohookAuthToken',
    'InvalidRohookAuthToken',

    'AccessDeniedGuildBanned'
];

module.exports = Object.fromEntries(errorCodes.map(code => [code, code]));