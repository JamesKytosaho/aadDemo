
var playerScriptIsInitialized = true;

//alert("Init");
var iframeorigin = 'https://testplayerloaderaad.azurewebsites.net';
//var iframeorigin = 'http://localhost:3000';

// Create IE + others compatible event handler
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// Listen to message from child window
eventer(messageEvent, function (e) {
    console.log('parent received message!:  ', e.data + ' from: ' + e.origin);
    console.log('iframeorigin: ' + iframeorigin);
    console.log('e.origin: ' + e.origin);
    //when the message received is coming from the iframe we generated AND the message is 'redirecthostpageforplayerauthentication'
    //then redirect for authentication:

    var crossdomainMessage = e.data.substr(0, e.data.indexOf('/'));
    var holderTenantId = e.data.split('/')[1];

    console.log('holderTenantId: ' + holderTenantId + ' crossdomainMessage: ' + crossdomainMessage);

    if (crossdomainMessage === 'redirecthostpageforplayerauthentication' && e.origin === iframeorigin) {
        console.log('redirect to playerloader for login');

        var url = encodeURIComponent(window.location);

        //when our child iframe notifies our parent (this page) that it needs authentication, redirect the browser:
        window.location = "https://testplayerloaderaad.azurewebsites.net/clientLogin?redirecturl=" + window.location + '&holderTenantId=' + holderTenantId;
        //window.location = "http://localhost:3000/clientLogin?redirecturl=" + url+ '&holderTenantId=' + holderTenantId;
    };
}, false);
//document.write("<iframe id='playeriframe' src='http://192.168.4.62:3000/play/live/6559faa5cbee47149bbb751afd3cbd13/ccdd386908a94523afde69fab648f07c' width='1000' height='600'></iframe>");

function placePlayerFrame(divId, event) {
    var iframeElement = document.createElement('iframe');
    iframeElement.setAttribute("src", event);
    iframeElement.style.width = 640+"px";
    iframeElement.style.height = 480+"px";

    var div = document.getElementById(divId);
    div.appendChild(iframeElement);
}
//var playeriframe = document.getElementById('playeriframe');
//<iframe style="width: 1000px; height: 600px;" src="http://localhost:3000/play/live/6559faa5cbee47149bbb751afd3cbd13/ccdd386908a94523afde69fab648f07c"></iframe>

//https://mpsbroadband.sharepoint.com/sites/intranet/rd/_layouts/15/start.aspx#/SitePages/testAAD.aspx​
