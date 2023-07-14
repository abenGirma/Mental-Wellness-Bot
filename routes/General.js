const { Markup } = require("telegraf");

const menu_disc = {
	login:
		`🗝 **Login:**\n 
		How would you like to proceed?  
		Click the following buttons to fill out your credentials\\.   
		⚠️ __If it is not openning and you are on telegram proxy but not on VPN, connect your 
		"VPN and try again\\.__`,
	signup:
		"📃 <b>Sign up</b> \n" +
		"How would you like to proceed? \n" +
		"Click the following buttons to fill out your form. \n" +
		"⚠️ <em>If it is not openning and you are on telegram proxy but not on VPN, connect your " +
		"VPN and try again. </em>",
	home:
		"🏠 <b>Home: </b>",
	about_us: "We are SAC",
	error: "",
};

const home = function (ctx) {
	// try {
	// 	ctx.deleteMessage();
	// } catch (error) {
	// 	console.log(error);
	// }

	ctx.sendMessage(menu_disc.home, {
		parse_mode: "HTML",
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

	ctx.sendMessage(
		menu_disc.login,{
			parse_mode: "HTML",
		// Markup.keyboard(
			reply_markup : { 
				inline_keyboard :[
		[
			{
				text: "👨‍🎓 Student 🧑‍🎓",
				web_app: {
					url: process.env.BASE_WEB_API,
				},
			},
		],
		[
			{
				text: "🧑‍⚕️ Service Provider 👨‍⚕️",
				web_app: {
					url: process.env.BASE_WEB_API + "/html/sp/sp_login.html",
				},
			},
		],
		[
			{
				text: "💰 I want to donate",
				web_app: {
					url: process.env.BASE_WEB_API,
				},
			},
		],
		[{ text: "« back home", callback_data:"home" }],
	]}}//)
		// .resize()
		// .oneTime()
	);
};

const signup = function (ctx) {
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.sendMessage(menu_disc.signup, {
		parse_mode: "HTML",
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "👨‍🎓 Student 🧑‍🎓",
						web_app: {
							url: process.env.BASE_WEB_API + "/html/stud/stud_signup.html",
						},
					},
				],
				[
					{
						text: "🧑‍⚕️ Service Provider 👨‍⚕️",
						web_app: {
							url: process.env.BASE_WEB_API + "/html/sp/sp_signup.html",
						},
					},
				],
				[
					{
						text: "💰 I want to donate",
						web_app: {
							url: process.env.BASE_WEB_API + "/html/sp/sp_login.html",
						},
					},
				],
				[{ text: "« back", callback_data: "home" }]
			],
		},
	});

	// ctx.reply("",
	// 	Markup.keyboard([
	// 		,
	// 	])
	// 		.oneTime()
	// 		.resize()
	// );
};

const aboutUs = function (ctx) {
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.replyWithMarkdownV2(menu_disc.about_us, {
		parse_mode: "HTML",
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
		parse_mode: "HTML",
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
