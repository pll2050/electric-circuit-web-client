/*! JointJS+ v4.1.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2025 client IO

 2025-10-28 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import { dia, shapes, util } from '@joint/plus';

import JointPlusService from '../../services/joint-plus.service';
import { Controller, SharedEvents } from '../controller';
import * as actions from '../actions';
import { actionCreator } from '../../redux/helpers/actionCreator';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '../../theme';

const DEBOUNCE_TIME_MS = 500;

export class JointPlusController extends Controller {

    startListening() {

        const { graph, paper, toolbar } = this.service;

        this.listenTo(graph, {
            'add': onCellAdd,
            'remove': onCellRemove,
            'change:ports': onElementPortsChange,
            'change add remove': util.debounce(onGraphChange, DEBOUNCE_TIME_MS),
        });

        this.listenTo(paper, {
            'paper:pinch': onPaperPinch,
            'paper:pan': onPaperPan,
            'blank:pointerdown': onPaperBlankPointerdown,
            'cell:pointerup': onPaperCellPointerup,
            'cell:tool:remove': onPaperCellToolRemove,
            'element:pointermove': onPaperElementPointermove,
            'element:pointerup': onPaperElementPointerup,
            'element:port:add': onPaperElementPortAdd,
            'element:port:remove': onPaperElementPortRemove,
            'scale': onPaperScale
        });

        this.listenTo(toolbar, {
            'png:pointerclick': onToolbarPNGPointerclick
        });
    }
}

// Event Bus Service

export function onGraphStartBatch(service: JointPlusService, batchName: string): void {
    const { graph } = service;
    graph.startBatch(batchName);
}

export function onGraphStopBatch(service: JointPlusService, batchName: string): void {
    const { graph } = service;
    graph.stopBatch(batchName);
}

// Graph

function onCellAdd(service: JointPlusService, cell: dia.Cell): void {
    if (cell.isLink()) return;
    actions.setSelection(service, [cell]);
    actions.updateLinksRouting(service);
}

function onCellRemove(service: JointPlusService, removedCell: dia.Cell): void {
    const { selection } = service;
    if (!selection.includes(removedCell)) return;
    actions.setSelection(service, selection.filter(cell => cell !== removedCell));
    if (removedCell.isElement()) {
        actions.updateLinksRouting(service);
    }
}

function onElementPortsChange(_service: JointPlusService, message: shapes.app.Message): void {
    message.toggleAddPortButton('out');
}

function onGraphChange(service: JointPlusService): void {
    const { graph, dispatch } = service;
    dispatch(actionCreator(SharedEvents.GRAPH_CHANGED, graph.toJSON()));
}

// Paper

function onPaperBlankPointerdown(service: JointPlusService, evt: dia.Event): void {
    const { scroller } = service;
    actions.setSelection(service, []);
    scroller.startPanning(evt);
}

function onPaperPinch(service: JointPlusService, evt: dia.Event, ox: number, oy: number, scale: number) {
    const { scroller } = service;
    evt.preventDefault();
    scroller.zoom(scale - 1, { min: ZOOM_MIN, max: ZOOM_MAX, grid: ZOOM_STEP, ox, oy });
}

function onPaperPan(service: JointPlusService, evt:dia.Event, tx: number, ty: number) {
    const { scroller } = service;
    evt.preventDefault();
    scroller.el.scrollLeft += tx;
    scroller.el.scrollTop += ty;
}

function onPaperCellPointerup(service: JointPlusService, cellView: dia.CellView): void {
    actions.setSelection(service, [cellView.model]);
}

function onPaperElementPointermove(service: JointPlusService, elementView: dia.ElementView, evt: dia.Event): void {
    const { paper } = service;
    const { data } = evt;
    // Run the code below on the first `pointermove` event only
    if (data.pointermoveCalled) return;
    data.pointermoveCalled = true;
    paper.hideTools();
}

function onPaperElementPointerup(service: JointPlusService, _elementView: dia.ElementView, evt: dia.Event): void {
    const { paper } = service;
    const { data } = evt;
    if (!data.pointermoveCalled) return;
    paper.showTools();
    actions.updateLinksRouting(service);
}

function onPaperElementPortAdd(_service: JointPlusService, elementView: dia.ElementView, evt: dia.Event): void {
    evt.stopPropagation();
    const message = elementView.model as shapes.app.Message;
    message.addDefaultPort();
}

function onPaperElementPortRemove(_service: JointPlusService, elementView: dia.ElementView, evt: dia.Event): void {
    evt.stopPropagation();
    const portId = elementView.findAttribute('port', evt.target);
    const message = elementView.model as shapes.app.Message;
    message.removePort(portId);
}

function onPaperCellToolRemove(_service: JointPlusService, cellView: dia.CellView, _evt: dia.Event): void {
    cellView.model.remove();
}

function onPaperScale(service: JointPlusService): void {
    const { tooltip } = service;
    tooltip.hide();
}

// Toolbar

function onToolbarPNGPointerclick(service: JointPlusService): void {
    actions.exportToPNG(service);
}
