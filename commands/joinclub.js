const Discord = require('discord.js');
const mongoose = require("mongoose");
const clubsDB = require("./../base/club.js");
const usersDB = require("./../base/user.js");
const titleCase = require("./../functions/titleCase.js");

module.exports.run = async(client, message, args) => {
  message.channel.bulkDelete(1);
  let clubName = String(args).replace(/,/g, " ");
  let password = getPassword(clubName);
  console.log(password);
  clubName = clubName.substring(0, clubName.lastIndexOf(" "));
  console.log(clubName);
  clubName = titleCase(clubName);
  let clubDB;
  if (!clubName)
    return message.channel.send(`<@${message.author.id}> - Please enter a club name or club tag, ex: !joinclub *club name or tag* *password*.`).then(function (message) {
      message.react("❌");
    });
  else if (clubName)
    clubDB = await clubsDB.findOne( {$or: [{ name: clubName }, { tag: clubName.toUpperCase() }]} );
  else
    return message.channel.send(`<@${message.author.id}> - Club not found.`).then(function (message) {
      message.react("❌");
    });

  if (clubDB){
    let userDB = await usersDB.findOne( { username: message.member.user.tag } );
    let array = clubDB.members;
    if (array)
      if (array.indexOf(message.member.user.tag) > 0)
        return message.channel.send(`<@${message.author.id}> - You are already in this club.`).then(function (message) {
      message.react("❌");
    });
    if (userDB.club != "none")
      return message.channel.send(`<@${message.author.id}> - You are already in other club.`).then(function (message) {
      message.react("❌");
    });
    if (clubDB.password != password)
      return message.channel.send(`<@${message.author.id}> - Invalid password.`).then(function (message) {
      message.react("❌");
    });
    clubDB.members.push(message.member.user.tag);
    await clubDB.save().catch(err => console.log(err));
    userDB.club = clubDB.name;
    await userDB.save().catch(err => console.log(err));
    message.channel.send(`<@${message.author.id}> - Congratulations you have joined the club.`).then(function (message) {
      message.react("❌");
    });
  }
  else
    message.channel.send(`<@${message.author.id}> - Club not found.`).then(function (message) {
      message.react("❌");
    });
}

function getPassword(string) {
    var n = string.split(" ");
    return n[n.length - 1];

}

module.exports.help = {
    name: 'joinclub'
}