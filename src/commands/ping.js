const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class ping extends Command {

    constructor(client) {
        super(client, {
            name: "ping",
            description: "Shows Bot's Ping to Server.",
            usage: "ping",
            enabled: true,
            aliases: ["pong", "latency"]
        })
    }

    async run(message, args, Eris) {
        this.client.createMessage(message.channel.id, `${this.client.emojis.headphones} | Pong! It took \`\`${message.channel.guild.shard.latency}ms\`\` to go around the Server and \`\`${this.client.shards.get(0).latency}ms\`\` to go around Discord!`);
    }

}

module.exports = ping;