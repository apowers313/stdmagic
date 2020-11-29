const {magicStub} = require("./utilities");

// TODO: replace these with %alias

function transpileCat(cmd, ... args) {
    return this.exec("cat", ... args);
}

function transpileCd(cmd, ... args) {
    return this.exec("cd", ... args);
}

function transpileCp(cmd, ... args) {
    return this.exec("cp", ... args);
}

function transpileLs(cmd, ... args) {
    return this.exec("ls", ... args);
}

function transpilePwd(cmd, ... args) {
    return this.exec("pwd", ... args);
}

function transpileRm(cmd, ... args) {
    return this.exec("rm", ... args);
}

function transpileRmdir(cmd, ... args) {
    return this.exec("rmdir", ... args);
}

function transpileMv(cmd, ... args) {
    return this.exec("mv", ... args);
}

function transpileMkdir(cmd, ... args) {
    return this.exec("mkdir", ... args);
}

module.exports = [
    magicStub("%alias"), // alias to shell command
    magicStub("%unalias"),
    {
        cmd: "add",
        name: "%cat",
        fn: transpileCat,
    },
    {
        cmd: "add",
        name: "%cd",
        fn: transpileCd,
    },
    {
        cmd: "add",
        name: "%cp",
        fn: transpileCp,
    },
    {
        cmd: "add",
        name: "%ls",
        fn: transpileLs,
    },
    {
        cmd: "add",
        name: "%pwd",
        fn: transpilePwd,
    },
    {
        cmd: "add",
        name: "%rm",
        fn: transpileRm,
    },
    {
        cmd: "add",
        name: "%rmdir",
        fn: transpileRmdir,
    },
    {
        cmd: "add",
        name: "%mkdir",
        fn: transpileMkdir,
    },
    {
        cmd: "add",
        name: "%mv",
        fn: transpileMv,
    },
];
