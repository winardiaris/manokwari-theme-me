
var anim = (function() {
    var activePage = null;
    var prepareShow = function() {
        $("#sidebar-panel").css("right", "0px");
    }

    var prepareHide = function() {
        changePage($("#sidebar-panel"), {
            transition: "none"
        });
        $("#sidebar-panel").addClass("ui-animation-slide");
        $("#sidebar-panel").css("right", "-" + window.outerWidth + "px");
    }

    var changePage = function(page) {
        var withAnimation = true;
        var width = window.outerWidth;

        if (activePage == null) {
            activePage = $("#sidebar-panel");
            activePage.addClass("ui-animation-slide");
        }

        if (activePage == page) {
            console.log("Trying to change to same page, exiting.");
            return;
        }

        page.show();

        if (withAnimation) {
            page.addClass("ui-animation-slide");
        }
        page.css("right", "0px");
        activePage = page;
    }

    var handleEsc = function(e) {
        if (activePage != null) {
            if (activePage.attr("id") != "sidebar-panel") {
                changePage($("#sidebar-panel"));
                return true;
            }
        }
        return false; // Not handled
    }

    return {
        handleEsc: handleEsc,
        prepareHide: prepareHide,
        prepareShow: prepareShow,
    }
})();
function Lsb(){
  Utils.run_command("lsb_manokwari");
}
function readText(){
  $.getJSON( "/tmp/.manokwari/lsb.json", function(data) {
      $.each(data, function( key, val  ) {
            $("#lsb").append( "<span>" + key +": "+ val + "</span>");
      });
  } );
}

$(document).load(function(){Lsb();});
$(document).ready(function(){
  readText();


});
