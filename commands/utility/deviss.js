const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deviss')
    .setDescription('devistated'),
    
  async execute(interaction) {
    await interaction.deferReply();
    
    const folderPath = path.join(__dirname, '..', 'assets', 'deviss');
    const devissFiles = fs.readdirSync(folderPath).filter(file => 
      file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.png')
    );
    
    if (devissFiles.length === 0) {
      return interaction.editReply('no memes');
    }
    
    const randomDeviss = devissFiles[Math.floor(Math.random() * devissFiles.length)];
    const filePath = path.join(folderPath, randomDeviss);
    
    await interaction.editReply({
      files: [filePath]
    });
  }
};
