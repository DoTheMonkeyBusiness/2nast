var isChatHidden = false;
var historyElement;
var inputElement;
var buttonElement;
var textarea = null;
var stateButton = null;
var historyPanel = null;
var mySrc = document.getElementsByTagName('script')[0].src;
var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
};

var chatStyle =
    '.main {' +
    'background: #d3cadb;' +
    'width: 260px;' +
    'position: fixed;' +
    'right: 20px;' +
    'bottom: 20px;' +
    'box-shadow: 0 10px 20px rgba(0, 0, 0, 0.75);' +
    'border-radius: 10px;' +
    '}' +
    '.chatName {' +
    'background: #d3cadb;' +
    'width: 100px;' +
    'position: fixed;' +
    'margin-left: 10px;' +
    'margin-top: 6px;' +
    '}' +
    '.textArea {' +
    'border: 1px solid #545459;' +
    'background: transparent;' +
    'width: 65%;' +
    'height: 70px;' +
    'color: #545459;' +
    'float: left;' +
    'border-radius: 10px;' +
    'margin: 6px;' +
    '}' +
    '.sendButton{' +
    'width: 25%;' +
    'border: 1px solid #545459;' +
    'background: transparent;' +
    'color: #545459;' +
    'height = 60px;' +
    'border-radius: 10px;' +
    'padding: 10px;' +
    'bottom: 6px;' +
    'position: absolute;' +
    'right: 10px;' +
    '}' +
    '.historyPanel {' +
    'height: 240px;' +
    'margin: 6px;' +
    'margin-top: 30px;' +
    'background: #fff;' +
    'border-radius: 14px;' +
    'overflow-y: scroll;' +
    '}' +
    '.stateButton {' +
    'width: 26px;' +
    'height: 26px;' +
    'float: right;' +
    '}';



var getSrc = function () {

    var pattern = /[%][2][7]/g;
    var res = mySrc.split(pattern);
    return res;
}


// function createStyle() {
//     var styles = document.createElement('style');
//     styles.innerHTML = chatStyle;
//
//     return styles;
// }


function appendStylesheet() {
    var styleElement = document.createElement("style");

    styleElement.rel = "stylesheet";
    styleElement.type = "text/css";
    styleElement.href = '/css/' + getSrc()[7] + '.css';
    // document.head.appendChild(styleElement);

    return styleElement;
}


function createChatName() {
    var chatName = document.createElement('div');
    chatName.classList.add('chatName');
    chatName.innerHTML = getSrc()[1];

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
        return this.time.toLocaleString("en-US", options) + " " + this.sender + '<br>' + this.body + '<br>';
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
        var message = new Message(new Date(), getSrc()[3], 'The answer to the "' + text.toUpperCase() + '"');
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
    return localStorage.getItem('isChatHidden');
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

    stateButton.addEventListener('click', changeChatState);

    return stateButton;
}

function createHistory() {
    historyPanel = document.createElement("div");
    historyPanel.classList.add('historyPanel');

    return historyPanel;
}

function createChat () {
    var main = document.createElement('div');
    var history = createHistory();
    var textInput = createTextInput();
    var sendButton = createSendButton();
    main.id = 'chat';
    main.classList.add('main');

    historyElement = history;
    inputElement = textInput;
    buttonElement = sendButton;

    // main.appendChild(createStyle());
    main.appendChild(appendStylesheet());
    main.appendChild(createChatName());
    main.appendChild(createStateButton());
    main.appendChild(history);
    main.appendChild(textInput);
    main.appendChild(sendButton);

    document.body.appendChild(main);
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

window.addEventListener('load', createChat);
window.addEventListener('load', addHistoryToPage);