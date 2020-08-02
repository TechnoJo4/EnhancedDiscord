// ctr - webpack constructor .replace-er
// somewhat inspired from EndPwn/EPAPI's crispr
// *almost* no code stolen from crispr (only a few lines)

const fs = require('fs');
const path = require('path');
const ctr = { replacements: [] }; window.ctr = ctr;

const _should = mods => (Array.isArray(mods) ? mods : Object.values(mods)).indexOf(undefined) === -1;

const _patch = f => {
    if (typeof f !== "function") return f;
    const of = f.toString(); var nf;
    ctr.replacements.forEach(([s, r]) => nf = of.replace(s, r));
    if (of != nf) { 
        console.log('Patched', nf);
        f = eval("("+nf+")");
    }
    return f;
};

ctr.patch = mods => {
    console.log(mods);
    return Array.isArray(mods)
        ? mods.map(_patch)
        : Object.fromEntries(Object.entries(mods)
                .map(([k, f]) => [k, _patch(f)]));
};

Object.defineProperty(window, "webpackJsonp", {
    get: () => ctr.webpack,
    set: (webpack) => {
        if (webpack && webpack.push && webpack.push.patched) return;
        const orig_push = webpack.push;

        webpack.push = function(e, t, o) {
            const modules = t || e[1];
            if (!_should(modules))
                return orig_push.apply(webpack, arguments);

            const main = o ? o : e[2];
            const _ = t ? e : e[0];

            const patched = ctr.patch(modules);
            const args = [_, patched, main];
            return orig_push.apply(webpack, t ? args : [args]);
        };

        ctr.webpack = webpack;
        webpack.push.patched = true;
    }
});

const files = fs.readdirSync(path.join(process.env.injDir, 'plugins'));
for (const i in files) {
    if (!files[i].endsWith('.ctr.js')) continue;
    const name = files[i].replace(/\.js$/, '');
    let p;
    try {
        p = require(path.join(process.env.injDir, 'plugins', name));
        if (!Array.isArray(p) || !Array.isArray(p[0]) || !p.every(x => x.length === 2))
            throw new Error('Replacements should be an array of arrays of replacements in format [signature, payload].');

        p.forEach(r => ctr.replacements.push(r));
    } catch (err) {
        console.warn(`Failed to load ${files[i]}: ${err}\n${err.stack}`);
    }
}
