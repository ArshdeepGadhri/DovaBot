const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

const data = new SlashCommandBuilder()
	.setName('clear')
	.setDescription('Delete messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
	.addNumberOption(option => 
        option.setName('amount')
        .setDescription('The amount of messages to delete')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName("reason")
        .setDescription('The action reason')
        .setRequired(true)
    )
    .addUserOption(option => 
        option.setName("target")
        .setDescription('The target user')
    );

   

module.exports = {
	cooldown: 5,
    folder: "features",
	data: data,
	async execute(interaction) {

        const channelMessages = await interaction.channel.messages.fetch();

        var logEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({name: "Clear Command used"})
    
        var amount = interaction.options.getNumber("amount");
        var reason = interaction.options.getString("reason");
        var user = interaction.options.getUser("target");

        var embed = [
            `- Mod: ${interaction.member}`,
            `- Target: ${user || "None"}`,
            `- Channel: ${interaction.channel}`,
            `- Reason: ${reason}`
        ]

        if (user) {
            let i = 0;
            let messagesToDelete = [];
            channelMessages.filter(message => {
                if (message.author.id === user && amount > i){
                    messagesToDelete.push(message);
                    i++
                }
            })
            
            await interaction.channel.bulkDelete(messagesToDelete, true).then(messages => {
                embed.push(`- Cleared: ${messages.size} from ${user}`);
                logEmbed.setDescription(embed.join("\n"));
                //interaction.reply({embeds: [logEmbed], files: [transcript], ephemeral: true});
                interaction.reply({embeds: [logEmbed], ephemeral: true});
            })
        } else {
            
            await interaction.channel.bulkDelete(amount, true).then(messages => {
                embed.push(`- Cleared: ${messages.size}`);
                logEmbed.setDescription(embed.join("\n"));
                //interaction.reply({embeds: [logEmbed], files: [transcript], ephemeral: true});
                interaction.reply({embeds: [logEmbed], ephemeral: true});
            })

        }
	},
};