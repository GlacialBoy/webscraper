const { URL } = require("url");
const fs = require("fs-extra");
const rp = require("request-promise-native");
const path = require("path");

class Page {

    constructor(url) {
        this.innerUrl = url;
        this.baseFolder = "out";
    }

    get url() { return this.innerUrl; }

    async getContent() {
        return await rp(this.url);
    }

    async save(path) {
        let content = await this.getContent();
        fs.writeFileSync(path, content);
    }

    downloadResource(href) {
        let currentUrl = this.getCleanedUrl(href);
        let targetFile = this.getPath(href);
        fs.ensureFileSync(targetFile);

        return new Promise(function (resolve, reject) {
            rp(currentUrl.toString())
                .pipe(fs.createWriteStream(targetFile))
                .on("finish", resolve)
                .on("error", reject);
        });
    }

    getCleanedUrl(href) {
        let currentUrl = new URL(href, this.innerUrl);
        currentUrl.search = "";
        currentUrl.hash = "";
        return currentUrl.toString();
    }

    getPath(relative) {

        if (!relative || relative === "/") {
            relative = "index.html";
        }

        return path.join(this.baseFolder, relative);
    }
}

module.exports = Page;
