const electron = require('electron');
const {BrowserWindow,app,Menu,ipcMain} = electron;
const path = require('path');

require('electron-reload')(__dirname);

var window_width = 1280;
var window_height = 720;
var window = null;

app.on('ready',function()
{
    window = new BrowserWindow({width: window_width,height: window_height,icon: path.join(__dirname,'Icon.png'),webPreferences: {nodeIntegration: true}});
    window.loadURL('file://' + __dirname + '/views/index.html');

    var menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {label: 'Create Node...',click: function()
            {
                window.webContents.send('create');
            }},
                {label: 'Run',click: function()
            {
                window.webContents.send('run');
            }},
                {label:'Exit'}
            ]
        }
    ]);

    Menu.setApplicationMenu(menu); 
});

app.on('close',function()
{
    window = null;
});