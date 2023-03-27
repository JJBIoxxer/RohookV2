const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes the specified number of messages in the current channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('The amount of messages you want purged.')
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        ),
    async execute(interaction) {
        const { client, channel, options } = interaction;
        const amount = options.getInteger('amount');

        const deletedMessages = await channel.bulkDelete(amount);

        const embed = new EmbedBuilder()
            .setTitle('Purge')
            .setColor(Colors.Blurple)
            .setDescription(`Successfully purged ${deletedMessages.size} message${deletedMessages.size > 1 ? 's' : ''}.`)
            .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};