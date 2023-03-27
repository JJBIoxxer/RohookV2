const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Replies with an invite to the official support server.'),
    async execute(interaction) {
        const { client } = interaction;

        const supportGuild = await client.guilds.fetch(process.env.DEV_GUILD_ID);

        if (!supportGuild) throw new Error('Unable to fetch support guild.');

        const embed = new EmbedBuilder()
            .setAuthor({ name: supportGuild.name, iconURL: supportGuild.iconURL() })
            .setDescription(supportGuild.description)
            .setThumbnail(supportGuild.iconURL())
            .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
            .setTimestamp()
            .setColor(Colors.Blurple);

        const row = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                    .setLabel('Join')
                    .setStyle(ButtonStyle.Success)
                    .setURL(process.env.DEV_GUILD_INVITE)
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};