console.clear();

const { app, BrowserWindow, Menu, Tray } = require('electron');
const Path = require('node:path');
const { Client } = require('tmi.js');
const { parse } = require('simple-tmi-emotes');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');

const cfgPath = `C:/Users/${os.userInfo().username}/Documents/chatOverlay`;

if (!fs.existsSync(`${cfgPath}/config.json`)) {
  fs.mkdirSync(cfgPath);
  fs.writeFileSync(`${cfgPath}/config.json`, JSON.stringify({ channels: [] }, null, 4));
  spawnSync(`explorer ${cfgPath}`);
  process.exit();
}
const config = require(`${cfgPath}/config.json`);

/** @type {BrowserWindow} */
var MainWindow;
const client = new Client({
  channels: config.channels,
});
client.connect();

const assets = app.isPackaged ? Path.join(process.resourcesPath, "assets") : "assets";

app.whenReady().then(async () => {
  const tray = new Tray(`${assets}/fav.png`);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: () => process.exit() }
  ]);
  await createWindow();
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow();
  });

  tray.setToolTip('Chat Overlay');
  tray.setContextMenu(contextMenu);
});

async function createWindow() {
  MainWindow = new BrowserWindow({
    y: 0,
    x: 0,
    width: 440,
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    },
    resizable: false,
    focusable: false,
    alwaysOnTop: true,
    transparent: true,
    minimizable: false,
    titleBarStyle: 'hidden',
  });
  MainWindow.setIgnoreMouseEvents(true);

  await MainWindow.loadFile('./public/html/index.html');
  MainWindow.webContents.send('message', {
    channel: false,
    username: 'Welcome',
    color: 'purple',
    message: `chat overlay initialized on ${config.channels.length} channel(s)`
  });
}

client.on('message', (channel, userstate, messsage, self) => {
  // if (self) return;
  const username = userstate['display-name'];
  const color = userstate['color'];
  const msg = parse(messsage, userstate['emotes']);

  const data = {
    channel: false,
    username,
    color,
    message: msg,
  }

  if (client.getChannels().length > 1) data.channel = channel.replace('#', '');
  MainWindow.webContents.send('message', data);
});