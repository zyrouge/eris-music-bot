module.exports = class {
    
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if(!message.channel.guild || message.author.bot) return;
        if(!message.channel.permissionsOf(this.client.user.id).has("allText")) {
            this.client.log(`No Voice Permissions in ${message.channel.guild.id}`);
            return;
        }
        if(!message.channel.permissionsOf(this.client.user.id).has("allVoice")) {
            this.client.createMessage(message.channel.id, `${this.client.emojis.cross} | No Voice Permissions!`);
            return;
        }
        let prefix = await this.client.db.get(`prefix_${message.channel.guild.id}`);
        if(!prefix) prefix = process.env.PREFIX;
        if(message.content.indexOf(prefix) !== 0) return;
        this.client.prefix = prefix;
        const args = message.content.slice(prefix.length).split(/\s+/g);
        const command = args.shift().toLowerCase();
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if(cmd) cmd.run(message, args, this.client.Eris);
    }

}
