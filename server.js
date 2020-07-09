const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require("mongoose");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);


client.on('messageReactionAdd', (reaction, user) => {
  if (user.bot) return;
  if (reaction.emoji.name === "❌") {
    reaction.message.delete()
  }
})

fs.readdir('./events', (err, files) => {
    if(files.length === 0){
        console.log("not events found")
        return
    }
    files.forEach(file => {
        const events = require('./events/' + file)
        const event  = file.split('.')[0]

        client.on(event, events.bind(null, client))
    })
})

fs.readdir('./commands', (err, files) => {
    const commandes = files.filter(file => file.split('.').pop() === 'js')

    if(commandes.length === 0){
        console.log("not command found")
        return
    }

    commandes.forEach(file => {
        let commande = require('./commands/' + file)
        console.log(commande.help.name + ' load !')
        client.commands.set(commande.help.name, commande)
    })
})

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to the Mongodb database.");
}).catch((err) => {
    console.log("Unable to connect to the Mongodb database. Error:"+err);
});

client.login(process.env.TOKEN)
