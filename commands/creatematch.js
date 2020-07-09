const Discord = require('discord.js');
const usersDB = require('./../base/user.js');
const clubsDB = require('./../base/club.js');
const matchsDB = require('./../base/match.js');
const titleCase = require("./../functions/titleCase.js");

module.exports.run = async(client, message, args) => {
  message.channel.bulkDelete(1);
  let matchDB = await matchsDB.findOne( { hostname: message.author.id } );
  if (matchDB)
    return message.channel.send(`<@${message.author.id}> - Sorry, you have already created a match.`).then(function (message) {
      message.react("❌");
    });
  let msg = await message.channel.send(`<@${message.author.id}> - Please choose a game mode (speed/item).`);
  
  message.channel.awaitMessages(m => m.author.id == message.author.id, {
    max: 1,
    time: 20000
  }).then(collected => {
    let mode = titleCase(collected.first().content);
    if (!mode && mode != 'Speed' && mode != 'Item') {
      message.channel.bulkDelete(2);
      return message.channel.send(`<@${message.author.id}> - Sorry this game mode does not exist.`).then(function (message) {
        message.react("❌");
      });
    }
    message.channel.bulkDelete(1);
    editMsg(msg, `<@${message.author.id}> - Please enter number of slots (ex: 2 = 2 versus 2, maximum 4).`);
    message.channel.awaitMessages(m => m.author.id == message.author.id, {
      max: 1,
      time: 20000
    }).then(collected => {
      let id = Math.floor(Math.random() * Math.floor(10000));
      let slots = collected.first().content;
      if (Number.isInteger(slots) || slots < 0 || slots > 4) {
        message.channel.bulkDelete(2);
        return message.channel.send(`<@${message.author.id}> - Sorry, the number of slots is incorrect.`).then(function (message) {
          message.react("❌");
        });
      }
      message.channel.bulkDelete(2);
      createMatch(id, message.member.user.tag, mode, slots);
      message.channel.send(`<@${message.author.id}> - Thank you, your match has been created. `).then(function (message) {
        message.react("❌");
      });
      publishMatch(message);
      console.log("Match by " + message.member.user.tag + " is now created.");
    }).catch(() => {
      message.channel.bulkDelete(1);
      message.channel.send(`<@${message.author.id}> - No answer after 20 seconds, operation canceled.`).then(function (message) {
        message.react("❌");
      });
    });
  }).catch(() => {
    message.channel.bulkDelete(1);
    message.channel.send(`<@${message.author.id}> - No answer after 20 seconds, operation canceled.`).then(function (message) {
      message.react("❌");
    });
  });
}

async function createMatch(id, host, mode, slots) {
  let matchDB = new matchsDB({
    id: id,
    hostname: host,
    mode: mode,
    slots: slots
  });
  matchDB.players.push(host);
  await matchDB.save().catch(err => console.log(err));
}

async function publishMatch(message) {

}

function editMsg(message, text) {
  message.edit(text)
}

module.exports.help = {
    name: 'creatematch'
}