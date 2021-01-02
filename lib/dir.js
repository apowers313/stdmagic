const {magicStub} = require("./utilities");

let dirHistory = [];
let dirStack = [];

function cd(cmd, ... args) {
    // TODO: push onto dirHistory
    return this.exec("cd", ... args);
}

// TODO: %dhist: print dirHistory
// TODO: %pushd: push cwd onto directory stack
// TODO: %popd: pop from directory stack and chdir
// TODO: %bookmark: add / use directory bookmark

module.exports = [
    {
        name: "%cd",
        fn: cd,
    },
    magicStub("%dhist"), // Print your history of visited directories.
    magicStub("%dirs"), // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-dirs
    magicStub("%popd"),
    magicStub("%pushd"),
    magicStub("%bookmark"), // Manage IPython's bookmark system; named bookmark for a directory
];
