const OS$LOAD = [];
const OS = {
    $Wrapper: null,
    $Toaster: null,
    $Selectors: {
        Datatable: "os-datatable",
        Dropdown: "os-dropdown",
        Password: "os-password",
        Fixedbar: "os-fixedbar",
        Wrapper: "os-wrapper",
        Toaster: "os-toaster",
        Sidebar: "os-sidebar",
        Switch: "os-switch",
        Select: "os-select",
        Option: "os-option",
        Filter: "os-filter",
        Filler: "os-filler",
        Button: "os-button",
        Topbar: "os-topbar",
        Group: "os-group",
        Toast: "os-toast",
        Modal: "os-modal",
        Text: "os-text",
        Area: "os-area",
        Date: "os-date",
        Time: "os-time",
    },
    $Locales: {
        en: {
            Print: "Print",
            Search: "Search",
            Columns: "Columns",
            Download: "Download",
            Months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            Days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        ar: {
            Print: "طباعة",
            Search: "بحث",
            Columns: "أعمدة",
            Download: "تحميل",
            Months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
            Days: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
        },
        fr: {
            Print: "Imprimer",
            Search: "Recherche",
            Columns: "Colonnes",
            Download: "Telecharger",
            Months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            Days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        },
    },
};

OS.$Load = function(fn) {
    typeof fn === "function" && OS$LOAD.push(fn);
};

(function() {
    const THEME = {
        COLORS: {
            BLACK: "0 0 0",
            WHITE: "255 255 255",
            RED: {
                50: "254 242 242",
                100: "254 226 226",
                200: "254 202 202",
                300: "252 165 165",
                400: "248 113 113",
                500: "239 68 68",
                600: "220 38 38",
                700: "185 28 28",
                800: "153 27 27",
                900: "127 29 29",
                950: "69 10 10",
            },
            GRAY: {
                50: "249 250 251",
                100: "243 244 246",
                200: "229 231 235",
                300: "209 213 219",
                400: "156 163 175",
                500: "107 114 128",
                600: "75 85 99",
                700: "55 65 81",
                800: "31 41 55",
                900: "17 24 39",
                950: "3 7 18",
            },
            BLUE: {
                50: "239 246 255",
                100: "219 234 254",
                200: "191 219 254",
                300: "147 197 253",
                400: "96 165 250",
                500: "59 130 246",
                600: "37 99 235",
                700: "29 78 216",
                800: "30 64 175",
                900: "30 58 138",
                950: "23 37 84",
            },
            GREEN: {
                50: "240 253 244",
                100: "220 252 231",
                200: "187 247 208",
                300: "134 239 172",
                400: "74 222 128",
                500: "34 197 94",
                600: "22 163 74",
                700: "21 128 61",
                800: "22 101 52",
                900: "20 83 45",
                950: "5 46 22",
            },
            YELLOW: {
                50: "254 252 232",
                100: "254 249 195",
                200: "254 240 138",
                300: "253 224 71",
                400: "250 204 21",
                500: "234 179 8",
                600: "202 138 4",
                700: "161 98 7",
                800: "133 77 14",
                900: "113 63 18",
                950: "66 32 6",
            },
            PURPLE: {
                50: "250 245 255",
                100: "243 232 255",
                200: "233 213 255",
                300: "216 180 254",
                400: "192 132 252",
                500: "168 85 247",
                600: "147 51 234",
                700: "126 34 206",
                800: "107 33 168",
                900: "88 28 135",
                950: "59 7 100",
            },
        },
        FONTS: {
            SIZES: {
                XSMALL: "0.75rem",
                SMALL: "0.875rem",
                BASE: "1rem",
                MEDIUM: "1.125rem",
                LARGE: "1.25rem",
                XLARGE: "1.5rem",
            },
            LINES: {
                XSMALL: "1rem",
                SMALL: "1.25rem",
                BASE: "1.5rem",
                MEDIUM: "1.75rem",
                LARGE: "1.75rem",
                XLARGE: "2rem",
            },
        },
    };

    function theme(type, name, value) {
        type = type.toUpperCase();
        name = name.toUpperCase();
        THEME[type][name] = value;
    }

    theme.colors = function(name, shade, opacity) {
        name = name.toUpperCase();
        const isobj = verify(THEME.COLORS[name], "object");
        return "rgb(" + ((isobj ? THEME.COLORS[name][shade] : THEME.COLORS[name]) || THEME.COLORS.BLACK) + " / " + (((isobj ? opacity : shade) || 100) / 100) + ")";
    };

    theme.fonts = {};

    theme.fonts.sizes = function(name) {
        name = name.toUpperCase();
        return THEME.FONTS.SIZES[name];
    };

    theme.fonts.lines = function(name) {
        name = name.toUpperCase();
        return THEME.FONTS.LINES[name];
    };

    theme.layer = function() {
        return Math.max(
            ...[...document.querySelectorAll("body *")].reduce((a, c) => {
                a.push(c);
                if ("root" in c) a.push(...c.root.querySelectorAll("*"));
                return a;
            }, []).map(el => parseFloat(window.getComputedStyle(el).zIndex)).filter(
                (zIndex) => !Number.isNaN(zIndex)
            ), 0
        ) + 1;
    };

    function verify(element, ...types) {
        return types.includes(Object.prototype.toString.call(element).slice(8, -1).toLowerCase());
    }

    function present(element) {
        return !(
            verify(element, "null") ||
            verify(element, "undefined") ||
            (verify(element, "number") && isNaN(element)) ||
            (verify(element, "string") && "" === element) ||
            (verify(element, "array") && 0 === element.length) ||
            (verify(element, "object") && 0 === Object.keys(element).length)
        );
    }

    function kebabCase(content) {
        return (
            (verify(content, "string") &&
                content
                .replace(/([a-z])([A-Z])/g, "$1-$2")
                .split(/[-_.\\\/\s]/g)
                .map(function(w, i) {
                    return w.toLowerCase();
                })
                .join("-")) ||
            ""
        );
    }

    function random(length = 10) {
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charLength = chars.length;
        var result = "";
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        return result;
    }

    function falsy(data, extra = []) {
        return [
            "false", "null", "undefined", "0", ...extra
        ].includes(String(data).trim());
    }

    function truty(data, extra = []) {
        return ![
            "false", "null", "undefined", "0", ...extra
        ].includes(String(data).trim());
    }

    function setter(name, value, names) {
        const attr = kebabCase(name);
        if (!names.includes(attr)) return;
        if (!value) this.removeAttribute(attr);
        else {
            this.getAttribute(attr) !== String(value) && this.setAttribute(attr, value);
        }
    }

    OS.$Theme = (type, name, value) => theme(type, name, value);
    OS.$Theme.Colors = theme.colors;
    OS.$Theme.Layer = theme.layer;
    OS.$Theme.Fonts = {
        Lines: theme.fonts.lines,
        Sizes: theme.fonts.sizes,
    };

    OS.$Theme.Update = function() {
        Object.values(OS.$Selectors).forEach(selector => {
            Array.from(document.querySelectorAll(selector), (el) => el.render());
        });
    }

    OS.$Builder = class Builder {
        static get TXT_TAGS() {
            return Symbol.for("text");
        }

        static get SVG_TAGS() {
            return {
                svg: true,
                animate: true,
                animateMotion: true,
                animateTransform: true,
                circle: true,
                clipPath: true,
                defs: true,
                desc: true,
                discard: true,
                ellipse: true,
                feBlend: true,
                feColorMatrix: true,
                feFiberTransfer: true,
                feComposite: true,
                feConvolveMatrix: true,
                feDiffuseLighting: true,
                feDisplacementMap: true,
                feDistantLight: true,
                feDropShadow: true,
                feFlood: true,
                feFuncA: true,
                feFuncB: true,
                feFuncG: true,
                feFuncR: true,
                feGaussianBlur: true,
                feImage: true,
                feMerge: true,
                feMergeNode: true,
                feMorphology: true,
                feOffset: true,
                fePointLight: true,
                feSpecularLighting: true,
                feSpotLight: true,
                feTile: true,
                feTurbulence: true,
                filter: true,
                foreignObject: true,
                g: true,
                hatch: true,
                hatchpath: true,
                image: true,
                line: true,
                linearGradient: true,
                marker: true,
                mask: true,
                metadata: true,
                mpath: true,
                path: true,
                pattern: true,
                polygon: true,
                polyline: true,
                radialGradient: true,
                rect: true,
                script: true,
                set: true,
                stop: true,
                style: true,
                switch: true,
                symbol: true,
                text: true,
                textPath: true,
                title: true,
                tspan: true,
                use: true,
                compiler: true,
                animateColor: true,
                "missing-glyph": true,
                font: true,
                "font-face": true,
                "font-face-format": true,
                "font-face-name": true,
                "font-face-src": true,
                "font-face-uri": true,
                hkern: true,
                vkern: true,
                solidcolor: true,
                altGlyph: true,
                altGlyphDef: true,
                altGlyphItem: true,
                glyph: true,
                glyphRef: true,
                tref: true,
                cursor: true,
            };
        }

        static get CSS_TAGS() {
            return {
                "animation-iteration-count": true,
                "border-image-slice": true,
                "border-image-width": true,
                "column-count": true,
                "counter-increment": true,
                "counter-reset": true,
                flex: true,
                "flex-grow": true,
                "flex-shrink": true,
                "font-size-adjust": true,
                "font-weight": true,
                "line-height": true,
                "nav-index": true,
                opacity: true,
                order: true,
                orphans: true,
                "tab-size": true,
                widows: true,
                "z-index": true,
                "pitch-range": true,
                richness: true,
                "speech-rate": true,
                stress: true,
                volume: true,
                "lood-opacity": true,
                "mask-box-outset": true,
                "mask-border-outset": true,
                "mask-box-width": true,
                "mask-border-width": true,
                "shape-image-threshold": true,
            };
        }

        constructor(container, tree, refs = {}) {
            this.container = container;
            this.instance = null;
            this.refs = refs;
            this.tree = tree;
        }

        flat(array) {
            return array.reduce((flat, toFlatten) => [...flat, ...(verify(toFlatten, "array") ? this.flat(toFlatten) : [toFlatten])], []);
        }

        create(fiber) {
            const { type, props } = fiber;
            const dom =
                type === OS.$Builder.TXT_TAGS ?
                document.createTextNode("") :
                type in OS.$Builder.SVG_TAGS ?
                document.createElementNS("http://www.w3.org/2000/svg", type) :
                document.createElement(type);
            const children = this.children({ dom }, fiber);
            this.properties(dom, {}, props);
            return new OS.$Instance({ dom, fiber, children });
        }

        reconcile(parentDom, oldNode, fiber) {
            var node;
            if (null == oldNode) {
                if (verify(fiber, "array")) {
                    node = fiber.map((e) => this.create(e));
                    node.forEach((e) => {
                        parentDom.appendChild(e.dom);
                    });
                } else {
                    node = this.create(fiber);
                    if (verify(node.dom, "array")) {
                        this.flat(node.dom).forEach((e) => {
                            parentDom.appendChild(e);
                        });
                    } else {
                        node.dom && parentDom.appendChild(node.dom);
                    }
                }
                return node;
            }

            if (null == fiber) {
                if (verify(oldNode, "array")) {
                    oldNode.forEach((e) => {
                        parentDom.removeChild(e.dom);
                    });
                } else {
                    oldNode.dom && parentDom.removeChild(oldNode.dom);
                }
                return null;
            }

            if (verify(oldNode, "array") && verify(fiber, "array")) {
                return this.children({ dom: parentDom, children: oldNode }, { props: { children: fiber } });
            }

            if ((oldNode.fiber || {}).type !== fiber.type) {
                node = this.create(fiber);
                if (oldNode.dom || oldNode[0].dom) {
                    parentDom.replaceChild(node.dom, oldNode.dom || oldNode[0].dom);
                }
                return node;
            }

            if (verify(fiber.type, "string") || fiber.type === OS.$Builder.TXT_TAGS) {
                oldNode.children = this.children(oldNode, fiber);
                this.properties(oldNode.dom, oldNode.fiber.props, fiber.props);
                oldNode.fiber = fiber;
                return oldNode;
            }

            return undefined;
        }

        children(oldNode, fiber) {
            const oldChildNodes = (oldNode.children || []).filter((node) => null != node),
                childElements = (fiber.props.children || []).filter((node) => null != node),
                length = Math.max(oldChildNodes.length, childElements.length),
                children = [];

            for (var i = 0; i < length; i++) {
                const childNode = this.reconcile(oldNode.dom, oldChildNodes[i], childElements[i]);
                children.push(childNode);
            }

            return children;
        }

        properties(node, oldProps, newProps) {
            this.clearProperties(node, oldProps, newProps);
            this.applyProperties(node, newProps);
        }

        clearProperties(node, oldProps, newProps) {
            this.clearListeners(node, newProps);
            for (var prop in oldProps) {
                if (!(prop in newProps)) {
                    const tag = node && node.tagName && node.tagName.toLowerCase(),
                        isObj = prop.split(".").length > 1,
                        isSvg = tag in OS.$Builder.SVG_TAGS,
                        isProp = prop in node;

                    if (isProp && !isSvg) node[prop] = "";
                    else if (isObj)
                        this.applyObject(
                            node, {
                                [prop]: "",
                            },
                            prop
                        );
                    else node.removeAttribute(prop);
                }
            }
        }

        clearListeners(node, newProps) {
            for (const event in node.listeners) {
                if (!(event in newProps)) {
                    const ev = event.split(":"),
                        eventName = ev[0].substring(1);
                    node.removeEventListener(eventName, node.listeners[event], false);
                    delete node.listeners[event];
                }
            }
        }

        applyProperties(node, newProps) {
            for (var prop in newProps) {
                if (prop === "children") continue;
                else if (prop === "style") this.applyStyles(node, newProps, prop);
                else this.otherwise(node, newProps, prop);
            }
        }

        applyStyles(node, newProps, prop) {
            if (verify(newProps[prop], "object")) {
                const props = newProps[prop];
                for (const key in props) {
                    const rule = kebabCase(key);
                    var cur = props[key];

                    if (rule.startsWith("--")) {
                        document.documentElement.style.setProperty(rule, cur);
                    } else if (present(cur)) {
                        if (verify(cur, "number") && !(rule in OS.$Builder.CSS_TAGS)) {
                            cur += "px";
                        }
                        node.style[rule] = cur;
                    }
                }
            } else node.style = newProps[prop];
        }

        otherwise(node, newProps, prop) {
            const tag = node && node.tagName && node.tagName.toLowerCase(),
                isObj = prop.split(".").length > 1,
                isSvg = tag in OS.$Builder.SVG_TAGS,
                isEvent = prop.startsWith("@"),
                isRef = prop === "ref",
                isProp = prop in node;

            if (isEvent) this.applyListeners(node, prop, newProps[prop]);
            else if (isProp && !isSvg) node[prop] = newProps[prop];
            else if (isObj) this.applyObject(node, newProps, prop);
            else if (isRef) this.applyReferance(node, newProps, prop);
            else node.setAttribute(prop, newProps[prop]);
        }

        applyObject(node, newProps, prop) {
            const code = prop.split(".").reduce((a, e) => (e.length ? a + `["${e}"]` : a), "");
            eval(`node${code} = newProps[prop]`);
        }

        applyReferance(node, newProps, prop) {
            if (this.refs[newProps[prop]])
                verify(this.refs[newProps[prop]], "array") ?
                this.refs[newProps[prop]].push(node) :
                (this.refs[newProps[prop]] = [this.refs[newProps[prop]], node]);
            else this.refs[newProps[prop]] = node;
        }

        applyListeners(node, name, callback) {
            const eventString = name.split(":"),
                eventName = eventString.shift().substring(1);

            node.listeners = node.listeners || {};
            if (!node.listeners[name] ||
                (node.listeners[name] && (node.listeners[name].toString() !== callback.toString() || node.listeners[name] !== callback))
            ) {
                node.listeners[name] = callback;
                node.addEventListener(eventName, (event) => {
                    (eventString[0] || "").split("|").forEach((type) => {
                        switch (type) {
                            case "prevent":
                                event.preventDefault();
                            case "propagation":
                                event.stopPropagation();
                            case "immediate":
                                event.stopImmediatePropagation();
                        }
                    });
                    callback(event);
                });
            }
        }

        exec(tree) {
            this.tree = tree || this.tree;
            for (let prop in this.refs) delete this.refs[prop];
            this.instance = this.reconcile(this.container, this.instance, this.tree);
        }
    }

    OS.$Instance = class Instance {
        constructor(props) {
            this.dom = props.dom;
            this.fiber = props.fiber;
            this.children = props.children;
        }
    }

    OS.$Fiber = class Fiber {
        constructor(props) {
            this.type = verify(props.type, "string") ? props.type.toLowerCase() : props.type;
            this.props = props.props;
        }

        isText() {
            return this.type === OS.$Builder.TXT_TAGS;
        }

        isSvg() {
            return this.type in OS.$Builder.SVG_TAGS;
        }
    }

    OS.$Parser = class Parser {
        static get SEPARATOR() {
            return "_join_placement_code_";
        }

        static get VALUE_REGEX() {
            return /^["'`]([^"'`]*)(["'`])/;
        }

        static get QUOTE_REGEX() {
            return /^["'`]([^"'`]*)["'`]/g;
        }

        static get NAME_REGEX() {
            return /^([\w-:_.\$\@]+)=?/;
        }

        static get START_REGEX() {
            return /^([^<]+)/;
        }

        static get TAG_REGEX() {
            return /^([\w-]+)/;
        }

        constructor(partial, ...context) {
            this.partial = partial;
            this.context = context;
        }

        parse(template, props) {
            const stack = [
                new OS.$Fiber({
                    type: null,
                    props: {
                        children: [],
                    },
                }),
            ];

            var mode = 0;

            while (template) {
                let value, prop;
                template = template.trimLeft();
                if (!template.length) break;
                switch (mode) {
                    case 0:
                        if (template[0] === "<") {
                            if (template[1] === "/") {
                                [template] = this.tokenize(template, 2, OS.$Parser.TAG_REGEX);
                                mode = -1;
                            } else {
                                [template, value] = this.tokenize(template, 1, OS.$Parser.TAG_REGEX);
                                stack.push(
                                    new OS.$Fiber({
                                        type: value,
                                        props: {
                                            children: [],
                                        },
                                    })
                                );
                                mode = 1;
                            }
                        } else {
                            [template, value] = this.tokenize(template, 0, OS.$Parser.START_REGEX);
                            var val = this.replace(value, props);
                            val.length &&
                                stack[stack.length - 1].props.children.push(
                                    new OS.$Fiber({
                                        type: OS.$Builder.TXT_TAGS,
                                        props: {
                                            nodeValue: val,
                                            children: [],
                                        },
                                    })
                                );
                        }
                        break;
                    case 1:
                        if (template[0] === "/" && template[1] === ">") {
                            stack[stack.length - 2].props.children.push(stack.pop());
                            mode = 0;
                            template = template.substring(2);
                        } else if (template[0] === ">") {
                            mode = 0;
                            template = template.substring(1);
                        } else {
                            [template, value] = this.tokenize(template, 0, OS.$Parser.NAME_REGEX);
                            if (value.length) {
                                if (value.includes(OS.$Parser.SEPARATOR)) {
                                    var [_name, _value = ""] = this.replace(value, props).split("=");
                                    if (_name.length) {
                                        prop = _name;
                                        value = _value.replace(OS.$Parser.QUOTE_REGEX, "$1");
                                    }
                                } else {
                                    prop = value;
                                    [template, value] = this.tokenize(template, 0, OS.$Parser.VALUE_REGEX);
                                    if (value === OS.$Parser.SEPARATOR) {
                                        var j = this.count++;
                                        value = verify(props[j], "string") ? props[j].trim() : props[j];
                                    } else value = this.replace(value, props);
                                }
                                prop && prop.length && (stack[stack.length - 1].props[prop] = value);
                            }
                        }
                        break;
                    case -1:
                        stack[stack.length - 2].props.children.push(stack.pop());
                        template = template.substring(1);
                        mode = 0;
                        break;
                }
            }

            return stack[0].props.children;
        }

        exec() {
            this.count = 0;
            const template = this.partial.join(OS.$Parser.SEPARATOR),
                tree = this.parse(template, this.context);
            delete this.count;
            return tree;
        }

        replace(text, props) {
            return text.replace(new RegExp(OS.$Parser.SEPARATOR, "g"), () => {
                var value = props[this.count++];
                return verify(value, "number", "boolean", "string") ? value : "";
            });
        }

        tokenize(s, i, regexp) {
            var m = (s = s.substring(i)).match(regexp);
            return m ? [s.substring(m[0].length), m[1]] : [s, ""];
        }
    }

    OS.$Template = class Template {
        static EXCLUDE_CHARS = ["@"];
        static COMMENT_CHARS = ["(#", "#)"];
        static CONTENT_CHARS = ["{{", "}}"];
        static SEGMENT_CHARS = ["($", "$)"];

        static get SAMPLES_TYPE() {
            return "/* ARVEX_COMPILED_TEMPLATE => */";
        }

        static get COMMENT_TYPE() {
            return Symbol.for("COMMENT");
        }

        static get INITIAL_TYPE() {
            return Symbol.for("INITIAL");
        }

        static get SEGMENT_TYPE() {
            return Symbol.for("SEGMENT");
        }

        static get CLASS_REGEX() {
            return /^(?:class\s+|function\s+(?:_class|_default|[A-Z]))/;
        }

        static get START_REGEX() {
            return OS.$Template.SEGMENT_CHARS[0].replace(/(\[|\(|\$)/g, "\\$1");
        }

        static get CLOSE_REGEX() {
            return OS.$Template.SEGMENT_CHARS[1].replace(/(\$|\)|\])/g, "\\$1");
        }

        static get ESCAPE_ARRAY() {
            return [new RegExp("s*(</?[ws=\"/.':;#-/?]+>)s*", "gi"), (_, i) => i.trim()];
        }

        static get QUOTES_ARRAY() {
            return ["(?<![\"'`])", "(?![\"'`])", "(?=(?:[^'\"`]|[\"'`][^'\"`]*[\"'`])*$)"];
        }

        static get SELF_ARRAY() {
            return [new RegExp(OS.$Template.QUOTES_ARRAY[0] + "(@self)" + OS.$Template.QUOTES_ARRAY[1], "g"), "$TEMPLATE_SELF"];
        }

        static get LOOP_ARRAY() {
            return [new RegExp(OS.$Template.QUOTES_ARRAY[0] + "(@loop)" + OS.$Template.QUOTES_ARRAY[1], "g"), "$TEMPLATE_LOOP"];
        }

        static get HELP_ARRAY() {
            return [new RegExp(OS.$Template.QUOTES_ARRAY[0] + "(@)" + OS.$Template.QUOTES_ARRAY[1], "g"), "$TEMPLATE_HELPERS."];
        }

        static get CHAINS_ARRAY() {
            return [new RegExp("([.]+[\\w\\d-_]+)" + OS.$Template.QUOTES_ARRAY[2], "g"), (obj) => "['" + obj.substring(1) + "']"];
        }

        static get LOGIC_TYPES() {
            return {
                //  ($ set name = "ahmed" $)
                set: (line) => "var " + line + ";",

                //  {{> name }}
                raw: (line) => "$TEMPLATE_TXT_OF(" + line + ");",
                //  {{ name }}
                echo: (line) => "$TEMPLATE_JSX_OF(" + line + ");",

                //  ($ until age > 10 $)
                until: (line) => "while(!(" + line + ")){",
                //  ($ enduntil $)
                enduntil: () => "}",

                //  ($ until age < 10 $)
                while: (line) => "while(" + line + "){",
                //  ($ endwhile $)
                endwhile: () => "}",

                //  ($ unless age < 10 $)
                unless: (line) => "if(!(" + line + ")){",
                //  ($ endunless $)
                endunless: () => "}",

                //  ($ each name into names $)
                each: (line) => {
                    var [arr, key, val] = OS.$Template.LOGIC_TYPES.$LOOP(line.split("into"));
                    return "$TEMPLATE_EACH(" + arr + ",function(" + key + "," + val + ", $TEMPLATE_LOOP){";
                },
                //  ($ endeach $)
                endeach: () => "});",

                //  ($ range idx into 0 to 10 $)
                range: (line) => {
                    var [arr, from, to] = OS.$Template.LOGIC_TYPES.$PROP(line.split("into"));
                    return "$TEMPLATE_RANGE(" + from + "," + to + ",function(" + arr + ", $TEMPLATE_LOOP){";
                },
                //  ($ endrange $)
                endrange: () => "});",

                //  ($ forelse name into names $)
                forelse: (line) => {
                    var [arr, key, val] = OS.$Template.LOGIC_TYPES.$LOOP(line.split("into"));
                    return "if($TEMPLATE_SIZE(" + arr + ")){$TEMPLATE_EACH(" + arr + ",function(" + key + "," + val + ", $TEMPLATE_LOOP){";
                },
                //  ($ empty $)
                empty: () => "})}else{",
                //  ($ endforelse $)
                endforelse: () => "}",

                //  ($ if age > 10 $)
                if: (line) => "if(" + line + "){",
                //  ($ elif age === 18 $)
                elif: (line) => "}else if(" + line + "){",
                //  ($ else $)
                else: () => "}else{",
                //  ($ endif $)
                endif: () => "}",

                //  ($ try $)
                try: () => "try{",
                //  ($ catch error $)
                catch: (line) => "}catch(" + line + "){",
                //  ($ finally $)
                finally: () => "}finally{",
                //  ($ endtry $)
                endtry: () => "}",

                //  ($ log name, age $)
                log: (line) => "console['log'](" + line + ");",
                //  ($ info name, age $)
                info: (line) => "console['info'](" + line + ");",
                //  ($ warn name, age $)
                warn: (line) => "console['warn'](" + line + ");",
                //  ($ error name, age $)
                error: (line) => "console['error'](" + line + ");",
                //  ($ debug name, age $)
                debug: (line) => "console['debug'](" + line + ");",

                $LOOP: (args) => {
                    var mth = /\[(.*),(.*)\]/g.exec(args[0]),
                        arr = args[1].trim(),
                        val = args[0].trim(),
                        key = "_";
                    return [arr, mth ? mth[1].trim() : key, mth ? mth[2].trim() : val];
                },
                $PROP: (args) => {
                    var mth = args[1].split("to"),
                        arr = args[0].trim();
                    return [arr, mth[0].trim(), mth[1].trim()];
                },
            };
        }

        constructor(partial, context) {
            this.helpers = { theme, random, truty, falsy };
            this.partial = this.scan(partial);
            this.context = context || {};
        }

        scan(partial) {
            return partial.startsWith(OS.$Template.SAMPLES_TYPE) ? partial.slice(OS.$Template.SAMPLES_TYPE.length) : OS.$Template.compile(partial);
        }

        string() {
            var template = this.build();
            return template
                .shift()
                .reduce((acc, part, i) => acc + part + (["string", "number", "boolean"].includes(typeof template[i]) ? template[i] : ""), "")
                .trim();
        }

        build() {
            return new Function("", this.partial)()(
                this.context,
                this.helpers,
                function $TEMPLATE_RANGE(start, finish, callback) {
                    finish = start < finish ? finish + 1 : finish - 1;
                    for (var i = start; start < finish ? i < finish : i > finish; start < finish ? i++ : i--) {
                        callback(i, {
                            index: i,
                            round: i + 1,
                            odd: i % 2 > 0,
                            even: i % 2 === 0,
                            first: i === start,
                            last: i === start < finish ? i - 1 : i + 1,
                        });
                    }
                },
                function $TEMPLATE_EACH(iterable, callback) {
                    if (iterable === null) {
                        return iterable;
                    }
                    var index = -1;
                    var key = Object.keys(iterable),
                        length = key.length,
                        count = 1;
                    while (++index < length) {
                        if (
                            callback(key[index], iterable[key[index]], {
                                index: index,
                                round: count,
                                odd: index % 2 > 0,
                                even: index % 2 === 0,
                                first: index === 0,
                                last: count === length,
                            }) === false
                        ) {
                            break;
                        }
                        count++;
                    }
                },
                function $TEMPLATE_SIZE(iterable) {
                    return verify(iterable, "array") ? iterable.length : verify(iterable, "object") ? Object.keys(iterable).length : null;
                },
                Error
            );
        }

        exec() {
            return new OS.$Parser(...this.build()).exec();
        }

        static replace(source, ...regex) {
            return regex.reduce((line, [reg, replace]) => line.replace(reg, replace), source);
        }

        static logic(source, linno, colno) {
            var args = this.replace(source, this.SELF_ARRAY, this.LOOP_ARRAY, this.HELP_ARRAY, this.CHAINS_ARRAY).split(" "),
                curs = "$TEMPLATE_LIN_NO=" + linno + ";$TEMPLATE_COL_NO=" + colno + ";",
                line = args.slice(1).join(" "),
                type = args[0];
            return this.LOGIC_TYPES[type] && this.LOGIC_TYPES[type](line) + curs;
        }

        static save(array, type, value, linno, colno) {
            array.push({
                value: type === this.SEGMENT_TYPE ? this.logic(value, linno, colno) : value,
                linno: linno,
                colno: colno,
                type: type,
            });
        }

        static same(source, needle, index) {
            const needleLength = needle.length;
            for (let i = 0; i < needleLength; i++) {
                if (source[index + i] !== needle[i]) {
                    return false;
                }
            }
            return true;
        }

        static size(source, index, ...needles) {
            const needlesLength = needles.length;
            for (let j = 0; j < needlesLength; j++) {
                if (this.same(source, needles[j], index)) return needles[j].length - 1;
            }
            return 1;
        }

        static reset(line, current, index, chars) {
            index = index + chars.length;
            line += current + chars;
            return [line, "", false, index];
        }

        static parse(source) {
            const array = [];
            var current = "",
                open = false,
                pass = false,
                linno = 1,
                colno = 1,
                size = 0,
                line = "";

            for (let index = 0; index < source.length; index++) {
                if (source[index] === "\n")(colno = 1), linno++;

                if (this.same(source, this.EXCLUDE_CHARS[0] + this.COMMENT_CHARS[0], index)) {
                    if (pass && (current += source[index])) continue;

                    [line, current, open, index] = this.reset(line, current, index, this.COMMENT_CHARS[0]);
                } else if (this.same(source, this.EXCLUDE_CHARS[0] + this.SEGMENT_CHARS[0], index)) {
                    if (pass && (current += source[index])) continue;

                    [line, current, open, index] = this.reset(line, current, index, this.SEGMENT_CHARS[0]);
                } else if (this.same(source, this.EXCLUDE_CHARS[0] + this.CONTENT_CHARS[0], index)) {
                    if (pass && (current += source[index])) continue;

                    [line, current, open, index] = this.reset(line, current, index, this.CONTENT_CHARS[0]);
                } else if (
                    this.same(source, this.COMMENT_CHARS[0], index) ||
                    this.same(source, this.SEGMENT_CHARS[0], index) ||
                    this.same(source, this.CONTENT_CHARS[0], index)
                ) {
                    if (pass && (current += source[index])) continue;

                    size = this.size(source, index, this.COMMENT_CHARS[0], this.SEGMENT_CHARS[0], this.CONTENT_CHARS[0]);

                    if (this.same(source, this.COMMENT_CHARS[0], index))(line += current), (pass = true);
                    else this.save(array, this.INITIAL_TYPE, line + current, linno, colno + size), (line = "");

                    (current = ""), (open = true), (index = index + size);
                } else if (this.same(source, this.COMMENT_CHARS[1], index)) {
                    size = this.size(source, index, this.COMMENT_CHARS[1]);

                    if (open) this.save(array, this.COMMENT_TYPE, current.trim(), linno, colno + size);
                    else line += current + this.COMMENT_CHARS[1];

                    (current = ""), (open = false), (pass = false), (index = index + size);
                } else if (this.same(source, this.SEGMENT_CHARS[1], index)) {
                    if (pass && (current += source[index])) continue;

                    size = this.size(source, index, this.SEGMENT_CHARS[1]);

                    if (open) this.save(array, this.SEGMENT_TYPE, current.trim(), linno, colno + size);
                    else line += current + this.SEGMENT_CHARS[1];

                    (current = ""), (open = false), (index = index + size);
                } else if (this.same(source, this.CONTENT_CHARS[1], index)) {
                    if (pass && (current += source[index])) continue;

                    size = this.size(source, index, this.CONTENT_CHARS[1]);

                    if (source[index + this.CONTENT_CHARS[1].length] === this.CONTENT_CHARS[1][1]) current += source[index];
                    else {
                        if (open) {
                            const src = current.trim()[0] === ">" ? "raw " + current.trim().slice(1) : "echo " + current.trim();
                            this.save(array, this.SEGMENT_TYPE, src, linno, colno + size);
                        } else line += current + this.CONTENT_CHARS[1];

                        (current = ""), (open = false), (index = index + size);
                    }
                } else {
                    current += source[index];
                }
                colno++;
            }

            this.save(array, this.INITIAL_TYPE, line + current, linno + 1, colno + 1);

            return array;
        }

        static compile(source) {
            const logic = this.parse(source.trim())
                .filter((e) => e.type !== this.COMMENT_TYPE)
                .reduce((script, line) => {
                    var seg = line || { value: "", linno: -1, colno: -1 };
                    var val =
                        seg.type === this.INITIAL_TYPE ?
                        "$TEMPLATE_TXT_OF(`" +
                        this.replace(seg.value, [/`/g, "\\`"]) +
                        "`);$TEMPLATE_LIN_NO=" +
                        seg.linno +
                        ";$TEMPLATE_COL_NO=" +
                        seg.colno +
                        ";" :
                        seg.value;
                    return script + val;
                }, "");

            return (
                this.SAMPLES_TYPE +
                "return function($TEMPLATE_SELF,$TEMPLATE_HELPERS,$TEMPLATE_RANGE,$TEMPLATE_EACH,$TEMPLATE_SIZE,$TEMPLATE_ERROR){var $TEMPLATE_TXT_AR=[],$TEMPLATE_JSX_AR=[],$TEMPLATE_INDEX=0,$TEMPLATE_LIN_NO=0,$TEMPLATE_COL_NO=0;function $TEMPLATE_TXT_OF($LINE){if(!$TEMPLATE_TXT_AR[$TEMPLATE_INDEX]){$TEMPLATE_TXT_AR[$TEMPLATE_INDEX]='';}$TEMPLATE_TXT_AR[$TEMPLATE_INDEX]=($TEMPLATE_TXT_AR[$TEMPLATE_INDEX]+$LINE).replace(/\\n(:?\\s*\\n)+/g,'\\n');}function $TEMPLATE_JSX_OF($LINE){$TEMPLATE_JSX_AR[$TEMPLATE_INDEX]=$TEMPLATE_ESCAPE($LINE);$TEMPLATE_INDEX++;};function $TEMPLATE_ESCAPE($LINE){var $MAP={'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;','\\'':'&#39;'};return typeof $LINE!=='string'?$LINE:$LINE.replace(/[&<>\"']/g,function($CHAR){return $MAP[$CHAR]})}with($TEMPLATE_SELF||{}){try{" +
                this.replace(logic, this.ESCAPE_ARRAY, [/(\n|\n\s+)/g, "\\n"], [/\s\s+/g, " "]) +
                "}catch(e){throw new $TEMPLATE_ERROR(e.message+'\" line: \"'+$TEMPLATE_LIN_NO+'\" pos: \"'+$TEMPLATE_COL_NO+'\"')}}return [$TEMPLATE_TXT_AR,...$TEMPLATE_JSX_AR]}"
            );
        }
    }

    OS.$Component = function Component(options) {
        const associated = options.ctl || false;
        const selector = options.tag || "";
        var template = options.tpl || "";
        var styles = options.css || [];

        template = OS.$Template.compile(template);
        styles = styles.map((style) => {
            return OS.$Template.compile(`<style>${style}</style>`)
        });

        return function(options) {
            options = verify(options, "undefined") ? {} : verify(options, "object") ? options : new options();
            const { attrs = [], props = {}, rules = {}, state = {}, setup = {} } = options;

            return class extends HTMLElement {
                static {
                    if (associated) this.formAssociated = true;
                }

                cache = {
                    drive: null,
                    props: {},
                    state: {},
                };

                setup = {
                    created: null,
                    mounted: null,
                    adopted: null,
                    updated: null,
                    removed: null,
                };

                props = {};
                state = {};
                rules = {};
                refs = {};

                static get selector() {
                    return selector;
                }

                static get instance() {
                    return "OS_COMPONENT_INSTANCE";
                }

                static get observedAttributes() {
                    return attrs;
                }

                static define(name) {
                    name = name || this.selector;
                    if (!customElements.get(name)) customElements.define(name, this);
                    return this;
                }

                constructor() {
                    super();

                    this.truty = truty;
                    this.falsy = falsy;
                    this.setter = setter.bind(this);
                    this.root = this.attachShadow({ mode: "open" });

                    if (associated) {
                        this.ctl = this.attachInternals();

                        Object.defineProperties(this, {
                            form: {
                                get: () => this.ctl.form,
                            },
                            name: {
                                get: () => this.getAttribute("name"),
                            },
                            validity: {
                                get: () => this.ctl.validity,
                            },
                            willValidate: {
                                get: () => this.ctl.willValidate,
                            },
                            validationMessage: {
                                get: () => this.ctl.validationMessage,
                            },
                        });

                        this.checkValidity = () => this.ctl.checkValidity();
                        this.reportValidity = () => this.ctl.reportValidity();
                    }

                    this.initialize();
                    this.render();

                    this.setup.created && this.setup.created();
                }

                attributeChangedCallback(name, oldValue, newValue) {
                    this.setup.updated && this.setup.updated(name, oldValue, newValue, "attrs");
                }

                connectedCallback() {
                    this.setup.mounted && this.setup.mounted();
                }

                disconnectedCallback() {
                    this.setup.removed && this.setup.removed();
                }

                adoptedCallback() {
                    this.setup.adopted && this.setup.adopted();
                }

                emit(name, data, callback) {
                    const ev = new CustomEvent(name, {
                        bubbles: true,
                        cancelable: true,
                        composed: true,
                        isTrusted: true,
                        detail: data,
                    });
                    Object.defineProperty(ev, "target", {
                        writable: false,
                        value: this,
                    });
                    this.dispatchEvent(ev);
                    if (!ev.defaultPrevented && callback) {
                        callback.bind(this)(ev);
                    }
                }

                initialize() {
                    Object.keys(props).forEach((property) => {
                        this.cache.props[property] = props[property];

                        Object.defineProperty(this.props, property, {
                            set: (newValue) => {
                                const oldValue = this.cache.props[property];
                                if (oldValue !== newValue) {
                                    this.cache.props[property] = newValue;

                                    this.render();
                                    this.setup.updated && this.setup.updated(property, oldValue, newValue, "props");
                                }
                            },
                            get: () => {
                                return this.cache.props[property];
                            },
                        });

                        Object.defineProperty(this, property, {
                            set: (newValue) => {
                                const oldValue = this.cache.props[property];
                                if (oldValue !== newValue) {
                                    this.cache.props[property] = newValue;

                                    this.render();
                                    this.setup.updated && this.setup.updated(property, oldValue, newValue, "props");
                                }
                            },
                            get: () => {
                                return this.cache.props[property];
                            },
                        });
                    });

                    Object.keys(state).forEach((current) => {
                        this.cache.state[current] = state[current];

                        Object.defineProperty(this.state, current, {
                            set: (newValue) => {
                                const oldValue = this.cache.state[current];
                                if (oldValue !== newValue) {
                                    this.cache.state[current] = newValue;

                                    this.render();
                                    this.setup.updated && this.setup.updated(current, oldValue, newValue, "state");
                                }
                            },
                            get: () => {
                                return this.cache.state[current];
                            },
                        });
                    });

                    Object.keys(rules).forEach((callable) => {
                        if (verify(rules[callable], "function")) {
                            this.rules[callable] = rules[callable].bind(this);
                        }
                    });

                    ["created", "mounted", "adopted", "updated", "removed"].forEach((callable) => {
                        this.setup[callable] = verify(setup[callable], "function") && setup[callable].bind(this);
                    });
                }

                render() {
                    const obj = {
                        props: this.cache.props,
                        state: this.cache.state,
                        rules: this.rules,
                        refs: this.refs,
                        this: this,
                    };

                    const CSS = styles
                        .map((style) => {
                            const CSS = new OS.$Template(style || "", obj);
                            CSS.helpers = {...CSS.helpers, ...obj };
                            return CSS.exec();
                        })
                        .flat();

                    const TPL = new OS.$Template(template || "", obj);
                    TPL.helpers = {...TPL.helpers, ...obj };

                    const tree = [...CSS, ...TPL.exec()];

                    if (!this.cache.drive) {
                        this.cache.drive = new OS.$Builder(this.root);
                        this.cache.drive.refs = this.refs;
                    }
                    this.cache.drive.exec(tree);
                }
            }
        };
    }
})();

OS.$Theme("colors", "OS-WHITE", "254 254 254");
OS.$Theme("colors", "OS-LIGHT", "245 245 245");
OS.$Theme("colors", "OS-SHADE", "209 209 209");
OS.$Theme("colors", "OS-PRIME", "33 150 243");
OS.$Theme("colors", "OS-BLACK", "29 29 29");

document.addEventListener("DOMContentLoaded", (e) => {
    OS$LOAD.forEach((callback) => callback(e));
});

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

OS.$Component.Wrapper.define() &&
    OS.$Component.Toaster.define() &&
    OS.$Component.Toast.define() &&
    OS.$Component.Sidebar.define() &&
    OS.$Component.Topbar.define() &&
    OS.$Component.Modal.define() &&
    OS.$Component.Dropdown.define() &&
    OS.$Component.Datatable.define() &&
    OS.$Component.Filter.define() &&
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