const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const wait = require('util').promisify(setTimeout);


module.exports = async(client) => class Noobing{
static createPages(interaction, embeds, rightEmoji, leftEmoji, cancelEmoji, msg){
        if (!rightEmoji) throw new TypeError(`Sonraki sayfa emojisi girmelisiniz.`);
        if (!leftEmoji) throw new TypeError(`Önceki sayfa emojisi girmelisiniz.`);
        if (!leftEmoji) throw new TypeError(`Embed iptal emojisi girmelisiniz.`);
        if(!embeds || embeds.length < 1){
interaction.editReply({content:"Bir hata oluştu ve sayfalı embed oluşturulamadı.", ephemeral: true}).catch(err => {
interaction.reply({content:"Bir hata oluştu ve sayfalı embed oluşturulamadı.", ephemeral: true}).catch(err => {
interaction.channel.send("Bir hata oluştu ve sayfalı embed oluşturulamadı.")
})
})
return
}
let buttonStyle = "Primary"
        const fowardButton = new ButtonBuilder()
            .setStyle(buttonStyle)
            .setEmoji(rightEmoji)
            .setCustomId('next-page');

        const backButton = new ButtonBuilder()
            .setStyle(buttonStyle)
            .setEmoji(leftEmoji)
            .setCustomId('back-page');

        const deleteButton = new ButtonBuilder()
            .setStyle(buttonStyle)
            .setEmoji(cancelEmoji)
            .setCustomId('delete-page');

        const interactiveButtons = new ActionRowBuilder()
            .addComponents(backButton)
            .addComponents(deleteButton)
            .addComponents(fowardButton);
if(embeds.length == 1){
interaction.editReply({embeds: [embeds[0]] }).catch(err => {
interaction.channel.send({embeds: [embeds[0]] }).catch(err => {})
})
return
}
interaction.editReply({components: [interactiveButtons], embeds: [embeds[0]] }).catch(err => {
console.log(err)
interaction.channel.send("Sayfa kısmında bir sorun oluştu.")    
}).then(x => {
global.db["data_" + msg.id] = {interactor: interaction.user,message: msg, embeds: embeds, currentPage: 0, components: interactiveButtons}
})

}

}
