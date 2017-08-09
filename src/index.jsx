import './index.css';
import {scaleQuantize} from 'd3-scale';
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
        center: new H.geo.Point(-19.91946, -43.94274),
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

    const colors = [
        'rgb(158, 1, 66)',
        'rgb(238, 100, 69)',
        'rgb(250, 177, 88)',
        'rgb(243, 250, 173)',
        'rgb(199, 250, 173)',
        'rgb(152, 213, 163)',
        'rgb(92, 183, 169)'
    ];

    //init controls
    // const bandwidthCtl = new Slider(10);

    let bandwidth = [
        {
            value: 0.5,
            zoom: 4
        },
        {
            value: 4,
            zoom: 17
        }
    ];

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

    const prenzlbergTempelhofLayer = new H.datalens.HeatmapLayer(
        prenzlbergTempelhofProvider, {
            rowToTilePoint: function(row) {
                return {
                    x: row.tx,
                    y: row.ty,
                    value: row.co2_ppm,
                    count: row.count
                };
            },
            bandwidth,
            aggregation: H.datalens.HeatmapLayer.Aggregation.AVERAGE,
            // valueRange: [columnStats.co2_ppm.$min, columnStats.co2_ppm.$max],
            valueRange: [100, 600],
            colorScale: scaleQuantize().domain([0, 1]).range(colors),
            inputScale: H.datalens.HeatmapLayer.InputScale.LINEAR
        }
    );

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

    function onSliderChange(value) {
        console.log(value);
    }

    let chart = new Chart();

    /**
    * update layers
    * @returns {Object} - new labels for the legend, used by uiControls component
    */
    function updateLayers(key) {
        if ('0' === key) {
            let currentLayers = map.getLayes();
            if (currentLayers.indexOf(prenzlbergTempelhofLayer) === -1) {
                // map.removeLayer()
                chart.hide();
                map.addLayer(prenzlbergTempelhofLayer);
            }
        } else if ('1' === key) {
            map.removeLayer(prenzlbergTempelhofLayer);
            service.fetchQueryData(queries['wholeday-chart'].id).then(data => {
                chart.setData(data.rows);
                chart.draw();
            });

        }
        // let categories, scale;
        // let currentLayers = map.getLayers();
        // switch (key) {
        //     case 'co2':
        //         map.removeLayer();
        // }
        // if (key === 'all') {
        //     if (currentLayers.indexOf(majorityLayer) === -1) {
        //         map.removeLayer(singleLayer);
        //         map.addLayer(majorityLayer);
        //     }
        //     categories = legendLabels;
        //     scale = majorityScale;
        // } else if (key === 'clear') {
        //     map.removeLayer(singleLayer);
        //     map.removeLayer(majorityLayer);
        //     return;
        // } else {
        //     if (currentLayers.indexOf(singleLayer) === -1) {
        //         map.removeLayer(majorityLayer);
        //     } else {
        //         map.removeLayer(singleLayer);
        //     }
        // }
        // return {categories: categories, scale: scale};
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
