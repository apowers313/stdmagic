const {magicStub} = require("./utilities");

function pip() {
    console.error("Hahaha... that's funny. This is node.js, use %npm. :)");
}

module.exports = [
    {
        name: "%pip",
        fn: pip,
    },
    // python stuff
    magicStub("%conda"),
    magicStub("%doctest_mode"), // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-doctest_mode
    magicStub("%gui"), // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-gui
    magicStub("%matplotlib"),
    magicStub("%prun"), // Run a statement through the python code profiler
    magicStub("%pdb"), // python debugger - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pdb
    magicStub("%pycat"), // Show a syntax-highlighted file through a pager
    magicStub("%pylab"), // Load numpy and matplotlib - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pylab
    magicStub("%qtconsole"),
    magicStub("%load_ext"),
    magicStub("%reload_ext"),
    magicStub("%unload_ext"), // unload Python extension
    magicStub("%loadpy"), // alias of %load
];
