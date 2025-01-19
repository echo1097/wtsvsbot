const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clanpcr')
        .setDescription('clan pcr'),

    async execute(interaction) {
        await interaction.deferReply();
        const url = `https://warthunder.com/en/community/claninfo/We%20Got%20Baking%20Soda`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Cache-Control': 'max-age=0',
                    'Connection': 'keep-alive',
                    'DNT': '1'
                },
                decompress: true,
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            });

            if (!response.data) {
                throw new Error('no data received from website');
            }
            
            const $ = cheerio.load(response.data);
            const players = [];
            
            const clanPCR = parseInt($('.squadrons-counter__value').text().trim());
            if (!clanPCR) {
                throw new Error('wensbsitst sturcture changed ping echo');
            }
            
            const table = $('.squadrons-members__table');
            if (!table.length) {
                throw new Error('websiter structure changed ping echo');
            }

            table.find('a[href*="/community/userinfo"]').each((idx, elem) => {
                const name = $(elem).text().trim().replace(/[*_~`]/g, '\\$&');
                const userDiv = $(elem).closest('.squadrons-members__grid-item');
                const scoreDiv = userDiv.next('.squadrons-members__grid-item');
                const scoreText = scoreDiv.text().trim();
                const pcr = parseInt(scoreText.replace(/,/g, ''));

                if (name && !isNaN(pcr) && pcr > 0) {
                    players.push({ name, pcr });
                }
            });

            if (players.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setDescription('error no ppl found ');
                return await interaction.editReply({ embeds: [embed] });
            }

            players.sort((a, b) => b.pcr - a.pcr);

            const embedsToSend = [];
            let currentEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`=SADAF= We Got Baking Soda | Total Points - ${clanPCR.toLocaleString()}`);

            let description = '';
            let characterCount = 0;

            for (const player of players) {
                const line = `${player.name} - ${player.pcr.toLocaleString()}\n`;
                
                if (characterCount + line.length > 4000) {
                    currentEmbed.setDescription(description);
                    embedsToSend.push(currentEmbed);
                    
                    currentEmbed = new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setTitle(`Total Points - ${clanPCR.toLocaleString()}`);
                    description = line;
                    characterCount = line.length;
                } else {
                    description += line;
                    characterCount += line.length;
                }
            }

            if (description.length > 0) {
                currentEmbed.setDescription(description);
                embedsToSend.push(currentEmbed);
            }

            await interaction.editReply({ embeds: embedsToSend });

        } catch (error) {
            console.error('Error:', error);
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`Error: ${error.message || 'failed to get data'}`);
            await interaction.editReply({ embeds: [embed] });
        }
    },
};
