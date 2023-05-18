const { isEmail } = require("validator");
const axios = require("axios");
const { log } = require("console");

const { home } = require("./General");

const ServiceProvider = function (bot) {
	this.bot = bot;
};

ServiceProvider.prototype.home = async function (ctx) {
	console.log(ctx.session);
	ctx.reply("Welcome home! ", {
		parse_mode: "markdown",
		reply_markup: {
			keyboard: [
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

	if (data.email && isEmail(data.email))
		axios
			.post(process.env.API + "/service-provider/login", {
				email: data.email,
			})
			// .then((response) => {
			// 	return response;
			// })
			.then((response) => {
				if (response.data.status && response.data.status == "success") {
					ctx.reply(
						`${response.data.result.msg} please click on ✅ verify token.`,
						{
							reply_markup: {
								keyboard: [
									[
										{
											text: "✅ Verify token",
											web_app: {
												url: "https://95b3-213-55-90-5.ngrok-free.app/projects/web-app/sp_verify.html",
											},
										},
									],
									[
										{
											text: "back to login menu",
										},
									],
								],
							},
						}
					);
				}
			})
			.catch((error) => {});
};

ServiceProvider.prototype.verify = function (ctx, data) {
	// log(data);
	// ctx.reply("Processing your token ...");
	ctx.sendChatAction("typing");

	if (data && data.token)
		axios
			.post(process.env.API + "/service-provider/verify", {
				token: data.token,
			})
			.then((response) => {
				// console.log(response);
				if (
					response.data &&
					response.data.status &&
					response.data.status == "success"
				) {
					ctx.session.token = response.data.result.token;
					ServiceProvider.prototype.home(ctx);
				} else if (
					response.data &&
					response.data.status &&
					response.data.status == "unauthorized"
				) {
					ctx.reply(response.data.result.msg);
				}
			})
			.catch((error) => {});
};

ServiceProvider.prototype.signup = function () {};

ServiceProvider.prototype.setAppointment = function () {
	//TODO: Pushing appointments to backend
};

ServiceProvider.prototype.getAppointments = function (ctx) {
	//TODO: Get appointment from backend
};

//TODO: more functions maybe
module.exports = { ServiceProvider };
