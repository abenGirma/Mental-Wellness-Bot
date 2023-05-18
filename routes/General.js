const { Markup } = require("telegraf");

const menu_disc = {
	login:
		"🗝 **Login: **\n" +
		"How would you like to proceed? " +
		"Click the following buttons to fill out your credentials. \n " +
		"⚠️ If it is not openning and you are on telegram proxy but not on VPN, connect your " +
		"VPN and try again.",
	home:
		"🏠 **Home: **\n" + process.env.BOT_WELCOME_MSG ||
		"Welcome to SAC Wellness bot.",
};

const home = (ctx) => {
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.replyWithMarkdownV2(menu_disc.home, {
		parse_mode: "MarkdownV2",
		reply_markup: {
			inline_keyboard: [
				[{ text: "🔓 Login", callback_data: "login" }],
				[{ text: "📃 Sign Up", callback_data: "signup" }],
				[{ text: "🧑‍⚕️ About SAC 👨‍⚕️", callback_data: "about_us" }],
			],
		},
	});
};

const login = (ctx) => {
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.replyWithMarkdownV2(
		menu_disc.login,
		Markup.keyboard([
			[
				{
					text: "👨‍🎓 Student 🧑‍🎓",
					web_app: {
						url: "https://95b3-213-55-90-5.ngrok-free.app/projects/web-app/",
					},
				},
			],
			[
				{
					text: "🧑‍⚕️ Service Provider 👨‍⚕️",
					web_app: {
						url: "https://95b3-213-55-90-5.ngrok-free.app/projects/web-app/login.html",
					},
				},
			],
			[
				{
					text: "💰 I want to donate",
					web_app: {
						url: "https://95b3-213-55-90-5.ngrok-free.app/projects/web-app/",
					},
				},
			],
			[{ text: "« back home" }],
		]).resize()
	);
};

const signup = (ctx) => {
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.replyWithMarkdownV2(menu_disc.signup, {
		parse_mode: "MarkdownV2",
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "👨‍🎓 Student 🧑‍🎓",
						web_app: {
							url: "https://telegram-webapp.github.com/somerepo/student_signup.html",
						},
						callback_data: "student_login",
					},
				],
				[
					{
						text: "🧑‍⚕️ Service Provider 👨‍⚕️",
						web_app: {
							url: "https://telegram-webapp.github.com/somerepo/service_provider_signup.html",
						},
						callback_data: "sp_login",
					},
				],
				[
					{
						text: "💰 I want to donate",
						web_app: {
							url: "https://telegram-webapp.github.com/somerepo/donors.html",
						},
						callback_data: "donate",
					},
				],
				[{ text: "« back", callback_data: "home" }],
			],
		},
	});
};

module.exports = { home, login, signup };
