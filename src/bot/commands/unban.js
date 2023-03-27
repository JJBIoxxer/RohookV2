const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');

const Guilds = require('../../services/Guilds');

module.exports = {
    developerOnly: true,
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Bans a guild and all associated games and users from using the RohookV2 API.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('guild_id')
            .setDescription('The ID of the guild you want to ban.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const { user: clientUser } = interaction.client;

        const guildId = interaction.options.getString('guild_id');
        const document = await Guilds.get(guildId);

        try {
            await document.unban();

            const embed = new EmbedBuilder()
                .setTitle('Guild Unbanned')
                .setDescription(`The guild \`${guildId}\` was unbanned.`)
                .setColor(Colors.Green)
                .setFooter({ text: clientUser.tag, iconURL: clientUser.avatarURL() })
                .setTimestamp();

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        catch (error) {
            return await interaction.reply({ content: `❌ **Error:** ${error.message}`, ephemeral: true });
        }
    }
};