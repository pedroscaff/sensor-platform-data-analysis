import './index.css';
import {scaleQuantize} from 'd3-scale';
import UIControls from './UIControls.jsx';
import ReactDOM from 'react-dom';
import React from 'react';

import {app_id, app_code, queries} from '../datalens.json';

const {query} = queries;

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
service.fetchQueryStats(query.id, {
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

    const provider = new H.datalens.QueryTileProvider(
        service, {
            queryId: query.id,
            tileParamNames: {
                x: 'x',
                y: 'y',
                z: 'z'
            }
        }
    );

    const layer = new H.datalens.HeatmapLayer(
        provider, {
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

    map.addLayer(layer);

    // create panel
    let legendLabels = [
        'CO2',
        'NH3',
        'CO'
    ];

    let selectLabels = [
        {value: 'V002', label: 'CO2'},
        {value: 'V003', label: 'NH3'},
        {value: 'V004', label: 'CO'}
    ];

    let uiControls = <UIControls
        title = 'Sensor Platform Monitoring'
        subtitle = ''
        defaultLabel = {selectLabels[0].label}
        selectLabels = {selectLabels}
        legendLabels = {legendLabels}
        />;

    ReactDOM.render(
        uiControls,
        document.getElementById('root')
    );
});
/**
* update layers
* @returns {Object} - new labels for the legend, used by uiControls component
*/
// function updateLayers(key) {
//     let categories, scale;
//     let currentLayers = map.getLayers();
//     if (key === 'all') {
//         if (currentLayers.indexOf(majorityLayer) === -1) {
//             map.removeLayer(singleLayer);
//             map.addLayer(majorityLayer);
//         }
//         categories = legendLabels;
//         scale = majorityScale;
//     } else if (key === 'clear') {
//         map.removeLayer(singleLayer);
//         map.removeLayer(majorityLayer);
//         return;
//     } else {
//         if (currentLayers.indexOf(singleLayer) === -1) {
//             map.removeLayer(majorityLayer);
//         } else {
//             map.removeLayer(singleLayer);
//         }
//         // let domain = extent(data, entry => {
//         //     let value = Number.parseInt(entry[key]);
//         //     if (!Number.isNaN(value)) {
//         //         return Math.sqrt(value);
//         //     } else {
//         //         return 0;
//         //     }
//         // });
//         // let scale = scalePow(0.5).domain(domain).range(singleColors);
//         scale = scaleLinear([0, 1]).range(singleColors);
//         addSingleLayer(singleFillColor.bind(null, scale, key));
//     }
//     return {categories: categories, scale: scale};
// }
