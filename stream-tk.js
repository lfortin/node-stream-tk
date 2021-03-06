// Toolkit for handling Node.js data streams

// Copyright (c) 2013-2014 Laurent Fortin
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var stream   = require('stream'),
    rstream  = require('readable-stream'),
    util     = require('util'),
    fs       = require('fs'),
    pseudoDevices = require('./lib/_pseudo_devices');


var stk = {};

stk.version = '0.3.4';


stk.isStream = function isStream(obj) {
  return stk.isReadable(obj) || stk.isWritable(obj);
};

stk.isReadable = function isReadable(obj) {
  return obj instanceof stream.Readable || obj instanceof rstream.Readable;
};

stk.isWritable = function isWritable(obj) {
  return obj instanceof stream.Writable || obj instanceof rstream.Writable || stk.isDuplex(obj);
};

stk.isDuplex = function isDuplex(obj) {
  return obj instanceof stream.Duplex || obj instanceof rstream.Duplex;
};

stk.isTransform = function isTransform(obj) {
  return obj instanceof stream.Transform || obj instanceof rstream.Transform;
};

stk.isFlowing = function isFlowing(obj) {
  return stk.isReadable(obj) && !!obj._readableState.flowing;
};

stk._isReadableEnded = function (obj) {
  return stk.isReadable(obj) && !!obj._readableState.ended;
};

stk._isWritableEnded = function (obj) {
  return stk.isWritable(obj) && !!obj._writableState.ended;
};

stk.isEnded = function isEnded(obj) {
  return stk._isReadableEnded(obj) || stk._isWritableEnded(obj);
};

stk.isCorked = function isCorked(obj) {
  return stk.isWritable(obj) && !!obj._writableState.corked;
};

stk.isPipeOn = function isPipeOn(source, dest) {
  var found = false;

  if(!stk.isReadable(source)) {
    return false;
  }
  if(stk.isWritable(source._readableState.pipes)) {
    return source._readableState.pipes === dest;
  }
  if(util.isArray(source._readableState.pipes)) {
    source._readableState.pipes.forEach(function(el) {
      if(dest === el) {
        found = true;
      }
    });
  }
  return found;
};


stk.extend = function extend(obj) {
  if(!stk.isStream(obj)) {
    throw new Error("must provide a Stream instance");
  }
  
  // TODO: the following code could probably be reduced to 3-5 lines
  obj.isReadable = (function() {
    return stk.isReadable(this);
  }).bind(obj);

  obj.isWritable = (function() {
    return stk.isWritable(this);
  }).bind(obj);

  obj.isTransform = (function() {
    return stk.isTransform(this);
  }).bind(obj);

  obj.isFlowing = (function() {
    return stk.isFlowing(this);
  }).bind(obj);

  obj.isEnded = (function() {
    return stk.isEnded(this);
  }).bind(obj);

  obj.isCorked = (function() {
    return stk.isCorked(this);
  }).bind(obj);

  obj.isPipeOn = (function(dest) {
    return stk.isPipeOn(this, dest);
  }).bind(obj);

  obj.bufferize = (function(buf, callback) {
    return stk.bufferize(this, buf, callback);
  }).bind(obj);

  /** add custom behavior and properties here **/

  // prevent potentially infinite loop
  if(stk.isTransform(obj)) {
    obj.on('pipe', function(src) {
      if (this === src) {
        this.unpipe(this);
        throw new Error('Cannot pipe Transform onto itself');
      }
    });
  }

  return obj;
};


stk.bufferize = function bufferize(source, buf, callback) {
  var targetStart = 0,
      handler;

  if(!stk.isReadable(source)) {
    throw new Error("source must be a Readable Stream");
  }
  if(!Buffer.isBuffer(buf) && !Number(buf)) {
    throw new Error("destination must be a Buffer of a number");
  }

  // prevent change flowing mode when attaching 'data' handler
  if(!stk.isFlowing(source)) {
    source.pause();
  }

  buf = Buffer.isBuffer(buf) ? buf : new Buffer(buf);

  handler = function(data) {
    try {
      data.copy(buf, targetStart, 0, data.length);

      targetStart += data.length;

      if(targetStart >= buf.length) {
        (callback || function(){})(undefined, buf);
        source.removeListener('data', handler);
      }
    } catch(err) {
      (callback || function(){})(err, buf);
    }
  };

  source.on('data', handler);

  return buf;
};


stk.createNull = pseudoDevices.createNull;

stk.createZero = pseudoDevices.createZero;

stk.createFull = pseudoDevices.createFull;

stk.createRandom = pseudoDevices.createRandom;

module.exports = stk;

