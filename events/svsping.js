const { Client, Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const roleId = 'roleid';
        const channelId = 'channel to log in';
        let euwarn = false;
        let eustart = false;
        let uswarn = false;
        let usstart = false;

        const setBotStatus = (content) => {
            client.user.setActivity(content, { type: ActivityType.Watching });
        };

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

        let toggleStatus = false;

        setInterval(() => {
            const now = new Date();
            const pstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
            const hours = pstTime.getHours();
            const minutes = pstTime.getMinutes();
            const seconds = pstTime.getSeconds();
            const channel = client.channels.cache.get(channelId);

            const resetTriggers = () => {
                if (hours === 0 && minutes === 0) {
                    euwarn = false;
                    eustart = false;
                    uswarn = false;
                    usstart = false;
                }
            };

            let statusContent;
            if (hours >= 6 && hours < 14) {
                const timeLeft = getTimeRemaining(14);
                statusContent = toggleStatus
                    ? `EU SVS`
                    : timeLeft
                    ? `(${timeLeft}) left`
                    : 'EU SVS';
            } else if (hours >= 17 && hours < 23) {
                const timeLeft = getTimeRemaining(23);
                statusContent = toggleStatus
                    ? `US SVS`
                    : timeLeft
                    ? `${timeLeft} left`
                    : 'US SVS';
            } else {
                const nextBracket =
                    hours < 6 ? { time: 6, label: 'EU' } : hours < 17 ? { time: 17, label: 'US' } : { time: 6, label: 'EU' };
                const timeUntilNext = getTimeRemaining(nextBracket.time);
                statusContent = `${timeUntilNext || "soon"} until ${nextBracket.label} SVS`;
            }

            toggleStatus = !toggleStatus;
            setBotStatus(statusContent);

            if (hours === 5 && minutes === 45 && seconds === 1 && !euwarn) {
                channel.send(`<@&${roleId}> EU SQB starts in 15`);
                euwarn = true;
            }
            if (hours === 6 && minutes === 0 && seconds === 1 && !eustart) {
                channel.send(`<@&${roleId}> EU SQB starting`);
                eustart = true;
            }
            if (hours === 16 && minutes === 45 && seconds === 1 && !uswarn) {
                channel.send(`<@&${roleId}> US SQB starts in 15 minutes`);
                uswarn = true;
            }
            if (hours === 17 && minutes === 0 && seconds === 1 && !usstart) {
                channel.send(`<@&${roleId}> US SQB starting`);
                usstart = true;
            }

            resetTriggers();
        }, 15000);

        console.log('pings ready');
    },
};
