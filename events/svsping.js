const { Client, Events } = require('discord.js');
module.exports = {
   name: Events.ClientReady,
   once: true,
   execute(client) {
       const roleId = 'roletoping this is from the addping and removeping';
       const channelId = 'channel to send shit in';
       let euwarn = false;
       let eustart = false;
       let uswarn = false;
       let usstart = false;

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
           }

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
       }, 1000);
       console.log('pings ready');
   },
};