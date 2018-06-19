var main = null;
var chatName = null;
var isChatHidden = false;
var historyElement;
var inputElement;
var buttonElement;
var textarea = null;
var stateButton = null;
var userName = null;
var historyPanel = null;
var mySrc = document.getElementsByTagName('script')[0].src;
var tile = 'Chat';
var botName = 'Bot';
var chatUrl = 'https://firebase.com';
var cssClass = 'main';
var position = 'right';
var allowMinimize = false;
var allowDrag = false;
var showDateTime = false;
var requireName = false;
var requests ='fetch';
var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
};

// var config = {
//     apiKey: "AIzaSyCcoZTWAbJGowNOKthfvZUxHzEG6PZu7Xc",
//     authDomain: "chat-d4c14.firebaseapp.com",
//     databaseURL: "https://chat-d4c14.firebaseio.com",
//     projectId: "chat-d4c14",
//     storageBucket: "",
//     messagingSenderId: "712179949551"
// };
// firebase.initializeApp(config);

var getSrc = function () {

    var pattern = /[%][2][7]/g;
    var res = mySrc.split(pattern);
    tile = res[1];
    botName = res[3];
    chatUrl = res[5];
    cssClass = res[7];
    position = res[9];
    if(res[11] === 'true')
        allowMinimize = true;
    else allowMinimize = false;
    if(res[13] === 'true')
        allowDrag = true;
    else allowDrag = false;
    if(res[15] === 'true')
        showDateTime = true;
    else showDateTime = false
    if(res[17] === 'true')
        requireName = true;
    else requireName = false
    requests = res[19];
}


function moveAt(e) {
    main.style.left = e.pageX - chatName.offsetWidth / 2 + 'px';
    main.style.top = e.pageY - chatName.offsetHeight / 2 + 'px';
}

function dragChat(e) {
    moveAt(e);
    document.addEventListener('mousemove', moveAt);

    function finishDrag () {
        document.removeEventListener('mousemove', moveAt);
        document.removeEventListener('mouseup', finishDrag);
    }

    chatName.addEventListener('mouseup', finishDrag);
}

function appendStylesheet() {
    var styles = document.createElement("link");

    styles.rel = "stylesheet";
    styles.type = "text/css";
    styles.href = 'style1.css';
    document.head.appendChild(styles);

    }


function createChatName() {
    chatName = document.createElement('div');
    chatName.classList.add('chatName');
    chatName.innerHTML = tile;

    if(allowDrag)
    chatName.addEventListener('mousedown', dragChat);

    return chatName;
}

function createTextInput() {
    textarea = document.createElement('textarea');
    textarea.id = 'textarea';
    textarea.classList.add('textArea');
    textarea.placeholder = 'Message...';

    return textarea;
}

function Message(time, sender, body) {
    this.time = time;
    this.sender = sender;
    this.body = body;

    this.showMessage = function showMsg() {
        if (showDateTime)
        return this.time.toLocaleString("en-US", options) + " " + this.sender + '<br>' + this.body + '<br>';
        else return this.sender + '<br>' + this.body + '<br>';
    }
}

function saveMessageToLocalStorage(message) {
    var historyArray = localStorage.getItem('historyArray');
    var messages = [];
    if (historyArray !== null) {
        messages = JSON.parse(historyArray);
    }

    messages.push(message);
    localStorage.setItem('historyArray', JSON.stringify(messages));
}

function addMessage(text) {
    var message = new Message(new Date(), 'YOU', text);
    historyPanel.innerHTML += '<br>' + message.showMessage();
    saveMessageToLocalStorage(message);
}

function addAnswer(text) {
    function createAnswer () {
        var message = new Message(new Date(), botName, 'The answer to the "' + text.toUpperCase() + '"');
        historyPanel.innerHTML += '<br>' + message.showMessage();
        saveMessageToLocalStorage(message);

        return message;
    }
    setTimeout(createAnswer, 15000);
}

function sendMessage() {
    addMessage(textarea.value);
    addAnswer(textarea.value);
    textarea.value = '';
}

function createSendButton() {
    var sendButton = document.createElement('button');
    sendButton.id = 'sendButton';
    sendButton.classList.add('sendButton');
    sendButton.innerHTML = 'Send';

    sendButton.addEventListener("click", sendMessage);

    return sendButton;
}

function getChatStatus() {

    if(allowMinimize)
    return localStorage.getItem('isChatHidden');
    else return false;

}

function setChatStatus() {
    localStorage.setItem('isChatHidden', isChatHidden);
}

function initStateButton() {
    if (!isChatHidden) {
        stateButton.innerHTML = '-';
    } else {
        stateButton.innerHTML = '[]';
    }
}

function changeChatState() {
    isChatHidden = !isChatHidden;
    setChatStatus();
    historyElement.style.display = isChatHidden ? 'none' : 'block';
    inputElement.style.display = isChatHidden ? 'none' : 'block';
    buttonElement.style.display = isChatHidden ? 'none' : 'block';
    initStateButton();
}

function createStateButton() {
    stateButton = document.createElement('button');
    stateButton.id = "stateButton";
    stateButton.classList.add('stateButton');
    isChatHidden = JSON.parse(getChatStatus());

    initStateButton();

    if(allowMinimize)
    stateButton.addEventListener('click', changeChatState);

    return stateButton;
}

function createHistory() {
    historyPanel = document.createElement("div");
    historyPanel.classList.add('historyPanel');

    return historyPanel;
}

function positionChat() {
    var positionClass;

    if (position === "left") {
        positionClass = "chatPosition-left";
    } else if (position === "right") {
        positionClass = "chatPosition-right";
    }

    return positionClass;
}

function createChat () {
    main = document.createElement('div');
    var history = createHistory();
    var textInput = createTextInput();
    var sendButton = createSendButton();
    main.id = 'chat';
    main.classList.add(cssClass);

    historyElement = history;
    inputElement = textInput;
    buttonElement = sendButton;


    main.classList.add(positionChat());
    main.appendChild(createChatName());
    main.appendChild(createStateButton());
    main.appendChild(history);
    main.appendChild(textInput);
    main.appendChild(sendButton);

    document.body.appendChild(main);
}

function askUserName() {
    userName = document.createElement("div");
    userName.id = "userName";

}

function addHistoryToPage() {
    var historyArray = localStorage.getItem('historyArray');
    var messagesArray;
    var message;
    if (historyArray !== null) {
        messagesArray = JSON.parse(historyArray);
        messagesArray.forEach(function addMsg (element) {
            message = new Message(new Date(element.time), element.sender, element.body);
            historyPanel.innerHTML += '<br>' + message.showMessage();
        });
    }
    isChatHidden = JSON.parse(getChatStatus());
    historyElement.style.display = isChatHidden ? 'none' : 'block';
    inputElement.style.display = isChatHidden ? 'none' : 'block';
    buttonElement.style.display = isChatHidden ? 'none' : 'block';
    initStateButton();
}
window.addEventListener('load', getSrc);
window.addEventListener('load', appendStylesheet);
window.addEventListener('load', createChat);
window.addEventListener('load', addHistoryToPage);