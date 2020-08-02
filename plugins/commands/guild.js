module.exports = {
    name: "guild",
    description: "ED Commands - Guild Info",
    action: function(e) {
        const g = findModules('getGuild')[0].getGuild($cmds.guild());
        $cmds.fakeMsg(
                `${g.name} - \`${g.id}\`\n\nOwner: <@${g.ownerId}>\n\n` +
                `Roles: ${Object.values(g.roles).map(r => `<@&${r.id}>`).join(', ')}\n\n` +
                `Features: ${Array.from(g.features).join(', ')}\n\n` +
                `Verification Level: ${g.verificationLevel}\nContent Filter: ${g.explicitContentFilter}` +
                (g.vanityURLCode ? "Vanity URL:" + g.vanityURLCode : "")
            );
        e.content = "";
    }
}
