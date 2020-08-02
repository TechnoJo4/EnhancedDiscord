module.exports = [[
        /(,\w+?=)(\{[a-z]+?:\{action:function\()/, /* )}} */
        "$1window._CMD_ACTIONS=$2"
    ], [
        /(var P=)(\[\]\.concat\(\(0,\w+?\.default\)\(\w+?\.ChannelTextAreaIntegrations\))/, // )
        "$1window._CMD_AUTOCOMPLETE=$2"
    ]
];
