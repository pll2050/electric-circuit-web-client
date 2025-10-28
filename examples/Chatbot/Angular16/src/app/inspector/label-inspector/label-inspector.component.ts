/*! JointJS+ v4.1.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2025 client IO

 2025-10-28 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import { Component } from '@angular/core';

import { BaseInspectorComponent } from '../base-inspector/base-inspector.component';

@Component({
    selector: 'app-label-inspector',
    templateUrl: './label-inspector.component.html',
    styleUrls: ['../inspector.component.scss']
})
export class LabelInspectorComponent extends BaseInspectorComponent {

    public label: string;

    public props = {
        label: ['attrs', 'label', 'text']
    };

    protected assignFormFields(): void {
        const { cell, props } = this;
        this.label = cell.prop(props.label);
    }
}
