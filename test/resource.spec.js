const assert = require('assert');
const expect = require('chai').expect
const fs = require('fs-extra');
const rp = require('request-promise-native');

const Resource = require('../src/resource');
const Link = require("../src/link");

const site = "https://tretton37.com/";

describe.only('Resource module ', function () {
    this.timeout(20000);

    after(async function () {
        //await fs.remove("out");
        //await fs.ensureDir("out");
    });

    it('is a class', function () {
        let pg = new Resource('http://www.google.com');
        expect(pg.toString()).to.be.equal("[object Object]");
    });

    it('you can set an url', function () {
        let pg = new Resource('http://www.google.com/');
        expect(pg.url).to.be.equal("http://www.google.com/");
    });

    it('you can get the content', async function () {
        let pg = new Resource(site);
        let content = await pg.getContent();
        assert.ok(content);
    });

    it("remove search and hash from url", function () {
        let pg = new Resource("http://www.google.com?q=ciao#rrr");
        let response = pg.getCleanedUrl();
        assert.equal(response, "http://www.google.com/");
    });

    it('download resource', async function () {
        let pg = new Resource(site, "/assets/i/contact.jpg");
        let downloadPromise = pg.downloadStaticResource();
        assert.ok(downloadPromise);
        assert.ok(downloadPromise.then);

        await downloadPromise;
        let file = await fs.stat("out/assets/i/contact.jpg");
        assert.ok(file);
    });

    it("recognize all the links", async function () {
        let pg = new Resource(site);
        let links = pg.getLinks('href="/assets/css/main.ie.css?7939f52f-80ea-4b1f-ba16-d0554a905c2e"');
        assert.ok(links);
        assert.equal(links.length, 1);
        assert.equal(links[0].href, "/assets/css/main.ie.css");
        console.log(links[0] instanceof Link);

        links = pg.getLinks('');
        assert.equal(links.length, 0);

        links = pg.getLinks('href="/assets/css/main.ie.css?7939f52f-80ea-4b1f-ba16-d0554a905c2e" <a href="/what-we-do"');
        assert.equal(links[0].href, "/assets/css/main.ie.css");
        assert.equal(links[1].href, "/what-we-do");

        let content = await pg.getContent();
        links = pg.getLinks(content);
    });

    it("download page and resources", async function () {
        let pg = new Resource(site);
        await pg.process();
        expect(pg.links).to.not.be.empty;

        let hrfs = pg.links.map(item => item.href);
        expect(hrfs).to.contains("/assets/css/main.ie.css");
    });

    it("download page and resources not home", async function () {
        let pg = new Resource(site, "/who-we-are");
        await pg.process();
        expect(pg.links).to.not.be.empty;
        let hrfs = pg.links.map(item => item.href);
        expect(hrfs).to.contains("/assets/css/main.ie.css");
    });

    it("download css", async function () {
        let pg = new Resource(site, "assets/css/main.ie.css");
        await pg.process();
    });
});

describe('With third part libraries', function () {
    it('I can make promises', async function () {
        let htmlString = await rp('http://www.google.com');
        assert.ok(htmlString);
    });
});
