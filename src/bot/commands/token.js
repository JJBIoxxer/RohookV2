const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

const Guilds = require('../../services/Guilds');

async function onConfirm(interaction) {
    const { user: clientUser } = interaction.client;

    const embed = new EmbedBuilder()
        .setColor(Colors.Blurple)
        .setFooter({ text: clientUser.tag, iconURL: clientUser.avatarURL() })
        .setTimestamp();

    try {
        let document = await Guilds.get(interaction.guildId);

        if (!document) throw new Error(`There doesn't appear to be any data saved for guild ${interaction.guildId}.`);

        document.token = uuidv4();

        await document.save().then(savedDocument => {
            embed
                .setTitle('Token')
                .setDescription(`\`${savedDocument.token}\``);
        });
    } catch (error) {
        embed.setDescription(`Unexpected error occurred while resetting your token.\nError: ${error.message}`);
        console.log(`❌ Unexpected error occurred while resetting the token for "${interaction.guildId}".\n📄 Error: ${error.message}`);
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

const onCancel = async (interaction) => interaction.deferUpdate();

module.exports = {
    developerTool: true,
    data: new SlashCommandBuilder()
        .setName('token')
        .setDescription('Generates a new auth token for you to use in your game.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Are you sure you want to reset your token?')
            .setDescription('Resetting your token will invalidate your previous token.')
            .setColor(Colors.Blurple);

        const row = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
            );

        const prompt = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const filter = i => i.customId === 'confirm' || i.customId === 'cancel' && i.user.id === interaction.user.id;
        await prompt.awaitMessageComponent({ filter, time: 15000 })
            .then(async (i) => {
                await interaction.deleteReply();
                return i.customId == 'confirm' && onConfirm(i) || onCancel(i);
            })
            .catch(error => {
                interaction.followUp({ content: 'Interaction time out, please try again.', ephemeral: true });
                interaction.deleteReply();
            });
    }
}