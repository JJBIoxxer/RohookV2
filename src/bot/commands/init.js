const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, PermissionFlagsBits, Colors } = require("discord.js");

const Guilds = require('../../services/Guilds');

module.exports = {
    developerTool: true,
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Initializes the current guild if it isn\'t already.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const { client, user, guild } = interaction;
        const { ownerId } = guild;

        let document = await Guilds.get(guild.id);

        if (!document) document = await guilds.create({ guildId: guild.id });
        if (!document.userIds.includes(ownerId)) document.userIds.push(ownerId);
        if (!document.userIds.includes(user.id)) document.userIds.push(user.id);

        await document.save();

        const embed = new EmbedBuilder()
            .setTitle('Success!')
            .setColor(Colors.Green)
            .setDescription(`Your guild \`${guild.id}\` was initialized. Run the \`/token\` command to start using the Rohook API. Happy developing!`)
            .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};