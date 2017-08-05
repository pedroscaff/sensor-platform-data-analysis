const d3Array = require('d3-array');
const csv = require('./csv');
const argv = require('minimist')(process.argv.slice(2));
const glob = require('glob');

const columns = ['mq2', 'mq135', 'temp', 'hum', 'lat', 'lon', 'alt'];

let files = glob.sync(argv.pattern);

files.forEach(file => {
    let entries = csv.csvToObjArray(file, columns).entries;
    if (argv.altfilter && typeof argv.altfilter === 'number') {
        entries.filter(entry => entry.alt >= argv.altfilter);
    }
    entries = entries.map(
        entry => entry.mq135
    ).filter(entry => entry !== -1);

    console.log(`
        file:                 ${file}
        filter:               alt >= ${argv.altfilter}
        samples:              ${entries.length}
        mq135 min:            ${d3Array.min(entries)}
        mq135 max:            ${d3Array.max(entries)}
        mq135 mean:           ${d3Array.mean(entries).toFixed(2)}
        mq135 median:         ${d3Array.median(entries).toFixed(2)}
        mq135 variance:       ${d3Array.variance(entries).toFixed(2)}
        mq135 std. deviation: ${d3Array.deviation(entries).toFixed(2)}
    `);

});
