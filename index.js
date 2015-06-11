var nido = function(arr) { return arr.join(':'); };

module.exports = function(prefix, client, serialize) {
  var counter = nido([prefix, 'counter']);

  return function(data, cb) {
    client.incr([counter], function(incrErr, current) {
      if (incrErr) {
        cb(incrErr);
        return;
      }

      var key = nido([prefix, current]);
      var value = serialize(data);
      client.set([key, value], function(setErr) {
        if (setErr) {
          cb(setErr);
          return;
        }

        cb(null, key);
      });
    });
  };
};
