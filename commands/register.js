const Discord = require('discord.js');
const usersDB = require("./../base/user.js");

module.exports.run = async(client, message, args) => {
  //let lastMessageID;
  message.channel.bulkDelete(1);
  console.log();
  let userDB = await usersDB.findOne( { id: message.author.id } );
  if (userDB)
      return message.channel.send(`<@${message.author.id}> - You have already a account.`).then(function (message) {
        message.react("❌");
      });
  message.channel.send(`<@${message.author.id}> - Thanks for joining us, please give me your KartRider nickname:`);
  // Recupére l'ID du message
  /*message.channel.send("Thanks for join us, please give me your KartRider name:").then(msg => {
    lastMessageID = msg.id;
    console.log("Last message ID:" + lastMessageID);
  });*/
  message.channel.awaitMessages(m => m.author.id == message.author.id, {
    max: 1,
    time: 30000
  }).then(collected => {
    saveUser(message.author.id, message.member.user.tag, collected.first().content);
    let member = message.guild.member(message.author);
    let role = message.guild.roles.cache.find(role => role.name === 'Player');
    message.guild.member(member).roles.add(role);
    message.channel.bulkDelete(2);
    message.channel.send(`<@${message.author.id}> - Thank you, you have registered well.`).then(function (message) {
      message.react("❌");
    });
    console.log(message.member.user.tag + " is now registered.");
  }).catch(() => {
    message.channel.bulkDelete(1);
    message.channel.send(`<@${message.author.id}> - No answer after 30 seconds, operation canceled.`).then(function (message) {
      message.react("❌");
    });
  });
}

async function saveUser(id, username, kartrider) {
  let userDB = new usersDB({
    id: id,
    username: username,
    kartrider: kartrider
  });
  await userDB.save().catch(err => console.log(err));
}

function editMsg(message, text) {
  message.edit(text)
}

module.exports.help = {
    name: 'register'
}