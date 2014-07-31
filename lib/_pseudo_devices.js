var stream = require('stream'),
    fs     = require('fs');

var stk = {};


function createNullRead(length) {

    var readable = new stream.Readable();
    
    readable._read = function() {
      // nothing
    };

    readable.push(null);
    
    return readable;
}

function createNullWrite() {

    var writable = new stream.Writable();
    
    writable._write = function(chunk, encoding, callback) {
      callback();
    };

    /*
    writable.write = function() {
      return true;
    };
    */
    
    return writable;
}

function createZeroRead(length) {

    var readable = new stream.Readable();
    
    readable._read = function() {
      // nothing
    };
    
    readable.push(new Buffer(length).fill(0));
    readable.push(null);
    
    return readable;
}

var createZeroWrite = createNullWrite;

var createFullRead = createZeroRead;

function createFullWrite() {
    
    var writable = new stream.Writable();

    writable._write = function(chunk, encoding, callback) {
      callback();
    };

    writable.end('');
    
    return writable;
}

function createRandomRead(length) {
    
    var readable = new stream.Readable();

    readable._read = function() {
      // nothing
    };
    
    process.nextTick(function() {
      
      readable.push(null);
    });
    
    return readable;
}

function createRandomWrite() {
    
    var writable = new stream.Writable();
    
    return writable;
}

stk.createNull = function createNull(mode) {
  if(mode === "read") {
    try {
      return fs.createReadStream("/dev/null");
    } catch(e) {
      return createNullRead();
    }
  }
  if(mode === "write") {
    try {
      return fs.createWriteStream("/dev/null");
    } catch(e) {
      return createNullWrite();
    }
  }
  throw new Error("mode must be either 'read or 'write'");
};

stk.createZero = function createZero(mode, length) {
  if(mode === "read") {
    if(!Number(length)) {
      throw new Error("must provide length in bytes");
    }
    try {
      return fs.createReadStream("/dev/zero", {start: 0, end: length-1});
    } catch(e) {
      return createZeroRead(length);
    }
  }
  if(mode === "write") {
    try {
      return fs.createWriteStream("/dev/zero");
    } catch(e) {
      return createZeroWrite();
    }
  }
  throw new Error("mode must be either 'read or 'write'");
};

stk.createFull = function createFull(mode, length) {
  if(mode === "read") {
    if(!Number(length)) {
      throw new Error("must provide length in bytes");
    }
    try {
      return fs.createReadStream("/dev/full", {start: 0, end: length-1});
    } catch(e) {
      return createFullRead(length);
    }
  }
  if(mode === "write") {
    try {
      return fs.createWriteStream("/dev/full");
    } catch(e) {
      return createFullWrite();
    }
  }
  throw new Error("mode must be either 'read or 'write'");
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
  throw new Error("mode must be either 'read or 'write'");
};


module.exports = stk;
