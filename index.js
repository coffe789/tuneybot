const { Client, Events, GatewayIntentBits, Partials, Poll, Collection, PollAnswer, PollLayoutType } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages],
  partials: [
      Partials.Channel,
      Partials.Message
    ],
})

let polls = []

function create_poll(options, poll_title, message) {

  let poll = new Poll(client, {
    "allowMultiselect" : false,
    "client" : client,
    "question" : {"text" : poll_title},
    "answers" : new Collection(),
  }, message)

  // Populate answers
  for (let i = 0; i < options.length; i += 1)
  {
    poll.answers.set(i, new PollAnswer(client, {"id" : i, "poll_media" : {"text" : options[i]}}, poll));
  }

  return poll;
}

function close_polls() {
  while (polls.length > 0) {
    try {
      let m = polls.pop();
      m.poll.end();
    } catch {
      console.log("Error when closing polls...");
    };
  }
}

// NOTE: we don't do proper commands..
async function handle_command(interaction) {

}

let toChannel;
let fromChannel;
async function handle_message(message) {
  const options = [];

  // Allow comments
  if (message.content && message.content[0] == ".") {
    return;
  }

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

  if (message.content == "/tuney close") {
    close_polls()
    message.channel.send("Polls have been closed.")
    return;
  }

  if (message.content && message.content[0] == "/") {
    // Prevent mimicking typos when inputing commands
    return;
  }
  

  if (fromChannel == undefined || message.channel != fromChannel) {
    console.log("Ignoring poll request as it is not the selected channel");
    return;
  }

  // Poll
  let poll_title = "What will you do?"
  for (const line of message.content.split('\n')) {
    if (line.slice(0, 3) === "-- " && line.length >= 4) {
      poll_title = line.slice(3, line.length);
    }

    if (line.slice(0, 2) === "- " && line.length >= 3) {
      options.push(line.slice(2, line.length));
    }
  }

  // If no options, normal message
  let this_channel = toChannel != undefined ? toChannel : message.channel;
  if (options.length > 0) {
    try {
      let poll = create_poll(options, poll_title, message);
      polls.push(await this_channel.send({
        "poll" : poll
      }));
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
