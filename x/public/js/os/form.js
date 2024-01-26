OS.$Component.Switch = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }

        :host {
            gap: .5rem;
            flex-wrap: wrap;
            align-items: center;
            display: inline-flex;
        }

        [part="field"] {
            width: 2.5rem;
            height: 1.5rem;
            display: flex;
            cursor: pointer;
            ($ if !@props.disabled $)
                align-items: center;
            ($ endif $)
        }

        ($ if !@props.disabled $)
            [part="field"]:focus,
            [part="field"]:focus-within {
                outline-width: 1px;
                outline-style: auto;
                outline-color: {{ @theme.colors("OS-PRIME", 400) }};
            }
        ($ endif $)

        [part="ground"] {
            width: 100%;
            height: .85rem;
            aspect-ratio: 2/1;
            border-width: 1px;
            border-style: solid;
            border-radius: 1rem;    
            transition: 200ms ease-in-out background; 
            -moz-transition: 200ms ease-in-out background; 
            border-color: {{ @theme.colors("OS-SHADE") }};
            -webkit-transition: 200ms ease-in-out background;
            cursor: {{ @props.disabled ? "default" : "pointer" }};
            background: {{ @theme.colors(@props.checked ? "OS-PRIME" : "OS-LIGHT") }};
        }

        [part="scroll"] {
            height: 100%;
            display: flex;
            align-items: center;
            width: calc(100% + 2px);
            margin-inline-end: -1px;
            margin-inline-start: -1px;
        }

        [part="toggle"] {
            width: 1.5rem;
            height: 1.5rem;
            border-width: 1px;
            border-style: solid;
            border-radius: 1rem;
            transition: 200ms ease-in-out margin; 
            -moz-transition: 200ms ease-in-out margin; 
            -webkit-transition: 200ms ease-in-out margin;
            background: {{ @theme.colors("OS-WHITE") }};
            border-color: {{ @theme.colors("OS-SHADE") }};
            margin-inline-start: {{ @props.checked ? @refs.scroll.clientWidth - @refs.toggle.clientWidth - 2 : 0 }}px;
        }
    `;

    const Template = /*html*/ `
        <div ref="field" part="field" tabindex="{{ @props.disabled ? -1 : 0 }}">
            <div ref="ground" part="ground">    
                <div ref="scroll" part="scroll">
                    <span ref="toggle" part="toggle" />
                </div>
            </div>
        </div>
        <slot />
    `;

    return OS.$Component({
        tag: OS.$Selectors.Switch,
        tpl: Template,
        css: [Style],
        ctl: true,
    })({
        attrs: ["value", "group", "checked", "disabled"],
        props: {
            value: "",
            group: "",
            checked: false,
            disabled: false,
        },
        rules: {
            change(event) {
                if ((event.type !== "click" && event.keyCode !== 13) || this.props.disabled) return;
                this.props.checked = this.props.group.length && this.props.checked ? true : !this.props.checked;
            },
        },
        setup: {
            created() {
                this.reset = function() {
                    this.props.checked = false;
                    this.emit("reset");
                }
                this.focus = function() { this.refs.field.focus() }
                this.blur = function() { this.refs.field.blur() }
            },
            mounted() {
                this.addEventListener("click", this.rules.change);
                this.addEventListener("keydown", this.rules.change);
                this.ctl.form.addEventListener("reset", this.reset.bind(this));
            },
            removed() {
                this.removeEventListener("click", this.rules.change);
                this.removeEventListener("keydown", this.rules.change);
                this.ctl.form.removeEventListener("reset", this.reset.bind(this));
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "value":
                        case "group":
                            this.props[name] = newValue;
                            break;
                        case "checked":
                        case "disabled":
                            this.props[name] = this.truty(newValue);
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["value", "group", "checked", "disabled"]);
                    switch (name) {
                        case "value":
                        case "group":
                        case "disabled":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "checked":
                            if (newValue && this.props.group.length) {
                                document.querySelectorAll(this.tagName.toLowerCase() + "[group=" + this.props.group + "]").forEach((xswitch) => {
                                    this !== xswitch && (xswitch.checked = false);
                                });
                            }
                            this.ctl.setFormValue(newValue ? this.props.value : null);
                            this.emit("change", { data: newValue });
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Text = (function() {
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

        ($ if @props.type === "hidden" $)
            :host {
                display: none;
            }
        ($ else $)
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
        ($ endif $)

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
    `;

    const Template = /*html*/ `
        <slot name="start" />
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
                @input="{{ @rules.input }}" 
                @focus="{{ @rules.focus }}" 
                @blur="{{ @rules.blur }}" 
                type="{{ @props.type }}" 
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
        tag: OS.$Selectors.Text,
        tpl: Template,
        css: [Style],
        ctl: true,
    })({
        attrs: ["type", "label", "disabled", "placeholder"],
        props: {
            label: "",
            value: "",
            type: "text",
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
            input(event) {
                this.props.value = event.target.value;
                this.emit("input", { data: this.props.value });
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
        },
        setup: {
            created() {
                this.reset = function() {
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

                this.ctl.form.addEventListener("reset", this.reset.bind(this));
            },
            removed() {
                this.ctl.form.removeEventListener("reset", this.reset.bind(this));
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "type":
                        case "label":
                        case "placeholder":
                            this.props[name] = newValue;
                            break;
                        case "disabled":
                            this.props.disabled = this.truty(newValue);
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["type", "label", "disabled", "placeholder"]);
                    switch (name) {
                        case "type":
                        case "label":
                        case "disabled":
                        case "placeholder":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "value":
                            this.refs.field.value = newValue;
                            this.ctl.setFormValue(newValue ? newValue : null);
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Password = (function() {
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
        
        [part="trigger"] {
            padding: 0;
            border: unset;
            width: 1.2rem;
            height: 1.2rem;
            cursor: pointer;
            border-radius: 4px;
            pointer-events: auto;
            background: transparent;
            color: {{ @theme.colors("OS-BLACK") }};
            ($ if @props.disabled $)
                cursor: default;
            ($ endif $)
        }

        ($ if !@props.disabled $)
            [part="trigger"]:focus,
            [part="trigger"]:focus-within {
                outline-width: 1px;
                outline-style: auto;
                outline-color: {{ @theme.colors("OS-PRIME", 400) }};
            }
        ($ endif $)

        [part="icon"] {
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        [part="icon"] path:{{ @state.type === "password" ? "last-child" : "first-child" }} {
            display: none;
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
                @input="{{ @rules.input }}" 
                @focus="{{ @rules.focus }}" 
                @blur="{{ @rules.blur }}" 
                type="{{ @state.type }}" 
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
        <button ref="trigger" part="trigger"
            role="trigger" type="button" 
            @click="{{ @rules.toggle }}" 
            ($ if @props.disabled $)
                disabled="{{ @props.disabled }}"
            ($ endif $)
        >
            <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">
                <path d="M24.0147 31.35C26.3382 31.35 28.3083 30.5368 29.925 28.9103C31.5416 27.2838 32.35 25.3088 32.35 22.9853C32.35 20.6618 31.5367 18.6917 29.9103 17.075C28.2838 15.4583 26.3088 14.65 23.9853 14.65C21.6617 14.65 19.6916 15.4632 18.075 17.0897C16.4583 18.7162 15.65 20.6912 15.65 23.0147C15.65 25.3382 16.4632 27.3083 18.0897 28.925C19.7161 30.5417 21.6911 31.35 24.0147 31.35ZM23.9941 27.8C22.6786 27.8 21.5507 27.3279 20.6104 26.3837C19.6701 25.4395 19.2 24.3096 19.2 22.9941C19.2 21.6786 19.6721 20.5507 20.6163 19.6104C21.5605 18.6701 22.6903 18.2 24.0059 18.2C25.3214 18.2 26.4493 18.6721 27.3896 19.6163C28.3298 20.5605 28.8 21.6904 28.8 23.0059C28.8 24.3214 28.3279 25.4493 27.3837 26.3896C26.4395 27.3299 25.3096 27.8 23.9941 27.8ZM24 39C19.3666 39 15.1508 37.7221 11.3525 35.1662C7.5542 32.6104 4.53668 29.2883 2.29995 25.2C2.09995 24.8695 1.94995 24.5092 1.84995 24.1191C1.74995 23.729 1.69995 23.3576 1.69995 23.0049C1.69995 22.6522 1.74995 22.2805 1.84995 21.8897C1.94995 21.4989 2.09995 21.119 2.29995 20.75C4.53668 16.695 7.5542 13.3896 11.3525 10.8338C15.1508 8.27793 19.3666 7 24 7C28.6333 7 32.8491 8.27793 36.6474 10.8338C40.4457 13.3896 43.4632 16.695 45.7 20.75C45.9 21.1139 46.05 21.4908 46.15 21.8809C46.25 22.271 46.3 22.6424 46.3 22.9951C46.3 23.3478 46.25 23.7195 46.15 24.1103C46.05 24.5011 45.9 24.8643 45.7 25.2C43.4632 29.2883 40.4457 32.6104 36.6474 35.1662C32.8491 37.7221 28.6333 39 24 39Z" />
                <path d="M40.3 44.9996L32.65 37.4496C31.2833 38.0163 29.875 38.4163 28.425 38.6496C26.975 38.8829 25.5 38.9996 24 38.9996C19.3666 38.9996 15.1333 37.7246 11.3 35.1746C7.46662 32.6246 4.43328 29.2996 2.19995 25.1996C1.99995 24.8663 1.86662 24.5079 1.79995 24.1246C1.73328 23.7413 1.69995 23.3663 1.69995 22.9996C1.69995 22.6329 1.73328 22.2579 1.79995 21.8746C1.86662 21.4913 1.99995 21.1329 2.19995 20.7996C2.99995 19.3663 3.88328 17.9663 4.84995 16.5996C5.81662 15.2329 6.91662 13.9829 8.14995 12.8496L1.99995 6.84961L4.39995 4.34961L42.55 42.4996L40.3 44.9996ZM24 31.3496C24.4 31.3496 24.775 31.3079 25.125 31.2246C25.475 31.1413 25.85 31.0329 26.25 30.8996L16 20.7496C15.8666 21.1496 15.775 21.5246 15.725 21.8746C15.675 22.2246 15.65 22.5996 15.65 22.9996C15.65 25.3329 16.4583 27.3079 18.075 28.9246C19.6916 30.5413 21.6666 31.3496 24 31.3496ZM39 33.7496L31.55 26.2996C31.8833 25.8663 32.1 25.3579 32.2 24.7746C32.3 24.1913 32.35 23.5996 32.35 22.9996C32.35 20.6663 31.5416 18.6913 29.925 17.0746C28.3083 15.4579 26.3333 14.6496 24 14.6496C23.4 14.6496 22.8166 14.7079 22.25 14.8246C21.6833 14.9413 21.1666 15.1329 20.7 15.3996L14.3 8.94961C15.8666 8.24961 17.4916 7.74961 19.175 7.44961C20.8583 7.14961 22.55 6.99961 24.25 6.99961C28.8833 6.99961 33.0916 8.29128 36.875 10.8746C40.6583 13.4579 43.65 16.7996 45.85 20.8996C46.05 21.2329 46.1916 21.5746 46.275 21.9246C46.3583 22.2746 46.4 22.6329 46.4 22.9996C46.4 23.3663 46.35 23.7246 46.25 24.0746C46.15 24.4246 46.0166 24.7663 45.85 25.0996C45.0166 26.7329 44.025 28.2996 42.875 29.7996C41.725 31.2996 40.4333 32.6163 39 33.7496ZM27.8 22.4996L24.15 18.8996C24.6833 18.6329 25.225 18.5246 25.775 18.5746C26.325 18.6246 26.8 18.8163 27.2 19.1496C27.6333 19.6163 27.9083 20.1663 28.025 20.7996C28.1416 21.4329 28.0666 21.9996 27.8 22.4996Z" />           
            </svg>
        </button>
        <slot name="end" />
    `;

    return OS.$Component({
        tag: OS.$Selectors.Password,
        tpl: Template,
        css: [Style],
        ctl: true,
    })({
        attrs: ["label", "disabled", "placeholder"],
        props: {
            label: "",
            value: "",
            disabled: false,
            placeholder: "",
        },
        state: {
            type: "password",
        },
        rules: {
            toggle() {
                this.state.type = this.state.type === "password" ? "text" : "password";
            },
            focus() {
                this.emit("focus", { data: this.props.value });
            },
            blur() {
                this.emit("blur", { data: this.props.value });
            },
            change() {
                this.emit("change", { data: this.props.value });
            },
            input(event) {
                this.props.value = event.target.value;
                this.emit("input", { data: this.props.value });
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
        },
        setup: {
            created() {
                this.reset = function() {
                    this.state.type = "password";
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

                this.ctl.form.addEventListener("reset", this.reset.bind(this));
            },
            removed() {
                this.ctl.form.addEventListener("reset", this.reset.bind(this));
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "label":
                        case "placeholder":
                            this.props[name] = newValue;
                            break;
                        case "disabled":
                            this.props.disabled = this.truty(newValue);
                            break;
                    }

                if (type === "state")
                    switch (name) {
                        case "type":
                            if (!["text", "password"].includes(newValue)) {
                                this.state.type = "password";
                            } else {
                                this.emit("change:toggle", { data: this.state.type });
                            }
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["label", "disabled", "placeholder"]);
                    switch (name) {
                        case "label":
                        case "disabled":
                        case "placeholder":
                            this.emit("change:" + name, { data: newValue });
                        case "value":
                            this.refs.field.value = newValue;
                            this.ctl.setFormValue(newValue ? newValue : null);
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Area = (function() {
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

        ::-webkit-scrollbar {
            -webkit-appearance: none;
            background: transparent;
            -moz-appearance: none;
            appearance: none;
            display: none;
            height: 0px;
            width: 0px;
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
            resize: none;
            outline: none;
            border: unset;
            display: block;
            background: transparent;
            color: {{ @theme.colors("OS-BLACK") }};
            font-size: {{  @theme.fonts.sizes("BASE") }};
            line-height: {{  @theme.fonts.lines("BASE") }};
            padding: {{ @truty(@props.label, [""]) ? "1rem 0 0 0" : ".5rem 0" }};
        }
    `;

    const Template = /*html*/ `        
        <slot name="start" />
        <div ref="wrapper" part="wrapper">
            ($ set uid = "uid_" + @random() $)
            ($ if @truty(@props.label, [""]) $)
                <label ref="label" part="label" for="{{ uid }}">{{> @props.label }}</label>
            ($ endif $)
            <textarea ref="field" part="field" id="{{ uid }}" 
                @keypress="{{ @rules.keypress }}" 
                @keydown="{{ @rules.keydown }}" 
                @change="{{ @rules.change }}" 
                @keyup="{{ @rules.keyup }}" 
                @input="{{ @rules.input }}" 
                @focus="{{ @rules.focus }}" 
                @blur="{{ @rules.blur }}" 
                ($ if @truty(@props.placeholder, [""]) $)
                    placeholder="{{ @props.placeholder }}"
                ($ else $)
                    placeholder=" "
                ($ endif $)
                ($ if @props.disabled $)
                    disabled="{{ @props.disabled }}"
                ($ endif $)
                rows="{{ @props.rows }}"
            >
            </textarea>
        </div>
        <slot name="end" />
    `;

    return OS.$Component({
        tag: OS.$Selectors.Area,
        tpl: Template,
        css: [Style],
        ctl: true,
    })({
        attrs: ["rows", "label", "disabled", "placeholder"],
        props: {
            rows: 1,
            label: "",
            value: "",
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
            input(event) {
                this.props.value = event.target.value;
                this.rules.scroll();
                this.emit("input", { data: this.props.value });
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
            scroll() {
                this.refs.field.scroll(0, 0);
                setTimeout(() => {
                    this.refs.field.style.cssText = "height: auto";
                    this.refs.field.style.cssText = "height: " + this.refs.field.scrollHeight + "px";
                }, 0);
            },
        },
        setup: {
            created() {
                this.reset = function() {
                    this.props.value = "";
                    this.rules.scroll();
                    this.emit("reset");
                }
                this.focus = function() { this.refs.field.focus() }
                this.blur = function() { this.refs.field.blur() }
            },
            mounted() {
                if (this.hasAttribute("value")) {
                    this.props.value = this.getAttribute("value");
                    this.removeAttribute("value");
                    if (this.truty(this.props.value, [''])) {
                        this.rules.scroll();
                    }
                }

                this.ctl.form.addEventListener("reset", this.reset.bind(this));
            },
            removed() {
                this.ctl.form.addEventListener("reset", this.reset.bind(this));
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "rows":
                        case "label":
                        case "placeholder":
                            this.props[name] = newValue;
                            break;
                        case "disabled":
                            this.props.disabled = this.truty(newValue);
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["rows", "label", "disabled", "placeholder"]);
                    switch (name) {
                        case "rows":
                        case "label":
                        case "disabled":
                        case "placeholder":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "value":
                            this.refs.field.value = newValue;
                            this.ctl.setFormValue(newValue ? newValue : null);
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Filler = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }

        @keyframes anime-off {
            0% { transform: translateY(0px); opacity: 1; }
            100% { transform: translateY(20px); opacity: 0; }
        }

        @keyframes anime-on {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0px); opacity: 1; }
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
            gap: .5rem;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            border-width: 1px;
            position: relative;
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

        ($ if @state.show $)
            [part="content"] {
                margin: 0;
                padding: 0;
                width: 100%;
                display: flex;
                overflow: auto;
                list-style: none;
                max-height: 300px;
                position: absolute;
                border-radius: .25rem;
                inset: auto 0 auto 0;
                flex-direction: column;
                ($ if !@state.expand $)
                    pointer-events: none;
                ($ endif $)
                z-index: {{ @theme.layer() }};
                background: {{ @theme.colors("OS-WHITE") }};
                {{ @state.pos ? "bottom" : "top" }}: calc(100% + .25rem);
                box-shadow: {{ @theme.colors("OS-BLACK", 20) }} 0px 2px 12px;
                animation: anime-{{ @state.expand ? "on" : "off" }} 200ms ease-in-out forwards;
            }

            [part="item"] {
                width: 100%;
                outline: none;
                display: block;
                font-family: inherit;
                padding: .25rem .5rem;
                font-size: {{  @theme.fonts.sizes("MEDIUM") }};
                line-height: {{  @theme.fonts.lines("MEDIUM") }};
            }

            [part="item"]:hover,
            [part="item"]:focus,
            [part="item"]:focus-within {
                color: {{ @theme.colors("OS-BLACK") }};
                background: {{ @theme.colors("OS-PRIME", 40) }};
            }
        ($ endif $)
    `;

    const Template = /*html*/ `
        <slot name="start" />
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
                @input="{{ @rules.input }}" 
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
        <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">
            <path d="M19.25 38.6V34.05H28.9V38.6H19.25ZM11.1 26.55V22.05H37V26.55H11.1ZM5 14.55V10H43.15V14.55H5Z"/>
        </svg>
        <slot name="end" />
        ($ if @state.show $)
            <ul ref="content" part="content" @click:propagation="{{ () => {} }}">
                ($ if Array.isArray(@props.results) $)
                    ($ each result into @props.results $)
                        <li ref="item" part="item" tabindex="0" @click:propagation="{{ (event) => @rules.select(event, result) }}" @keydown:propagation="{{ (event) => @rules.select(event, result) }}">
                            {{ @rules.write(result, @props.setQuery) }}
                        </li>
                    ($ endeach $)
                ($ endif $)
            </ul>
        ($ endif $)
    `;

    return OS.$Component({
        tag: OS.$Selectors.Filler,
        tpl: Template,
        css: [Style],
        ctl: true,
    })({
        attrs: ["set-query", "set-value", "label", "disabled", "placeholder"],
        props: {
            setQuery: null,
            setValue: null,
            label: "",
            query: "",
            value: "",
            results: [],
            disabled: false,
            placeholder: "",
        },
        state: {
            expand: false,
            show: false,
            pos: false,
        },
        rules: {
            write(obj, str) {
                return !str ? obj : str.split(".").reduce((obj, key) => obj[key], obj);
            },
            hide(event) {
                if (!this.root.contains(event.target) && event.target !== this && this.state.expand) {
                    this.state.expand = false;
                }
            },
            pos() {
                this.state.show && (this.state.pos = window.innerHeight - this.getBoundingClientRect().top < this.refs.content.clientHeight);
            },
            focus() {
                this.emit("focus", { data: this.props.query });
            },
            blur() {
                this.emit("blur", { data: this.props.query });
            },
            change() {
                this.emit("change", { data: this.props.query });
            },
            input(event) {
                this.props.query = event.target.value;
                this.props.value = "";
                this.emit("input", { data: this.props.query });
            },
            keyup() {
                this.emit("keyup", { data: this.props.query });
            },
            keydown() {
                this.emit("keydown", { data: this.props.query });
            },
            keypress() {
                this.emit("keypress", { data: this.props.query });
            },
            select(event, result) {
                if (event.type === "click" || event.keyCode === 13) {
                    this.emit("select", { data: result }, function() {
                        this.props.query = this.rules.write(result, this.props.setQuery);
                        this.props.value = this.rules.write(result, this.props.setValue);
                        this.state.expand = false;
                    });
                }
            },
        },
        setup: {
            created() {
                this.reset = function() {
                    this.state.expand = false;
                    this.props.value = "";
                    this.props.query = "";
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

                if (this.hasAttribute("query")) {
                    this.props.query = this.getAttribute("query");
                    this.removeAttribute("query");
                }

                window.addEventListener("click", this.rules.hide);
                window.addEventListener("scroll", this.rules.pos);
                this.ctl.form.addEventListener("reset", this.reset.bind(this));
            },
            removed() {
                window.removeEventListener("click", this.rules.hide);
                window.removeEventListener("scroll", this.rules.pos);
                this.ctl.form.removeEventListener("reset", this.reset.bind(this));
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "set-query":
                            this.props.setQuery = newValue;
                            break;
                        case "set-value":
                            this.props.setValue = newValue;
                            break;
                        case "label":
                        case "placeholder":
                            this.props[name] = newValue;
                            break;
                        case "disabled":
                            this.props.disabled = this.truty(newValue);
                            break;
                    }

                if (type === "state")
                    switch (name) {
                        case "show":
                            this.focus();
                            this.rules.pos();
                            this.emit("change:expand", { data: newValue });
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
                        "setQuery", "setValue", "label", "disabled", "placeholder"
                    ]);
                    switch (name) {
                        case "label":
                        case "disabled":
                        case "setQuery":
                        case "setValue":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "query":
                            if (this.falsy(newValue, [""])) this.props.value = "";
                            this.refs.field.value = newValue;
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "value":
                            this.ctl.setFormValue(newValue ? newValue : null);
                            break;
                        case "results":
                            this.state.expand = Array.isArray(newValue) && Boolean(newValue.length);
                    }
                }
            },
        },
    });
})();

OS.$Component.Time = (function() {
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
        ($ endif $) 

        :host {
            gap: .5rem;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            border-width: 1px;
            position: relative;
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
                max-height: 60dvh; 
                border-radius: .25rem;
                flex-direction: column;
                background: {{ @theme.colors("OS-WHITE") }};
                box-shadow: {{ @theme.colors("OS-BLACK", 20) }} 0px 2px 12px;
                animation: slide-{{ @props.expand ? "on" : "off" }} 200ms ease-in-out forwards;
            }

            ($ if @truty(@props.label, [""]) $)
                [part="clabel"] {
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

            [part="hours"] {
                border-inline-end-width: 1px;
                border-inline-end-style: solid;
                border-inline-end-color: {{ @theme.colors("OS-SHADE") }};
            }
            
            [part="items"] {
                width: 100%;
                display: grid;
                overflow: overlay;
                align-items: flex-start;
                grid-template-rows: 1fr;
                grid-template-columns: repeat(2, 1fr);
            }

            [part="hours"],
            [part="minutes"] {
                gap: .25rem;
                width: 100%;
                height: 100%;
                display: flex;
                padding: .25rem;
                overflow: overlay;
                flex-direction: column;
            }

            [part="time"] {
                width: 100%;
                height: auto;
                border: unset;
                cursor: pointer;
                padding: .25rem;
                font-weight: 500;
                text-align: center;
                border-radius: 4px;
                align-self: center;
                justify-self: center;
                pointer-events: auto;
                background: transparent;
                font-size: {{  @theme.fonts.sizes("BASE") }};
                line-height: {{  @theme.fonts.lines("BASE") }};
            }

            [part="time"]:focus {
                outline-width: 1px;
                outline-style: auto;
                outline-color: {{ @theme.colors("OS-PRIME", 400) }};
            }

            [today] {
                color: {{ @theme.colors("OS-BLACK") }};
                background: {{ @theme.colors("OS-PRIME", 40) }};
            }

            [selected] {
                color: {{ @theme.colors("OS-WHITE") }};
                background: {{ @theme.colors("OS-PRIME") }};
            }

            [disabled] {
                color: transparent;
                pointer-events: none;
                background: {{ @theme.colors("OS-LIGHT") }};
            }

            @media (min-width: 1024px) {
                [part="modal"] {
                    position: absolute;
                    height: max-content;
                    inset: auto 0 auto 0;
                    background: transparent;
                    {{ @state.pos ? "bottom" : "top" }}: 0;
                }
        
                [part="content"] {
                    max-height: 300px;
                }
        
                ($ if @truty(@props.label, [""]) $)
                    [part="clabel"] {
                        display: none;
                    }
                ($ endif $)
            }
        ($ endif $)
    `;

    const Template = /*html*/ `
        <slot name="start" />
        <div ref="wrapper" part="wrapper">
            ($ set uid = "uid_" + @random() $)
            ($ if @truty(@props.label, [""]) $)
                <label ref="label" part="label" for="{{ uid }}">{{> @props.label }}</label>
            ($ endif $)
            <input ref="field" part="field" id="{{ uid }}" 
                value="{{> @props.value ? @rules.display(@props.value, @props.format) : '' }}"
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
        <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">
            <path d="M15.95 40.6H32.15V34.75C32.15 32.5167 31.3576 30.6 29.7728 29C28.188 27.4 26.2796 26.6 24.0478 26.6C21.8159 26.6 19.9083 27.4 18.325 29C16.7417 30.6 15.95 32.5167 15.95 34.75V40.6ZM7 45.15V40.6H11.4V34.7674C11.4 32.4649 12 30.3698 13.2 28.4819C14.4 26.594 16.0333 25.1333 18.1 24.1C16.0333 23.0667 14.4 21.6007 13.2 19.7022C12 17.8037 11.4 15.6972 11.4 13.3826V7.6H7V3H41.15V7.6H36.75V13.3826C36.75 15.6972 36.15 17.8037 34.95 19.7022C33.75 21.6007 32.1167 23.0667 30.05 24.1C32.1167 25.1333 33.75 26.594 34.95 28.4819C36.15 30.3698 36.75 32.4649 36.75 34.7674V40.6H41.15V45.15H7Z"/>
        </svg>
        <slot name="end" />
        ($ if @state.show $)
            <div ref="modal" part="modal">
                <div ref="content" part="content" @click:propagation="{{ () => {} }}">
                    ($ if @truty(@props.label, [""]) $)
                        <label ref="clabel" part="clabel">{{> @props.label }}</label>
                    ($ endif $)
                    <div ref="items" part="items">
                        <div ref="hours" part="hours">
                            ($ each hour into @state.info.hours $)
                                ($ set [text, time, attr] = hour $)
                                <button ref="time" part="time" role="hour-button" type="button" @click="{{ @rules.change }}" @keydown:propagation="{{ () => {} }}" data-value="{{ time }}" {{> attr ? attr + '="true"' : "" }}>
                                    {{ text }}
                                </button>
                            ($ endeach $)
                        </div>
                        <div ref="minutes" part="minutes">
                            ($ each minute into @state.info.minutes $)
                                ($ set [text, time, attr] = minute $)
                                <button ref="time" part="time" role="minute-button" type="button" @click="{{ @rules.change }}" @keydown:propagation="{{ () => {} }}" data-value="{{ time }}" {{> attr ? attr + '="true"' : "" }}>
                                    {{ text }}
                                </button>
                            ($ endeach $)
                        </div>
                    </div>
                </div>
            </div>
        ($ endif $)
    `;

    return OS.$Component({
        tag: OS.$Selectors.Time,
        tpl: Template,
        css: [Style],
        ctl: true,
    })({
        attrs: ["label", "format", "disabled", "placeholder", "disabled-hours", "disabled-minutes"],
        props: {
            label: "",
            value: "",
            format: "h:m",
            expand: false,
            placeholder: "",
            disabled: false,
            disabledHours: [],
            disabledMinutes: [],
        },
        state: {
            show: false,
            pos: false,
            date: new Date(),
            info: {
                hours: [],
                minutes: []
            }
        },
        rules: {
            init() {
                const times = this.props.value.split(":").filter(Boolean).map(e => +e);
                const now = new Date();

                for (var i = 0; i < 24; i++) {
                    this.state.info.hours[i] = [
                        (i < 10 ? "0" : "") + String(i), i,
                    ];

                    if (this.props.disabledHours.includes(i))
                        this.state.info.hours[i][2] = "disabled";
                    else {
                        if (now.getHours() === i)
                            this.state.info.hours[i][2] = "today";

                        if (i === times[0])
                            this.state.info.hours[i][2] = "selected";
                    }
                }

                for (var j = 0; j < 60; j++) {
                    this.state.info.minutes[j] = [
                        (j < 10 ? "0" : "") + String(j), j,
                    ];

                    if (this.props.disabledMinutes.includes(j))
                        this.state.info.minutes[j][2] = "disabled";
                    else {
                        if (now.getMinutes() === j)
                            this.state.info.minutes[j][2] = "today";

                        if (j === times[1])
                            this.state.info.minutes[j][2] = "selected";
                    }
                }
            },
            format(date) {
                var hour = ("0" + (date.getHours())).slice(-2);
                var minute = ("0" + date.getMinutes()).slice(-2);
                return hour + ":" + minute;
            },
            toggle(event) {
                if (this.props.disabled) this.props.expand = false;
                else if (event.type === "click" || event.keyCode === 13) this.props.expand = !this.props.expand;
            },
            blur(event) {
                if (!this.root.contains(event.target) && event.target !== this && this.props.expand) {
                    this.rules.toggle({ type: "click" });
                }
            },
            change(event) {
                const time = event.target.dataset.value;
                this.state.date[event.target.role === "hour-button" ? "setHours" : "setMinutes"](time);
                this.props.value = this.rules.format(this.state.date);
            },
            pos() {
                this.state.show && (this.state.pos = window.innerHeight - this.getBoundingClientRect().top < this.refs.modal.clientHeight);
            },
        },
        setup: {
            created() {
                const formats = {
                    __: {
                        zeros: function(nbr, len) {
                            for (var sign = nbr < 0 ? "-" : "", output = Math.abs(nbr).toString(); output.length < len;) output = "0" + output;
                            return sign + output;
                        },
                        clean: function(input) {
                            var matches = input.match(/^'([^]*?)'?$/);
                            return matches ? matches[1].replace(/''/g, "'") : input;
                        },
                    },
                    a: (date, token) => {
                        var dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
                        switch (token) {
                            case "a":
                            case "aa":
                                return dayPeriodEnumValue.toUpperCase();
                            case "aaa":
                                return dayPeriodEnumValue;
                            case "aaaaa":
                                return dayPeriodEnumValue[0];
                            case "aaaa":
                            default:
                                return "am" === dayPeriodEnumValue ? "a.m." : "p.m.";
                        }
                    },
                    h: (date, token) => {
                        return formats.__.zeros(date.getHours() % 12 || 12, token.length);
                    },
                    H: (date, token) => {
                        return formats.__.zeros(date.getHours(), token.length);
                    },
                    m: (date, token) => {
                        return formats.__.zeros(date.getMinutes(), token.length);
                    },
                    s: (date, token) => {
                        return formats.__.zeros(date.getSeconds(), token.length);
                    },
                };

                this.rules.display = (content, format) => {
                    if (typeof content !== "string") return null;
                    var tokens = (format = format || "h:m").match(/(\w)\1*|''|'(''|[^'])+('|$)|./g);

                    content = new Date("1990-10-10 " + content);
                    return tokens ?
                        tokens
                        .map(function(substringing) {
                            if ("''" === substringing) return "'";
                            var firstCharacter = substringing[0];
                            if ("'" === firstCharacter) return formats.__.clean(substringing);
                            var formatter = formats[firstCharacter];
                            return formatter ? formatter(content, substringing) : substringing;
                        })
                        .join("") :
                        null;
                };

                this.reset = function() {
                    this.props.value = "";
                    this.state.date = new Date();
                    this.rules.init();
                    this.emit("reset");
                }
                this.focus = function() { this.refs.field.focus() }
                this.blur = function() { this.refs.field.blur() }
            },
            mounted() {
                if (this.hasAttribute("value")) {
                    let value = this.getAttribute("value").split(":").filter(Boolean).map(e => +e);
                    if (value.length === 2) {
                        this.state.date.setHours(value[0]);
                        this.state.date.setMinutes(value[1]);
                        this.props.value = this.rules.format(this.state.date);
                    }
                    this.removeAttribute("value");
                }

                this.rules.init();
                this.addEventListener("keydown", this.rules.toggle);
                window.addEventListener("click", this.rules.blur);
                window.addEventListener("scroll", this.rules.pos);
                this.addEventListener("click", this.rules.toggle);
                this.ctl.form
                    .addEventListener("reset", this.reset.bind(this));
            },
            removed() {
                this.removeEventListener("keydown", this.rules.toggle);
                window.removeEventListener("click", this.rules.blur);
                window.removeEventListener("scroll", this.rules.pos);
                this.removeEventListener("click", this.rules.toggle);
                this.ctl.form
                    .addEventListener("reset", this.reset.bind(this));
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "label":
                        case "placeholder":
                            this.props[name] = newValue;
                            break;
                        case "format":
                            this.props.format = newValue || "h:m";
                            break;
                        case "disabled":
                            this.props.disabled = this.truty(newValue);
                            break;
                        case "disabled-hours":
                            this.props.disabledHours = (newValue || "")
                                .split(",")
                                .map((e) => e.trim())
                                .filter((e) => e.length)
                                .map((e) => +e);
                            break;
                        case "disabled-minutes":
                            this.props.disabledMinutes = (newValue || "")
                                .split(",")
                                .map((e) => e.trim())
                                .filter((e) => e.length);
                            break;
                    }

                if (type === "state")
                    switch (name) {
                        case "show":
                            this.focus();
                            this.rules.pos();
                            OS.$Wrapper && OS.$Wrapper.rules.toggle();
                            if (newValue) {
                                const selected = this.refs.items.querySelectorAll("[selected]");
                                selected[0] && this.refs.hours.scroll(0, selected[0].offsetTop - this.refs.hours.clientHeight / 2);
                                selected[1] && this.refs.minutes.scroll(0, selected[1].offsetTop - this.refs.minutes.clientHeight / 2);
                            }
                            this.emit("change:expand", {
                                data: newValue,
                            });
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["label", "format", "disabled", "placeholder"]);
                    switch (name) {
                        case "label":
                        case "format":
                        case "placeholder":
                        case "disbledHours":
                        case "disabledMinutes":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "value":
                            this.ctl.setFormValue(newValue ? newValue : null);
                            this.emit("change", { data: newValue });
                            break;
                        case "expand":
                            newValue
                                ?
                                (this.state.show = newValue, this.rules.pos()) :
                                setTimeout(() => {
                                    this.state.show = newValue;
                                }, 250);
                            break;
                        case "disabled":
                            newValue && (this.props.expand = false);
                            this.emit("change:disabled", { data: newValue });
                            break;
                    }
                }

                if (["date", "locales", "expand", "value", "disabledHours", "disabledMinutes"].includes(name)) {
                    this.rules.init();
                    this.render();
                }
            },
        },
    });
})();

OS.$Component.Date = (function() {
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
        ($ endif $) 

        :host {
            gap: .5rem;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            border-width: 1px;
            position: relative;
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
                [part="clabel"] {
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

            [part="control"] {
                margin: 0;
                width: 100%;
                display: grid;
                padding: .5rem;
                row-gap: 0.5rem;
                list-style: none;
                column-gap: 0.25rem;
                align-items: center;
                grid-template-rows: 1fr;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                grid-template-columns: repeat(7, 1fr);
                background: {{ @theme.colors("OS-PRIME") }};
                border-bottom-color: {{ @theme.colors("OS-SHADE") }};
            }

            [part="trigger"], 
            [part="date"] {
                width: 100%;
                height: 100%;
                border: unset;
                cursor: pointer;
                padding: .25rem;
                border-radius: 4px;
                align-self: center;
                justify-self: center;
                pointer-events: auto;
                background: transparent;
            }

            [part="trigger"]:focus, 
            [part="date"]:focus,
            [part="month"]:focus,
            [part="year"]:focus {
                outline-width: 1px;
                outline-style: auto;
                outline-color: {{ @theme.colors("OS-PRIME", 400) }};
            }

            [part="cicon"] {
                width: 1.2rem;
                height: 1.2rem;
                pointer-events: none;
            }

            [part="display"] {
                gap: .25rem;
                width: 100%;
                display: flex;
                justify-content: center;
                grid-column: span 5 / span 5;
            }

            [part="month"], 
            [part="year"] {
                border: unset;
                font-weight: 600;
                padding: 0 .25rem;
                background: transparent;
                text-transform: capitalize;
                font-size: {{  @theme.fonts.sizes("MEDIUM") }};
                line-height: {{  @theme.fonts.lines("MEDIUM") }};
            }
            
            [part="day"] {
                width: 100%;
                font-weight: 600;
                text-align: center;
                text-transform: uppercase;
                font-size: {{ @theme.fonts.sizes("XSMALL") }};
                line-height: {{ @theme.fonts.lines("XSMALL") }};
            }

            [part="trigger"],
            [part="month"], 
            [part="year"],
            [part="day"] {
                color: {{ @theme.colors("OS-WHITE") }};
            }

            [part="items"] {
                gap: .25rem;
                width: 100%;
                display: grid;
                padding: .25rem;
                overflow: overlay;
                grid-template-rows: 1fr;
                ($ if @state.view === "Y" $)
                    grid-template-columns: repeat(4, 1fr);
                ($ elif @state.view === "M" $)
                    grid-template-columns: repeat(3, 1fr);
                ($ else $)
                    grid-template-columns: repeat(7, 1fr);
                ($ endif $)
            }

            [part="date"] {
                width: 100%;
                height: auto;
                padding: .25rem;
                font-weight: 500;
                text-align: center;
                font-size: {{  @theme.fonts.sizes("BASE") }};
                line-height: {{  @theme.fonts.lines("BASE") }};
            }

            [today] {
                color: {{ @theme.colors("OS-BLACK") }};
                background: {{ @theme.colors("OS-PRIME", 40) }};
            }

            [selected] {
                color: {{ @theme.colors("OS-WHITE") }};
                background: {{ @theme.colors("OS-PRIME") }};
            }

            [disabled] {
                color: transparent;
                pointer-events: none;
                background: {{ @theme.colors("OS-LIGHT") }};
            }

            @media (min-width: 1024px) {
                [part="modal"] {
                    position: absolute;
                    height: max-content;
                    inset: auto 0 auto 0;
                    background: transparent;
                    {{ @state.pos ? "bottom" : "top" }}: 0;
                }
        
                [part="content"] {
                    max-height: 300px;
                }
        
                ($ if @truty(@props.label, [""]) $)
                    [part="clabel"] {
                        display: none;
                    }
                ($ endif $)

                [part="control"] {
                    padding: .5rem .25rem;
                }
            }
        ($ endif $)
    `;

    const Template = /*html*/ `
        <slot name="start" />
        <div ref="wrapper" part="wrapper">
            ($ set uid = "uid_" + @random() $)
            ($ if @truty(@props.label, [""]) $)
                <label ref="label" part="label" for="{{ uid }}">{{> @props.label }}</label>
            ($ endif $)
            <input ref="field" part="field" id="{{ uid }}" 
                value="{{> @props.value ? @rules.display(@props.value, @props.format) : '' }}"
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
        <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">
            <path d="M9.49995 45.0996C8.26078 45.0996 7.19265 44.6394 6.29555 43.719C5.39848 42.7986 4.94995 41.7421 4.94995 40.5496V10.4996C4.94995 9.24668 5.39848 8.16678 6.29555 7.25991C7.19265 6.35304 8.26078 5.89961 9.49995 5.89961H12.45V4.79961C12.45 4.28711 12.6546 3.83398 13.0638 3.44021C13.473 3.04648 13.933 2.84961 14.4438 2.84961C15.0154 2.84961 15.4843 3.04648 15.8506 3.44021C16.2168 3.83398 16.4 4.28711 16.4 4.79961V5.89961H31.6V4.79961C31.6 4.28711 31.7929 3.83398 32.1788 3.44021C32.5647 3.04648 33.028 2.84961 33.5688 2.84961C34.1237 2.84961 34.5927 3.04648 34.9756 3.44021C35.3585 3.83398 35.55 4.28711 35.55 4.79961V5.89961H38.5C39.7529 5.89961 40.8328 6.35304 41.7397 7.25991C42.6465 8.16678 43.1 9.24668 43.1 10.4996V40.5496C43.1 41.7421 42.6465 42.7986 41.7397 43.719C40.8328 44.6394 39.7529 45.0996 38.5 45.0996H9.49995ZM9.49995 40.5496H38.5V19.5996H9.49995V40.5496ZM24.0202 28.2496C23.3928 28.2496 22.8575 28.03 22.4145 27.5908C21.9715 27.1515 21.75 26.6232 21.75 26.0058C21.75 25.3883 21.9729 24.8579 22.4189 24.4146C22.8649 23.9713 23.4015 23.7496 24.0289 23.7496C24.6563 23.7496 25.1833 23.9692 25.61 24.4085C26.0366 24.8477 26.25 25.376 26.25 25.9935C26.25 26.6109 26.0352 27.1413 25.6056 27.5846C25.176 28.0279 24.6475 28.2496 24.0202 28.2496ZM16.0061 28.2496C15.3887 28.2496 14.8583 28.03 14.415 27.5908C13.9716 27.1515 13.75 26.6232 13.75 26.0058C13.75 25.3883 13.9696 24.8579 14.4088 24.4146C14.848 23.9713 15.3764 23.7496 15.9938 23.7496C16.6112 23.7496 17.1416 23.9692 17.585 24.4085C18.0283 24.8477 18.25 25.376 18.25 25.9935C18.25 26.6109 18.0303 27.1413 17.5911 27.5846C17.1519 28.0279 16.6235 28.2496 16.0061 28.2496ZM31.971 28.2496C31.3903 28.2496 30.875 28.03 30.425 27.5908C29.975 27.1515 29.75 26.6232 29.75 26.0058C29.75 25.3883 29.9764 24.8579 30.4294 24.4146C30.8823 23.9713 31.4074 23.7496 32.0048 23.7496C32.6022 23.7496 33.1257 23.9692 33.5754 24.4085C34.0251 24.8477 34.25 25.376 34.25 25.9935C34.25 26.6109 34.027 27.1413 33.581 27.5846C33.135 28.0279 32.5984 28.2496 31.971 28.2496ZM24.0202 36.2496C23.3928 36.2496 22.8575 36.0231 22.4145 35.5702C21.9715 35.1173 21.75 34.5922 21.75 33.9948C21.75 33.3974 21.9729 32.8739 22.4189 32.4242C22.8649 31.9745 23.4015 31.7496 24.0289 31.7496C24.6563 31.7496 25.1833 31.9726 25.61 32.4186C26.0366 32.8645 26.25 33.4012 26.25 34.0286C26.25 34.6093 26.0352 35.1246 25.6056 35.5746C25.176 36.0246 24.6475 36.2496 24.0202 36.2496ZM16.0061 36.2496C15.3887 36.2496 14.8583 36.0231 14.415 35.5702C13.9716 35.1173 13.75 34.5922 13.75 33.9948C13.75 33.3974 13.9696 32.8739 14.4088 32.4242C14.848 31.9745 15.3764 31.7496 15.9938 31.7496C16.6112 31.7496 17.1416 31.9726 17.585 32.4186C18.0283 32.8645 18.25 33.4012 18.25 34.0286C18.25 34.6093 18.0303 35.1246 17.5911 35.5746C17.1519 36.0246 16.6235 36.2496 16.0061 36.2496ZM31.971 36.2496C31.3903 36.2496 30.875 36.0231 30.425 35.5702C29.975 35.1173 29.75 34.5922 29.75 33.9948C29.75 33.3974 29.9764 32.8739 30.4294 32.4242C30.8823 31.9745 31.4074 31.7496 32.0048 31.7496C32.6022 31.7496 33.1257 31.9726 33.5754 32.4186C34.0251 32.8645 34.25 33.4012 34.25 34.0286C34.25 34.6093 34.027 35.1246 33.581 35.5746C33.135 36.0246 32.5984 36.2496 31.971 36.2496Z" />
        </svg>
        <slot name="end" />
        ($ if @state.show $)
            <div ref="modal" part="modal">
                <div ref="content" part="content" @click:propagation="{{ () => {} }}">
                    ($ if @truty(@props.label, [""]) $)
                        <label ref="clabel" part="clabel">{{> @props.label }}</label>
                    ($ endif $)
                    ($ if !["Y", "M"].includes(@state.view) $)
                        <ul ref="control" part="control">
                            <button ref="trigger_prev" part="trigger" role="trigger" type="button" @click="{{ @rules.prev }}" @keydown:propagation="{{ () => {} }}">
                                <svg ref="icon_prev" part="cicon" fill="currentColor" viewBox="0 0 48 48">
                                    ($ if @props.locale === "ar" $) 
                                        <path d="M27 24.45L13.15 10.55C12.3833 9.81667 12 8.91667 12 7.85C12 6.78333 12.3667 5.86667 13.1 5.1C13.8667 4.36667 14.7917 4 15.875 4C16.9583 4 17.8667 4.36667 18.6 5.1L33.2 19.65C33.8667 20.3167 34.3583 21.0583 34.675 21.875C34.9917 22.6917 35.15 23.55 35.15 24.45C35.15 25.3167 34.9917 26.1583 34.675 26.975C34.3583 27.7917 33.8667 28.55 33.2 29.25L18.6 43.8C17.8667 44.5333 16.9667 44.8917 15.9 44.875C14.8333 44.8583 13.9167 44.4833 13.15 43.75C12.4167 43.0167 12.05 42.1083 12.05 41.025C12.05 39.9417 12.4167 39.0333 13.15 38.3L27 24.45Z" />
                                    ($ else $)    
                                        <path d="M20.15 24.426L34 38.326C34.7667 39.0593 35.15 39.9593 35.15 41.026C35.15 42.0926 34.7834 43.0093 34.05 43.776C33.2834 44.5093 32.3584 44.876 31.275 44.876C30.1917 44.876 29.2834 44.5093 28.55 43.776L13.95 29.226C13.2834 28.5593 12.7917 27.8176 12.475 27.001C12.1584 26.1843 12 25.326 12 24.426C12 23.5593 12.1584 22.7176 12.475 21.901C12.7917 21.0843 13.2834 20.326 13.95 19.626L28.55 5.07598C29.2834 4.34264 30.1834 3.98431 31.25 4.00098C32.3167 4.01764 33.2334 4.39264 34 5.12598C34.7334 5.85931 35.1 6.76764 35.1 7.85098C35.1 8.93431 34.7334 9.84264 34 10.576L20.15 24.426Z" />
                                    ($ endif $)
                                </svg>
                            </button>
                            <li ref="display" part="display">
                                <button ref="month" part="month" role="trigger" 
                                    @keydown:propagation="{{ () => {} }}"
                                    type="button" data-next="M" 
                                    @click="{{ @rules.view }}" 
                                >
                                    {{ @rules.slice(@state.locales[@props.locale].Months[@state.info.month], @props.fullMonth) }}
                                </button>
                                <button ref="year" part="year" role="trigger" 
                                    @keydown:propagation="{{ () => {} }}"
                                    type="button" data-next="Y" 
                                    @click="{{ @rules.view }}" 
                                >
                                    {{ @state.info.year }}
                                </button>
                            </li>
                            <button ref="trigger_next" part="trigger" role="trigger" type="button" @click="{{ @rules.next }}" @keydown:propagation="{{ () => {} }}">
                                <svg ref="icon_next" part="cicon" fill="currentColor" viewBox="0 0 48 48">
                                    ($ if @props.locale === "ar" $)    
                                        <path d="M20.15 24.426L34 38.326C34.7667 39.0593 35.15 39.9593 35.15 41.026C35.15 42.0926 34.7834 43.0093 34.05 43.776C33.2834 44.5093 32.3584 44.876 31.275 44.876C30.1917 44.876 29.2834 44.5093 28.55 43.776L13.95 29.226C13.2834 28.5593 12.7917 27.8176 12.475 27.001C12.1584 26.1843 12 25.326 12 24.426C12 23.5593 12.1584 22.7176 12.475 21.901C12.7917 21.0843 13.2834 20.326 13.95 19.626L28.55 5.07598C29.2834 4.34264 30.1834 3.98431 31.25 4.00098C32.3167 4.01764 33.2334 4.39264 34 5.12598C34.7334 5.85931 35.1 6.76764 35.1 7.85098C35.1 8.93431 34.7334 9.84264 34 10.576L20.15 24.426Z" />
                                    ($ else $)
                                        <path d="M27 24.45L13.15 10.55C12.3833 9.81667 12 8.91667 12 7.85C12 6.78333 12.3667 5.86667 13.1 5.1C13.8667 4.36667 14.7917 4 15.875 4C16.9583 4 17.8667 4.36667 18.6 5.1L33.2 19.65C33.8667 20.3167 34.3583 21.0583 34.675 21.875C34.9917 22.6917 35.15 23.55 35.15 24.45C35.15 25.3167 34.9917 26.1583 34.675 26.975C34.3583 27.7917 33.8667 28.55 33.2 29.25L18.6 43.8C17.8667 44.5333 16.9667 44.8917 15.9 44.875C14.8333 44.8583 13.9167 44.4833 13.15 43.75C12.4167 43.0167 12.05 42.1083 12.05 41.025C12.05 39.9417 12.4167 39.0333 13.15 38.3L27 24.45Z" />
                                    ($ endif $)
                                </svg>
                            </button>
                            ($ range day into 0 to 6 $)
                                <li ref="day" part="day">{{ @rules.slice(@state.locales[@props.locale].Days[day], @props.fullDay) }}</li>
                            ($ endrange $)
                        </ul>
                    ($ endif $)
                    <div ref="items" part="items">
                        ($ if ["Y", "M"].includes(@state.view) $)
                            ($ set range = @state.view === "Y" ? @props.yearRange : [0, 11] $)
                            ($ range value into range[0] to range[1] $)
                                <button ref="date" part="date" role="{{ @state.view === 'Y' ? 'year' : 'month' }}-button" type="button" 
                                    data-next="D" 
                                    data-value="{{ value }}" 
                                    data-action="{{ @state.view }}" 
                                    @click="{{ @rules.view }}" 
                                    @keydown:propagation="{{ () => {} }}"
                                    ($ if @state.date.getMonth() === value || @state.info.year === value $)
                                        selected="true"
                                    ($ endif $)
                                >
                                    {{ @state.view === "Y" ? value : @state.locales[@props.locale].Months[value] }}
                                </button>
                            ($ endrange $)
                        ($ else $)
                            ($ each day into @state.info.array $)
                                ($ set [text, date, attr] = day $)
                                <button ref="date" part="date" role="date-button" type="button" @click="{{ @rules.change }}" @keydown:propagation="{{ () => {} }}" data-date="{{ date }}" {{> attr ? attr + '="true"' : "" }}>
                                    {{ text }}
                                </button>
                            ($ endeach $)
                        ($ endif $)
                    </div>
                </div>
            </div>
        ($ endif $)
    `;

    return OS.$Component({
        tag: OS.$Selectors.Date,
        tpl: Template,
        css: [Style],
        ctl: true,
    })({
        attrs: ["locale", "label", "format", "disabled", "placeholder", "full-day", "full-month", "year-range", "disabled-days", "disabled-dates"],
        props: {
            format: "yyyy-mm-dd",
            label: "",
            value: "",
            placeholder: "",
            expand: false,
            disabled: false,
            fullDay: true,
            fullMonth: true,
            yearRange: [1950, 2150],
            disabledDates: [],
            disabledDays: [],
            locale: document.documentElement.lang,
        },
        state: {
            locales: OS.$Locales,
            show: false,
            pos: false,
            view: "D",
            date: new Date(),
            info: {
                array: [],
                month: 0,
                year: 0,
            },
        },
        rules: {
            init() {
                const date = this.state.date;
                date.setDate(1);

                var lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                var firstDayIndex = date.getDay();

                var lastDaysIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
                var nextDaysIndex = 7 - lastDaysIndex - 1;

                const DATA = {
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    array: [],
                };

                for (var i = firstDayIndex; i > 0; i--) {
                    DATA.array.push(["00", "00-00-0000", "disabled"]);
                }

                const now = new Date();
                for (var i = 1; i <= lastDayIndex; i++) {
                    const current = new Date(this.state.date);
                    current.setDate(i);
                    const currarr = ["" + (i < 10 ? "0" + i : i), this.rules.format(current)];

                    if (
                        this.props.disabledDates.includes(this.rules.format(current)) ||
                        this.props.disabledDays.map((e) => e).includes(current.getDay() + 1)
                    ) {
                        currarr[2] = "disabled";
                    } else {
                        if (i === now.getDate() && this.state.date.getMonth() === now.getMonth() && this.state.date.getFullYear() === now.getFullYear())
                            currarr[2] = "today";

                        if (this.props.value === this.rules.format(current)) currarr[2] = "selected";
                    }

                    DATA.array.push(currarr);
                }

                for (var i = 1; i <= nextDaysIndex; i++) {
                    DATA.array.push(["00", "00-00-0000", "disabled"]);
                }

                this.state.info = DATA;
            },
            format(date) {
                var year = date.getFullYear();
                var month = ("0" + (date.getMonth() + 1)).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                return year + "-" + month + "-" + day;
            },
            slice(str, len) {
                return /\d/.test(len) ? str.substring(0, len) : str;
            },
            toggle(event) {
                if (this.props.disabled) this.props.expand = false;
                else if (event.type === "click" || event.keyCode === 13) this.props.expand = !this.props.expand;
            },
            blur(event) {
                if (!this.root.contains(event.target) && event.target !== this && this.props.expand) {
                    this.rules.toggle({ type: "click" });
                }
            },
            change(event) {
                const date = event.target.dataset.date.split("-");
                this.state.date.setMonth(Number(date[1]) - 1);
                this.state.date.setFullYear(Number(date[0]));
                this.state.date.setDate(Number(date[2]));
                this.props.value = event.target.dataset.date;
                this.props.expand = false;
                this.rules.init();
            },
            prev() {
                const year = this.state.date.getFullYear();
                this.state.date.setMonth(this.state.date.getMonth() - 1);
                this.emit((year !== this.state.date.getFullYear() ? "year" : "month") + ":change");
                this.rules.init();
            },
            next() {
                const year = this.state.date.getFullYear();
                this.state.date.setMonth(this.state.date.getMonth() + 1);
                this.emit((year !== this.state.date.getFullYear() ? "year" : "month") + ":change");
                this.rules.init();
            },
            view({ target: { dataset } }) {
                if (dataset) {
                    if (dataset.action === "Y") {
                        this.state.date.setFullYear(+dataset.value);
                        this.emit("year:change");
                    }
                    if (dataset.action === "M") {
                        this.state.date.setMonth(+dataset.value);
                        this.emit("month:change");
                    }

                    this.state.view = dataset.next;
                    this.rules.init();

                    const selected = this.refs.items.querySelector("[selected]");
                    selected && this.refs.items.scroll(0, selected.offsetTop - this.refs.items.clientHeight / 2);
                }
            },
            pos() {
                this.state.show && (this.state.pos = window.innerHeight - this.getBoundingClientRect().top < this.refs.modal.clientHeight);
            },
        },
        setup: {
            created() {
                const formats = {
                    __: {
                        zeros: function(nbr, len) {
                            for (var sign = nbr < 0 ? "-" : "", output = Math.abs(nbr).toString(); output.length < len;) output = "0" + output;
                            return sign + output;
                        },
                        clean: function(input) {
                            var matches = input.match(/^'([^]*?)'?$/);
                            return matches ? matches[1].replace(/''/g, "'") : input;
                        },
                    },
                    y: (date, token) => {
                        var signedYear = date.getFullYear(),
                            year = signedYear > 0 ? signedYear : 1 - signedYear;
                        return formats.__.zeros("yy" === token ? year % 100 : year, token.length);
                    },
                    m: (date, token) => {
                        var month = date.getMonth();
                        switch (token) {
                            case "mmm":
                                return this.state.locales[this.props.locale].Months[month].slice(0, 3);
                            case "mmmm":
                                return this.state.locales[this.props.locale].Months[month];
                            default:
                                return formats.__.zeros(month + 1, token.length);
                        }
                    },
                    d: (date, token) => {
                        switch (token) {
                            case "ddd":
                                return this.state.locales[this.props.locale].Days[date.getDay()].slice(0, 3);
                            case "dddd":
                                return this.state.locales[this.props.locale].Days[date.getDay()];
                            default:
                                return formats.__.zeros(date.getDate(), token.length);
                        }
                    },
                };

                this.rules.display = (content, format) => {
                    if (typeof content !== "string") return null;
                    var tokens = (format = format || "yyyy-mm-dd").match(/(\w)\1*|''|'(''|[^'])+('|$)|./g);

                    content = new Date(content);
                    return tokens ?
                        tokens
                        .map(function(substringing) {
                            if ("''" === substringing) return "'";
                            var firstCharacter = substringing[0];
                            if ("'" === firstCharacter) return formats.__.clean(substringing);
                            var formatter = formats[firstCharacter];
                            return formatter ? formatter(content, substringing) : substringing;
                        })
                        .join("") :
                        null;
                };

                this.reset = function() {
                    this.props.value = "";
                    this.state.date = new Date();
                    this.rules.init();
                    this.emit("reset");
                }
                this.focus = function() { this.refs.field.focus() }
                this.blur = function() { this.refs.field.blur() }
            },
            mounted() {
                if (this.hasAttribute("value")) {
                    let value = this.getAttribute("value");
                    const regex = /#now\s*([+-]?\s*\d+)*/;
                    const now = new Date();
                    const match = value.match(regex);
                    if (match) {
                        const num = parseInt(match[1]);
                        value = new Date(now.setDate(now.getDate() + (num || 0)));
                    }
                    const date = new Date(value);
                    if (!isNaN(date) && date.toString() !== "Invalid Date") {
                        this.state.date.setFullYear(date.getFullYear());
                        this.state.date.setMonth(date.getMonth());
                        this.state.date.setDate(date.getDate());

                        this.props.value = this.rules.format(date);
                    }
                    this.removeAttribute("value");
                }

                this.rules.init();
                this.addEventListener("keydown", this.rules.toggle);
                window.addEventListener("click", this.rules.blur);
                window.addEventListener("scroll", this.rules.pos);
                this.addEventListener("click", this.rules.toggle);
                this.ctl.form
                    .addEventListener("reset", this.reset.bind(this));
            },
            removed() {
                this.removeEventListener("keydown", this.rules.toggle);
                window.removeEventListener("click", this.rules.blur);
                window.removeEventListener("scroll", this.rules.pos);
                this.removeEventListener("click", this.rules.toggle);
                this.ctl.form
                    .addEventListener("reset", this.reset.bind(this));
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "label":
                        case "locale":
                        case "placeholder":
                            this.props[name] = newValue;
                            break;
                        case "format":
                            this.props.format = newValue || "yyyy-mm-dd";
                            break;
                        case "disabled":
                            this.props.disabled = this.truty(newValue);
                            break;
                        case "full-day":
                            this.props.fullDay = newValue || true;
                            break;
                        case "full-month":
                            this.props.fullMonth = newValue || true;
                            break;
                        case "year-range":
                            var range = (newValue || "")
                                .split(",")
                                .map((e) => e.trim())
                                .filter((e) => !Number.isNaN(+e) && +e);
                            this.props.yearRange = range.length === 2 ? range : [1950, 2150];
                            break;
                        case "disabled-days":
                            this.props.disabledDays = (newValue || "")
                                .split(",")
                                .map((e) => e.trim())
                                .filter((e) => e.length)
                                .map((e) => +e);
                            break;
                        case "disabled-dates":
                            this.props.disabledDates = (newValue || "")
                                .split(",")
                                .map((e) => e.trim())
                                .filter((e) => e.length);
                            break;
                    }

                if (type === "state")
                    switch (name) {
                        case "show":
                            this.focus();
                            this.rules.pos();
                            OS.$Wrapper && OS.$Wrapper.rules.toggle();
                            this.state.view = "D";
                            this.emit("change:expand", {
                                data: newValue,
                            });
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, [
                        "locale", "label", "format", "disabled", "placeholder",
                    ]);
                    switch (name) {
                        case "locale":
                        case "label":
                        case "format":
                        case "fullDay":
                        case "fullMonth":
                        case "yearRange":
                        case "placeholder":
                        case "disabledDays":
                        case "disabledDates":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "value":
                            this.ctl.setFormValue(newValue ? newValue : null);
                            this.emit("change", { data: newValue });
                            break;
                        case "expand":
                            newValue
                                ?
                                (this.state.show = newValue, this.rules.pos()) :
                                setTimeout(() => {
                                    this.state.show = newValue;
                                }, 250);
                            break;
                        case "disabled":
                            newValue && (this.props.expand = false);
                            this.emit("change:disabled", { data: newValue });
                            break;
                    }
                }

                if (["date", "locales", "value", "yearRange", "disabledDates", "disabledDays"].includes(name)) {
                    this.rules.init();
                }
            },
        },
    });
})();

OS.$Component.Group = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }

        ::slotted(*) {
            padding-inline-start: 1rem; 
        }

        ($ if @truty(@props.label, [""]) $)
            [part="label"] {
                width: 100%;
                display: block;
                font-weight: 600;
                padding: .25rem .5rem;
                color: {{ @theme.colors("OS-BLACK") }};
                font-size: {{  @theme.fonts.sizes("BASE") }};
                line-height: {{  @theme.fonts.lines("BASE") }};
            }
        ($ endif $)
    `;

    const Template = /*html*/ `
        ($ if @truty(@props.label, [""]) $)
            <label ref="label" part="label">{{> @props.label }}</label>
        ($ endif $)
        <slot />
    `;

    return OS.$Component({
        tag: OS.$Selectors.Group,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["label"],
        props: {
            label: "",
        },
        rules: {
            init() {
                [...this.querySelectorAll(":scope > :not(" + OS.$Selectors.Option + ")")].map((other) => other.remove());
            },
        },
        setup: {
            mounted() {
                this.addEventListener("DOMSubtreeModified", this.rules.init);
            },
            removed() {
                this.removeEventListener("DOMSubtreeModified", this.rules.init);
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "label":
                            this.props.label = newValue;
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["label", ]);
                    switch (name) {
                        case "label":
                            this.emit("change:" + name, { data: newValue });
                            break;
                    }
                }
            }
        },
    });
})();

OS.$Component.Option = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }

        ($ if @props.hidden $)
            :host {
                display: none;
            }
        ($ else $)
            :host {
                width: 100%;
                outline: none;
                display: block;
                font-family: inherit;
                padding: .25rem .5rem;
                font-size: {{  @theme.fonts.sizes("MEDIUM") }};
                line-height: {{  @theme.fonts.lines("MEDIUM") }};
                ($ if @props.selected $)
                    color: {{ @theme.colors("OS-WHITE") }};
                    background: {{ @theme.colors("OS-PRIME") }};
                ($ endif $)
                ($ if @props.disabled $)
                    pointer-events: none;
                    color: {{ @theme.colors("OS-BLACK") }};
                    background: {{ @theme.colors("OS-BLACK", 40) }};
                ($ endif $)
            }

            ($ if !@props.disabled $)
                :host(:hover),
                :host(:focus),
                :host(:focus-within) {
                    color: {{ @theme.colors("OS-BLACK") }};
                    background: {{ @theme.colors("OS-PRIME", 40) }};
                }
            ($ endif $)
        ($ endif $)

        ::slotted(*) {
            pointer-events: none;
        }
    `;

    const Template = /*html*/ `
        <slot />
    `;

    return OS.$Component({
        tag: OS.$Selectors.Option,
        tpl: Template,
        css: [Style],
    })({
        attrs: ["text", "value", "hidden", "selected", "disabled", "tabindex"],
        props: {
            text: "",
            value: "",
            hidden: false,
            selected: false,
            disabled: false,
        },
        rules: {
            toggle(event) {
                if (this.props.disabled || this.props.hidden) return;
                else if (event.type === "click" || event.keyCode === 13) {
                    if (event.keyCode === 13) event.stopPropagation();
                    if (this.closest(OS.$Selectors.Select) && this.closest(OS.$Selectors.Select).multiple) this.props.selected = !this.props.selected;
                    else this.props.selected = true;
                }
            },
            change() {
                if (!this.closest(OS.$Selectors.Select)) return;
                const select = this.closest(OS.$Selectors.Select);
                if (select.multiple) {
                    var value = select.value || [];
                    var text = select.text || [];
                    if (this.props.selected) {
                        value.push(this.props.value);
                        text.push(this.props.text || this.innerText);
                    } else {
                        const index = value.indexOf(this.props.value);
                        value.splice(index, 1) && text.splice(index, 1);
                        !value.length && ((value = []), (text = []));
                    }

                    if (value.length) {
                        select.value = value;
                        select.text = text;

                        const entries = new FormData();
                        select.value.forEach((value) => {
                            entries.append(select.name, value);
                        });
                        select.ctl.setFormValue(entries);
                    } else {
                        select.value = "";
                        select.text = "";
                        select.ctl.setFormValue(null);
                    }
                } else {
                    this.props.selected && select.querySelectorAll(OS.$Selectors.Option).forEach((option) => {
                        option !== this && (option.selected = false);
                    });
                    select.ctl.setFormValue(this.props.value);
                    select.text = this.props.text || this.innerText;
                    select.value = this.props.value;
                    select.expand = false;
                }
            },
        },
        setup: {
            mounted() {
                this.tabIndex = this.props.disabled || this.props.hidden ? -1 : 0;
                this.addEventListener("click", this.rules.toggle);
                this.addEventListener("keydown", this.rules.toggle);
            },
            removed() {
                this.removeEventListener("click", this.rules.toggle);
                this.removeEventListener("keydown", this.rules.toggle);
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "text":
                        case "value":
                            this.props[name] = newValue;
                            break;
                        case "hidden":
                        case "selected":
                        case "disabled":
                            this.props[name] = this.truty(newValue);
                            break;
                        case "tabindex":
                            const tab = this.props.disabled || this.props.hidden ? -1 : 0;
                            this.tabIndex !== tab && (this.tabIndex = tab);
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, [
                        "text", "value", "hidden", "selected", "disabled",
                    ]);
                    switch (name) {
                        case "text":
                        case "value":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "hidden":
                        case "disabled":
                            this.tabIndex = -1;
                            this.emit("change:" + name, {
                                data: newValue,
                            });
                            break;
                        case "selected":
                            this.rules.change();
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Select = (function() {
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
        ($ endif $)

        :host {
            gap: .5rem;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            border-width: 1px;
            position: relative;
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
                padding: .5rem 0;
                overflow: hidden;
                font-weight: 600;
                inset: 0 0 auto 0;  
                position: absolute; 
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

            ($ if @props.text $)
                [part="label"] {
                    padding: 0;
                    color: {{ @theme.colors("OS-BLACK", 80) }};
                    font-size: {{  @theme.fonts.sizes("XSMALL") }};
                    line-height: {{  @theme.fonts.lines("XSMALL") }};
                }
            ($ endif $)
        ($ endif $)

        [part="field"] {
            margin: 0;
            padding: 0;
            width: 100%;
            gap: .25rem;
            outline: none;
            border: unset;
            display: flex;
            height: 2.5rem;
            list-style: none;
            overflow: overlay;
            background: transparent;
            ($ if !@props.text || @props.disabled $)
                cursor: default;
            ($ endif $)
            color: {{ @theme.colors("OS-BLACK") }};
            font-size: {{  @theme.fonts.sizes("BASE") }};
            line-height: {{  @theme.fonts.lines("BASE") }};
            padding: {{ @truty(@props.label, [""]) ? "1rem 0 0 0" : ".5rem 0" }};
        }

        [part="field"]::-webkit-scrollbar {
            display: none;
        }

        ($ if @props.multiple $)
            [part="text"] {
                height: 100%;
                display: flex;
                flex-shrink: 0;
                padding: 0 .5rem;
                font-weight: 600;
                width: max-content;
                align-items: center; 
                border-radius: .2rem;
                color: {{ @theme.colors("OS-WHITE") }};
                background: {{ @theme.colors("OS-PRIME", 400) }};
                font-size: {{  @theme.fonts.sizes("XSMALL") }};
                line-height: {{  @theme.fonts.lines("XSMALL") }};
            }
        ($ else $)
            [part="text"] {
                flex-shrink: 0;
            }
        ($ endif $)

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
                [part="clabel"] {
                    width: 100%;
                    display: block;
                    padding: .65rem;
                    font-weight: 600;
                    text-align: center;
                    border-bottom-width: 1px;
                    border-bottom-style: solid;
                    color: {{ @theme.colors("OS-BLACK") }};
                    font-size: {{  @theme.fonts.sizes("SMALL") }};
                    line-height: {{  @theme.fonts.lines("SMALL") }};
                    border-bottom-color: {{ @theme.colors("OS-SHADE") }};
                }
            ($ endif $)

            ($ if @props.search $)
                [part="tools"] {
                    padding: .5rem;
                    text-align: center;
                    border-bottom-width: 1px;
                    border-bottom-style: solid;
                    border-bottom-color: {{ @theme.colors("OS-SHADE") }};
                }

                [part="search"] {
                    width: 100%;
                    display: block;
                    border-width: 1px;
                    border-style: solid;
                    padding: .5rem 1rem;
                    border-radius: .25rem;
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

            [part="items"] {
                flex: 1;
                width: 100%;
                display: flex;
                overflow: overlay;
                flex-direction: column; 
            }

            @media (min-width: 1024px) {
                [part="modal"] {
                    position: absolute;
                    height: max-content;
                    inset: auto 0 auto 0;
                    background: transparent;
                    {{ @state.pos ? "bottom" : "top" }}: 0;
                }

                [part="content"] {
                    max-height: 300px;
                }

                ($ if @truty(@props.label, [""]) $)
                    [part="clabel"] {
                        display: none;
                    }
                ($ endif $)
            }
        ($ endif $)
    `;

    const Template = /*html*/ `
        <slot name="start" />
        <div ref="wrapper" part="wrapper">
            ($ if @truty(@props.label, [""]) $)
                <label ref="label" part="label">{{> @props.label }}</label>
            ($ endif $)
            <ul ref="field" part="field"
                ($ if !@props.disabled $)
                    tabindex="0"
                ($ endif $)
            >
                ($ if @props.text $)
                    ($ if Array.isArray(@props.text) $)
                        ($ each text into @props.text $)
                            <li ref="text" part="text">{{> text }}</li>
                        ($ endeach $)
                    ($ else $)
                        <li ref="text" part="text">{{> @props.text }}</li>
                    ($ endif $)
                ($ endif $)
            </ul>
        </div>
        <svg ref="icon" part="icon" fill="currentColor" viewBox="0 0 48 48">
            <path d="M23.6629 27.4121L37.5629 13.5621C38.2962 12.7954 39.1962 12.4121 40.2629 12.4121C41.3296 12.4121 42.2462 12.7788 43.0129 13.5121C43.7462 14.2788 44.1129 15.2038 44.1129 16.2871C44.1129 17.3704 43.7462 18.2788 43.0129 19.0121L28.4629 33.6121C27.7962 34.2788 27.0546 34.7704 26.2379 35.0871C25.4212 35.4038 24.5629 35.5621 23.6629 35.5621C22.7962 35.5621 21.9546 35.4038 21.1379 35.0871C20.3212 34.7704 19.5629 34.2788 18.8629 33.6121L4.31291 19.0121C3.57958 18.2788 3.22125 17.3788 3.23791 16.3121C3.25458 15.2454 3.62958 14.3288 4.36291 13.5621C5.09625 12.8288 6.00458 12.4621 7.08791 12.4621C8.17125 12.4621 9.07958 12.8288 9.81291 13.5621L23.6629 27.4121Z" />
        </svg>
        <slot name="end" />
        ($ if @state.show $)
            <div ref="modal" part="modal">
                <div ref="content" part="content" @click:propagation="{{ () => {} }}">
                    ($ if @truty(@props.label, [""]) $)
                        <label ref="clabel" part="clabel">{{> @props.label }}</label>
                    ($ endif $)
                    ($ if @props.search $)
                        <div ref="tools" part="tools">
                            <input type="search" ref="search" part="search" @input="{{ @rules.search }}" placeholder="{{ @state.locales[@props.locale].Search }}" />
                        </div>
                    ($ endif $)
                    <div ref="items" part="items">
                        <slot />                   
                    </div>
                </div>
            </div>
        ($ endif $)
    `;

    return OS.$Component({
        tag: OS.$Selectors.Select,
        tpl: Template,
        css: [Style],
        ctl: true,
    })({
        attrs: ["locale", "label", "search", "multiple", "disabled"],
        props: {
            text: "",
            value: "",
            label: "",
            expand: false,
            search: false,
            multiple: false,
            disabled: false,
            locale: document.documentElement.lang,
        },
        state: {
            locales: OS.$Locales,
            show: false,
            pos: false,
        },
        rules: {
            init() {
                [...this.querySelectorAll(":scope > :not(" + OS.$Selectors.Group + ", " + OS.$Selectors.Option + ", [slot=start], [slot=end])")].map((other) => other.remove());
                this.render();
            },
            toggle(event) {
                if (this.props.disabled) this.props.expand = false;
                if (event.type === "click" || event.keyCode === 13) this.props.expand = !this.props.expand;
            },
            blur(event) {
                if (!this.root.contains(event.target) && event.target !== this && this.props.expand) {
                    this.rules.toggle(event);
                }
            },
            search(event) {
                const value = event.target.value.toUpperCase().trim().split(" ");
                this.emit("search", { data: value }, () => {
                    [...this.querySelectorAll(OS.$Selectors.Option)].map(item => {
                        const phrase_int = item.innerText.toUpperCase().trim(),
                            phrase_val = item.value.toUpperCase().trim(),
                            phrase_txt = item.text.toUpperCase().trim(),
                            score = [];
                        for (const niddle of value) {
                            if (phrase_int.includes(niddle) || phrase_txt.includes(niddle) || phrase_val.includes(niddle)) score.push(1);
                            else score.push(0);
                        }
                        if (score.includes(1)) item.style.display = "";
                        else item.style.display = "none";
                    });
                });
            },
            pos() {
                this.state.show && (this.state.pos = window.innerHeight - this.getBoundingClientRect().top < this.refs.modal.clientHeight);
            },
        },
        setup: {
            created() {
                this.reset = function() {
                    this.querySelectorAll(OS.$Selectors.Option).forEach((option) => {
                        option.selected = false;
                    });
                    this.ctl.setFormValue(null);
                    this.props.value = "";
                    this.props.text = "";
                    this.emit("reset");
                }
                this.focus = function() { this.refs.field.focus() }
                this.blur = function() { this.refs.field.blur() }
            },
            mounted() {
                this.addEventListener("DOMSubtreeModified", this.rules.init);
                this.addEventListener("keydown", this.rules.toggle);
                window.addEventListener("click", this.rules.blur);
                window.addEventListener("scroll", this.rules.pos);
                this.addEventListener("click", this.rules.toggle);
                this.ctl.form.addEventListener("reset", this.reset.bind(this));
            },
            removed() {
                this.removeEventListener("DOMSubtreeModified", this.rules.init);
                this.removeEventListener("keydown", this.rules.toggle);
                window.removeEventListener("click", this.rules.blur);
                window.removeEventListener("scroll", this.rules.pos);
                this.removeEventListener("click", this.rules.toggle);
                this.ctl.form.addEventListener("reset", this.reset.bind(this));
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "locale":
                        case "label":
                            this.props[name] = newValue;
                            break;
                        case "search":
                        case "multiple":
                        case "disabled":
                            this.props[name] = this.truty(newValue);
                    }

                if (type === "state")
                    switch (name) {
                        case "show":
                            this.focus();
                            this.rules.pos();
                            OS.$Wrapper && OS.$Wrapper.rules.toggle();
                            this.emit("change:expand", {
                                data: newValue,
                            });
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, [
                        "locale", "label", "search", "multiple", "disabled",
                    ]);
                    switch (name) {
                        case "locale":
                        case "label":
                        case "search":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "value":
                            this.emit("change", { data: newValue });
                            break;
                        case "expand":
                            newValue
                                ?
                                ((this.state.show = newValue, this.rules.pos()),
                                    this.querySelectorAll(OS.$Selectors.Option).forEach((option) => (option.style.display = "")),
                                    this.refs.items.scroll(0, 0)) :
                                setTimeout(() => {
                                    this.state.show = newValue;
                                }, 250);
                            break;
                        case "disabled":
                            newValue && (this.props.expand = false);
                            this.emit("change:disabled", { data: newValue });
                            break;
                        case "multiple":
                            this.emit("change:multiple", { data: newValue });
                            this.reset();
                            break;
                    }
                }
            },
        },
    });
})();

OS.$Component.Button = (function() {
    const Style = /*css*/ `
        * {
            box-sizing: border-box;
            font-family: inherit;
        }

        :host {
            outline: none;
            padding: .5rem;
            cursor: default;
            flex-wrap: wrap;
            font-weight: 600;
            border-width: 1px;
            align-items: center;
            border-style: solid;
            display: inline-flex;
            border-radius: .25rem;
            justify-content: center;
            ($ if @props.vertical $)
                flex-direction: column; 
            ($ else $)
                gap: .5rem;
            ($ endif $)
            ($ if @props.outlined $) 
                color: {{ @theme.colors("OS-PRIME") }};
            ($ else $)
                color: {{ @theme.colors("OS-WHITE") }};
                background: {{ @theme.colors("OS-PRIME") }};
            ($ endif $)
            border-color: {{ @theme.colors("OS-PRIME") }};
            font-size: {{  @theme.fonts.sizes("MEDIUM") }};
            transition: 150ms ease-in-out color, 150ms ease-in-out border-color, 150ms ease-in-out backgroun;
            -moz-transition: 150ms ease-in-out color, 150ms ease-in-out border-color, 150ms ease-in-out backgroun;
            -webkit-transition: 150ms ease-in-out color, 150ms ease-in-out border-color, 150ms ease-in-out backgroun;
        }

        ($ if !@props.disabled $)
            :host(:hover),
            :host(:focus),
            :host(:focus-within) {
                color: {{ @theme.colors("OS-BLACK") }};
                border-color: {{ @theme.colors("OS-PRIME", 40) }};
                background: {{ @theme.colors("OS-PRIME", 40) }};
            }
        ($ endif $)

        ::slotted(*) {
            pointer-events: none;
        }
    `;

    const Template = /*html*/ `
        <slot name="start" />
        <slot />
        <slot name="end" />
    `;

    return OS.$Component({
        tag: OS.$Selectors.Button,
        tpl: Template,
        css: [Style],
        ctl: true,
    })({
        attrs: ["type", "outlined", "vertical", "disabled"],
        props: {
            type: "submit",
            vertical: false,
            disabled: false,
            outlined: false,
        },
        rules: {
            click(event) {
                if (this.props.disabled) return;
                if ((event.type === "click" || event.keyCode === 13) && this.ctl.form) {
                    switch (this.props.type) {
                        case "submit":
                            this.ctl.form.requestSubmit();
                            break;
                        case "reset":
                            this.ctl.form.reset();
                            break;
                    }
                }
            },
            keydown(event) {
                if (event.keyCode === 13) this.click();
            }
        },
        setup: {
            mounted() {
                this.tabIndex = 0;
                this.addEventListener("click", this.rules.click);
                this.addEventListener("keydown", this.rules.keydown);
            },
            removed() {
                this.removeEventListener("click", this.rules.click);
                this.removeEventListener("keydown", this.rules.keydown);
            },
            updated(name, oldValue, newValue, type) {
                if (type === "attrs")
                    switch (name) {
                        case "type":
                            this.props.type = newValue;
                            break;
                        case "outlined":
                        case "vertical":
                        case "disabled":
                            this.props[name] = this.truty(newValue);
                            break;
                    }

                if (type === "props") {
                    this.setter(name, newValue, ["type", "vertical", "outlined", "disabled", ]);
                    switch (name) {
                        case "type":
                        case "vertical":
                        case "outlined":
                            this.emit("change:" + name, { data: newValue });
                            break;
                        case "disabled":
                            this.tabIndex = newValue ? -1 : 0;
                            this.emit("change:" + name, { data: newValue });
                            break;
                    }
                }
            }
        },
    });
})();

OS.$Component.Switch.define() &&
    OS.$Component.Text.define() &&
    OS.$Component.Password.define() &&
    OS.$Component.Area.define() &&
    OS.$Component.Date.define() &&
    OS.$Component.Time.define() &&
    OS.$Component.Select.define() &&
    OS.$Component.Group.define() &&
    OS.$Component.Option.define() &&
    OS.$Component.Filler.define() &&
    OS.$Component.Button.define();