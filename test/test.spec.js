const assert = require('assert');
const fs = require('fs-extra');
const rp = require('request-promise-native');

const Page = require('../src/page');

const site = "https://tretton37.com/";

describe('Page module ', function () {
    it('is a class', function () {
        let pg = new Page('http://www.google.com');
        assert.equal(pg.toString(), "[object Object]");
    });

    it('you can set an url', function () {
        let pg = new Page('http://www.google.com/');
        assert.equal(pg.url, 'http://www.google.com/');
    });

    it('you can get the content', function () {
        let pg = new Page(site);
        let content = pg.getContent();
        assert.ok(content);
    });

    it('store the content in a local file', async function () {
        let pg = new Page(site);
        await pg.save("out/index.html");
        let file = await fs.stat("out/index.html");
        assert.ok(file);
    });

    it("remove search and hash from url", function () {
        let pg = new Page(site);
        let response = pg.getCleanedUrl("http://www.google.com?q=ciao#rrr");
        assert.equal(response, "http://www.google.com/");
    });

    it('download resource', async function () {
        let pg = new Page(site);
        let downloadPromise = pg.downloadResource("/assets/i/contact.jpg");
        assert.ok(downloadPromise);
        assert.ok(downloadPromise.then);        
        
        await downloadPromise;        
        let file = await fs.stat("out/assets/i/contact.jpg");
        assert.ok(file);
    });

    it.skip("recognize all the links", function(){
        let pg = new Page(site);
    });

});

describe('With third part libraries', function () {
    it('I can make promises', async function () {
        let htmlString = await rp('http://www.google.com');
        assert.ok(htmlString);
    });
});
