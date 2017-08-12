import './index.css';
import {scaleLinear, scalePow} from 'd3-scale';
import UIControls from './UIControls.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import Chart from './Chart.js';

import {app_id, app_code, queries} from '../datalens.json';

// Initialize communication with the platform
const platform = new H.service.Platform({
    app_id,
    app_code,
    useCIT: true,
    useHTTPS: true
});

// initialize a map
let pixelRatio = devicePixelRatio > 1 ? 2 : 1;
let defaultLayers = platform.createDefaultLayers({
    tileSize: 256 * pixelRatio
});

let map = new H.Map(
    document.getElementsByClassName('dl-map')[0],
    defaultLayers.normal.basenight,
    {
        pixelRatio,
        center: new H.geo.Point(52.5194, 13.3989),
        zoom: 13
    }
);

window.addEventListener('resize', function() {
    map.getViewPort().resize();
});

//make the map interactive
new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
H.ui.UI.createDefault(map, defaultLayers);

//create providers
let service = platform.configure(new H.datalens.Service());

// Get query stats
service.fetchQueryStats(queries['prenzlbergTempelhof'].id, {
    stats: [
        {
            column_stats: {
                co2_ppm: ['$min', '$max', '$average'],
                lat_avg: ['$min', '$max'],
                lon_avg: ['$min', '$max']
            },
            dynamic: {
                x: '$drop',
                y: '$drop',
                z: 15
            }
        }
    ]
}).then(({stats}) => {

    const columnStats = stats[0].column_stats;
    // Set map bounds
    map.setViewBounds(new H.geo.Rect(
        columnStats.lat_avg.$max,
        columnStats.lon_avg.$min,
        columnStats.lat_avg.$min,
        columnStats.lon_avg.$max
    ), false);

    const prenzlbergTempelhofProvider = new H.datalens.QueryTileProvider(
        service, {
            queryId: queries['prenzlbergTempelhof'].id,
            tileParamNames: {
                x: 'x',
                y: 'y',
                z: 'z'
            }
        }
    );

    function dataToRows(data) {
        return data.rows.filter(row => {
            if (row[6] >= altRange[0] && row[6] <= altRange[1]) {
                return row;
            }
        });
    }

    const prenzlbergTempelhofLayer = new H.datalens.HeatmapLayer(
        prenzlbergTempelhofProvider, {
            dataToRows,
            rowToTilePoint: function(row) {
                return {
                    x: row[4],
                    y: row[5],
                    value: Number(row[1]),
                    count: row[0]
                };
            },
            bandwidth: () => {
                return scaleLinear().domain([0, 100]).range([1, 42])(16);
            },
            aggregation: H.datalens.HeatmapLayer.Aggregation.AVERAGE,
            valueRange: () => {
                let range = [0, 100];
                return range.map(
                    scaleLinear().domain([0, 100]).range([0, 600]));
            },
            colorScale: scaleLinear().domain([0, 1]).range([
                'rgba(202, 248, 191, 1)',
                'rgba(30, 68, 165, 1)'
            ]),
            countRange: () => {
                let range = [0, 80];
                return range.map(
                    scalePow().exponent(2).domain([0, 100]).range([0, 1]));
            }
        }
    );

    let currentLayer = prenzlbergTempelhofLayer;
    map.addLayer(prenzlbergTempelhofLayer);

    // create panel
    let legendLabels = [
        'CO2',
        'NH3',
        'CO'
    ];

    let gasSelectLabels = [
        {value: 'co2', label: 'CO2'},
        {value: 'nh3', label: 'NH3'},
        {value: 'co', label: 'CO'}
    ];

    let layerSelectLabels = [
        {value: '0', label: 'Prenzlberg-tempelhof'},
        {value: '1', label: 'Hourly'},
        {value: '2', label: 'Altidude'}
    ];

    let timeRange = [0, 23];
    let altRange = [0, 122];
    function onSliderChange(range, key) {
        if ('hour' === key) {
            timeRange = range;
            chart.setData(chartData.filter(d =>
                d[1] >= timeRange[0] && d[1] <= timeRange[1]));
        } else if ('alt' === key) {
            altRange = range;
            currentLayer.redraw();
        }
    }

    let chart = new Chart();
    let chartData;

    /**
    * update layers
    * @returns {Object} - new labels for the legend, used by uiControls component
    */
    function updateLayers(key) {
        if ('0' === key) {
            let currentLayers = map.getLayers();
            if (currentLayers.indexOf(prenzlbergTempelhofLayer) === -1) {
                // map.removeLayer()
                chart.hide();
                currentLayer = prenzlbergTempelhofLayer;
                map.addLayer(prenzlbergTempelhofLayer);
            }
        } else if ('1' === key) {
            map.removeLayer(prenzlbergTempelhofLayer);
            // currentLayer = otherLayer;
            if (chartData) {
                chart.setData(chartData.filter(d =>
                    d[1] >= timeRange[0] && d[1] <= timeRange[1]));
                chart.show();
            } else {
                service.fetchQueryData(queries['wholeday-chart'].id).then(data => {
                    chartData = data.rows;
                    chart.setData(chartData.filter(d =>
                        d[1] >= timeRange[0] && d[1] <= timeRange[1]));
                    chart.show();
                });
            }
        }
    }

    function updateGas(gas) {
        console.log(gas);
    }

    let uiControls = <UIControls
        title = 'Sensor Platform Monitoring'
        subtitle = ''
        gasDefaultValue = {gasSelectLabels[0].value}
        gasSelectLabels = {gasSelectLabels}
        layerSelectLabels = {layerSelectLabels}
        layerDefaultValue = {layerSelectLabels[0].value}
        onLayerChange = {updateLayers}
        onGasChange = {updateGas}
        onSliderChange = {onSliderChange}
        legendLabels = {legendLabels}
        />;

    ReactDOM.render(
        uiControls,
        document.getElementById('root')
    );
});
