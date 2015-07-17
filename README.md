# Storage Pod [![build status](https://travis-ci.org/moonglum/storage-pod.svg)](https://travis-ci.org/moonglum/storage-pod)

Store data in Redis, get back the key it was stored at. The purpose of the library is to transport chunks of data between multiple processes. It will serialize your data, store it in Redis and provide you with the key it used to store it. You can then send the key to the other process (for example via pub/sub or a queue) and it can then receive the package. That's all.

## Installation

Install it in your project via:

```
npm install storage-pod --save
```

## Usage

First, you create a storage function. For that you need a namespace you want to use for the generated keys (in our example that is `mynamespace`) and a Redis client (which needs to be API compatible with the `redis` NPM package).

```js
var client = require('redis').createClient();
var createStorage = require('storage-pod');
var store = createStorage('mynamespace', client);
```

Now you have a `store` function, which you can use to store data. You provide it with a callback which will receive an error if something went wrong and the key that your data is accessible with:

```js
store(JSON.stringify({ hello: 'world' }), function(storeErr, key) {
  // now you can use your key for whatever
});
```

You can now send the key to the other process. It will just need to `GET` the key from Redis.

As you want to serialize the value most of the time, you can provide a serialize function to the `createStorage` function as a third parameter. The serialize function is applied to your data before it is stored in Redis. In the following example we use JSON as our serialization format, but you can choose whatever you want (MsgPack, ProtoBuf, transit... Just provide a function that takes data and returns it serialized).

```js
var store = createStorage('mynamespace', client, JSON.stringify);

// Now you can just provide an object:
store({ hello: 'world' }, function(storeErr, key) {
});
```

## Contributing

First install all development dependencies with `npm install`. Then run `npm run ci` to see if the code:

* Passes the test suite (aka. `npm test`)
* Passes the linter (aka. `npm run jshint`)
* Passes the code style checker (aka. `npm run jscs`)

This will also automatically happen before every commit and be checked by Travis CI. Tests are written using [tape](https://github.com/substack/tape).

## #lesscode

This library is inspired by the [\#lesscode](http://lesscode.is) movement: It has a very specific purpose, only one runtime dependency (a Redis client, which you need to provide to it and is therefore not a runtime dependency of the package) and just a few lines of code.

Thanks to [soveran](http://github.com/soveran) for the inspiration (especially [OST](https://github.com/soveran/ost)).

## License

This code is published under the MIT license.
