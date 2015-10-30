var g_app_menu;
var g_target_table;


String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },


    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

function parseJson(data)
{
	if(typeof(data) == 'object')
		return data;
	return JSON.parse(data);
}

function initMenu(menuKey)
{
	if(g_app_menu)
		return;

	g_target_table = menuKey;
	$.ajax({
		type: 'GET',
		url: 'js/menu.json',
		success: function(data, status) {
			
			g_app_menu = parseJson(data);
			if(g_app_menu.length == 0)
				return;

			for(i=0; i<g_app_menu.length; i++) {
				var cls = '';
				if(menuKey && g_app_menu[i].url.indexOf(menuKey) != -1) 
					cls = 'class="active"';
				else if(!menuKey && g_app_menu[i].title == 'Default') 
					cls = 'class="active"';

				var $menu = '<li '+cls+'><a href="'+g_app_menu[i].url+'"><i class="zmdi zmdi-'+g_app_menu[i].icon+'"></i> '+g_app_menu[i].title+'</a></li>';
				$('#menu-public').append($menu);
			}

			if(menuKey) {
				
				for(i=0; i<g_app_menu.length; i++) {
					if(g_app_menu[i].url.indexOf(menuKey) != -1) {
						$('#content .block-header h2').text(g_app_menu[i].title);
						break;
					}
				}
				
			}
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

function requestSelect(table, cbComplete)
{
	var query = 'SELECT * FROM ' + table;
	query = query.toLowerCase();
	query = encodeURIComponent(query);

	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				alert("JSON Parsing Error. "+e);
				return;
			}

			//console.log(obj);
			
			if(cbComplete)
			{
				//alert(obj.result);
				cbComplete(table, obj.result);
			}
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

function requestInsert(table, cbComplete)
{
	var cols = Object.keys(table);
	
	var attr = '';
	for(var i=1; i<cols.length-2; i++)
	{
		attr = attr.concat(cols[i]);
		if(i!=(cols.length-3))
			attr = attr.concat(',');
	}
	
	var con = '';
	for(var i=1; i<cols.length-2; i++)
	{
		con = con.concat('\''+table[cols[i]]+'\'');
		if(i!=(cols.length-3))
			con = con.concat(',');
	}

	 var query = 'insert into '+table.table_name+' ('+attr+') values('+con+')';
 	 query = query.toUpperCase();
	 query = encodeURIComponent(query);
        
	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				console.log('json error:'+data);
				//alert("JSON Parsing Error. "+e);
				alert(data);
				return;
			}
			
			if(cbComplete)
				cbComplete(table, obj);
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

function getJsonFromFormGroup($formGroupRoot) {
	var json = {};
	$formGroupRoot.find('.form-group').each(function(index, element){
		
		var name = $(this).find('input').attr('name');
		var value = $(this).find('input').val();
		json[name] = value;
	});
	return json;
}

function getLocationParameter( name ){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
	var regexS = "[\\?&]"+name+"=([^&#]*)";  
	var regex = new RegExp( regexS );  
	var results = regex.exec( window.location.href ); 
	 if( results == null )    return "";  
	else    return results[1];
}

