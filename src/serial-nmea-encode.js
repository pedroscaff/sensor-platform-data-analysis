'use strict';

let SerialPort = require('serialport');
let nmea = require('node-nmea');

let port = new SerialPort('/dev/cu.usbmodem1421', {
    baudRate: 9600,
    parser: SerialPort.parsers.readline('\r\n')
});

port.on('data', (data) => {
    let parsed = nmea.parse(data);
    if (parsed.valid) {
        console.log(parsed.altitude);
        console.log(parsed.loc.geojson.coordinates);
    }
});
