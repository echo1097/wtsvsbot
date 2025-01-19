const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('contributors'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setDescription('echo, zatone, and swordz made this dumpster fire of a discord bot. echo did most of the coding and schizoing. this project is severely autistic and there is random bullshit that im going to eventulally remove per the request of my fellow devs as they sayd "floppy wont want it" and to that i say (i cant legally) finnhsih this sentence its 3 in the morning ima go to vbed edit:i had a dream about installing a virus on my pc and then i woke up abn did a full scan and realized that i was fucking retarded ')
            .setImage('https://i.imgur.com/qcwuFyd.png');
            
        await interaction.reply({ embeds: [embed] });
    },
};
