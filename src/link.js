
class Link {

    constructor(href, ext, localHref) {
        this._href = href;
        this._ext = ext;
        this._localHref = localHref;
    }

    get href() {
        return this._href;
    };

    get ext() {
        return this._ext;
    };

    get localHref() {
        return this._localHref;
    };
}

module.exports = Link;
