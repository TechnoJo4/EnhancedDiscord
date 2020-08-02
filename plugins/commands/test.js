module.exports = {
    name: "test",
    description: "ED Commands - Test Command",
    action: function(e) {
        console.log(e.content);
        e.content = "";
    }
}
