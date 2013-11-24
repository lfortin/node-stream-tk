

var assert = require('assert'),
    domain = require('domain'),
    os = require('os'),
    stream = require('stream'),
    stk = require('./stream-tk');

function getEOL(n) {
  var lines = [];
  for(var i = 0; i < n; i++) {
    lines.push(os.EOL);
  }
  return lines.join('');
}

process.stdout.write("running tests..." + getEOL(2));


var tester = domain.create();

tester.on('error', function(error) {
  process.stderr.write(error + getEOL(2));
  process.exit();
});


tester.run(function() {

  // API signature
  assert.ok(stk.isStream, ".isStream() method expected");
  assert.ok(stk.isReadable, ".isReadable() method expected");
  assert.ok(stk.isWritable, ".isWritable() method expected");
  assert.ok(stk.isTransform, ".isTransform() method expected");
  //assert.ok(stk.isPassThrough, ".isPassThrough() method expected");
  assert.ok(stk.isFlowing, ".isFlowing() method expected");
  assert.ok(stk.isEnded, ".isEnded() method expected");
  assert.ok(stk.isCorked, ".isCorked() method expected");
  assert.ok(stk.isPipeOn, ".isPipeOn() method expected");
  //assert.ok(stk.bufferize, ".bufferize() method expected");
  //assert.ok(stk.streamize, ".streamize() method expected");
  //assert.ok(stk.compose, "compose() method expected");
  assert.ok(stk.extend, ".extend() method expected");
  assert.ok(stk.createNull, ".createNull() method expected");
  assert.ok(stk.createZero, ".createZero() method expected");
  assert.ok(stk.createFull, ".createFull() method expected");
  assert.ok(stk.createRandom, ".createRandom() method expected");
  //assert.ok(monitor.whatever, "whatever expected");

  process.stdout.write("API signature OK" + getEOL(1));


  // test methods
  var readable  = new stream.Readable(),
      writable  = new stream.Writable(),
      duplex    = new stream.Duplex(),
      transform = new stream.Transform(),
      through   = new stream.PassThrough(),
      obj       = {};

  readable._read = function(){};
  duplex._read = function(){};

  assert.deepEqual(stk.isStream(readable),  true,  "stk.isStream(readable) : true expected");
  assert.deepEqual(stk.isStream(writable),  true,  "stk.isStream(writable) : true expected");
  assert.deepEqual(stk.isStream(duplex),    true,  "stk.isStream(duplex) : true expected");
  assert.deepEqual(stk.isStream(transform), true,  "stk.isStream(transform) : true expected");
  assert.deepEqual(stk.isStream(through),   true,  "stk.isStream(through) : true expected");
  assert.deepEqual(stk.isStream(obj),       false, "stk.isStream(obj) : false expected");

  assert.deepEqual(stk.isReadable(readable),  true,  "stk.isReadable(readable) : true expected");
  assert.deepEqual(stk.isReadable(writable),  false, "stk.isReadable(writable) : false expected");
  assert.deepEqual(stk.isReadable(duplex),    true,  "stk.isReadable(duplex) : true expected");
  assert.deepEqual(stk.isReadable(transform), true,  "stk.isReadable(transform) : true expected");
  assert.deepEqual(stk.isReadable(through),   true,  "stk.isReadable(through) : true expected");
  assert.deepEqual(stk.isReadable(obj),       false, "stk.isReadable(obj) : false expected");

  assert.deepEqual(stk.isWritable(readable),  false, "stk.isWritable(readable) : false expected");
  assert.deepEqual(stk.isWritable(writable),  true,  "stk.isWritable(writable) : true expected");
  assert.deepEqual(stk.isWritable(duplex),    true,  "stk.isWritable(duplex) : true expected");
  assert.deepEqual(stk.isWritable(transform), true,  "stk.isWritable(transform) : true expected");
  assert.deepEqual(stk.isWritable(through),   true,  "stk.isWritable(through) : true expected");
  assert.deepEqual(stk.isWritable(obj),       false, "stk.isWritable(obj) : false expected");

  assert.deepEqual(stk.isTransform(readable),  false, "stk.isTransform(readable) : false expected");
  assert.deepEqual(stk.isTransform(writable),  false, "stk.isTransform(writable) : false expected");
  assert.deepEqual(stk.isTransform(duplex),    false, "stk.isTransform(duplex) : false expected");
  assert.deepEqual(stk.isTransform(transform), true,  "stk.isTransform(transform) : true expected");
  assert.deepEqual(stk.isTransform(through),   true,  "stk.isTransform(through) : true expected");
  assert.deepEqual(stk.isTransform(obj),       false, "stk.isTransform(obj) : false expected");

  assert.deepEqual(stk.isFlowing(readable),  false, "stk.isFlowing(readable) : false expected");
  assert.deepEqual(stk.isFlowing(writable),  false, "stk.isFlowing(writable) : false expected");
  assert.deepEqual(stk.isFlowing(duplex),    false, "stk.isFlowing(duplex) : false expected");
  assert.deepEqual(stk.isFlowing(transform), false, "stk.isFlowing(transform) : false expected");
  assert.deepEqual(stk.isFlowing(through),   false, "stk.isFlowing(through) : false expected");
  assert.deepEqual(stk.isFlowing(obj),       false, "stk.isFlowing(obj) : false expected");

  readable.resume();
  duplex.resume();
  transform.resume();
  through.resume();

  assert.deepEqual(stk.isFlowing(readable),  true, "stk.isFlowing(readable) : true expected");
  assert.deepEqual(stk.isFlowing(duplex),    true, "stk.isFlowing(duplex) : true expected");
  assert.deepEqual(stk.isFlowing(transform), true, "stk.isFlowing(transform) : true expected");
  assert.deepEqual(stk.isFlowing(through),   true, "stk.isFlowing(through) : true expected");

  readable.pause();
  duplex.pause();
  transform.pause();
  through.pause();

  assert.deepEqual(stk.isFlowing(readable),  false, "stk.isFlowing(readable) : false expected");
  assert.deepEqual(stk.isFlowing(duplex),    false, "stk.isFlowing(duplex) : false expected");
  assert.deepEqual(stk.isFlowing(transform), false, "stk.isFlowing(transform) : false expected");
  assert.deepEqual(stk.isFlowing(through),   false, "stk.isFlowing(through) : false expected");

  var readableToEnd = new stream.Readable();
  var writableToEnd = new stream.Writable();
  var duplexToEnd1 = new stream.Duplex();
  var duplexToEnd2 = new stream.Duplex();
  readableToEnd._read = function(){};
  writableToEnd._write = function(){};
  duplexToEnd1._write = function(){};
  duplexToEnd2._read = function(){};

  assert.deepEqual(stk.isEnded(readableToEnd),  false, "stk.isEnded(readableToEnd) : false expected");
  assert.deepEqual(stk.isEnded(writableToEnd),  false, "stk.isEnded(writableToEnd) : false expected");
  assert.deepEqual(stk.isEnded(duplexToEnd1),  false, "stk.isEnded(duplexToEnd1) : false expected");
  assert.deepEqual(stk.isEnded(duplexToEnd2),  false, "stk.isEnded(duplexToEnd2) : false expected");
  readableToEnd.push(null);
  writableToEnd.end();
  duplexToEnd1.end();
  duplexToEnd2.push(null);
  assert.deepEqual(stk.isEnded(readableToEnd),  true, "stk.isEnded(readableToEnd) : true expected");
  assert.deepEqual(stk.isEnded(writableToEnd),  true, "stk.isEnded(writableToEnd) : true expected");
  assert.deepEqual(stk.isEnded(duplexToEnd1),  true, "stk.isEnded(duplexToEnd1) : true expected");
  assert.deepEqual(stk.isEnded(duplexToEnd2),  true, "stk.isEnded(duplexToEnd2) : true expected");

  assert.deepEqual(stk.isCorked(writable), false, "stk.isCorked(writable) : false expected");
  if(writable.cork && writable.uncork) {
    writable.cork();
    assert.deepEqual(stk.isCorked(writable), true, "stk.isCorked(writable) : true expected");
    writable.uncork();
    assert.deepEqual(stk.isCorked(writable), false, "stk.isCorked(writable) : false expected");
  }

  assert.deepEqual(stk.isPipeOn(writable, readable),  false, "stk.isPipeOn(writable, readable) : false expected");
  assert.deepEqual(stk.isPipeOn(readable, writable),  false, "stk.isPipeOn(readable, writable) : false expected");
  readable.pipe(writable);
  assert.deepEqual(stk.isPipeOn(readable, writable),  true, "stk.isPipeOn(readable, writable) : true expected");
  readable.pipe(through);
  assert.deepEqual(stk.isPipeOn(readable, writable),  true, "stk.isPipeOn(readable, writable) : true expected");
  assert.deepEqual(stk.isPipeOn(readable, through),  true, "stk.isPipeOn(readable, through) : true expected");
  readable.unpipe(writable);
  assert.deepEqual(stk.isPipeOn(readable, writable),  false, "stk.isPipeOn(readable, writable) : false expected");

  process.stdout.write("test methods OK" + getEOL(1));


  // extended object API signature
  assert.throws(
    function() {
      stk.extend(obj);
    },
    Error,
    "stk.extend(obj) : should throw Error"
  );

  stk.extend(readable);
  stk.extend(writable);
  stk.extend(through);

  assert.ok(readable.isReadable, ".isReadable() extended object method expected");
  assert.ok(readable.isWritable, ".isWritable() extended object method expected");
  assert.ok(readable.isTransform, ".isTransform() extended object method expected");
  //assert.ok(readable.isPassThrough, ".isPassThrough() extended object method expected");
  assert.ok(readable.isFlowing, ".isFlowing() extended object method expected");
  assert.ok(through.isCorked, ".isCorked() extended object method expected");
  assert.ok(readable.isPipeOn, ".isPipeOn() extended object method expected");

  assert.deepEqual(readable.isReadable(), true, "readable.isReadable() : true expected");
  assert.deepEqual(readable.isWritable(), false, "readable.isWritable() : false expected");
  assert.deepEqual(readable.isTransform(), false, "readable.isTransform() : false expected");
  assert.deepEqual(readable.isFlowing(), true, "readable.isFlowing() : true expected");
  assert.deepEqual(readable.isPipeOn(through), true, "readable.isPipeOn(through) : true expected");
  assert.deepEqual(readable.isPipeOn(writable), false, "readable.isPipeOn(writable) : false expected");
  if(writable.cork && writable.uncork) {
    assert.deepEqual(writable.isCorked(), false, "writable.isCorked() : false expected");
    writable.cork();
    assert.deepEqual(writable.isCorked(), true, "writable.isCorked() : true expected");
    writable.uncork();
    assert.deepEqual(writable.isCorked(), false, "writable.isCorked() : false expected");
  }

  assert.throws(
    function() {
      through.pipe(through);
    },
    Error,
    "through.pipe(through) : should throw Error"
  );

  assert.doesNotThrow(
    function() {
      readable.pipe(through);
    },
    "readable.pipe(through) : should not throw Error"
  );

  process.stdout.write("extended object methods OK" + getEOL(1));
});

