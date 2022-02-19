# Chat with profile picture and typewriter effect

This is a chat which can actually be used for Twitch and with some changes for other platforms too. It will trigger
whenever there is one of the following events:

- Message
# Getting Started

Clone the repository and change the config.js to fit your needs. You have to set the following variables:

| Variable            | Description                                             |
| ------------------- | ------------------------------------------------------- |
| CLIENT_ID           | To receive a client id, you have to register an app at https://dev.twitch.tv/console/apps/create <br> For further instructions take a look at the official Twitch guide: https://dev.twitch.tv/docs/v5                  |
| TOKEN               | You can use your client id to generate a token with https://github.com/serdrad0x/Twitch-API-Request-Tool |
| CHANNEL             | Name of your channel                          |

Any other changes like a new image for the border may need additional changes in the according files!

Add the chat.html as new browser source in your streaming software, and you are good to go.

# Additionally used

There are no other dependencies, just good old plain Javascript but it uses cool stuff like asynchronous functions and
promises! 

# Typewriter effect
The typewriter effect shows the well-known cursor | next to newly written text. The cursor won't show any blinking animation
while writing and starts blinking, after the text is completely written. Same for removing text from an element.

The typewriter effect works across multiple lines.