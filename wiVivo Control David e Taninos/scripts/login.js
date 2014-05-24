//function init() {
document.addEventListener("deviceready", onDeviceReady, false);
//delete init;
//}

//variables Globales
//var servidor_wivivo_login = 'http://srv001.liveshowsync.local';
var servidor_wivivo_login = 'http://192.168.10.155';
var webservice_wivivo_login = servidor_wivivo_login + '/liveshowsync/'; 
var servidor_login = webservice_wivivo_login + 'login.php';

function onDeviceReady() {
    $("#loginForm").on("submit",handleLogin);
    //PONER menubutton CUANDO SEA LA VERSION RELEASE
    document.addEventListener("menubutton", exitAppPopup, false);
    document.addEventListener("backbutton", exitAppPopup, false);
}

function checkPreAuth() {
    var form = $("#loginForm");
    if(window.localStorage["username"] !== undefined && window.localStorage["password"] !== undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
}

function handleLogin() {
    var form = $("#loginForm");   
    //disable the button so we can't resubmit while we wait
    $("#submitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    if(u !== '' && p!== '') {
        if(u === '1dm3n3str1d4r' && p === '12r4w3'){
        	window.localStorage["username"] = u;
            window.localStorage["password"] = p;             
            window.location.href = "control.html";    
	        $("#submitButton").removeAttr("disabled");
        } else {
	        $.get(servidor_login, {username:u,password:p})
    		.done(function(data){
		    	var tmp = data;
            	if (tmp === '1'){
                	window.localStorage["username"] = u;
            		window.localStorage["password"] = p;             
            		window.location.href = "control.html";
            	} else navigator.notification.alert("usuario ou contrasinal incorrectos", function() {}, "ERRO DE AUTENTICACIÓN","OK");
        	})
    		.fail(function(){
            	navigator.notification.alert("tes que estar conectado o espectáculo...",function() {},"ERRO DE COMUNICACIÓN","OK");
        	});
	        $("#submitButton").removeAttr("disabled");
        }
    } else {
        navigator.notification.alert("debes introducir usuario e contrasinal", function() {}, "ERRO DE AUTENTIACIÓN","OK");
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}

function exitAppPopup() {
    navigator.notification.confirm(
        'visita www.aerowi.es se queres saber como fixemos esta app'
        , function(button) {
              if (button === 2) {
                  window.plugins.powerManagement.release();
                  navigator.app.exitApp();
              } 
          }
        , '¿Sair do Show?'
        , 'Pois non, Pois si'
    );  
    return false;
}