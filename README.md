stream-tk
==============

`stream-tk` is a toolkit for handling data [streams](http://nodejs.org/api/stream.html) in Node.js.

It supports the "[stream2](http://blog.nodejs.org/2012/12/20/streams2/)" and "[stream3](https://github.com/joyent/node/commit/0f8de5e1f96a07fa6de837378d29ac5f2719ec60)" APIs implemented in Node.js version 0.10.x and up.


## Installation

    npm install stream-tk


## test methods API

`stream-tk` provides many test methods.

### .isStream( obj )

Returns `true` if object is a data [stream](http://nodejs.org/api/stream.html).

    var stream = require('stream'),
        stk = require('stream-tk');
        
    var myStream = new stream.PassThrough();
    
    stk.isStream(myStream); // -> true
    stk.isStream(process.stdout); // -> true
    stk.isStream("hello"); // -> false
    
### .isReadable( obj )

Returns `true` if object is a [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable) data stream.
    
    var readable = new stream.Readable();
    readable._read = function(){}; // implement _read method
    
    stk.isReadable(readable); // -> true
    stk.isReadable(process.stdin); // -> true
    stk.isReadable(process.stdout); // -> false

### .isWritable( obj )

Returns `true` if object is a [Writable](http://nodejs.org/api/stream.html#stream_class_stream_writable) data stream.

    var writable = new stream.Writable();
    
    stk.isWritable(writable); // -> true
    stk.isWritable(process.stdin); // -> false
    stk.isWritable(process.stdout); // -> true
    
### .isTransform( obj )

Returns `true` if object is a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) data stream.

    var transform = new stream.Transform();
    
    stk.isTransform(transform); // -> true
    stk.isTransform(require('zlib').createGzip()); // -> true
    
### .isFlowing( obj )

Returns `true` if object is a [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable) data stream in flowing mode.
(Relevant for the "[stream3](https://github.com/joyent/node/commit/0f8de5e1f96a07fa6de837378d29ac5f2719ec60)" API in Node.js version 0.11.5 and up.)

    readable.pause();
    
    stk.isFlowing(readable); // -> false
    
    readable.resume();
    
    stk.isFlowing(readable); // -> true
    
### .isPipeOn( source, destination )

Returns `true` if Readable stream source in piped on Writable stream destination.
(Relevant for the "[stream3](https://github.com/joyent/node/commit/0f8de5e1f96a07fa6de837378d29ac5f2719ec60)" API in Node.js version 0.11.5 and up.)

    stk.isPipeOn(readable, writable); // -> false
    
    readable.pipe(writable);
    
    stk.isPipeOn(readable, writable); // -> true
    
## Extending stream objects using .extend( )

The `.extend()` method allows you to extend stream objects with methods from the `stream-tk` API:

    var myStream = new stream.PassThrough();

    stk.extend(myStream);
    
    myStream.isReadable(); // -> true
    myStream.isWritable(); // -> true
    myStream.isTransform(); // -> true
    myStream.isFlowing(); // -> false
    myStream.isPipeOn(process.stdout); // -> false
    
    myStream.pipe(process.stdout);
    
    myStream.isFlowing(); // -> true
    myStream.isPipeOn(process.stdout); // -> true
    
## UNIX pseudo devices API

`stream-tk` provides data stream mappings to UNIX pseudo devices(`/dev/null`, `/dev/zero`, `/dev/full`, `/dev/urandom`).
Currently, this feature is not available for the Windows platform, but it might be supported later.

### .createNull( mode )

Creates a data stream mapped to the `/dev/null` pseudo device. Either 'read' or 'write' must be provided as `mode` parameter.

    var sink = stk.createNull('write');
    anyReadable.pipe(sink);

### .createZero( mode, length )

Creates a data stream mapped to the `/dev/zero` pseudo device. Either 'read' or 'write' must be provided as `mode` parameter.
The `length` parameter is also mandatory in 'read' mode.

    // create a 1k file filled with 0 bits
    var zeroSource = stk.createZero('read', 1024);
    var file = require('fs').createWriteStream('zeros.txt');
    zeroSource.pipe(file);
    
    var sink = stk.createZero('write');
    anyReadable.pipe(sink);

### .createFull( mode, length )

Creates a data stream mapped to the `/dev/full` pseudo device. Either 'read' or 'write' must be provided as `mode` parameter.
The `length` parameter is also mandatory in 'read' mode.

    // create a 1k file filled with 0 bits
    var zeroSource = stk.createFull('read', 1024);
    var file = require('fs').createWriteStream('zeros.txt');
    zeroSource.pipe(file);

### .createRandom( mode, length )

Creates a data stream mapped to the `/dev/urandom` pseudo device. Either 'read' or 'write' must be provided as `mode` parameter.
The `length` parameter is also mandatory in 'read' mode.

    // create a 1k file filled with pseudo-random binary
    var randomSource = stk.createRandom('read', 1024);
    var file = require('fs').createWriteStream('random.txt');
    randomSource.pipe(file);
    
    // mix random data into the pool
    stk.createRandom('write').write("anything");
    
