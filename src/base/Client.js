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
    "tick": "<:yestick:649964798825463848>",
    "settings": "<:settings:649965144746491914>",
    "search": "<:search:649965040019177485>",
    "loop": "<:repeaton:649964967889600522>",
    "unloop": "<:repeatoff:649964893411213312>",
    "remove": "<:remove:649965010247745558>",
    "music": "<:musicicon:649964862386208769>",
    "cross": "<:crosstick:649964831536971776>",
    "add": "<:add:649965070389870603>",
    "headphones": "<:headphonemusic:649965110395273226>"
};

module.exports = client;