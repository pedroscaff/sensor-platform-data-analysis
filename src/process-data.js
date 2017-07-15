'use strict';

const glob = require('glob');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const csv = require('./csv');
let files = [];
if (argv.folder && typeof argv.folder === 'string') {
    files = glob.sync(`${argv.folder}/*.csv`);
} else if (argv.file && typeof argv.file === 'string') {
    files.push(path.resolve(argv.file));
}
const output = argv.output || 'out.csv';
const columns = ['mq2', 'mq135', 'temp', 'hum', 'lat', 'lon', 'alt'];
let allCsvs = {
    columns: columns,
    entries: []
};

files.forEach((file, index) => {
    let obj = csv.csvToObjArray(file, columns);
    allCsvs.entries = allCsvs.entries.concat(obj.entries);
});

csv.saveCsv(output, allCsvs);
