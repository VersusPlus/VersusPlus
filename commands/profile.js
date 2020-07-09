const Discord = require('discord.js');
const usersDB = require("./../base/user.js");

module.exports.run = async(client, message, args) => {
  message.channel.bulkDelete(1);
  let userDB;
  if (!args[0])
    userDB = await usersDB.findOne( { id: message.author.id } );
  else if (args[0].match(/\d+/))
    userDB = await usersDB.findOne( { id: args[0].match(/\d+/) } );
  else if (args[0] && isNaN(args[0].match(/\d+/)))
    return message.channel.send(`<@${message.author.id}> - ${args[0]} player not found.`).then(function (message) {
      message.react("❌");
    });
  else
    return message.channel.send(`<@${message.author.id}> - Player not found.`).then(function (message) {
      message.react("❌");
    });

  if (userDB) {
    let avatarURL;
    let user;
    if (args[0]) {
      user = message.mentions.users.first();
      avatarURL = user.avatarURL();
    }
    else {
      user =  message.author.id;
      avatarURL = message.author.avatarURL();
    }
    const userEmbed = new Discord.MessageEmbed()
      .setColor('#FF2146')
      .setTitle(userDB.username)
      .setAuthor('Versus+', 'https://cdn.discordapp.com/avatars/727325699525836871/91aa21afcd650ceaa194b7192b8730b1.png')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'KartRider Username:', value: userDB.kartrider, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Club:', value: userDB.club, inline: true },
        { name: 'Elo Rank:', value: userDB.elo, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Victory / Defeat:', value: "0 / 0", inline: true },
      )
	    .setThumbnail(avatarURL);
      
    message.channel.send(userEmbed).then(function (message) {
      message.react("❌");
    });
  }
  else
    message.channel.send(`<@${message.author.id}> - Player not found.`).then(function (message) {
      message.react("❌");
    });
}

module.exports.help = {
    name: 'profile'
}