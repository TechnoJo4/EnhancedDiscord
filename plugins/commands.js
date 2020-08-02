const fs = require('fs');
const path = require('path');
const cmds_folder = path.join(process.env.injDir, 'plugins', 'commands');

const _actions = [];
const _completes = [];

const Plugin = require('../plugin');

let self; self =
module.exports = new Plugin({
    name: 'Commands',
    author: 'TechnoJo4#1337',
    description: 'cum hands',
    color: '#ff00ff',

    load: async () => {
        while (!window['_CMD_ACTIONS'] || !window['_CMD_AUTOCOMPLETE']) await self.sleep(500);

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
