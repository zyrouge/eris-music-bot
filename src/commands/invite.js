const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class invite extends Command {

    constructor(client) {
        super(client, {
            name: "invite",
            description: "Sends Bot Invite Link.",
            usage: "invite",
            enabled: true,
            aliases: []
        })
    }

    async run(message, args, Eris) {
        this.client.createMessage(message.channel.id, `${this.client.emojis.headphones} | My Invite Link: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=66575680`);
    }

}

module.exports = invite;
