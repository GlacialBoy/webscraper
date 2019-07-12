const assert = require('assert');
const expect = require('chai').expect

const Link = require('../src/link');

const site = "https://tretton37.com/";

describe('Link module ', function () {
    it('is a class', function () {
        let link = new Link();
        expect(link.toString()).to.be.equal("[object Object]");
    });

    it('can specify parameters in constructor', function () {
        let link = new Link("href", "ext", "localhref");
        expect(link.href).to.be.equal("href");
        expect(link.ext).to.be.equal("ext");
        expect(link.localHref).to.be.equal("localhref");
    });

});
