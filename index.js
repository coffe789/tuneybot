const { Client, Events, GatewayIntentBits, Partials, Poll, Collection, PollAnswer, PollLayoutType } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages],
  partials: [
      Partials.Channel,
      Partials.Message
    ],
})

async function create_poll(options, poll_title, message) {

  let p = {
    question: {text: poll_title},
    answers: [
    ],
    allowMultiselect: false,
    duration: 1,
  }
  // let poll = new Poll(client, {
  //   "allowMultiselect" : false,
  //   "client" : client,
  //   "question" : {"text" : poll_title},
  //   "answers" : new Collection(),
  //   "duration": 2
  // }, message)

  // Populate answers
  for (let i = 0; i < options.length; i += 1)
  {
    p.answers.push({text: options[i]});
    // poll.answers.set(i, new PollAnswer(client, {"id" : i, "poll_media" : {"text" : options[i]}}, poll));
  }

  return p;
}

async function handle_command(interaction) {

}

let toChannel;
let fromChannel;
async function handle_message(message) {
  const options = [];
  let poll_title = "What will you do?"

  if (message.content == "/tuney to") {
    toChannel = message.channel;
    message.channel.send("Ok! I will put my polls here.")
    return;
  }
  if (message.content == "/tuney from") {
    fromChannel = message.channel;
    message.channel.send("Ok! I will only read messages from here.")
    return;
  }

  if (fromChannel == undefined || message.channel != fromChannel) {
    console.log("Ignoring poll request as it is not the selected channel");
    return;
  }

  for (const line of message.content.split('\n')) {
    if (line.slice(0, 3) === "-- " && line.length >= 4) {
      poll_title = line.slice(3, line.length);
    }

    if (line.slice(0, 2) === "- " && line.length >= 3) {
      options.push(line.slice(2, line.length));
    }
  }

  let this_channel = toChannel != undefined ? toChannel : message.channel;
  if (options.length > 0) {
    try {
      let poll = await create_poll(options, poll_title, message);
      await this_channel.send({
        "poll" : poll
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }
  else if (!message.author.bot && message.content) {
    this_channel.send(message.content);
  }
}

// TODO handle commands
client.on(Events.InteractionCreate, async interaction => {
  // TODO If not command, return
  await handle_command(interaction);
	console.log(interaction);
});

// Print when ready
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Set message callback
client.on(Events.MessageCreate, async message => {
  await handle_message(message);
});

// Log in to Discord
client.login(token);
