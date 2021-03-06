// TODO: %report
// %report // display version information of OS, npm, node, packages, etc. for reproducability purposes
const {magicStub, decorateMagic} = require("./utilities");

function lsmagic() {
    let cmds = [... this.magicMap.entries()];
    cmds = cmds
        // filter out stubs
        .filter((ent) => !ent[1].stub)
        // just use the names
        .map((ent) => ent[0])
        // sort alphabetically
        .sort();
    let cmdStr = cmds.join(" ");
    console.log(`Available line magics:\n${cmdStr}`);
}

// command history
function history() {
    let opts = this.args;

    let h = this.history;
    let outputStr = "";
    for (let i = 0; i < h.length; i++) {
        if (opts.number) {
            let multiLine = /\n/.test(h[i]);
            outputStr += `    ${i}: ${multiLine ? "\n" : ""}`;
        }

        outputStr += `${h[i]}\n`;
    }

    console.log(outputStr);
}
decorateMagic(
    history,
    __filename,
    "Print input __history__ with most recent last.",
    ["name", "%history"],
    ["option", "-n, --number", "print line numbers for each input. This feature is only available if numbered prompts are in use."],
    // ["option", "-o, --output", "also print outputs for each input."],
    // ["option", "-p, --prompt", "print classic ‘>>>’ python prompts before each input. This is useful for making documentation, and in conjunction with -o, for producing doctest-ready output."],
    // ["option", "-t, --translate", "print the ‘translated’ history, as IPython understands it. IPython filters your input and converts it all into valid Python source before executing it (things like magics or aliases are turned into function calls, for example). With this option, you’ll see the native history instead of the user-entered version: ‘%cd /’ will be seen as ‘get_ipython().run_line_magic(“cd”, “/”)’ instead of ‘%cd /’."],
    // ["option", "-f <filename>", "filename: instead of printing the output to the screen, redirect it to the given file. The file is always overwritten, though when it can, IPython asks for confirmation first. In particular, running the command ‘history -f filename from the IPython Notebook interface will replace FILENAME even if it already exists without confirmation."],
    // ["option", "-l [limit]", "get the last n lines from all sessions. Specify n as a single arg, or the default is the last 10 lines."],
    // ["option", "-u, --unique", "when searching history using -g, show only unique history."],
);

module.exports = [
    {
        name: "%lsmagic",
        fn: lsmagic,
        standard: true,
    },
    {
        name: "%history",
        fn: history,
        standard: true,
    },
    {
        name: "%hist",
        fn: history,
        standard: true,
    },
    // jupyter shell & sweeteners
    magicStub("%alias_magic"), // alias to existing magic
    magicStub("%automagic"), // enable calling magics without leading %
    magicStub("%autocall"), // enable function calls without parens
    magicStub("%autosave"), // Set the autosave interval in the notebook (in seconds).
    magicStub("%colors"), // set color pallet; TODO: how to do colors?
    magicStub("%config"), // mange configuration
    magicStub("%connect_info"), // prints connection info JSON
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
    // editor support
    magicStub("%edit"), // open editor, edit a file, save results into window
    magicStub("%ed"), // alias for %edit
];
