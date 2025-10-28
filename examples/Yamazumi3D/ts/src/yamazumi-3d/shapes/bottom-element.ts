import { util, dia } from '@joint/plus';
import { Operator } from '../models';
import { RectPrism, RectPrismAttributes, RectPrismView } from './rect-prism';

const TYPE = 'yamazumi.BottomElement';

interface BottomElementAttributes extends RectPrismAttributes {
    operators: Operator[];
    operationGap: number;
    taskWidth: number;
}

export class BottomElement extends RectPrism<BottomElementAttributes> {
    constructor(attributes: BottomElementAttributes, options?: dia.Graph.Options) {
        attributes.label = '';
        super(attributes, options);
        const { operators, operationGap, taskWidth, depth } = attributes;

        const width = (operators.length * taskWidth) + operationGap;

        this.prop({
            size: {
                width: width,
                height: 30
            },
            attrs: {
                side: {
                    d: `M calc(w) 0 l ${depth + RectPrism.bottomMargin} -${depth + RectPrism.bottomMargin} v calc(h-${RectPrism.bottomMargin}) l -${depth + RectPrism.bottomMargin} ${depth + RectPrism.bottomMargin} z`
                },
                top: {
                    d: `M 0 0 l ${depth + RectPrism.bottomMargin} -${depth + RectPrism.bottomMargin} h calc(w) l -${depth + RectPrism.bottomMargin} ${depth + RectPrism.bottomMargin} z`
                }
            }
        })

        operators.forEach((operator, i) => {
            const x = i * taskWidth + i * operationGap + taskWidth / 2;

            (<dia.MarkupJSON>this.markup).push(...util.svg/* xml */`
                <text
                    @selector="label${i + 1}"
                    text-anchor="middle"
                    x="${x}"
                    y="18"
                    font-family="Noto Sans"
                    stroke="none"
                    fill="#4B5563"
                    font-size="12"
                    font-weight="600"
                >
                    ${operator.label}
                </text>
            `);
        });
    }

    defaults(): any {
        return {
            ...super.defaults(),
            type: TYPE,
            z: -1
        };
    }
}

export class BottomElementView extends RectPrismView {

}
