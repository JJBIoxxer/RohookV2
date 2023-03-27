const { SlashCommandBuilder, PermissionFlagsBits, InteractionCollector, EmbedBuilder, Colors } = require("discord.js");
const { v4: uuidv4 } = require('uuid');

const Guilds = require('../../services/Guilds');

const generate = () => Math.random().toString().slice(2, 8);

module.exports = {
    creatorOnly: true,
    data: new SlashCommandBuilder()
        .setName('master')
        .setDescription('Resets the master key. (Requires Authentication)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const { client, channel } = interaction;

        const authCode = generate();
        const creator = client.users.cache.get(process.env.CREATOR_ID);

        await interaction.reply({ content: `I have sent a verification code to <@${creator.id}>. Please send the code here.`, ephemeral: true }).then(async (prompt) => {
            const dmEmbed = new EmbedBuilder()
                .setColor(Colors.Blurple)
                .setTitle('Verification')
                .setDescription(`Your verification code to reset Rohook's master token is \`${authCode}\`.`)
                .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
                .setTimestamp();

            await creator.createDM().then(async (channel) => await channel.send({ embeds: [dmEmbed] }));

            const filter = (m) => m.author.id === interaction.user.id;
            const collector = await channel.createMessageCollector({ filter, max: 1, time: 15000 });

            collector.on('collect', async (response) => {
                const document = await Guilds.get(process.env.DEV_GUILD_ID);

                document.masterToken = uuidv4();

                await document.save().then(async (savedDocument) => {
                    const tokenEmbed = new EmbedBuilder()
                        .setColor(Colors.Blurple)
                        .setTitle('Master Token')
                        .setDescription(`\`${savedDocument.masterToken}\``)
                        .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
                        .setTimestamp();

                    await interaction.followUp({ embeds: [tokenEmbed], ephemeral: true });
                    await response.delete();
                });
            });

            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    await interaction.followUp({ content: 'Interaction time out, please try again.', ephemeral: true });
                    await interaction.deleteReply();
                };
            });
        });
    }
};