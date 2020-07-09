const Discord = require('discord.js');
const matchsDB = require('./../base/match.js');

module.exports.run = async(client, message, args) => {
  var interval = setInterval (async function () {
  let matchDB = await matchsDB.find({});
  let size = matchDB.length;
  let i = 0;
  message.channel.bulkDelete(size);
  while (matchDB[i]) {
      const matchEmbed = new Discord.MessageEmbed()
        .setColor('#FF2146')
        .setTitle(`Match ${matchDB[i].id}`)
        .setAuthor('Versus+', 'https://cdn.discordapp.com/avatars/727325699525836871/91aa21afcd650ceaa194b7192b8730b1.png')
        .addFields(
          { name: 'Game mode:', value: matchDB[i].mode, inline: true },
          { name: 'Slots:', value: matchDB[i].slots, inline: true },
          { name: 'Time left:', value: "5min", inline: true },
          { name: 'Roster:', value: matchDB[i].players, inline: true },
        );
      message.channel.send(matchEmbed);
      i++;
    }
  }, 30000);
}

function sort(match) {
  match.sort(function(a, b){return b.createdAt - a.createdAt});
  return match;
}

module.exports.help = {
    name: 'match'
}