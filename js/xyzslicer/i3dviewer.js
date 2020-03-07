// namespace
var xyzslicer = xyzslicer || {};

(function () {

    // global settings
    var i3dglblSettings = {
        color: 0x000000,
        size: {
            width: 600,
            height: 400
        },
        target: document.body,
        antialias: true,
        camera: {
            fov: 45,
            near: 0.1,
            far: 10000,
        }
    };

    // -------------------------------------------------------------------------

    // Constructor
    function I3DViewer(settings) {
        // self alias
        var self = this;
        // settings settings
        self.settings = _.defaultsDeep({}, settings || {}, I3DViewer.i3dglblSettings);

        // create main objects
        self.scene = new THREE.Scene();
        self.camera = new THREE.PerspectiveCamera();
        self.renderer = new THREE.WebGLRenderer({ antialias: self.settings.antialias });
        // assign camera settings
        _.assign(self.camera, self.settings.camera);

        // set camera orbit around Z axis
        self.camera.up = new THREE.Vector3(0, 0, 1);

        // set camera position
        self.camera.position.z = 1000;

        // set default parameters
        self.setSize(self.settings.size);
        self.setColor(self.settings.color);

        // set the target for canvas
        self.target = self.settings.target;
        self.canvas = self.renderer.domElement;
        if (self.target) {
            while (self.target.firstChild) {
                self.target.removeChild(self.target.firstChild);
            }
            self.target.appendChild(self.canvas);
        }

        // render
        self.render();
    }

    // -------------------------------------------------------------------------


    I3DViewer.prototype.setHeight = function (height) {
        return this.setSize({ height: height });
    };

    I3DViewer.prototype.setSize = function (size) {
        _.defaults(size, this.getSize());
        this.renderer.setSize(size.width, size.height);
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();
        return size;
    };

    I3DViewer.prototype.setWidth = function (width) {
        return this.setSize({ width: width });
    };


    I3DViewer.prototype.getColor = function () {
        return this.renderer.getClearColor();
    };




    I3DViewer.prototype.removeObject = function (object) {
        object.geometry && object.geometry.dispose();
        object.material && object.material.dispose();
        this.scene.remove(object);
    };

    I3DViewer.prototype.getSize = function () {
        return this.renderer.getSize();
    };

    I3DViewer.prototype.addObject = function (object) {
        this.scene.add(object);
        return object;
    };

    I3DViewer.prototype.replaceObject = function (oldObject, newObject) {
        oldObject && this.removeObject(oldObject);
        this.addObject(newObject);
        return newObject;
    };


    I3DViewer.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };

    I3DViewer.prototype.setColor = function (color) {
        this.renderer.setClearColor(color);
    };

    I3DViewer.prototype.screenshot = function (callback) {
        this.render();
        callback(this.canvas.toDataURL());
    };


    // global settings
    I3DViewer.i3dglblSettings = i3dglblSettings;

    // export module
    xyzslicer.I3DViewer = I3DViewer;

})();
