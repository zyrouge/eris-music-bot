const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class search extends Command {

    constructor(client) {
        super(client, {
            name: "search",
            description: "Searches for a Song. (YouTube)",
            usage: "search <terms>",
            enabled: true,
            aliases: ["s"]
        })
    }

    async run(message, args, Eris) {
        const youtube = this.client.music.getYouTube();
        const voiceChannel = message.member.voiceState;
        if(!voiceChannel.channelID) return message.channel.createMessage(`${this.client.emojis.cross} | You must be in a Voice Channel to use \`${this.help.name}\` command.`);
        if(!args.join(" ")) return message.channel.createMessage(`${this.client.emojis.cross} | You must provide a Search Query or an URL to use \`${this.help.name}\` command.`);
        
        if (/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/.test(args[0])) {
			const playlist = await youtube.getPlaylist(args[0]);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				try {
					const vid = await youtube.getVideoByID(video.id);
					await this.client.music.handleVideo(vid, message, voiceChannel, true);
				} catch(e) { continue; }
			}
			return message.channel.createMessage(`${this.client.emojis.tick} | **${playlist.title}**: has been added to queue`);
        }
        
        try {
			const video = await youtube.getVideo(args[0]);
			return await this.client.music.handleVideo(video, message, voiceChannel);
		} catch(e) {
			const videos = await youtube.searchVideos(args.join(" "), 10);
			if(!videos.length) return message.channel.createMessage(`${this.client.emojis.tick} | No result found for \`\`${args.join(" ")}\`\`.`);
      const embed = {
            color: 0x00ffff,
            fields: [
                {
                    name: `${this.client.emojis.search} | Results for ${args.join(" ")}`,
                    value: `${videos.map((video, i) => `${++i} - [${video.title}](${video.url})`).join("\n")}`,
                    inline: false
                }
            ],
            footer: {
                text: `Song Selection (1 - ${videos.length}) | Enter cancel to cancel.`
            }
      };
      const msg = await message.channel.createMessage({ embed: embed });
			var responses = await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 10000, maxMatches: 1 });
      let index = false;
      if(responses.length && responses[0].content.toLowerCase() == "cancel") {
          await msg.delete();
          message.channel.createMessage(`${this.client.emojis.cross} | Cancelled video search.`);
          return;
      } else if(responses.length && !isNaN(responses[0].content) && parseInt(responses[0].content) > 0 && parseInt(responses[0].content) < 11) {
          await msg.delete();
          index = parseInt(responses[0].content);
          const video = await youtube.getVideoByID(videos[index].id);
			    return await this.client.music.handleVideo(video, message, voiceChannel);
      } else {
          await msg.delete();
          message.channel.createMessage(`${this.client.emojis.cross} | Wrong or no value was Entered, cancelled video search.`);
          return;
      }
		}

    }

}

module.exports = search;