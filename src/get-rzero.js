const argv = require('minimist')(process.argv.slice(2));
const MQ135 = require('./MQ135.js');
let mq135 = new MQ135(20.0);
mq135.setRZero(mq135.getResistance(argv.mq135))
console.log(`mq135: ${mq135.rZero_.toFixed(2)}`);

// const MQ2 = require('./MQ2.js');
// let mq2 = new MQ2(10.0);
// mq2.setRZero(mq2.getResistance(argv.mq2));
// console.log(`mq2: ${mq2.rZero_.toFixed(2)}`);
