const {magicStub} = require("./utilities");

function transpilePip() {
    return this.errmsg("Hahaha... that's funny. This is node.js, use %npm. :)");
}

function transpilePing() {
    return this.msg("pong");
}

function transpileLsMagic(... args) {
    args.shift(); // remove %lsmagic
    let cmds = [... this.cmdMap.entries()];
    cmds = cmds
        // filter out stubs
        .filter((ent) => !ent[1].stub)
        // just use the names
        .map((ent) => ent[0])
        // sort alphabetically
        .sort();
    let cmdStr = cmds.join(" ");
    return this.msg(`Available line magics:\n${cmdStr}`);
}

function transpileInspect(cmd, varName) {
    // TODO: validate args

    // https://nodejs.org/api/process.html#process_process_send_message_sendhandle_options_callback
    // The message goes through serialization and parsing. The resulting message might not be the same as what is originally sent.

    new Promise((resolve, reject) => {
        let {kernel} = this;
        let callbacks = {
            OnInspectionSuccessCB: function(... args) {
                console.log("OnInspectionSuccessCB", ... args);
            },
            OnErrorCB: function(... args) {
                console.log("OnErrorCB", ... args);
            },
            BeforeRunCB: function(... args) {
                console.log("BeforeRunCB", ... args);
            },
            AfterRunCB: function(... args) {
                console.log("AfterRunCB", ... args);
            },
            onSuccess: function(... args) {
                console.log("onSuccess", ... args);
                resolve(args[0]);
            },
            beforeRun: function(... args) {
                console.log("beforeRun", ... args);
            },
            afterRun: function(... args) {
                console.log("afterRun", ... args);
            },
            onError: function(... args) {
                console.log("onError", ... args);
                reject(args);
            },
            onStdout: function(... args) {
                console.log("onStdout", ... args);
            },
        };
        kernel.session.inspect(varName, varName.length, callbacks);
    }).then((ret) => {
        console.log("varInspect completed successfully.");
        console.log("varInspect", ret);
        let v = ret.inspection.value;
        console.log("varInspect value", v);
        if (typeof v === "object") {
            console.log("v.map", v.map);
            console.log("v.rx", v.rx);
            // console.log("v.map.has(wine)", v.map.has("wine"));
        }
    }).catch((err) => {
        console.error("varInspect failed:");
        console.error(err);
    });

    return this.msg("varInspect running...");
}

module.exports = [
    {
        cmd: "add",
        name: "%ping",
        fn: transpilePing,
    },
    {
        cmd: "add",
        name: "%pip",
        fn: transpilePip,
    },
    {
        cmd: "add",
        name: "%lsmagic",
        fn: transpileLsMagic,
    },
    // {
    //     cmd: "add",
    //     name: "%inspect",
    //     fn: transpileInspect,
    // },

    // %report // display version information of OS, npm, node, packages, etc. for reproducability purposes
    // %update
    // %npm

    // jupyter shell & sweeteners
    magicStub("%alias_magic"), // alias to existing magic
    magicStub("%automagic"), // enable calling magics without leading %
    magicStub("%autocall"), // enable function calls without parens
    magicStub("%autosave"), // Set the autosave interval in the notebook (in seconds).
    magicStub("%colors"), // set color pallet; TODO: how to do colors?
    magicStub("%config"), // mange configuration
    magicStub("%connect_info"), // prints connection info JSON
    // history not implemented in protocol
    // https://github.com/n-riesco/jp-kernel/blob/0bc2665470bfd2350ef8d0450b4a4c48f865904c/lib/handlers_v5.js#L340
    magicStub("%history"), // command history
    magicStub("%hist"), // same as %history
    magicStub("%macro"), // Define a macro for future re-execution. It accepts ranges of history, filenames or string objects.
    magicStub("%magic"), // list all magic commands and their help
    magicStub("%notebook"), // export the current IPython history to a notebook file
    magicStub("%pastebin"), // Upload code to dpaste's paste bin, returning the URL.
    magicStub("%pprint"), // toggle pretty printing
    magicStub("%precision"), // Set floating point precision for pretty printing
    magicStub("%recall"), // recall output to command line - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-recall
    magicStub("%rep"), // same as %recall

    // jupyter kernel
    magicStub("%store"), // store / recall variable for reference across notebooks
    magicStub("%reset"), // reset everything: variables, histories, etc.
    magicStub("%reset_selective"), // alias for %reset
    magicStub("%rerun"), // Re-run previous input
    magicStub("%save"), // save lines or a macro to a file

    // jupyter pager
    // paging not implemented in protocol in jp-kernel
    // https://github.com/n-riesco/jp-kernel/blob/0bc2665470bfd2350ef8d0450b4a4c48f865904c/lib/handlers_v5.js
    magicStub("%more"), // display information in IPython pager
    magicStub("%less"),
    magicStub("%pfile"),
    magicStub("%psource"), // Print (or run through pager) the source code for an object.
    magicStub("%page"), // Pretty print the object and display it through a pager.

    // logging
    magicStub("%logoff"), // Temporarily stop logging
    magicStub("%logon"), // Restart logging
    magicStub("%logstart"), // Start logging anywhere in a session.
    magicStub("%logstate"),
    magicStub("%logstop"),

    // useless?
    magicStub("%clear"), // clear the terminal

    // magics
    magicStub("%quickref"), // show a magic quick reference sheet

    // exception management
    magicStub("%xmode"), // switch modes for exception handlers - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-xmode
    magicStub("%tb"), // print last traceback - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-tb

    // shell stuff
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

    // directory management
    magicStub("%dhist"), // Print your history of visited directories.
    magicStub("%dirs"), // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-dirs
    magicStub("%popd"),
    magicStub("%pushd"),
    magicStub("%bookmark"), // Manage IPython's bookmark system; named bookmark for a directory

    // editor support
    magicStub("%edit"), // open editor, edit a file, save results into window
    magicStub("%ed"), // alias for %edit

    // nodejs
    magicStub("%autoawait"), // wait for calls to finish
    magicStub("%debug"), // activate interactive debugger; use inspect?
    magicStub("%killbgscripts"), // Kill all BG processes started by %%script and its family.
    magicStub("%load"), // Load code into the current frontend; alias for %require
    magicStub("%prun"), // Run a statement through the python code profiler
    magicStub("%run"), // run script
    // %require, %loadjs
    magicStub("%xdel"), // delete a variable -  https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-xdel

    // variable inspection
    magicStub("%pdef"), // print function definition - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pdef
    magicStub("%pdoc"), // print documentation - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pdoc
    magicStub("%pinfo"), // print info about an object - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pinfo
    magicStub("%pinfo2"), // print deteailed info about an object - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pinfo2
    magicStub("%psearch"), // Search for object in namespaces by wildcard

    // python stuff
    magicStub("%conda"),
    magicStub("%doctest_mode"), // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-doctest_mode
    magicStub("%gui"), // https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-gui
    magicStub("%matplotlib"),
    magicStub("%pdb"), // python debugger - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pdb
    magicStub("%pycat"), // Show a syntax-highlighted file through a pager
    magicStub("%pylab"), // Load numpy and matplotlib - https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-pylab
    magicStub("%qtconsole"),
    magicStub("%load_ext"),
    magicStub("%reload_ext"),
    magicStub("%unload_ext"), // unload Python extension
    magicStub("%loadpy"), // alias of %load

    // performance tuning
    magicStub("%time"),
    magicStub("%timeit"),

    // Cell Magics
    magicStub("%%!"),
    magicStub("%%bash"),
    magicStub("%%capture"),
    magicStub("%%debug"),
    magicStub("%%file"),
    magicStub("%%html"),
    magicStub("%%HTML"),
    magicStub("%%javascript"),
    magicStub("%%js"),
    magicStub("%%latex"),
    magicStub("%%markdown"),
    magicStub("%%perl"),
    magicStub("%%prun"),
    magicStub("%%pypy"),
    magicStub("%%python"),
    magicStub("%%python2"),
    magicStub("%%python3"),
    magicStub("%%ruby"),
    magicStub("%%script"),
    magicStub("%%sh"),
    magicStub("%%svg"),
    magicStub("%%SVG"),
    magicStub("%%sx"),
    magicStub("%%system"),
    magicStub("%%time"),
    magicStub("%%timeit"),
    magicStub("%%writefile"),
];
