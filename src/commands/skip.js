const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class skip extends Command {

    constructor(client) {
        super(client, {
            name: "skip",
            description: "Skips current Track.",
            usage: "skip",
            enabled: true,
            aliases: ["sk", "next", "forward"]
        })
    }

    async run(message, args, Eris) {
        const voiceChannel = message.member.voiceState;
        if(!voiceChannel.channelID) return message.channel.createMessage(`${this.client.emojis.cross} | You must be in a Voice Channel to use \`${this.help.name}\` command.`);
        const queue = this.client.music.getQueue(message.channel.guild);
        if(!queue) return message.channel.createMessage(`${this.client.emojis.cross} | Nothing is playing to use \`${this.help.name}\` command.`);
        this.client.music.skip(message.channel.guild);
        return;
    }

}

module.exports = skip;