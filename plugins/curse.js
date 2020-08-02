const Plugin = require('../plugin');
let orginal = {};


module.exports = new Plugin({
    name: 'Curse',
    author: 'TechnoJo4#1337',
    description: ':b:',
    color: '#00ff00',

    load: async () => {
        await module.exports.sleep(2500);
        const mess = findModule('Messages').Messages;

        Object.entries(mess).forEach(([k, v]) => {
            if (typeof v === "string") {
                orginal[k] = v;
                mess[k] = v.replace(/b/gi, "🅱").replace(/p/gi, "🅿").replace(/ /gi, " 👏 ") + " 🔥";
            }
        });
    },

    unload: () => {
        const mess = findModule('Messages').Messages;
        Object.entries(orginal).forEach(([k, v]) => mess[k] = v);
    }
});
