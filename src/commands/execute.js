const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class executeCmd extends Command {

    constructor(client) {
        super(client, {
            name: "execute",
            description: "Executes to Console.",
            usage: "execute <cmd>",
            enabled: true,
            aliases: ["exec"]
        })
    }

    async run(message, args, Eris) {
        if(message.author.id !== process.env.OWNER) return this.client.createMessage(message.channel.id, `${this.client.emojis.cross} | You are\'nt the Bot Owner!`);
        try {
            const execute = (command) => {
              message.channel.createMessage('Command Executed In Shell.');
              require("child_process").exec(command, (err, stdout, stderr) => {
                if (stderr) message.channel.createMessage('Shell Error.');
              });
            }
            execute(args.join(" "));
        } catch (err) {
            message.channel.createMessage('Their was an error!\n' + err).catch();
        }
    }

}

module.exports = executeCmd;

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }