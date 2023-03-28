const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require("discord.js")
let Embed = require("../tools/embed.js")
const ytch = require('yt-channel-info')
const { channelId } = require("@gonetone/get-youtube-id-by-url")
module.exports = {
data: new SlashCommandBuilder()
  .setName("kaldır")
  .setDescription("Bir kanalın duyurusunu durdurursunuz.")
  .addStringOption(option =>
                  option.setName("kanal")
                   .setDescription("Duyurusunu durdurmak istediğiniz kanalın urlsi.")
                   .setRequired(true)
                  )
,execute: async(interaction, client) => { 
let err = (e) => interaction.reply({embeds:[Embed(":x: Bir hata ile karşılaşıldı. :x:",e,"error")],ephemeral:true}).catch(err => {})
let duyur = await db.get("duyur_" + interaction.guild.id)
if(!interaction.member.permissions.has("Administrator")) return err("Bu komutu kullanmak için `Yönetici` yetkisine ihtiyacınız bulunmaktadır.")
if(!duyur || duyur.length <= 0) return err("Zaten herhangi bir duyuru ayarlanmamış. Ayarlamak için: /duyur")
let kanal = await channelId(interaction.options.getString("kanal"))
if(!kanal) return err("Lütfen düzgün bir url giriniz. (Örneğin: https://youtube.com/starcoders@7546)")
if(!duyur.some(x => x.url == kanal)) return err("Böyle bir kanalın duyurusu yapılmıyor.")
let filtered = duyur.filter(x => x.url !== kanal)
db.set(`duyur_${interaction.guild.id}`, filtered)
interaction.reply({embeds: [Embed("İşlem Başarılı", "Girdiğiniz kanalın duyuruları artık bu sunucuda yapılmayacak.", "info")]})
}
}