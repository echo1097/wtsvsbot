const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const beforePath = path.join(__dirname, '..', 'data', 'before_data.json');
const afterPath = path.join(__dirname, '..', 'data', 'after_data.json');
const logChannel = 'channel for logs';

function setupFiles() {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    fs.writeFileSync(beforePath, JSON.stringify({}, null, 2));
    fs.writeFileSync(afterPath, JSON.stringify({}, null, 2));
}

async function fetchData() {
    const url = `https://warthunder.com/en/community/claninfo/We%20Got%20Baking%20Soda`;
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'DNT': '1',
                'Referer': 'https://warthunder.com/en/community/clans',
                'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1'
            }
        });
        const $ = cheerio.load(response.data);
        
        const players = {};
        const table = $('.squadrons-members__table');
        
        table.find('a[href*="/community/userinfo"]').each((idx, elem) => {
            const name = $(elem).text().trim();
            const userDiv = $(elem).closest('.squadrons-members__grid-item');
            const scoreDiv = userDiv.next('.squadrons-members__grid-item');
            const score = parseInt(scoreDiv.text().trim());

            if (name && !isNaN(score) && score > 0) {
                players[name] = score;
            }
        });
        
        return players;
    } catch (err) {
        console.error('err:', err);
        return {};
    }
}

async function compareAndSendUpdates(bot, session) {
    try {
        const beforeData = JSON.parse(fs.readFileSync(beforePath, 'utf8'));
        const afterData = JSON.parse(fs.readFileSync(afterPath, 'utf8'));

        const gains = [];
        const losses = [];
        let totalBefore = 0;
        let totalAfter = 0;

        for (const [user, score] of Object.entries(beforeData)) {
            totalBefore += score;
        }

        for (const [user, score] of Object.entries(afterData)) {
            totalAfter += score;
        }

        const totalDelta = totalAfter - totalBefore;

        for (const [user, afterScore] of Object.entries(afterData)) {
            if (beforeData[user] !== undefined) {
                const delta = afterScore - beforeData[user];
                if (delta !== 0) {
                    console.log(`[${session}][${new Date().toLocaleTimeString()}] ${user}: ${beforeData[user]} → ${afterScore} (${delta > 0 ? '+' : ''}${delta})`);
                    
                    const updateText = `${user} ${delta > 0 ? '🔺' : '🔻'} ${Math.abs(delta)} points and has ${afterScore} points`;
                    if (delta > 0) {
                        gains.push(updateText);
                    } else {
                        losses.push(updateText);
                    }
                }
            }
        }

        if (gains.length > 0 || losses.length > 0) {
            try {
                const channel = await bot.channels.fetch(logChannel);
                let description = '';
                
                if (gains.length > 0) {
                    description += '**Points Gained**\n' + gains.join('\n') + '\n\n';
                }
                
                if (losses.length > 0) {
                    description += '**Points Lost**\n' + losses.join('\n');
                }
                
                const embed = new EmbedBuilder()
                    .setColor(totalDelta >= 0 ? 0x00FF00 : 0xFF0000)
                    .setTitle(`${session} Session Update - ${totalDelta >= 0 ? 'Gained' : 'Lost'} ${Math.abs(totalDelta)}`)
                    .setDescription(description);
                
                await channel.send({ embeds: [embed] });
            } catch (err) {
                console.error('err:', err);
            }
        }
        
        fs.writeFileSync(beforePath, JSON.stringify({}, null, 2));
        fs.writeFileSync(afterPath, JSON.stringify({}, null, 2));
    } catch (err) {
        console.error('err:', err);
    }
}

async function startTracker(bot) {
    setupFiles();
    console.log('PCR tracker started');
    
    setInterval(async () => {
        const now = new Date();
        const pstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
        const hours = pstTime.getHours();
        const minutes = pstTime.getMinutes();
        
        if (hours === 6 && minutes === 0) {
            const data = await fetchData();
            if (Object.keys(data).length > 0) {
                fs.writeFileSync(beforePath, JSON.stringify(data, null, 2));
                console.log('saved EU start pts');
            }
        }
        
        if (hours === 14 && minutes === 15) {
            const data = await fetchData();
            if (Object.keys(data).length > 0) {
                fs.writeFileSync(afterPath, JSON.stringify(data, null, 2));
                console.log('saved EU end pts');
                await compareAndSendUpdates(bot, 'EU');
            }
        }
        
        if (hours === 17 && minutes === 0) {
            const data = await fetchData();
            if (Object.keys(data).length > 0) {
                fs.writeFileSync(beforePath, JSON.stringify(data, null, 2));
                console.log('saved US start pts');
            }
        }
        
        if (hours === 23 && minutes === 15) {
            const data = await fetchData();
            if (Object.keys(data).length > 0) {
                fs.writeFileSync(afterPath, JSON.stringify(data, null, 2));
                console.log('saved US end pts');
                await compareAndSendUpdates(bot, 'US');
            }
        }
    }, 60000);
}

module.exports = {
    name: 'ready',
    once: true,
    async execute(bot) {
        await startTracker(bot);
    }
};