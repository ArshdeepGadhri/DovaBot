const { SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');

// import ms from 'ms';

module.exports = {
    cooldown: 5,
    folder: "features",
    data: new SlashCommandBuilder()
        .setName('remindme')
        .setDescription('Reminds you of a note')
        .addStringOption(option =>
            option
                .setName("time")
                .setDescription('Time until reminder 1s/1m/1h/1w etc')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription('The message to send')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { default: ms } = await import("ms");

        var time = ms(interaction.options.getString("time") || '1m');
        var message = interaction.options.getString("message");

        await interaction.reply({ content: "Your reminder has been noted", ephemeral: true })

        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle(`Your reminder from \`${interaction.options.getString("time")}\` ago.`)
            .setDescription(`\`${message}\``)
            .setTimestamp(true);

        setTimeout(() => {
            interaction.member.user.send({ embeds: [embed] });
        }, time); 

        await interaction.reply({ content: "Your reminder has been noted", ephemeral: true })
    },
};