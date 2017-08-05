const d3Array = require('d3-array');
const csv = require('./csv');
const argv = require('minimist')(process.argv.slice(2));
const glob = require('glob');

const columns = ['mq2', 'mq135', 'temp', 'hum', 'lat', 'lon', 'alt'];

let files = glob.sync(argv.pattern);

let accessor = entry => entry.mq135;
files.forEach(file => {
    let entries = csv.csvToObjArray(file, columns).entries;

    console.log(`
        file:                 ${file}
        mq135 min:            ${d3Array.min(entries, accessor)}
        mq135 max:            ${d3Array.max(entries, accessor)}
        mq135 mean:           ${d3Array.mean(entries, accessor)}
        mq135 median:         ${d3Array.median(entries, accessor)}
        mq135 variance:       ${d3Array.variance(entries, accessor)}
        mq135 std. deviation: ${d3Array.deviation(entries, accessor)}
    `);

});
