function magicStub(name) {
    return {
        cmd: "add",
        name: name,
        fn: stub,
        stub: true,
    };
}

function stub(name) {
    return this.errmsg(`Sorry, the magic '${name}' is not implemented (yet).`);
}

function ping() {
    return this.msg("pong");
}

function ls(... args) {
    args.shift(); // remove %ls
    return this.exec("ls", ... args);
}

function lsMagic(... args) {
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

function varInspect(cmd, varName) {
    // TODO: validate args

    // https://nodejs.org/api/process.html#process_process_send_message_sendhandle_options_callback
    // The message goes through serialization and parsing. The resulting message might not be the same as what is originally sent.

    new Promise((resolve, reject) => {
        kernel = this.kernel;
        let ret = "";
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
            onStdout: function(... args) {
                console.log("onStdout", ... args);
            }
        };
        kernel.session.inspect(varName, varName.length, callbacks);
    }).then((ret) => {
        console.log("varInspect completed successfully.");
        console.log("varInspect", ret);
        let v = ret.inspection.value;
        console.log("varInspect value", v);
        if(typeof v === "object") {
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
        fn: ping,
    },
    {
        cmd: "add",
        name: "%ls",
        fn: ls,
    },
    {
        cmd: "add",
        name: "%lsmagic",
        fn: lsMagic,
    },
    // {
    //     cmd: "add",
    //     name: "%inspect",
    //     fn: varInspect,
    // },
    magicStub("%alias"),
    magicStub("%alias_magic"),
    magicStub("%autoawait"),
    magicStub("%autocall"),
    magicStub("%automagic"),
    magicStub("%autosave"),
    magicStub("%bookmark"),
    magicStub("%cat"), // TODO
    magicStub("%cd"), // TODO
    magicStub("%clear"),
    magicStub("%colors"),
    magicStub("%conda"),
    magicStub("%config"),
    magicStub("%connect_info"),
    magicStub("%cp"), // TODO
    magicStub("%debug"),
    magicStub("%dhist"),
    magicStub("%dirs"),
    magicStub("%doctest_mode"),
    magicStub("%ed"),
    magicStub("%edit"),
    magicStub("%env"), // TODO
    magicStub("%gui"),
    magicStub("%hist"),
    magicStub("%history"),
    magicStub("%killbgscripts"),
    magicStub("%ldir"), // TODO
    magicStub("%less"),
    magicStub("%lf"), // TODO
    magicStub("%lk"),
    magicStub("%ll"), // TODO
    magicStub("%load"), // TODO
    magicStub("%load_ext"),
    magicStub("%loadpy"),
    magicStub("%logoff"),
    magicStub("%logon"),
    magicStub("%logstart"),
    magicStub("%logstate"),
    magicStub("%logstop"),
    // magicStub("%ls"), // TODO
    // magicStub("%lsmagic"), // TODO
    magicStub("%lx"),
    magicStub("%macro"),
    magicStub("%magic"),
    magicStub("%man"),
    magicStub("%matplotlib"),
    magicStub("%mkdir"), // TODO
    magicStub("%more"),
    magicStub("%mv"), // TODO
    magicStub("%notebook"),
    magicStub("%page"),
    magicStub("%pastebin"),
    magicStub("%pdb"),
    magicStub("%pdef"),
    magicStub("%pdoc"),
    magicStub("%pfile"),
    magicStub("%pinfo"),
    magicStub("%pinfo2"),
    magicStub("%pip"), // TODO
    magicStub("%popd"),
    magicStub("%pprint"),
    magicStub("%precision"),
    magicStub("%prun"),
    magicStub("%psearch"),
    magicStub("%psource"),
    magicStub("%pushd"),
    magicStub("%pwd"), // TODO
    magicStub("%pycat"),
    magicStub("%pylab"),
    magicStub("%qtconsole"),
    magicStub("%quickref"),
    magicStub("%recall"),
    magicStub("%rehashx"),
    magicStub("%reload_ext"),
    magicStub("%rep"),
    magicStub("%rerun"),
    magicStub("%reset"),
    magicStub("%reset_selective"),
    magicStub("%rm"), // TODO
    magicStub("%rmdir"), // TODO
    magicStub("%run"),
    magicStub("%save"),
    magicStub("%sc"),
    magicStub("%set_env"),
    magicStub("%store"),
    magicStub("%sx"),
    magicStub("%system"),
    magicStub("%tb"),
    magicStub("%time"),
    magicStub("%timeit"),
    magicStub("%unalias"),
    magicStub("%unload_ext"),
    magicStub("%who"),
    magicStub("%who_ls"),
    magicStub("%whos"),
    magicStub("%xdel"),
    magicStub("%xmode"),
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
