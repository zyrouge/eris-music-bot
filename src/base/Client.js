const Eris = require("eris-additions")(require("eris"));
const path = require("path");
const moment = require("moment");

const client = new Eris(process.env.TOKEN, {
    disableEveryone: true,
    defaultImageSize: 512
});

client.Eris = Eris;
client.wait = require("util").promisify(setTimeout);
client.log = (text) => console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]: ${text}`);
client.db = new (require("enmap"))({ name: "db", fetchAll: false, autoFetch: true, cloneLevel: 'deep' });
client.commands = new Eris.Collection();
client.aliases = new Eris.Collection();

client.emojis = {
    "tick": "✅",
    "search": "🔍",
    "music": "🎵",
    "cross": "❌",
    "headphones": "🎧"
};

module.exports = client;
