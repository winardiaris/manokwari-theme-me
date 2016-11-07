(function($) {
  jQuery.expr[':'].Contains = function(a,i,m) {
    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };

  //first condition
  function firstCond() {
    $('input').val("");
    $('#listSearch .ui-listview-item').hide();
  };

  function unselect() {
    $('#listSearch').find('.selected').removeClass('selected');
    $('#listSearch').find('.active').removeClass('active');
  }

  // accending sort
  function asc_sort(a, b) {
    return ($(b).text()) < ($(a).text()) ? 1 : -1;    
  }

  // decending sort
  function dec_sort(a, b) {
    return ($(b).text()) > ($(a).text()) ? 1 : -1;    
  }

  //remove duplicate
  function removeDup(a) {
    var seen = {};
    $(a).each(function() {
      var txt = $(this).text();
        if ( seen[txt] )
          $(this).remove();
        else
          seen[txt] = true;
    });
  }

  function isUrlValid(url) {
    var urlregex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return urlregex.test(url);
  }

  function visit_link(a) {
    Utils.run_command("x-www-browser " + a);
  }

  function run_terminal(a) {
    Utils.run_command('gnome-terminal -e "' + a + '"');
  }
  
  var typingTimeout;
  function listFilter(header, list) { 
    // header is any element, list is an unordered list
    // create and add the filter form to the header
    var form = $("<div>").attr({"class":"filterform"}),
        input = $("<input>").attr({"class":"filterinput","type" : "text", "id" : "searchinput", "placeholder" : "Type to search..." });
    $(form).append(input).appendTo(header);
   
  
     $(input)
    .click( function() { firstCond(); unselect(); })
    //keyboard
    .keyup( function (e) {
      var $item = $('#listSearch a span:visible').not(':has(:empty)');
      var o = {38: 'up',40: 'bottom',37: 'prev',39: 'next'}
      var dir = o[e.which];
      var $active = $('.active'),
      i = $item.index($active);

      //run applications
      var filter = $(this).val();

      if ( e.which == 13 ) {
          //reload manokwari
       
        if ( filter.indexOf("!r")>=0 && filter.length === 2 ) {
            run_terminal("pkill manokwari");
        } else {
          p = $active.parent(); 
          $('span.active').parent().addClass('selected');
          if ( p.hasClass("runin-item-text") ) {
            var r = p.attr("runin");
            if ( p.parent().hasClass("url") ) {
              visit_link(r);
            } else if ( p.parent().hasClass("search") ) {
                var a = "https://www.google.com/search?q=" + r;
                visit_link(a);
            } else if ( p.parent().hasClass("wiki") ) {
                var a = "https://en.wikipedia.org/wiki/" + r;
                visit_link(a);
            } else {
                run_terminal(r);
            }
          } else {
            var a = p.attr('desktop');
            Utils.run_desktop(a);
          }
        }
       
        firstCond();
        unselect();

      } else if ( e.which == 38 || e.which == 40 ) { // arrow navigation
        var p = dir === 'up' ? (i - 1) : (i + 1);
        
        unselect();
        
        $item.eq(p).addClass('active');
        $(list).find(".active").parent().parent().addClass('selected');

      } else if ( e.which ==37 || e.which ==39 || e.which ==16 || e.which ==17 || e.which ==18 || e.which ==9 || e.which ==93 ) {
        // disable keyboard right,left,shift,control,alt,tab,menu 
        return;
      } else {
          $(list).find(".ui-listview-item").hide();
          if ( filter && filter != " " && filter != "" && filter.length > 0 ) {
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(function() {
              $(list).hide();        
    
              // the query executed immediatelly for each keypress, this will cause performance issue
              // give some delay while typing
    
              // this finds all links in a list that contain the input,
              // and hide the ones not containing the input while showing the ones that do
              $(list).find("a:not(:Contains(" + filter + "))").parent().hide();
              $(list).find("a:Contains(" + filter + ")").parent().show();
              $(list).fadeIn();
              
              unselect();
              $(list).find('a span:visible').first().addClass('active');
              $(list).find(".active").parent().parent().addClass('selected');

              //runin
              $(".runin-item").remove();
              if ( isUrlValid(filter) ) {

                var runin_url = $("<div>").attr({"class" : "ui-listview runin-item url" }),
                    runin_url_a = $("<a>").attr({"class" : "runin-item-text" , "runin" : filter }),
                    runin_url_img = $("<img>").attr({"src" : "img/logo_globe.png" }),
                    runin_url_span = $("<span>").text("Open URL: " + filter );
              
                $(runin_url_a).append(runin_url_img).append(runin_url_span);
                $(runin_url).append(runin_url_a).appendTo(list);
              } else {
                var runin_command = $("<div>").attr({"class" : "ui-listview runin-item command" }),
                    runin_command_a = $("<a>").attr({"class" : "runin-item-text" , "runin" : filter }),
                    runin_command_img = $("<img>").attr({"src" : "img/logo_command.png" }),
                    runin_command_span = $("<span>").text("Run : " + filter );

                var runin_search = $("<div>").attr({"class" : "ui-listview runin-item search" }),
                    runin_search_a = $("<a>").attr({"class" : "runin-item-text" , "runin" : filter }),
                    runin_search_img = $("<img>").attr({"src" : "img/logo_google.png" }),
                    runin_search_span = $("<span>").text("Search : " + filter );

                var runin_wiki = $("<div>").attr({"class" : "ui-listview runin-item wiki" }),
                    runin_wiki_a = $("<a>").attr({"class" : "runin-item-text" , "runin" : filter }),
                    runin_wiki_img = $("<img>").attr({"src" : "img/logo_wikipedia.png" }),
                    runin_wiki_span = $("<span>").text("Wikipedia: " + filter );

                $(runin_command_a).append(runin_command_img).append(runin_command_span);
                $(runin_command).append(runin_command_a).appendTo(list);

                $(runin_search_a).append(runin_search_img).append(runin_search_span);
                $(runin_search).append(runin_search_a).appendTo(list);

                $(runin_wiki_a).append(runin_wiki_img).append(runin_wiki_span);
                $(runin_wiki).append(runin_wiki_a).appendTo(list);
                
              }
            }, 500)();
          } else {
            $(".runin-item").remove();
            $(list).find(".ui-listview-item").hide();
          }
          return false;
      }
        if (!$active.length) {
            $item.first().addClass('active');
            return;
        }
    });
  }
  //ondomready
  $(document).ready(function() {
    var header=$('#header'),
        listSearch=$('#listSearch'),
        listSearch_child=$('#listSearch .ui-listview-item');  
    $(document).keydown(function() { $("input").focus(); });
    listFilter(header, listSearch);
    listSearch_child.sort(asc_sort).appendTo(listSearch);
    listSearch_child.mouseup(function() { firstCond(); });
    removeDup(listSearch_child);
    $("#listApplications").click( function() { firstCond(); });
  });
}) (jQuery);
