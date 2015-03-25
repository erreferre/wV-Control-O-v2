// JavaScript Document
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

//variables Globales
var servidor_wivivo = 'http://aerowi-olympus.ddns.net';
var webservice_wivivo = servidor_wivivo + '/olympus/';

var actualiza_wivivo = webservice_wivivo + 'actualiza_wivivo.php';

var servidor_lee = webservice_wivivo + 'lee.php';
var servidor_sube = webservice_wivivo + 'sube.php';
var servidor_thumb = webservice_wivivo + 'creaThumbImagen.php';

//var servidor_activa_alertas = webservice_wivivo + 'activa_alertas.php';
//var servidor_desactiva_alertas = webservice_wivivo + 'desactiva_alertas.php';

var nombreFoto = null;

//temporizadores
//var activaShowEmpezadosetTimeout = null;
//var desactivaGuaposetTimeout = null;
//var desactivaAplausosetTimeout = null;

// PhoneGap is ready
function onDeviceReady() {
    window.plugins.powerManagement.acquire();
    document.addEventListener("menubutton", exitAppPopup, false);
    document.addEventListener("backbutton", exitAppPopup, false);
    leeConfiguracion();
}

function leeConfiguracion() {
    $.getJSON(servidor_lee)
    .fail(function(jqxhr, textStatus, error){
    	navigator.notification.alert("Asegúrate de estar conectado a Internet",function(){},"ERRO DE COMUNICACION","OK");
    });
}

//ALERTAS
function alertaComando(mensaje,titulo){
    navigator.notification.alert(mensaje,function(){},titulo,"OK");
}
function falloConexion(){
	navigator.notification.alert("Proba de novo, non dei executado a acción",function(){},"ERRO DE COMUNICACION","OK");    
}

//ACTUALIZA
function actualiza_tabla(variable,valor){
    $.get(actualiza_wivivo, {variable:variable,valor:valor})
    	.done(function(){alertaComando(valor,variable);})
    	.fail(function(){falloConexion();});
}

//COMANDOS
function activaShow(){
    navigator.notification.confirm(
        'se premes SI, comeza todo!'
        , function(data) {
            if (data === 2) {
                $.get(actualiza_wivivo, {variable:"comienzashow",valor:"1"})
    			.done(function(){
		    		alertaComando("ESPECTÁCULO ARRINCADO!!","SHOW");
					//activaShowEmpezadosetTimeout = setTimeout(activaShowEmpezado,300000);
        		})
    			.fail(function(){falloConexion();});
              }
          }
        , '¿COMEZA-LO SHOW?'
        , 'non, SI'
    );  
    return false;
}

//function activaShowEmpezado(){
//    $.get(actualiza_wivivo, {variable:"showcomenzado",valor:"1"})
//    	.done(function(){})
//    	.fail(function(){falloConexion();});
//}

//function desactivaShowEmpezado(){
//    $.get(actualiza_wivivo, {variable:"showcomenzado",valor:"0"})
//    	.done(function(){})
//    	.fail(function(){falloConexion();});
//    if (activaShowEmpezadosetTimeout !== null) {
//        clearTimeout(activaShowEmpezadosetTimeout);
//        activaShowEmpezadosetTimeout = null;
//    }
//}

function desactivaShow(){
    navigator.notification.confirm(
        'se premes SI, FINALIZARÁS TODO!'
        , function(data) {
            if (data === 2) {
                $.get(actualiza_wivivo, {variable:"colorines",valor:"0"});
                $.get(actualiza_wivivo, {variable:"color1",valor:"#000000"});
                $.get(actualiza_wivivo, {variable:"color2",valor:"#000000"});
                $.get(actualiza_wivivo, {variable:"intermitencia",valor:"0"});
                //actualiza_tabla('colorines','0');
                //actualiza_tabla('color1','#000000');
                //actualiza_tabla('color2','#000000');
                //actualiza_tabla('intermitencia','0');
                $.get(actualiza_wivivo, {variable:"comienzashow",valor:"0"})
    			.done(function(){
		    		alertaComando("ESPECTÁCULO FINALIZADO!!","SHOW");
//					desactivaShowEmpezado();
        		})
    			.fail(function(){falloConexion();});
              }
          }
        , '¿FINALIZA-LO SHOW?'
        , 'non, SI'
    );  
    return false;
}

//function activa_loteria(){
//        $.get(actualiza_wivivo, {variable:"lotoactivada",valor:"1"})
//    	.done(function(){alertaComando("1","lotoactivada");})
//    	.fail(function(){falloConexion();});
//        $.get(actualiza_wivivo, {variable:"loto",valor:"1"})
//    	.done(function(){})
//    	.fail(function(){falloConexion();});
//}

//ADMIN
//function activaAlertas(){
//    $.get(servidor_activa_alertas)
//    	.done(function(){alertaComando("ACTIVADAS","ALERTAS");})
//    	.fail(function(){falloConexion();});
//}

//function desactivaAlertas(){
//    $.get(servidor_desactiva_alertas)
//    	.done(function(){alertaComando("DESACTIVADAS","ALERTAS");})
//    	.fail(function(){falloConexion();});    
//}

//Fotos con "capture"
function captureImage() {
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
}

function captureSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
	    var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
        // Show the captured photo.
        smallImage.src = mediaFiles[i].fullPath;
        var rutafoto1 = document.getElementById('rutafoto');
    	rutafoto1.innerHTML = '<p>quédache a foto eiquí: ' + mediaFiles[i].fullPath + '</p>';
	    var rutasubida1 = document.getElementById('rutasubida');
		rutasubida1.innerHTML = '<p>espera uns segundos a que sexa subida...</p>';
        uploadPhoto(mediaFiles[i]);
    }       
}

// Called if something bad happens.
function captureError(error) {
    navigator.notification.alert("Volve a saca-la foto", function(){},"ERRO EN CAPTURA", "OK");
}

//SUBE FOTO
function uploadPhoto(mediaFile) {
	var options = new FileUploadOptions();
	options.fileKey = "file";        
    options.fileName = makeId() + ".jpg";
    nombreFoto = options.fileName;
    options.mimeType = "image/jpeg";
	options.chunkedMode = false;
	options.headers = {Connection: "close"};
    var path = mediaFile.fullPath;
    var params = {};
    params.value1 = "wiVivo";
    params.value2 = "Olympus";
    options.params = params;
    var ft = new FileTransfer();
    ft.upload(path, servidor_sube, uploadSuccess, uploadError, options, true);
}

function uploadSuccess(r) {
    $.get(servidor_thumb, {imagen:nombreFoto})
    .done(function(){
	    var rutasubida2 = document.getElementById("rutasubida");
		rutasubida2.innerHTML = '<p>FOTO SUBIDA OK!</p>';
        })
    .fail(function(){
        navigator.notification.alert("Saca a foto de novo. Houbo un erro",function(){}, "ERRO NA SUBIDA", "OK");
    });
}

function uploadError(error) {
    navigator.notification.alert("Saca a foto de novo. Houbo un erro",function(){}, "ERRO NA SUBIDA", "OK");
}

//nombre de imagen aleatorio
function makeId(){
    var text = "Olympus.2015.";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 4; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function exitAppPopup() {
    navigator.notification.confirm(
        'Cerra-la app'
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
