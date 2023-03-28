const RohookError = require('../errors');

module.exports = (req, res, next) => { if (!req.route) return next(new RohookError('NotFound')) };