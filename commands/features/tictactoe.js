const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const TicTacToe = require("discord-tictactoe");
const game = new TicTacToe({ language: "en", commandOptionName: "opponent"});

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setDescription('Play tictactoe')
        .addUserOption(option => 
            option.setName("opponent")
            .setDescription('The opponent user')
        ),
	async execute(interaction) {
        game.handleInteraction(interaction)
	},
};