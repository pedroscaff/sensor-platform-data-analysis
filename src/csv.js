'use strict';

module.exports = {
    csvToObjArray: function(input, columns, transforms = []) {
        const fs = require('fs');
        const colors = require('colors');
        let contents = fs.readFileSync(input, 'utf-8').split('\n');
        let objArray = {
            columns: columns,
            entries: []
        };
        for (let i = 0; i < contents.length; i++) {
            // sometimes the last entry has a line break (\n)
            // causing the content to be empty
            // that is not an invalid entry case
            if (contents[i] === '') {
                continue;
            }
            let line = contents[i].split(',');
            // do not process invalid entry
            if (line.length !== columns.length) {
                console.log(
                    colors.red(`invalid entry skipped:\n${contents[i]}`));
                continue;
            }
            let entry = {};
            line.forEach((value, index) => {
                if (index > 3) {
                    value = Number.parseFloat(value);
                } else {
                    value = Number.parseInt(value);
                }
                transforms.forEach(transform => {
                    if (transform.column === index ||
                        transform.column === columns[index]) {
                        value = transform.apply(value);
                    }
                });
                entry[columns[index]] = value;
            });
            objArray.entries.push(entry);
        }
        return objArray;
    },
    saveCsv: function(output, objArray) {
        const fs = require('fs');
        let csv = `${objArray.columns.toString()}\n`;
        function entryToLine(entry) {
            let line = '';
            objArray.columns.forEach((column, index) => {
                if (index === objArray.columns.length - 1) {
                    line += `${entry[column]}\n`;
                } else {
                    line += `${entry[column]},`;
                }
            });
            return line;
        }
        objArray.entries.forEach(entry => {
            csv += entryToLine(entry);
        });
        fs.writeFileSync(output, csv, 'utf-8');
    }
}
