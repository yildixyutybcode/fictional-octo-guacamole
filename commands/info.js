const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require("discord.js")
let Embed = require("../tools/embed.js")
const ytch = require('yt-channel-info')
module.exports = {
data: new SlashCommandBuilder()
  .setName("info")
  .setDescription("Duyuru atılan youtube kanallarıyla alakalı bilgi alırsınız.")
,execute: async(interaction, client) => { 
let err = (e) => interaction.reply({embeds:[Embed(":x: Bir hata ile karşılaşıldı. :x:",e,"error")],ephemeral:true}).catch(err => {})
let duyur = await db.get("duyur_" + interaction.guild.id)
if(!duyur || duyur.length <= 0) return err("Herhangi bir duyuru ayarlanmamış. Ayarlamak için: /duyur")
let embed = Embed("Duyurusu Yapılan Kanallar", "Toplam " + duyur.length + " tane kanalın duyurusu yapılıyor.", "info")
let rows = []
if(interaction.member.permissions.has("Administrator")){
let row = new Discord.ActionRowBuilder() 
let btn = new Discord.ButtonBuilder().setLabel("Etiket Ayarı Yap").setStyle("Primary").setCustomId("pings")
row.addComponents(btn)
rows.push(row)
}
  let i = 0
  while(i < duyur.length){
let d = duyur[i]
var payload = {
  channelId: d.url,
  channelIdType: 0
}
let info = await ytch.getChannelInfo(payload).catch(err2 => {return console.log(err2)})
embed.addFields({name: `Kanal Adı: ${info.author}`, value: `Abone Sayısı: ${info.subscriberText.replace("subscribers", "Abone (Küsüratlar gösterilemez.)")}\nDuyuru Kanalı: ${client.channels.cache.get(d.chn)}`})
i++
}
  interaction.reply({embeds: [embed], components: rows}).catch(err => {
    interaction.channel.send({content: `${interaction.user.toString()}`, embeds: [embed], components: rows}).catch(err => {
          })
  })
}
}