// magicStub("%who"), // inspect variable
// magicStub("%who_ls"),
// magicStub("%whos"),
// %inspect
const util = require("util");

function transpileWho() {
    let vars = getGlobalVars();
    return this.msg(vars.join("\t "));
}

function transpileWhos() {
    let vars = getGlobalVars();
    // let varDetails = vars.map((v) => [v, typeof v, util.inspect(v, {maxStringLength: 10}).replace("\n", "")]);
    // printTable(["var", "type", "value"], varDetails);
    // let varsDesc = {};
    // vars.forEach((v) => {
    //     varsDesc[v] = {
    //         type: typeof v,
    //         value: util.inspect(v, {maxStringLength: 10}).replace("\n", "").substr(0, 10),
    //     };
    // });
    let varDetails = vars.map((v) => {
        return {
            var: v,
            type: typeof v,
            // value:
        };
    });
}

function printTable(header, values) {
    let colWidth = values[0].map(() => 0);
    let colNum = values[0].length;
    const padding = 3;

    for (let col = 0; col < colNum; col++) {
        for (let row in values) {
            if (row[col].length > colWidth[col]) {
                colWidth[col] = row[col].length;
            }
        }
    }

    colWidth = colWidth.map((v) => v + padding);

    // TODO: print header
    // TODO: print cross-bar

    for (let row in values) {
        let rowStr = "";
        for (let col in row) {
            let pad = colWidth[col];
        }
    }
}

let globalVarsFilter = new Set([
    "$$",
    "$$done$$",
    "$$mimer$$",
    "__dirname",
    "__filename",
    "clearImmediate",
    "clearInterval",
    "clearTimeout",
    "console",
    "exports",
    "global",
    "module",
    "queueMicrotask",
    "require",
    "setImmediate",
    "setInterval",
    "setTimeout",
]);
function getGlobalVars() {
    let ret = [];
    for (let key of Object.keys(global)) {
        if (!globalVarsFilter.has(key)) {
            ret.push(key);
        }
    }

    ret = ret.sort();
    return ret;
}

module.exports = [
    {
        cmd: "add",
        name: "%who",
        function: transpileWho,
    },
    {
        cmd: "add",
        name: "%whos",
        function: transpileWhos,
    },
];
