const { Telegraf, Scenes, session } = require("telegraf");
const { HttpsProxyAgent } = require("https-proxy-agent"); //dev dependancy
const LocalSession = require("telegraf-session-local");
const { ServiceProvider } = require("./routes/ServiceProvider");
const { Admin } = require("./routes/Admin");
const { Student } = require("./routes/Student");
const { home, login, signup, aboutUs } = require("./routes/General");
const express = require("express");
const { log } = require("console");
const { request } = require("http");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	console.log("requst coming in");
	res.send("ok");
});

app.listen(3000, "localhost", () => {
	console.log("Server listening on port 3000");
});

const botToken = process.env.BOT_TOKEN || "";
const bot = new Telegraf(botToken, {
	telegram: {
		agent: new HttpsProxyAgent("http://127.0.0.1:3333"),
	},
});

bot.use(new LocalSession({ database: "sessions.json" }).middleware());
bot.start(home);

bot.action("home", home);
bot.action("login", login);
bot.action("signup", signup);
bot.action("about_us", aboutUs);

const serviceProvider = new ServiceProvider();
const admin = new Admin();
const student = new Student();

bot.on("message", async function (ctx) {
	if (
		ctx.message.web_app_data &&
		ctx.message.web_app_data.data &&
		ctx.message.web_app_data.button_text
	) {
		if (
			ctx.message.web_app_data.button_text.indexOf("Service Provider") !=
			-1
		) {
			try {
				const data = JSON.parse(ctx.message.web_app_data.data);
				if (data.type) {
					switch (data.type) {
						case 2343:
							serviceProvider.login(ctx, data);
							break;
						case 2212:
							serviceProvider.signup(ctx);
							break;
					}
				}
			} catch (error) {
				log(error);
			}
		}
		if (ctx.message.web_app_data.button_text.indexOf("Student") != -1) {
			try {
				const data = JSON.parse(ctx.message.web_app_data.data);
				if (data.type) {
					switch (data.type) {
						case 2343:
							student.login(ctx);
							break;
						case 2212:
							student.signup(ctx);
							break;
					}
				}
			} catch (error) {
				log(error);
			}
		}

		if (
			ctx.message.web_app_data.button_text.indexOf("Verify token") != -1
		) {
			try {
				const data = JSON.parse(ctx.message.web_app_data.data);
				if (data.type) {
					switch (data.type) {
						case 7564:
							serviceProvider.verify(ctx, data);
							break;
						case 2212:
							student.verify(ctx, data);
							break;
					}
				}
			} catch (error) {
				log(error);
			}
		}
	}

	if (ctx.message.text && ctx.message.text == "« back home") {
		home(ctx);
	}
});

/**
 * TODO : More callbacks here, from ServiceProvider
 * and others too
 */

bot.launch();
