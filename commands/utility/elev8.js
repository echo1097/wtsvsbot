const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('elev8')
    .setDescription('what happened to elev8'),

  async execute(interaction) {
    await interaction.reply({
      files: ['https://i.imgur.com/HaI2hPu.gif']
    });
  }
};