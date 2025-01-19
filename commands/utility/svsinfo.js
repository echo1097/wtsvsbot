const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('svsinfo')
        .setDescription('the name'),
    async execute(interaction) {
        const getTimeRemaining = (targetHour, targetMinute = 0) => {
            const now = new Date();
            const pstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
            const targetTime = new Date(pstTime);
            targetTime.setHours(targetHour, targetMinute, 0, 0);

            const diffMs = targetTime - pstTime;
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const hours = Math.floor(diffMs / (1000 * 60 * 60));

            return diffMs > 0 ? `${hours}h ${minutes}m` : null;
        };

        const now = new Date();
        const pstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
        const hours = pstTime.getHours();

        let bracket = 'Waiting';
        let time = 'N/A';

        if (hours >= 6 && hours < 14) {
            bracket = 'EU';
            time = getTimeRemaining(14) || 'bracket ending soon';
        } else if (hours >= 17 && hours < 23) {
            bracket = 'US';
            time = getTimeRemaining(23) || 'bracket ending soon';
        } else {
            const nextBracket =
                hours < 6 ? { time: 6, label: 'EU' } : hours < 17 ? { time: 17, label: 'US' } : { time: 6, label: 'EU' };
            bracket = 'Waiting';
            time = getTimeRemaining(nextBracket.time) || 'N/A';
        }

        const embed = new EmbedBuilder()
            .setTitle('SVS Info')
            .addFields(
                { name: 'Bracket', value: bracket, inline: true },
                { name: 'Time Left', value: time, inline: true }
            )
            .setColor(0x00FF00)

        await interaction.reply({ embeds: [embed] });
    },
};
