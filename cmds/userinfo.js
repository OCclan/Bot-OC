const Discord = module.require ("Discord.js");

module.exports.run = async(bot,message,args) => {
    let embed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setDescription("This is the user's info!")
    .setColor("#9B5986")
    .addField("Full Username", message.author.tag)
    .addField("ID", message.author.id)
    .addField("Created At", message.author.createdAt)
    .setThumbnail(message.author.avatarURL);

    message.channel.send({embed: embed});

}
module.exports.help = {
    name:"userinfo"
}