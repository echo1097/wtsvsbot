const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pcr')
        .setDescription('svs points')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('who to look up')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        
        const username = interaction.options.getString('username');
        const url = `https://warthunder.com/en/community/claninfo/We%20Got%20Baking%20Soda`;

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            
            let playerFound = false;
            let playerData = {
                name: '',
                pcr: ''
            };

            const table = $('.squadrons-members__table');
            const players = table.find('.squadrons-members__grid-item');

            players.each((i, el) => {
                const playerText = $(el).text().trim();
                if (playerText.toLowerCase() === username.toLowerCase()) {
                    playerData.name = playerText;
                    
                    let currentElement = $(el);
                    let nextElements = currentElement.nextAll('.squadrons-members__grid-item');
                    
                    nextElements.each((j, next) => {
                        const text = $(next).text().trim();
                        if (!isNaN(text) && text.length > 0) {
                            playerData.pcr = text;
                            playerFound = true;
                            return false;
                        }
                    });
                    return false;
                }
            });

            if (playerFound) {
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setDescription(`${playerData.name}'s SVS points: ${playerData.pcr}`);
                await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(0xFFFF00)
                    .setDescription(`${username} not found in clan.`);
                await interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error:', error);
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription('problem with code');
            await interaction.editReply({ embeds: [embed] });
        }
    },
};