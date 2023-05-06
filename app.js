const { Telegraf, Scenes, session } = require("telegraf");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { ServiceProvider } = require("./routes/ServiceProvider");
const { Admin } = require("./routes/Admin");
const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.listen(3000, "localhost", () => {
	console.log("Server listening on port 3000");
});

app.get("/", (req, res) => {
	console.log("requst coming in");
});

const botToken = process.env.BOT_TOKEN || "";
const bot = new Telegraf(botToken, {
	telegram: {
		agent: new HttpsProxyAgent("http://127.0.0.1:3333"),
	},
});

bot.start((ctx) => {
	console.log(ctx.update.message.chat.id);
	const chatId = ctx.update.message.chat.id;
	ctx.telegram.sendMessage(
		chatId,
		process.env.BOT_WELCOME_MSG || "Welcome to SAC Wellness bot.",
		{
			parse_mode: "markdown",
			reply_markup: {
				inline_keyboard: [
					[{ text: "🔓 Login", callback_data: "login" }],
					[{ text: "📃 Sign Up", callback_data: "signup" }],
					[{ text: "🧑‍⚕️ About SAC 👨‍⚕️", callback_data: "about_sac" }],
				],
			},
		}
	);
});

bot.action("home", (ctx) => {
	const chatId = ctx.update.message.chat.id;
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.telegram.sendMessage(
		chatId,
		process.env.BOT_WELCOME_MSG || "Welcome to SAC Wellness bot.",
		{
			parse_mode: "markdown",
			reply_markup: {
				inline_keyboard: [
					[{ text: "🔓 Login", callback_data: "login" }],
					[{ text: "📃 Sign Up", callback_data: "signup" }],
					[{ text: "🧑‍⚕️ About SAC 👨‍⚕️", callback_data: "about_sac" }],
				],
			},
		}
	);
});

bot.action("login", (ctx) => {
	const chatId = ctx.update.callback_query.message.chat.id;
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.telegram.sendMessage(
		chatId,
		"Okay, then how would you like to proceed ?",
		{
			parse_mode: "markdown",
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "🧑‍⚕️ Service Provider 👨‍⚕️",
							callback_data: "service_provider_login",
						},
					],
					[
						{
							text: "👨‍🎓 I need help 🧑‍🎓",
							callback_data: "student_login",
						},
					],
					[{ text: "💰 I want to donate", callback_data: "donate" }],
					[{ text: "« back", callback_data: "home" }],
				],
			},
		}
	);
});

bot.action("signup", (ctx) => {
	const chatId = ctx.update.callback_query.message.chat.id;
	try {
		ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}

	ctx.telegram.sendMessage(
		chatId,
		"Okay, then how would you like to proceed ?",
		{
			parse_mode: "markdown",
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "🧑‍⚕️ Service Provider 👨‍⚕️",
							callback_data: "service_provider_signup",
						},
					],
					[
						{
							text: "👨‍🎓 I need help 🧑‍🎓",
							callback_data: "student_signup",
						},
					],
					[{ text: "💰 I want to donate", callback_data: "donate" }],
					[{ text: "« back", callback_data: "home" }],
				],
			},
		}
	);
});

const serviceProvider = new ServiceProvider();
const admin = new Admin();
const stage = new Scenes.Stage([
	serviceProvider.signup(),
	serviceProvider.login(),
]);
bot.use(session());
bot.use(stage.middleware());

bot.action("service_provider_login", (ctx) => {
	ctx.scene.enter("w_service_provider_login"); //w prefix serves as an indication for wizard
});

/**
 * TODO : More callbacks here, from ServiceProvider
 * and others too
 */

bot.launch();
