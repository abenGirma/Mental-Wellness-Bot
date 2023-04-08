const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
//const Telegraf = require('telegraf');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//const token = process.env.Token;
const bot = new Telegraf('5983037876:AAHjntm8dIMOhE-E_PgkRrqvEtfFnFIGdyw');

bot.start((ctx) => {
   const chatId = ctx.update.message.chat.id;
  
  ctx.telegram.sendMessage(chatId, "Welcome to Mental Wellness bot", {
    parse_mode: "markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Consultation", callback_data: "consultation" },
        { text: "Another Command", callback_data: "information" }]
      ]
    }
  });
});

bot.action('consultation', (ctx) => {
 const chatId = ctx.update.callback_query.message.chat.id;
  try {
    ctx.deleteMessage()
    //console.log(ctx)
  }catch(error){
    console.log(error);
  };

  
    ctx.telegram.sendMessage(chatId, "What kind of consultation do you want?", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "Medical", callback_data: "medicalConsultation"},  {text: "Another Command", callback_data: "behavioralConsultation"}],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
  
})

bot.action('medicalConsultation', (ctx) => {
 const chatId = ctx.update.callback_query.message.chat.id;
  try {
    ctx.deleteMessage()
    //console.log(chatId)
  }catch(error){
    console.log(error);
  };

  
    ctx.telegram.sendMessage(chatId, "You can contact - " + "\n" + "Click on the botton to go to channel.", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "Go to channel", callback_data: "medicalConsultationChannel"},  {text: "Another command", callback_data: "contactConsultation"}],
          [{text: "Back to consultation", callback_data: "consultation"}],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
  
})

bot.action('medicalConsultationChannel', (ctx) => {
 const chatId = ctx.update.callback_query.message.chat.id;
  const medicalConsultationChannelId = -1001546278883;
  try {
    ctx.deleteMessage()
    //console.log(channelId)
  }catch(error){
    console.log(error);
  };

  
    ctx.telegram.sendMessage(medicalConsultationChannelId, "New message recieved from -", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "Respond to user", callback_data: "respondInChannel"}]
        ]
      }
    });

    ctx.telegram.sendMessage(chatId, "Message forwarded to channel", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "Back to consultation", callback_data: "consultation"}],
          [{text: "Back to MainMenu", callback_data: "Main"}]
        ]
      }
    });
  
})

bot.action('Main', (ctx) => {
  const chatId = ctx.update.callback_query.message.chat.id;
   try {
      ctx.deleteMessage()
      //console.log(chatId)
    }catch(error){
      console.log(error);
    };
  
  ctx.telegram.sendMessage(chatId, "Welcome to Mental Wellness bot", {
    parse_mode: "markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Consultation", callback_data: "consultation" },
        { text: "Another Command", callback_data: "information" }]
      ]
    }
  });
})


bot.help((ctx) => ctx.reply('Help command'));

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));

bot.on(message('text'), (ctx) => {
  const chatId = ctx.update.message.chat.id;
  //const { message_id } = ctx.reply(userInput);
  const messageId = ctx.update.message.message_id;
  const userInput = ctx.update.message.text;
  
  const user = {
    "age": "22",
    "department":"Medicine",
    "prevExperience": "none",
    "goal":"consultation"
  };

  const userAge = user.department;
      
  ctx.reply(userInput);
  //console.log(messageId);
  console.log(userInput); 
});

bot.hears('hi', (ctx) => {
  ctx.reply('Hey there');
  console.log(ctx);      
});


bot.launch();
