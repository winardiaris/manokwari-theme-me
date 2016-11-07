(function($) {
  jQuery.expr[':'].Contains = function(a,i,m){
    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };
  //first condition
  function firstCond(){
    $('input').val("");
    $('#listSearch .ui-listview-item').hide();
  };
  function unselect(){
    $('#listSearch').find('.selected').removeClass('selected');
    $('#listSearch').find('.active').removeClass('active');
  }
  // accending sort
  function asc_sort(a, b){
    return ($(b).text()) < ($(a).text()) ? 1 : -1;    
  }
  // decending sort
  function dec_sort(a, b){
    return ($(b).text()) > ($(a).text()) ? 1 : -1;    
  }
  //remove duplicate
  function removeDup(a){
    var seen = {};
    $(a).each(function() {
      var txt = $(this).text();
        if (seen[txt])
          $(this).remove();
        else
          seen[txt] = true;
    });
  }
  function isUrlValid(url) {
    var urlregex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return urlregex.test(url);
  }

  function visit_link(a){
    Utils.run_command("x-www-browser "+a);
  }

  function run_terminal(a){
    Utils.run_command('gnome-terminal -e "'+a+'"');
  }
  
	var typingTimeout;
	function listFilter(header, list) { 
    // header is any element, list is an unordered list
    // create and add the filter form to the header
    var form = $("<div>").attr({"class":"filterform"}),
        input = $("<input>").attr({"class":"filterinput","type":"text","id":"searchinput","placeholder":"Type to search..."});
    $(form).append(input).appendTo(header);
   
  
     $(input)
		.click( function(){firstCond();unselect();})
    //keyboard
		.keyup( function (e) {
      var $item = $('#listSearch a span:visible').not(':has(:empty)');
			var o = {38: 'up',40: 'bottom',37: 'prev',39: 'next'}
			var dir = o[e.which];
      var $active = $('.active'),
      i = $item.index($active);

      //run applications
      var filter = $(this).val();
			if (e.which == 13) {
        if(filter.indexOf("!")>=0){
          a=filter;
          // wiki
          if(a.indexOf("!w ")>=0 && a.length>=4){
            str = a.replace("!w ","");
            wiki = "https://id.wikipedia.org/wiki/"+str
            visit_link(wiki);
          }
          //reload manokwari
          else if(a.indexOf("!r")>=0 && a.length==2){
            run_terminal("pkill manokwari");
          }
          //run in terminal
          else{
            str = a.replace("!","");
            run_terminal(str);
          }
        }
        //visit link
        else if(isUrlValid(a)){
          visit_link(a);
          alert(a);
        }
        else{
          $('span.active').parent().addClass('selected');
          var a = $active.parent().attr('desktop');
          Utils.run_desktop(a);
        }
       
        firstCond();
        unselect();
      }
      //arrow navigation
      else if(e.which == 38 || e.which == 40 ){
				var p = dir === 'up' ? (i - 1) : (i + 1);
				
				unselect();
				
        $item.eq(p).addClass('active');
        $(list).find(".active").parent().parent().addClass('selected');
			}
			// nonaktifkan kanan,kiri,shift,control,alt,tab,menu
			else if(e.which ==37 || e.which ==39 || e.which ==16 || e.which ==17 || e.which ==18 || e.which ==9 || e.which ==93){
				return;
			}
			else{
					$(list).find(".ui-listview-item").hide();
					if (filter && filter != " " && filter != "" && filter.length > 0) {
						clearTimeout(typingTimeout);
						typingTimeout = setTimeout(function(){
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
							
						}, 500);
					} else {
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
		var 	header=$('#header'),
				listSearch=$('#listSearch'),
				listSearch_child=$('#listSearch .ui-listview-item');	
		$(document).keydown(function() {$("input").focus();});
		listFilter(header, listSearch);
		listSearch_child.sort(asc_sort).appendTo(listSearch);
		listSearch_child.mouseup(function() {firstCond();});
		removeDup(listSearch_child);
		$("#listApplications").click(function(){ firstCond();});
	});
}) (jQuery);																																								
