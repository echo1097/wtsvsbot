const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('optout')
        .setDescription('stop svs pings'),
    async execute(interaction) {
        const role = interaction.guild.roles.cache.get('roleid');

        if (!role) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription('role doesnt exist/improper roldid passed check the files (removeping.js)');

            await interaction.reply({ 
                embeds: [embed], 
                flags: MessageFlags.Ephemeral 
            });
            return;
        }

        if (!interaction.member.roles.cache.has('roleid')) {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription('you dont have the role');

            await interaction.reply({ 
                embeds: [embed], 
                flags: MessageFlags.Ephemeral 
            });
            return;
        }

        await interaction.member.roles.remove(role);

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setDescription('removed role - `/optin` to add back');

        await interaction.reply({ 
            embeds: [embed], 
            flags: MessageFlags.Ephemeral 
        });
    },
};
