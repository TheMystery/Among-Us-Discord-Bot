const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";

module.exports.run = async (bot, message, args) => {
    let channelID = message.member.voiceState.channelID
    if (!channelID){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    let channel = bot.getChannel(channelID)
    if (!channel.type == 2){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    let guild = message.channel.guild
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
		await client.connect();

		const database = client.db("bot");
		const collection = database.collection("games");
    
        // create a filter for server id to find
        const filter = { "guildID": `${guild.id}` };
        
        const result = await collection.findOne(filter);
        console.log(result)
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
                    await connection.destroy();
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
                    await collection.deleteOne(filter);
                }else{
                    updateDoc = {
                        $set:{
                            "dead":dead
                        }
                    }
                    await collection.updateOne(filter, updateDoc,{upsert:true});
                }
                message.channel.createMessage("Game ended. All users unmuted.").catch(()=>{})
            }
        }
    } finally {
		await client.close();
	}
}

module.exports.info = {
    name: "end",
    description: "End the game. Unmutes all players even those who are set as dead",
    category: "Game",
    aliases: ["e"],
    GuildOnly: true
}
