const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('optin')
        .setDescription('start SVS pings'),
    async execute(interaction) {
        const role = interaction.guild.roles.cache.get('roleid');

        if (!role) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription('role doesnt exist/improper roldid passed check the files (addping.js)');

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            return;
        }

        if (interaction.member.roles.cache.has('roleid')) {
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setDescription('you already have the role');

            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
            return;
        }

        await interaction.member.roles.add(role);
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription('added role - `/optout` to remove');

        await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
    },
};
