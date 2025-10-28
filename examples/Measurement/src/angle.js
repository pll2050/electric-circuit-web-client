/*! JointJS+ v4.1.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2025 client IO

 2025-10-28 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


(function(dia, linkTools, shapes, ui) {

    var graph = new dia.Graph;

    var measurement = shapes.measurement;

    var paper = new dia.Paper({
        el: document.getElementById('paper'),
        width: 1000,
        height: 600,
        gridSize: 10,
        model: graph,
        interactive: true,
        async: true,
        frozen: true,
        sorting: dia.Paper.sorting.APPROX,
        background: { color:  '#F3F7F6' }
    });

    paper.on('cell:pointerup', function(view) {
        openTools(view);
    });

    paper.on('blank:pointerup', function() {
        closeTools(this);
    });

    var shape1 = new shapes.app.Shape({ position: { x: 500, y: 400 }});
    var shape2 = new shapes.app.Shape({ position: { x: 500, y: 100 }});
    var shape3 = new shapes.app.Shape({ position: { x: 100, y: 200 }});

    // Element To Element
    var angle1 = new measurement.Angle({
        attrs: {
            line: {
                stroke: '#464554',
                strokeWidth: 2,
                targetMarker: {
                    'type': 'circle',
                    'r': 2
                },
                sourceMarker: {
                    'type': 'circle',
                    'r': 2
                }
            },
            angles: {
                stroke: '#8D8DB6',
                strokeWidth: 2,
                strokeDasharray: '2,4',
                anglePie: false,
            },
            angleLabels: {
                fill: '#8D8DB6',
            }
        }
    });
    angle1.source(shape2, {
        anchor: { name: 'bottom', args: { rotate: true }},
        connectionPoint: { name: 'anchor' }
    });
    angle1.target(shape1, {
        anchor: { name: 'top', args: { rotate: true }},
        connectionPoint: { name: 'anchor' }
    });

    // Element To Link
    var angle2 = new measurement.Angle({
        attrs: {
            line: {
                strokeWidth: 2,
                stroke: '#464554',
                targetMarker: {
                    'type': 'circle',
                    'r': 3
                },
                sourceMarker: {
                    'type': 'circle',
                    'r': 2
                }
            },
            sourceAngle: {
                stroke: '#4666E5',
                strokeWidth: 3,
                angleDirection: 'small'
            },
            sourceAngleLabel: {
                fill: '#334AA6',
                fontWeight: 'bold'
            },
            targetAngle: {
                stroke: '#4666E5',
                strokeWidth: 3,
                angleStart: 'target',
                angleDirection: 'clockwise'
            },
            targetAngleLabel: {
                fill: '#334AA6',
                fontWeight: 'bold'
            }
        }
    });
    angle2.source(shape3, {
        anchor: { name: 'center' },
        connectionPoint: { name: 'boundary' }
    });
    angle2.target(angle1, {
        anchor: { name: 'connectionRatio' },
        connectionPoint: { name: 'anchor' },
    });

    // Disconnected Link
    var angle3 = new measurement.Angle({
        attrs: {
            line: {
                strokeWidth: 2,
                stroke: '#464554',
                sourceMarker: {
                    'type': 'path',
                    'd': 'M 0 -5 0 5',
                    'stroke-width': 3
                }
            },
            targetAngle: {
                stroke: '#4666E5',
                fill: '#859AEE',
                strokeWidth: 2,
                angleRadius: 50,
                angleStart: 'target',
                angleDirection: 'clockwise',
                angle: 90,
                anglePie: true
            },
            targetAngleLabel: {
                fill: '#FFFFFF',
                fontWeight: 'bold',
                angleTextDecimalPoints: 0,
                angleTextDistance: 30
            }
        }
    });
    angle3.source({ x: 800, y: 100 });
    angle3.target({ x: 800, y: 500 });


    function closeTools(targetPaper) {
        targetPaper.removeTools();
        ui.FreeTransform.clear(targetPaper);
    }

    function openTools(view) {

        var cell = view.model;
        closeTools(view.paper);
        if (cell.isLink()) {
            var tools = [
                createBoundary()
            ];
            switch (cell) {
                case angle1:
                    tools.push(
                        createAnchor('source', true),
                        createAnchor('target', true)
                    );
                    break;
                case angle2:
                    tools.push(
                        createButton({
                            'd': 'M -4 -0.8 L -7.2 2.4 L -4 5.6 L -4 3.2 L 1.6 3.2 L 1.6 1.6 L -4 1.6 L -4 -0.8 Z M 7.2 -2.4 L 4 -5.6 L 4 -3.2 L -1.6 -3.2 L -1.6 -1.6 L 4 -1.6 L 4 0.8 L 7.2 -2.4 Z',
                            'cursor': 'pointer',
                            'fill': '#FFFFFF',
                            'stroke': 'none'
                        }, -40, function() {
                            var link = this.model;
                            var directions = ['clockwise', 'anticlockwise'];
                            var direction = link.attr(['targetAngle', 'angleDirection']);
                            var newDirection = directions[(directions.indexOf(direction) + 1) % directions.length];
                            link.attr(['targetAngle', 'angleDirection'], newDirection);
                        }),
                        createButton({
                            'd': 'M -4 -0.8 L -7.2 2.4 L -4 5.6 L -4 3.2 L 1.6 3.2 L 1.6 1.6 L -4 1.6 L -4 -0.8 Z M 7.2 -2.4 L 4 -5.6 L 4 -3.2 L -1.6 -3.2 L -1.6 -1.6 L 4 -1.6 L 4 0.8 L 7.2 -2.4 Z',
                            'cursor': 'pointer',
                            'fill': '#FFFFFF',
                            'stroke': 'none'
                        }, 40, function() {
                            var link = this.model;
                            var directions = ['small', 'large'];
                            var direction = link.attr(['sourceAngle', 'angleDirection']);
                            var newDirection = directions[(directions.indexOf(direction) + 1) % directions.length];
                            link.attr(['sourceAngle', 'angleDirection'], newDirection);
                        }),
                        createAnchor('source'),
                        createAnchor('target')
                    );
                    break;
                case angle3:
                    tools.push(
                        createButton({
                            'd': 'M -5 0 5 0 M 0 -5 0 5',
                            'cursor': 'pointer',
                            'fill': 'none',
                            'stroke-width': 2,
                            'stroke': '#FFFFFF'
                        }, -50, function() {
                            var link = this.model;
                            const angle = link.attr(['targetAngle', 'angle']);
                            const newAngle = g.normalizeAngle(angle + 10);
                            link.attr(['targetAngle', 'angle'], newAngle);
                        })
                    );
                    break;
                default:
                    break;
            }
            var toolsView = new dia.ToolsView({ tools: tools })
            view.addTools(toolsView);
        } else {
            var freeTransform = new ui.FreeTransform({
                rotateAngleGrid: 5,
                cellView: view,
                clearOnBlankPointerdown: false,
                useModelGeometry: true,
                usePaperScale: true,
                padding: -1
            });
            freeTransform.render()
        }

        function createButton(attributes, distance, action) {
            return new linkTools.Button({
                markup: [{
                    tagName: 'circle',
                    selector: 'button',
                    attributes: {
                        'r': 10,
                        'cursor': 'pointer',
                        'fill': '#464554',
                        'stroke': '#F3F7F6',
                        'stroke-width': 1
                    },
                }, {
                    tagName: 'path',
                    attributes: attributes
                }],
                distance: distance,
                action: action
            });
        }

        function createBoundary() {
            var boundary = new linkTools.Boundary({ padding: 14 })
            boundary.vel.attr({
                'stroke': '#6B6A76',
                'stroke-dasharray': '1, 3',
                'stroke-width': 1
            });
            return boundary;
        }

        function createAnchor(end, snap) {
            var anchorTool = (end === 'source') ? linkTools.SourceAnchor : linkTools.TargetAnchor;
            if (snap) {
                return new anchorTool({
                    restrictArea: false,
                    resetAnchor: false,
                    snap: function(coords) {
                        var element = this.getEndView(end).model;
                        var bbox = element.getBBox();
                        var center = bbox.center();
                        var angle = element.angle();
                        return bbox.pointNearestToPoint(coords.rotate(center, angle)).rotate(center, -angle);
                    }
                });
            } else {
                return new anchorTool({
                    resetAnchor: false
                });
            }
        }
    }

    graph.addCells([
        shape1,
        shape2,
        shape3,
        angle1,
        angle2,
        angle3
    ]);

    openTools(shape2.findView(paper));

    paper.unfreeze();

})(
    joint.dia,
    joint.linkTools,
    joint.shapes,
    joint.ui
);
