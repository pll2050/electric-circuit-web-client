/*! JointJS+ v4.1.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2025 client IO

 2025-10-28 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


(function() {

    var graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });

    new joint.dia.Paper({
        el: document.getElementById('paper-donut'),
        width: 500,
        height: 350,
        model: graph,
        cellViewNamespace: joint.shapes
    });

    var donut = new joint.shapes.chart.Pie({
        position: { x: 120, y: 20 },
        size: { width: 300, height: 300 },
        sliceDefaults: {
            innerLabelMargin: -5,
            legendLabel: '{label}: {value:.01f}%',
            innerLabel: '{value:.01f}%'
        },
        pieHole: .3,
        series: [
            { label: '2014', data: [
                { value: 20.3, label: 'IE', fill: '#4CC3D9' },
                { value: 18.3, label: 'Firefox', fill: '#F16745' },
                { value: 34.2, label: 'Chrome', fill: '#7BC8A4' },
                { value: 17.8, label: 'Safari', fill: '#FFC65D' },
                { value: 2.7, label: 'Opera', fill: '#93648D' }
            ] },
            { label: '2013', data: [
                { value: 27.5, label: 'IE', fill: '#4CC3D9' },
                { value: 20, label: 'Firefox', fill: '#F16745' },
                { value: 30, label: 'Chrome', fill: '#7BC8A4' },
                { value: 14.8, label: 'Safari', fill: '#FFC65D' },
                { value: 2.3, label: 'Opera', fill: '#93648D' }
            ] },
            { label: '2012', data: [
                { value: 30.9, label: 'IE', fill: '#4CC3D9' },
                { value: 24.8, label: 'Firefox', fill: '#F16745' },
                { value: 24.6, label: 'Chrome', fill: '#7BC8A4' },
                { value: 6.5, label: 'Safari', fill: '#FFC65D' },
                { value: 2.5, label: 'Opera', fill: '#93648D' }
            ] }
        ],
        attrs: {
            '.legend': { 'ref-x': -10, 'ref-dx': null, 'ref-y': 10, 'x-alignment': -.999 },
            '.legend-slice text': { 'font-size': 11 },
            '.slice-inner-label': { fill: 'black', 'font-size': 10, 'letter-spacing': 0 },
            '.slice-fill': {
                stroke: 'white',
                'stroke-width': 2
            }
        }
    });
    graph.addCell(donut);

})();
