'use strict';

// The load resistance on the board
// const R_LOAD = 10.0;
// Calibration resistance at atmospheric CO2 level
// const R_ZERO = 130.0;
// Parameters for calculating ppm of CO2 from sensor resistance
const PAR_A = 116.6020682;
const PAR_B = -2.769034857;

// Parameters to model temperature and humidity dependence
const CORA = 0.00035;
const CORB = 0.02718;
const CORC = 1.39538;
const CORD = 0.0018;
const CORE = -0.003333333;
const CORF = -0.001923077;
const CORG = 1.130128205;

// Atmospheric CO2 level for calibration purposes
const ATMOCO2 = 409.65;

class MQ135 {
    constructor(rZero, rLoad) {
        this.rZero_ = rZero;
        this.rLoad_ = rLoad;
    }

    getResistance(val) {
        return ((1023/val) - 1) * this.rLoad_;
    }

    getPPM(resistance) {
        return PAR_A * Math.pow((resistance/this.rZero_), PAR_B);
    }
}

export default MQ135;
