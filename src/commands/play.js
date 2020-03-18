const path = require("path");
const Command = require(path.resolve("src", "base", "Command"));

class play extends Command {

    constructor(client) {
        super(client, {
            name: "play",
            description: "Plays a Specified Song. (YouTube)",
            usage: "play <url/terms>",
            enabled: true,
            aliases: ["p"]
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
			const videos = await youtube.searchVideos(args.join(" "), 1);
			if(!videos.length) return message.channel.createMessage(`${this.client.emojis.tick} | No result found for \`\`${srgs.join(" ")}\`\`.`);
			const video = await youtube.getVideoByID(videos[0].id);
			return await this.client.music.handleVideo(video, message, voiceChannel);
		}

    }

}

module.exports = play;