const { Events } = require('discord.js');

const Guilds = require('../../services/Guilds');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const { ownerId } = guild;

        let document = await Guilds.get(guild.id);

        if (!document) document = await Guilds.create(guild.id);
        if (!document.userIds.includes(ownerId)) document.userIds.push(ownerId);

        await document.save();
    }
}