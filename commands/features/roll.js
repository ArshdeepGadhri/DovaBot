const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll a die!')
        .addNumberOption(option => 
            option
            .setName("size")
            .setDescription('The Number of sides to the die')
        ),
	async execute(interaction) {
        const sides = interaction.options.getNumber("size") || 6; 
        const result = Math.floor(Math.random() * sides) + 1;
        interaction.reply(`You rolled a ${result} on a ${sides}-sided dice!`);
	},
};