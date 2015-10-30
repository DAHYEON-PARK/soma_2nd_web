var g_token = '';
var user_id = '';
var user_pw = '';

function setToken(token) {
    g_token = token;
}

function setUserId(id){
    user_id = id;
}

function getLocationParameter( name ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
     if( results == null )    return "";
    else    return results[1];
}