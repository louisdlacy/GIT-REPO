"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
class PagerUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.showView = new ui_1.Binding(false);
        // Field variable for current page index
        this._currentPageIndex = 0;
        // Binding that reflects the field variable
        this.currentPageIndex = new ui_1.Binding(this._currentPageIndex);
        // Array of page content (could be replaced with actual content)
        this.pages = [
            { title: "Page 1", content: "This is the first page content" },
            { title: "Page 2", content: "This is the second page content" },
            { title: "Page 3", content: "This is the third page content" },
            { title: "Page 4", content: "This is the fourth page content" }
        ];
    }
    // Methods to navigate between pages
    goToNextPage() {
        if (this._currentPageIndex < this.pages.length - 1) {
            this._currentPageIndex++;
            this.currentPageIndex.set(this._currentPageIndex);
        }
    }
    goToPreviousPage() {
        if (this._currentPageIndex > 0) {
            this._currentPageIndex--;
            this.currentPageIndex.set(this._currentPageIndex);
        }
    }
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                ui_1.UINode.if(this.showView, this.pagerView(), this.openButtonView())
            ],
            style: {
                flex: 1
            }
        });
    }
    openButtonView() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Pressable)({
                    children: (0, ui_1.Text)({
                        text: "Click here to open",
                        style: {
                            color: 'black',
                            textAlign: 'center',
                            padding: 10
                        }
                    }),
                    onClick: () => {
                        this.showView.set(true);
                    },
                    style: {
                        backgroundColor: core_1.Color.green,
                        height: 40,
                        borderRadius: 5
                    }
                })
            ],
            style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }
        });
    }
    pagerView() {
        // Container for the pager
        return (0, ui_1.View)({
            style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            },
            children: [
                (0, ui_1.View)({
                    style: {
                        width: '50%',
                        height: '50%',
                        backgroundColor: core_1.Color.white,
                        padding: 20,
                    },
                    children: [
                        // Title section
                        (0, ui_1.View)({
                            style: {
                                marginBottom: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            },
                            children: [
                                (0, ui_1.Text)({
                                    text: "Pager Component",
                                    style: {
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        color: core_1.Color.black
                                    }
                                }),
                                (0, ui_1.Pressable)({
                                    children: (0, ui_1.Text)({
                                        text: "Close",
                                        style: {
                                            color: 'black',
                                            textAlign: 'center',
                                            padding: 10
                                        }
                                    }),
                                    onClick: () => {
                                        this.showView.set(false);
                                    },
                                    style: {
                                        backgroundColor: core_1.Color.red,
                                        width: 120,
                                        height: 40,
                                        borderRadius: 5
                                    }
                                })
                            ]
                        }),
                        // Current page content
                        (0, ui_1.View)({
                            style: {
                                flex: 1,
                                backgroundColor: new core_1.Color(0.95, 0.95, 0.95),
                                padding: 20,
                                borderRadius: 10,
                                marginBottom: 20
                            },
                            children: [
                                // Page title
                                (0, ui_1.Text)({
                                    text: this.currentPageIndex.derive((index) => {
                                        return this.pages[index].title;
                                    }),
                                    style: {
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginBottom: 10,
                                        color: core_1.Color.black
                                    }
                                }),
                                // Page content
                                (0, ui_1.Text)({
                                    text: this.currentPageIndex.derive((index) => {
                                        return this.pages[index].content;
                                    }),
                                    style: {
                                        color: core_1.Color.black
                                    }
                                }),
                            ]
                        }),
                        // Navigation controls
                        (0, ui_1.View)({
                            style: {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            },
                            children: [
                                // Previous button
                                (0, ui_1.Pressable)({
                                    children: (0, ui_1.Text)({
                                        text: "< Previous",
                                        style: {
                                            color: 'black',
                                            textAlign: 'center',
                                            padding: 10
                                        }
                                    }),
                                    onClick: () => {
                                        this.goToPreviousPage();
                                    },
                                    style: {
                                        backgroundColor: this.currentPageIndex.derive((index) => {
                                            return index > 0 ? core_1.Color.green : new core_1.Color(0.8, 0.8, 0.8);
                                        }),
                                        width: 120,
                                        height: 40,
                                        borderRadius: 5
                                    }
                                }),
                                // Page indicator
                                (0, ui_1.Text)({
                                    text: this.currentPageIndex.derive((index) => {
                                        return `${index + 1}/${this.pages.length}`;
                                    }),
                                    style: {
                                        color: 'black',
                                        fontSize: 18,
                                        fontWeight: 'bold'
                                    }
                                }),
                                // Next button
                                (0, ui_1.Pressable)({
                                    children: (0, ui_1.Text)({
                                        text: "Next >",
                                        style: {
                                            color: 'black',
                                            textAlign: 'center',
                                            padding: 10
                                        }
                                    }),
                                    onClick: () => {
                                        this.goToNextPage();
                                    },
                                    style: {
                                        backgroundColor: this.currentPageIndex.derive((index) => {
                                            return index < this.pages.length - 1 ? core_1.Color.green : new core_1.Color(0.8, 0.8, 0.8);
                                        }),
                                        width: 120,
                                        height: 40,
                                        borderRadius: 5
                                    }
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    }
}
ui_1.UIComponent.register(PagerUI);
