import {scaleLinear, scaleOrdinal} from 'd3-scale';
import {extent} from 'd3-array';
import {line as d3Line} from 'd3-shape';
import {axisLeft, axisBottom} from 'd3-axis';
import {select} from 'd3-selection';
import './chart.css';

class Chart {
    constructor(data) {
        if (data) {
            this.data = data;
            this.draw();
        }
    }
    setData(data) {
        this.data = [];
        data.forEach(d => {
            this.data.push({
                x: d[1],
                y: d[0]
            });
        });
        this.data.sort((a, b) => a.x < b.x ? -1 : 1);
        this.draw();
    }
    hide() {
        this.svg.classed('chart-hidden', true);
    }
    show() {
        this.svg.classed('chart-hidden', false);
    }
    createChart() {
        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${
                this.margin.bottom})`);
        let xDomain = this.data.map(d => d.x);
        let xRange = [];
        let interval = Math.ceil(this.width / (this.data.length - 1));
        for (let i = 0; i < this.data.length; i++) {
            xRange.push(interval * i);
        }
        let x = scaleOrdinal().domain(xDomain).range(xRange);
        let yDomain = extent(this.data, d => d.y);
        let y = scaleLinear().domain(yDomain).range([this.height, 0]);
        let line = d3Line().x(d => x(d.x)).y(d => y(d.y));

        this.g.append('g')
                .call(axisLeft(y))
                .classed('axis', true)
                .classed('y-axis', true)
            .append('text')
                .attr('fill', '#ffffff')
                .attr('x', 7)
                .text('CO2 PPM');

        this.g.append('g')
                .call(axisBottom(x))
                .classed('axis', true)
                .classed('x-axis', true)
                .attr('transform', `translate(0, ${this.height})`)
            .append('text')
                .attr('fill', '#ffffff')
                .attr('x', this.width)
                .text('Hour');

        this.line = this.g
            .append('path')
            .datum(this.data)
            .attr('class', 'chart-path')
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5)
            .attr('d', line);
    }
    draw() {
        if (this.initialized === true) {
            this.svg.selectAll('g').remove();
            this.createChart();
        } else {
            this.initialized = true;
            this.margin = {top: 20, right: 20, bottom: 20, left: 40}
            this.svg = select('#chart')
                .classed('root-svg', true)
                .attr('width', 400)
                .attr('height', 400);

            this.width = 400 - this.margin.left - this.margin.top;
            this.height = 400 - this.margin.top - this.margin.bottom;
            this.createChart();
        }
    }
}

export default Chart;
