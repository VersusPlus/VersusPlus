const Discord = require('discord.js');
const clubsDB = require("./../base/club.js");
const usersDB = require("./../base/user.js");
const titleCase = require("./../functions/titleCase.js");

module.exports.run = async(client, message, args) => {
  message.channel.bulkDelete(1);
  let clubName = String(args).replace(/,/g, " ");
  clubName = titleCase(clubName);
  let clubDB;
  if (!clubName)
    return message.channel.send(`<@${message.author.id}> - Please enter a club name.`).then(function (message) {
      message.react("❌");
    });
  else if (clubName)
    clubDB = await clubsDB.findOne( {$or: [{ name: clubName }, { tag: clubName.toUpperCase() }]} );
  else
    return message.channel.send(`<@${message.author.id}> - Club not found.`).then(function (message) {
      message.react("❌");
    });

  if (clubDB)
  {
    let i = 0;
    var clubElo = 0;
    while (clubDB.members[i]) {
      let userDB = await usersDB.findOne( { username: clubDB.members[i] } );
      clubElo += userDB.elo;
      i++;
    }
    clubElo = clubElo / i;
    clubDB.elo = clubElo;
    await clubDB.save().catch(err => console.log(err));
    const clubEmbed = new Discord.MessageEmbed()
      .setColor('#FF2146')
      .setTitle(clubDB.name)
      .setAuthor('Versus+', 'https://cdn.discordapp.com/avatars/727325699525836871/91aa21afcd650ceaa194b7192b8730b1.png')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Club Tag:', value: clubDB.tag, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Elo Rank:', value: clubDB.elo, inline: true },
        { name: 'Members:', value: clubDB.members, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },          
      )
    .setThumbnail(clubDB.logo);
        
    message.channel.send(clubEmbed).then(function (message) {
      message.react("❌");
    });
  }
  else
    message.channel.send(`<@${message.author.id}> - Club not found.`).then(function (message) {
      message.react("❌");
    });
}

module.exports.help = {
    name: 'club'
}