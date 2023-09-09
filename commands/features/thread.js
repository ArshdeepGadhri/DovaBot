const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('thread')
	.setDescription('Create a thread in a specified channel')
	.addChannelOption(option => 
        option.setName('channel')
        .setDescription('The channel to create the thread in')
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName("title")
        .setDescription('The thread title')
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName("reason")
        .setDescription('The thread reason')
    );
    

module.exports = {
	cooldown: 5,
    folder: "features",
	data: data,
	async execute(interaction) {
        var channel = interaction.options.getChannel("channel");
    
        var title = interaction.options.getString("title");
        var description = interaction.options.getString("reason");

        await channel.threads.create({ name: title, message: { content: description }, reason: description, appliedTags: ['tagID', 'anotherTagID'] });
	},
};