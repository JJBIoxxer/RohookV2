const express = require('express');

const client = require('../bot');
const Guilds = require('../services/Guilds');
const RohookError = require('../errors');

const router = express.Router();

router.get('/', isMaster, async (req, res, next) => {
    const body = { total: client.guilds.cache.size };

    if (res.locals.isMaster) body.guilds = client.guilds.cache.toJSON();

    res.status(200).json(body);
});

router.get('/:guildId', findGuild, authenticate, async (req, res, next) => res.status(200).json(res.locals.guild));

router.get('/:guildId/owner', findGuild, authenticate, async (req, res, next) => {
    const { guild } = res.locals;

    try {
        const owner = await guild.members.fetch(guild.ownerId);
        res.status(200).json(owner);
    } catch (error) {
        return next(new RohookError('InternalServerError'))
    }
});

const channelsRoute = require('./channels');
router.use(`/:guildId${channelsRoute.path}`, findGuild, authenticate, channelsRoute.router);

async function findGuild(req, res, next) {
    const document = await Guilds.get(req.params.guildId);

    if (!document) return next(new RohookError('NotFound'));

    const guild = client.guilds.cache.get(document.guildId);

    if (!guild) return next(new RohookError('BadRequest'));

    guild.rohook = { token: document.token, isBanned: document.isBanned };
    res.locals.guild = guild;

    next();
}

async function authenticate(req, res, next) {
    const token = req.headers['x-api-key'];
    const { rohook } = res.locals.guild;

    const document = await Guilds.get(process.env.DEV_GUILD_ID);

    if (!document) return next(new RohookError('InternalServerError'));

    if (!token) return next(new RohookError('MissingRohookAuthToken'));
    if (token !== rohook.token || token !== document.masterToken) return next(new RohookError('InvalidRohookAuthToken'));
    if (rohook.isBanned) return next(new RohookError('AccessDeniedGuildBanned'));

    next();
}

async function isMaster(req, res, next) {
    const token = req.headers['x-api-key'];
    const document = await Guilds.get(process.env.DEV_GUILD_ID);

    res.locals.isMaster = token && document && token === document.masterToken;

    next();
}

module.exports = { auto: true, path: '/guilds', router };