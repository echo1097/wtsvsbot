const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('grab response time'),
  async execute(interaction) {

    const start = Date.now();

    const embed = new EmbedBuilder()
      .setTitle('ping')
      .setColor('#5865F2');

    await interaction.reply({ 
      embeds: [embed], 
      flags: MessageFlags.Ephemeral 
    });

    const responseTime = Date.now() - start;

    embed.setDescription(`${responseTime}ms`);

    await interaction.editReply({ embeds: [embed] });
  },
};
