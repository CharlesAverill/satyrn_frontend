function newName() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

//Make initial panel draggable
$(function () {
    $("#draggable").draggable({ snap: "#draggable", grid: [ 30, 30 ] });
});

//panzoom scene
var element = document.querySelector('#scene');

/*
panzoom(element, {
    beforeMouseDown: function (e) {
        var shouldIgnore = !e.altKey;
        return shouldIgnore;
    }
});
*/

var right_clicked_cell;

//context menu
// Trigger action when the contexmenu is about to be shown
$("#scene").on("contextmenu", "#draggable",function (event) {
    // Avoid the real one
    event.preventDefault();

    var $this = $(this);
    var cl = $this.attr("class")

    right_clicked_cell = cl.substring(0, cl.indexOf("ui-draggable") - 1);

    // Show contextmenu
    $(".custom-menu").finish().toggle(100).

    // In the right position (the mouse)

    css({
        top: event.pageY + "px",
        left: event.pageX + "px"
    });
});

var clicked_textarea = "";
var renaming = false;
var currentVal = "";
var ta_class = "";
var started_ta_edit = false;

$("textarea").click(function(){
    if($(this).attr("class") == "transparent_text"){
        clicked_textarea = $(this).val();
        renaming = true;
    }
    else{
        renaming = false;
    }
    started_ta_edit = true;
});

$(document).bind("mousedown", function (e) {
    console.log(renaming);
    // If the clicked element is not the menu
    if (started_ta_edit && currentVal != "" && !$(e.target).parents(".transparent_text").length > 0 && !$(e.target).parents(".draggable").length > 0) {

        // Hide it
        if(renaming){
            has_changed = true;
            $.ajax({
                type : "POST",
                url : '/rename_cell/',
                dataType: "json",
                data: JSON.stringify({'old_name': clicked_textarea,
                    'new_name': currentVal}),
                contentType: "application/json",
                success: function (success) {
                    if(success == "false"){
                        alert("Couldn't rename cell " + right_clicked_cell);
                    }
                    else{
                        clicked_textarea = currentVal;
                    }
                }
            });
        }
        else{
            console.log(ta_class);
            console.log(currentVal);
            $.ajax({
                type : "POST",
                url : '/edit_cell/',
                dataType: "json",
                data: JSON.stringify({'name': ta_class,
                    'content': currentVal}),
                contentType: "application/json",
                success: function (success) {
                    if(success == "false"){
                        alert("Couldn't edit cell " + right_clicked_cell);
                    }
                    else{
                        var succ = true;
                    }
                }
            });
        }
        started_ta_edit = false;
    }
});

$(document).on("change keyup paste", 'textarea', function() {
    currentVal = $(this).val();

    console.log("this " + $(this));

    ta_class = $(this).attr("class").substring(9);
});

// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {

    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {

        // Hide it
        $(".custom-menu").hide(100);
    }
});

var cells = [];

// If the menu element is clicked
$(".custom-menu li").click(function (event) {

    // This is the triggered action name
    switch ($(this).attr("data-action")) {

        // A case for each action. Your actions here
        /*
        case "newCell":
            var new_cell = new Cell(newName());
            cells.push(new_cell);
            new_cell.append(event);
            break;
        */
        case "newCell":
            $.ajax({
                type : "GET",
                url : '/create_cell/',
                dataType: "text",
                success: function (data) {
                    $("#scene").append('<div id="draggable" class="'.concat(data, '"><textarea class="transparent_text" rows=1 spellcheck="false" maxlength=25\n' +
                        '            style="border: none;\n' +
                        '                    background-color: transparent;\n' +
                        '                    border-color: Transparent;\n' +
                        '                    resize: none;\n' +
                        '                    outline: none;\n' +
                        '\n' +
                        '                    color:white;">' + data + '</textarea><div class="draggable"><div class="highlightBlue"></div><textarea class="textarea_' + data + '" spellcheck="false"></textarea></div></div>'))

                    $(".".concat(data)).css("top", (Math.ceil(event.pageY / 30 )*30)-4 );
                    $(".".concat(data)).css("left", (Math.ceil(event.pageX / 30 )*30)-4 );

                    //Grid system
                    $(".".concat(data)).draggable({ snap: ".".concat(data), grid: [ 30, 30 ] });
                }
            });
            break;
        case "destroyCell":
            $.ajax({
                type : "POST",
                url : '/destroy_cell/',
                dataType: "json",
                data: JSON.stringify(right_clicked_cell),
                contentType: "application/json",
                success: function (success) {
                    if(success == "false"){
                        alert("Couldn't remove cell " + right_clicked_cell);
                    }
                    else{
                        $("div").remove("." + right_clicked_cell);
                    }
                }
            });
            break;
        case "third":
            alert("third");
            break;
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
});

class Cell{
    constructor(name, prev_cell){
        self.name = name;
        self.prev_cell = prev_cell;
    }

    get name(){
        return self.name;
    }

    append(event){
        $("#scene").append('<div id="draggable" class="'.concat(self.name, '"><h6 class="label">' + self.name + '</h6><div class="draggable"><div class="highlightBlue"></div><textarea></textarea></div></div>'))
        $(".".concat(self.name)).css("top", (Math.ceil(event.pageY / 30 )*30)-4 );
        $(".".concat(self.name)).css("left", (Math.ceil(event.pageX / 30 )*30)-4 );

        //Grid system
        $(".".concat(self.name)).draggable({ snap: ".".concat(self.name), grid: [ 30, 30 ] });
    }

    remove(){
        $(self.name).remove()
    }
}