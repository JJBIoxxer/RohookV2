console.log(`⏰ Starting up ${__filename}\n`);

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const superagent = require('superagent');
const humanizeDuration = require('humanize-duration');

require('dotenv').config();

const db = require('./db');
const client = require('./bot');

const RohookError = require('./errors');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => res.status(200).send(`
    <a href="/invite">Invite Bot</a><br>
    <a href="/support">Join Support Server</a>
`));

app.get('/invite', (req, res) => res.status(304).redirect(process.env.OAUTH2_BOT_INVITE));
app.get('/support', (req, res) => res.status(304).redirect(process.env.DEV_GUILD_INVITE));

app.get('/uptime', (req, res) => res.send(`<!DOCTYPE html>
    <html>
        <head>
            <title>RohookV2 Uptime</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
            <style>
                body {
                    background-color: #242424;
                }
                h3 {
                    color: #ffffff;
                    font-family: 'Roboto';
                }
            </style>
        </head>
        <body>
            <h3><b>${humanizeDuration(
                Date.now() - process.env.STARTED_AT,
                { units: ['d', 'h', 'm', 's', 'ms'], round: true }
            )}</b></h3>
        </body>
    </html>
`));

app.use('/api', require('./api'));

app.use(require('./middlewares/notFoundHandler'));
app.use(require('./middlewares/errorHandler'));

db.init(process.env.MONGO_URI, async () => {
    await client.login(process.env.TOKEN);

    const port = process.env.PORT || 1440;
    app.listen(port, () => {
        console.log(`🔌 Server connected on port ${port}.\n`)
        process.env.STARTED_AT = Date.now();
    });
})