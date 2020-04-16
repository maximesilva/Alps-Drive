const server = require("./server");
const fs = require('fs');
const os = require('os');

console.log(os.tmpdir());
fs.mkdir(os.tmpdir() + '/appdrive', { recursive: true }, (err) => {
    if (err) throw err;
    server.start();
});


