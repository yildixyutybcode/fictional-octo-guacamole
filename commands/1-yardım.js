const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require("discord.js")
let Embed = require("../tools/embed.js")
module.exports = {
category: "Genel",
data: new SlashCommandBuilder()
  .setName("yardım")
  .setDescription("Yardım menüsünü gösterir.")
.addStringOption(option =>
		option
			.setName('komut')
			.setDescription('Hakkında yardım almak istediğiniz komut.')
			.setAutocomplete(true)
)
,execute: async(interaction, client) => { 
if(!interaction.options.getString("komut")){
let embed = Embed(client.user.username + " Yardım Menüsü","Komutlar aşağıda gösterildi.","info").setFooter({text: "[] = Zorunlu & () = İsteğe göre"})
client.commands.forEach(cmd=>{
cmd = cmd.data
let req = client.commands.get(cmd.name).data.options.filter(x => x.required).map(x => `[${x.name}]`).join(" ")
let noreq = client.commands.get(cmd.name).data.options.filter(x => !x.required).map(x => `(${x.name})`).join(" ")
embed.addFields([{name: "/"+cmd.name+" "+req+" "+noreq, value: cmd.description}])
})
interaction.reply({embeds: [embed]})
} else {
let req = client.commands.get(interaction.options.getString("komut")).data.options.filter(x => x.required).map(x => `[${x.name}]`).join(" ")
let noreq = client.commands.get(interaction.options.getString("komut")).data.options.filter(x => !x.required).map(x => `(${x.name})`).join(" ")
interaction.reply({embeds:[Embed("/"+client.commands.get(interaction.options.getString("komut")).data.name+" komutunun bilgileri","**Komut adı:** \n"+client.commands.get(interaction.options.getString("komut")).data.name,"info").addFields([{name: "Komut açıklaması:",value: client.commands.get(interaction.options.getString("komut")).data.description},{name: "Komut kullanımı:",value: "/"+client.commands.get(interaction.options.getString("komut")).data.name+" "+req+" "+noreq}, {name: "Komut Kategorisi:",value: client.commands.get(interaction.options.getString("komut")).category}]).setFooter({text: "[] = Zorunlu & () = İsteğe göre"})]})
}
}
}