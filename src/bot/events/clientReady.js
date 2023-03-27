const { Events } = require('discord.js');

module.exports = {
    once: true,
    name: Events.ClientReady,
    execute(client) { console.log(`👤 Logged in as ${client.user.tag}\n`) }
}