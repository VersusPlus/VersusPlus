const Discord = require('discord.js');

module.exports = (client, message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(!message.content.startsWith(process.env.PREFIX)) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const commande = args.shift();

    const command = client.commands.get(commande);

    if(!command) return;

    command.run(client, message, args);
}
