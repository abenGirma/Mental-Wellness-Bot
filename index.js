const { Telegraf, Scenes, session, wizard, Stage } = require('telegraf');
const { message } = require('telegraf/filters');
const { bodyParser } = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose')
const User = require('./models/userModel')

const myusers = require('./routes/myusers')
const express = require('express');
const app = express();


app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/myusers', myusers)

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:3000`);
});


mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://root:1234root@SACbot.qqmpveg.mongodb.net/Bot-Users?retryWrites=true&w=majority')
.then(() => {
    console.log('connected to MongoDB')
}).catch((error) => {
    console.log(error)
})


const token = process.env['Token'];
const bot = new Telegraf(token);


bot.start((ctx) => {
  const chatId = ctx.update.message.chat.id;

  ctx.telegram.sendMessage(chatId, "Welcome to Mental Wellness bot", {
    parse_mode: "markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "I am service Provider", callback_data: "serviceProvider" }],[{ text: "I need help", callback_data: "userStudent" }]
      ]
    }
  });
                
});

//Not setup with database yet
bot.action('serviceProvider', (ctx) => {
  const chatId = ctx.update.callback_query.message.chat.id;
  try {
    ctx.deleteMessage()
    //console.log(ctx)
  } catch (error) {
    console.log(error);
  };


  ctx.telegram.sendMessage(chatId, "What kind of service do you want to provide?", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Medical service", callback_data: "medicaConsultation" }, { text: "Economic service", callback_data: "economicConsultation" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }]
      ]
    }
  });

})

bot.action('userStudent', (ctx) => {
  const chatId = ctx.update.callback_query.message.chat.id;
  try {
    ctx.deleteMessage()
    //console.log(ctx)
  } catch (error) {
    console.log(error);
  };


  ctx.telegram.sendMessage(chatId, "Register before proceeding", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Register", callback_data: "addUser" }],
        [{ text: "Back to MainMenu", callback_data: "Main" }]
      ]
    }
  });

})


 const userWizard = new Scenes.WizardScene('user-wizard', 
    (ctx) => {
      ctx.reply("What is your full name?");
      //To store the input
      ctx.scene.session.user = {};
      //Store the telegram user id
      ctx.scene.session.user.telegramUserId = ctx.from.id;
      return ctx.wizard.next();
 },
    (ctx) => {
        //Store entered name
        ctx.scene.session.user.fullName = ctx.message.text;
        ctx.reply("What is your student Id?");
        return ctx.wizard.next();
  },
    (ctx) => {
      //store entered student Id
      ctx.scene.session.user.studentId = ctx.message.text;
      ctx.reply("How old are you?");
      return ctx.wizard.next();
  },                                
    (ctx) => {
      //store entered age
      ctx.scene.session.user.age = ctx.message.text;

      // store user data to database
      axios.post("https://mental-health-awareness-bot.abeng2.repl.co/myusers", ctx.scene.session.user)
       ctx.telegram.sendMessage(ctx.scene.session.user.telegramUserId, 
                                "New User Added" + "\n" + 
                                "Name - " +  ctx.scene.session.user.fullName  + "\n" + 
                                "You have registerd successfully" + "\n",
                                {
                    parse_mode: "markdown",
                    reply_markup: {
                      inline_keyboard: [
                        [{ text: "Back to MainMenu", callback_data: "Main" }]
                      ]
                    }
        });
      
      return ctx.scene.leave();// leave the scene 
    }                                
);

const stage = new Scenes.Stage([userWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.action('addUser', (ctx) => 
  ctx.scene.enter('user-wizard')
);

//For specific consultation services 
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

//To forward request to channel
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
        [{ text: "I am service Provider", callback_data: "serviceProvider" }],[{ text: "I need help", callback_data: "userStudent" }]
      ]
    }
  });
})


bot.launch();
