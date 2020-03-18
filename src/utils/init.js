module.exports = async (client) => {
  
    if(!process.env) throw new Error('No ENV file was Found in env! [https://github.com/zyrouge/eris-music-bot]');
    if(!process.env.TOKEN || process.env.TOKEN == "") throw new Error('No Discord Token was Found in env! [https://github.com/zyrouge/eris-music-bot]');
    if(!process.env.PREFIX || process.env.PREFIX == "") throw new Error('No Prefix was Found in env! [https://github.com/zyrouge/eris-music-bot]');
    if(!process.env.YTTOKEN || process.env.YTTOKEN == "") throw new Error('No YouTube Token was Found in env! [https://github.com/zyrouge/eris-music-bot]');
    if(!process.env.GENIUS || process.env.GENIUS == "") console.log('No Genius Token was Found in env! Lyrics command will not Work! [https://github.com/zyrouge/eris-music-bot]');
    if(!process.env.OWNER || process.env.OWNER == "") console.log('No Discord Token was Found in env! Eval, Execute, Reload command will not Work! [https://github.com/zyrouge/eris-music-bot]');

    const fs = require("fs");
    const path = require("path");
    const Eris = client.Eris;

    fs.readdir(path.resolve("src", "events"), (err, files) => {
        if (err) return console.error(err);
        client.log(`Loaded ${files.length} Events`);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            const event = new (require(path.resolve("src", "events", `${file}`)))(client);
            let eventName = file.split(".")[0];
            client.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(path.resolve("src", "events", `${file}`))];
        });
    });

    fs.readdir(path.resolve("src", "commands"), (err, files) => {
        if (err) return console.error(err);
        client.log(`Loaded ${files.length} Commands`);
        files.forEach(f => {
            let props = new (require(path.resolve("src", "commands", f)))(client);
            client.commands.set(props.help.name, props);
            props.help.aliases.forEach(alias => client.aliases.set(alias, props.help.name) );
        });
    });
  
    client.on("ready", () => {
        setTimeout(() => {console.log(`
>===============================================<
                Made by ZYROUGE
GitHub: https://github.com/zyrouge/eris-music-bot
      Discord: https://discord.gg/8KV5zCg
>===============================================<`);
        }, 5000);
    });

    setInterval(() => {
        const http = require('http');
        http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);

}
