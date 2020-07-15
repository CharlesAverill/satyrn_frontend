const win = require('electron').remote;
const { ipcRenderer } = require('electron');
const {PythonShell} = require('python-shell');
var container = document.getElementById('container');
var nodes = [];

var mouse_x = 0;
var mouse_y = 0;

ipcRenderer.on('create',function(event,args)
{
    nodes.push(new Node(mouse_x,mouse_y));
});

ipcRenderer.on('run',function(event,args)
{
    Log('cell 1 python y');
});

window.addEventListener('mousemove',function(event)
{
    mouse_x = event.clientX;
    mouse_y = event.clientY;
});

class Node
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.mx = 0;
        this.my = 0;
        this.selected = false;
        this.code = "";
        this.self = null;
        this.create();
    }

    create()
    {
        this.self = document.createElement('textarea');
        this.self.setAttribute('class','main-node');
        this.self.style.left = this.x;
        this.self.style.top = this.y;
        container.appendChild(this.self);

        var that = this;

        this.self.addEventListener('mousedown',function()
        {
           that.selected = true;
           that.mx = that.x;
           that.my = that.y;
        });

        this.self.addEventListener('mouseup',function()
        {
            that.selected = false;
        });

        this.self.addEventListener('mousemove',function()
        {
           if(that.selected == true)
           {
               that.self.style.left = (mouse_x - 128) + "px";
               that.self.style.top = (mouse_y - 128) + "px";
           }
        });
    }
}

function Log(arg)
{
    var options = {
        scriptPath: path.join(__dirname,'../scripts/'),
        args: [arg]
    }

    var script = new PythonShell('interpreter.py',options);

    script.on('message',function(message)
    {
        alert(message);
    });
}