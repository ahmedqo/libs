const Csv = (function() {
    function $parse(cell) {
        let parsedValue = cell.textContent.trim().replace(/\s{2,}/g, " ");
        parsedValue = parsedValue.replace(/"/g, `""`);
        if (/[",\n]/.test(parsedValue)) {
            parsedValue = `"${parsedValue}"`;
        }
        return parsedValue;
    }

    function $convert(rows, remove) {
        const lines = [];
        for (const row of rows) {
            const values = [];
            for (let cell = 0; cell < [...row.cells].length; cell++) {
                if (remove.includes(cell)) continue;
                values.push($parse(row.cells[cell]));
            }
            lines.push(values.join(","));
        }
        return lines.join("\n");
    }

    function Csv(target, { trigger, exec = false, remove = [] }) {
        const rows = document.querySelector(target + "tr");

        function $callable() {
            const csvOutput = $convert(rows, remove);
            const csvBlob = new Blob([csvOutput], {
                type: "text/csv",
            });
            const blobUrl = URL.createObjectURL(csvBlob);
            const anchorElement = document.createElement("a");
            anchorElement.href = blobUrl;
            anchorElement.click();
            anchorElement.remove();
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 500);
        }
        exec && $callable();

        trigger && document.querySelectorAll(trigger).forEach((el) => el.addEventListener("click", $callable));
    }

    return Csv;
})();

const Pdf = (function() {
    function $template(opts) {
        const { lang, dir, size, margin, css, page } = opts;
        return `<!DOCTYPE html><html lang="${lang}"dir="${dir}"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible"content="IE=edge"/><meta name="viewport"content="width=device-width, initial-scale=1.0"/><style>@page{size:${size.page};margin:${margin}}#page{width:100%}#head{height:${size.head}}#foot{height:${size.foot}}</style>${css}</head><body><table id="page"><thead><tr><td><div id="head"></div></td></tr></thead><tbody><tr><td><main id="main">${page}</main></td></tr></tbody><tfoot><tr><td><div id=foot></div></td></tr></tfoot></table></body></html>`;
    }

    function Pdf(target, { trigger = null, clear = true, exec = false } = {}) {
        const page = document.querySelector(target);

        function $callable() {
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(
                $template({
                    ...Pdf.opts,
                    page: page.innerHTML,
                    css: Pdf.opts.css.join(""),
                })
            );
            iframeDoc.close();
            iframe.onload = function() {
                iframe.contentWindow.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            };
        }
        clear && page.remove();
        exec && $callable();

        trigger && document.querySelectorAll(trigger).forEach((el) => el.addEventListener("click", $callable));
    }

    Pdf.opts = {
        bg: "",
        css: [],
        dir: "ltr",
        lang: "en",
        size: {
            page: "A4",
            head: 0,
            foot: 0,
        },
        margin: "5mm 5mm 5mm 5mm",
    };

    return Pdf;
})();