const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tim')
    .setDescription('tim quote'),

  async execute(interaction) {
    await interaction.reply({
      files: ['https://i.imgur.com/Pu0Wj0M.jpeg']
    });
  }
};