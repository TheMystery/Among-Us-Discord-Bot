var MDBConnect =  require('../../mongodb');

module.exports.run = async (bot, message, args) => {
    let channelID = args[1]
    if (!channelID){
        return message.channel.createMessage("Sorry but the channel ID is not a voice chat that I can manage.")
    }
    let channel = bot.getChannel(channelID)
    if (!channel){
        return message.channel.createMessage("Sorry but the channel ID is not a voice chat that I can manage.")
    }
    if (!channel.type == 2){
        return message.channel.createMessage("Sorry but the channel ID is not a voice chat that I can manage.")
    }
    let guild = message.channel.guild

    // create a filter for server id to find
    const filter = { "guildID": `${guild.id}` };
    
    const result = await MDBConnect.findOne("bot","games",filter)
    if (!result){
        let failed = false
        for ([memberID, member] of channel.voiceMembers){
            try {
                await member.edit({mute:false}, "Among Us Game Chat Control")
            }
            catch (e) {
                failed = true
                return message.channel.createMessage("Sorry but I need permissions to Mute Members")
            }
        }
        if (!failed){
            message.channel.createMessage('No players died in the game. Unmuting all players.').catch(()=>{})
        }
    }else{
        let failed = false
        for ([memberID, member] of channel.voiceMembers){
            try {
                await member.edit({mute:false}, "Among Us Game Chat Control")
            }
            catch (e){
                failed = true
                return message.channel.createMessage("Sorry but I need permissions to Mute Members")
            }
        }
        if (!failed){
            dead = result.dead
            for ([memberID, member] of channel.voiceMembers){
                index = dead.indexOf(member.id)
                dead.splice(index,1)
            }
            if (dead.length == 0){
                await MDBConnect.deleteOne("bot","games",filter);
            }else{
                updateDoc = {
                    $set:{
                        "dead":dead
                    }
                }
                await MDBConnect.updateOne("bot","games",filter, updateDoc);
            }
            message.channel.createMessage("Game ended. All users unmuted.").catch(()=>{})
        }
    }
}

module.exports.info = {
    name: "end",
    description: "End the game. Unmutes all players even those who are set as dead",
    category: "Game",
    aliases: ["e"],
    GuildOnly: true
}
