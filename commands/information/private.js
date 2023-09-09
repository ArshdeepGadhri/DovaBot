const { SlashCommandBuilder, ChannelType, ThreadAutoArchiveDuration } = require('discord.js')

module.exports = {
    cooldown: 5,
    folder: "information",
    data: new SlashCommandBuilder()
        .setName('private')
        .setDescription('Create a private channel'),
    async execute(interaction) {
        const channel = interaction.channel;
        const user = interaction.user;
        const userName = user.username;
        const threadName = userName + "'s Private Channel";
        try {
            // Create a new private thread 
            const threadChannel = await channel.threads
                .create({
                    name: threadName,
                    autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
                    type: ChannelType.PrivateThread,
                    reason: 'Inquiries',
                });

            await threadChannel.members.add(user);

            await interaction.reply({
                content: 'A private channel has been created for you!',
                ephemeral: true,
            });
        } catch (error) {
            console.log(error);
        }
    }
}