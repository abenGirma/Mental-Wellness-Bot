const { Markup } = require("telegraf");

const menu_disc = {
	login:
		`🗝 **Login:**\n 
		How would you like to proceed?  
		Click the following buttons to fill out your credentials\\.   
		⚠️ __If it is not openning and you are on telegram proxy but not on VPN, connect your 
		"VPN and try again\\.__`,
	signup:
		"📃 **Sign up** \n" +
		"How would you like to proceed\? " +
		"Click the following buttons to fill out your form\\. \n\n" +
		"⚠️ __If it is not openning and you are on telegram proxy but not on VPN, connect your " +
		"VPN and try again\\.__",
	home:
		"🏠 **Home: **\n" ||
		"Welcome to SAC Wellness bot\\.",
	about_us: "We are SAC",
	error: "",
};

const home = function (ctx) {
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.replyWithMarkdownV2(menu_disc.home, {
		parse_mode: "MarkdownV2",
		reply_markup: {
			inline_keyboard: [
				[{ text: "🗝 Login", callback_data: "login" }],
				[{ text: "📃 Sign Up", callback_data: "signup" }],
				[{ text: "🧑‍⚕️ About SAC 👨‍⚕️", callback_data: "about_us" }],
			],
		},
	});
};

const login = function (ctx) {
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
					url: "https://f55f-213-55-90-5.ngrok-free.app/projects/web-app/",
				},
			},
		],
		[
			{
				text: "🧑‍⚕️ Service Provider 👨‍⚕️",
				web_app: {
					url: "https://f55f-213-55-90-5.ngrok-free.app/projects/web-app/sp_login.html",
				},
			},
		],
		[
			{
				text: "💰 I want to donate",
				web_app: {
					url: "https://f55f-213-55-90-5.ngrok-free.app/projects/web-app/",
				},
			},
		],
		[{ text: "« back home", callback_data:"home" }],
	])
		.resize()
		.oneTime()
	);
};

const signup = function (ctx) {
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.replyWithMarkdownV2(menu_disc.signup, {
		reply_markup: {
			inline_keyboard: [[{ text: "« back", callback_data: "home" }]],
		},
	});

	ctx.reply("",
		Markup.keyboard([
			[
				{
					text: "👨‍🎓 Student 🧑‍🎓",
					web_app: {
						url: "https://telegram-webapp.github.com/somerepo/student_signup.html",
					},
				},
			],
			[
				{
					text: "🧑‍⚕️ Service Provider 👨‍⚕️",
					web_app: {
						url: "https://telegram-webapp.github.com/somerepo/service_provider_signup.html",
					},
				},
			],
			[
				{
					text: "💰 I want to donate",
					web_app: {
						url: "https://telegram-webapp.github.com/somerepo/donors.html",
					},
				},
			],
		])
			.oneTime()
			.resize()
	);
};

const aboutUs = function (ctx) {
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.replyWithMarkdownV2(menu_disc.about_us, {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "« back",
						callback_data: "home",
					},
				],
			],
		},
	});

	ctx.reply({ keyboard: [] });
};

const generalError = function (ctx, error) {
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.replyWithMarkdownV2(error || menu_disc.error, {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "« back",
						callback_data: "home",
					},
				],
			],
		},
	});
};

module.exports = { home, login, signup, aboutUs, generalError };
