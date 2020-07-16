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

//context menu
// Trigger action when the contexmenu is about to be shown
$("#scene").on("contextmenu", "#draggable",function (event) {
    // Avoid the real one
    event.preventDefault();
    
    // Show contextmenu
    $(".custom-menu").finish().toggle(100).

    // In the right position (the mouse)
    
    css({
        top: event.pageY + "px",
        left: event.pageX + "px"
    });
});


// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {

    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {

        // Hide it
        $(".custom-menu").hide(100);
    }
});


// If the menu element is clicked
$(".custom-menu li").click(function (event) {

    // This is the triggered action name
    switch ($(this).attr("data-action")) {

        // A case for each action. Your actions here
        case "newNodeLink":
            var name = newName();
            $("#scene").append('<div id="draggable" class="'.concat(name, '"><h6 class="label">Node Link</h6><div class="draggable"><div class="highlightBlue"></div><textarea></textarea></div></div>'))
            $(".".concat(name)).css("top", (Math.ceil(event.pageY / 30 )*30)-4 );
            $(".".concat(name)).css("left", (Math.ceil(event.pageX / 30 )*30)-4 );
            
            //Grid system
            $(".".concat(name)).draggable({ snap: ".".concat(name), grid: [ 30, 30 ] });
            break;
        case "second":
            alert("second");
            break;
        case "third":
            alert("third");
            break;
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
});
