const path = require("path")
const express = require("express");
const { Telegraf } = require("telegraf");
// const LocalSession = require("telegraf-session-local");
const { ServiceProvider } = require("./routes/ServiceProvider");
const { Admin } = require("./routes/Admin");
const { Student } = require("./routes/Student");
const {
	home,
	login,
	signup,
	aboutUs,
	generalError,
} = require("./routes/General");
const {isEmail, isName} = require("./util/Validator")
const axios = require("axios");

require("dotenv").config(); //dev dependancy
const { HttpsProxyAgent } = require("https-proxy-agent"); //dev dependancy

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
	console.log("requst coming in");
	res.send("ok");
});

app.listen(3000, "localhost", () => {
	console.log("Server listening on port 3000");
});
/*
const botToken = process.env.BOT_TOKEN || "";
const bot = new Telegraf(botToken, {
	telegram: {
		agent: new HttpsProxyAgent("http://127.0.0.1:3333"),
	},
});

bot.use(new LocalSession().middleware());
bot.start(home);

bot.action("home", home);
bot.action("login", login);
bot.action("signup", signup);
bot.action("about_us", aboutUs);

const serviceProvider = new ServiceProvider();
bot.action("sp_logout", serviceProvider.logout);
bot.action("y_sp_logout", serviceProvider.yesLogout);
bot.action("n_sp_logout", serviceProvider.noLogout);

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
						case 2343: //request type
							serviceProvider.login(ctx, data);
							break;
						case 2212:
							serviceProvider.signup(ctx);
							break;
					}
				}
			} catch (error) {
				generalError(ctx, "Invalid data, please try again.");
				console.log(error);
			}
		}
		if (ctx.message.web_app_data.button_text.indexOf("Student") != -1) {
			try {
				const data = JSON.parse(ctx.message.web_app_data.data);
				if (data.type) {
					switch (data.type) {
						case 2343: //request type
							student.login(ctx);
							break;
						case 2212:
							student.signup(ctx);
							break;
					}
				}
			} catch (error) {
				generalError(ctx, "Invalid data, please try again.");
				console.log(error);
			}
		}

		if (
			ctx.message.web_app_data.button_text.indexOf("Verify token") != -1
		) {
			ctx.session.logging_in = true;
			try {
				const data = JSON.parse(ctx.message.web_app_data.data);
				if (data.type) {
					switch (data.type) {
						case 7564: //role type
							serviceProvider.verify(ctx, data);
							break;
						case 1721:
							student.verify(ctx, data);
							break;
						case 4388:
							admin.verify(ctx, data);
							break;
					}
				}
			} catch (error) {
				generalError(ctx, "Invalid data, please try again.");
				console.log(error);
			}
		}
	}
});
*/
app.post('/sp_login', (req, res) => {
	const {email} = req.body;
	if (!isEmail(email))
	{
		res.status(401).json({
			status : "error",
			result : {
				msg : "Invalid email."
			}
		})
		return
	}

	axios.post(process.env.API + "/service-provider/login", { email })
	.then((response) => {
		if (response.data.status && response.data.status == "success") {
			res.status(200).json({
				status : response.data.status,
				result : {
					msg : response.data.result.msg,
					route : "/sp_verify.html"
				}
			})
		}
	})
	.catch((error) => {
		if (
			error.data && 
			error.data.status && 
			error.data.status == "unauthorized"
		)
		{
			res.status(401).json({
				status : error.data.status,
				result : {
					msg : error.data.result.msg,
				}
			})
		}
	});
})

app.post('/sp_signup', (req, res) => {
	const {email} = req.body;
	if (
		!isName() ||
		!isEmail(email)
	)
	{
		res.status(401).json({
			status : "error",
			result : {
				msg : "Invalid email."
			}
		})
		return
	}

	axios.post(process.env.API + "/service-provider/login", { email })
	.then((response) => {
		if (response.data.status && response.data.status == "success") {
			res.status(200).json({
				status : response.data.status,
				result : {
					msg : response.data.result.msg,
					route : "/sp_verify.html"
				}
			})
		}
	})
	.catch((error) => {
		if (
			error.data && 
			error.data.status && 
			error.data.status == "unauthorized"
		)
		{
			res.status(401).json({
				status : error.data.status,
				result : {
					msg : error.data.result.msg,
				}
			})
		}
	});
})

// bot.launch();
