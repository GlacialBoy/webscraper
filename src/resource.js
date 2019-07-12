const { URL } = require("url");
const fs = require("fs-extra");
const rp = require("request-promise-native");
const path = require("path");
const Link = require("./link");

class Resource {

    constructor(baseUrl, relative = "/") {
        this.baseUrl = baseUrl;
        this.relativeUrl = relative;
        this.innerUrl = (new URL(relative, this.baseUrl)).toString();
        this.baseFolder = "out";
        this.linkRegex = /(?:href|src)="((?!http|javascript|\{|mailto|tel)[^?"]*)\??[^"]*"/g;
    }

    get url() { return this.innerUrl; }

    async getContent() {
        return await rp(this.innerUrl);
    }

    downloadStaticResource() {
        let currentUrl = this.getCleanedUrl();
        let targetFile = this.getPath(this.relativeUrl);
        fs.ensureFileSync(targetFile);

        return new Promise(function (resolve, reject) {
            rp(currentUrl.toString())
                .pipe(fs.createWriteStream(targetFile))
                .on("finish", resolve)
                .on("error", reject);
        });
    }

    getCleanedUrl() {
        let currentUrl = new URL(this.innerUrl);
        currentUrl.search = "";
        currentUrl.hash = "";
        return currentUrl.toString();
    }

    getPath(relative) {

        if (!relative || relative === "/") {
            relative = "index.html";
        }

        let extension = path.extname(relative);
        if (!extension) {
            relative += ".html";
        }

        return path.join(this.baseFolder, relative);
    }

    getLinks(content) {
        let links = [];
        let removeRoot = /^\/+/g;

        if (content) {
            let match = this.linkRegex.exec(content);
            while (match != null) {
                let extension = path.extname(match[1]);

                let newLink = new Link(
                    match[1],
                    extension || ".html",
                    match[1].replace(removeRoot, "") + (extension ? "" : ".html")
                );

                links.push(newLink);
                match = this.linkRegex.exec(content);
            }
        } else {
            console.log("There is no content to process");
        }

        return links;
    }

    async process() {
        let content = await this.getContent();
        let links = this.getLinks(content);

        for (let { href, ext, localHref } of links) {
            let escapedString = this.escapeRegExp(href);
            content = content.replace(new RegExp(`"${escapedString}"`, "gm"), `"${localHref}"`);
        }

        let filePath = this.getPath(this.relativeUrl);
        await fs.ensureFile(filePath);
        await fs.writeFile(filePath, content);
        this.links = links;
    }

    escapeRegExp(string) {
        return string.replace(/[\/.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
}

module.exports = Resource;
