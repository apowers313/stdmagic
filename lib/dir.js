const {magicStub} = require("./utilities");

module.exports = [
    magicStub("%dhist"), // Print your history of visited directories.
    magicStub("%dirs"), // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-dirs
    magicStub("%popd"),
    magicStub("%pushd"),
    magicStub("%bookmark"), // Manage IPython's bookmark system; named bookmark for a directory
];
