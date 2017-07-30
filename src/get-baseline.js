'use strict';

const csv = require('./csv');
const argv = require('minimist')(process.argv.slice(2));
const glob = require('glob');

const columns = ['mq2', 'mq135', 'temp', 'hum', 'lat', 'lon', 'alt'];

let files = glob.sync(argv.pattern);
let data = {
    columns: columns,
    entries: []
};
files.forEach(file => {
    let obj = csv.csvToObjArray(file, columns);
    data.entries = data.entries.concat(obj.entries);
});

let numPoints = data.entries.length;
let mq2Baseline = data.entries.map(entry => entry.mq2).reduce(
    (sum, value) => sum + value, 0) / numPoints;
let mq135Baseline = data.entries.map(entry => entry.mq135).reduce(
    (sum, value) => sum + value, 0) / numPoints;

// let highPoints = data.entries.filter(entry => entry.alt > 100);
// let numPoints = highPoints.length;
// let mq2Baseline = highPoints.map(point => point.mq2).reduce(
//     (sum, value) => sum + value, 0) / numPoints;
//
// let mq135Baseline = highPoints.map(point => point.mq135).reduce(
//     (sum, value) => sum + value, 0) / numPoints;

console.log(`mq2 baseline: ${mq2Baseline}`);
console.log(`mq135 baseline: ${mq135Baseline}`);
