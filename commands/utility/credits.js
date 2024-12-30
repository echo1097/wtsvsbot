const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('contributors'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setDescription('echo, zatone, and swordz made this dumpster fire of a discord bot')
            .setImage('https://i.imgur.com/qcwuFyd.png');
            
        await interaction.reply({ embeds: [embed] });
    },
};