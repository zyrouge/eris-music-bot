const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class help extends Command {

    constructor(client) {
        super(client, {
            name: "help",
            description: "Help Command.",
            usage: "help <cmd>",
            enabled: true,
            aliases: ["h", "cmds", "commands"]
        })
    }

    async run(message, args, Eris) {
        if(args.join(" ") && (this.client.commands.has(args.join(" ")) || this.client.aliases.has(args.join(" ")))) {
            const command = this.client.commands.get(args.join(" ")) || this.client.commands.get(this.client.commands.get(args.join(" ")));
            const embed = {
                title: `${args.join(" ").charAt(0).toUpperCase() + args.join(" ").substring(1)} Command Information`,
                color: 0x00ffff,
                fields: [
                    {
                        name: `Name`,
                        value: `${command.help.name}`,
                        inline: false
                    },
                    {
                        name: `Description`,
                        value: `${command.help.description}`,
                        inline: false
                    },
                    {
                        name: `Usage`,
                        value: `\`${command.help.usage}\``,
                        inline: false
                    },
                    {
                        name: `Aliases`,
                        value: `${command.help.aliases.map(alias => `\`${alias}\``).join(", ")}`,
                        inline: false
                    }
                ],
                footer: {
                    text: `Made by ZYROUGE [https://github.com/zyrouge/eris-music-bot]`
                }
              };
              message.channel.createMessage({ embed: embed });
            } else {
                const embed = {
                    color: 0x00ffff,
                    fields: [
                        {
                            name: `${this.client.emojis.music} | All Commands`,
                            value: `${this.client.commands.map(cmd => `\`${cmd.help.name}\``).join(", ")}`,
                            inline: false
                        }
                    ],
                    footer: {
                        text: `${this.client.prefix}help <name> | ${this.client.commands.size} Command(s)`
                    }
              };
              message.channel.createMessage({ embed: embed });
          }
      }

}

module.exports = help;