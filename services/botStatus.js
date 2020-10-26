currentStatus = 0;

async function fetchStatus(bot, database){
	const collection = database.collection("info");

	// create a filter for server count to update
	const filter = { _id: "5f6c5183784bc0b5904a1b9d" };

	const result = await collection.findOne(filter);
	return result.status
} 

module.exports.Run = async function (bot, database) {
	console.log("Bot Ready");
	bot.editStatus(await fetchStatus(bot, database), {name:`${bot.config.prefix[0]}help | ${bot.guilds.size.toLocaleString()} Servers!`, type: 0 });
	setInterval(async function () {
		let statuses = [
			`${bot.config.prefix[0]}help | ${bot.guilds.size.toLocaleString()} Servers!`,
			`${bot.config.prefix[0]}help | aub.mysterybots.com`,
		];
		currentStatus = currentStatus + 1 < statuses.length ? currentStatus + 1 : 0;
		let status = statuses[currentStatus];
		bot.editStatus(await fetchStatus(bot, database),{name: status, type: 0});
	}, 60 * 1000);
};
