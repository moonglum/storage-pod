var nido = function(arr) { return arr.join(':'); };
var identity = function(a) { return a; };

module.exports = function(prefix, client, opts) {
  opts = opts || {};
  var counter = nido([prefix, 'counter']);
  var serialize = opts.serialize || identity;
  var addOptions = identity;

  if (opts.hasOwnProperty('ttl')) {
    addOptions = function(parameters) {
      return parameters.concat(['PX', opts.ttl]);
    };
  }

  return function(data, cb) {
    client.incr([counter], function(incrErr, current) {
      if (incrErr) {
        cb(incrErr);
        return;
      }

      var key = nido([prefix, current]);
      var value = serialize(data);
      client.set(addOptions([key, value]), function(setErr) {
        cb(setErr, key);
      });
    });
  };
};
