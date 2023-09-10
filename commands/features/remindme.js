const { SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');

// import ms from 'ms';

module.exports = {
    cooldown: 5,
    folder: "features",
    data: new SlashCommandBuilder()
        .setName('remindme')
        .setDescription('Reminds you of a note')
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Channel to send the message in")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("time")
                .setDescription('Time until reminder 1s/1m/1h/1w etc')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription('The message itself')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { default: ms } = await import("ms");

        var channel = interaction.options.getChannel("channel");
        var time = ms(interaction.options.getString("time") || '1m');
        var message = interaction.options.getString("message");

        await interaction.reply({ content: "Your reminder has been noted", ephemeral: true })

        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle(`Your reminder from ${ms(time)} ago.`)
            .setDescription(`\`${message}\``)
            .setTimestamp(true);

        setTimeout(() => {
            channel.send({ content: `<@${interaction.member.user.id}>`, embeds: [embed] });
        }, time); 

        await interaction.reply({ content: "Your reminder has been noted", ephemeral: true })
    },
};