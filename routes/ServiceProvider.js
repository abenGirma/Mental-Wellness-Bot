const { Markup } = require("telegraf");
const { isEmail } = require("validator");
const axios = require("axios");
const {home} = require("./General")
require("dotenv").config();

const ServiceProvider = function (bot) {
	this.bot = bot;
};

ServiceProvider.prototype.home = async function (ctx) {
	if (
		ctx.session &&
		ctx.session.token &&
		ctx.session.role &&
		ctx.session.role == process.env.SP_ROLE
	)
		ctx.reply("Welcome home! ", {
			parse_mode: "markdown",
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "🤕 New patient requests",
							callback_data: "sp_patient_requests",
						},
					],
					[
						{
							text: "📆 Appointments",
							callback_data: "sp_get_appointments",
						},
					],
					[{ text: "💰 I want to donate", callback_data: "donate" }],
					[{ text: "« Logout", callback_data: "sp_logout" }],
				],
			},
		});
};

ServiceProvider.prototype.login = function (ctx, data) {
	ctx.sendChatAction("typing");
	ctx.session.logging_in = true
	if (data.email && isEmail(data.email))
		axios
			.post(process.env.API + "/service-provider/login", {
				email: data.email,
			})
			.then((response) => {
				if (response.data.status && response.data.status == "success") {
					ctx.reply(
						`${response.data.result.msg} please click on ✅ verify token.`,
						Markup.keyboard([ 
							[
								{
									text: "✅ Verify token",
									web_app: {
										url: "https://f55f-213-55-90-5.ngrok-free.app/projects/web-app/sp_verify.html",
									},
								},
							],
							[
								{
									text: "« back to login",
									callback_data: "login",
								},
							],
							[
								{
									text: "« back to home",
									callback_data: "home",
								},
							]
						]).oneTime()
					);
					
				}
			})
			.catch((error) => {
				console.log(error);
				if (error.data && error.data.status && error.data.status == "unauthorized")
				{

				}
			});
};

ServiceProvider.prototype.verify = function (ctx, data) {
	ctx.sendChatAction("typing");

	if (ctx.session && ctx.session.logging_in && data && data.token){
		axios
			.post(process.env.API + "/service-provider/verify", {
				token: data.token,
			})
			.then((response) => {
				if (
					response.data &&
					response.data.status &&
					response.data.status == "success"
				) {
					ctx.session.logging_in = false
					ctx.session.token = response.data.result.token;
					ctx.session.role = response.data.result.role;
					ServiceProvider.prototype.home(ctx);
				} else if (
					response.data &&
					response.data.status &&
					response.data.status == "unauthorized"
				) {
					ctx.session.logging_in = false
					ctx.reply(response.data.result.msg); //probably more options like back button
				}
			})
			.catch((error) => {});
	}else {
		ctx.reply("You are unauthorized, to do that. /start", {
			reply_markup: {
				keyboard : [[]]
			}
		})
	}
};

ServiceProvider.prototype.logout = function (ctx){
	ctx.reply("Are you sure, you want to logout ?",
	{
		reply_markup : {
			inline_keyboard : [
				[
					{text : "👍 Yea", callback_data : "y_sp_logout"},
					{text : "🙅 Nop", callback_data : "n_sp_logout"},
				]
			]
		}
	})
}

ServiceProvider.prototype.yesLogout = function (ctx){
	ctx.session = undefined;
	home(ctx)
}

ServiceProvider.prototype.noLogout = function (ctx){
	try {
		ctx.deleteMessage()
	} catch (error) {
		console.log(error);
	}
}

ServiceProvider.prototype.signup = function () {};

ServiceProvider.prototype.setAppointment = function () {
	//TODO: Pushing appointments to backend
};

ServiceProvider.prototype.getAppointments = function (ctx) {
	//TODO: Get appointment from backend
};

ServiceProvider.prototype.getPatientRequests = function (ctx) {
	if (
		!ctx.session ||
		!ctx.session.token ||
		!ctx.session.role ||
		ctx.session.role != process.env.SP_ROLE
	) {
		//TODO: Respond with unauthorized
	} else {
		//TODO: Try getting patient request from backend
	}
};

//TODO: more functions maybe
module.exports = { ServiceProvider };
