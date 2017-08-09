'use strict';

// Parameters for calculating ppm of gases from sensor resistance
// y = a * x ^ b
const PARAMS = {
    co2: {
        a: 116.6020682,
        b: -2.769034857
    },
    nh4: {
        a: 108.02,
        b: -2.4693
    }
}

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
    /**
     * @constructor
     * @param rLoad - The load resistance on the board
     */
    constructor(rLoad) {
        this.rLoad_ = rLoad;
    }

    /**
     * @function set calibration (zero) resistance for ppm calculations
     * @param {Number} rZero - Calibration resistance at atmospheric CO2 level (get it using getResistance(calibrationVoltage))
     * @returns {void}
     */
    setRZero(resistance, gas) {
        this.rZero_ = resistance * Math.exp(
            Math.log(PARAMS[gas].a / ATMOCO2) / PARAMS[gas].b);
    }

    /**
     * @function get resistance from voltage read by MCU
     * @param {Number} voltage - voltage in range 0..1023
     * @returns {Number} resistance - ((Vcc * Rl) / voltage) - Rl
     */
    getResistance(voltage) {
        return ((1023 * this.rLoad_) / voltage) - this.rLoad_;
    }

    /**
     * @function get PPM value from sensor resistance
     * @param {Number} resistance - current sensor resistance
     * @returns {Number} value in PPM - PAR_A * (Rs/R0) ^ PAR_B
     */
    getPPM(resistance, gas) {
        return PARAMS[gas].a * Math.pow(
            (resistance/this.rZero_), PARAMS[gas].b);
    }
}

module.exports = MQ135;
