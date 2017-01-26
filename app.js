var _TOKEN_URL = 'https://eu.api.battle.net/account/user?access_token=';
var _DEV_SERVER_DOMAIN = 'http://localhost:5000';
var _PROD_SERVER_DOMAIN = 'https://api.owmatch.me';  // Must be https in prod.
var _API_PATH = _PROD_SERVER + '/api/get_token/';

$( document ).ready(function() {
    console.log( "ready!" );
    var currentUrl = window.location.href;
    console.log('currentUrl: ' + currentUrl);
    var params = getJsonFromUrl(currentUrl);

    // Handle authorization.
    if (params != null) {
      console.log(params);
      console.log(params['code']);

      var authCode = params['code'];
      // Request the access token.
      if (params['code']) {
        $.ajax({
          url: _API_PATH + authCode,
          method: 'GET',
          success: function (data) {
            console.log('success: ');
            console.log(data);
            if (data.token_type) {
              $.ajax({
                url: _TOKEN_URL + data.access_token,
                method: 'GET',
                success: function (data) {
                  console.log('success: ');
                  console.log(data);
                  $('#p-login').hide();
                  $('#p-battletag').text('Logged in as ' + data.battletag);
                }
              });
            }
          }
        });
      }
    }
});

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