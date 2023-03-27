const express = require('express');

const client = require('../bot');
const RohookError = require('../errors');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const { guild } = res.locals;
    const channels = guild.channels.cache;

    res.status(200).json({ total: channels.size, data: channels })
});

router.get('/:channelId', findChannel, async (req, res, next) => res.status(200).json(res.locals.channel));

router.post('/:channelId', findChannel, async (req, res, next) => {
    const { channel } = res.locals;

    try {
        const message = await channel.send(req.body);
        res.status(200).json(message);
    } catch(error) {
        return next(new RohookError('BadRequest', error.message)); 
    };
});

const messagesRoute = require('./messages');
router.use(`/:channelId${messagesRoute.path}`, findChannel, messagesRoute.router);

async function findChannel(req, res, next) {
    const { channelId } = req.params;
    const { guild } = res.locals;
    
    const channel = guild.channels.cache.get(channelId);

    if (!channel) return next(new RohookError('NotFound'));

    res.locals.channel = channel;

    next();
}

module.exports = { path: '/channels', router };