const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require("discord.js")
let Embed = require("../tools/embed.js")
const ytch = require('yt-channel-info')
const { channelId } = require("@gonetone/get-youtube-id-by-url")
module.exports = {
data: new SlashCommandBuilder()
  .setName("duyur")
  .setDescription("Youtube kanalınıza video attığınızda bir kanalda duyuru atılmasını ayarlarsınız.")
.addStringOption(option =>
		option
			.setName('youtube')
			.setDescription('Videoların takip edileceği youtube kanalı. (https://www.youtube.com/@starcoders7546)')
      .setRequired(true)
                )
.addChannelOption(option =>
                 option.setName("kanal")
                  .setDescription("Duyuruların atılacağı discord kanalı.")
      .setRequired(true)
                 )
  ,execute: async(interaction, client) => { 
let err = (e) => interaction.reply({embeds:[Embed(":x: Bir hata ile karşılaşıldı. :x:",e,"error")],ephemeral:true}).catch(err => {})
let youtube = interaction.options.getString("youtube")
let chn = interaction.options.getChannel("kanal")
let yt = youtube.replace("https", "http").replace("www.", "")
let duyur = await db.get("duyur_" + interaction.guild.id)
if(!interaction.member.permissions.has("Administrator")) return err("Bu komutu kullanmak için `Yönetici` yetkisine sahip olmanız gerekmektedir.")
if(!yt.includes("http://youtube.com/channel/") && !yt.includes("http://youtube.com/user/") && !yt.includes("http://youtube.com/")) return err("Lütfen düzgün bir url giriniz. Örneğin: https://www.youtube.com/@starcoders7546")
let url = await channelId(youtube).catch(e2 => {return err("Girdiğiniz url herhangi bir youtube kanalına ait değil. (Sadece kanal adı veya id'si kabul edilmez. Link biçiminde girmeniz zorunludur.)")})
if(chn.type == 4 || chn.type == 2) return err("Duyuruların atılacağı kanal bir ses kanalı veya kategori olamaz.")
if(duyur && duyur.some(x => x.url == url)) return err("Girdiğiniz kanalın duyuruları zaten atılıyor. Eğer kanalı değiştirmek istiyorsanız önce silmeniz gerekiyor: /sil")
   const payload = {
   channelId:url,
   sortBy: 'newest',
}
ytch.getChannelVideos(payload).then(async(response) => {
  let vs = response.items
let embed = Embed("Başarılı", "", "info")
let desc = "Artık girdiğiniz kanala her bir yeni video atıldığında bot otomatik olarak duyuru atıp etiket atacak. Etiket ayarını kapayıp açmak için: /info"
let row;
if(vs && vs.length > 0){
desc += "\nKanalda zaten atılmış olan son videoyu duyurmak için alttaki butonu kullanabilirsin. (Buton sadece 60 saniyeliğine geçerli olacaktır.)"  
row = [new Discord.ActionRowBuilder()]
let btn = new Discord.ButtonBuilder()
.setStyle("Primary")
.setCustomId(`sonduyur`)
.setLabel("Son Videoyu Duyur")
row[0].addComponents(btn)
}
embed.setDescription(desc)
if(!await db.get("pings_" + vs[0].author.replace(" ","").toLowerCase())){
db.set("pings_" + vs[0].author.replace(" ","").toLowerCase(), ["@everyone"])  
}
interaction.reply({embeds: [embed], components: row !== null ? row : []})
if(!duyur) db.set("duyur_" + interaction.guild.id, [{chn: chn.id, url: url, last: vs[0] ? vs[0].videoId : null}])  
  else db.push("duyur_" + interaction.guild.id, {chn: chn.id, url: url, last: vs[0] ? vs[0].videoId : null})
if(vs.length > 0){
let msg = await interaction.fetchReply()
const filter = (i) => i.customId.startsWith("sonduyur") && interaction.user.id === i.user.id;
let cmp = await interaction.channel.awaitMessageComponent({filter, time: 60000}).catch(err => {return})
msg.edit({components: []})   
let thumbnail = vs[0].videoThumbnails.sort((a,b) => b.width - a.width)[0].url
let kanal = vs[0].author
let title = vs[0].title
let dur = vs[0].durationText
let pings = await db.get("pings_" + kanal.replace(" ","").toLowerCase()) ? await db.get("pings_" + kanal.replace(" ","").toLowerCase()) : [`@everyone`]
interaction.guild.channels.cache.get(chn.id).send({content: pings.join(","), embeds: [Embed(`${kanal} Yeni video video paylaştı.`, `**${title}**`, "info").setImage(thumbnail).setFooter({text: `Video Uzunluğu: ${dur}`})]})
}
}).catch((err) => {
   console.log(err)
})

}
}