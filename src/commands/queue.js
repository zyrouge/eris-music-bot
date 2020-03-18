const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));
const Collector = require(path.resolve("src", "utils", "reactionCollector"));

class queue extends Command {

    constructor(client) {
        super(client, {
            name: "queue",
            description: "Shows the Queue.",
            usage: "queue",
            enabled: true,
            aliases: ["q", "songlist", "songs"]
        })
    }

    async run(message, args, Eris) {
        const voiceChannel = message.member.voiceState;
        if(!voiceChannel.channelID) return message.channel.createMessage(`${this.client.emojis.cross} | You must be in a Voice Channel to use \`${this.help.name}\` command.`);
        const queue = this.client.music.getQueue(message.channel.guild);
        if(!queue) return message.channel.createMessage(`${this.client.emojis.cross} | Nothing is playing to use \`${this.help.name}\` command.`);
        const songs = [];
        let first = 0;
        const perpage = 10;
        queue.songs.forEach(song => songs.push(`[${song.title}](${song.url})`));
        const msg = await message.channel.createMessage({ embed: this.embedF(songs, first, perpage)});
        await msg.addReaction('◀️');
        await msg.addReaction('▶️');
        await msg.addReaction('⏺️');
        const collector = new Collector.continuousReactionStream(msg, (userID) => userID === message.author.id, { maxMatches: 25, time: 60000 });
        collector.on("reacted", (reaction) => {
            let addcount = this.length(songs, first + perpage, perpage);
            let remcount = this.length(songs, first - perpage, perpage);
            if (reaction.emoji.name === '▶️') {
                if(addcount > 0) {
                    msg.removeReaction('▶️', reaction.userID);
                    first += perpage;
                    msg.edit({ embed: this.embedF(songs, first, perpage) });
                } else msg.removeReaction('▶️', reaction.userID);
            }
            else if (reaction.emoji.name === '◀️') {
                if(remcount > 0) {
                    msg.removeReaction('◀️', reaction.userID);
                    first -= perpage;
                    msg.edit({ embed: this.embedF(songs, first, perpage) });
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
        let count = start;
        let totalpages = Math.ceil(array.length / perpage);
        let currentpages = Math.ceil(start / perpage) + 1;
        const embed = {
            color: 0x00ffff,
            fields: [
                {
                    name: `${this.client.emojis.headphones} | Song Queue`,
                    value: `${arr.map((x) => `${++count} - ${x}`).join("\n")}`,
                    inline: false
                }
            ],
            footer: {
                text: `Page: ${currentpages}/${totalpages} | ${array.length} Song(s)`
            }
        };
        return embed;
    }

}

module.exports = queue;