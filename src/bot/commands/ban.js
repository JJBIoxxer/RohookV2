const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');

const Guilds = require('../../services/Guilds');

module.exports = {
    developerOnly: true,
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a guild and all associated games and users from using the RohookV2 API.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('guild_id')
            .setDescription('The ID of the guild you want to ban.')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('length')
            .setDescription('The length of ban this guild will recieve.')
            .addChoices(
                { name: '1 Day', value: (86400 * 1000) },
                { name: '3 Days', value: (259200 * 1000) },
                { name: '7 Days', value: (604800 * 1000) },
                { name: '14 Days', value: (1209600 * 1000) },
                { name: 'Permanent', value: -1 }
            )
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for banning this guild.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const { user: clientUser } = interaction.client;
        const guildId = interaction.options.getString('guild_id');
        const document = await Guilds.get(guildId);

        if (!document) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`${guildId} isn't a valid guild ID.`)
                .setColor(Colors.Red)
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const length = interaction.options.getInteger('length');
        const reason = interaction.options.getString('reason');

        try {
            const savedDocument = await document.ban(length, reason);

            const lengthInDays = length / (86400 * 1000);

            const embed = new EmbedBuilder()
                .setTitle('Guild Banned')
                .setDescription(`The guild \`${guildId}\` was banned.`)
                .setFields(
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Length', value: `${savedDocument.banInfo.isPermanent ? 'Permanent' : `${lengthInDays} Day${lengthInDays > 1 ? 's' : ''}`}`, inline: true }
                )
                .setColor(Colors.Red)
                .setFooter({ text: clientUser.tag, iconURL: clientUser.avatarURL() })
                .setTimestamp();

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        catch (error) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(error.message)
                .setColor(Colors.Red)
                .setFooter({ text: clientUser.tag, iconURL: clientUser.avatarURL() })
                .setTimestamp();

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};