const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class bassboost extends Command {

    constructor(client) {
        super(client, {
            name: "bassboost",
            description: "Toggles Bassboost.",
            usage: "bassboost <on/off>",
            enabled: true,
            aliases: ["bb", "bass"]
        })
    }

    async run(message, args, Eris) {
        const voiceChannel = message.member.voiceState;
        if(!voiceChannel.channelID) return message.channel.createMessage(`${this.client.emojis.cross} | You must be in a Voice Channel to use \`${this.help.name}\` command.`);
        const queue = this.client.music.getQueue(message.channel.guild);
        if(!queue) return message.channel.createMessage(`${this.client.emojis.cross} | Nothing is playing to use \`${this.help.name}\` command.`);
        if(!args[0]) return message.channel.createMessage(`${this.client.emojis.music} | Bassboost is currently **${queue.bassboost ? "Enabled" : "Disabled"}**.`);
        if(args[0].toLowerCase() == "off") {
            if(this.client.music.getBassboost(message.channel.guild) == false) return message.channel.createMessage(`${this.client.emojis.tick} | Bassboost is already **Disabled**.`);
            this.client.music.setBassboost(message.channel.guild, false);
            message.channel.createMessage(`${this.client.emojis.tick} | Bassboost will be **Disabled** from Next Song.`);
            return;
        }
        if(args[0].toLowerCase() == "on") {
            if(this.client.music.getBassboost(message.channel.guild) == true) return message.channel.createMessage(`${this.client.emojis.tick} | Bassboost is already **Enabled**.`);
            this.client.music.setBassboost(message.channel.guild, true);
            message.channel.createMessage(`${this.client.emojis.tick} | Bassboost will be **Enabled** from Next Song.`);
            return;
        }
    }

}

module.exports = bassboost;