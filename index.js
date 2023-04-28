const { Telegraf, Scenes, session, wizard, Stage } = require('telegraf');
const { message } = require('telegraf/filters');
const { bodyParser } = require('body-parser');
const axios = require('axios');

const express = require('express');
const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.send('Hello World!');
});



const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:3000`);
});


const api = process.env['RESTapi']; //Here we will use the backend
const token = process.env['Token'];
const bot = new Telegraf(token);


bot.start((ctx) => {
  const chatId = ctx.update.message.chat.id;

  ctx.telegram.sendMessage(chatId, "Welcome to Mental Wellness bot", {
    parse_mode: "markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "I am service Provider", callback_data: "serviceProvider" }], 
        [{ text: "I need help", callback_data: "userStudent" }],
        [{ text: "Admin", callback_data: "Admin" }]
      ]
    }
  });

});

/** 
 * Service Provider Section
*/

bot.action('serviceProvider', (ctx) => {
  const chatId = ctx.update.callback_query.message.chat.id;
  try {
    ctx.deleteMessage()
    //console.log(ctx)
  } catch (error) {
    console.log(error);
  };

  ctx.telegram.sendMessage(chatId, "Login before proceeding.", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Login", callback_data: "login_serviceprovider" }], 
        [{ text: "Back to MainMenu", callback_data: "Main" }]
      ]
    }
  });

})


//Service provider Login
bot.action('login_serviceprovider', (ctx) => {
  ctx.scene.enter('serviceProviderLogin-wizard'); //Enter a scene where SVP can login and authenticate.
});


//WizardScene to Login and Verify Service Providers
const serviceProviderLoginWizard = new Scenes.WizardScene('serviceProviderLogin-wizard',
  (ctx) => {
    ctx.reply("Please enter your email to login?");
    //To store the input
    ctx.scene.session.serviceProviderAuth = {};
    //Store the telegram user id
    ctx.scene.session.serviceProviderAuth.telegramUserId = ctx.from.id;
    return ctx.wizard.next();
  },
     (ctx) => {
    //save email
    ctx.scene.session.serviceProviderAuth.email = ctx.message.text;

    // Authenticate email with backend
    axios.post("/api/service-provider/login", ctx.scene.session.serviceProviderAuth.email)
      .then(function(response) {
          if(response.status == 'success'){
            ctx.telegram.sendMessage(ctx.scene.session.serviceProviderAuth.telegramUserId,
                                     "You should receive an email with a verification token. Please enter the verification token.");
    
            return ctx.wizard.next();
            
          }else if (response.status == 'error'){
            ctx.telegram.sendMessage(ctx.scene.session.serviceProviderAuth.telegramUserId, "Error occurred please try again",
                                    {
            parse_mode: "markdown",
            reply_markup: {
              inline_keyboard: [
                 [{ text: "Back to Serice Provider Menu", callback_data: "serviceProvider" }],
                [{ text: "Back to MainMenu", callback_data: "Main" }]
              ]
            }
            });
            
          }      
        })

  },
     (ctx) => {
       
    ctx.scene.session.serviceProviderAuth.token = ctx.message.text;

    // Verify token 
    axios.post("/api/service-provider/verify", ctx.scene.session.serviceProviderAuth.token)
       .then(function(response){
          if(response.status == 'success'){
            ctx.telegram.sendMessage(ctx.scene.session.serviceProviderAuth.telegramUserId, "Authenticated successfully." + "\n" + "You can now proceed with setting or viewing appointments.",
                                    {
            parse_mode: "markdown",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Set Appointment", callback_data: "setAppointment" }],
                [{ text: "View Requests", callback_data: "getClientRequests" }],
                [{ text: "View Appointments", callback_data: "getAppointments" }],
                [{ text: "Back to MainMenu", callback_data: "Main" }]
              ]
            }
            });   
            
          }else if (response.status == 'error'){
            ctx.telegram.sendMessage(ctx.scene.session.serviceProviderAuth.telegramUserId, "Error occurred please try again",
                                    {
            parse_mode: "markdown",
            reply_markup: {
              inline_keyboard: [
                 [{ text: "Back to Serice Provider Menu", callback_data: "serviceProvider" }],
                [{ text: "Back to MainMenu", callback_data: "Main" }]
              ]
            }
            });
            
          } 
       })
    
    return ctx.scene.leave();// leave the scene 
  }                                                          
);

//TODO: add actions for setAppointment, getAppointment, getClientRequests



/** 
 * Student Section
 */

bot.action('userStudent', (ctx) => {
  const chatId = ctx.update.callback_query.message.chat.id;
  try {
    ctx.deleteMessage()
    //console.log(ctx)
  } catch (error) {
    console.log(error);
  };

  ctx.telegram.sendMessage(chatId, "Login to your account or Register before proceeding", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Login", callback_data: "login_User" }],
        [{ text: "Register", callback_data: "addUser" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }]
      ]
    }
  });

})

//TODO: setup a wizard scene to login and Verify User
//TODO: setup a wizard scene to register User
//TODO: add actions for addRequest, getAppointment, getMedicalHealthTeam, getMentalHealthTeam, getAvailableMedicalHealthTeam...


/** 
 * Admin Section
*/

bot.action('Admin', (ctx) => {
  const chatId = ctx.update.callback_query.message.chat.id;
  try {
    ctx.deleteMessage()
    //console.log(ctx)
  } catch (error) {
    console.log(error);
  };


  ctx.telegram.sendMessage(chatId, "Login to your acccount or Register before proceeding", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Login", callback_data: "login_Admin" }],
        [{ text: "Register", callback_data: "addAdmin" }],
        [{ text: "Register Service Provider", callback_data: "addServiceProvider" }], //For Admins to register SVP
        [{ text: "Back to MainMenu", callback_data: "Main" }]
      ]
    }
  });

})

//WizardScene to Register Admin
const adminWizard = new Scenes.WizardScene('admin-wizard',
  (ctx) => {
    ctx.reply("What is your full name?");
    //To store the input
    ctx.scene.session.admin = {};
    //Store the telegram user id
    ctx.scene.session.admin.telegramUserId = ctx.from.id;
    return ctx.wizard.next();
  },
  (ctx) => {
    //Store entered name
    ctx.scene.session.admin.fullName = ctx.message.text;
    ctx.reply("Enter your email?");
    return ctx.wizard.next();
  },
  (ctx) => {
    //store entered email
    ctx.scene.session.admin.email = ctx.message.text;
    ctx.reply("What is your speciality?");
    return ctx.wizard.next();
  },
  (ctx) => {
    //store speciality
    ctx.scene.session.admin.speciality = ctx.message.text;

    ctx.reply("Enter your working hour?");
    return ctx.wizard.next();
  },
     (ctx) => {
    //store working hour
    ctx.scene.session.admin.workingHour = ctx.message.text;

    ctx.reply("What is your prefered communication - Telegram or email?");
    return ctx.wizard.next();
  },
     (ctx) => {
    //store preferred communication
    ctx.scene.session.admin.communication = ctx.message.text;

    ctx.reply("Enter your phone number?");
    return ctx.wizard.next();
  },
     (ctx) => {
    //store phone number
    ctx.scene.session.admin.phoneNumber = ctx.message.text;

    // send data to backend
    axios.post("/api/admin/addAdmin", ctx.scene.session.admin).then(function(response) {
      console.log(response.data);
    })
    ctx.telegram.sendMessage(ctx.scene.session.admin.telegramUserId,
      "New Admin Added" + "\n" +
      "Full Name - " + ctx.scene.session.admin.fullName + "\n" +
      "Email - " + ctx.scene.session.admin.email + "\n" +
      "Speciality - " + ctx.scene.session.admin.speciality + "\n" +
      "Working Hour - " + ctx.scene.session.admin.workingHour + "\n" + 
      "Phone Number - " + ctx.scene.session.admin.phoneNumber + "\n" +                      
      "You have registerd successfully" + "\n",
      {
        parse_mode: "markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Back to Admin Menu", callback_data: "Admin" }],
            [{ text: "Back to MainMenu", callback_data: "Main" }]
          ]
        }
      });

    return ctx.scene.leave();// leave the scene 
  }
);

//WizardScene to Register ServiceProvider
const serviceProviderWizard = new Scenes.WizardScene('serviceProvider-wizard',
  (ctx) => {
    ctx.reply("What is your full name?");
    //To store the input
    ctx.scene.session.serviceProvider = {};
    //Store the telegram user id
    ctx.scene.session.serviceProvider.telegramUserId = ctx.from.id;
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

    ctx.reply("What is your prefered communication - Telegram or email?");
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
    axios.post("/api/admin/addServiceProvider", ctx.scene.session.serviceProvider).then(function(response) {
      console.log(response.data);
    })
    ctx.telegram.sendMessage(ctx.scene.session.serviceProvider.telegramUserId,
      "New Service Provider Added" + "\n" +
      "Full Name - " + ctx.scene.session.serviceProvider.fullName + "\n" +
      "Email - " + ctx.scene.session.serviceProvider.email + "\n" +
      "Speciality - " + ctx.scene.session.serviceProvider.speciality + "\n" +
      "Working Hour - " + ctx.scene.session.serviceProvider.workingHour + "\n" + 
      "Phone Number - " + ctx.scene.session.serviceProvider.phoneNumber + "\n" +                      
      "Registerd successfully" + "\n",
      {
        parse_mode: "markdown",
        reply_markup: {
          inline_keyboard: [
             [{ text: "Back to Admin Menu", callback_data: "Admin" }],
            [{ text: "Back to MainMenu", callback_data: "Main" }]
          ]
        }
      });

    return ctx.scene.leave();// leave the scene 
  }
);

const stage = new Scenes.Stage([adminWizard, serviceProviderWizard, serviceProviderLoginWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.action('addAdmin', (ctx) =>
  ctx.scene.enter('admin-wizard')
);

bot.action('addServiceProvider', (ctx) =>
  ctx.scene.enter('serviceProvider-wizard')
);

//TODO: setup a wizard scene to login and verify Admin
//TODO: add actions for getClientRequests and others...


/** 
 * For specific consultation services 
*/

bot.action('medicalConsultation', (ctx) => {
  const chatId = ctx.update.callback_query.message.chat.id;
  try {
    ctx.deleteMessage()
    //console.log(chatId)
  } catch (error) {
    console.log(error);
  };


  ctx.telegram.sendMessage(chatId, "You can contact - " + "\n" + "Click on the button to go to channel.", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Go to channel", callback_data: "medicalConsultationChannel" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }]
      ]
    }
  });

})

//To forward request to channels (If we are still going with this idea.)
bot.action('medicalConsultationChannel', (ctx) => {
  const chatId = ctx.update.callback_query.message.chat.id;
  //const medicalConsultationChannelId = -1001546278883;
  const medicalCOnsultationChannelId = process.env['medChannelId'];
  try {
    ctx.deleteMessage()
    //console.log(channelId)
  } catch (error) {
    console.log(error);
  };


  ctx.telegram.sendMessage(medicalConsultationChannelId, "New message recieved from -", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Respond to user", callback_data: "respondInChannel" }]
      ]
    }
  });


  ctx.telegram.sendMessage(chatId, "Message forwarded to channel", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Back to MainMenu", callback_data: "Main" }]
      ]
    }
  });

})

bot.action('Main', (ctx) => {
  const chatId = ctx.update.callback_query.message.chat.id;
  try {
    ctx.deleteMessage()
    //console.log(chatId)
  } catch (error) {
    console.log(error);
  };

  ctx.telegram.sendMessage(chatId, "Welcome to Mental Wellness bot", {
    parse_mode: "markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "I am service Provider", callback_data: "serviceProvider" }], 
        [{ text: "I need help", callback_data: "userStudent" }],
        [{ text: "Admin", callback_data: "Admin" }]
      ]
    }
  });
})


bot.launch();
