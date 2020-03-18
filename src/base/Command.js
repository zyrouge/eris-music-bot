class Command {

    constructor (client, {
        name = null,
        description = "No description provided.",
        usage = "No usage provided.",
        enabled = true,
        aliases = new Array()
    }) {
        this.client = client;
        this.help = { name, description, usage, enabled, aliases };
    }
}

module.exports = Command;