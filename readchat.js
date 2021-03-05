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

function randomHSL(){
	let rand = Math.random
	return `hsl( ${360*rand()}, ${25+70*rand()}, ${85+10*rand()})`
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
	if (ColorChat) console.log(chalk.blueBright(`<ℹ> ENABLING COLORED TEXT MODE <ℹ>`));


	var UniqueTitle = (cmdArgs[2] == 'true')
	if (UniqueTitle) console.log(chalk.blueBright(`<ℹ> ENABLING UNIQUE TITLES MODE <ℹ>`));

	var UseRGB = (cmdArgs[3] == 'true')
	if (UseRGB) console.log(chalk.blueBright(`<ℹ> SWITCHING FROM HSL TO RGB <ℹ>`));
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
	console.log(chalk.redBright(`<⛔> TWITCH DISCONNECTED: ${reason} <⛔>`))
})

var color1 = (UseRGB)? randomRGB() : randomHSL()
var color2 = (UseRGB)? randomRGB() : randomHSL()
var color3 = (UseRGB)? randomRGB() : randomHSL()

Client.on('message', (channel, user, message, self) => {
	if (self) return;
	if (UniqueTitle){
		color3 = (UseRGB)? randomRGB() : randomHSL()
	}

	var username 	= user['username']
	var message 	= message.replace(/[^\x00-\x7F]/g, "")

	var datestr 	= chalk `{${color1} [} {${color2} ${moment(Date.now()).format('h:mm:ss')}} {${color1} ]} {${color2} ||}`
	var namestr 	= chalk `{bold.${color3} ${username}${" ".repeat(25-username.length)}}`
	var messstr		= (ColorChat) ? chalk `{${color3} ${message}}` : message
	console.log(`${datestr} ${namestr} : ${messstr}`)
});


// --> ESTABLISH CONNECTIONS
Client.connect()