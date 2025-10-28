var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Node, NodeView } from '../node';
import { util } from '@joint/plus';

export class ColorInputView extends NodeView {
    
    events() {
        return Object.assign(Object.assign({}, super.events()), { 'change input': (evt) => { this.onInputChange(evt); } });
    }
    
    onInputChange(evt) {
        this.model.attr('input/props/value', evt.target.value, { input: true });
    }
}

export class ColorInput extends Node {
    
    initialize(attributes, options) {
        super.initialize(attributes, options);
        
        if (this.attr('input/props/value') != null) {
            this.updateCurrentData();
        }
        
        this.on('change:attrs', (_input, _attrs, options) => {
            if (options.propertyPath === 'attrs/input/props/value') {
                this.updateCurrentData();
            }
        });
    }
    
    preinitialize() {
        super.preinitialize();
        const markup = util.svg /* xml */ `
            <foreignObject @selector="foreignObject">
                <div @selector="content" xmlns="http://www.w3.org/1999/xhtml">
                    <input type="color" @selector="input"/>
                </div>
            </foreignObject>
        `;
        
        this.markup = this.markup.concat(markup);
    }
    
    defaults() {
        const defaults = super.defaults();
        return util.defaultsDeep({
            size: {
                width: 120,
                height: 60
            },
            type: 'processor.ColorInput',
            name: 'Color',
            group: 'inputs',
            outputSettings: [{
                    name: 'Color',
                    type: 'color',
                    defaultValue: '#ffffff'
                }],
            attrs: {
                foreignObject: {
                    width: 'calc(w-60)',
                    height: 'calc(h-32)',
                    x: 15,
                    y: 29,
                },
                input: {
                    props: {
                        value: '#ffffff'
                    }
                }
            }
        }, defaults);
    }
    
    action(_inputs = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    
    getCurrentData() {
        return [this.hexToRGB(this.attr('input/props/value'))];
    }
    
    getFileAttributes() {
        return super.getFileAttributes().concat(['attrs/input/props/value']);
    }
}
