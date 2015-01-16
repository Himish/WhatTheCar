// ==UserScript==
// @name            WhatTheCar
// @version         1.0.0
// @description     Garage Organizer
// @author          Himish
// @author          Kalabunga
// @author          Bazgrim
// @homepage	    https://github.com/Himish/WhatTheCar
// @updateurl	    https://raw.githubusercontent.com/Himish/WhatTheCar/master/WhatTheCar.user.js
// @supporturl	    https://github.com/Himish/WhatTheCar/issues
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @resource  css   https://raw.githubusercontent.com/Himish/WhatTheCar/master/style.css
// @include         http://*.barafranca.com/*
// @include         https://*.barafranca.com/*
// @include         http://barafranca.com/*
// @include         https://barafranca.com/*
// @exclude         http://*/game-register.php*
// @exclude         https://*/game-register.php*
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_getResourceURL
// @priority        1
// ==/UserScript==


var cars = ["Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Race" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"OC/MOC" ,"Heist" ,"OC" ,"OC" ,"Heist" ,"OC" ,"Heist" ,"OC" ,"OC" ,"Heist" ,"OC" ,"Heist" ,"Heist" ,"Race" ,"Race" ,"Raid" ,"OC/MOC" ,"Heist" ,"OC/MOC" ,"OC/MOC" ,"Heist" ,"OC" ,"OC/MOC" ,"OC/MOC" ,"Raid" ,"Crusher" ,"Crusher" ,"Crusher" ,"Race" ,"Heist" ,"OC"];

if (document.getElementById('game_container') !== null) {
    var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    
    if (mutationObserver) {
        var observer = new MutationObserver(function(mutations) {
            if(onPage("garage")){
            	addButtons();
            }
            	categorizeCars();    
        });
        observer.observe(document.getElementById('game_container'), {
            attributes: false,
            childList: true,
            characterData: false
        });
    }     
}

//OROSPU ÇOCUĞU OMERTA BEYOND
function addButtons(){
    $("#game_container").find('input[value=SH-cars]').after(' | <select class="type-select"><option value="0" disabled selected style="display:none;">Type</option><option value="1">Crusher</option><option value="2">Heist</option><option value="3">OC</option><option value="4">OC/MOC</option><option value="5">MOC</option><option value="6">Race</option><option value="7">Raid</option></select> | ');
    $('.type-select').change(function() {
         if($(this).find(':selected').val()== 1)
                selectType("Crusher");
                
            if($(this).find(':selected').val()== 2 )
                selectType("Heist");
                
            if($(this).find(':selected').val()== 3)
                selectType("OC");
    
            if($(this).find(':selected').val()== 4)
                selectType("OC/MOC");
                
            if($(this).find(':selected').val()== 5)
                selectType("MOC");
                
            if($(this).find(':selected').val()== 6)
                selectType("Race");
                
            if($(this).find(':selected').val()== 7)
                selectType("Raid");
    });

}

function categorizeCars(){

	$('tr.thinline').each(function() {
		var carId = $(this).find('a').attr('href').split("=")[1];
		var type = findType(carId);
		var carName =  $(this).find('a').text();
		if (type){
			$(this).attr('data-type', type);
			$(this).find('a').parent().prepend("<div class='car-type' id="+ type.toLowerCase().replace("/","-") + ">" + type + "</div>");
		}
    });
}
function selectType(type){
	//first deselect all
	$('tr.thinline').each(function() {
		$(this).find("input:checkbox").prop('checked', false);
	});

	//then select type
	$("[data-type='"+type+"']").each(function() {
        if($(this).find("input:checkbox").attr('data_safe') != 2)
			$(this).find("input:checkbox").prop('checked', true);
	});
}

function findType(id){	
	return cars[id - 1];
}

function onPage(page){
    return window.location.hash.indexOf(page) != -1;
}

GM_addStyle(GM_getResourceText('css'));
