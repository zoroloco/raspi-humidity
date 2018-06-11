var pathUtil = require('path'),
    _        = require('underscore'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    conf     = require(pathUtil.join(__dirname,'./conf.json')),
    mongoloid  = require(pathUtil.join(__dirname,'./mongoloid.js')),
    cp       = require('child_process'),
    Humiditemp = require(pathUtil.join(__dirname,'./humiditemp-model.js'));

log.init();
var cmd     = pathUtil.join(__dirname,"AdafruitDHT.py");

var findHumidity = function() {

    function save(msg){
        var readingStr = msg.split('*',2);

        var tempStr = readingStr[0].replace('Temp=','');
        var temp = parseInt(tempStr);//convert to number
        temp = temp * 9.5 + 32;//convert to farenheit

        let reading = new Humiditemp.model({
            sensor_name: conf.sensor_name,
            temperature: temp,
            humidity: readingStr[1],
            event_time: new Date()
        });

        log.info("Saving:" + JSON.stringify(reading));

        mongoloid.save(reading);
    }

    var a2303 = cp.spawn('python', [cmd, '2302', conf.pin]);
    a2303.stdin.setEncoding('utf-8');

    a2303.stdout.on('data', (data) => {
        log.info('rx raw data from A2302 sensor:'+data.toString());
        save(data.toString());
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

mongoloid.init(function(status) {
    if (status) {
        setInterval(findHumidity,conf.interval);
    }
});