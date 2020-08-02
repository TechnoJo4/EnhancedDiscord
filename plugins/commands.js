const Plugin = require('../plugin');
const injected = [];

let self; self =
module.exports = new Plugin({
    name: 'Commands',
    author: 'TechnoJo4#1337',
    description: 'cum hands',
    color: '#ff00ff',

    load: async () => {
        while (!window["_CMD_ACTIONS"] || !window["_CMD_AUTOCOMPLETE"]) await self.sleep(500);

        self.log("Found command modules. Injecting commands.");
        //
    },

    unload: () => {
        //
    }
});
