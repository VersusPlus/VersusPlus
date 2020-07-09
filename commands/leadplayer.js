const Discord = require('discord.js');
const usersDB = require("./../base/user.js");

module.exports.run = async(client, message, args) => {
  message.channel.bulkDelete(1);
    const user = await usersDB.find({});
    sortClub(user);
    let msg = '```';
    let i = 0;
    while (user[i]) {
      const str = `${i+1}# | [${user[i].username}] ${user[i].kartrider} | ${user[i].elo} points | ${user[i].club}`;
      msg = msg.concat('\n', str);
      i++;
    }
    msg = msg.concat('```');
    message.channel.send(msg).then(function (message) {
      message.react("❌");
    });
}

function sortClub(users) {
  users.sort(function(a, b){return b.elo - a.elo});
  return users;
}

module.exports.help = {
    name: 'leadplayer'
}