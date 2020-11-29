function magicStub(name) {
    return {
        cmd: "add",
        name: name,
        fn: transpileStub,
        stub: true,
    };
}

function transpileStub(name) {
    return this.errmsg(`Sorry, the magic '${name}' is not implemented (yet).`);
}

module.exports = {
    magicStub,
};
