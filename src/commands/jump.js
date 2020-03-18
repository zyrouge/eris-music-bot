const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class jump extends Command {

    constructor(client) {
        super(client, {
            name: "jump",
            description: "Jumps specified Track from the Queue.",
            usage: "jump <position>",
            enabled: true,
            aliases: ["ju", "goto"]
        })
    }

    async run(message, args, Eris) {
        const voiceChannel = message.member.voiceState;
        if(!voiceChannel.channelID) return message.channel.createMessage(`${this.client.emojis.cross} | You must be in a Voice Channel to use \`${this.help.name}\` command.`);
        const queue = this.client.music.getQueue(message.channel.guild);
        if(!queue) return message.channel.createMessage(`${this.client.emojis.cross} | Nothing is playing to use \`${this.help.name}\` command.`);
        const position = (args[0] && (isNaN(args[0]) == false)) ? parseInt(args[0]) - 1: false;
        if(!position || (position && position < 0)) return message.channel.createMessage(`${this.client.emojis.cross} | Specify the Song Number to jump.`);
        if(position > this.client.music.getQueue(message.channel.guild).songs.length) return message.channel.createMessage(`${this.client.emojis.cross} | Specified the Song Number doesn\'t Exist.`);
        this.client.music.jump(message.channel.guild, position);
    }

}

module.exports = jump;