module.exports = [
    ... require("./lib/cellMagics"),
    ... require("./lib/dir"),
    ... require("./lib/jupyter"),
    ... require("./lib/node"),
    ... require("./lib/python"),
    ... require("./lib/perf"),
    ... require("./lib/shell"),
];

if (typeof global.$$ === "object" && typeof global.$$.addMagic === "function") {
    /* global $$ */
    module.exports.forEach((v) => {
        $$.addMagic(v.name, v);
    });
}
