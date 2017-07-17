'use strict';

// Parameters for calculating ppm of CO from sensor resistance
// y = a * x ^ b
const PAR_A = 3.0641 * 10^4;
const PAR_B = -2.9656;

class MQ2 {
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
    setRZero(rZero) {
        this.rZero_ = rZero;
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
    getPPM(resistance) {
        return PAR_A * Math.pow((resistance/this.rZero_), PAR_B);
    }
}

module.exports = MQ2;
