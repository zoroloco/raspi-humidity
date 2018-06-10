var pathUtil = require('path'),
    _        = require('underscore'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    conf     = require(pathUtil.join(__dirname,'./conf.json')),
    cp       = require('child_process'),
    http     = require('http');

log.init();
var cmd     = pathUtil.join(__dirname,"AdafruitDHT.py");
var client  = http.createClient(conf.remote_port, conf.remote_server);
var request = client.request("POST", conf.remote_path, {"host":conf.remote_server});

var findHumidity = function() {

    function post(msg) {
        log.info('Posting to: ' + conf.remote_server+conf.remote_path);
        request.write(msg);
    }

    var a2303 = cp.spawn('python', [cmd, '2302', conf.pin]);
    a2303.stdin.setEncoding('utf-8');

    a2303.stdout.on('data', (data) => {
        log.info('rx data from A2302 sensor:'+data.toString());
        post(data.toString());
    });

    a2303.stderr.on('data', (err) => {
        log.error('rx stderr from A2302 sensor:'+err);
    });

    a2303.on('close', (code) => {
        log.info('a2302 sensor python process closed with code:'+code);
    });

    a2303.on('exit', (code) => {
        log.info('a2302 sensor python process exited with code:'+code);
    });
};

setInterval(findHumidity,conf.interval);