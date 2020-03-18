const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));
const Collector = require(path.resolve("src", "utils", "reactionCollector"));

class lyrics extends Command {

    constructor(client) {
        super(client, {
            name: "lyrics",
            description: "Shows the Lyrics of the given song name or of the current one.",
            usage: "lyrics",
            enabled: true,
            aliases: ["ly"]
        })
    }

    async run(message, args, Eris) {
        let name = args.join(" ");
        if(!name && this.client.music.getQueue(message.channel.guild)) name = this.client.music.getQueue(message.channel.guild).songs[0] ? this.client.music.getQueue(message.channel.guild).songs[0].title : false;
        if(!name) return message.channel.createMessage(`${this.client.emojis.cross} | You must specify a Song Name to use \`${this.help.name}\` command.`);
        const searchingMsg = await message.channel.createMessage(`${this.client.emojis.search} | Searching Lyrics for \`${name}\``);
        this.lyrics = await this.client.music.getLyrics(name);
        if(!this.lyrics) return searchingMsg.edit(`${this.client.emojis.cross} | No Lyrics was found for \`${name}\`.`);
        if(this.lyrics) await searchingMsg.delete();
        const lines = this.lyrics.lyrics.split("\n");
        let first = 0;
        const perpage = 25;
        const msg = await message.channel.createMessage({ embed: this.embedF(lines, first, perpage)});
        await msg.addReaction('◀️');
        await msg.addReaction('▶️');
        await msg.addReaction('⏺️');
        const collector = new Collector.continuousReactionStream(msg, (userID) => userID === message.author.id, { maxMatches: 25, time: 60000 });
        collector.on("reacted", (reaction) => {
            let addcount = this.length(lines, first + perpage, perpage);
            let remcount = this.length(lines, first - perpage, perpage);
            if (reaction.emoji.name === '▶️') {
                if(addcount > 0) {
                    msg.removeReaction('▶️', reaction.userID);
                    first += perpage;
                    msg.edit({ embed: this.embedF(lines, first, perpage) });
                } else msg.removeReaction('▶️', reaction.userID);
            }
            else if (reaction.emoji.name === '◀️') {
                if(remcount > 0) {
                    msg.removeReaction('◀️', reaction.userID);
                    first -= perpage;
                    msg.edit({ embed: this.embedF(lines, first, perpage) });
                } else msg.removeReaction('◀️', reaction.userID);
            } else if(reaction.emoji.name === '⏺️') {
                collector.stopListening();
                msg.removeReactions();
            }
        });
        return;
    }

    length(array, start, perpage) {
        let arr = array;
        arr = arr.slice(start, start + perpage);
        return arr.length;
    }

    embedF(array, start, perpage) {
        let arr = array;
        arr = arr.slice(start, start + perpage);
        let totalpages = Math.ceil(array.length / perpage);
        let currentpages = Math.ceil(start / perpage) + 1;
        const embed = {
            title: `${this.lyrics.title} by ${this.lyrics.author}`,
            color: 0x00ffff,
            description: `${arr.map((x) => `${x}`).join("\n")}`,
            thumbnail: {
                url: `${this.lyrics.image}`,
            },
            footer: {
                text: `Page: ${currentpages}/${totalpages} | ${array.length} Line(s)`
            }
        };
        return embed;
    }

}

module.exports = lyrics;