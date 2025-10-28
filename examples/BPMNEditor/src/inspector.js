/*! JointJS+ v4.1.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2025 client IO

 2025-10-28 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


(function(bpmn2) {

    function getOptions(icons) {
        return Object.keys(icons).map(function(icon) {
            return { value: icon, content: icon }
        });
    }

    var labelInputs = {
        '0/attrs/label/text': {
            type: 'text',
            label: 'Label',
            group: 'general'
        }
    };

    window.inputs = {

        'bpmn2.Gateway': {
            attrs: {
                'icon/iconType': {
                    type: 'select',
                    options: getOptions(bpmn2.Gateway.GATEWAY_ICONS),
                    label: 'Type',
                    group: 'general',
                    index: 2
                },
                'label/text': {
                    type: 'textarea',
                    label: 'Name',
                    group: 'general',
                    index: 1
                },
                'body/fill': {
                    type: 'color',
                    label: 'Body Color',
                    group: 'appearance',
                    index: 1
                },
                'body/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 2
                },
                'icon/iconColor': {
                    type: 'color',
                    label: 'Icon Color',
                    group: 'appearance',
                    index: 3
                }
            }
        },

        'bpmn2.Activity': {
            attrs: {
                'border/borderType': {
                    type: 'select',
                    options: [{
                        value: 'single', content: 'Task'
                    }, {
                        value: 'double', content: 'Transaction'
                    }, {
                        value:  'thick', content: 'Call Activity'
                    }],
                    group: 'general',
                    label: 'Type',
                    index: 2
                },
                'border/borderStyle': {
                    type: 'select',
                    options: [{
                        value: 'solid', content: 'No'
                    }, {
                        value: 'dotted', content: 'Yes'
                    }],
                    group: 'general',
                    label: 'Sub-Process',
                    index: 2
                },
                'icon/iconType': {
                    type: 'select',
                    options: getOptions(bpmn2.Activity.ACTIVITY_TYPE_ICONS),
                    label: 'Icon',
                    group: 'general',
                    index: 3
                },
                'markers/iconTypes': {
                    type: 'select',
                    multiple: true,
                    overwrite: true,
                    options: getOptions(bpmn2.Activity.ACTIVITY_MARKER_ICONS),
                    label: 'Markers',
                    group: 'general',
                    index: 3
                },
                'label/text': {
                    type: 'textarea',
                    label: 'Content',
                    group: 'general',
                    index: 1
                },
                'background/fill': {
                    type: 'color',
                    label: 'Body Color',
                    group: 'appearance',
                    index: 1
                },
                'border/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 2
                },
                'icon/iconColor': {
                    type: 'color',
                    label: 'Type Color',
                    group: 'appearance',
                    index: 3
                },
                'markers/iconColor': {
                    type: 'color',
                    label: 'Markers Color',
                    group: 'appearance',
                    index: 4
                }
            }
        },

        'bpmn2.Event': {
            attrs: {
                'icon/iconType': {
                    type: 'select',
                    options: getOptions(bpmn2.Event.EVENT_ICONS),
                    label: 'Icon',
                    group: 'general',
                    index: 3
                },
                'border/borderType': {
                    type: 'select',
                    options: [{
                        value: 'single', content: 'Start'
                    }, {
                        value: 'double', content: 'Intermediate'
                    }, {
                        value: 'thick', content: 'End'
                    }],
                    group: 'general',
                    label: 'Type',
                    index: 2
                },
                'border/borderStyle': {
                    type: 'select',
                    options: [{
                        value: 'solid', content: 'Yes'
                    }, {
                        value: 'dashed', content: 'No'
                    }],
                    group: 'general',
                    label: 'Interrupting',
                    index: 2
                },
                'label/text': {
                    type: 'textarea',
                    label: 'Name',
                    group: 'general',
                    index: 1
                },
                'background/fill': {
                    type: 'color',
                    label: 'Body Color',
                    group: 'appearance',
                    index: 1
                },
                'border/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 2
                },
                'icon/iconColor': {
                    type: 'color',
                    label: 'Icon Color',
                    group: 'appearance',
                    index: 3
                }
            }
        },

        'bpmn2.Annotation': {
            attrs: {
                'label/text': {
                    type: 'textarea',
                    label: 'Content',
                    group: 'general',
                    index: 1
                },
                'body/fill': {
                    type: 'color',
                    label: 'Body Color',
                    group: 'appearance',
                    index: 1
                },
                'border/stroke': {
                    type: 'color',
                    label: 'Border Color',
                    group: 'appearance',
                    index: 2
                }
            }
        },

        'bpmn2.Group': {
            attrs: {
                'label/text': {
                    type: 'textarea',
                    label: 'Name',
                    group: 'general',
                    index: 1
                },
                'body/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 1
                }
            }
        },

        'bpmn2.Conversation': {
            attrs: {
                'body/strokeWidth': {
                    type: 'select',
                    options: [{
                        value: 2, content: 'No'
                    }, {
                        value: 5, content: 'Yes'
                    }],
                    group: 'general',
                    label: 'Call',
                    index: 2
                },
                'markers/iconTypes': {
                    type: 'select',
                    multiple: true,
                    overwrite: true,
                    options: getOptions(bpmn2.Conversation.CONVERSATION_MARKER_ICONS),
                    label: 'Markers',
                    group: 'general',
                    index: 3
                },
                'label/text': {
                    type: 'textarea',
                    label: 'Name',
                    group: 'general',
                    index: 1
                },
                'body/fill': {
                    type: 'color',
                    label: 'Body Color',
                    group: 'appearance',
                    index: 1
                },
                'body/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 2
                }
            }
        },

        'bpmn2.DataObject': {
            attrs: {
                'label/text': {
                    type: 'textarea',
                    label: 'Name',
                    group: 'general',
                    index: 1
                },
                'dataTypeIcon/iconType': {
                    type: 'select',
                    options: getOptions(bpmn2.DataObject.DATA_OBJECT_TYPE_ICONS),
                    label: 'Type',
                    group: 'general',
                    index: 3
                },
                'collectionIcon/collection': {
                    type: 'toggle',
                    label: 'Collection',
                    group: 'general',
                    index: 3
                },
                'body/fill': {
                    type: 'color',
                    label: 'Body Color',
                    group: 'appearance',
                    index: 1
                },
                'body/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 2
                },
                'dataTypeIcon/iconColor': {
                    type: 'color',
                    label: 'Type Color',
                    group: 'appearance',
                    index: 3
                },
                'collectionIcon/iconColor': {
                    type: 'color',
                    label: 'Collection Color',
                    group: 'appearance',
                    index: 4
                }
            }
        },

        'bpmn2.DataStore': {
            attrs: {
                'label/text': {
                    type: 'textarea',
                    label: 'Name',
                    group: 'general',
                    index: 1
                },
                'body/fill': {
                    type: 'color',
                    label: 'Body Color',
                    group: 'appearance',
                    index: 1
                },
                'body/stroke': {
                    type: 'color',
                    label: 'Body Line Color',
                    group: 'appearance',
                    index: 2
                },
                'top/fill': {
                    type: 'color',
                    label: 'Top Color',
                    group: 'appearance',
                    index: 3
                },
                'top/stroke': {
                    type: 'color',
                    label: 'Top Line Color',
                    group: 'appearance',
                    index: 4
                }
            }
        },

        // BPMN Legacy

        'bpmn2.HeaderedPool': {
            lanes: {
                type: 'list',
                group: 'general',
                index: 3,
                min: 1,
                item: {
                    type: 'object',
                    properties: {
                        label: {
                            type: 'text',
                            label: 'Label',
                            defaultValue: 'Lane'
                        },
                        size: {
                            type: 'number',
                            label: 'Size',
                            defaultValue: 100,
                            attrs: {
                                label: {
                                    style: 'margin-right:4px;margin-top:20px;'
                                },
                                input: {
                                    style: 'width:216px;'
                                }
                            },
                        },
                        headerSize: {
                            type: 'number',
                            label: 'Header Size',
                            defaultValue: 20,
                            attrs: {
                                label: {
                                    style: 'text-align:end;margin-right:4px;margin-top:16px;'
                                },
                                input: {
                                    style: 'width:163px;'
                                }
                            },
                        },
                        sublanes: {
                            type: 'list',
                            label: 'Add lanes',
                            item: {
                                type: 'object',
                                properties: {
                                    label: {
                                        type: 'text',
                                        label: 'Label',
                                        defaultValue: 'Sublane'
                                    },
                                    size: {
                                        type: 'number',
                                        label: 'Size',
                                        defaultValue: 60,
                                        attrs: {
                                            label: {
                                                style: 'margin-right:4px;margin-top:20px;'
                                            },
                                            input: {
                                                style: 'width:216px;'
                                            }
                                        },
                                    },
                                    headerSize: {
                                        type: 'number',
                                        label: 'Header Size',
                                        defaultValue: 20,
                                        attrs: {
                                            label: {
                                                style: 'text-align:end;margin-right:4px;margin-top:16px;'
                                            },
                                            input: {
                                                style: 'width:163px;'
                                            }
                                        },
                                    },
                                    sublanes: {
                                        type: 'list',
                                        label: 'Add sublanes',
                                        item: {
                                            type: 'object',
                                            properties: {
                                                label: {
                                                    type: 'text',
                                                    label: 'Label',
                                                    defaultValue: 'Sublane'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                }
            },
            milestones: {
                type: 'list',
                group: 'general',
                index: 5,
                attrs: {
                },
                item: {
                    type: 'object',
                    properties: {
                        label: {
                            type: 'text',
                            label: 'Label'
                        },
                        size: {
                            type: 'number',
                            label: 'Size',
                            defaultValue: 510,
                            attrs: {
                                label: {
                                    style: 'margin-right:20px;margin-top:20px;'
                                }
                            },
                        }
                    }
                }
            },
            milestonesSize: {
                type: 'number',
                label: 'Milestones height',
                attrs: {
                    label: {
                        style: 'width:50px;'
                    }
                },
                group: 'defaults',
                index: 1
            },
            headerSize: {
                type: 'number',
                label: 'Lane Header Size',
                attrs: {
                    label: {
                        style: 'width:90px;'
                    }
                },
                group: 'defaults',
                index: 2
            },
            attrs: {
                'headerLabel/text': {
                    type: 'text',
                    label: 'Header label',
                    attrs: {
                        label: {
                            style: 'width:55px;margin-top:1px;'
                        },
                        input: {
                            style: 'width:230px;'
                        }
                    },
                    group: 'general',
                    index: 1
                },
                'laneLabels/labelAlignment': {
                    type: 'select',
                    options: [{
                        value: 'left-top', content: 'Top left'
                    }, {
                        value: 'top', content: 'Top'
                    }, {
                        value: 'right-top', content: 'Top right'
                    }, {
                        value: 'left', content: 'Left'
                    }, {
                        value: 'center', content: 'Middle'
                    }, {
                        value: 'right', content: 'Right'
                    }, {
                        value: 'left-bottom', content: 'Bottom left'
                    }, {
                        value: 'bottom', content: 'Bottom'
                    }, {
                        value: 'right-bottom', content: 'Bottom right'
                    }],
                    group: 'general',
                    label: 'Lane label alignment',
                    attrs: {
                        label: {
                            style: 'width:100px;'
                        },
                        select: {
                            style: 'margin-top:5px;width:220px;'
                        }
                    },
                    index: 2
                },
                'milestoneLabels/labelAlignment': {
                    type: 'select',
                    options: [{
                        value: 'left-top', content: 'Top left'
                    }, {
                        value: 'top', content: 'Top'
                    }, {
                        value: 'right-top', content: 'Top right'
                    }, {
                        value: 'left', content: 'Left'
                    }, {
                        value: 'center', content: 'Middle'
                    }, {
                        value: 'right', content: 'Right'
                    }, {
                        value: 'left-bottom', content: 'Bottom left'
                    }, {
                        value: 'bottom', content: 'Bottom'
                    }, {
                        value: 'right-bottom', content: 'Bottom right'
                    }],
                    group: 'general',
                    label: 'Milestone label alignment',
                    attrs: {
                        label: {
                            style: 'width:100px;'
                        },
                        select: {
                            style: 'margin-top:5px;width:220px;'
                        }
                    },
                    index: 4
                },
                'header/fill': {
                    type: 'color',
                    label: 'Header Color',
                    group: 'appearance',
                    index: 1
                },
                'header/stroke': {
                    type: 'color',
                    label: 'Header stroke color',
                    group: 'appearance',
                    index: 2
                },
                'headerLabel/fill': {
                    type: 'color',
                    label: 'Header label color',
                    group: 'appearance',
                    index: 3
                },
                'lanes/fill': {
                    type: 'color',
                    label: 'Lane Body Color',
                    group: 'appearance',
                    index: 4
                },
                'lanes/stroke': {
                    type: 'color',
                    label: 'Lane Stroke Color',
                    group: 'appearance',
                    index: 5
                },
                'laneHeaders/fill': {
                    type: 'color',
                    label: 'Lane Header Color',
                    group: 'appearance',
                    index: 6
                },
                'laneHeaders/stroke': {
                    type: 'color',
                    label: 'Lane Header Stroke',
                    group: 'appearance',
                    index: 7
                },
                'laneLabels/fill': {
                    type: 'color',
                    label: 'Lane Label Color',
                    group: 'appearance',
                    index: 8
                },
                'milestoneHeaders/fill': {
                    type: 'color',
                    label: 'Milestone Header Fill',
                    group: 'appearance',
                    index: 9
                },
                'milestoneHeaders/stroke': {
                    type: 'color',
                    label: 'Milestone Stroke',
                    group: 'appearance',
                    index: 10
                },
                'milestoneLabels/fill': {
                    type: 'color',
                    label: 'Milestone Label Color',
                    group: 'appearance',
                    index: 11
                },
                'milestoneLines/stroke': {
                    type: 'color',
                    label: 'Milestone Line Color',
                    group: 'appearance',
                    index: 12
                }
            }
        },

        'bpmn2.Choreography': {
            participants: {
                type: 'list',
                label: 'Participants',
                item: {
                    type: 'text'
                },
                group: 'general',
                index: 1
            },
            initiatingParticipant: {
                type: 'select',
                label: 'Initiating Participant',
                options: 'participants',
                group: 'general',
                index: 2
            },
            subProcess: {
                type: 'toggle',
                label: 'Sub-process',
                group: 'general',
                index: 3
            },
            attrs: {
                'content/html': {
                    type: 'textarea',
                    label: 'Content',
                    group: 'general',
                    index: 4
                },
                'body/fill': {
                    type: 'color',
                    label: 'Primary Color',
                    group: 'appearance',
                    index: 1
                },
                'participantsBodies/fill': {
                    type: 'color',
                    label: 'Secondary Color',
                    group: 'appearance',
                    index: 2
                }
            }
        },

        'bpmn2.Flow': {
            attrs: {
                'line/flowType': {
                    type: 'select',
                    options: ['sequence', 'default', 'conditional', 'message'],
                    label: 'Type',
                    group: 'general',
                    index: 1
                },
                'line/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 1
                }
            },
            labels: labelInputs
        },

        'bpmn2.DataAssociation': {
            attrs: {
                'line/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 1
                }
            },
            labels: labelInputs
        },

        'bpmn2.AnnotationLink': {
            attrs: {
                'line/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 1
                }
            },
            labels: labelInputs
        },

        'bpmn2.ConversationLink': {
            attrs: {
                'line/stroke': {
                    type: 'color',
                    label: 'Line Color',
                    group: 'appearance',
                    index: 1
                },
                'outline/stroke': {
                    type: 'color',
                    label: 'Outline Color',
                    group: 'appearance',
                    index: 2
                }
            },
            labels: labelInputs
        },

    };

})(joint.shapes.bpmn2);

