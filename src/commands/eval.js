const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class evalCmd extends Command {

    constructor(client) {
        super(client, {
            name: "eval",
            description: "Evals JS Code.",
            usage: "eval <code>",
            enabled: true,
            aliases: ["ev"]
        })
    }

    async run(message, args, Eris) {
        if(message.author.id !== process.env.OWNER) return this.client.createMessage(message.channel.id, `${this.client.emojis.cross} | You are\'nt the Bot Owner!`);
        try {
            let code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            evaled = clean(evaled);
            if(evaled.length < 1900) this.client.createMessage(message.channel.id, `${this.client.emojis.tick} | Success\n\`\`\`${evaled}\`\`\``)
            else {
                this.client.createMessage(message.channel.id, `${this.client.emojis.tick} | Success, Check Console.`);
                this.client.log(`Eval (Success)\n${evaled}`);
            }
        } catch(err) {
            let error = clean(err);
            if(error.length < 1900) this.client.createMessage(message.channel.id, `${this.client.emojis.cross} | Error\n\`\`\`${error}\`\`\``)
            else {
                this.client.createMessage(message.channel.id, `${this.client.emojis.cross} | Error, Check Console.`);
                this.client.log(`Eval (Error)\n${error}`);
            }
        }
    }

}

module.exports = evalCmd;

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }