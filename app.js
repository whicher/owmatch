var _TOKEN_URL = 'https://eu.api.battle.net/account/user?access_token=';
var _DEV_SERVER = 'http://localhost:5000';
var _PROD_SERVER = 'https://api.owmatch.me';  // Must be https in prod.
var _API_PATH = _PROD_SERVER + '/api/get_token/';

$( document ).ready(function() {
    console.log( "ready!" );

    var cookieBattletag = getCookie('battletag');
    if (cookieBattletag) {
      $('#p-login').hide();
      $('#p-battletag').text('Logged in as ' + battletag);
      return;
    }

    var currentUrl = window.location.href;
    console.log('currentUrl: ' + currentUrl);
    var params = getJsonFromUrl(currentUrl);

    // Handle authorization.
    if (params != null) {
      console.log(params);
      console.log(params['code']);
      // Request the access token.
      if (params['code']) {
        var authCode = params['code'];
        getAccessToken(authCode);
      }
    }
});

function getAccessToken(authCode) {
  $.ajax({
    url: _API_PATH + authCode,
    method: 'GET',
    success: function (data) {
      console.log('success: ');
      console.log(data);
      if (data['token_type']) {
        console.log('There is token type, so im requesting battle tag');
        getBattleTag(data);
      } else {
        console.log('No token type detected, sry bro.');
      }
    }
  });
}

function getBattleTag(data) {
  console.log('Get battle tag for ' + data['access_token']);
  $.ajax({
    url: _TOKEN_URL + data['access_token'],
    method: 'GET',
    success: function (data) {
      console.log('success: ');
      console.log(data);
      $('#p-login').hide();
      var battletag = data['battletag'];
      $('#p-battletag').text('Logged in as ' + battletag);
      setCookie('battletag', battletag, 5);
    }
  });
}

function getJsonFromUrl() {
  console.log('getJsonFromUrl');
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
