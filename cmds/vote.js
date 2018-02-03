const agree = "👍";
const disagree = "👎"


module.exports.run = async(bot, message, args) => {
  //const msgs =  await message.channel.awaitMessage(msg => { msg.content.inculde("hi"), {time: 5000});
   let msg = await message.channel.send("Vote");
   await msg.react(agree);
   await msg.react(disagree);
    
   const reactions = await msg.awaitReactions(reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: 1500});  
   message.channel.send(`Voting complete! \n\n${agree}: ${reactions.get(agree).count-1}\n${disagree}: ${reactions.get(disagree).cont-1}`);

}

module.exports.help = {
    name:"vote"
}