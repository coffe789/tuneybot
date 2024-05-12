const { Client, Events, GatewayIntentBits, Partials, Poll, Collection, PollAnswer } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages],
  partials: [
      Partials.Channel,
      Partials.Message
    ],
})

async function create_poll(options, poll_title, message) {
    poll = new Poll(client, {
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

async function handle_command(interaction) {

}

async function handle_message(message) {
  const options = [];
  let poll_title = "What will you do?"

	for (const line of message.content.split('\n')) {
    if (line.slice(0, 3) === "-- " && line.length >= 4) {
      poll_title = line.slice(3, line.length);
    }

    if (line.slice(0, 2) === "- " && line.length >= 3) {
      options.push(line.slice(2, line.length));
    }
  }

  if (options.length > 0) {
    try {
      poll = await create_poll(options, poll_title, message);
      await message.channel.send({
        "poll" : poll
      });
    } catch (error) {
      console.log(error);
    }
  }
}

// TODO handle commands
client.on(Events.InteractionCreate, interaction => {
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
