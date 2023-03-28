module.exports = (text) => {
  if (!text) throw new Error("Bir emoji gir\npls write an emoji");
  text = decodeURIComponent(text);
  if (text.includes("%")) text = decodeURIComponent(text);
  if (!text.includes(":")) return { animated: false, name: text, id: null };
  const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
  let a = {};
  a.animated = Boolean(match[1]);
  a.name = match[2];
  a.id = match[3];
  a.url =
    a.animated == true
      ? "https://cdn.discordapp.com/emojis/" + a.id + ".gif"
      : "https://cdn.discordapp.com/emojis/" + a.id + ".png";
  return a;
};
