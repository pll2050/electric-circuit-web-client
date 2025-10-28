var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { util } from '@joint/plus';
import { Node, calculateHeight } from '../node';
import * as cv from '@techstark/opencv-js';
import { App } from '../../app';
export class Mirror extends Node {
    
    constructor(attributes, options) {
        super(attributes, options);
        
        this.on('change', (el, options) => {
            if (!options.inspector && !options.commandManager)
                return;
            
            if (options.propertyPath === 'properties/direction') {
                App.processor.process(this.id);
            }
        });
    }
    
    defaults() {
        const defaults = super.defaults();
        return util.defaultsDeep({
            type: 'processor.Mirror',
            name: 'Mirror',
            group: 'transform',
            properties: {
                direction: 'horizontal',
            },
            size: {
                width: 120,
                height: calculateHeight(1)
            },
            inputSettings: [{
                    name: 'Image',
                    type: 'image',
                    property: 'image'
                }],
            outputSettings: [{
                    name: 'Image',
                    type: 'image',
                }]
        }, defaults);
    }
    
    action() {
        return __awaiter(this, void 0, void 0, function* () {
            const { image, direction } = this.properties;
            
            if (!image)
                return [null];
            
            try {
                const result = new cv.Mat();
                
                switch (direction) {
                    case 'horizontal':
                        cv.flip(image, result, 1);
                        break;
                    case 'vertical':
                        cv.flip(image, result, 0);
                        break;
                    case 'both':
                        cv.flip(image, result, -1);
                        break;
                    default:
                        cv.flip(image, result, 1);
                }
                return [result];
            }
            catch (error) {
                return [null];
            }
        });
    }
    
    getInspectorConfig() {
        const nodeConfig = super.getInspectorConfig();
        return util.defaultsDeep({
            groups: {
                mirror: {
                    label: 'Mirror',
                    index: 2
                }
            },
            inputs: {
                properties: {
                    direction: {
                        type: 'select-box',
                        label: 'Direction',
                        width: '204',
                        options: [{
                                content: 'horizontal'
                            }, {
                                content: 'vertical'
                            }, {
                                content: 'both'
                            }],
                        group: 'grayscale'
                    },
                }
            }
        }, nodeConfig);
    }
    
    getFileAttributes() {
        return super.getFileAttributes().concat(['properties/direction']);
    }
}
