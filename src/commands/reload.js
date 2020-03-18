const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class reload extends Command {

    constructor(client) {
        super(client, {
            name: "reload",
            description: "Reloads Specified Command.",
            usage: "reload <cmd>",
            enabled: true,
            aliases: ["rel"]
        })
    }

    async run(message, args, Eris) {
        if(message.author.id !== process.env.OWNER) return this.client.createMessage(message.channel.id, `${this.client.emojis.cross} | You are\'nt the Bot Owner!`);
        try {
            const command = args.join(" ").toLowerCase();
            delete require.cache[require.resolve(path.resolve("src", "commands", command))];
            const cmd = new (require(path.resolve("src", "commands", command)))(this.client);
            this.client.commands.delete(command);
            this.client.aliases.forEach((cmd, alias) => {
              if (cmd === command) this.client.aliases.delete(alias);
            });
            this.client.commands.set(command, cmd);
            cmd.help.aliases.forEach(alias => {
                this.client.aliases.set(alias, cmd.help.name);
            });
            message.channel.createMessage(`${this.client.emojis.tick} | Reloaded **${command}**.`);
        } catch (e) {
            message.channel.createMessage(`${this.client.emojis.cross} | Something went Wrong! \`\`\`${e.stack}\`\`\``);
        }
    }

}

module.exports = reload;