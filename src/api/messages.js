const express = require('express');

const client = require('../bot');
const RohookError = require('../errors');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const { channel } = res.locals;
    const latestMessages = await channel.messages.fetch({ limit: 100 });

    if (!latestMessages) return next(new RohookError('InternalServerError'));
    
    res.status(200).json({ total: latestMessages.size, data: latestMessages });
});

router.get('/:messageId', findMessage, async (req, res, next) => res.status(200).json(res.locals.message));

router.delete('/:messageId', findMessage, async (req, res, next) => {
    const { message } = res.locals;

    try {
        await message.delete();
        res.status(200).send();
    } catch (error) {
        return next(new RohookError('InternalServerError'));
    }
});

router.post('/:messageId/reply', findMessage, async (req, res, next) => {
    const { message } = res.locals;
    
    try {
        const reply = await message.reply(req.body);
        res.status(200).json(reply);
    } catch (error) {
        return next(new RohookError('BadRequest'));
    }
});

async function findMessage(req, res, next) {
    const { messageId } = req.params;
    const { channel } = res.locals;

    try {
        const message = await channel.messages.fetch(messageId);
        res.locals.message = message;
    } catch (error) {
        return next(new RohookError('NotFound'));
    }

    next();
}

module.exports = { path: '/messages', router };