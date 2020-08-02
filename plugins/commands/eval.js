module.exports = {
    name: "eval",
    description: "ED Commands - Evaluate JS Code",
    action: function(e) {
        try {
            const ret = eval(e.content);
            if (ret !== undefined)
                $cmds.fakeMsg(`\`${ret.toString()}\``, "EnhancedDiscord");
        } catch (err) {
            $cmds.fakeMsg(`\`\`\`\nError in /eval: ${err}\n${err.stack}\n\`\`\``, "EnhancedDiscord");
        }
        e.content = "";
    }
}
