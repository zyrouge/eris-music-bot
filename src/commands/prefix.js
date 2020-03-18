const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class prefix extends Command {

    constructor(client) {
        super(client, {
            name: "prefix",
            description: "Sets Bot Prefix in Server.",
            usage: "prefix <newprefix>",
            enabled: true,
            aliases: []
        })
    }

    async run(message, args, Eris) {
        if(!args.join(" ")) return message.channel.createMessage(`${this.client.emojis.music} | My Prefix on this Server is \`${this.client.prefix}\``);
        else {
            const newprefix = args[0].trim();
            await this.client.db.set(`prefix_${message.channel.guild.id}`, newprefix);
            return message.channel.createMessage(`${this.client.emojis.tick} | Prefix set to \`${newprefix}\``);
        }
    }

}

module.exports = prefix;
