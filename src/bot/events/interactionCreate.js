const { Events, InteractionType, EmbedBuilder, Colors } = require('discord.js');
const humanizeDuration = require('humanize-duration');

const Guilds = require('../../services/Guilds');

module.exports = {

    name: Events.InteractionCreate,
    async execute(interaction) {
        const { client } = interaction;

        if (interaction.user.bot) return;
        if (interaction.type !== InteractionType.ApplicationCommand) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return await interaction.reply(`No command matching ${interaction.commandName} was found.`);
        if (command.creatorOnly && interaction.user.id !== process.env.CREATOR_ID) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle('Permission Error')
                .setDescription(`The \`/${interaction.commandName}\` command can only be used by <@${process.env.CREATOR_ID}>.`)
                .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
                .setTimestamp();

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let document = await Guilds.get(interaction.guildId);

        if (!document) document = await Guilds.create({ guildId: interaction.guildId });
        if (!document.userIds.includes(interaction.user.id)) document.userIds.push(interaction.user.id);

        if (!command.creatorOnly && !command.developerOnly && command.developerTool && document.isBanned) {
            const { banInfo } = document;

            const timeRemaining = (banInfo.started.getTime() + banInfo.length) - Date.now();

            if (banInfo.isPermanent || timeRemaining > 0) {
                const { user: clientUser } = interaction.client;

                const lengthInDays = banInfo.length / (86400 * 1000);
                const durationString = banInfo.isPermanent ? 'Permanent' : humanizeDuration(timeRemaining, {
                    units: ['d', 'h', 'm', 's'],
                    round: true
                });

                const embed = new EmbedBuilder()
                    .setTitle(banInfo.isPermanent ? 'Permanently Banned' : `Banned for ${lengthInDays} Day${lengthInDays > 1 ? 's' : ''}`)
                    .setDescription('Your guild and all associated users and games have been banned for misuse of the RohookV2 API.')
                    .setFields(
                        { name: 'Reason', value: banInfo.reason, inline: true },
                        { name: 'Time Remaining', value: durationString, inline: true }
                    )
                    .setColor(Colors.Red)
                    .setFooter({ text: clientUser.tag, iconURL: clientUser.avatarURL() })
                    .setTimestamp();

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`CommandExecutionError ->\nUser: ${interaction.user.tag}\nError: ${error}`);

            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle('Error')
                .setDescription(error.message)
                .setFooter({ text: client.user.tag, iconURL: client.user.iconURL() })
                .setTimestamp();

            const body = { embeds: [embed], ephemeral: true };

            return interaction.replied ? await interaction.followUp(body) : await interaction.reply(body);
        }
    }

}