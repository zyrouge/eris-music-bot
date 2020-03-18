const Genius = new (require("genius-lyrics")).Client(process.env.GENIUS);
let moment = require("moment");
require("moment-duration-format");
const path = require("path");
const ytdl = require("ytdl-core");

class MusicPlayer {

    constructor(youtube, client) {
        this._youtube = youtube;
        this._queue = new Map();
        this.client = client;
    }

    getYouTube() {
        return this._youtube;
    }

    getQueue(guild) {
        return this._queue.get(guild.id);
    }

    _randomizeArray(array)
    {
        if (array.length >= 2) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
        return array;
    }

    removeTrack(guild, position) {
        try {
            let track = this._queue.get(guild.id).songs[position];
            this._queue.get(guild.id).songs.splice(track, 1);
            return true;
        } catch(e) {
            return false;
        }
    }

    clearQueue(guild) {
        this._queue.get(guild.id).songs = [];
        return true;
    }

    setLoop(guild, state) {
        this._queue.get(guild.id).loop = state;
        return true;
    }

    getLoop(guild) {
        return this._queue.get(guild.id).loop;
    }

    getLoopInWords(num) {
        return num === 0 ? "None" : (num === 1 ? "Queue" : "Track");
    }

    setBassboost(guild, state) {
        this._queue.get(guild.id).bassboost = state;
        return true;
    }

    getBassboost(guild) {
        return this._queue.get(guild.id).bassboost;
    }

    async getLyrics(name) {
        try {
            const search = await Genius.findTrack(`${name}`);
            const result = await Genius.getAll(search);
            if(!result.full_title || !result.lyrics || result.lyrics.length == 0) return false;
            return {
                title: result.title,
                author: result.primary_artist.name,
                image: result.song_art_image_url,
                lyrics: result.lyrics.split("\n").filter(line => !line.startsWith("[")).join("\n")
            }
        } catch(err) {
            return false;
        }
    }

    nowPlaying(guild) {
        return this._queue.get(guild.id).songs[0];
    }

    pause(guild) {
        const queue = this._queue.get(guild.id);
        queue.playing = false;
        queue.connection.pause();
        return true;
    }

    resume(guild) {
        const queue = this._queue.get(guild.id);
        queue.playing = true;
        queue.connection.resume();
        return true;
    }

    stop(guild) {
        const queue = this._queue.get(guild.id);
        queue.songs = [];
        queue.connection.stopPlaying();
        return true;
    }

    skip(guild) {
        let revertLoopToTrack = false;
        if(this._queue.get(guild.id).loop == 2) {
            this._queue.get(guild.id).loop = 0;
            revertLoopToTrack = true;
        }
        this._queue.get(guild.id).connection.stopPlaying();
        setTimeout(() => { if(revertLoopToTrack && this._queue.get(guild.id)) this._queue.get(guild.id).loop = 2; }, 1000);
        return true;
    }

    previous(guild) {
        const queue = this._queue.get(guild.id);
        let revertLoopToTrack = false;
        if(queue.loop == 2) {
            queue.loop = 0;
            revertLoopToTrack = true;
        }
        queue.songs = this._previousQueueProcess(queue.songs);
        queue.connection.stopPlaying();
        setTimeout(() => { if(revertLoopToTrack && this._queue.get(guild.id)) queue.loop = 2; }, 1000);
        return true;
    }

    _previousQueueProcess(array) {
        let songs = [];
        array.forEach(song => songs.push(song));
        const song = songs.pop();
        songs.splice(1, 0, song);
        return songs;
    }

    isPlaying(guild) {
        return this._queue.get(guild.id).playing;
    }

    setVolume(guild, volume) {
        this._queue.get(guild.id).volume = volume;
        this._queue.get(guild.id).connection.setVolume(volume / 100);
        return true;
    }

    getSong(guild, position) {
        return this._queue.get(guild.id).songs[position];
    }

    convertDuration(time) {
        return moment.duration(time).format("D[d] H[h] m[m] s[s]");
    }

    shuffle(guild) {
        let queue = this._queue.get(guild.id);
        if(queue.songs.length >= 2) {
            queue.songs = this._randomizeArray(queue.songs);
            this._queue.set(guild.id, queue);
            return true;
        }
        return true;
    }

    jump(guild, position) {
        let queue = this._queue.get(guild.id);
        if(position > queue.songs.length) return false;
        queue.songs = this._jumpQueueProcess(queue.songs, position);
        queue.connection.stopPlaying();
        return true;
    }
  
    _jumpQueueProcess(array, num) {
        let unshifted = [];
        array.forEach(song => unshifted.push(song));
        let shifted = unshifted.splice(1, num-1);
        return [...unshifted, ...shifted];
    }

    constructSong(video, message) {
        return {
            id: video.id,
            duration: video.duration,
            thumbnail: video.thumbnails.default.url,
            channel: {
                title: video.channel.title,
                url: video.channel.url,
                id: video.channel.id
            },
            published: video.publishedAt,
            title: video.title.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1'),
            url: `https://www.youtube.com/watch?v=${video.id}`,
            user: message.author.id,
            parsedDuration: video.duration.hours * 3.6e6 + video.duration.minutes * 60000 + video.duration.seconds * 1000
        }
    }

    constructQueue(textChannel, voiceChannel) {
        return {
            textChannel: textChannel,
            voiceChannel: voiceChannel,
            connection: null,
            bassboost: false,
            songs: [],
            volume: 100,
            playing: true,
            loop: 0
        };
    }

    async handleVideo(video, message, voiceChannel, playlist = false) {
        const queue = this._queue.get(message.channel.guild.id);
        const song = this.constructSong(video, message);
        if(!queue) {
            let joinMessage = await message.channel.createMessage(`${this.client.emojis.headphones} | Joining **${this.client.getChannel(voiceChannel.channelID).name}**.`);
            let queueConstruct = this.constructQueue(message.channel, voiceChannel);
            queueConstruct.connection = await this.client.joinVoiceChannel(voiceChannel.channelID);
            queueConstruct.songs.push(song);
            this._queue.set(message.channel.guild.id, queueConstruct);
            await joinMessage.edit(`${this.client.emojis.tick} | Joined **${this.client.getChannel(voiceChannel.channelID).name}**.`);
            this.play(message.channel.guild, queueConstruct.songs[0]);
            return;
        } else {
            queue.songs.push(song);
            if(playlist == false) message.channel.createMessage(`${this.client.emojis.tick} | Added **${song.title}** to Queue.`);
        }
    }

    play(guild, song) {
        const serverQueue = this._queue.get(guild.id);
        if(!song) {
            this._queue.delete(guild.id);
            this.client.leaveVoiceChannel(serverQueue.voiceChannel.channelID ? serverQueue.voiceChannel.channelID : serverQueue.voiceChannel);
            return serverQueue.textChannel.createMessage(`${this.client.emojis.music} | Music has been Ended.`);
        }
        serverQueue.connection.play(ytdl(song.url, {
            filter: "audioonly",
            quality: "highestaudio"
        }), {
            encoderArgs: serverQueue.bassboost ? ['-af', 'equalizer=f=40:width_type=h:width=50:g=10'] : []
        })
        serverQueue.connection.once('end', () => {
            setTimeout(() => {
                const shifted = serverQueue.loop == 2 ? false : serverQueue.songs.shift();
                if(serverQueue.loop == 1) serverQueue.songs.push(shifted);
		            return this.play(guild, serverQueue.songs[0]);
            }, 1000);
        });
        serverQueue.connection.on("error", (err) => console.error(err));
        serverQueue.textChannel.createMessage(`${this.client.emojis.music} | Playing **${song.title}**.`);
    }

}

module.exports = MusicPlayer;