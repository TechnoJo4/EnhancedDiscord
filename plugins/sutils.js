'use strict';

const Plugin = require('../plugin');
var timer;

module.exports = new Plugin({
    name: 'SUtils',
    author: 'TechnoJo4#1337',
    description: 'yeah',
    color: 'indigo',

    findC: function(channel, guild) {
        const g = EDApi.findModuleByProps('getGuilds').getGuilds()[guild];
        const c = EDApi.findModuleByProps('getChannels').getChannels()[channel];
        return `#${c.name} in guild: ${g.name}`;
    },

    denc: function(str) {
        let key = 0xffff;

        if (str === "") return "";
        if (str.startsWith("fe6b")) {
            let s = "";
            str = str.substring(5).split("_")
            if (str.length == 1 && str[0] == "") return "";
            for (let p of str) {
                var c = parseInt(p, 16);
                c ^= key; key ^= c;
                s += String.fromCodePoint(c);
            }

            return s;
        } else {
            let s = "fe6b";
            for (let c of str) {
                const cur = c.codePointAt(0);
                s += "_"+(cur ^ key).toString(16);
                key ^= cur;
            }

            return s;
        }
    },

    rest: async function(method, endpoint, body, raw) {
        var c = this._token;
        if (c.startsWith("fe6b")) c = this.denc(c);

        var options = {
            headers: raw ? {} : {
                'Authorization': c,
                'Content-type': typeof(body) === 'string' ? 'text/plain' : 'application/json'
            },
            method: method
        };

        if (method !== 'GET')
            options.body = typeof(body) === 'string' ? body : JSON.stringify(body);

        let r = await fetch(raw ? endpoint : "https://discordapp.com/api/v6" + endpoint, options);

        return raw ? r : await r.json();
    },

    generateSettings: function() {
        return [{
            type: "input:boolean",
            title: "Message Debug Logging",
            note: "Log MESSAGE_CREATE events to console.",
            configName: "log_events"
        }, {
            type: "input:boolean",
            title: "Auto-Update",
            note: "Auto-Update the SUtils plugin.",
            configName: "updater"
        }, {
            type: "input:boolean",
            title: "Gift Stealer",
            note: "Automatically tries to redeem nitro and discord game gifts found in text channels.",
            configName: "stealer"
        }]
    },

    listener: function(e) {
        const m = e.message;
        if (this.getSetting("log_events"))
            console.log(e);

        if (this.getSetting("stealer")) {
            const c = m.content;
            const r = /(?:discord\.gift|discord(?:app)?\.com\/gifts)\/(\w{12,})/gi;
            var matches = [], match;
            while ((match = r.exec(c)) != null)
                matches.push(match[1]);

            matches.forEach(async s => {
                if (this.tried.has(s)) return;
                this.tried.add(s);
                const res = await this.rest('POST', `/entitlements/gift-codes/${s}/redeem`, {channel_id: e.channelId});
                this.log("Found gift " + s + " -> " +
                            (res.code !== undefined ? `ERROR ${res.code} - ${res.message}` : "SUCCESS") +
                            " in channel: " + this.findC(m.channel_id, m.guild_id));
            });
        }
    },

    update: async function() {
        try {
            const fs = require("fs");
            const _v = await this.rest("GET", "https://technojo4.com/lmao/version", null, true);
            const v = await _v.text();
            const sha = require("crypto").Hash("sha1");
            sha.write(fs.readFileSync(__filename));
            const hex = sha.digest().toString("hex");
            if (v !== hex) {
                this.log(`Update found! ${v} -> ${hex}`);
                const update = await this.rest("GET", "https://technojo4.com/lmao/sutils.js", null, true);
                try {
                    const u = await update.text();
                    fs.writeFileSync(__filename, u);
                    this.log("Update complete!");
                } catch {
                    this.log("Update failed! 1");
                }
            }
        } catch {
            this.log("Update failed! 2");
        }
    },

    load: async function() {
        const su = window.SU || this;
        this.tried = su.tried || new Set();
        this._token = su._token || this.denc(EDApi.findModule('hideToken').getToken());
        this._listener = this._listener || this.listener.bind(this);
        window.SU = this;

        timer = setTimeout(function f() {
            Object.defineProperty(EDApi.findModuleByProps('isDeveloper'), 'isDeveloper', {
                get: _ => true,
                set: _ => _,
                configurable: true
            });
            setTimeout(f, 5000);
        }, 5000);

        //EDApi.findModule('dispatch').subscribe("MESSAGE_CREATE", this._listener);
        this.log("Finished loading.");
        if (this.getSetting("updater")) await this.update();
    },

    unload: async function() {
        if (timer) clearTimeout(timer);
        //EDApi.findModule('dispatch').unsubscribe("MESSAGE_CREATE", this._listener);
        this.log("Finished unloading.");
    }
});
