let chatQueue = [];
const chat = document.getElementById("chat");

let blinkingCursor = document.createElement("span");
blinkingCursor.classList.add("blinking-cursor");
blinkingCursor.innerText = "|"; // &lhblk;

async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

function removeBlinkingCursorAnimation() {
    if(blinkingCursor.classList.contains("blinking-cursor")){
        blinkingCursor.classList.remove("blinking-cursor");
    }
}

function addBlinkingCursorAnimation() {
    if(!blinkingCursor.classList.contains("blinking-cursor")){
        blinkingCursor.classList.add("blinking-cursor");
    }
}

async function typeWriter() {
    let working = true;
    let chatMessage = "";
    let chatMessageDiv;

    while (working) {
        while (chatQueue.length > 0){
            let chatElement = chatQueue.shift(); // Get oldest chat message

            chatMessage = chatElement["name"] + ": " + chatElement["message"];

            let chatPictureBox = document.createElement("div");
            chatPictureBox.style.width = "97px";
            chatPictureBox.style.float = "left";
            chatPictureBox.style.paddingBottom = "5px";
            chatPictureBox.style.position = "relative";


            let chatPictureBoxTop = document.createElement("div");
            chatPictureBoxTop.style.width = "99px";
            chatPictureBoxTop.style.height = "13px";
            chatPictureBoxTop.style.backgroundImage = "url('img/pictureBox/top.png')";

            let chatPictureBoxMiddle = document.createElement("div");
            chatPictureBoxMiddle.style.width = "99px";
            chatPictureBoxMiddle.style.height = "73px";
            chatPictureBoxMiddle.style.backgroundImage = "url('img/pictureBox/middle.png')";

            let chatPictureBoxBottom = document.createElement("div");
            chatPictureBoxBottom.style.width = "99px";
            chatPictureBoxBottom.style.height = "20px";
            chatPictureBoxBottom.style.backgroundImage = "url('img/pictureBox/bottom.png')";

            let chatPictureBoxImage = document.createElement("div");
            chatPictureBoxImage.style.width = "80px";
            chatPictureBoxImage.style.height = "80px";
            chatPictureBoxImage.style.backgroundImage = "url('" + chatElement["image"] + "')";
            chatPictureBoxImage.style.backgroundSize = "contain";
            chatPictureBoxImage.style.position = "absolute";
            chatPictureBoxImage.style.top = "6px";
            chatPictureBoxImage.style.left = "3px";

            chatPictureBox.append(chatPictureBoxTop);
            chatPictureBox.append(chatPictureBoxMiddle);
            chatPictureBox.append(chatPictureBoxBottom);
            chatPictureBox.append(chatPictureBoxImage);

            let chatMessageBox = document.createElement("div");
            chatMessageBox.style.width = "430px";
            chatMessageBox.style.paddingLeft = "100px";
            chatMessageBox.style.paddingBottom = "5px";


            let chatMessageBoxTop = document.createElement("div");
            chatMessageBoxTop.style.width = "430px";
            chatMessageBoxTop.style.height = "13px";
            chatMessageBoxTop.style.backgroundImage = "url('img/messageBox/top.png')";

            let chatMessageBoxBottom = document.createElement("div");
            chatMessageBoxBottom.style.width = "430px";
            chatMessageBoxBottom.style.height = "21px";
            chatMessageBoxBottom.style.backgroundImage = "url('img/messageBox/bottom.png')";

            let chatMessageBoxMiddle = document.createElement("div");
            chatMessageBoxMiddle.style.width = "425px";
            chatMessageBoxMiddle.style.paddingLeft = "5px";
            chatMessageBoxMiddle.style.backgroundImage = "url('img/messageBox/middle.png')";

            chatMessageDiv = document.createElement("div");
            chatMessageDiv.append(blinkingCursor);
            chatMessageDiv.style.width = "408px";

            chatMessageBoxMiddle.append(chatMessageDiv);

            chatMessageBox.append(chatMessageBoxTop);
            chatMessageBox.append(chatMessageBoxMiddle);
            chatMessageBox.append(chatMessageBoxBottom);

            let chatMessageComplete = document.createElement("div");
            chatMessageComplete.style.width = "527px";
            chatMessageComplete.style.clear = "left";
            chatMessageComplete.append(chatPictureBox);
            chatMessageComplete.append(chatMessageBox);

            let counter = 0;

            chat.append(chatMessageComplete);

            for (let i = 0; i < chatMessage.length; i++){
                removeBlinkingCursorAnimation();
                blinkingCursor.insertAdjacentHTML('beforebegin', chatMessage[counter++]); // Add character before blinking cursor
                await delay(20);
            }

            addBlinkingCursorAnimation();

            chatMessageComplete.classList.add("hide");
        }

        await delay(1000);
    }
}

const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

socket.onopen = function(e) {
    console.log("Connect!");
    socket.send("CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands");
    socket.send("PASS oauth:"+TOKEN);
    socket.send("NICK "+CHANNEL);
    socket.send("JOIN #"+CHANNEL);
    console.log("Success!");
}

function removeEmptyChatCursor(){
    const emptyChat = document.getElementById("emptyChat");
    if(emptyChat !== null) {
        document.getElementById("emptyChat").remove();
    }
}

// Host:
// data: ":jtv!jtv@jtv.tmi.twitch.tv PRIVMSG serdrad0x :StarWolf3000 is now hosting you.↵"

// Raid:
// @badge-info=;badges=broadcaster/1,premium/1;color=#8F1093;display-name=Serdrad0x;emotes=;flags=;id=f9c1adee-7ac4-48e2-a008-b7f954b2fbd5;mod=0;room-id=94927264;subscriber=0;tmi-sent-ts=1589384272987;turbo=0;user-id=94927264;user-type= :serdrad0x!serdrad0x@serdrad0x.tmi.twitch.tv PRIVMSG #serdrad0x :Hi

let viewerList = {};

socket.onmessage = function (e) {
    // https://dev.twitch.tv/docs/irc/guide/
    if (e.data.match(/PING\s:tmi\.twitch\.tv/)){
        socket.send("PONG :tmi.twitch.tv");
    }

    // Filter PRIVMSG
    let message = e.data.match(/(.*)\s:[A-Za-z0-9-_]+![A-Za-z0-9-_]+@([A-Za-z0-9-_]+)\.tmi\.twitch\.tv\sPRIVMSG\s#([A-Za-z0-9-_]+)\s:(.*?)$/im);
    console.log(e);
    if (message !== null){
        if(!(message[2] in viewerList)) {
            let badgeInfo = message[1].split(";");
            let badgeUser = {};

            for (let i = 0; i < badgeInfo.length; i++) {
                let badgeElement = badgeInfo[i].split("=");
                badgeUser[badgeElement[0]] = badgeElement[1];
            }
            viewerList[message[2]] = badgeUser;

            var url = new URL("https://api.twitch.tv/helix/users");
            var params = {
                "id": viewerList[message[2]]["user-id"]
            };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            fetch(url, {
                method: "GET",
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": "Bearer " + TOKEN
                }
            }).then(response => response.json()).then(data => {
                console.log(data);
                viewerList[message[2]]["image"] = data["data"][0]["profile_image_url"];

                chatQueue.push({
                    "name": viewerList[message[2]]["display-name"],
                    "image": viewerList[message[2]]["image"],
                    "message": message[4]
                })

                console.log(data);
            });

        } else {
            chatQueue.push({
                "name": viewerList[message[2]]["display-name"],
                "image": viewerList[message[2]]["image"],
                "message": message[4]
            })
        }
        removeEmptyChatCursor();
    }
}

socket.onclose = function (e) {
    if (e.wasClean) {
        console.log("Closed");
    } else {
        console.log("Connection died");
    }
}

socket.onerror = function (e) {
    console.log("Error")
}

typeWriter().catch((e) => {
    console.error(e);
})