const { Scenes, session } = require("telegraf");
const axios = require("axios");
const { log } = require("console");

const ServiceProvider = function (bot) {
	this.bot = bot;
};

ServiceProvider.prototype.home = async function (ctx) {
	//TODO: inline keyboard or something

	ctx.telegram.sendMessage(
		ctx.session.telegram_user_id,
		"Logged in successfully, Welcome home! ",
		{
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
		}
	);
};

ServiceProvider.prototype.login = function () {
	const serviceProviderLoginWizard = new Scenes.WizardScene(
		"w_service_provider_login",
		(ctx) => {
			ctx.reply("Please enter your email to login?");
			ctx.scene.session.serviceProviderAuth = {};
			ctx.scene.session.serviceProviderAuth.telegram_user_id =
				ctx.from.id;
			//TODO : maybe push user_id to session, but not necessary maybe
			return ctx.wizard.next();
		},
		(ctx) => {
			ctx.scene.session.serviceProviderAuth.email = ctx.message.text;
			axios
				.post(process.env.API + "/service-provider/login", {
					email: ctx.scene.session.serviceProviderAuth.email,
				})
				.then((response) => {
					if (response.data.status == "success") {
						ctx.telegram.sendMessage(
							ctx.scene.session.serviceProviderAuth
								.telegram_user_id,
							"You should receive an email with a verification token. Please enter the verification token."
						);
					} else if (response.data.status == "error") {
						ctx.telegram.sendMessage(
							ctx.scene.session.serviceProviderAuth
								.telegram_user_id,
							"Error occurred please try again",
							{
								parse_mode: "markdown",
								reply_markup: {
									inline_keyboard: [
										[
											{
												text: "« back ",
												callback_data: "home",
											},
										],
									],
								},
							}
						);
						return ctx.scene.leave();
					}
				})
				.catch((err) => {
					ctx.telegram.sendMessage(
						ctx.scene.session.serviceProviderAuth.telegram_user_id,
						"Something wrong happend, please try again."
					);
					log("Gracefully hundled");
				});
			return ctx.wizard.next();
		},
		(ctx) => {
			ctx.scene.session.serviceProviderAuth.token = ctx.message.text;

			axios
				.post(process.env.API + "/service-provider/verify", {
					token: ctx.scene.session.serviceProviderAuth.token,
				})
				.then(async (response) => {
					if (response.data.status == "success") {
						//TODO : push token to the database or session
						ctx.session.telegram_user_id = ctx.from.id;
						ctx.session.backend_token = response.data.result.token;

						await this.home(ctx);
						return ctx.wizard.next();
					} else if (response.data.status == "error") {
						ctx.telegram.sendMessage(
							ctx.from.id,
							"Error occured, please try again."
						);
						return ctx.wizard.next();
					}
				})
				.catch((err) => {
					ctx.telegram.sendMessage(
						ctx.from.id,
						"Some sort of error happend, I am sorry 🙏. please try /start"
					);
				});

			return ctx.scene.leave();
		}
	);

	return serviceProviderLoginWizard;
};

ServiceProvider.prototype.signup = function () {
	const serviceProviderSignupWizard = new Scenes.WizardScene(
		"w_service_provider_signup",
		(ctx) => {
			ctx.reply("What is your full name?");
			//To store the input
			ctx.scene.session.serviceProvider = {};
			//Store the telegram user id
			ctx.scene.session.serviceProvider.telegram_user_id = ctx.from.id;
			return ctx.wizard.next();
		},
		(ctx) => {
			//Store entered name
			ctx.scene.session.serviceProvider.fullName = ctx.message.text;
			ctx.reply("Enter your email?");
			return ctx.wizard.next();
		},
		(ctx) => {
			//store entered email
			ctx.scene.session.serviceProvider.email = ctx.message.text;
			ctx.reply("What is your speciality?");
			return ctx.wizard.next();
		},
		(ctx) => {
			//store speciality
			ctx.scene.session.serviceProvider.speciality = ctx.message.text;

			ctx.reply("Enter your working hour?");
			return ctx.wizard.next();
		},
		(ctx) => {
			//store working hour
			ctx.scene.session.serviceProvider.workingHour = ctx.message.text;

			ctx.reply(
				"What is your prefered communication - Telegram or email?"
			);
			return ctx.wizard.next();
		},
		(ctx) => {
			//store preferred communication
			ctx.scene.session.serviceProvider.communication = ctx.message.text;

			ctx.reply("Enter your phone number?");
			return ctx.wizard.next();
		},
		(ctx) => {
			//store phone number
			ctx.scene.session.serviceProvider.phoneNumber = ctx.message.text;

			// send data to backend
			axios
				.post(
					"/api/admin/addServiceProvider",
					ctx.scene.session.serviceProvider
				)
				.then(function (response) {
					// console.log(response.data)
				});
			ctx.telegram.sendMessage(
				ctx.scene.session.serviceProvider.telegram_user_id,
				"New Service Provider Added" +
					"\n" +
					"Full Name - " +
					ctx.scene.session.serviceProvider.fullName +
					"\n" +
					"Email - " +
					ctx.scene.session.serviceProvider.email +
					"\n" +
					"Speciality - " +
					ctx.scene.session.serviceProvider.speciality +
					"\n" +
					"Working Hour - " +
					ctx.scene.session.serviceProvider.workingHour +
					"\n" +
					"Phone Number - " +
					ctx.scene.session.serviceProvider.phoneNumber +
					"\n" +
					"Registerd successfully" +
					"\n",
				{
					parse_mode: "markdown",
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: "Back to Admin Menu",
									callback_data: "Admin",
								},
							],
							[
								{
									text: "Back to MainMenu",
									callback_data: "Main",
								},
							],
						],
					},
				}
			);

			return ctx.scene.leave(); // leave the scene
		}
	);
	return serviceProviderSignupWizard;
};

ServiceProvider.prototype.setAppointment = function () {
	//TODO: Pushing appointments to backend
};

ServiceProvider.prototype.getAppointments = function (ctx) {
	//TODO: Get appointment from backend
};

//TODO: more functions maybe
module.exports = { ServiceProvider };
