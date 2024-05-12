// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Poll, PollMediaQuestion, Collection, PollAnswer } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages]});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// client.on(Events.InteractionCreate, interaction => {
// 	console.log(interaction);
// 	console.log("DFSFSD");
// });

client.on(Events.MessageCreate, async message => {
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
    // Create poll
    poll = new Poll(client, {
      "allowMultiselect" : false,
      "client" : client,
      "expiresAt" : new Date(0), // Hoping 0 means forever?
      "question" : {"text" : poll_title},
      "answers" : new Collection(),
    }, message)

    // Populate answers
    for (let i = 0; i < options.length; i += 1)
    {
      poll.answers.set(i, new PollAnswer(client, {"id" : i, "poll_media" : {"text" : options[i]}}, poll));
    }

    // Send
    await message.channel.send({
      "poll" : poll
    });
  }

});

// Log in to Discord with your client's token
client.login(token);
