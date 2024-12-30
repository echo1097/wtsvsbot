const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goat')
    .setDescription('those who know'),
    
  async execute(interaction) {
    await interaction.deferReply();
    
    const goatsPath = path.join(__dirname, '..', 'assets', 'goats');
    const goatFiles = fs.readdirSync(goatsPath).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.gif')
    );
    
    if (goatFiles.length === 0) {
      return interaction.editReply('no🐐');
    }
    
    const randomGoat = goatFiles[Math.floor(Math.random() * goatFiles.length)];
    const goatPath = path.join(goatsPath, randomGoat);
    
    await interaction.editReply({
      content: '🐐',
      files: [goatPath]
    });
  }
};