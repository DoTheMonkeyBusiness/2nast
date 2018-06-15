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



var getSrc = function () {

    var pattern = /[%][2][7]/g;
    var res = mySrc.split(pattern);
    return res;
}


function appendStylesheet() {
    var styles = document.createElement("link");

    styles.rel = "stylesheet";
    styles.type = "text/css";
    styles.href = 'style1.css';
    document.head.appendChild(styles);

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

    if(getSrc()[11] === 'true')
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

    if(getSrc()[11] === 'true')
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

    if (getSrc()[9] === "left") {
        positionClass = "chatPosition-left";
    } else if (getSrc()[9] === "right") {
        positionClass = "chatPosition-right";
    }

    return positionClass;
}

function createChat () {
    var main = document.createElement('div');
    var history = createHistory();
    var textInput = createTextInput();
    var sendButton = createSendButton();
    main.id = 'chat';
    main.classList.add(getSrc()[7]);

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
    createUserNamePromptMarkup();
    setOtherComponentsAvailability(false);
    document
        .getElementById(PROMPT_CONFIRM_BUTTON_ID)
        .addEventListener("click", function saveUserName() {
            var userName = document.getElementById(PROMPT_INPUT_ID).value;
            if (userName.length < 1){
                return;
            }
            config.userName = userName;
            document
                .getElementById(CHAT_ITEM)
                .removeChild(document.getElementById(USER_NAME_PROMPT_ID));
            setOtherComponentsAvailability(true);
            sendRequestToStorage(USER_NAME_FIELD, HTTP_PUT, config.userName);
        });
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
window.addEventListener('load', appendStylesheet);
window.addEventListener('load', createChat);
window.addEventListener('load', addHistoryToPage);