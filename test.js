var test = require('tape');
var createStorage = require('./');

test('Save a result and get it back', function(t) {
  var client = require('redis').createClient();
  var uniqueValue = 'storagepodtest' + Date.now();
  var storedValue = { findme: uniqueValue };

  var store = createStorage('hulabulo', client, JSON.stringify);

  store(storedValue, function(storeErr, key) {
    client.get([key], function(getErr, v) {
      t.deepEqual(JSON.parse(v), storedValue);
      client.quit();
      t.end(storeErr || getErr);
    });
  });
});
