const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials, ChannelType } = require('discord.js');
require('dotenv').config();
const token = process.env.TOKEN;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.DirectMessages
	],
	partials: [
		Partials.Channel,
		Partials.Message
	]
});


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
};

let voiceManager = new Collection();

var newCreatedChannels = [];

const channelID = process.env.JOIN_TO_CREATE_CHANNEL;
const userLimit = process.env.JOIN_TO_CREATE_USER_LIMIT;

client.on("voiceStateUpdate", async (oldState, newState) => {


	const { member, guild } = oldState;
	const newChannel = newState.channel;
	const oldChannel = oldState.channel;


	try {
		if (oldChannel) {
			let channelName = oldChannel.name;
			if (channelName.includes(`'s vc`) && channelName.includes("🔊")) {
				if (oldChannel.members.size == 0) {
					oldChannel.delete().catch(console.error)
				}
			}
		}
	} catch (err) {
		console.log(`Error: ${err}`)
	}

	const channel = client.channels.cache.get(channelID);

	if (oldChannel !== newChannel && newChannel && newChannel.id === channel.id) {
		const voiceChannel = await guild.channels.create({
			name: `🔊 ${member.user.displayName}'s vc`,
			type: ChannelType.GuildVoice,
			parent: newChannel.parent,
			permissionOverwrites: [
				{
					id: member.id,
					allow: ["Connect", "ManageChannels"]
				},
				{
					id: guild.id,
					allow: ["Connect"]
				}

			],
			userLimit: userLimit
		})

		newCreatedChannels.push(voiceChannel.id);

		voiceManager.set(member.id, voiceChannel.id);

		await newChannel.permissionOverwrites.edit(member, { Connect: false });

		setTimeout(() => {
			newChannel.permissionOverwrites.delete(member)
		}, 30000);

		return setTimeout(() => {
			member.voice.setChannel(voiceChannel)
		}, 500);

	}

	const jointocreate = voiceManager.get(member.id);
	const members = oldChannel?.members.filter((members) => !members.user.bot).map((members) => members.id);

	if (jointocreate && oldChannel.id === jointocreate && (!newChannel || newChannel.id !== jointocreate)) {
		if (members.length > 0) {
			let randomID = members[Math.floor(Math.random() * members.length)];
			let randomMember = guild.members.cache.get(randomID);

			randomMember.voice.setChannel(oldChannel).then((voice) => {
				oldChannel.setName(`🔊 ${randomMember.user.displayName}'s vc`).catch((err) => {
					console.log(`Error: ${err}`)
				})
				oldChannel.permissionOverwrites.edit(randomMember, { Connect: true, ManageChannels: true })
			})
			voiceManager.set(member.id, null);
			voiceManager.set(randomMember.id, oldChannel.id)
		} else {
			voiceManager.set(member.id, null)
			oldChannel.delete().catch((err) => {
				console.log(`Error: ${err}`)
			})
		}
	}
})

client.login(token);

