/* eslint-disable jsdoc/require-jsdoc */
const {assert} = require("chai");
const cmdList = require("../../index");
const stdMocks = require("std-mocks");

function getCmd(name) {
    assert.isArray(cmdList);
    assert.isTrue(cmdList.length > 0);
    let cmd = cmdList.filter((c) => c.name === name);
    if (cmd.length !== 1 || cmd[0].name !== name) {
        throw new TypeError(`command not found: ${name}`);
    }

    cmd = cmd[0];
    assert.isFunction(cmd.fn);

    return cmd.fn.bind(ctx);
}

function runCmd(name, ... args) {
    let fn = getCmd(name);
    assert.isFunction(fn);
    let code = fn(... args);
    assert.isString(code);
    stdMocks.use();
    eval(code);
    stdMocks.restore();
    let output = stdMocks.flush();
    assert.isObject(output);
    assert.isArray(output.stdout);
    assert.isArray(output.stderr);
    return output;
}

module.exports = {
    getCmd,
    runCmd,
};

// part of ijavascriptex that we have to mock here
let cmdMap = new Map();

// converts the __ijavascriptex_sh_exec function a string and sends it to the client
function transpileExec(cmd, ... args) {
    if (/^!$/.test(cmd)) {
        // cmd was "! foo bar", drop the first "!"
        cmd = args.shift();
    } else {
        // strip leading "!"
        cmd = cmd.substring(1);
    }

    let ret = `${__ijavascriptex_sh_exec.toString()}\n`;
    args = args.map((arg) => `"${arg}"`).join(",");
    ret += `__ijavascriptex_sh_exec("(jupyter)", "${cmd}"${args.length > 0 ? ", " : ""}${args});`;
    return ret;
}

// run a shell command
function __ijavascriptex_sh_exec(argv0, cmd, ... args) {
    return new Promise((resolve, reject) => {
        const {spawn} = require("child_process");

        let opts = {
            shell: true,
            argv0: argv0,
            // stdio: "inherit",
            // timeout: 60000,
        };

        let proc = spawn(cmd, args, opts);

        proc.stdout.on("data", (data) => {
            console.log(`${data}`);
        });

        proc.stderr.on("data", (data) => {
            console.error(`${data}`);
        });

        proc.on("exit", (code) => {
            console.log(`[ process '${cmd}${args.length ? " " : ""}${args.join(" ")}' exited with code ${code} ]`);
            if (code === 0) {
                resolve(code);
            } else {
                reject(code);
            }
        });
    });
}

function cleanStr(str) {
    return str
        .replace(/\\/g, "\\\\")
        .replace(/"/g, "\\\"")
        .replace(/\n/g, "\\n");
}

function msg(str) {
    str = cleanStr(str);
    return `console.log("${str}");`;
}

function errmsg(str) {
    str = cleanStr(str);
    return `console.error("${str}");`;
}

function varSubst(str) {
    let ret;
    let varOnlyRegExp = /^{(?<varName>[^{}])}$/; // looks like "{var}"
    let varOnly = str.match(varOnlyRegExp);
    if (varOnly) {
        // console.log("varOnly", varOnly);
        ret = `eval("${varOnly.groups.varName}")`;
    } else {
        let varMatch = /{[^{}]}/g; // looks like "something{var1}something{var2}{var3}something..."
        ret = str.replace(varMatch, (v) => `$${v}`);
        ret = `\`${ret}\``;
    }

    return ret;
}

let ctx = {
    exec: transpileExec.bind("(jupyter exec)", "!"),
    cmdMap: cmdMap,
    varSubst: varSubst,
    cleanStr: cleanStr,
    errmsg: errmsg,
    msg: msg,
    kernel: null, // ut-oh...
};
