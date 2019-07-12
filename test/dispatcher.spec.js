const assert = require('assert');
const expect = require('chai').expect
const fs = require('fs-extra');
const rp = require('request-promise-native');

const Dispatcher = require('../src/dispatcher');

const site = "https://tretton37.com/";

describe('Dispatcher module ', function () {
    this.timeout(40000);

    after(async function(){
        //await fs.remove("out");
        //await fs.ensureDir("out");
    });

    it('is a class', function () {
        let dis = new Dispatcher();
        assert.equal(dis.toString(), "[object Object]");
    });

    it.skip('you can dowload a site', async function () {
        let dis = new Dispatcher();
        await dis.downloadSite(site);
    });
});
