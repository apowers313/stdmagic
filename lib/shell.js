const {magicStub} = require("./utilities");

// TODO: replace these with %alias

function cat(cmd, ... args) {
    return this.exec("cat", ... args);
}

function cd(cmd, ... args) {
    return this.exec("cd", ... args);
}

function cp(cmd, ... args) {
    return this.exec("cp", ... args);
}

function ls(cmd, ... args) {
    return this.exec("ls", ... args);
}

function pwd(cmd, ... args) {
    return this.exec("pwd", ... args);
}

function rm(cmd, ... args) {
    return this.exec("rm", ... args);
}

function rmdir(cmd, ... args) {
    return this.exec("rmdir", ... args);
}

function mv(cmd, ... args) {
    return this.exec("mv", ... args);
}

function mkdir(cmd, ... args) {
    return this.exec("mkdir", ... args);
}

module.exports = [
    magicStub("%alias"), // alias to shell command
    magicStub("%unalias"),
    {
        name: "%cat",
        fn: cat,
    },
    {
        name: "%cd",
        fn: cd,
    },
    {
        name: "%cp",
        fn: cp,
    },
    {
        name: "%ls",
        fn: ls,
    },
    {
        name: "%pwd",
        fn: pwd,
    },
    {
        name: "%rm",
        fn: rm,
    },
    {
        name: "%rmdir",
        fn: rmdir,
    },
    {
        name: "%mkdir",
        fn: mkdir,
    },
    {
        name: "%mv",
        fn: mv,
    },

    magicStub("%env"), // list / set environment: https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-env
    magicStub("%ldir"), // ls, only show directories
    magicStub("%lf"), // ls, only show files
    magicStub("%lk"),
    magicStub("%ll"),
    magicStub("%lx"),
    magicStub("%man"), // Find the man page for the given command and display in pager.
    magicStub("%rehashx"), // Update the alias table with all executable files in $PATH.
    magicStub("%set_env"), // set environment: https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-set_env
    magicStub("%sc"), // shell capture: https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-sc
    magicStub("%sx"), // shell execute: https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-sx
    magicStub("%system"), // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-system
];
