// s = `<div class="bg-green-500 bg-red-500"></div>`
function Slider(els, opts = {}) {
    var position,
        action = 0;

    function Instance() {
        this.actions = {};
        this.wrap = typeof els.wrap === "string" ? document.querySelector(els.wrap) : els.wrap;
        this.list = this.wrap.querySelector("ul");
        this.wrap.style.touchAction = "none";
        this.wrap.style.overflow = "hidden";
        this.list.style.display = "flex";
        this.wrap.style.direction = "ltr";
        this.list.style.direction = "ltr";
        this.current = {
            value: 0,
        };

        this.change = (fn) => {
            this.actions.change = fn;
        };

        this.update = (opt = {}) => {
            const options = {
                ...opts,
                ...opt,
            };
            this.infinite = options.infinite || false;
            this.vert = options.vert || false;
            this.auto = options.auto || false;
            this.size = options.size || false;
            this.flip = options.flip || false;
            this.touch = options.touch || false;
            this.time = options.time || 5000;
            this.move = options.move || 1;
            this.cols = options.cols || 1;
            this.gap = options.gap || 0;

            if (this.infinite) {
                [...this.list.children].map((e) => e.isCloned && e.remove());

                const len = this.list.children.length;
                const firsts = [...this.list.children].reduce((a, e, i) => {
                    if (i < this.cols) {
                        const x = e.cloneNode(true);
                        x.setAttribute("x-clone", "");
                        a.push(x);
                    }
                    return a;
                }, []);
                const lasts = [...this.list.children].reduce((a, e, i) => {
                    if (i > len - this.cols - 1) {
                        const x = e.cloneNode(true);
                        x.setAttribute("x-clone", "");
                        a.push(x);
                    }
                    return a;
                }, []);

                if (firsts.length) {
                    for (let i = 0; i < this.cols; i++) {
                        const current = firsts[i];
                        this.list.insertAdjacentElement("beforeend", current);
                        current.isCloned = true;
                    }
                }

                if (lasts.length)
                    for (let i = this.cols; i > 0; i--) {
                        const current = lasts[i - 1];
                        this.list.insertAdjacentElement("afterbegin", current);
                        current.isCloned = true;
                    }
            }

            this.items = [...this.list.children];
            this.length = this.items.length;

            this.__opt = this.vert ? {
                size: "clientHeight",
                item: "height",
                scroll: "scrollTop",
                pos: "clientY",
            } : {
                size: "clientWidth",
                item: "width",
                scroll: "scrollLeft",
                pos: "clientX",
            };

            this.size ?
                (this.wrap.style[this.__opt.item] = this.size * this.cols + this.gap * (this.cols - 1) + "px") :
                (this.wrap.style[this.__opt.item] = "100%");

            this.list.style.width = "";
            this.list.style.flexDirection = "";
            this.list.style.width = "";
            this.list.style.height = "";

            this.vert ?
                (this.list.style.width = "100%") && (this.list.style.flexDirection = "column") :
                (this.list.style.width = "max-content") && (this.list.style.height = "100%");

            this.itemSize = this.wrap[this.__opt.size] / this.cols - (this.gap * (this.cols - 1)) / this.cols;
            this.scrollLength = this.itemSize + this.gap;
            this.list.style.gap = this.gap + "px";

            for (let i = 0; i < this.length; i++) {
                this.items[i].style[this.__opt.item] = this.itemSize + "px";
            }

            if (this.infinite) {
                if (!this.__isLunched && this.current.value === 0) {
                    this.current.value = this.cols * this.move;
                    window.onresize = this.update;
                    this.__isLunched = true;
                }
            }

            this.wrap.style.scrollBehavior = "unset";
            this.wrap[this.__opt.scroll] = this.scrollLength * this.current.value;
            this.wrap.style.scrollBehavior = "smooth";

            this.scrollAuto();
            this.scrollTouch();
        };

        this.resize = (fn_true = () => {}, fn_false = () => {}, condistion = "(min-width: 1024px)") => {
            const fn = () => {
                if (window.matchMedia(condistion).matches) fn_true(this);
                else fn_false(this);
            };
            window.addEventListener("resize", fn);
            fn();
        };

        this.scroll = () => {
            this.wrap[this.__opt.scroll] = this.scrollLength * this.current.value;
            this.actions.change && this.actions.change(this);
        };

        this.scrollTo = (idx) => {
            this.current.value = idx;
            this.scroll();
        };

        this.scrollNext = () => {
            this.scrollAuto();
            if (this.current.value >= this.length - this.cols) {
                if (this.infinite) {
                    this.wrap.style.scrollBehavior = "unset";
                    this.current.value = this.cols;
                    this.scroll();
                    this.current.value += this.move;
                    this.wrap.style.scrollBehavior = "smooth";
                } else this.current.value = 0;
            } else this.current.value += this.move;
            this.scroll();
        };

        this.scrollPrev = () => {
            this.scrollAuto();
            if (this.current.value <= 0) {
                if (this.infinite) {
                    this.wrap.style.scrollBehavior = "unset";
                    this.current.value = this.length - this.cols - this.cols;
                    this.scroll();
                    this.current.value -= this.move;
                    this.wrap.style.scrollBehavior = "smooth";
                } else this.current.value = this.length - this.cols;
            } else this.current.value -= this.move;
            this.scroll();
        };

        this.scrollAuto = () => {
            if (this.auto) {
                const repeatOften = () => {
                    clearTimeout(this.__timer);
                    this.__timer = setTimeout(() => {
                        this.flip ? this.scrollPrev() : this.scrollNext();
                        requestAnimationFrame(repeatOften);
                    }, this.time);
                };
                requestAnimationFrame(repeatOften);
            } else {
                clearTimeout(this.__timer);
            }
        };

        this.scrollTouch = () => {
            if (this.touch) {
                var fn;
                this.wrap.onpointerdown = (e) => {
                    e.preventDefault();
                    if (action === 0) {
                        action = 1;
                        position = e[this.__opt.pos];
                    }

                    const handleMove = (e) => {
                        e.preventDefault();
                        fn = e[this.__opt.pos] >= position ? this.scrollPrev : this.scrollNext;
                        if (action === 1) {
                            action = 2;
                        }
                    };

                    const handleUp = (e) => {
                        e.preventDefault();
                        fn && fn();
                        if (action === 2) action = 0;
                        this.wrap.onpointermove = null;
                        this.wrap.onpointerup = null;
                    };

                    this.wrap.onpointermove = handleMove;
                    this.wrap.onpointerup = handleUp;
                };
            } else {
                this.wrap.onpointerdown = null;
            }
        };

        if (els.prev) {
            this.prev = typeof els.prev === "string" ? document.querySelector(els.prev) : els.prev;
            this.prev.onclick = this.scrollPrev;
        }

        if (els.next) {
            this.next = typeof els.next === "string" ? document.querySelector(els.next) : els.next;
            this.next.onclick = this.scrollNext;
        }

        this.update();
    }

    return new Instance();
}

function Counter(selector) {
    document.querySelectorAll(selector).forEach((qte) => {
        const sub = qte.querySelector('[counter="-"]');
        const inp = qte.querySelector('[counter="x"]');
        const add = qte.querySelector('[counter="+"]');

        sub.addEventListener("click", (e) => {
            e.preventDefault();
            const num = +inp.value || 2;
            inp.value = num > 1 ? num - 1 : 1;
        });

        inp.addEventListener("input", (e) => {
            e.preventDefault();
            const num = +inp.value || 1;
            inp.value = num;
        });

        add.addEventListener("click", (e) => {
            e.preventDefault();
            const num = +inp.value || 0;
            inp.value = num + 1;
        });
    });
}

function Format(num) {
    return Intl.NumberFormat().format(num, { currency: "" }).trim();
}

function Size(div) {
    const divWidth = div.clientWidth;
    const fontSize = parseInt(window.getComputedStyle(div).fontSize);
    return Math.floor(divWidth / (fontSize * 0.3));
}

function InitBase() {
    x.Toggle();
    x.Toggle.disable({
        xs: [{
                selector: "#languages",
                class: "opacity-0",
            },
            {
                selector: "#navigation",
                class: "opacity-0",
            },
        ],
        lg: [{
            selector: "#navigation",
            class: "0000",
        }, ],
    });

    const resetText = (function resetText() {
        const dataText = document.querySelectorAll("[data-size]");
        dataText.forEach((element) => {
            var dataSize = element.dataset.size;
            if (dataSize) {
                element.style.setProperty("-webkit-line-clamp", dataSize);
            }
        });
        return resetText;
    })();

    const tabTriggers = document.querySelectorAll("[data-tab]");
    const tabContents = document.querySelectorAll("[data-tabs]");

    tabTriggers.forEach((trigger) => {
        const target = trigger.dataset.tab;
        trigger.addEventListener("click", (e) => {
            trigger.classList.add("!border-x-prime", "!border-b-white");
            tabTriggers.forEach((trig) => {
                if (trig !== trigger) {
                    trig.classList.remove("!border-x-prime", "!border-b-white");
                }
            });
            tabContents.forEach((content) => {
                const tab = content.dataset.tabs;
                if (tab === target) {
                    content.classList.remove("hidden");
                    content.classList.add("grid");
                } else {
                    content.classList.remove("grid");
                    content.classList.add("hidden");
                }
            });
            resetText();
        });
    });
    window.addEventListener("resize", resetText);

    const nav = document.querySelector("#navigation");
    const ser = document.querySelector("#search");
    nav.addEventListener("click", (e) => {
        if (e.target === nav && !nav.classList.contains("opacity-0")) {
            nav.classList.add("opacity-0");
            nav.classList.add("-translate-x-full");
            nav.classList.add("pointer-events-none");
            nav.classList.add("rtl:translate-x-full");
        }
    });
    nav.children[0].addEventListener("click", (e) => {
        e.stopPropagation();
    });
    ser.addEventListener("click", (e) => {
        if (e.target === ser && !ser.classList.contains("opacity-0")) {
            ser.classList.add("opacity-0");
            ser.classList.add("-translate-y-full");
            ser.classList.add("pointer-events-none");
        }
    });
    ser.children[0].addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

function InitHome(rtl, PLength, BLength) {
    const dots = document.querySelectorAll(".dots");
    const slides = Slider({
        wrap: "#slides",
    }, {
        flip: rtl ? true : false,
        auto: true,
        time: 5000,
        touch: true,
    });

    slides.resize(
        ($) => {
            $.update({});
        },
        ($) => {
            $.update({});
        }
    );

    slides.change(function($) {
        dots.forEach(dot => dot.classList.remove("!bg-x-prime"));
        dots[$.current.value].classList.add("!bg-x-prime");
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", e => {
            slides.scrollAuto();
            slides.scrollTo(i);
        });
    });

    const products = document.querySelector("#products").parentElement;
    Slider({
        wrap: "#products",
    }, {
        flip: rtl ? true : false,
        time: 5000,
        gap: 16,
    }).resize(
        ($) => {
            const size = products.clientWidth / 4;
            $.update({
                ...(PLength < 4 ? {
                    infinite: false,
                    touch: false,
                    auto: false,
                    cols: PLength,
                    size: size,
                } : {
                    infinite: true,
                    touch: true,
                    auto: true,
                    cols: 4,
                    size: false,
                }),
            });
        },
        ($) => {
            const size = products.clientWidth / 2;
            $.update({
                ...(PLength < 2 ? {
                    infinite: false,
                    touch: false,
                    auto: false,
                    cols: PLength,
                    size: size,
                } : {
                    infinite: true,
                    touch: true,
                    auto: true,
                    cols: 2,
                    size: false,
                }),
            });
        }
    );

    const brands = document.querySelector("#brands").parentElement;
    Slider({
        wrap: "#brands",
    }, {
        flip: rtl ? true : false,
        time: 5000,
        gap: 16,
    }).resize(
        ($) => {
            const size = brands.clientWidth / 6;
            $.update({
                ...(BLength < 6 ? {
                    infinite: false,
                    touch: false,
                    auto: false,
                    cols: BLength,
                    size: size,
                } : {
                    infinite: true,
                    touch: true,
                    auto: true,
                    cols: 6,
                    size: false,
                }),
            });
        },
        ($) => {
            const size = brands.clientWidth / 2;
            $.update({
                ...(BLength < 2 ? {
                    infinite: false,
                    touch: false,
                    auto: false,
                    cols: BLength,
                    size: size,
                } : {
                    infinite: true,
                    touch: true,
                    auto: true,
                    cols: 2,
                    size: false,
                }),
            });
        }
    );
}

function InitProduct(rtl) {
    Counter("#counter");
    Slider({
        wrap: "#slide",
        next: "#next",
        prev: "#prev",
    }, {
        flip: rtl ? true : false,
        auto: true,
        time: 5000,
        touch: true,
        infinite: true,
    });
}