// TODO: %inspect, %loadjs
const {magicStub} = require("./utilities");
const {table} = require("table");
const humanize = require("humanize-anything");

function who() {
    let vars = getGlobalVars();
    console.log(vars.join("\t "));
}

function whos() {
    //  Variable   Type   Data/Info
    // -------------------------------
    //  beer       str    yum
    //  bob        str    nice
    //  x          int    3

    let vars = getGlobalVars();
    let varDetails = vars.map((varName) => {
        let value = eval(varName);
        return [varName, humanize.type(value), humanize(value)];
    });
    varDetails.unshift(["Variable", "Type", "Data/Info"]);

    let config = {
        border: {
            bodyLeft: "",
            bodyRight: "",
            bodyJoin: " ",

            joinBody: "-",
            joinLeft: "-",
            joinRight: "-",
            joinJoin: "-",

            bottomBody: "",
            bottomJoin: "",
            bottomLeft: "",
            bottomRight: "",
        },
        drawHorizontalLine: (index) => {
            return index === 1;
        },
    };

    let output = table(varDetails, config);

    console.log(output);
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
        name: "%who",
        fn: who,
    },
    {
        name: "%whos",
        fn: whos,
    },
    magicStub("%autoawait"), // wait for calls to finish
    magicStub("%debug"), // activate interactive debugger; use inspect?
    magicStub("%killbgscripts"), // Kill all BG processes started by %%script and its family.
    magicStub("%load"), // Load code into the current frontend; alias for %require
    magicStub("%run"), // run script
    magicStub("%who_ls"), // %who with variables returned as an array
    magicStub("%xdel"), // delete a variable -  https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-xdel
    // variable inspection
    magicStub("%pdef"), // print function definition - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pdef
    magicStub("%pdoc"), // print documentation - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pdoc
    magicStub("%pinfo"), // print info about an object - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pinfo
    magicStub("%pinfo2"), // print deteailed info about an object - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pinfo2
    magicStub("%psearch"), // Search for object in namespaces by wildcard
];
