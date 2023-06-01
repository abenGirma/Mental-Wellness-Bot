const path = require("path")
const express = require("express");
const { Telegraf, session } = require("telegraf");
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

const botToken = process.env.BOT_TOKEN || "";
const bot = new Telegraf(botToken, {
	telegram: {
		agent: new HttpsProxyAgent("http://127.0.0.1:3333"),
	},
});

// bot.use(new LocalSession().middleware());
bot.use(session());
bot.hears("session", (ctx)=>{
	ctx.sendMessage(ctx.session.token || "No session bruh")
})
// EXPRESS CODE
// Don't stress much, Tr.Dave!! ;)

/**
 * SERVICE PROVIDER AUTH
 */
  
app.post('/sp_signup', (req, res) => {
	const {provider_id, f_name, l_name, email, phone_no,		//Telegram ID
		educational_bkg, work_exp, health_team,
		office_location, available_at} = req.body;


axios.post(process.env.API + "/service-provider/signup", { 
	provider_id, f_name, l_name, email, phone_no,		//Telegram ID
	educational_bkg, work_exp, health_team,
	office_location, available_at
 })
.then((response) => {
	if (response.data.status && response.data.status == "success") {
		res.status(200).json({
			status : response.data.status,
			result : {
				msg : response.data.result.msg,
				route : "./html/sp/sp_verify.html"
			}
		})
	} else if (response.data.status && response.data.status == "error" ){				// If the error from the backend is 'error' {whether it is from the res. or from the catch}
			res.status(500).json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
	}
}).catch((err) => {
	res.status(401).json({
		status: "error",
		result: {
			msg: "Can not send data to backend"
		}
	})
})

})

app.post('/sp_login', (req, res) => {
const { email } = req.body

if(!isEmail(email)){
	res.status(401).json({
		status: "error",
		result: {
			msg: "Invalid Email!"
		}
	})
	return
}

axios.post(process.env.API + "/service-provider/login", { email })
.then((response) => {
	if( response.data.status && response.data.status == "success"){
		res.status(200).json({
			status: response.data.status,
			result: {
				msg: response.data.result.msg,		// You should have received a token via email
				route: "./sp_verify.html"
			}
		})
	}

	else if( response.data.status && response.data.status == "error"){
		res.status(500).json({
			status: "error",
			result: {
				msg: response.data.result.msg		//msg: Couldn't send an email
			}
		})
	}

	else if (response.data.status && response.data.status == "unauthorized"){
		res.status(401).json({
			status: "error",
			result: {
				msg : response.data.result.msg
			}
		})
	}
})
.catch((error) => {
	console.log(error.response.data);
	res.status(500).json({
		status : "error",
		result : {
			msg : "Syncronization faild, please try again later.",
		}
	})
})
})

app.post('/sp_verify', (req, res) => {
const { token } = req.body;
console.log(token);
if(!token){
	res.status(401).json({
		status: "error",
		result: {
			msg: "No token found"
		}
	})
	return;
}

axios.post(process.env.API +"/service-provider/verify", {token})
.then((response) => {
	if(response.data.status && response.data.status == "success"){
		bot.use((ctx, next)=>{
			try {
				ctx.session.token = response.data.result.token;
				// TO BE futher tested.
				res.status(200).json({
					status: "success",
					result: {
						msg: response.data.result.msg
					}
				})
				next()
			}catch(error){
				res.status(500).json({
					status: "error",
					result: {
						msg: "Error on our part, we couldn't set session for you."
					}
				})
			}
		})
	} else {
		console.log(response.data);
		res.status(500).json({
			status: "error",
			result: {
				msg: response.data.result.msg
			}
		})
	}
}).catch((error) => {
console.log(error.response.data);
res.status(500).json({
	status: "success",
	result: {
		msg: "Axios Error, Cannot send data to the backend"
	}
})
})	
})

/**
* USER AUTH
*/

app.post('/stud_signup', (req, res) => {
const {stud_id, f_name, l_name, email, phone_no, ed_info} = req.body

axios.post(process.env.API + "/user/signup", 
	{stud_id, f_name, l_name, email, phone_no, ed_info})
	.then((response) => {
		if (response.data.status && response.data.status == "success"){
			res.status(200).json({
				status: "success",
				result: {
					msg: response.data.result.msg,
					route: './html/sp/sp_verify.html'
				}
			})
		} else {
			res.status().json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
		}
	}).catch((error) => {
		res.status(500).json({
			status: "error",
			result: {
				msg: "Axios Error, Couldn't send data to the backend"
			}
		})
	}) 
})

app.post('/stud_login', (req, res) => {
const {email} = req.body;

axios.post(process.env.API+"/user/login", {email})
	.then((response) => {
		if(response.data.status && response.data.status == "success"){
			res.status(200).json({
				status: "success",
				result: {
					msg: response.data.result.msg,
					route: './stud_verify.html'
				}
			})
		} else {
			res.status(500).json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
		}
	}).catch((error)=> {
		res.status(401).json({
			status: "error",
			msg: "Axios Error, Can not send data to the backend"
		})
	})
})

app.post('/stud_verify', (req, res) => {
const {token} = req.body;

axios.post(process.env.API +"/user/verify", {token})
	.then((response) => {
		if(response.data.status && response.data.status == "success"){
			bot.use((ctx, next)=>{
				ctx.session.token = response.data.result.token;
				next()
			})
			// TO BE futher tested.
			res.status(200).json({
				status: "success",
				result: {
					msg: response.data.result.msg
				}
			})
		} else {
			res.status(500).json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
		}
}).catch((error) => {
	res.status(500).json({
		status: "success",
		result: {
			msg: "Axios Error, Cannot send data to the backend"
		}
	})
})
})

/**
* ADMIN AUTH
*/

app.post('/admin_signup', (req, res) => {
const { f_name, l_name, email, speciality,
		working_hour, communication, phone_no } = req.body;

	axios.post(process.env.API+"/admin/signup", {
		f_name, l_name, email, speciality,
		working_hour, communication, phone_no
	}).then((response) => {
		if(response.data.status && response.data.status == "success"){
			res.status(200).json({
				status: "success",
				result: {
					msg: response.data.result.msg,
					route: './html/admin/admin_verify.html'
				}
			})
		} else {
			res.status(200).json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
		}
	}).catch((error) => {
		res.status(500).json({
			status: "error",
			result: {
				msg: "Axios Error, Can not fetch data to backend"
			}
		})
	})

})

app.post('/admin_login', (req, res) => {
const { email } = req.body;

axios.post(process.env.API + "/admin/login", {
	email
})
	.then((response) => {
		if(response.data.status && response.data.status == "success"){
			res.status(200).json({
				status: "success",
				result: {
					msg: response.data.result.msg,
					route: './html/admin/admin_verify.html'
				}
			})
		} else {
			res.status(500).json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
		}
	}).catch((error)=> {
		res.status(401).json({
			status: "error",
			msg: "Axios Error, Can not send data to the backend"
		})
	})
})

app.post('/admin_verify', (req, res) => {
const { token } = req.body;

axios.post(process.env.API + "/admin/verify", { token })
	.then((response) => {
		if (response.data.status && response.data.status == "success"){
			// bot.use((ctx, next)=>{
			// 	ctx.session.token = response.data.result.token;
			// 	next()
			// })
			// TO BE futher tested.
			res.status(200).json({
				status: "success",
				result: {
					msg: response.data.result.msg
				}
			})
		} else {
			res.status(500).json({
				status: "error",
				result: {
					msg: response.data.result.msg
				}
			})
		}
}).catch((error) => {
	res.status(500).json({
		status: "success",
		result: {
			msg: "Axios Error, Cannot send data to the backend"
		}
	})
})
})

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
/*
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

bot.launch();
