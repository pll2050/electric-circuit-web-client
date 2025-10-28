/*! JointJS+ v4.1.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2025 client IO

 2025-10-28 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


var App = App || {};
App.config = App.config || {};

const baseSelectionUrl = 'assets/selection';

(function() {

    'use strict';

    App.config.selection = {

        handles: [
            {
                name: 'rotate',
                position: 'sw',
                icon: `${baseSelectionUrl}/icon-rotate.svg`,
                events: {
                    pointerdown: 'startRotating',
                    pointermove: 'doRotate',
                    pointerup: 'stopBatch'
                }
            },
            {
                name: 'resize',
                position: 'se',
                icon: `${baseSelectionUrl}/icon-resize.svg`,
                events: {
                    pointerdown: 'startResizing',
                    pointermove: 'doResize',
                    pointerup: 'stopBatch'
                }
            }
        ]
    };

})();
