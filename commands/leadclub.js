const Discord = require('discord.js');
const clubsDB = require("./../base/club.js");

module.exports.run = async(client, message, args) => {
  message.channel.bulkDelete(1);
    const clubs = await clubsDB.find({});
    sortClub(clubs);
    let msg = '```';
    let i = 0;
    while (clubs[i]) {
      let nb = clubs[i].members.length;
      const str = `${i+1}# | [${clubs[i].tag}] ${clubs[i].name} | ${clubs[i].elo} points | ${nb} members`;
      msg = msg.concat('\n', str);
      i++;
    }
    msg = msg.concat('```');
    message.channel.send(msg).then(function (message) {
      message.react("❌");
    });
}

function sortClub(clubs) {
  clubs.sort(function(a, b){return b.elo - a.elo});
  return clubs;
}

module.exports.help = {
    name: 'leadclub'
}