const botSettings = require("./botSettings.json");
const Discord = require("discord.js");
const fs = require("fs");
const YTDL = require("ytdl-core");

const bot = new Discord.Client();
const prefix = botSettings.prefix;

function generateHex() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {fliter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
      if (server.queue[0]) play(connection, message);
      else connection.disconnect();
  });
}

var server = {};



bot.on('message', message => {
    if(message.author === bot.user) return;
    if(message.content.startsWith(prefix + 'help')) {
        message.channel.sendMessage('Hello, Im OC bot!, use OCinfo:wink:');
      } 
    });

    bot.commands = new Discord.Collection();
    bot.mutes = require("./mutes.json");
    
    
    
    
    fs.readdir("./cmds/",(err,files) => {
      if(err) console.error(err);
    
      let jsfiles = files.filter(f => f.split(".").pop() === "js");
      if(jsfiles.length <= 0) {
        console.log("No commands to load!");
        return;
      }
      console.log(`Loading ${jsfiles.length} commands!`);
    
      jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
        
    
      });
    });
    
    bot.on("ready",() => {
      console.log(`Bot is ready! ${bot.user.username}!`);
      console.log(`Logged in as ${bot.user.tag} (${bot.user.id}) on ${bot.guilds.size} servers`);
      bot.user.setGame(`${bot.guilds.size} servers`)
    
    
    bot.setInterval(() => {
     for(let i in bot.mutes) {
        let time = bot.mutes[i].time;
        let guildId = bot.mutes[i].guild;
        let guild = bot.guilds.get(guildId);
        let member = guild.members.get(i);
        let mutedRole = guild.roles.find(r => r.name === "OC muted");
        if(!mutedRole) continue;
    
        if(Date.now() > time) {
           console.log(`${i} is now able to be unmuted!`);
    
    
           member.removeRole(mutedRole);
           delete bot.mutes[i];
    
           fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
             console.log(`I have unmuted ${member.user.tag}.`);
           });
        }
     }
    }, 5000)
    });
    
    // bot.on('message', message => {
    //     if(message.author === bot.user) return;
    //     if(message.content.startsWith(prefix + 'help')) {
    //         message.channel.sendMessage('Hello, Im OC bot!, use OCinfo:wink:');
    //       } 
    //     });
    
        const config = require("./config.json");
         bot.on("message", async message => {
        
         
            // This event will run on every single message received, from any channel or DM.
            
            // It's good practice to ignore other bots. This also makes your bot ignore itself
            // and not get into a spam loop (we call that "botception").
            if(message.author.bot) return;
            
            // Also good practice to ignore any message that does not start with our prefix, 
            // which is set in the configuration file.
            
            
            // Here we separate our "command" name, and our "arguments" for the command. 
            // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
            // command = say
            // args = ["Is", "this", "the", "real", "life?"]
            const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
      
            
            // Let's go with a few common example commands! Feel free to delete or change those.
         
            
            if(message.content.startsWith(prefix + 'ping')) {
              // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
              // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
              const m = await message.channel.send("Ping?");
              m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
            }
            
    
            
            if(message.content.startsWith(prefix + 'kick')) {
              // This command must be limited to mods and admins. In this example we just hardcode the role names.
              // Please read on Array.some() to understand this bit: 
              // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
              if(!message.member.roles.some(r=>["Staff"].includes(r.name)) )
                return message.reply("Sorry, you don't have permissions to use this!");
              
              // Let's first check if we have a member and if we can kick them!
              // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
              let member = message.mentions.members.first();
              if(!member)
                return message.reply("Please mention a valid member of this server");
              if(!member.kickable) 
                return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
              
              // slice(1) removes the first part, which here should be the user mention!
              let reason = args.slice(1).join(' ');
              if(!reason)
                return message.reply("Please indicate a reason for the kick!");
              
              // Now, time for a swift kick in the nuts!
              await member.kick(reason)
                .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
              message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
          
            }
     
            
            if(message.content.startsWith(prefix + 'ban')) {
              // Most of this command is identical to kick, except that here we'll only let admins do it.
              // In the real world mods could ban too, but this is just an example, right? ;)
              if(!message.member.roles.some(r=>["Staff"].includes(r.name)) )
                return message.reply("Sorry, you don't have permissions to use this!");
              
              let member = message.mentions.members.first();
              if(!member)
                return message.reply("Please mention a valid member of this server");
              if(!member.bannable) 
                return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
          
              let reason = args.slice(1).join(' ');
              if(!reason)
                return message.reply("Please indicate a reason for the ban!");
              
              await member.ban(reason)
                .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
              message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
            } 
           
            if(message.content.startsWith(prefix + 'owner')) {
                return message.reply("owner : <@!315930369398407178> ");
              }
              
              if(message.content.startsWith(prefix + 'rip')) {
               return message.reply('https://i.imgur.com/U7nEc3W.png')
              }

            

              if(message.content.startsWith(prefix + "YT")) {
                return message.reply(' https://www.youtube.com/channel/UCQOi31relXUpeK1bZoc8U2g/featured ')
              }

              if(message.content.startsWith(prefix + "DouZZy"))  {
                return message.reply(' https://www.youtube.com/channel/UCjEZLbmwPgsi7_bqyi9vCHQ ')
              }

              if(message.content.startsWith(prefix + "Exile")) {
                return message.reply(' https://www.youtube.com/channel/UC-6d36CYQw7NRoFC3oTSbwA ')
              }

              if(message.content.startsWith(prefix + "Snake")) {
                return message.reply(' https://www.youtube.com/channel/UC2bzijP-JMbnKKUrdi5NN6w ')
              }
              if(message.content.startsWith(prefix + "Pop")) {
                return message.reply(' https://www.youtube.com/channel/UCmmfD2u0QpPW1wThf0mQ7Aw?view_as=subscriber ')
              }
              if(message.content.startsWith(prefix + "Ayy")) {
                return message.reply('Lmao')
              }
           

            });
              bot.on("message", async message => {
              if (message.author.bot) return;
              if (message.channel.type === "dm") return;
              let messageArray = message.content.split(/\s+/g);
              let command = messageArray[0];
              let args = messageArray.slice(1);
    
              if (!command.startsWith(prefix)) return;
    
              let cmd = bot.commands.get (command.slice(prefix.length));
              if(cmd)  cmd.run(bot,message,args);
    
         });
        bot.on('message', function(message) {
         if (message.content == "OCbc") {
             if (message.member.hasPermission("MANAGE_MESSAGES")) {
                  message.channel.fetchMessages()
                     .then(function(list){
                         message.channel.bulkDelete(list);
                     }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})                        
            }
          }
          });
          bot.on("guildMemberAdd", function(member) {
          
         
           member.addRole(member.guild.roles.find("name", "guests"));;
    
           member.guild.createRole({
             name: member.user.username,
             color: generateHex(),
             permissions: []
           }).then(function(role){
             member.addRole(role);
           })
          });
          bot.on("message", function(message) {
            if (message.author.equals(bot.user)) return;
            if (!message.content.startsWith(prefix)) return;
             
                 var args = message.content.substring(prefix.length).split(" ");
               
     
                 switch (args[0].toLowerCase()) {
     
        case "info":
             var embed = new Discord.RichEmbed()
             .addField(":fire:Prefix:fire::","OC",true)
             .addField(":sparkles:Moderator Commands :", "ban, kick, mute, unmute", )
             .addField(":performing_arts:Other Commands:", "findusers, avatar, userinfo, jsontest, YT, DouZZy, Exile, Snake", true)
             .addField(":beginner:Owner:", " <@!315930369398407178> :ballot_box_with_check: ",)
             .addField("Invite line:", "https://discordapp.com/oauth2/authorize?client_id=%20377545043566788608&scope=bot&permissions=2146958591",true)
             .setColor(0x00FFFF)
             message.channel.sendEmbed(embed);
             break;
        case "smd":
             message.channel.sendMessage(message.author.toString() + "smd u")
       break;
 
       case "removerole":
            message.member.removeRole(message.member.guild.roles.find("name", "guests"));
            break;
        case "deleterole":
          message.member.guild.roles.find("name", "guests").delete();
            break;
                 }
                 });

             bot.on("ready", function () {
              bot.user.setStatus("dnd");
        
        });


bot.login(process.env.BOT_TOKEN);
