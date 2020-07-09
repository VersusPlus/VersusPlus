const Discord = require('discord.js');
const mongoose = require("mongoose");
const clubsDB = require("./../base/club.js");
const usersDB = require("./../base/user.js");
const titleCase = require("./../functions/titleCase.js");

module.exports.run = async(client, message, args) => {
  message.channel.bulkDelete(1);
  let clubDB = await clubsDB.findOne( { id: message.author.id } );
  if (clubDB)
    return message.channel.send(`<@${message.author.id}> - Sorry, you have already created a club.`).then(function (message) {
      message.react("❌");
    });
  let userDB = await usersDB.findOne( { id: message.author.id } );
  if (userDB.club != "none")
      return message.channel.send(`<@${message.author.id}> - You are already in other club.`).then(function (message) {
      message.react("❌");
    });
  let msg = await message.channel.send(`<@${message.author.id}> - Please enter the name of your club.`);
  let clubName;
  message.channel.awaitMessages(m => m.author.id == message.author.id, {
    max: 1,
    time: 20000
  }).then(collected => {
    clubName = titleCase(collected.first().content);
    let clubDB = clubsDB.findOne( { name: clubName } );
    if(clubDB.name) {
      message.channel.bulkDelete(2);
      return message.channel.send(`<@${message.author.id}> - Sorry this club name is already taken.`).then(function (message) {
        message.react("❌");
      });
    }
    message.channel.bulkDelete(1);
    editMsg(msg, `<@${message.author.id}> - Please enter your club tag (3 characters maximum).`);
    message.channel.awaitMessages(m => m.author.id == message.author.id, {
      max: 1,
      time: 20000
    }).then(collected => {
      let tag = collected.first().content.toUpperCase();
      if (tag.length > 3) {
        message.channel.bulkDelete(2);
        return message.channel.send(`<@${message.author.id}> - Sorry, your club tag  is too long (3 characters maximum).`).then(function (message) {
          message.react("❌");
        });
      }
      message.channel.bulkDelete(1);
      editMsg(msg, `<@${message.author.id}> - Please enter your password for join the club.`);
      message.channel.awaitMessages(m => m.author.id == message.author.id, {
        max: 1,
        time: 20000
      }).then(collected => {
        saveClub(message.author.id, clubName, tag, message.member.user.tag, collected.first().content);
        message.channel.bulkDelete(2);
        message.channel.send(`<@${message.author.id}> - Thank you, your club has been created. `).then(function (message) {
          message.react("❌");
        });
        console.log("Club " + clubName + " is now created.");
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
  }).catch(() => {
    message.channel.bulkDelete(1);
    message.channel.send(`<@${message.author.id}> - No answer after 20 seconds, operation canceled.`).then(function (message) {
      message.react("❌");
    });
  });
}

async function saveClub(id, name, tag, leader, password) {
  let clubDB = new clubsDB({
    id: id,
    name: name,
    tag: tag,
    leader: leader,
    password: password
  });
  clubDB.members.push(leader);
  await clubDB.save().catch(err => console.log(err));
  let userDB =  await usersDB.findOne( { username: leader } );
  userDB.club = name;
  await userDB.save().catch(err => console.log(err));
}

function editMsg(message, text) {
  message.edit(text)
}

module.exports.help = {
    name: 'createclub'
}