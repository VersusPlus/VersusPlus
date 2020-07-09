const Discord = require('discord.js');
const mongoose = require("mongoose");
const clubsDB = require("./../base/club.js");
const usersDB = require("./../base/user.js");

module.exports.run = async(client, message, args) => {
  message.channel.bulkDelete(1);
    let userDB = await usersDB.findOne( { username: message.member.user.tag } );
    if (userDB.club === "none")
      return message.channel.send(`<@${message.author.id}> - You don't have a club.`).then(function (message) {
        message.react("❌");
      });
    let clubDB = await clubsDB.findOne( { name: userDB.club } );
    clubDB.members.pop(message.member.user.tag);
    await clubDB.save().catch(err => console.log(err));
    userDB.club = "none";
    await userDB.save().catch(err => console.log(err));
    message.channel.send(`<@${message.author.id}> - Congratulations, you have left the club.`).then(function (message) {
      message.react("❌");
    });
}

module.exports.help = {
    name: 'leaveclub'
}