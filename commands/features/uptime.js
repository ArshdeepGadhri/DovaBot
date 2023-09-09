const { SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');

function getBotUptime() {
  const totalSeconds = process.uptime();
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

function sendUptimeMessage(Channel) {
  if (Channel) {
    const uptime = getBotUptime();

    // Create an embedded message
    const embed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setTitle('Bot Uptime')
      .setDescription(`\`Bot uptime: ${uptime}\``);

      Channel.send({ embeds: [embed] });
  }
}


module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Sends the bot\'s uptime periodically')
    .addChannelOption(option => 
      option
        .setName("channel")
        .setDescription("Channel to send the message in")
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName("hours")
        .setDescription('Uptime refresh hour')
    ),
  async execute(interaction) {
    var channel = interaction.options.getChannel("channel"); 
    var hours = interaction.options.getNumber("hours") || 1; 

    sendUptimeMessage(channel);

    setInterval(() => {
      sendUptimeMessage(channel);
    }, 3600000 * hours); // 1 hour interval (3600000 ms)
  },
};