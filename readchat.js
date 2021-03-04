// --> LOAD MODULES <--
const path = require("path")
const moment = require('moment')
const chalk = require('chalk')

const Twitch = require('tmi.js')

// --> DEPENDENCIES <--
function randomRGB() {
	let round = Math.round, rand = Math.random, max = 255;
    return `rgb( ${round(rand()*max)}, ${round(rand()*max)}, ${round(rand()*max)})`;
}

// --> INITIALIZATION <--
console.clear()

const cmdArgs = process.argv.slice(2)
if (cmdArgs.length < 1) {
	console.log(chalk.redBright(`<⛔> MISSING CHANNEL ARGUMENT <⛔>`))
	console.log(chalk.blueBright(`<ℹ> node readchat *CHANNELNAME* [ColorChat] [RainbowNames] <ℹ>`))
	process.exit(1)
	return
} else {
	console.log(chalk.greenBright(`<✔> CONNECING TO \`${cmdArgs[0]}\` <✔>`))

	var ColorChat = (cmdArgs[1] == 'true')
	if (ColorChat) console.log(chalk.blueBright(`<ℹ> ENABLING COLORED CHAT MODE <ℹ>`));


	var UniqueTitle = (cmdArgs[2] == 'true')
	if (UniqueTitle) console.log(chalk.blueBright(`<ℹ> ENABLING UNIQUE TITLES MODE <ℹ>`));
}

const Client = new Twitch.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: [ cmdArgs[0] ]
});

// --> TWITCH BOT <--
Client.on('connected', (addr, port) => {
	console.log(chalk.greenBright(`<✔> TWITCH CONNECTED: ${addr}:${port} <✔>`))
})

Client.on('disconnected', (reason) => {
	console.log(chalk.redBright(`<⛔> Twitch disconnected: ${reason} <⛔>`))
})

var color1 = randomRGB()
var color2 = randomRGB()
var color3 = randomRGB()

Client.on('message', (channel, user, message, self) => {
	if (self) return;
	if (UniqueTitle){
		color3 = randomRGB()
	}

	var username 	= user['username']
	var message 	= message.replace(/[^\x00-\x7F]/g, "")

	var datestr 	= chalk `{${color1} [} {${color2} ${moment(Date.now()).format('h:mm:ss')}} {${color1} ]} {${color2} ||}`
	var namestr 	= chalk `{bold.rgb(25, 255, 100) {${color3} ${username}}${" ".repeat(25-username.length)}}`
	var messstr		= (ColorChat) ? chalk `{${color3} ${message}}` : message
	console.log(`${datestr} ${namestr} : ${messstr}`)
});


// --> ESTABLISH CONNECTIONS
Client.connect()