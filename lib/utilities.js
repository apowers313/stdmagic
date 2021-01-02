function magicStub(name) {
    return {
        name: name,
        fn: stub,
        stub: true,
        standard: true,
    };
}

function stub(name) {
    console.error(`Sorry, the magic '${name}' is not implemented (yet).`);
}

/* global $$ */
let decorateMagic;
if (typeof global.$$ === "object" &&
    typeof $$.addMagic === "function" &&
    typeof $$.addMagic.utils === "object" &&
    typeof $$.addMagic.utils.decorateMagic === "function") {
    // eslint-disable-next-line prefer-destructuring
    decorateMagic = $$.addMagic.utils.decorateMagic;
} else {
    decorateMagic = () => {};
}

module.exports = {
    magicStub,
    decorateMagic,
};
