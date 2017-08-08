const d3Array = require('d3-array');
const csv = require('./csv');
const argv = require('minimist')(process.argv.slice(2));
const glob = require('glob');

let columns = ['mq2', 'mq135', 'temp', 'hum', 'lat', 'lon', 'alt'];
if (argv.timestamp) {
    columns.push('timestamp');
}

let files = glob.sync(argv.pattern);

let accessor = function(column, entry) {
    return entry[column];
};

files.forEach(file => {
    let entries = csv.csvToObjArray(file, columns).entries;
    if (argv.altfilter && typeof argv.altfilter === 'number') {
        entries.filter(entry => entry.alt >= argv.altfilter);
    }
    // entries = entries.map(
    //     entry => entry.mq135
    // ).filter(entry => entry !== -1);

    console.log(`
        file:                 ${file}
        filter:               alt >= ${argv.altfilter}
        samples:              ${entries.length}
        mq135 min:            ${d3Array.min(entries, accessor.bind(null, 'mq135'))}
        mq135 max:            ${d3Array.max(entries, accessor.bind(null, 'mq135'))}
        mq135 mean:           ${d3Array.mean(entries, accessor.bind(null, 'mq135')).toFixed(2)}
        mq135 median:         ${d3Array.median(entries, accessor.bind(null, 'mq135')).toFixed(2)}
        mq135 variance:       ${d3Array.variance(entries, accessor.bind(null, 'mq135')).toFixed(2)}
        mq135 std. deviation: ${d3Array.deviation(entries, accessor.bind(null, 'mq135')).toFixed(2)}
        temperature mean:     ${d3Array.mean(entries, accessor.bind(null, 'temp')).toFixed(2)}
        humidity mean:        ${d3Array.mean(entries, accessor.bind(null, 'hum')).toFixed(2)}
    `);

});
