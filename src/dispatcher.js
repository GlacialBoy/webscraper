const Resource = require('../src/resource');
const Link = require("../src/link");

class Dispatcher {

    constructor() {
        this.resources = { "index.html": new Link("/", ".html", "index.html") };
        this.downloaded = {};
    }

    async downloadSite(site) {
        this.baseUrl = site;

        for (let iteration = 0; iteration < 10; iteration++) {
            let links = Object.values(this.resources);
            let executors = links.map(link => this.downloadResource(link));
            await Promise.all(executors);
        }
    }

    async downloadResource(link) {

        if (link.ext === ".html" || link.ext === ".css") {
            let rs = new Resource(this.baseUrl, link.href);
            await rs.process();
            this.updateResources(rs.links);
        } else {
            let rs = new Resource(this.baseUrl, link.href);
            await rs.downloadStaticResource();
        }

        this.downloaded[link.localHref] = link;
        delete this.resources[link.localHref];
    }

    updateResources(links) {

        if (!links || links.length == 0) {
            return;
        }

        for (let link of links) {
            if (!this.downloaded[link.localHref]) {
                this.resources[link.localHref] = this.resources[link.localHref] || link;
            }
        }
    }

}

module.exports = Dispatcher;