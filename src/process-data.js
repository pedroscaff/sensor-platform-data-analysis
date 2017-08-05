'use strict';

const glob = require('glob');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const csv = require('./csv');
let files = [];
if (argv.folder && typeof argv.folder === 'string') {
    files = glob.sync(`${argv.folder}/*.csv`);
} else if (argv.pattern && typeof argv.pattern === 'string') {
    files = glob.sync(argv.pattern);
}
const output = argv.output || 'out.csv';
let columns = ['mq2', 'mq135', 'temp', 'hum', 'lat', 'lon', 'alt'];
if (argv.timestamp) {
    columns.push('timestamp');
}
let allCsvs = {
    columns: columns,
    entries: []
};

const MQ135 = require('./MQ135.js');
let mq135 = new MQ135(20.0);
mq135.setRZero(mq135.getResistance(argv.mq135));

const MQ2 = require('./MQ2.js');
let mq2 = new MQ2(10.0);
mq2.setRZero(mq2.getResistance(argv.mq2));

files.forEach(file => {
    let obj = csv.csvToObjArray(file, columns, [
        {
            column: 0,
            apply: val => {
                if (val > 0 && val < 1024) {
                    return mq2.getPPM(mq2.getResistance(val)).toFixed(2);
                } else {
                    // -1 as invalid read from sensor
                    return -1;
                }
            }
        },
        {
            column: 'mq135',
            apply: val => {
                if (val > 0 && val < 1024) {
                    return mq135.getPPM(mq135.getResistance(val)).toFixed(2);
                } else {
                    return -1;
                }
            }
        }
    ]);
    allCsvs.entries = allCsvs.entries.concat(obj.entries);
});

csv.saveCsv(output, allCsvs);
