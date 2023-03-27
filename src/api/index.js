const { readdirSync } = require('fs');
const { join, extname } = require('path');

const express = require('express');
const router = express.Router();

readdirSync(__dirname).filter(file => extname(file) === '.js' && !file.startsWith('index')).forEach(file => {
    const route = require(join(__dirname, file));
    if (route.auto) router.use(route.path, route.router);
});

router.get('/', (req, res) => res.json({ status: 'OK' }));

module.exports = router;