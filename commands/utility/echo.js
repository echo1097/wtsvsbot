const { SlashCommandBuilder } = require('discord.js');

module.exports = {
 data: new SlashCommandBuilder()
   .setName('echo')
   .setDescription('echos list of exscuses (updated each BR change)'),

 async execute(interaction) {
   await interaction.reply('delay - charlotte - ping - i play ON mac - no teammates - no black t80 skin - meta - ive grinded for 3 hours - no my vehicle - mexican - comp dif - this is NOT my server - wasnt locked in - no help - had 100 ping - i cant with fucking ass servers - my teammates are ass - my enemies are mexicans - i cant feel my hands - no money - no motivation - no friends- MY GAME IS CRASHING - MY TEAMMATES HAVE NO HANDS - stop playing with your toes you fucking retard - IM NOT ON MY TYPE10 - holy R73 - I WAS RELOADING - no more ammo - i was repairing - ofc its my track - he space climbed - russian bias - javascript is autistic - i forgot to deploy commands - i forgot to save the file - “I DONT SPEAK THE LANGUAGE THAT YOU HAVE TO SPEND $80,000 A YEAR AT HARVARD TO LEARN”');
 }
};