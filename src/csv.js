'use strict';

module.exports = {
    csvToObjArray: function(input, columns) {
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
            // that is not a invalid entry case
            if (contents[i] === '') {
                continue;
            }
            let line = contents[i].split(',');
            // do not process invalid entry
            if (line.length !== columns.length) {
                console.log(colors.red(`invalid entry found:\n${contents[i]}`));
                continue;
            }
            let entry = {};
            line.forEach((value, index) => {
                if (index > 3) {
                    value = Number.parseFloat(value);
                } else {
                    value = Number.parseInt(value);
                }
                entry[columns[index]] = value;
            });
            objArray.entries.push(entry);
        }
        return objArray;
    },
    saveCsv: function(output, objArray) {
        const fs = require('fs');
        let csv = `${objArray.columns.toString()}\n`;
        function serialize(entry) {
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
            csv += serialize(entry);
        });
        fs.writeFileSync(output, csv, 'utf-8');
    }
}
