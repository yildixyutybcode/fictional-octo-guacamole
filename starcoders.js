const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Discord = require("discord.js")
const fs = require("fs")
let ayarlar = require("./ayarlar.json")
let Embed = require("./tools/embed.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const client = new Discord.Client({intents: Object.values(Discord.IntentsBitField.Flags)}) 
const ytch = require('yt-channel-info')

client.on("ready", () => {
	console.log(client.user.username + " Adı ile giriş yapıldı.")
let aray = [
"Coded by Star Coders",
"Geri dönüyoruz"
]
client.user.setActivity(aray[Math.floor(Math.random() * aray.length)], { type: Discord.ActivityType.Playing });
setTimeout(() => {
client.user.setActivity(aray[Math.floor(Math.random() * aray.length)], { type: Discord.ActivityType.Playing });
}, 60000)
})
const { REST, Routes } = require('discord.js');

//Handler
client.commands = new Discord.Collection()
let commandArray = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command)
commandArray.push(command.data.toJSON())
}
//Events
	let eventfunction = (event) => require(`./events/${event}`)(client)
fs.readdirSync("./events").filter(file => file.endsWith(".js")).forEach(event => {

	eventfunction(event)
})
  require("./tools/emoji.js")(client)

  
  
const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
	try {
		console.log('Slash (/) komutları yüklenmeye başlandı.');
			await rest.put(
				Routes.applicationCommands(ayarlar.botid),
				{ body: commandArray },
			).catch(err => {})
		
				console.log('Slash (/) komutları başarıyla yüklendi.');
	} catch (error) {
		console.error(error);
	}
})();
client.on('interactionCreate', async interaction => {
	if (interaction.type !== 4) return;
if(interaction.commandName == "yardım") {
            let focused = interaction.options.getFocused(1)
if(focused.name == "komut"){
focused = focused.value
            let choices = Array.from(interaction.client.commands.keys())
            let filtered = choices.filter(sü => sü.includes(focused))
            const result = filtered.map(choice => ({ name: choice, value: choice }))
let realresult = []
let i = 0
result.forEach(res => {
if(i >= 25) return;
i++
realresult.push(res)
})
interaction.respond(realresult)
}
}
})
//interactionCreate.js
client.on("interactionCreate", async interaction => {
	if(interaction.type !== 2) return

	const command = client.commands.get(interaction.commandName)
	if(!command) return
	try{
		await command.execute(interaction, client) 
	}
	catch(err) {
		interaction.reply("Komutta bir hata oluştu.").catch(err => interaction.channel.send(interaction.user.toString() + " komutta bir hata oluştu."))
		console.log(err)
	}
})



let app = require("express")()
app.get("/", function(req,res){ res.send("Açık he")})

client.on("interactionCreate", async interaction => {
let err = (e) => interaction.reply({embeds:[Embed(":x: Bir hata ile karşılaşıldı. :x:",e,"error")],ephemeral:true}).catch(err => {})
if(interaction.customId && interaction.customId == "pings"){
if(!interaction.member.permissions.has("Administrator")) return err("Bu butonu kullanmak için `Yönetici` yetkisine sahip olmanız gerekmektedir.")  
let duyur = await db.get("duyur_" + interaction.guild.id)
  interaction.reply({embeds: [Embed("Etiket Ayarı Menüsü.", "Etiket ayarını yapmak istediğiniz kanalın adını yazınız. Yazmak için 60 saniyeniz bulunmaktadır.", "info")]})
let filter = async m => m.author.id == interaction.user.id && await db.get("pings_" + m.content.replace(" ","").toLowerCase())
  let msg = await interaction.channel.awaitMessages({filter, max:1, time: 60000, errors: ["time"]}).catch(err =>{return})
  msg.map(x => x)[0].reply({embeds: [Embed("Kanal algılandı.", "Şimdi lütfen bir video atılınca hangi etiketlerin atılmasını istediğini yazınız. Yazmak için 60 saniyeniz bulunmaktadır. (Eğer hiçbir etiket atılmasını istemiyorsanız `yok` yazınız.)", "info")]})
let filter2 = m => m.author.id == interaction.user.id && ((m.mentions.roles.map(x => x).length + m.mentions.everyone) > 0 || m.content.toLowerCase() == "yok")
  let etiketler = await interaction.channel.awaitMessages({filter: filter2, max:1, time: 60000, errors: ["time"]}).catch(err =>{return})
etiketler = etiketler.map(x => x)[0]
  let ever = etiketler.mentions.everyone && etiketler.content.includes("@everyone")
  let here = etiketler.mentions.everyone && etiketler.content.includes("@here")
  let others = etiketler.mentions.roles.map(x => "<@&" + x.id + ">")
if(here) others.push("@here")
if(ever) others.push("@everyone")
db.set("pings_" + msg.map(x => x)[0].content.replace(" ","").toLowerCase(), others)
etiketler.reply({embeds: [Embed("Etiket Ayarı Menüsü", "İşlem tamamlandı artık yeni video video atıldığında duyuru yapılırken " + others.join(",") + " rolleri etiketlenecek.", "info")]})
}
})


setInterval(async() => {
let all = await db.all()
all = all.filter(x => x.id.startsWith("duyur_"))
all.forEach(async x => {
let duyurs = x.value  
duyurs.forEach(async duyur => {
  const payload = {
   channelId: duyur.url,
   sortBy: 'newest',
}
let vids = await ytch.getChannelVideos(payload)
if(vids.items.length >= 1){
if(vids.items[0] && vids.items[0].videoId !== duyur.last){
let vs = vids.items
let thumbnail = vs[0].videoThumbnails.sort((a,b) => b.width - a.width)[0].url
let kanal = vs[0].author
let title = vs[0].title
let dur = vs[0].durationText
let pings = await db.get("pings_" + kanal.replace(" ","").toLowerCase()) ? await db.get("pings_" + kanal.replace(" ","").toLowerCase()) : [`@everyone`]
await client.channels.cache.get(duyur.chn).send({content: pings.join(","), embeds: [Embed(`${kanal} Yeni video video paylaştı.`, `**${title}**`, "info").setImage(thumbnail).setFooter({text: `Video Uzunluğu: ${dur}`})]})
let filtered = await db.get(x.id)  
let news = {
 chn: duyur.chn,
 url: duyur.url,
 last: vs[0].videoId
}
if(typeof filtered !== "object") filtered = []
filtered = filtered.filter(x => x.url !== duyur.url)
  filtered.push(news)
  await db.set(x.id, filtered)
}
}
})
})
}, 5 * 1000)

app.listen(process.env.PORT)
client.login(process.env.token)