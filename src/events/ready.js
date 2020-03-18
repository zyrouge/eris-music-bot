module.exports = class {
    
    constructor(client) {
        this.client = client;
    }

    async run() {
        this.client.log(`Logged in as ${this.client.user.tag} (${this.client.guilds.size}) Servers`);
        setInterval(() => {
            const http = require('http');
            http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/ping`);
        }, 280000);
    }

}