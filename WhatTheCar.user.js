// ==UserScript==
// @name            WhatTheCar
// @version         1.0.2
// @description     Garage Organizer
// @author          Himish
// @author          Kalabunga
// @author          Bazgrim
// @homepage        https://github.com/Himish/WhatTheCar
// @updateurl       https://raw.githubusercontent.com/Himish/WhatTheCar/master/WhatTheCar.user.js
// @supporturl      https://github.com/Himish/WhatTheCar/issues
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @resource  css   https://raw.githubusercontent.com/Himish/WhatTheCar/master/style.css?v=1.0.1
// @include         http://*.barafranca.com/*
// @include         https://*.barafranca.com/*
// @include         http://barafranca.com/*
// @include         https://barafranca.com/*
// @exclude         http://*/game-register.php*
// @exclude         https://*/game-register.php*
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_getResourceURL
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @priority        1
// ==/UserScript==

var cars = ["Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Crusher" ,"Race" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"Heist" ,"OC/MOC" ,"Heist" ,"OC/MOC" ,"OC/MOC" ,"Heist" ,"OC/MOC" ,"Heist" ,"OC/MOC" ,"OC/MOC" ,"Heist" ,"OC/MOC" ,"Heist" ,"Heist" ,"Race" ,"Race" ,"Raid" ,"OC/MOC" ,"Heist" ,"OC/MOC" ,"OC/MOC" ,"Heist" ,"OC/MOC" ,"OC/MOC" ,"Crusher","OC/MOC" ,"Raid" ,"Crusher" ,"Crusher" ,"Crusher" ,"Race" ,"Heist" ,"OC/MOC"];
if(!GM_getValue('car_types',null)){
    GM_setValue('car_types',JSON.stringify(cars));
}


if (document.getElementById('game_container') !== null) {
    var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    
    if (mutationObserver) {
        var observer = new MutationObserver(function(mutations) {
            if(onPage("garage")){
                addButtons();
                categorizeCars(); 
            }              
        });

        observer.observe(document.getElementById('game_container'), {
            attributes: false,
            childList: true,
            characterData: false
        });
    }     
}


function addButtons(){
    //Adds dropdown menu and binds its event listener
    $("#game_container").find('input[value=SH-cars]').after(' | <select class="type-select"><option value="0" disabled selected style="display:none;">Type</option><option value="1">Crusher</option><option value="2">Heist</option><option value="3">OC/MOC</option><option value="4">Race</option><option value="5">Raid</option></select> | ');
    $('.type-select').change(function() {
         if($(this).find(':selected').val()== 1)
                selectType("Crusher");
                
            if($(this).find(':selected').val()== 2 )
                selectType("Heist");
                
            if($(this).find(':selected').val()== 3)
                selectType("OC/MOC");
                
            if($(this).find(':selected').val()== 4)
                selectType("Race");
                
            if($(this).find(':selected').val()== 5)
                selectType("Raid");
    });
    
    //Reset types button
    $("#game_container").find('input[name=clearroles]').after(' <input type="submit" id="reset-types" value="Reset Types">');
    $('#reset-types').click(function(){
        GM_deleteValue('car_types');
        GM_setValue('car_types',JSON.stringify(cars));
        categorizeCars();
    });
    
    //Adds event listener for car-type divs
    $("#game_container").on('click', '.car-type',function() {
        
        if($(this).hasClass("wtc-crusher")){  
            changeType($(this).parent().find('a').attr('data-href').split("=")[1], "Heist");
            
        }
        else if($(this).hasClass("wtc-heist")){
            changeType($(this).parent().find('a').attr('data-href').split("=")[1], "OC/MOC");
            
        }
        else if($(this).hasClass("wtc-oc-moc")){
            changeType($(this).parent().find('a').attr('data-href').split("=")[1], "Race");
            
        }
        else if($(this).hasClass("wtc-race")){
            changeType($(this).parent().find('a').attr('data-href').split("=")[1], "Raid");
            
        }
        else if($(this).hasClass("wtc-raid")){
            changeType($(this).parent().find('a').attr('data-href').split("=")[1], "Crusher");
            
        }
        $(this).parent().parent().find('input[type="checkbox"]').prop('checked', !$(this).parent().parent().find('input[type="checkbox"]').prop('checked'));
    }); 
}   

//Adds type div near car name
function categorizeCars(){
    $('tr.thinline').each(function() {
        $(this).find(".car-type").remove();
        var carId = $(this).find('a').attr('data-href').split("=")[1];
        var type = findType(carId);
        var carName =  $(this).find('a').text();
        if (type){
            $(this).attr('data-type', type);

            $(this).find('a').parent().prepend("<div data-car-id='"+ carId +"' class='car-type wtc-"+ type.toLowerCase().replace("/","-") + "' >" + type + "</div>");
        }
    });

}

//Select all cars of that type
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

//saves change and changes current view
function changeType(id, newType){
    
    var newCars = JSON.parse(GM_getValue("car_types"));
    newCars[id-1] = newType;
    GM_setValue("car_types",JSON.stringify(newCars));
    $('.car-type[data-car-id='+id+']').removeClass("wtc-crusher wtc-raid wtc-race wtc-oc-moc wtc-heist").addClass("wtc-"+ newType.toLowerCase().replace("/","-"));;
    $('.car-type[data-car-id='+id+']').text(newType);
    $('.car-type[data-car-id='+id+']').parent().parent().attr('data-type', newType.toLowerCase().replace("/","-"));
}
//Return type of the car with that id
function findType(id){  
    return JSON.parse(GM_getValue("car_types"))[id-1];
}

function onPage(page){
    return window.location.hash.indexOf(page) != -1;
}

GM_addStyle(GM_getResourceText('css'));
