console.log(`⏰ Starting up ${__dirname}\\server.js\n`);

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

app.get('/uptime', (req, res) => res.send(
    humanizeDuration(
        Date.now() - process.env.STARTED_AT,
        { units: ['d', 'h', 'm', 's', 'ms'], round: true }
    )
));

app.use('/api', require('./api'));

app.use(require('./middlewares/errorHandler'));

db.init(process.env.MONGO_URI, async () => {
    await client.login(process.env.TOKEN);

    const port = process.env.PORT || 1440;
    app.listen(port, () => {
        console.log(`🔌 Server connected on port ${port}.\n`)
        process.env.STARTED_AT = Date.now();
    });
})