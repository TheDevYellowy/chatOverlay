const { ipcRenderer } = require('electron');
const chatbox = document.getElementsByClassName('chatbox')[0];

ipcRenderer.on('message', (_, data) => {
  const { username, color, message, channel } = data;

  const before = document.getElementsByClassName('chat')[0];
  const amount = document.getElementsByClassName('chat');
  if (amount.length > 4) amount[4].remove();

  const div = document.createElement('div');
  div.classList.add('chat');

  const bold = document.createElement('strong');

  if (data.color == null) data.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const user = document.createElement('span');
  user.style.color = color;
  if (channel) user.innerText = `(${channel}) ${username}`;
  else user.innerText = `${username}`;

  bold.appendChild(user);

  const chatMsg = document.createElement('span');
  chatMsg.classList.add('message');
  chatMsg.style.color = 'white';
  chatMsg.innerHTML = `${message}`;

  const userDiv = document.createElement('div');
  const msgDiv = document.createElement('div');

  userDiv.style.background = 'rgb(69,69,69)';
  userDiv.style.width = 'fit-content';
  userDiv.style.verticalAlign = 'center';
  userDiv.style.height = '25px';
  userDiv.style.padding = '2px';
  userDiv.style.borderRadius = '7px';

  msgDiv.style.background = 'black';
  msgDiv.style.width = '340px';
  msgDiv.style.height = 'fit-content';
  msgDiv.style.marginLeft = '15px';
  msgDiv.style.marginBottom = '15px';
  msgDiv.style.padding = '5px';
  msgDiv.style.borderRadius = '10px';

  userDiv.appendChild(bold);
  msgDiv.appendChild(chatMsg);

  div.append(userDiv, msgDiv);

  if (before !== undefined) before.before(div);
  else chatbox.appendChild(div);

  setInterval(() => {
    amount[amount.length].remove();
  }, 8_000);
});