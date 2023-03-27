const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Replies with information about the current guild.'),
    async execute(interaction) {
        const { client, guild } = interaction;
        const { createdTimestamp, ownerId, description, members, memberCount } = guild;

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setDescription(description)
            .setThumbnail(guild.iconURL())
            .setFields(
                { name: '\u200b', value: `**${client.emojis.cache.get('1088974214633103401')} \u200b General:**` },
                { name: 'Owner', value: `<@${ownerId}>`, inline: true },
                { name: 'Created', value: `<t:${Math.round(createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Guild ID', value: guild.id, inline: true },

                { name: '\u200b', value: `**${client.emojis.cache.get('1088974215903985734')} \u200b Users:**` },
                { name: 'Members', value: `${members.cache.filter(m => !m.user.bot).size}`, inline: true },
                { name: 'Bots', value: `${members.cache.filter(m => m.user.bot).size}`, inline: true },
                { name: 'Total', value: `${memberCount}`, inline: true },

                { name: '\u200b', value: `**${client.emojis.cache.get('1088691801457688616')} \u200b Nitro Stats:**` },
                { name: 'Tier', value: `${guild.premiumTier}`, inline: true },
                { name: 'Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true },
                { name: 'Boosters', value: `${members.cache.filter(m => m.premiumSince).size}`, inline: true },
            )
            .setColor(Colors.Blurple)
            .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};