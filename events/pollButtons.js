const { ButtonInteraction } = require("discord.js");

const voters = new Set();

module.exports = {
    name: "interactionCreate",
    /**
     * @param { ButtonInteraction } interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const splitArray = interaction.customId.split("-");
        if (splitArray[0] != "Poll") return;

        if (voters.has(`${interaction.user.id}-${interaction.message.id}`)) {
            return interaction.reply({content: "You've already submitted a vote", ephemeral: true})
        }

        voters.add(`${interaction.user.id}-${interaction.message.id}`);

        const pollEmbed = interaction.message.embeds[0];
        if (!pollEmbed) {
            return interaction.reply({content: "Could not find a poll embed", ephemeral: true})
        }

        const yesField = pollEmbed.fields[0];
        const noField = pollEmbed.fields[1];
        const maybeField = pollEmbed.fields[2];
        const fourField = pollEmbed.fields[3];
        const fiveField = pollEmbed.fields[4];

        const voteCountedReply = "Your vote has been recorded."

        switch (splitArray[1]) {
            case "Yes": {
                const newYesCount = parseInt(yesField.value) + 1;
                yesField.value = newYesCount;

                interaction.reply({content: voteCountedReply, ephemeral: true})
                interaction.message.edit({embeds: [pollEmbed]})
            }
            break;
            case "No": {
                const newNoCount = parseInt(noField.value) + 1;
                noField.value = newNoCount;

                interaction.reply({content: voteCountedReply, ephemeral: true})
                interaction.message.edit({embeds: [pollEmbed]})
            }
            break;
            case "Maybe": {
                const newMaybeCount = parseInt(maybeField.value) + 1;
                maybeField.value = newMaybeCount;

                interaction.reply({content: voteCountedReply, ephemeral: true})
                interaction.message.edit({embeds: [pollEmbed]})
            }
            break;
            case "Four": {
                const newFourCount = parseInt(fourField.value) + 1;
                fourField.value = newFourCount;

                interaction.reply({content: voteCountedReply, ephemeral: true})
                interaction.message.edit({embeds: [pollEmbed]})
            }
            break;
            case "Five": {
                const newFiveCount = parseInt(fiveField.value) + 1;
                fiveField.value = newFiveCount;

                interaction.reply({content: voteCountedReply, ephemeral: true})
                interaction.message.edit({embeds: [pollEmbed]})
            }
            break;

        }
    }
}


