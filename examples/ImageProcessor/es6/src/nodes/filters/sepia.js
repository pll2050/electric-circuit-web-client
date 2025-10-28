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
export class Sepia extends Node {
    defaults() {
        const defaults = super.defaults();
        return util.defaultsDeep({
            type: 'processor.Sepia',
            name: 'Sepia',
            group: 'filters',
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
            const { image } = this.properties;
            
            if (!image)
                return [null];
            
            try {
                const result = image.clone();
                
                for (let i = 0; i < result.rows; i++) {
                    for (let j = 0; j < result.cols; j++) {
                        let pixel = result.ucharPtr(i, j);
                        const r = pixel[0];
                        const g = pixel[1];
                        const b = pixel[2];
                        
                        const v = 0.3 * r + 0.59 * g + 0.11 * b;
                        const p = [v + 40, v + 20, v - 20];
                        
                        const pNorm = p.map(val => {
                            if (val < 0) {
                                return 0;
                            }
                            if (val > 255) {
                                return 255;
                            }
                            return val;
                        });
                        
                        pixel[0] = pNorm[0];
                        pixel[1] = pNorm[1];
                        pixel[2] = pNorm[2];
                    }
                }
                return [result];
            }
            catch (error) {
                return [null];
            }
        });
    }
}
