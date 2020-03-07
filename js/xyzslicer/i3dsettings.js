// namespace
var xyzslicer = xyzslicer || {};

(function () {

    // Constructor
    function I3DSettings(settings) {
        this.settings = {};
        for (var namespace in window.localStorage) {
            this.settings[namespace] = JSON.parse(
                window.localStorage.getItem(namespace)
            );
        }
        _.defaultsDeep(this.settings, settings || {});
        this.store();
    }




    I3DSettings.prototype.get = function (path, defaultValue) {
        if (path) {
            return _.get(this.settings, path, defaultValue);
        }

        return this.settings;
    };

    I3DSettings.prototype.store = function () {
        for (var namespace in this.settings) {
            window.localStorage.setItem(
                namespace, JSON.stringify(this.settings[namespace])
            );
        }
    };

    I3DSettings.prototype.set = function (path, value, store) {
        store = (store == undefined) ? true : (!!store);

        if (typeof path == 'string') {
            if (typeof value == 'object') {
                value = _.merge(this.get(path, {}), value);
            }
            _.set(this.settings, path, value);
        }
        else {
            for (var namespace in path) {
                this.set(namespace, path[namespace], false);
            }
        }

        store && this.store();

        return this;
    };

    I3DSettings.prototype.has = function (path) {
        return _.has(this.settings, path);
    };


    // export module
    xyzslicer.I3DSettings = I3DSettings;

})();
