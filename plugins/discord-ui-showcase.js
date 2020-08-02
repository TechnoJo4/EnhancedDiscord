const Plugin = require("../plugin");

module.exports = new Plugin({
	name: "Discord UI Generator Showcase",
	description: "Renders some shit in your settings tab.",
	author: "jakuski",
	color: "rgb(82, 133, 255)",
	config: {},
	load() {},
	generateSettings() {
		const section = (name, ...children) => {
			return [
				{
					type: "std:divider",
					top: "20px",
					bottom: "20px"
				},
				{
					type: "std:title",
					content: name,
					tag: "h5"
				},
				...children
			]
		}
		return [
			{
				type: "std:divider",
				bottom: "20px"
			},
			{
				type: "std:title",
				content: "std:title",
				tag: "h5"
			},
			...this.generateTitles(),
			...section("std:description", ...this.generateDescriptions()),
			...section("std:divider", {
				type: "std:divider",
				top: "20px",
				bottom: "20px"
			}),
			...section("std:spacer", {
				type: "std:spacer",
				space: "20px"
			}),
			...section("input:text", ...this.generateTextInputs()),
			...section("input:boolean", ...this.generateSwitchItems()),
			...section("input:radio", ...this.generateRadios()),
			...section("input:select", ...this.generateSelects()),
			...section("input:slider", ...this.generateSliders())
		]
	},
	generateTitles() {
		const final = [];

		for (i = 1; i < 6; i++) {
			final.push({
				type: "std:title",
				content: `This is a H${i} title`,
				tag: `h${i}`
			});
		}

		final.push({
			type: "std:title",
			content: "This is a 'label' title",
			tag: "label"
		});

		return final;
	},
	generateDescriptions() {
		const final = [];
		const sampleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et erat neque. Nunc id sollicitudin massa, ut aliquam nunc. Proin varius nunc magna, id varius."

		Object.values(ED.discordComponents.Text.Types).forEach(type => {
			final.push({
				type: "std:description",
				descriptionType: type,
				content: `This is a '${type}' type description. ${sampleText}`
			},{
				type: "std:spacer",
				space: "20px"
			});
		});

		return final;
	},
	generateTextInputs () {
		return [
			{
				type: "input:text",
				title: "props.title",
				desc: "props.desc, __supports__ **markdown** *too!* [look at me bitch](https://www.google.com)",
				placeholder: "props.placeholder",
				configName: "textbox-1"
			},
			{
				type: "input:text",
				title: "Number only input",
				desc: "Try entering letters.",
				placeholder: "42069",
				configName: "textbox-2",
				number: true
			},
			{
				type: "input:text",
				title: "Disabled textbox",
				desc: "hey look a disabled input, just like you.",
				placeholder: "Can't write here bish",
				configName: "textbox-disabled",
				disabled: true
			},{
				type: "input:text",
				title: "Mini textbox",
				desc: "Hey look look a mini textbox, just like your dick.",
				placeholder: "Damn.",
				configName: "textbox-3",
				mini: true
			}
		]
	},
	generateSwitchItems () {
		return [
			{
				type: "input:boolean",
				configName: "boolean",
				title: "props.title",
				note: "props.note, this section supports **markdown** too!",
			},
			{
				type: "input:boolean",
				configName: "boolean-disabled",
				title: "Disabled switch",
				note: "It does not give you consent to touch it. Creep.",
				disabled: true,
			},
			{
				type: "input:boolean",
				configName: "boolean-2",
				title: "Mini switch",
				note: "fits in your backpocket",
				mini: true,
				hideBorder: true
			},

		]
	},
	generateRadios () {
		return [
			{
				type: "input:radio",
				configName: "radio-1",
				title: "props.title",
				desc: "props.desc",
				options: [
					{
						name: "props.options[].name",
						desc: "props.options[].desc",
						value: "option1"
					},
					{
						name: "click me bitch",
						value: "option2"
					},
					{
						name: "i'm green",
						desc: "because i'm a good girl",
						color: "#2fa04e",
						value: "option3"
					},
					{
						name: "I'm red",
						desc: "because i'm a bad bitch",
						color: "#a02f2f",
						value: "option4"
					},
					{
						name: "I'm yellow",
						color: "#ff07f5",
						value: "option5"
					}
				]
			},{
				type: "input:radio",
				configName: "radio-2",
				title: "Disabled Radio",
				options: ["cant","touch","this"].map(e => ({name: e, value: e})),
				desc: "yeye",
				disabled: true
			},{
				type: "input:radio",
				configName: "radio-2",
				title: "tight radio",
				options: ["just","like","your","sister"].map(e => ({name: e, value: e})),
				desc: "for legal reasons i must state this is a joke",
				size: "1px"
			},{
				type: "input:radio",
				configName: "radio-2",
				title: "phat radio",
				options: ["just","like","your","mum"].map(e => ({name: e, value: e})),
				desc: "honesty is the best policy",
				size: "25px"
			}
		]
	},
	generateSelects () {
		return [
			{
				type: "input:select",
				configName: "select-1",
				title: "props.title",
				desc: "props.desc",
				options: [
					{ label: "props.options[].label", value: "opt1" },
					{ label: "yeet", value: "opt2" },
					{ label: "more options", value: "opt3" }
				]
			},{
				type: "input:select",
				configName: "select-2",
				title: "searchable select",
				desc: "like you can do a google",
				searchable: true,
				options: `Start	typing! What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.`
					.split(" ")
					.map(e => ({label: e, value: e})) // this is uh, not good practise lmao.
			},{
				type: "input:select",
				configName: "select-disabled",
				title: "disabled select",
				desc: "you get the point",
				disabled: true,
				options: []
			}
		]
	},
	generateSliders() {
		return [
			{
				type: "input:slider",
				configName: "slider-1",
				title: "props.title",
				desc: "props.desc",
				defaultValue: 50,
				minValue: 0,
				maxValue: 100,
			},
			{
				type: "input:slider",
				configName: "slider-2",
				title: "Slider with markers",
				desc: "some fanci shit",
				defaultValue: 50,
				markers: [
					0,10,20,30,40,50,60,69,80,90,100
				],
				minValue: 0,
				maxValue: 100,
			},
			{
				type: "input:slider",
				configName: "slider-3",
				title: "Slider that sticks to markers",
				desc: "try landing between a marker",
				defaultValue: 50,
				markers: [
					0,10,20,30,40,50,60,69,80,90,100
				],
				stickToMarkers: true,
				minValue: 0,
				maxValue: 100,
			},
			{
				type: "input:slider",
				configName: "slider-4",
				title: "Slider that sticks to markers with highlighted default",
				desc: "haha thats the sex number",
				defaultValue: 69,
				highlightDefaultValue: true,
				markers: [
					0,10,20,30,40,50,60,69,80,90,100
				],
				stickToMarkers: true,
				minValue: 0,
				maxValue: 100,
			},
			{
				type: "input:slider",
				configName: "slider-5",
				title: "Slider with formatted tooltip",
				desc: "Look at the tooltip when you drag across",
				defaultValue: 0,
				markers: [
					0,10,20,30,40,50,60,69,80,90,100
				],
				formatTooltip: e => `you are ${e.toFixed(0)}% gay`,
				minValue: 0,
				maxValue: 100,
			},
			{
				type: "input:slider",
				configName: "slider-6",
				title: "Disabled slider",
				defaultValue: 50,
				markers: [
					0,10,20,30,40,50,60,69,80,90,100
				],
				disabled: true,
				minValue: 0,
				maxValue: 100,
			}
		]
	}
});