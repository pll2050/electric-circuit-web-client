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
export class Resize extends Node {
    
    constructor(attributes, options) {
        super(attributes, options);
        
        this.on('change', (el, options) => {
            if (!options.inspector && !options.commandManager)
                return;
            
            if (options.propertyPath === 'properties/width' ||
                options.propertyPath === 'properties/height') {
                App.processor.process(this.id);
            }
        });
    }
    
    defaults() {
        const defaults = super.defaults();
        return util.defaultsDeep({
            type: 'processor.Resize',
            name: 'Resize',
            group: 'transform',
            properties: {
                width: 200,
                height: null,
            },
            size: {
                width: 120,
                height: calculateHeight(3)
            },
            inputSettings: [{
                    name: 'Image',
                    type: 'image',
                    property: 'image'
                }, {
                    name: 'Width',
                    type: 'number',
                    property: 'width'
                }, {
                    name: 'Height',
                    type: 'number',
                    property: 'height'
                }],
            outputSettings: [{
                    name: 'Image',
                    type: 'image',
                }]
        }, defaults);
    }
    
    action() {
        return __awaiter(this, void 0, void 0, function* () {
            const { image, width, height } = this.properties;
            
            if (!image)
                return [null];
            
            try {
                const originalSize = image.size();
                
                const result = new cv.Mat();
                const resultSize = new cv.Size(originalSize.width, originalSize.width);
                if (width && height) {
                    resultSize.width = width;
                    resultSize.height = height;
                }
                else if (width) {
                    resultSize.width = width;
                    resultSize.height = originalSize.height / originalSize.width * width;
                }
                else if (height) {
                    resultSize.height = height;
                    resultSize.width = originalSize.width / originalSize.height * height;
                }
                cv.resize(image, result, resultSize, 1, 1, cv.INTER_AREA);
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
                resize: {
                    label: 'Resize',
                    index: 2
                }
            },
            inputs: {
                properties: {
                    width: {
                        type: 'number',
                        label: 'Width',
                        group: 'resize'
                    },
                    height: {
                        type: 'number',
                        label: 'Height',
                        group: 'resize'
                    },
                }
            }
        }, nodeConfig);
    }
    
    getFileAttributes() {
        return super.getFileAttributes().concat(['properties/width', 'properties/height']);
    }
}
