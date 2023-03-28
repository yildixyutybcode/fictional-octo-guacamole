const Discord = require("discord.js");
const { EmbedBuilder } = Discord;

module.exports = (title, description, color, gif) => {
  const infoEmbed = new EmbedBuilder().setTitle(title);
  if (description !== "") infoEmbed.setDescription(description);
  let newColor = "";
  if (color == "error") newColor = "#ff0000";
  else if (color == "info") newColor = "#1f75ff";
  else if (color == "warn") newColor = "#eeff00";

  if (newColor == "" && color) infoEmbed.setColor(color);
  else if (newColor !== "") infoEmbed.setColor(newColor);

  return infoEmbed;
};
