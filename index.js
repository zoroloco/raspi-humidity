var pathUtil = require('path'),
    _        = require('underscore'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    conf     = require(pathUtil.join(__dirname,'./conf.json')),
    cp       = require('child_process'),
    request  = require('request');

log.init();

var start = function() {
    var cmd     = pathUtil.join(__dirname,"AdafruitDHT.py");

    var a2303 = cp.spawn('python', [cmd]);
    a2303.stdin.setEncoding('utf-8');

    a2303.stdout.on('data', (data) => {
        log.info('rx data from A2302 sensor:'+data.toString());
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

/*
request.post({ url: conf.remote-server+conf.remote_path },
    function(error, response, body) {
        if (!error && response.statusCode == 200) {
            log.info('got response from remote server:' + JSON.stringify(body));
        }
    });
*/