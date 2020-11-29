const {assert} = require("chai");
const {getCmd, runCmd} = require("./helpers/cmd");

describe("ping", function() {
    it("is function", function() {
        let ping = getCmd("%ping");
        assert.isFunction(ping);
    });

    it("returns string", function() {
        let ping = getCmd("%ping");
        let res = ping();
        assert.isString(res);
    });

    it("runs and prints 'pong'", function() {
        let {stdout, stderr} = runCmd("%ping");
        assert.strictEqual(stdout.length, 1);
        assert.strictEqual(stderr.length, 0);
        assert.strictEqual(stdout[0], "pong\n");
    });
});
