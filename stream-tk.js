// Toolkit for handling Node.js data streams

// Copyright (c) 2013 Laurent Fortin
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
    util     = require('util'),
    fs       = require('fs');


var stk = {};

stk.version = '0.1.0';


stk.isStream = function isStream(obj) {
  return obj instanceof stream.Readable || obj instanceof stream.Writable;
};

stk.isReadable = function isReadable(obj) {
  return stk.isStream(obj) && !!obj.readable;
};

stk.isWritable = function isWritable(obj) {
  return stk.isStream(obj) && !!obj.writable;
};

stk.isTransform = function isTransform(obj) {
  return obj instanceof stream.Transform;
};

stk.isFlowing = function isFlowing(obj) {
  return stk.isReadable(obj) && !!obj._readableState.flowing;
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

  obj.isPipeOn = (function(dest) {
    return stk.isPipeOn(this, dest);
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


stk.createNull = function createNull(mode) {
  if(mode === "read") {
    return fs.createReadStream("/dev/null");
  }
  if(mode === "write") {
    return fs.createWriteStream("/dev/null");
  }
  throw new Error("mode must me either 'read or 'write'");
};

stk.createZero = function createZero(mode, length) {
  if(mode === "read") {
    if(!Number(length)) {
      throw new Error("must provide length in bytes");
    }
    return fs.createReadStream("/dev/zero", {start: 0, end: length-1});
  }
  if(mode === "write") {
    return fs.createWriteStream("/dev/zero");
  }
  throw new Error("mode must me either 'read or 'write'");
};

stk.createFull = function createFull(mode, length) {
  if(mode === "read") {
    if(!Number(length)) {
      throw new Error("must provide length in bytes");
    }
    return fs.createReadStream("/dev/full", {start: 0, end: length-1});
  }
  if(mode === "write") {
    return fs.createWriteStream("/dev/full");
  }
  throw new Error("mode must me either 'read or 'write'");
};

stk.createRandom = function createRandom(mode, length) {
  if(mode === "read") {
    if(!Number(length)) {
      throw new Error("must provide length in bytes");
    }
    return fs.createReadStream("/dev/urandom", {start: 0, end: length-1});
  }
  if(mode === "write") {
    return fs.createWriteStream("/dev/urandom");
  }
  throw new Error("mode must me either 'read or 'write'");
};

module.exports = stk;

