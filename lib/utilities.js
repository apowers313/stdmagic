function magicStub(name) {
    return {
        name: name,
        fn: stub,
        stub: true,
    };
}

function stub(name) {
    console.error(`Sorry, the magic '${name}' is not implemented (yet).`);
}

module.exports = {
    magicStub,
};
