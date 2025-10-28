/*! JointJS+ v4.1.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2025 client IO

 2025-10-28 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


joint.dia.Element.define('qad.Answer', {
    padding: 50,
    attrs: {
        root: {
            cursor: 'move',
        },
        body: {
            fill: '#4b4a67',
            stroke: 'none',
            width: 'calc(w)',
            height: 'calc(h)',
            rx: 3,
            ry: 3
        },
        label: {
            fontSize: 14,
            x: 'calc(0.5 * w)',
            y: 'calc(0.5 * h)',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fill: '#f6f6f6',
            fontFamily: 'Arial, helvetica, sans-serif'
        }
    }
}, {
    markup: [{
        tagName: 'rect',
        selector: 'body'
    }, {
        tagName: 'text',
        selector: 'label'
    }],

    initialize: function() {

        joint.dia.Element.prototype.initialize.apply(this, arguments);

        this.autoresize();
        this.on('change:answer', this.autoresize, this);
    },

    autoresize: function() {

        var answer = this.get('answer');
        var padding = this.get('padding');
        var size = joint.util.measureText(answer, { fontSize: this.attr(['label', 'fontSize']) });

        this.prop({
            attrs: { label: { text: answer }},
            size: { width: size.width + padding, height: size.height + padding }
        });
    }

});

joint.dia.Element.define('qad.Question', {

    optionHeight: 30,
    questionHeight: 45,
    paddingBottom: 30,
    minWidth: 150,
    ports: {
        groups: {
            in: {
                position: 'top',
                attrs: {
                    circle: {
                        magnet: 'passive',
                        stroke: 'white',
                        fill: '#feb663',
                        r: 14
                    },
                    text: {
                        pointerEvents: 'none',
                        fontSize: 12,
                        fill: 'white'
                    }
                },
                label: {
                    position: {
                        name: 'left',
                        args: { x: 5 }
                    }
                }
            },
            out: {
                position: 'right',
                attrs: {
                    root: {
                        cursor: 'crosshair'
                    },
                    'circle': {
                        magnet: true,
                        stroke: 'none',
                        fill: '#31d0c6',
                        r: 14
                    }
                }
            }
        },
        items: [{
            group: 'in',
            attrs: {
                text: { text: 'in' }
            }
        }]
    },
    attrs: {
        '.': {
            magnet: false
        },
        root: {
            cursor: 'move',
        },
        '.body': {
            width: 'calc(w)',
            height: 'calc(h)',
            rx: '1%',
            ry: '2%',
            stroke: 'none',
            fill: {
                type: 'linearGradient',
                stops: [
                    { offset: '0%', color: '#FEB663' },
                    { offset: '100%', color: '#31D0C6' }
                ],
                // Top-to-bottom gradient.
                attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
            }
        },
        '.btn-add-option': {
            transform: 'translate(10, calc(h - 22))',
            cursor: 'pointer',
            fill: 'white'
        },
        '.btn-remove-option': {
            transform: 'translate(10, 13)',
            cursor: 'pointer',
            fill: 'white'
        },

        // Text styling.
        text: {
            fontFamily: 'Arial'
        },
        '.option-text': {
            fontSize: 11,
            fill: '#4b4a67',
            x: 30,
            textVerticalAnchor: 'middle',
        },
        '.question-text': {
            fill: 'white',
            x: 'calc(0.5 * w)',
            y: 15,
            fontSize: 15,
            textAnchor: 'middle',
            textVerticalAnchor: 'top',
            style: {
                textShadow: '1px 1px 0px gray'
            }
        },

        // Options styling.
        '.option-rect': {
            rx: 3,
            ry: 3,
            stroke: 'white',
            strokeWidth: 1,
            strokeOpacity: .5,
            fillOpacity: .5,
            fill: 'white',
            width: 'calc(w)'
        }
    }
}, {

    useCSSSelectors: true,
    markup: '<rect class="body"/><text class="question-text"/><g class="options"></g><path class="btn-add-option" d="M5,0 10,0 10,5 15,5 15,10 10,10 10,15 5,15 5,10 0,10 0,5 5,5z"/>',
    optionMarkup: '<g class="option"><rect class="option-rect"/><path class="btn-remove-option" d="M0,0 15,0 15,5 0,5z"/><text class="option-text"/></g>',

    initialize: function() {

        joint.dia.Element.prototype.initialize.apply(this, arguments);
        this.on('change:options', this.onChangeOptions, this);
        this.on('change:question', function() {
            this.attr('.question-text/text', this.get('question') || '');
            this.autoresize();
        }, this);

        this.on('change:questionHeight', function() {
            this.attr('.options/transform', `translate(0, ${this.get('questionHeight')})`, { silent: true });
            this.autoresize();
        }, this);

        this.on('change:optionHeight', this.autoresize, this);

        this.attr('.options/transform', `translate(0, ${this.get('questionHeight')})`, { silent: true });
        this.attr('.question-text/text', this.get('question'), { silent: true });

        this.onChangeOptions();
    },

    onChangeOptions: function() {

        var options = this.get('options') || [];
        var optionHeight = this.get('optionHeight');

        // First clean up the previously set attrs for the old options object.
        // We mark every new attribute object with the `dynamic` flag set to `true`.
        // This is how we recognize previously set attributes.
        var attrs = this.get('attrs');
        Object.keys(attrs).forEach((selector) => {

            if (attrs[selector].dynamic) {
                // Remove silently because we're going to update `attrs`
                // later in this method anyway.
                this.removeAttr(selector, { silent: true });
            }
        });

        // Collect new attrs for the new options.
        var offsetY = 0;
        var attrsUpdate = {};
        var questionHeight = this.get('questionHeight');

        options.forEach((option) => {

            var selector = '.option-' + option.id;

            attrsUpdate[selector] = { transform: 'translate(0, ' + offsetY + ')', dynamic: true };
            attrsUpdate[selector + ' .option-rect'] = { height: optionHeight, dynamic: true };
            attrsUpdate[selector + ' .option-text'] = { text: option.text, dynamic: true, transform: `translate(0, ${optionHeight / 2})` };

            offsetY += optionHeight;

            var portY = offsetY - optionHeight / 2 + questionHeight;
            if (!this.getPort(option.id)) {
                this.addPort({ group: 'out', id: option.id, args: { y: portY }});
            } else {
                this.portProp(option.id, 'args/y', portY);
            }
        });

        this.attr(attrsUpdate);
        this.autoresize();
    },

    autoresize: function() {

        var options = this.get('options') || [];
        var gap = this.get('paddingBottom') || 20;
        var height = options.length * this.get('optionHeight') + this.get('questionHeight') + gap;
        var width = joint.util.measureText(this.get('question'), {
            fontSize: this.attr('.question-text/fontSize')
        }).width;
        this.resize(Math.max(this.get('minWidth') || 150, width), height);
    },

    addOption: function(option) {

        var options = JSON.parse(JSON.stringify(this.get('options')));
        options.push(option);
        this.set('options', options);
    },

    removeOption: function(id) {

        var options = JSON.parse(JSON.stringify(this.get('options')));
        this.removePort(id);
        this.set('options', options.filter(function(option) { return option.id !== id; }));
    }
});

joint.shapes.qad.QuestionView = joint.dia.ElementView.extend({

    questionIdCounter: 0,

    events: {
        'click .btn-add-option': 'onAddOption',
        'click .btn-remove-option': 'onRemoveOption'
    },

    presentationAttributes: joint.dia.ElementView.addPresentationAttributes({
        options: ['OPTIONS']
    }),

    confirmUpdate: function(flags) {
        joint.dia.ElementView.prototype.confirmUpdate.apply(this, arguments);
        if (this.hasFlag(flags, 'OPTIONS')) this.renderOptions();
    },

    renderMarkup: function() {

        joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);

        // A holder for all the options.
        this.optionsEl = this.el.querySelector('.options');
        // Create an SVG element representing one option. This element will
        // be cloned in order to create more options.
        this.elOption = V(this.model.optionMarkup);

        this.renderOptions();
    },

    renderOptions: function() {

        this.optionsEl.replaceChildren();

        const options = this.model.get('options') || [];
        options.forEach((option, index) => {

            var className = 'option-' + option.id;
            var elOption = this.elOption.clone().addClass(className);
            elOption.attr('option-id', option.id);
            this.optionsEl.appendChild(elOption.node);

        });

        // Apply `attrs` to the newly created SVG elements.
        this.update();
    },

    onAddOption: function() {

        this.model.addOption({
            id: `option-${this.questionIdCounter++}`,
            text: 'Option ' + this.model.get('options').length
        });
    },

    onRemoveOption: function(evt) {

        this.model.removeOption(V(evt.target.parentNode).attr('option-id'));
    }
});

// Utils

joint.util.measureText = function(text, attrs) {

    var fontSize = parseInt(attrs.fontSize, 10) || 10;

    var svgDocument = V('svg').node;
    var textElement = V('<text><tspan></tspan></text>').node;
    var textSpan = textElement.firstChild;
    var textNode = document.createTextNode('');

    textSpan.appendChild(textNode);
    svgDocument.appendChild(textElement);
    document.body.appendChild(svgDocument);

    var lines = text.split('\n');
    var width = 0;

    // Find the longest line width.
    lines.forEach(function(line) {

        textNode.data = line;
        var lineWidth = textSpan.getComputedTextLength();

        width = Math.max(width, lineWidth);
    });

    var height = lines.length * (fontSize * 1.2);

    V(svgDocument).remove();

    return { width: width, height: height };
};
