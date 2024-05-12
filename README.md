# Tuneybot
Tuneybot is a discord bot for streamlining pxtune's game TONEYQUEST.

# Setup
- Follow discord's instructions for creating an application
- Clone the repo
- Using Node v22.1<, enter the project's directory and run `npm install` to install its dependencies
- Create a file `config.json` containing the following, using the application token you get from discord:
```json
{
	"token": "my_token",
}
```
- Run `node index.js`

# Usage
- Use discord's developer portal to add Tuneybot to a server, or DM Tuneybot directly
- Any message containing bullet points will create a poll
- The format is as follows:
```
-- My poll name (optional)
- Option 1
- Option 2
```
