const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

const prefix =  process.env.PREFIX;
const chalk = require('chalk');
const fs = require('fs');
const version = "v2.0.2";

const db = require('quick.db');


const resumemonit = require(`./resumemonit`);
///////////////////////////////////////////////////////////////////////////////

client.config = {
    TOKEN: process.env.TOKEN,
    OWNER_ID: process.env.OWNERID,
    PREFIX: process.env.PREFIX
};

exports.config = () => {
    return client.config;
}


client.commands = [];
fs.readdir("./commands/", function(err, files) {
    console.log("--------------------------------------");

    files.forEach(f => {
        const cmd = require(`./commands/${f}`);
        client.commands.push(cmd);
        console.log(chalk.green(cmd.info.name + " -> OK"))
    });
    console.log("--------------------------------------");

});

///////////////////////////////////////////////////////////////////////////////

client.on("ready", () => {



    // var servers = client.guilds.array().map(g => g.name).join(',');

    console.log("--------------------------------------");
    console.log('--> ' + (chalk.yellow('AndroneDev#8964')) + ' \n--> ' + (chalk.green('Connecter avec succès  ')) + ' \n--> ' + (chalk.magenta('Name Bot:              ')) + `[ ${client.user.tag} ]` + ' \n--> ' + (chalk.magenta('Commands:              ')) + `[ ${client.commands.length} ]` + ' \n--> ' + (chalk.magenta('Le préfix actuel:      ')) + `[ ${prefix} ]` + '\n--> ' + (chalk.magenta('Nombre d\'utilisateurs: ')) + `[ ${client.users.size} ]` + '\n--> ' + (chalk.magenta('Nombre salon:          ')) + `[ ${client.channels.size} ]` + '\n--> ' + (chalk.magenta('Nombre de serveurs:    ')) + `[ ${client.guilds.size} ]`);
    console.log("--------------------------------------");
    console.log('--> ' + (chalk.green('Prèt !')));
    console.log('______________________________________');

    client.user.setActivity(`Le web ❤️ | ` + client.config.PREFIX + `help | ` + version + ` || DevShare.xyz ❤️`, {
        type: 'WATCHING'
    });
    resumemonit.execute(client)
});

///////////////////////////////////////////////////////////////////////////////

client.on("message", msg => {
    if (msg.author.client || msg.channel.type != 'text')
        return;
});

client.on("message", async msg => {

    if (!msg.content.startsWith(client.config.PREFIX)) return;
    var args = msg.content.substring(client.config.PREFIX.length).split(" ");
    var cmdName = args[0].toLowerCase();

    client.commands.forEach(command => {
        if (cmdName === command.info.name || command.info.alias.includes(cmdName)) {

            if (command.info.permission == "owner" &&
                msg.author.id != client.config.OWNER_ID) {
                msg.reply("Commande réservée a l'**owner** du bot");
            } else {
                if (command.info.active) {
                    command.execute(client, msg, args);

                } else {
                    msg.reply("Commande desactivé");

                }
            }

        }

    });


});

///////////////////////////////////////////////////////////////////////////////

client.login(client.config.TOKEN);