// TODO: %inspect, %loadjs, %npm, %update
const {spawn} = require("child_process");
const {magicStub} = require("./utilities");
const {table} = require("table");
const humanize = require("humanize-anything");
let envinfo = require("envinfo");
/* global $$ */

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
    // other junk from modules
    "__core-js_shared__",
    "core",
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

let envinfoConfig = {
    System: [
        "OS",
        "CPU",
        "Memory",
        "Container",
        "Shell",
    ],
    Binaries: [
        "Node",
        "Yarn",
        "npm",
        "Watchman",
    ],
    Managers: [
        "Apt",
        "Cargo",
        "CocoaPods",
        "Composer",
        "Gradle",
        "Homebrew",
        "Maven",
        "pip2",
        "pip3",
        "RubyGems",
        "Yum",
    ],
    Utilities: [
        "Bazel",
        "CMake",
        "Make",
        "GCC",
        "Git",
        "Clang",
        "Mercurial",
        "Subversion",
        "FFmpeg",
    ],
    Virtualization: [
        "Docker",
        "Parallels",
        "VirtualBox",
        "VMware Fusion",
    ],
    Languages: [
        "Bash",
        "Go",
        "Elixir",
        "Erlang",
        "Java",
        "Perl",
        "PHP",
        "Protoc",
        "Python",
        "Python3",
        "R",
        "Ruby",
        "Rust",
        "Scala",
    ],
    Databases: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
    Browsers: [
        "Brave Browser",
        "Chrome",
        "Chrome Canary",
        "Edge",
        "Firefox",
        "Firefox Developer Edition",
        "Firefox Nightly",
        "Internet Explorer",
        "Safari",
        "Safari Technology Preview",
    ],
    npmPackages: true,
    npmGlobalPackages: true,
};

function execToArray(cmd, ... args) {
    let output = [];
    return new Promise((resolve, reject) => {
        let opts = {
            shell: true,
            argv0: "(ijavascriptex execToArray)",
            // stdio: "inherit",
            // timeout: 60000,
        };

        let proc = spawn(cmd, args, opts);

        proc.stdout.on("data", (data) => {
            data = data.toString("utf8").split("\n");
            // console.log(data);
            // console.log("output before", output);
            data.forEach((d) => {
                output.push({type: "stdout", data: d});
            });
            // console.log("output after", output);
        });

        proc.stderr.on("data", (data) => {
            data = data.toString("utf8").split("\n");
            // console.error(`${data}`);
            data.forEach((d) => {
                output.push({type: "stderr", data: d});
            });
            // output.push({type: "stderr", data});
        });

        proc.on("close", () => {
            // console.log(`[ process '${cmd}${args.length ? " " : ""}${args.join(" ")}' exited with code ${code} ]`);
            // console.log("resolving", output);
            resolve(output);
        });

        proc.on("error", (err) => {
            console.error(err.message);
            reject(err);
        });
    });
}

function reportEnv() {
    return envinfo.run(
        envinfoConfig,
        {json: true, showNotFound: true},
    ).then((env) => {
        return JSON.parse(env);
    });
}

function reportJupyter() {
    return Promise.all([
        execToArray("jupyter", "--version"),
        execToArray("jupyter", "kernelspec", "list"),
    ])
        .then((res) => {
            // 'jupyter --version' should look like:

            // jupyter core     : 4.6.2
            // jupyter-notebook : 6.0.3
            // qtconsole        : 4.6.0
            // ipython          : 7.12.0
            // ipykernel        : 5.1.4
            // jupyter client   : 5.3.4
            // jupyter lab      : not installed
            // nbconvert        : 5.6.1
            // ipywidgets       : 7.5.1
            // nbformat         : 5.0.4
            // traitlets        : 4.3.3

            res[0].pop(); // last line is blank
            let jupyter = res[0].map((line) => {
                line = line.data.split(":").map((v) => v.trim());
                return {
                    package: line[0],
                    version: line[1],
                };
            });

            // 'jupyter kernelspec list' should look like:

            // Available kernels:
            //   javascript      /Users/ampower/Library/Jupyter/kernels/javascript
            //   javascriptex    /Users/ampower/Library/Jupyter/kernels/javascriptex
            //   python3         /opt/local/Library/Frameworks/Python.framework/Versions/3.7/share/jupyter/kernels/python3

            res[1].shift(); // first line is header
            res[1].pop(); // last line is empty
            let kernels = res[1].map((line) => {
                let lineParts = line.data.match(/^\s+(?<kernel>\w+)\s+(?<path>\/.*)$/);
                if (!lineParts) {
                    throw new Error("couldn't match line while parsing jupyter kernels:", line);
                }

                return lineParts.groups;
            });
            return {jupyter, kernels};
        });
}

function reportGit() {
    return "git";
}

function reportNpmPackages() {
    return execToArray("npm", "ls")
        .then((ret) => ret.join("\n"));
}

async function report() {
    process.cwd("..");

    let envObj = await Promise.all([
        reportEnv(),
        reportJupyter(),
        // reportGit(),
        // reportNpmPackages(),
    ])
        .then((res) => {
            let env = res[0];
            env.Jupyter = res[1];
        });
    console.log("envObj", envObj);
    return;

    // TODO: conda

    let template =
`
## Report
### System
__OS:__ ${envObj.System.OS}<br>
__CPU:__ ${envObj.System.CPU}<br>
__Memory:__ ${envObj.System.Memory}<br>
__Shell:__ ${envObj.System.Shell.path} ${envObj.System.Shell.version}<br>
### Jupyter
TODO
### Binaries
__Node:__ ${envObj.Binaries.Node}<br>
__Yarn:__ ${envObj.Binaries.Yarn}<br>
__NPM:__ ${envObj.Binaries.npm}<br>
### Languages
__Bash:__ ${envObj.Languages.Bash}<br>
__Go:__ ${envObj.Languages.Go}<br>
__Java:__ ${envObj.Languages.Java}<br>
__Perl:__ ${envObj.Languages.Perl}<br>
__PHP:__ ${envObj.Languages.PHP}<br>
__Python:__ ${envObj.Languages.Python}<br>
__Python3:__ ${envObj.Languages.Python3}<br>
__R:__ ${envObj.Languages.R}<br>
__Ruby:__ ${envObj.Languages.Ruby}<br>
### Managers
__pip2:__ ${envObj.Managers.pip2}<br>
__pip3:__ ${envObj.Managers.pip3}<br>
### Utilities
__CMake:__ ${envObj.Utilities.CMake}<br>
__Make:__ ${envObj.Utilities.Make}<br>
__GCC:__ ${envObj.Utilities.GCC}<br>
__Git:__ ${envObj.Utilities.Git}<br>
__Clang:__ ${envObj.Utilities.Clang}<br>
__Make:__ ${envObj.Utilities.Make}<br>
### Virtualization
__Docker:__ ${envObj.Virtualization.Docker}<br>
__Parallels:__ ${envObj.Virtualization.Parallels}<br>
__VirtualBox:__ ${envObj.Virtualization.VirtualBox}<br>
### Browsers
__Brave:__ ${envObj.Browsers["Brave Browser"]}<br>
__Chrome:__ ${envObj.Browsers.Chrome}<br>
__Chrome Canary:__ ${envObj.Browsers["Chrome Canary"]}<br>
__Edge:__ ${envObj.Browsers.Edge}<br>
__Firefox:__ ${envObj.Browsers.Firefox}<br>
__Firefox Developer Edition:__ ${envObj.Browsers["Firefox Developer Edition"]}<br>
__Firefox Nightly:__ ${envObj.Browsers["Firefox Nightly"]}<br>
__Safari:__ ${envObj.Browsers.Safari}<br>
__Safari Technology Preview:__ ${envObj.Browsers["Safari Technology Preview"]}<br>
### git status
TODO
### npm global
TODO
### npm local
TODO
`;

    $$.mime({
        "text/markdown": template,
    });
    return undefined;
}

module.exports = [
    {
        name: "%who",
        fn: who,
        standard: true,
    },
    {
        name: "%whos",
        fn: whos,
        standard: true,
    },
    {
        name: "%report",
        fn: report,
        standard: false,
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
