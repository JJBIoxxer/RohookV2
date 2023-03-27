const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, Colors } = require("discord.js");

const humanizeDuration = require('humanize-duration');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Replies with how long the bot has been running.'),
    async execute(interaction) {
        const { client } = interaction;

        const embed = new EmbedBuilder()
            .setColor(Colors.Blurple)
            .setTitle('Uptime')
            .setDescription(
                humanizeDuration(
                    Date.now() - process.env.STARTED_AT,
                    { units: ['d', 'h', 'm', 's', 'ms'], round: true }
                )
            )
            .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};