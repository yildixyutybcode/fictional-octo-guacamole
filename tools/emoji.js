module.exports = (client) => {
  client.emoji = function(e){
let bul = client.emojis.cache.find(x => x.name == e)
if(!bul){
return "Emoji bulunamadı."
} else {
let a = bul.animated == true ? "a" : ""
return `<${a}:${bul.name}:${bul.id}>`
}
  }
}