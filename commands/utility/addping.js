const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('optin')
        .setDescription('start svs pings'),
    async execute(interaction) {
        const role = interaction.guild.roles.cache.get('roleid');
        
        if (interaction.member.roles.cache.has('roleid')) {
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setDescription('you already have the role');
                
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        
        await interaction.member.roles.add(role);
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription('added role - `/optout` to remove');
            
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};