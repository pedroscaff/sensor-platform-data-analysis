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
        this.data = data;
        // TODO update chart
    }
    hide() {
        
    }
    draw() {
        let margin = {top: 20, right: 20, bottom: 20, left: 20}
        this.svg = select('#chart')
            .attr('width', 400)
            .attr('height', 400);

        let width = 400 - margin.left - margin.top;
        let height = 400 - margin.top - margin.bottom;
        this.g = this.svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.bottom})`);
        let x = scaleOrdinal().domain([0, 23]).range([0, width]);
        let yDomain = extent(this.data, d => d[0]);
        let y = scaleLinear().domain(yDomain).range([height, 0]);
        let line = d3Line().x(d => x(d[1])).y(d => y(d[0]));

        this.g.append('g')
                .call(axisLeft(y))
                .attr('class', 'y-axis')
            .append('text')
                .attr('fill', '#ffffff')
                .text('CO2 PPM');

        this.g.append('g')
                .call(axisBottom(x))
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${height})`)
            .append('text')
            .text('Hour');

        this.g.append('path')
            .datum(this.data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5)
            .attr('d', line);
    }
}

export default Chart;
