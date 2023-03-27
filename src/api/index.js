const { readdirSync } = require('fs');
const { join, extname } = require('path');

const RohookError = require('../errors');

const express = require('express');
const router = express.Router();

readdirSync(__dirname).filter(file => extname(file) === '.js' && !file.startsWith('index')).forEach(file => {
    const route = require(join(__dirname, file));
    if (route.auto) router.use(route.path, route.router);
});

router.get('/', (req, res) => res.json({ status: 'OK' }));

router.get('/uptime', (req, res) => res.json({ uptime: Date.now() - process.env.STARTED_AT }));
router.get('/teapot', (req, res, next) => next(new RohookError('Teapot')));

module.exports = router;