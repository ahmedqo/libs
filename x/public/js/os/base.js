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