const TeleBot = require("telebot");
const { getImgFromSubReddit, getRandomArbitrary } = require("./lib");
const creds = require("./config.json")
const bot = new TeleBot(creds.telegram_bot);

var cached = {};

bot.on("text", (msg) => {
	if (msg.text.match(/ola|hola|buenas/) !== null) {
		msg.reply.sticker("https://i.imgur.com/G8ZFTnd.png", { asReply: true });
	}
});

bot.on(/^\/r (.+)$/, async (msg, props) => {
	console.log("From ", msg.from.id);
	const text = props.match[1];

	if (cached[text]) {
		console.log("Serving cached post");
		let posts = cached[text];
		var index = getRandomArbitrary(0, posts.length);
		let url = posts[index];

		console.log("url: ", url);

		return msg.reply.photo(url, { asReply: true });
	} else {
		console.log("Searching for posts");
		try {
			let { url, posts } = await getImgFromSubReddit(text);
			cached[text] = posts;
			return msg.reply.photo(url, { asReply: true });
		} catch (error) {
			console.log("Error");
			return msg.reply.text(error, { asReply: true });
		}
	}
});

bot.start();
