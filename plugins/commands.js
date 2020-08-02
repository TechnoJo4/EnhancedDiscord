const fs = require('fs');
const path = require('path');
const cmds_folder = path.join(process.env.injDir, 'plugins', 'commands');

const _actions = [];
const _completes = [];

const Plugin = require('../plugin');

const _chan = findModules('getChannelId')[2];
const _guild = findModules('getGuildId')[1];
const chan = () => _chan.getChannelId();
const guild = () => _guild.getGuildId();

let _c; // "standard library" for commands.
const $cmds = _c = {
    channel: chan,
    guild: guild,

    createFakeMsg: (e, n) => {
        const content = typeof e === "string" ? e : e.content;
        const msg = EDApi.findModule("createBotMessage").createBotMessage(chan(), content);
        msg.state = 'SENT';
        msg.author.id = '1';
        msg.author.bot = true;
        msg.author.discriminator = '0000';
        msg.author.avatar = n || 'EnhancedDiscord';
        msg.author.username = n || 'EnhancedDiscord';
        if (typeof e !== "string")
            Object.entries(e).forEach(([k,v]) => msg[k] = v);

        return msg;
    },
    fakeMsg: (e, n) => {
        findModule('receiveMessage').receiveMessage(chan(), _c.createFakeMsg(e, n));
    },
};

let self; self =
module.exports = new Plugin({
    name: 'Commands',
    author: 'TechnoJo4#1337',
    description: 'cum hands',
    color: '#ff00ff',

    load: async () => {
        EDApi.findModule("BOT_AVATARS").BOT_AVATARS.EndPwn =
                "https://cdn.discordapp.com/avatars/350987786037493773/ae0a2f95898cfd867c843c1290e2b917.png";
        EDApi.findModule("BOT_AVATARS").BOT_AVATARS.EnhancedDiscord =
                "https://cdn.discordapp.com/icons/415246389287583755/d838818a592306b7ee29d92c9f568ef5.png?size=128";

        while (!window['_CMD_ACTIONS'] || !window['_CMD_AUTOCOMPLETE']) await self.sleep(500);
        window["$cmds"] = $cmds;

        self.log('Found command modules. Injecting commands.');
        fs.readdirSync(cmds_folder).forEach(name => {
            const filename = path.join(cmds_folder, name);
            const resolved = require.resolve(filename);
            try {
                if (require.cache[resolved]) delete require.cache[resolved];
                const cmd = require(resolved);
                if (!cmd.name || !cmd.action)
                    throw new Error('Commands need a name and an action.');

                _actions.push(cmd.name);
                const action = { action: cmd.action };
                if (cmd.match) action.match = cmd.match;
                window._CMD_ACTIONS[cmd.name] = action;

                if (!cmd.description) return;

                _completes.push(cmd.name);
                const auto = { command: cmd.name, description: cmd.description };
                if (cmd.predicate) auto.predicate = cmd.predicate;
                window._CMD_AUTOCOMPLETE.push(auto);
            } catch (err) {
                self.warn(`Error loading command ${name}: ${err}\n${err.stack}`);
            }
        });
    },

    unload: () => {
        _actions.forEach(name => {
            delete window._CMD_ACTIONS[name];
        });

        const comp = window._CMD_AUTOCOMPLETE;
        _completes.forEach(name => {
            for (const i in comp) {                
                if (comp[i].command == name) {
                    comp.splice(i, 1);
                    break;
                }
            }
        });
    }
});
