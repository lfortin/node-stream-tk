

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
  assert.ok(stk.isPipeOn, ".isPipeOn() method expected");
  assert.ok(stk.bufferize, ".bufferize() method expected");
  //assert.ok(stk.streamize, ".streamize() method expected");
  //assert.ok(stk.compose, "compose() method expected");
  //assert.ok(stk.extend, ".extend() method expected");
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


  var buf = stk.bufferize(through, 1024, function(err, buf) {
    assert.deepEqual(buf.length, 1024, "buffer.length === 1024 expected");
    assert.deepEqual(buf.toString("utf8", 0, 4), "test", "first 4 chars of buffer === 'test' expected");

    process.stdout.write("bufferize method callback OK" + getEOL(1));
  });
  through.resume();
  through.write("test", "utf8");
  through.write(new Buffer(1020));
  assert.deepEqual(buf.length, 1024, "buffer.length === 1024 expected");

  process.stdout.write("bufferize method OK" + getEOL(1));
});

