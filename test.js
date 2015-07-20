var test = require('tape');
var createStorage = require('./');

test('Save a result and get it back', function(t) {
  var client = require('redis').createClient();
  var uniqueValue = 'storagepodtest' + Date.now();
  var storedValue = { findme: uniqueValue };

  var store = createStorage('hulabulo', client);

  store(JSON.stringify(storedValue), function(storeErr, key) {
    client.get([key], function(getErr, v) {
      t.deepEqual(JSON.parse(v), storedValue);
      client.quit();
      t.end(storeErr || getErr);
    });
  });
});

test('Save a result and get it back using a serialize function', function(t) {
  var client = require('redis').createClient();
  var uniqueValue = 'storagepodtest' + Date.now();
  var storedValue = { findme: uniqueValue };

  var store = createStorage('hulabulo', client, { serialize: JSON.stringify });

  store(storedValue, function(storeErr, key) {
    client.get([key], function(getErr, v) {
      t.deepEqual(JSON.parse(v), storedValue);
      client.quit();
      t.end(storeErr || getErr);
    });
  });
});

test('Save a result with a TTL', function(t) {
  var client = require('redis').createClient();
  var uniqueValue = 'storagepodtest' + Date.now();
  var storedValue = { findme: uniqueValue };

  var store = createStorage('hulabulo', client, { ttl: 200 });

  store(JSON.stringify(storedValue), function(storeErr, key) {
    client.get([key], function(getErr, v) {
      t.notEqual(v, null);
    });

    setTimeout(function() {
      client.get([key], function(getErr, v) {
        t.equal(v, null);
        client.quit();
        t.end(storeErr || getErr);
      });
    }, 201);
  });
});
