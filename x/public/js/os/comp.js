OS.$Component.Wrapper = (function() {
    const Style = /*css*/ `
        :host {
            width: 100%; 
            display: block;
            min-height: 100dvh;
            ($ if @props.closed $)
                height: 100dvh;
                overflow: hidden;
            ($ endif $)
        }

        ($ if @props.closed && @state.screen $)
            @media (min-width: 1024px) {
                :host {
                    height: unset;
                    overflow: unset;
                }
            }
        ($ endif $)
    `;

    const Template = /*html*/ `
        <slot />
    `;

    return OS.$Component({
        tag: OS.$Selectors.Wrapper,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["closed"],
        props: {
            closed: false,
        },
        state: {
            screen: true,
            scroll: 0,
        },
        rules: {
            toggle() {
                const all_tags = [OS.$Selectors.Fixedbar, OS.$Selectors.Datatable, OS.$Selectors.Sidebar, OS.$Selectors.Modal, OS.$Selectors.Select, OS.$Selectors.Date, OS.$Selectors.Time, OS.$Selectors.Dropdown],
                    unq_tags = [OS.$Selectors.Modal, OS.$Selectors.Fixedbar, OS.$Selectors.Sidebar],
                    elements = [];

                document.querySelectorAll(all_tags.join(", ")).forEach((element) => {
                    element.state.show && elements.push(element);
                });

                if (elements.length) {
                    this.state.screen = !elements.some(element => {
                        if (element.tagName.toLowerCase() === OS.$Selectors.Sidebar) {
                            return unq_tags.includes(element.tagName.toLowerCase()) && element.fixed;
                        }
                        return unq_tags.includes(element.tagName.toLowerCase())
                    });
                    document.documentElement.style.scrollBehavior = "unset";
                    this.state.scroll = window.scrollY;
                    this.props.closed = true;
                    this.scroll(0, this.state.scroll);
                } else {
                    this.state.screen = true;
                    this.props.closed = false;
                    window.scroll(0, this.state.scroll);
                    document.documentElement.style.scrollBehavior = "";
                }
            },
        },
        setup: {
            created() {
                OS.$Wrapper = this;
            },
            updated(name, oldValue, newValue, type) {
                if (type === "props")
                    switch (name) {
                        case "closed":
                            this.props[name] = this.truty(newValue);
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["closed"]);
                    switch (name) {
                        case "closed":
                            this.emit("change:" + name, { data: newValue });
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Toaster = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }   

        :host {
            inset: 0;
            width: 100%; 
            height: 100dvh;
            position: fixed;
            pointer-events: none;
            z-index: {{ @state.layer }};
        }

        [part="wrapper"] {
            gap: .5rem;
            width: 100%;
            height: 100%;
            margin: auto;
            padding: 1rem;
            display: flex;
            overflow: hidden;
            align-items: {{ @props.horisontal }};
            justify-content: {{ @props.vertical }};
            ($ if @props.vertical === "start" $)
                flex-direction: column-reverse;
            ($ else $)
                flex-direction: column;
            ($ endif $)
        }

        @media (min-width: 640px) {
            [part="wrapper"] {
                max-width: 640px;
            }
        }

        @media (min-width: 768px) {
            [part="wrapper"] {
                max-width: 768px;
            }
        }

        @media (min-width: 1024px) {
            [part="wrapper"] {
                max-width: 1024px;
            }
        }

        @media (min-width: 1280px) {
            [part="wrapper"] {
                max-width: 1280px;
            }
        }

        @media (min-width: 1536px) {
            [part="wrapper"] {
                max-width: 1536px;
            }
        }
    `;

    const Template = /*html*/ `
        <div ref="wrapper" part="wrapper">
            <slot />
        </div>
    `;

    return OS.$Component({
        tag: OS.$Selectors.Toaster,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["horisontal", "vertical"],
        props: {
            horisontal: "center",
            vertical: "end"
        },
        state: {
            layer: OS.$Theme.Layer(),
        },
        rules: {
            layer() {
                const layer = OS.$Theme.Layer();
                if (this.state.layer !== layer - 1) this.state.layer = layer;
            },
        },
        setup: {
            created() {
                OS.$Toaster = this;
                this.Toast = (content, theme, timer) => {
                    const _toast = document.createElement(OS.$Selectors.Toast);
                    timer && (_toast.props.timer = timer);
                    _toast.innerHTML = content;
                    _toast.props.theme = theme;
                    this.appendChild(_toast);
                };
            },
            mounted() {
                document.addEventListener("DOMSubtreeModified", this.rules.layer);
            },
            removed() {
                document.removeEventListener("DOMSubtreeModified", this.rules.layer);
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "vertical":
                        case "horisontal":
                            this.props[name] = newValue;
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["horisontal", "vertical"]);
                    switch (name) {
                        case "vertical":
                        case "horisontal":
                            this.emit("change:" + name, { data: newValue });
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Toast = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }

        @keyframes slide-up-off {
            0% { opacity: 1; transform: translateY(0px); }
            100% { opacity: 0; transform: translateY(40px); }
        }

        @keyframes slide-down-off {
            0% { opacity: 1; transform: translateY(0px); }
            100% { opacity: 0; transform: translateY(-40px); }
        }

        @keyframes slide-up-on {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0px); }
        }

        @keyframes slide-down-on {
            0% { opacity: 0; transform: translateY(-40px); }
            100% { opacity: 1; transform: translateY(0px); }
        }

        :host {
            width: 100%;
            display: block;
            font-weight: 600;
            pointer-events: all;
            padding: .75rem 1rem;
            border-radius: .25rem;
            color: {{ @theme.colors("OS-WHITE") }};
            font-size: {{  @theme.fonts.sizes("BASE") }};
            line-height: {{  @theme.fonts.lines("BASE") }};
            box-shadow: {{ @theme.colors("OS-BLACK", 20) }} 0px 2px 12px;
            background: var(--{{ @props.theme || "x" }}, {{ @theme.colors("OS-BLACK") }});
            animation: {{ (@state.position === "start" ? "slide-down" : "slide-up") + "-" + (@state.flip ? "off" : "on") }} 200ms ease-in-out forwards;

            --info: {{ @theme.colors("BLUE", 500) }};
            --error: {{ @theme.colors("RED", 500) }};
            --success: {{ @theme.colors("GREEN", 500) }};
            --warning: {{ @theme.colors("YELLOW", 500) }};
        }

        @media (min-width: 1024px) {
            :host {
                min-width: 200px; 
                max-width: 500px;
                width: max-content;
            }
        }
    `;

    const Template = /*html*/ `
        <slot name="start" />
        <slot />
        <slot name="end" />
    `;

    return OS.$Component({
        tag: OS.$Selectors.Toast,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["theme", "timer"],
        props: {
            theme: "",
            timer: 5000,
        },
        state: {
            position: "end",
            flip: false,
        },
        setup: {
            created() {
                if (OS.$Toaster) {
                    this.state.position = OS.$Toaster.props.vertical;
                }
            },
            mounted() {
                setTimeout(() => {
                    this.state.flip = true;
                    setTimeout(() => {
                        this.remove();
                    }, 250);
                }, this.props.timer);
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "theme":
                            this.props[name] = newValue
                            break;
                        case "timer":
                            this.props[name] = +newValue || 5000
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["theme", "timer"]);
                    switch (name) {
                        case "theme":
                        case "timer":
                            this.emit("change:" + name, { data: newValue });
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Topbar = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }

        :host {
            width: 100%;
            display: block;
            ($ if !@props.transparent $)
                background: {{ @theme.colors("OS-PRIME") }};
            ($ endif $)
            ($ if @props.fixed $)
                top: 0;
                position: sticky;
                z-index: {{ @theme.layer() }};
            ($ endif $)
        }

        [part="content"] {
            gap: 1rem;
            width: 100%;
            display: flex;
            margin: 0 auto;
            align-items: center;
            padding: .75rem 1rem;
            justify-content: {{ @props.align }};
        }

        @media (min-width: 640px) {
            [part="content"] {
                max-width: 640px;
            }
        }

        @media (min-width: 768px) {
            [part="content"] {
                max-width: 768px;
            }
        }

        @media (min-width: 1024px) {
            [part="content"] {
                max-width: 1024px;
            }
        }

        @media (min-width: 1280px) {
            [part="content"] {
                max-width: 1280px;
            }
        }

        @media (min-width: 1536px) {
            [part="content"] {
                max-width: 1536px;
            }
        }
    `;

    const Template = /*html*/ `
        <header ref="content" part="content">
            <slot />
        </header>
    `;

    return OS.$Component({
        tag: OS.$Selectors.Topbar,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["fixed", "align", "transparent"],
        props: {
            fixed: false,
            align: "center",
            transparent: false,
        },
        setup: {
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "align":
                            this.props.align = newValue
                            break;
                        case "fixed":
                        case "transparent":
                            this.props[name] = this.truty(newValue);
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["fixed", "align", "transparent", ]);
                    switch (name) {
                        case "fixed":
                        case "align":
                        case "transparent":
                            this.emit("change:" + name, { data: newValue });
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Modal = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }
        
        @keyframes opacity-off {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }

        @keyframes slide-off {
            0% { transform: translateY(0px); }
            100% { transform: translateY(20px); }
        }

        @keyframes opacity-on {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        @keyframes slide-on {
            0% { transform: translateY(20px); }
            100% { transform: translateY(0px); }
        }

        ($ if @state.show $)
            ::-webkit-scrollbar {
                -webkit-appearance: none;
                background: transparent;
                -moz-appearance: none;
                appearance: none;
                height: 5px;
                width: 5px;
            }
            
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            
            ::-webkit-scrollbar-thumb {
                border-radius: 2px; 
                background: {{ @theme.colors("GRAY", 300) }};
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: {{ @theme.colors("GRAY", 400) }};
            }  
        ($ endif $)

        :host {
            inset: 0;
            width: 100%;
            display: flex;
            height: 100dvh;
            position: fixed;
            align-items: end;
            justify-content: center;
            backdrop-filter: blur(5px);
            ($ if !@props.expand $)
                pointer-events: none;
            ($ endif $)
            z-index: {{ @theme.layer() }};
            background: {{ @theme.colors("OS-BLACK", 10) }};
            animation: opacity-{{ @props.expand ? "on" : "off" }} 200ms ease-in-out forwards;
        }

        ($ if @state.show $)
            [part="content"] {
                width: 100%;
                display: flex;
                overflow: hidden;
                max-height: 90dvh; 
                border-radius: .25rem;
                flex-direction: column;
                background: {{ @theme.colors("OS-WHITE") }};
                box-shadow: {{ @theme.colors("OS-BLACK", 20) }} 0px 2px 12px;
                animation: slide-{{ @props.expand ? "on" : "off" }} 200ms ease-in-out forwards;
            }

            ($ if @truty(@props.label, [""]) $)
                [part="label"] {
                    width: 100%;
                    display: block;
                    padding: .65rem;
                    font-weight: 700;
                    text-align: center;
                    border-bottom-width: 1px;
                    border-bottom-style: solid;
                    color: {{ @theme.colors("OS-BLACK") }};
                    font-size: {{  @theme.fonts.sizes("SMALL") }};
                    line-height: {{  @theme.fonts.lines("SMALL") }};
                    border-bottom-color: {{ @theme.colors("OS-SHADE") }};
                }
            ($ endif $)

            [part="items"] {
                flex: 1;
                width: 100%;
                overflow: overlay;
            }
        ($ endif $)

        @media (min-width: 1024px) {    
            :host {
                align-items: center;
                justify-content: center;
            }

            ($ if @state.show $)
                [part="content"] {
                    width: 50%;
                    max-height: 80dvh; 
                }
            ($ endif $)
        }
    `;

    const Template = /*html*/ `
        ($ if @state.show $)
            <div ref="content" part="content" @click:propagation="{{ () => {} }}">
                ($ if @truty(@props.label, [""]) $)
                    <label ref="label" part="label">{{> @props.label }}</label>
                ($ endif $)
                <div ref="items" part="items">
                    <slot />
                </div>
            </div>
        ($ endif $)
    `;

    return OS.$Component({
        tag: OS.$Selectors.Modal,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["label", "expand"],
        props: {
            label: "",
            expand: false,
        },
        state: {
            show: false,
        },
        rules: {
            toggle() {
                this.props.expand = !this.props.expand;
            },
            blur(event) {
                if (!this.root.contains(event.target) && this.props.expand) {
                    this.rules.toggle();
                }
            },
        },
        setup: {
            created() {
                this.show = function() {
                    this.props.expand = true;
                }

                this.hide = function() {
                    this.props.expand = false;
                }

                this.toggle = this.rules.toggle;
            },
            removed() {
                window.removeEventListener("click", this.rules.blur);
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "label":
                            this.props.label = newValue;
                            break;
                        case "expand":
                            this.props.expand = this.truty(newValue);
                            break;
                    }

                if (type === "state")
                    switch (name) {
                        case "show":
                            OS.$Wrapper && OS.$Wrapper.rules.toggle();
                            setTimeout(() => {
                                window[(newValue ? "add" : "remove") + "EventListener"]("click", this.rules.blur);
                            }, 0);
                            this.emit("change:expand", {
                                data: newValue,
                            });
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["label", "expand"]);
                    switch (name) {
                        case "label":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "expand":
                            newValue
                                ?
                                (this.state.show = newValue) :
                                setTimeout(() => {
                                    this.state.show = newValue;
                                }, 250);
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Dropdown = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }
        
        @keyframes opacity-off {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }

        @keyframes slide-off {
            0% { transform: translateY(0px); }
            100% { transform: translateY(20px); }
        }

        @keyframes opacity-on {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        @keyframes slide-on {
            0% { transform: translateY(20px); }
            100% { transform: translateY(0px); }
        }

        ($ if @state.show $)
            ::-webkit-scrollbar {
                -webkit-appearance: none;
                background: transparent;
                -moz-appearance: none;
                appearance: none;
                height: 5px;
                width: 5px;
            }
            
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            
            ::-webkit-scrollbar-thumb {
                border-radius: 2px; 
                background: {{ @theme.colors("GRAY", 300) }};
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: {{ @theme.colors("GRAY", 400) }};
            }
        ($ endif $)  

        :host {
            position: relative;
            display: inline-block;
        }

        ($ if @state.show $)
            [part="modal"] {
                inset: 0;
                width: 100%;
                display: flex;
                height: 100dvh;
                position: fixed;
                align-items: end;
                justify-content: center;
                backdrop-filter: blur(5px);
                ($ if !@props.expand $)
                    pointer-events: none;
                ($ endif $)
                z-index: {{ @theme.layer() }};
                background: {{ @theme.colors("OS-BLACK", 10) }};
                animation: opacity-{{ @props.expand ? "on" : "off" }} 200ms ease-in-out forwards;
            }

            [part="content"] {
                width: 100%;
                outline: none;
                display: flex;
                overflow: hidden;
                max-height: 90dvh; 
                border-radius: .25rem;
                flex-direction: column;
                background: {{ @theme.colors("OS-WHITE") }};
                box-shadow: {{ @theme.colors("OS-BLACK", 20) }} 0px 2px 12px;
                animation: slide-{{ @props.expand ? "on" : "off" }} 200ms ease-in-out forwards;
            }

            ($ if @truty(@props.label, [""]) $)
                [part="label"] {
                    width: 100%;
                    display: block;
                    padding: .65rem;
                    font-weight: 700;
                    text-align: center;
                    border-bottom-width: 1px;
                    border-bottom-style: solid;
                    color: {{ @theme.colors("OS-BLACK") }};
                    font-size: {{  @theme.fonts.sizes("SMALL") }};
                    line-height: {{  @theme.fonts.lines("SMALL") }};
                    border-bottom-color: {{ @theme.colors("OS-SHADE") }};
                }
            ($ endif $)

            [part="items"] {
                flex: 1;
                width: 100%;
                display: flex;
                overflow: overlay;
                flex-direction: column; 
            }

            @media (min-width: 1024px) {
                [part="modal"] {
                    inset: auto;
                    min-width: 200px;
                    max-width: 400px;
                    width: max-content;
                    position: absolute;
                    height: max-content;
                    background: transparent;
                    {{ @state.pos ? "bottom" : "top" }}: 0;
                    ($ if @props.position === "start" $)
                        left: 0;
                    ($ elif @props.position === "end" $)
                        right: 0;
                    ($ else $)
                        left: 50%;
                        transform: translateX(-50%);
                    ($ endif $)
                }

                [part="content"] {
                    max-height: 300px;
                }

                ($ if @truty(@props.label, [""]) $)
                    [part="label"] {
                        display: none;
                    }
                ($ endif $)
            }
        ($ endif $)
    `;

    const Template = /*html*/ `
        <slot name="trigger" />
        ($ if @state.show $)
            <div ref="modal" part="modal">
                <div ref="content" part="content" @click:propagation="{{ () => {} }}">
                    ($ if @truty(@props.label, [""]) $)
                        <label ref="label" part="label">{{> @props.label }}</label>
                    ($ endif $)
                    <div ref="items" part="items">
                        <slot />                   
                    </div>
                </div>
            </div>
        ($ endif $)
    `;

    return OS.$Component({
        tag: OS.$Selectors.Dropdown,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["label", "position"],
        props: {
            position: "center",
            expand: false,
            label: "",
        },
        state: {
            show: false,
            pos: false,
        },
        rules: {
            toggle() {
                this.props.expand = !this.props.expand;
            },
            blur(event) {
                if (!this.root.contains(event.target) && this.props.expand) {
                    this.rules.toggle();
                }
            },
            pos() {
                this.state.show && (this.state.pos = window.innerHeight - this.getBoundingClientRect().top < this.refs.modal.clientHeight);
            },
        },
        setup: {
            created() {
                this.show = function() {
                    this.props.expand = true;
                }

                this.hide = function() {
                    this.props.expand = false;
                }

                this.toggle = this.rules.toggle;
            },
            mounted() {
                window.addEventListener("scroll", this.rules.pos);
                this.querySelector("[slot=trigger]").addEventListener("click", this.rules.toggle);
            },
            removed() {
                window.removeEventListener("click", this.rules.blur);
                window.removeEventListener("scroll", this.rules.pos);
                this.querySelector("[slot=trigger]").removeEventListener("click", this.rules.toggle);
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "label":
                        case "position":
                            this.props[name] = newValue;
                            break;
                    }

                if (type === "state")
                    switch (name) {
                        case "show":
                            OS.$Wrapper && OS.$Wrapper.rules.toggle();
                            setTimeout(() => {
                                window[(newValue ? "add" : "remove") + "EventListener"]("click", this.rules.blur);
                            }, 0);
                            this.emit("change:expand", {
                                data: newValue,
                            });
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["label", "position"]);
                    switch (name) {
                        case "label":
                        case "position":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "expand":
                            newValue
                                ?
                                (this.state.show = newValue, this.rules.pos()) :
                                setTimeout(() => {
                                    this.state.show = newValue;
                                }, 250);
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Sidebar = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }
        
        @keyframes opacity-off {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }

        @keyframes slide-off {
            0% { transform: translateX(0px); }
            100% { transform: translateX({{ @props.position === "end" ? document.documentElement.dir === "rtl" ? -20 : 20 : document.documentElement.dir === "rtl" ? 20 : -20 }}px); }
        }

        @keyframes width-off {
            0% { width: 240px; }
            100% { width: 0; }
        }

        @keyframes opacity-on {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        @keyframes slide-on {
            0% { transform: translateX({{ @props.position === "end" ? document.documentElement.dir === "rtl" ? -20 : 20 : document.documentElement.dir === "rtl" ? 20 : -20 }}px); }
            100% { transform: translateX(0px); }
        }

        @keyframes width-on {
            0% { width: 0; }
            100% { width: 240px; }
        }

        ($ if @state.show $)
            ::-webkit-scrollbar {
                -webkit-appearance: none;
                background: transparent;
                -moz-appearance: none;
                appearance: none;
                height: 5px;
                width: 5px;
            }
            
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            
            ::-webkit-scrollbar-thumb {
                border-radius: 2px; 
                background: {{ @theme.colors("GRAY", 300) }};
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: {{ @theme.colors("GRAY", 400) }};
            }  
        ($ endif $)

        :host {
            inset: 0;
            width: 100%;
            display: flex;
            height: 100dvh;
            position: fixed;
            backdrop-filter: blur(5px);
            ($ if !@props.expand $)
                pointer-events: none;
            ($ endif $)
            z-index: {{ @theme.layer() }};
            justify-content: {{ @props.position }};
            background: {{ @theme.colors("OS-BLACK", 10) }};
            animation: opacity-{{ @props.expand ? "on" : "off" }} 200ms ease-in-out forwards;
        }

        ($ if @state.show $)
            [part="target"] {
                width: 0;
                height: 0;
                opacity: 0;
                left: -9999px;
                right: -9999px;
                display: block;
                position: fixed;
            }

            [part="content"] {
                height: 100%; 
                width: 240px;
                display: flex;
                max-width: 240px;
                overflow: overlay;
                min-width: max-content;
                flex-direction: column; 
                background: {{ @theme.colors("OS-WHITE") }};
                box-shadow: {{ @theme.colors("OS-BLACK", 20) }} 0px 2px 12px;
                animation: slide-{{ @props.expand ? "on" : "off" }} 200ms ease-in-out forwards;
            }
        ($ endif $)

        ($ if !@props.fixed $)
            @media (min-width: 1024px) {
                :host {
                    z-index: 0;
                    width: 240px;
                    position: sticky;
                    animation: opacity-{{ @props.expand ? "on" : "off" }} 200ms ease-in-out forwards,
                        width-{{ @props.expand ? "on" : "off" }} 200ms ease-in-out forwards;
                }

                [part="content"] {
                    width: 100%;
                    max-width: 100%;
                }
            }  
        ($ endif $)
    `;

    const Template = /*html*/ `
        ($ if @state.show $)
            <div ref="content" part="content" @click:propagation="{{ () => {} }}">
                <a href="#" ref="target" part="target" />
                <slot />
            </div>
        ($ endif $)
    `;

    return OS.$Component({
        tag: OS.$Selectors.Sidebar,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["position", "fixed"],
        props: {
            position: "start",
            fixed: false,
            expand: true,
        },
        state: {
            show: true,
        },
        rules: {
            toggle() {
                this.props.expand = !this.props.expand;
            },
            blur(event) {
                if (!this.root.contains(event.target) && this.props.expand) {
                    this.rules.toggle();
                }
            },
            resize() {
                if (!matchMedia("(min-width: 1024px)").matches) this.hide();
            }
        },
        setup: {
            created() {
                this.show = function() {
                    this.props.expand = true;
                }

                this.hide = function() {
                    this.props.expand = false;
                }

                this.toggle = this.rules.toggle;
            },
            mounted() {
                this.rules.resize();
                if (!this.hasAttribute("position"))
                    this.props.position = document.documentElement.position;

                if (this.hasAttribute("fixed")) this.hide();
                else window.addEventListener("resize", this.rules.resize);
            },
            removed() {
                window.removeEventListener("click", this.rules.blur);
                window.removeEventListener("resize", this.rules.resize);
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "position":
                            this.props.position = newValue;
                            break;
                        case "fixed":
                            this.props.fixed = this.truty(newValue);
                            break;
                    }

                if (type === "state")
                    switch (name) {
                        case "show":
                            OS.$Wrapper && OS.$Wrapper.rules.toggle();
                            newValue && this.refs.target.focus();
                            setTimeout(() => {
                                if (!newValue) window.removeEventListener("click", this.rules.blur);
                                else {
                                    if (this.props.fixed || !matchMedia("(min-width: 1024px)").matches) window.addEventListener("click", this.rules.blur);
                                }
                            }, 0);
                            this.emit("change:expand", { data: newValue, });
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["position", "fixed"]);
                    switch (name) {
                        case "fixed":
                            window[(newValue ? "remove" : "add") + "EventListener"]("resize", this.rules.resize)
                            break;
                        case "expand":
                            newValue
                                ?
                                (this.state.show = newValue) :
                                setTimeout(() => {
                                    this.state.show = newValue;
                                }, 250);
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Datatable = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }

        @keyframes opacity-off {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }

        @keyframes slide-off {
            0% { transform: translateY(0px); }
            100% { transform: translateY(20px); }
        }

        @keyframes opacity-on {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        @keyframes slide-on {
            0% { transform: translateY(20px); }
            100% { transform: translateY(0px); }
        }

        :host {
            width: 100%;
            display: block;
        }

        ($ if @truty(@props.title, [""]) || @props.print || @props.search || @props.filter || @props.download || @this.querySelector("[slot=tools-start]") || @this.querySelector("[slot=tools-end]") $)
            [part="topbar"] {
                gap: .5rem;
                width: 100%;
                display: flex;
                margin-bottom: .5rem;
                flex-direction: column;
            }
        ($ endif $)

        ($ if @truty(@props.title, [""]) $)
            [part="title"] {
                margin: 0 auto;
                font-weight: 700;
                font-size: {{  @theme.fonts.sizes("XLARGE") }};
                line-height: {{  @theme.fonts.lines("XLARGE") }};
            }
        ($ endif $)

        ($ if @props.search $)
            [part="search"] {
                width: 100%;
                display: block;
                border-width: 1px;
                border-style: solid;
                padding: .5rem 1rem;
                border-radius: .25rem;
                ($ if @props.search && @state.search $)
                    order: 2;
                ($ endif $)
                color: {{ @theme.colors("OS-BLACK") }};
                background: {{ @theme.colors("OS-LIGHT") }};
                border-color: {{ @theme.colors("OS-SHADE") }};
                font-size: {{  @theme.fonts.sizes("BASE") }};
                line-height: {{  @theme.fonts.lines("BASE") }};
            }
    
            [part="search"]:focus,
            [part="search"]:focus-within {
                outline-width: 1px;
                outline-style: auto;
                outline-color: {{ @theme.colors("OS-PRIME", 400) }};
            }
        ($ endif $)

        ($ if @props.print || @props.search || @props.filter || @props.download || @this.querySelector("[slot=tools-start]") || @this.querySelector("[slot=tools-end]") $)
            [part="tools"] {
                display: flex;
                margin: 0 auto;
                max-width: 100%;
                width: max-content;
            }

            [part="btn"] {
                outline: none;
                border: unset;
                display: block;
                padding: .5rem;
                cursor: pointer;
                border-radius: .25rem;
                background: transparent;
            }

            [part="btn"]:hover,
            [part="btn"]:focus,
            [part="btn"]:focus-within {
                background: {{ @theme.colors("OS-SHADE", 40) }};
            }

            [part="icon"] {
                width: 1.5rem;
                height: 1.5rem;
                display: block;
                pointer-events: none;
                color: {{ @theme.colors("OS-BLACK") }};
            }
        ($ endif $)            
        
        ($ if @state.search $)
            [part="btn"][search] [part="icon"] {
                color: {{ @theme.colors("OS-PRIME") }};
            }
        ($ endif $)

        ($ if @props.filter $)
            [part="dropdown"] {
                display: block;
                position: relative;
                width: max-content;
            }
        ($ endif $)

        ::-webkit-scrollbar {
            -webkit-appearance: none;
            background: transparent;
            -moz-appearance: none;
            appearance: none;
            height: 5px;
            width: 5px;
        }
        
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
            border-radius: 2px; 
            background: {{ @theme.colors("GRAY", 300) }};
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: {{ @theme.colors("GRAY", 400) }};
        }

        ($ if @state.show $)
            [part="modal"] {
                inset: 0;
                width: 100%;
                display: flex;
                height: 100dvh;
                position: fixed;
                align-items: end;
                justify-content: center;
                backdrop-filter: blur(5px);
                ($ if !@state.expand $)
                    pointer-events: none;
                ($ endif $)
                z-index: {{ @theme.layer() }};
                background: {{ @theme.colors("OS-BLACK", 10) }};
                animation: opacity-{{ @state.expand ? "on" : "off" }} 200ms ease-in-out forwards;
            }

            [part="content"] {
                width: 100%;
                outline: none;
                display: flex;
                overflow: hidden;
                max-height: 90dvh; 
                border-radius: .25rem;
                flex-direction: column;
                background: {{ @theme.colors("OS-WHITE") }};
                box-shadow: {{ @theme.colors("OS-BLACK", 20) }} 0px 2px 12px;
                animation: slide-{{ @state.expand ? "on" : "off" }} 200ms ease-in-out forwards;
            }

            [part="label"] {
                width: 100%;
                display: block;
                padding: .65rem;
                font-weight: 700;
                text-align: center;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                color: {{ @theme.colors("OS-BLACK") }};
                font-size: {{  @theme.fonts.sizes("SMALL") }};
                line-height: {{  @theme.fonts.lines("SMALL") }};
                border-bottom-color: {{ @theme.colors("OS-SHADE") }};
            }

            [part="items"] {
                flex: 1;
                width: 100%;
                display: flex;
                padding: 1rem;
                overflow: overlay;
                flex-direction: column; 
            }

            [part="item"] {
                gap: .5rem;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
            }

            [part="checkbox"] {
                width: 1.2rem;
                height: 1.2rem;
                border-width: 1px;
                border-style: solid;
                border-radius: .25rem; 
                accent-color: {{ @theme.colors("OS-PRIME") }};
                border-color: {{ @theme.colors("OS-BLACK") }};
            }

            [part="checkbox"]:focus,
            [part="checkbox"]:focus-within {
                outline-width: 1px;
                outline-style: solid;
                outline-color: {{ @theme.colors("OS-PRIME") }};
            }

            [part="text"] {
                font-weight: 700;
                color: {{  @theme.colors("OS-BLACK") }};
                font-size: {{  @theme.fonts.sizes("BASE") }};
                line-height: {{  @theme.fonts.lines("BASE") }};
            }
        ($ endif $)

        [part="wrapper"] {
            width: 100%;
            overflow-x: auto;
            border-width: 1px;
            border-style: solid;
            border-radius: .25rem; 
            background: {{ @theme.colors("OS-WHITE") }};
            border-color: {{ @theme.colors("OS-SHADE") }};
        }

        [part="table"] {
            min-width: 100%;
            width: max-content;
            border-collapse: collapse;
        }

        [part="table-head-col"],
        [part="table-body-col"],
        [part="table-empty-col"] {
            padding: .5rem 1rem;
            color: {{ @theme.colors("OS-BLACK") }};
        }

        [part="table-head-col"]:first-of-type,
        [part="table-body-col"]:first-of-type {
            padding-inline-start: 2rem;
        }

        [part="table-head-col"]:last-of-type,
        [part="table-body-col"]:last-of-type {
            padding-inline-end: 2rem;
        }

        [part="table-head-col"] {
            font-weight: 700;
            font-size: {{  @theme.fonts.sizes("SMALL") }};
            line-height: {{  @theme.fonts.lines("SMALL") }};
        }

        [part="table-body-row"] {
            border-top-width: 1px;
            border-top-style: solid;
            border-top-color: {{ @theme.colors("OS-SHADE") }};
        }

        [part="table-body-col"] {
            font-size: {{  @theme.fonts.sizes("BASE") }};
            line-height: {{  @theme.fonts.lines("BASE") }};
        }

        [part="table-empty-col"] {
            font-weight: 700;
            padding: 1rem 2rem;
            font-size: {{  @theme.fonts.sizes("BASE") }};
            line-height: {{  @theme.fonts.lines("BASE") }};
        }

        ($ if @props.print $)
            [part="page"],
            [part="print"] {
                display: none;
            }
        ($ endif $)

        ($ if @props.download $)
            [part="download"] {
                display: none;
            }
        ($ endif $)

        @media (min-width: 1024px) {
            ($ if @truty(@props.title, [""]) || @props.print || @props.search || @props.filter || @props.download || @this.querySelector("[slot=tools-start]") || @this.querySelector("[slot=tools-end]") $)
                [part="topbar"] {
                    gap: 1rem;
                    flex-direction: row;
                    align-items: center;
                }
            ($ endif $)

            ($ if @truty(@props.title, [""]) $)
                [part="title"] {
                    margin: 0;
                }
            ($ endif $)

            ($ if @props.search $)
                [part="search"] {
                    order: 0;
                    width: 300px;
                }
            ($ endif $)

            ($ if @state.show $)
                [part="modal"] {
                    inset: auto;
                    max-width: 400px;
                    width: max-content;
                    position: absolute;
                    height: max-content;
                    background: transparent;
                    {{ @state.pos ? "bottom" : "top" }}: 0;
                    ($ if @props.locale === "rtl" $)
                        left: 0;
                    ($ else $)
                        right: 0;
                    ($ endif $)
                }

                [part="content"] {
                    max-height: 300px;
                }

                [part="label"] {
                    display: none;
                }

                [part="items"] {
                    padding: .5rem;
                }
            ($ endif $)

            ($ if @props.print || @props.search || @props.filter || @props.download || @this.querySelector("[slot=tools-start]") || @this.querySelector("[slot=tools-end]") $)
                [part="tools"] {
                    margin-inline-end: 0;
                    margin-inline-start: auto;
                }
            ($ endif $)
        }
    `;

    const Template = /*html*/ `
        ($ if @truty(@props.title, [""]) || @props.print || @props.search || @props.filter || @props.download || @this.querySelector("[slot=tools-start]") || @this.querySelector("[slot=tools-end]") $)
            <div ref="topbar" part="topbar">
                ($ if @props.search && @state.search $)
                    <input type="search" ref="search" part="search" @input="{{ @rules.search }}" placeholder="{{ @state.locales[@props.locale].Search }}" />
                ($ elif @truty(@props.title, [""]) $)
                    <h1 ref="title" part="title">{{ @props.title }}</h1>
                ($ endif $)
                ($ if @props.print || @props.search || @props.filter || @props.download || @this.querySelector("[slot=tools-start]") || @this.querySelector("[slot=tools-end]") $)
                    <div ref="tools" part="tools">
                        <slot name="tools-start" />
                        ($ if @props.search $)
                            <button search title="{{ @state.locales[@props.locale].Search }}" ref="btn" part="btn" @click="{{ @rules.toggle }}">
                                <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M39.7 43.2L26.2894 29.8C25.2965 30.5641 24.1591 31.1635 22.8771 31.5981C21.5951 32.0327 20.1934 32.25 18.6719 32.25C14.8282 32.25 11.597 30.9383 8.9782 28.3149C6.35943 25.6914 5.05005 22.4998 5.05005 18.7399C5.05005 14.98 6.36177 11.7917 8.9852 9.175C11.6086 6.55833 14.8003 5.25 18.5602 5.25C22.3201 5.25 25.5084 6.56073 28.125 9.1822C30.7417 11.8037 32.05 14.9954 32.05 18.7575C32.05 20.2858 31.8334 21.675 31.4 22.925C30.9667 24.175 30.3334 25.3667 29.5 26.5L43 39.9L39.7 43.2ZM18.5721 27.7C21.1049 27.7 23.2261 26.841 24.9357 25.1229C26.6453 23.4049 27.5 21.2874 27.5 18.7706C27.5 16.2538 26.6443 14.1295 24.9327 12.3977C23.2212 10.6659 21.1025 9.8 18.5765 9.8C16.0228 9.8 13.8882 10.6659 12.1729 12.3977C10.4577 14.1295 9.60005 16.2538 9.60005 18.7706C9.60005 21.2874 10.4552 23.4049 12.1656 25.1229C13.876 26.841 16.0115 27.7 18.5721 27.7Z" />
                                </svg>
                            </button>         
                        ($ endif $)
                        ($ if @props.print $)
                            <button title="{{ @state.locales[@props.locale].Print }}" ref="btn" part="btn" @click="{{ @rules.print }}">
                                <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">                      
                                    <path d="M37.05 13H11V5H37.05V13ZM36.2 24.8C36.8 24.8 37.2917 24.6198 37.675 24.2594C38.0583 23.899 38.25 23.4208 38.25 22.825C38.25 22.2417 38.0604 21.75 37.6813 21.35C37.3021 20.95 36.8167 20.75 36.225 20.75C35.6083 20.75 35.1167 20.951 34.75 21.3531C34.3833 21.7552 34.2 22.2375 34.2 22.8C34.2 23.4 34.3833 23.8833 34.75 24.25C35.1167 24.6167 35.6 24.8 36.2 24.8ZM32.45 39.4V32.45H15.55V39.4H32.45ZM37.05 43.7H11V34.05H3V20.85C3 19.0617 3.60695 17.5396 4.82085 16.2837C6.03472 15.0279 7.52777 14.4 9.3 14.4H38.7C40.5083 14.4 42.0188 15.0279 43.2313 16.2837C44.4438 17.5396 45.05 19.0617 45.05 20.85V34.05H37.05V43.7Z" />
                                </svg>
                            </button>         
                        ($ endif $)
                        ($ if @props.download $)
                            <button title="{{ @state.locales[@props.locale].Download }}" ref="btn" part="btn" @click="{{ @rules.download }}">
                                <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M12.6 41.05C9.43333 41.05 6.70833 39.925 4.425 37.675C2.14167 35.425 1 32.6833 1 29.45C1 26.7167 1.85 24.25 3.55 22.05C5.25 19.85 7.45 18.5333 10.15 18.1C10.9167 15.1 12.4 12.6 14.6 10.6C16.8 8.6 19.3667 7.4 22.3 7V25.6L18.4 21.6L15.95 24.05L24 32.2L32.05 24.05L29.65 21.6L25.75 25.6V7C29.1833 7.43333 32.0833 8.95 34.45 11.55C36.8167 14.15 38.1 17.2667 38.3 20.9V22.1C40.8 22.3667 42.8583 23.375 44.475 25.125C46.0917 26.875 46.9 29.0333 46.9 31.6C46.9 34.2333 45.9833 36.4667 44.15 38.3C42.3167 40.1333 40.0833 41.05 37.45 41.05H12.6Z" />
                                </svg>
                            </button>         
                        ($ endif $)
                        ($ if @props.filter $)
                            <div ref="dropdown" part="dropdown">
                                <button title="{{ @state.locales[@props.locale].Columns }}" ref="btn" part="btn" @click="{{ @rules.filter }}">
                                    <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">
                                        <path d="M7.55 39.25C6.55 39.25 5.70833 38.9 5.025 38.2C4.34167 37.5 4 36.6667 4 35.7V12.55C4 11.5696 4.34167 10.7328 5.025 10.0397C5.70833 9.34657 6.55 9 7.55 9H12.05C13.0167 9 13.8333 9.34657 14.5 10.0397C15.1667 10.7328 15.5 11.5696 15.5 12.55V35.7C15.5 36.6667 15.1667 37.5 14.5 38.2C13.8333 38.9 13.0167 39.25 12.05 39.25H7.55ZM21.3 39.25C20.3333 39.25 19.5 38.9 18.8 38.2C18.1 37.5 17.75 36.6667 17.75 35.7V12.55C17.75 11.5696 18.1 10.7328 18.8 10.0397C19.5 9.34657 20.3333 9 21.3 9H25.8C26.7667 9 27.5917 9.34657 28.275 10.0397C28.9583 10.7328 29.3 11.5696 29.3 12.55V35.7C29.3 36.6667 28.9583 37.5 28.275 38.2C27.5917 38.9 26.7667 39.25 25.8 39.25H21.3ZM35.05 39.25C34.05 39.25 33.2083 38.9 32.525 38.2C31.8417 37.5 31.5 36.6667 31.5 35.7V12.55C31.5 11.5696 31.8417 10.7328 32.525 10.0397C33.2083 9.34657 34.05 9 35.05 9H39.5C40.4804 9 41.3255 9.34657 42.0353 10.0397C42.7451 10.7328 43.1 11.5696 43.1 12.55V35.7C43.1 36.6667 42.7451 37.5 42.0353 38.2C41.3255 38.9 40.4804 39.25 39.5 39.25H35.05Z" />
                                    </svg>
                                </button>   
                                ($ if @state.show $)
                                    <div ref="modal" part="modal">
                                        <div ref="content" part="content" @click:propagation="{{ () => {} }}">
                                            <label ref="label" part="label">{{ @state.locales[@props.locale].Columns }}</label>
                                            <div ref="items" part="items">
                                                ($ each col into @props.cols $)
                                                    <div ref="item" part="item">
                                                        <input type="checkbox" ref="checkbox" part="checkbox" data-for="{{ col.name }}" @change="{{ @rules.change }}" checked="{{ col.visible !== false }}" />
                                                        <span ref="text" part="text">{{ col.text || col.name }}</span>
                                                    </div>
                                                ($ endeach $)          
                                            </div>
                                        </div>
                                    </div>  
                                ($ endif $)
                            </div>      
                        ($ endif $)
                        <slot name="tools-end" />
                    </div>
                ($ endif $)
            </div>
        ($ endif $)
        <div ref="wrapper" part="wrapper">
            <table ref="table" part="table">
                <thead ref="tablehead" part="table-head">
                    <tr ref="tableheadrow" part="table-head-row">
                        ($ each col into @props.cols $)
                            ($ if col.visible !== false $)
                                <td ref="tableheadcol" part="table-head-col">
                                    {{ col.text || col.name }}
                                </td>
                            ($ endif $)
                        ($ endeach $)
                    </tr>
                </thead>
                <tbody ref="tablebody" part="table-body">
                    ($ forelse row into @props.rows $)
                        <tr ref="tablebodyrow" part="table-body-row">
                            ($ each col into @props.cols $)
                                ($ if col.visible !== false $)
                                    <td ref="tablebodycol" part="table-body-col">
                                        {{> col.render ? col.render(row) : row[col.name] }}
                                    </td>
                                ($ endif $)
                            ($ endeach $)
                        </tr>
                    ($ empty $)
                        <tr ref="tableemptyrow" part="table-empty-row">
                            <td ref="tablebodycol" part="table-empty-col">
                                {{ "NO DATA FOUND" }}
                            </td>
                        </tr>
                    ($ endforelse $)
                </tbody>
            </table>
        </div>
        ($ if @props.download $)
            <a ref="download" part="download" download />
        ($ endif $)
        ($ if @props.print $)
            <iframe ref="print" part="print" />
            <html ref="page" part="page" lang="{{ @props.locale }}" dir="{{ @props.locale === 'ar' ? 'rtl' : 'ltr' }}">
                <head>
                    <meta charset="UTF-8"/>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <style>
                        @page {
                            size: {{ @props.size }};
                            margin: {{ @props.margin }};
                        }
                        
                        body { 
                            margin: 0;
                        }

                        [part="print-page"] {
                            width: 100%
                        }

                        ($ if @truty(@props.title, [""]) $)
                            [part="print-title"] {
                                font-weight: 700;
                                text-align: center;
                                margin: 0 0 1rem 0;
                                font-size: {{  @theme.fonts.sizes("XLARGE") }};
                                line-height: {{  @theme.fonts.lines("XLARGE") }};
                            }
                        ($ endif $)

                        [part="print-wrapper"] {
                            width: 100%;
                            border-width: 1px;
                            border-style: solid;
                            border-radius: .25rem; 
                            background: {{ @theme.colors("OS-WHITE") }};
                            border-color: {{ @theme.colors("OS-SHADE") }};
                        }

                        [part="print-table"] {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        [part="print-table-head-col"],
                        [part="print-table-body-col"],
                        [part="print-table-empty-col"] {
                            padding: .5rem 1rem;
                            color: {{ @theme.colors("OS-BLACK") }};
                        }

                        [part="print-table-head-col"]:first-of-type,
                        [part="print-table-body-col"]:first-of-type {
                            padding-inline-start: 2rem;
                        }

                        [part="print-table-head-col"]:last-of-type,
                        [part="print-table-body-col"]:last-of-type {
                            padding-inline-end: 2rem;
                        }

                        [part="print-table-head-col"] {
                            font-weight: 700;
                            font-size: {{  @theme.fonts.sizes("SMALL") }};
                            line-height: {{  @theme.fonts.lines("SMALL") }};
                        }

                        [part="print-table-body-row"] {
                            border-top-width: 1px;
                            border-top-style: solid;
                            border-top-color: {{ @theme.colors("OS-SHADE") }};
                        }

                        [part="print-table-body-col"] {
                            font-size: {{  @theme.fonts.sizes("BASE") }};
                            line-height: {{  @theme.fonts.lines("BASE") }};
                        }

                        [part="print-table-empty-col"] {
                            font-weight: 700;
                            padding: 1rem 2rem;
                            font-size: {{  @theme.fonts.sizes("BASE") }};
                            line-height: {{  @theme.fonts.lines("BASE") }};
                        }
                    </style>
                </head>
                <body>
                    <table part="print-page">
                        <thead>
                            <tr>
                                <td>
                                    <div part="print-head">
                                        <slot name="print-header" />
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <main part="print-main">
                                        <slot name="print-main-start" />
                                        ($ if @truty(@props.title, [""]) $)
                                            <h1 part="print-title">{{ @props.title }}</h1>
                                        ($ endif $)
                                        <div part="print-wrapper">
                                            <table part="print-table">
                                                <thead part="print-table-head">
                                                    <tr part="print-table-head-row">
                                                        ($ each col into @props.cols $)
                                                            ($ if col.visible !== false $)
                                                                <td part="print-table-head-col">
                                                                    {{ col.text || col.name }}
                                                                </td>
                                                            ($ endif $)
                                                        ($ endeach $)
                                                    </tr>
                                                </thead>
                                                <tbody part="print-table-body">
                                                    ($ forelse row into @props.rows $)
                                                        <tr part="print-table-body-row">
                                                            ($ each col into @props.cols $)
                                                                ($ if col.visible !== false $)
                                                                    <td part="print-table-body-col">
                                                                        {{> col.render ? col.render(row) : row[col.name] }}
                                                                    </td>
                                                                ($ endif $)
                                                            ($ endeach $)
                                                        </tr>
                                                    ($ empty $)
                                                        <tr part="print-table-empty-row">
                                                            <td part="print-table-empty-col">
                                                                {{ "NO DATA FOUND" }}
                                                            </td>
                                                        </tr>
                                                    ($ endforelse $)
                                                </tbody>
                                            </table>
                                        </div>
                                        <slot name="print-main-end" />
                                    </main>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>
                                    <div part="print-footer">
                                        <slot name="print-footer" />
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </body>
            </html>
        ($ endif $)
    `;

    return OS.$Component({
        tag: OS.$Selectors.Datatable,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["title", "margin", "size", "print", "locale", "search", "filter", "download"],
        props: {
            title: "",
            margin: "5mm 5mm 5mm 5mm",
            size: "A4",
            download: false,
            search: false,
            filter: false,
            print: false,
            cols: [],
            rows: [],
            locale: document.documentElement.lang,
        },
        state: {
            locales: OS.$Locales,
            expand: false,
            show: false,
            pos: null,
            search: false,
            iframe: null,
        },
        rules: {
            print() {
                const div = document.createElement("div");
                div.innerHTML = this.refs.page.outerHTML;
                ["print-header", "print-main-start", "print-main-end", "print-footer"].map(e => {
                    const el = this.querySelector(`[slot=${e}]`);
                    if (el) div.querySelector(`[name=${e}]`).insertAdjacentHTML("afterend", el.innerHTML);
                });
                this.state.iframe.open();
                this.state.iframe.write(div.innerHTML);
                this.state.iframe.close();
                const pos = window.scrollY;
                this.refs.print.contentWindow.print();
                window.scroll(0, pos);
                this.emit("print");
            },
            search(event) {
                const value = event.target.value.toUpperCase().trim().split(" ");
                this.emit("search", { data: value }, () => {
                    [...(this.refs.tablebodyrow || [])].map(item => {
                        const phrase_int = item.innerText.toUpperCase().trim(),
                            score = [];
                        for (const niddle of value) {
                            if (phrase_int.includes(niddle)) score.push(1);
                            else score.push(0);
                        }
                        if (score.includes(1)) item.style.display = "";
                        else item.style.display = "none";
                    });
                });
            },
            filter() {
                this.state.expand = !this.state.expand;
            },
            toggle() {
                this.state.search = !this.state.search;
                this.rules.clear();
                if (this.state.search) {
                    this.refs.search.focus();
                }
            },
            download() {
                const cols = []
                this.props.cols.forEach(col => {
                    if (col.visible !== false)
                        cols.push(this.rules.parse(col.text || col.name));
                });
                const rows = [cols.join(",")];
                this.props.rows.forEach(row => {
                    const cols = []
                    this.props.cols.forEach(col => {
                        if (col.visible !== false)
                            cols.push(this.rules.parse(row[col.name]));
                    });
                    rows.push(cols.join(","));
                });

                this.refs.download.href = URL.createObjectURL(new Blob([rows.join("\n")], {
                    type: "text/csv",
                }));
                this.refs.download.click();
                this.emit("download");
            },
            parse(str) {
                str = str.replace(/"/g, `""`);
                if (/[",\n]/.test(str)) {
                    str = `"${str}"`;
                }
                return str;
            },
            clear() {
                [...(this.refs.tablebodyrow || [])].map(item => {
                    item.style.display = "";
                });
            },
            blur(event) {
                if (!this.refs.content.contains(event.target) && this.state.expand) {
                    this.rules.filter({ type: "click" });
                }
            },
            pos() {
                this.state.show && (this.state.pos = window.innerHeight - this.getBoundingClientRect().top < this.refs.modal.clientHeight);
            },
            change(e) {
                const name = e.target.dataset.for;
                this.props.cols = this.props.cols.map(col => {
                    if (col.name === name) col.visible = !(col.visible !== false);
                    return col;
                });
            }
        },
        setup: {
            mounted() {
                window.addEventListener("scroll", this.rules.pos);
            },
            removed() {
                window.removeEventListener("click", this.rules.blur);
                window.removeEventListener("scroll", this.rules.pos);
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "size":
                        case "title":
                        case "margin":
                            this.props[name] = newValue
                            break;
                        case "print":
                        case "locale":
                        case "search":
                        case "filter":
                        case "download":
                            this.props[name] = this.truty(newValue);
                            break;
                    }

                if (type === "state")
                    switch (name) {
                        case "show":
                            OS.$Wrapper && OS.$Wrapper.rules.toggle();
                            setTimeout(() => {
                                window[(newValue ? "add" : "remove") + "EventListener"]("click", this.rules.blur);
                            }, 0);
                            this.emit("change:expand", {
                                data: newValue,
                            });
                            break;
                        case "expand":
                            newValue
                                ?
                                (this.state.show = newValue, this.rules.pos()) :
                                setTimeout(() => {
                                    this.state.show = newValue;
                                }, 250);
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, [
                        "title", "size", "margin", "print", "locale", "search", "filter", "download"
                    ]);
                    switch (name) {
                        case "size":
                        case "margin":
                        case "locale":
                        case "download":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "filter":
                            this.state.expand = false;
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "search":
                            this.rules.clear();
                            this.state.search = false;
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "print":
                            newValue && (this.state.iframe = this.refs.print.contentDocument || this.refs.print.contentWindow.document);
                            this.emit("change:" + name, { data: newValue });
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Filter = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }

        ::-webkit-search-cancel-button,
        ::-webkit-inner-spin-button,
        ::-webkit-outer-spin-button {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            display: none;
        }
        
        input {
            -webkit-appearance: textfield;
            -moz-appearance: textfield;
            appearance: textfield;
        }      

        :host {
            gap: .5rem;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            border-width: 1px;
            align-items: center;
            border-style: solid;
            border-radius: .25rem;
            padding: .35rem .75rem;
            background: {{ @theme.colors("OS-LIGHT") }};
            border-color: {{ @theme.colors("OS-SHADE") }};
        }

        ($ if !@props.disabled $)
            :host(:focus),
            :host(:focus-within) {
                outline-width: 1px;
                outline-style: auto;
                outline-color: {{ @theme.colors("OS-PRIME", 400) }};
            }
        ($ endif $)

        [part="wrapper"] {
            flex: 1;
            width: 0%;
            display: flex;
            position: relative;
            flex-direction: column;
        }

        ($ if @truty(@props.label, [""]) $)
            [part="label"] {
                width: 100%;
                display: flex;
                overflow: hidden;
                font-weight: 600;
                inset: 0 0 auto 0;  
                position: absolute; 
                padding: .5rem 0;
                white-space: nowrap;
                pointer-events: none;
                flex-direction: column;
                text-overflow: ellipsis;
                justify-content: center;
                color: {{ @theme.colors("OS-BLACK", 50) }};
                font-size: {{  @theme.fonts.sizes("BASE") }};
                line-height: {{  @theme.fonts.lines("BASE") }};
                transition: 200ms ease-in-out padding, 200ms ease-in-out color, 200ms ease-in-out font-size, 200ms ease-in-out line-height; 
                -moz-transition: 200ms ease-in-out padding, 200ms ease-in-out color, 200ms ease-in-out font-size, 200ms ease-in-out line-height; 
                -webkit-transition: 200ms ease-in-out padding, 200ms ease-in-out color, 200ms ease-in-out font-size, 200ms ease-in-out line-height;
            }

            [part="label"]:has(+ [part="field"]:not(:placeholder-shown)),
            [part="label"]:has(+ [part="field"]:focus) {
                padding: 0;
                color: {{ @theme.colors("OS-BLACK", 80) }};
                font-size: {{  @theme.fonts.sizes("XSMALL") }};
                line-height: {{  @theme.fonts.lines("XSMALL") }};
            }
        ($ endif $)

        [part="field"] {
            padding: 0;
            width: 100%;
            outline: none;
            border: unset;
            display: block;
            background: transparent;
            color: {{ @theme.colors("OS-BLACK") }};
            font-size: {{  @theme.fonts.sizes("BASE") }};
            line-height: {{  @theme.fonts.lines("BASE") }};
            padding: {{ @truty(@props.label, [""]) ? "1rem 0 0 0" : ".5rem 0" }};
        }

        [part="icon"] {
            width: 1.2rem;
            height: 1.2rem;
            display: block;
            pointer-events: none;
            color: {{ @theme.colors("OS-BLACK") }};
        }

        ($ if !@props.disabled $)
            :host(:focus) [part="icon"],
            :host(:focus-within) [part="icon"] {
                color: {{ @theme.colors("OS-PRIME", 400) }};
            }
        ($ endif $)
    `;

    const Template = /*html*/ `
        <slot name="start" />
        <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">
            <path d="M39.7 43.2L26.2894 29.8C25.2965 30.5641 24.1591 31.1635 22.8771 31.5981C21.5951 32.0327 20.1934 32.25 18.6719 32.25C14.8282 32.25 11.597 30.9383 8.9782 28.3149C6.35943 25.6914 5.05005 22.4998 5.05005 18.7399C5.05005 14.98 6.36177 11.7917 8.9852 9.175C11.6086 6.55833 14.8003 5.25 18.5602 5.25C22.3201 5.25 25.5084 6.56073 28.125 9.1822C30.7417 11.8037 32.05 14.9954 32.05 18.7575C32.05 20.2858 31.8334 21.675 31.4 22.925C30.9667 24.175 30.3334 25.3667 29.5 26.5L43 39.9L39.7 43.2ZM18.5721 27.7C21.1049 27.7 23.2261 26.841 24.9357 25.1229C26.6453 23.4049 27.5 21.2874 27.5 18.7706C27.5 16.2538 26.6443 14.1295 24.9327 12.3977C23.2212 10.6659 21.1025 9.8 18.5765 9.8C16.0228 9.8 13.8882 10.6659 12.1729 12.3977C10.4577 14.1295 9.60005 16.2538 9.60005 18.7706C9.60005 21.2874 10.4552 23.4049 12.1656 25.1229C13.876 26.841 16.0115 27.7 18.5721 27.7Z" />
        </svg>
        <div ref="wrapper" part="wrapper">
            ($ set uid = "uid_" + @random() $)
            ($ if @truty(@props.label, [""]) $)
                <label ref="label" part="label" for="{{ uid }}">{{> @props.label }}</label>
            ($ endif $)
            <input ref="field" part="field" id="{{ uid }}" 
                @keypress="{{ @rules.keypress }}" 
                @keydown="{{ @rules.keydown }}" 
                @change="{{ @rules.change }}" 
                @keyup="{{ @rules.keyup }}" 
                @input="{{ @rules.search }}" 
                @focus="{{ @rules.focus }}" 
                @blur="{{ @rules.blur }}" 
                type="search" 
                ($ if @truty(@props.placeholder, [""]) $)
                    placeholder="{{ @props.placeholder }}"
                ($ else $)
                    placeholder=" "
                ($ endif $)
                ($ if @props.disabled $)
                    disabled="{{ @props.disabled }}"
                ($ endif $) 
            />
        </div>
        <slot name="end" />
    `;

    return OS.$Component({
        tag: OS.$Selectors.Filter,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["label", "target", "disabled", "placeholder"],
        props: {
            label: "",
            value: "",
            target: "",
            disabled: false,
            placeholder: "",
        },
        rules: {
            focus() {
                this.emit("focus", { data: this.props.value });
            },
            blur() {
                this.emit("blur", { data: this.props.value });
            },
            change() {
                this.emit("change", { data: this.props.value });
            },
            keyup() {
                this.emit("keyup", { data: this.props.value });
            },
            keydown() {
                this.emit("keydown", { data: this.props.value });
            },
            keypress() {
                this.emit("keypress", { data: this.props.value });
            },
            search(event) {
                this.props.value = event.target.value;
                const value = event.target.value.toUpperCase().trim().split(" ");
                this.emit("search", { data: this.props.value }, function() {
                    if (this.truty(this.props.target, [""])) {
                        [...document.querySelectorAll(this.props.target)].map(item => {
                            const phrase = item.innerText.toUpperCase().trim(),
                                score = [];
                            for (const niddle of value) {
                                if (phrase.includes(niddle)) score.push(1);
                                else score.push(0);
                            }
                            if (score.includes(1)) item.style.display = "";
                            else item.style.display = "none";
                        });
                    }
                });
            },
        },
        setup: {
            created() {
                this.reset = function() {
                    document.querySelectorAll(this.props.target)
                        .forEach(target => target.style.display = "");
                    this.props.value = "";
                    this.emit("reset");
                }
                this.focus = function() { this.refs.field.focus() }
                this.blur = function() { this.refs.field.blur() }
            },
            mounted() {
                if (this.hasAttribute("value")) {
                    this.props.value = this.getAttribute("value");
                    this.removeAttribute("value");
                }
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "label":
                        case "target":
                        case "placeholder":
                            this.props[name] = newValue;
                            break;
                        case "disabled":
                            this.props.disabled = this.truty(newValue);
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["label", "target", "disabled", "placeholder", ]);
                    switch (name) {
                        case "label":
                        case "target":
                        case "disabled":
                        case "placeholder":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "value":
                            this.refs.field.value = newValue;
                    }
                }
            },
        },
    });
})();

OS.$Component.Wrapper.define() &&
    OS.$Component.Toaster.define() &&
    OS.$Component.Toast.define() &&
    OS.$Component.Sidebar.define() &&
    OS.$Component.Topbar.define() &&
    OS.$Component.Modal.define() &&
    OS.$Component.Dropdown.define() &&
    OS.$Component.Datatable.define() &&
    OS.$Component.Filter.define();