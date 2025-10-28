/*! JointJS+ v4.1.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2025 client IO

 2025-10-28 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { dia } from '@joint/plus';

import { EventBusService } from '../../services/event-bus.service';
import { ShapeTypesEnum } from '../../joint-plus/shapes/app.shapes';
import { SharedEvents } from '../../joint-plus/controller';


@Component({
    selector: 'chatbot-inspector',
    templateUrl: './inspector.component.html',
    styleUrls: ['./inspector.component.scss']
})
export class InspectorComponent implements OnInit, OnDestroy {

    public cell: dia.Cell;
    public subscriptions = new Subscription();
    public shapeTypesEnum = ShapeTypesEnum;

    constructor(private readonly eventBusService: EventBusService) {
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.eventBusService.subscribe(SharedEvents.SELECTION_CHANGED, (selection: dia.Cell[]) => this.setCell(selection))
        );
    }

    private setCell(selection: dia.Cell[]): void {
        const [cell = null] = selection;
        this.cell = cell;
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
