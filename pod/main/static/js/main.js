/** FUNCTIONS **/

function linkTo_UnCryptMailto( s ) {
    location.href="mailto:"+window.atob(s);
}

Number.prototype.toHHMMSS = function() {
    var seconds = Math.floor(this),
        hours = Math.floor(seconds / 3600);
    seconds -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

// Edit the iframe and share link code
function writeInFrame() {
    // Iframe
    var str = $('#txtintegration').val();
    // Autoplay
    if ($('#autoplay').is(':checked')) {
            if(str.indexOf('autoplay=true') < 0){
                str = str.replace('is_iframe=true', 'is_iframe=true&autoplay=true');
            }
    } else if (str.indexOf('autoplay=true') > 0) {
        str = str.replace('&autoplay=true', '');
    }
    // Loop
    if ($('#loop').is(':checked')) {
            if(str.indexOf('loop=true') < 0){
                str = str.replace('is_iframe=true', 'is_iframe=true&loop=true');
            }
    } else if (str.indexOf('loop=true') > 0) {
        str = str.replace('&loop=true', '');
    }
    $('#txtintegration').val(str);

    // Share link
    var link = $('#txtpartage').val();
    // Autoplay
    if ($('#autoplay').is(':checked')) {
        if(link.indexOf('autoplay=true') < 0){
                if(link.indexOf('?') < 0) link = link+"?autoplay=true";
                else if (link.indexOf('loop=true') > 0 || link.indexOf('start=') > 0) link = link+"&autoplay=true";
                else link = link+"autoplay=true";
            }

    } else if (link.indexOf('autoplay=true') > 0) {
       link = link.replace('&autoplay=true', '').replace('autoplay=true&', '').replace('?autoplay=true', '?');
    }
    // Loop
    if ($('#loop').is(':checked')) {
        if(link.indexOf('loop=true') < 0){
                if(link.indexOf('?') < 0) link = link+"?loop=true";
                else if (link.indexOf('autoplay=true') > 0 || link.indexOf('start=') > 0) link = link+"&loop=true";
                else link = link+"loop=true"
            }

    } else if (link.indexOf('loop=true') > 0) {
       link = link.replace('&loop=true', '').replace('?loop=true&', '?').replace('?loop=true', '?');
       
    }
    
    //Remove ? to start when he's first
    if (link.indexOf('??') > 0) link = link.replace(/\?\?/, '?');
    
    $('#txtpartage').val(link);
    var img = document.getElementById("qrcode");
    img.src = "//chart.apis.google.com/chart?cht=qr&chs=200x200&chl=" + link;
}
$(document).on('change', '#autoplay', function() {
    writeInFrame();
});
$(document).on('change', '#loop', function() {
    writeInFrame();
});
 
$(document).on('change', "#displaytime", function(e) {
    if($('#displaytime').is(':checked')){
        if($('#txtpartage').val().indexOf('start')<0){
             $('#txtpartage').val($('#txtpartage').val()+'?start='+parseInt(player.currentTime()));
             if ($('#txtpartage').val().indexOf('??') > 0) $('#txtpartage').val($('#txtpartage').val().replace('??', '?'));
             var valeur = $('#txtintegration').val();
             $('#txtintegration').val(valeur.replace('/?', '/?start=' + parseInt(player.currentTime())+'&'));
            
        }
        $('#txtposition').val(player.currentTime().toHHMMSS());
    }else{
         $('#txtpartage').val($('#txtpartage').val().replace(/(\?start=)\d+/, '').replace(/(\?start=)\d+/, ''));

         $('#txtintegration').val($('#txtintegration').val().replace(/(start=)\d+&/, ''));
         $('#txtposition').val("");
    }

    //Replace /& => /?
    var link = $('#txtpartage').val();
    if ($('#txtpartage').val().indexOf('/&') > 0) link = link.replace('/&', '/?');
    $('#txtpartage').val(link);

    var img = document.getElementById("qrcode");
    img.src = "//chart.apis.google.com/chart?cht=qr&chs=200x200&chl="+$('#txtpartage').val();
});

/*** USE TO SHOW THEME FROM CHANNELS ***/
var get_list = function(tab, level=0, tab_selected=[], tag_type="option", li_class='', attrs='', add_link=false, current="", channel="") {
    var list = ""
    var prefix = ""
    for(i=0;i<level;i++) prefix+="&nbsp;&nbsp;";
    if(level!=0) prefix+="|-";
    $.each(tab, function(i, val) {
        var title = add_link ? '<a href="'+val.url+'">'+channel+' '+val.title+'</a>' : channel+' '+val.title;
        var selected = $.inArray(i, tab_selected) > -1 ? "selected" : "";
        var list_class = 'class="'+li_class;
        if(val.slug==current) list_class+=' list-group-item-info"';
        else list_class+='"';
        list += '<'+tag_type+' '+selected+' '+list_class+' '+attrs+' value="'+i+'" id="theme_'+i+'">'+prefix+" "+title+'</'+tag_type+'>';
        var child = val.child;
        var count = Object.keys(child).length;
        if(count>0) {
            list += get_list(val.child, level+=1, tab_selected, tag_type, li_class, attrs, add_link, current, channel);
        }
    });
    return list;
}

/*** CHANNELS IN NAVBAR ***/

$('.collapsibleThemes').on('show.bs.collapse', function () {
  var str = get_list(listTheme["channel_"+$(this).data('id')], 0, [], tag_type="li", li_class="list-inline-item badge badge-primary badge-pill", attrs='', add_link=true, current="", channel="");
  $(this).html('<ul class="list-inline p-1 border">'+str+'</ul>')
  //$(this).parents("li").addClass('list-group-item-light');
  $(this).parents("li").find('.chevron-down').attr('style', 'transform: rotate(180deg);');
})
$('.collapsibleThemes').on('hidden.bs.collapse', function () {
  // do something…
  //$(this).parents("li").removeClass('list-group-item-light');
  $(this).parents("li").find('.chevron-down').attr('style', '');
})
$('#ownerboxnavbar').keyup(function() {
	if($(this).val() && $(this).val().length > 2) {
		var valThis = removeDiacritics($(this).val().toLowerCase());
		var letter = valThis.charAt(0);
        if(listUser[letter]){
		    var nbuser = listUser[letter].length;
		    $("#accordion").html("");
    		for(i=0; i<nbuser; i++) {
    			var lastname = removeDiacritics(listUser[letter][i]["last_name"].toLowerCase());
                var firstname = removeDiacritics(listUser[letter][i]["first_name"].toLowerCase());
    			if(lastname.indexOf(valThis) != -1 || firstname.indexOf(valThis) != -1) 
    				$("#accordion").append('<li><a href="'+urlvideos+'?owner='+listUser[letter][i]["username"]+'" title="">'+listUser[letter][i]["first_name"]+' '+listUser[letter][i]["last_name"]+' ('+listUser[letter][i]["username"]+')</a></li>');
    		}
        }
	} else {
		$("#accordion").html("");
	}
});
$(".showUser").on('click', function() {
	var letter = $(this).attr("data-target").toLowerCase();
    $("#accordion").html("");
    if(listUser[letter]){
	   var nbuser = listUser[letter].length;
    	for(i=0; i<nbuser; i++) {
    		$("#accordion").append('<li><a href="'+urlvideos+'?owner='+listUser[letter][i]["username"]+'" title="">'+listUser[letter][i]["first_name"]+' '+listUser[letter][i]["last_name"]+' ('+listUser[letter][i]["username"]+')</a></li>');
    	}
    }
});

/** MENU ASIDE **/
$(document).ready(function () {

    //when a group is shown, save it as the active accordion group
    $("#collapseAside").on('shown.bs.collapse', function () {
        Cookies.set('activeCollapseAside', "open");
        $(".collapseAside").html('<i data-feather="corner-left-up"></i><i data-feather="menu"></i>');
        feather.replace({ class: 'align-bottom'});
    });
    $("#collapseAside").on('hidden.bs.collapse', function () {
        Cookies.set('activeCollapseAside', "close");
        $(".collapseAside").html('<i data-feather="corner-left-down"></i><i data-feather="menu"></i>');
        feather.replace({ class: 'align-bottom'});
    });
    var last = Cookies.get('activeCollapseAside');
    //alert('last '+last);
    if (last != null && last=="close") {
        //show the account_last visible group
        $("#collapseAside").addClass("hide");
        $(".collapseAside").html('<i data-feather="corner-left-down"></i><i data-feather="menu"></i>');
        feather.replace({ class: 'align-bottom'});
    } else {
        $("#collapseAside").addClass("show");
        $(".collapseAside").html('<i data-feather="corner-left-up"></i><i data-feather="menu"></i>');
        feather.replace({ class: 'align-bottom'});
    }
    if ($("#collapseAside").find("div").length == 0) {
    	$("#collapseAside").collapse('hide');
    }
    TriggerAlertClose();
});

function TriggerAlertClose() {
    window.setTimeout(function () {
        $(".alert").fadeTo(1000, 0).slideUp(1000, function () {
            $(this).remove();
        });
    }, 5000);
}
/*** FORM THEME, NOTES AND USER PICTURE ***/
/** NOTES **/
$(document).on("submit", "#video_notes_form", function (e) {
    e.preventDefault();
    var data_form = $( "#video_notes_form" ).serializeArray();
    send_form_data($( "#video_notes_form" ).attr("action"), data_form, "show_form_notes", "post");
});
/** PICTURE **/
$(document).on("click", ".get_form_userpicture", function() {
	send_form_data($(this).data('url'), {}, "append_picture_form", "get");
});
$(document).on('hidden.bs.modal', '#userpictureModal', function (e) {
    $('#userpictureModal').remove();
    $('#fileModal_id_userpicture').remove();
});
$(document).on("submit", "#userpicture_form", function (e) {
    e.preventDefault();
    var data_form = $( "#userpicture_form" ).serializeArray();
	send_form_data($( "#userpicture_form" ).attr("action"), data_form, "show_picture_form");
});
/** THEME **/
$(document).on("submit", "#form_theme", function (e) {
    e.preventDefault();
    var data_form = $( "#form_theme" ).serializeArray();
	send_form_data($( "#form_theme" ).attr("action"), data_form, "show_theme_form");
});
$(document).on('click', '#cancel_theme', function(){
    $('form.get_form_theme').show();
    show_form_theme("");
    $("#table_list_theme tr").removeClass('table-primary');
    window.scrollTo({
        top: parseInt($("#list_theme").offset().top),
        behavior: "smooth"
    });
});
$(document).on("submit", "form.get_form_theme", function (e) {
    e.preventDefault();
    var action = $(this).find('input[name=action]').val(); // new, modify and delete
    if(action == "delete"){
        var deleteConfirm = confirm(gettext("Are you sure you want to delete this element?"));
        if (deleteConfirm){
        	send_form_data(window.location.href, $(this).serializeArray(), "show_form_theme_"+action);
        }
    } else {
    	send_form_data(window.location.href, $(this).serializeArray(), "show_form_theme_"+action);
    }
});
/** FOLDER **/

/** AJAX **/
var send_form_data = function(url,data_form, fct, method="post") {
	var jqxhr= '';
	if(method=="post") jqxhr = $.post(url, data_form);
	else jqxhr = $.get(url);
	jqxhr.done(function(data){ window[fct](data); });
	jqxhr.fail(function($xhr) {
        var data = $xhr.status+ " : " +$xhr.statusText;
        showalert(gettext("Error during exchange") + "("+data+")<br/>"+gettext("No data could be stored."), "alert-danger");
    });
}
var show_form_notes = function(data) {
	$( "#video_notes_form" ).parent().html(data);
}
var show_form_theme_new = function(data) {
	if(data.indexOf("form_theme")==-1) {
        showalert(gettext('You are no longer authenticated. Please log in again.'), "alert-danger");
    } else {
        show_form_theme(data);
    }
}
var show_form_theme_modify = function(data) {
	if(data.indexOf("theme")==-1) {
        showalert(gettext('You are no longer authenticated. Please log in again.'), "alert-danger");
    } else {
        show_form_theme(data);
        var id = $(data).find('#id_theme').val();
        $("#theme_"+id).addClass('table-primary');
    }
}
var show_form_theme_delete = function(data) {
	if(data.list_element) {
        show_list_theme(data.list_element);
    } else {
        showalert(gettext('You are no longer authenticated. Please log in again.'), "alert-danger");
    }
}
var show_theme_form = function(data) {
	if(data.list_element || data.form) {
        if(data.errors){
            showalert(gettext('One or more errors have been found in the form.'), "alert-danger");
            show_form_theme(data.form);
        }else{
            show_form_theme("");
            $('form.get_form_theme').show();
            show_list_theme(data.list_element);
        }
    } else {
        showalert(gettext('You are no longer authenticated. Please log in again.'), "alert-danger");
    }
}
var show_picture_form = function(data) {
	$( "#userpicture_form" ).html($(data).find("#userpicture_form").html());
    if($(data).find("#userpictureurl").val()) {
        $(".get_form_userpicture").html('<img src="'+$(data).find("#userpictureurl").val()+'" height="34" class="rounded" alt="">Change your picture');
    }
}
var append_picture_form = function(data) {
	$('body').append(data);
    $('#userpictureModal').modal('show');
}
function show_form_theme(data) {
    $("#div_form_theme").hide().html(data).fadeIn();
    if(data!="") $('form.get_form_theme').hide();
    window.scrollTo({
        top: parseInt($("#div_form_theme").offset().top),
        behavior: "smooth"
    });
}
function show_list_theme(data) {
    $("#list_theme").hide().html(data).fadeIn();
    //$('form.get_form_theme').show();
    window.scrollTo({
        top: parseInt($("#list_theme").offset().top),
        behavior: "smooth"
    });
}
/***** VIDEOS *****/
$('#ownerbox').keyup(function() {
  if($(this).val() && $(this).val().length > 2) {
    var valThis = removeDiacritics($(this).val().toLowerCase());
    var letter = valThis.charAt(0);
    var nbuser = listUser[letter].length;
    /*$("#accordion").html("");*/
    $("#collapseFilterOwner .added").prop('checked', false).remove();
    for(i=0; i<nbuser; i++) {
      var lastname = removeDiacritics(listUser[letter][i]["last_name"].toLowerCase());
      if(lastname.indexOf(valThis) != -1 && listUserChecked.indexOf(listUser[letter][i]["username"])==-1 ) {
        var chekboxhtml = '<div class="form-check added"><input class="form-check-input" type="checkbox" name="owner" value="'+listUser[letter][i]["username"]+'" id="id'+listUser[letter][i]["username"]+'"><label class="form-check-label" for="id'+listUser[letter][i]["username"]+'">'+listUser[letter][i]["first_name"]+' '+listUser[letter][i]["last_name"]+' ('+listUser[letter][i]["username"]+')</label></div>';
        $("#collapseFilterOwner").append(chekboxhtml);
      }
    }
  } else {
    $("#collapseFilterOwner .added").prop('checked', false).remove();
  }
});
/****** VIDEOS EDIT ******/
/** channel **/

var tab_initial = new Array();

$('#id_theme option:selected').each(function () {
    tab_initial.push($(this).val());
});

$('#id_theme option').remove();

$('#id_channel').change(function() {
    $('#id_theme option').remove();
    var tab_channel_selected = $(this).val();
    var str = "";
    for (var id in tab_channel_selected) {
        var chan = $("#id_channel option[value="+tab_channel_selected[id]+"]").text();
        str += get_list(listTheme["channel_"+tab_channel_selected[id]], 0, [], tag_type="option", li_class="", attrs='', add_link=false, current="", channel=chan+": ");
    }
    $('#id_theme').append(str);
});
$("#id_channel option:selected").each(function () {
    var str = get_list(listTheme["channel_"+$(this).val()], 0, tab_initial, tag_type="option", li_class="", attrs='', add_link=false, current="");
    $('#id_theme').append(str);
});

/** end channel **/
/*** Copy to clipboard ***/
$('#btnpartageprive').click(function() {
      var copyText = document.getElementById("txtpartageprive");
      copyText.select();
      document.execCommand("copy");
      showalert(gettext("text copied"),"alert-info");
  });

/** Restrict access **/
/** restrict access to group */
$("#id_is_restricted").change(function () {
    restrict_access_to_groups();
})
var restrict_access_to_groups = function () {
    if ($('#id_is_restricted').prop("checked")) {
        $("#id_restrict_access_to_groups").parents(".restricted_access").show();
    } else {
        $("#id_restrict_access_to_groups option:selected").prop("selected", false);
        $("#id_restrict_access_to_groups").parents(".restricted_access").hide();
    }
}
$('#id_is_draft').change(function(){
    restricted_access();
});
var restricted_access = function() {
    if($('#id_is_draft').prop( "checked" )){
        $('.restricted_access').addClass('hide');
        $('.restricted_access').removeClass('show');
        $("#id_password").val('');
        $("#id_restrict_access_to_groups option:selected").prop("selected", false);
        $("#id_is_restricted").prop( "checked", false );
    } else {
        $('.restricted_access').addClass('show');
        $('.restricted_access').removeClass('hide');
    }
    restrict_access_to_groups();
}
restricted_access();
//restrict_access_to_groups();

/** end restrict access **/
/*** VALID FORM ***/
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          window.scrollTo($(form).scrollTop(), 0); 
          showalert(gettext("Errors appear in the form, please correct them"),"alert-danger");
          event.preventDefault();
          event.stopPropagation();
        } else {
            if($(form).data("morecheck")) {
                window[$(form).data("morecheck")](form, event);
            }
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();
/*** VIDEOCHECK FORM ***/
var videocheck = function(form,event) {
    var fileInput = $('#id_video');
    if(fileInput.get(0).files.length){
        var fileSize = fileInput.get(0).files[0].size;
        var fileName = fileInput.get(0).files[0].name;
        var extension = fileName.substring(fileName.lastIndexOf('.')+1).toLowerCase();
        if(listext.indexOf(extension) !== -1) {
            if(fileSize>video_max_upload_size){
                window.scrollTo($("#video_form").scrollTop(), 0); 
                showalert(gettext("The file size exceeds the maximum allowed value :")+" "+VIDEO_MAX_UPLOAD_SIZE+" Go.","alert-danger");
                event.preventDefault();
                event.stopPropagation();
            } else {
                $("#video_form fieldset").hide();
                $("#video_form button").hide();
                $("#js-process").show();
                window.scrollTo($("#js-process").scrollTop(), 0);
                if(!show_progress_bar(form)) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        } else {
            window.scrollTo($("#video_form").scrollTop(), 0); 
            showalert(gettext("The file extension not in the allowed extension :")+" "+listext+".","alert-danger");
            event.preventDefault();
            event.stopPropagation();
        }
    }
}

/***** SHOW ALERT *****/
var showalert = function(message,alerttype) {
    $('body').append('<div id="formalertdiv" class="alert ' +  alerttype + ' alert-dismissible fade show"  role="alert">'+message+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
    setTimeout(function() { $("#formalertdiv").remove(); }, 5000);
};

function show_messages(msgText, msgClass, loadUrl) {
	var $msgContainer = $('#show_messages');
	var close_button = '';
	msgClass = typeof msgClass !== 'undefined' ? msgClass : 'warning';
	loadUrl = typeof loadUrl !== 'undefined' ? loadUrl : false;

	if (!loadUrl) {
		close_button = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
	}

	var $msgBox = $('<div>', {
		'class': 'alert alert-' + msgClass + ' alert-dismissable fade in',
		'role': 'alert',
		'html': close_button + msgText
	});
	$msgContainer.html($msgBox);

	if (loadUrl) {
		$msgBox.delay(4000).fadeOut(function() {
			if (loadUrl) {
				window.location.reload();
			} else {
				window.location.assign(loadUrl);
			}
		});
	} else if ( msgClass === 'info' || msgClass === 'success') {
		$msgBox.delay(3000).fadeOut(function() {
			$msgBox.remove();
		});
	}
}

/**
 * Remove diacritics (accents) from a string
 * @param {string} str The input string from which we will remove strings with diacritics
 * @returns {string}
 * @see http://goo.gl/zCBxkM
 */
function removeDiacritics (str) {
    var diacriticsMap = {
        A: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
        AA: /[\uA732]/g,
        AE: /[\u00C6\u01FC\u01E2]/g,
        AO: /[\uA734]/g,
        AU: /[\uA736]/g,
        AV: /[\uA738\uA73A]/g,
        AY: /[\uA73C]/g,
        B: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
        C: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
        D: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
        DZ: /[\u01F1\u01C4]/g,
        Dz: /[\u01F2\u01C5]/g,
        E: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
        F: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,
        G: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
        H: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
        I: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
        J: /[\u004A\u24BF\uFF2A\u0134\u0248]/g,
        K: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
        L: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
        LJ: /[\u01C7]/g,
        Lj: /[\u01C8]/g,
        M: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
        N: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
        NJ: /[\u01CA]/g,
        Nj: /[\u01CB]/g,
        O: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
        OI: /[\u01A2]/g,
        OO: /[\uA74E]/g,
        OU: /[\u0222]/g,
        P: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
        Q: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,
        R: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
        S: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
        T: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
        TZ: /[\uA728]/g,
        U: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
        V: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
        VY: /[\uA760]/g,
        W: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
        X: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,
        Y: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
        Z: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
        a: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
        aa: /[\uA733]/g,
        ae: /[\u00E6\u01FD\u01E3]/g,
        ao: /[\uA735]/g,
        au: /[\uA737]/g,
        av: /[\uA739\uA73B]/g,
        ay: /[\uA73D]/g,
        b: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
        c: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
        d: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
        dz: /[\u01F3\u01C6]/g,
        e: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
        f: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,
        g: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
        h: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
        hv: /[\u0195]/g,
        i: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
        j: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,
        k: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
        l: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
        lj: /[\u01C9]/g,
        m: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
        n: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
        nj: /[\u01CC]/g,
        o: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
        oi: /[\u01A3]/g,
        ou: /[\u0223]/g,
        oo: /[\uA74F]/g,
        p: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
        q: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,
        r: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
        s: /[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
        ss: /[\u00DF]/g,
        t: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
        tz: /[\uA729]/g,
        u: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
        v: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
        vy: /[\uA761]/g,
        w: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
        x: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,
        y: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
        z: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
    };
    for (var x in diacriticsMap) {
        // Iterate through each keys in the above object and perform a replace
        str = str.replace(diacriticsMap[x], x);
    }
    return str;
}
