const { CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('thunderskill')
    .setDescription('self explanitory')
    .addStringOption(option =>
      option
        .setName('player')
        .setDescription('player name')
        .setRequired(true)
    ),
  async execute(interaction = CommandInteraction) {
    const playerName = interaction.options.getString('player');
    const formattedName = playerName.replace(/\s+/g, '%20');
    const thunderskillLink = `https://thunderskill.com/en/stat/${formattedName}`;
    await interaction.reply(thunderskillLink);
  },
};