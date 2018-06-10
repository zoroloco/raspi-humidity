var pathUtil = require('path'),
    _        = require('underscore'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    conf     = require(pathUtil.join(__dirname,'./conf.json')),
    cp       = require('child_process'),
    request  = require('request');

log.init();
var cmd     = pathUtil.join(__dirname,"AdafruitDHT.py");

var findHumidity = function() {

    function post(msg) {
        request.post({ url: conf.remote-server+conf.remote_path, msg },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    log.info('got response from remote server:' + JSON.stringify(body));
                }
            });
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

setInterval(findHumidity(),conf.interval);