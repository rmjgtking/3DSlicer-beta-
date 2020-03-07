// namespace
var xyzslicer = xyzslicer || {};

; (function () {

    // global settings
    var i3dglblSettings = {
        view: 'default',
        buildVolume: {
            size: {
                x: 100, // mm
                y: 100, // mm
                z: 100  // mm
            },
            color: 0xff0000,
            opacity: 0.1
        }
    };

    // -------------------------------------------------------------------------

    // Constructor
    function I3DViewer3D(settings) {
        // self alias
        var self = this;
        xyzslicer.I3DViewer.call(self, settings);
        _.defaultsDeep(self.settings, I3DViewer3D.i3dglblSettings);

        self.controls = new THREE.OrbitControls(self.camera, self.canvas);
        self.controls.addEventListener('change', function () {
            self.render();
        });
        self.controls.noKeys = true;

        self.light = new THREE.AmbientLight(0x000000);
        self.scene.add(self.light);

        self.setBuildVolume(self.settings.buildVolume);

        self.view = new xyzslicer.I3DViewControls({
            target: self.buildVolumeObject,
            controls: self.controls,
            camera: self.camera,
            margin: 10
        });

        var lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 2000, 0);
        lights[1].position.set(1000, 2000, 1000);
        lights[2].position.set(-1000, -2000, -1000);

        self.scene.add(lights[0]);
        self.scene.add(lights[1]);
        self.scene.add(lights[2]);

        var helper = new THREE.GridHelper(2000, 100); //@
        helper.position.z = - 199;
        helper.rotation.x = -0.5 * Math.PI;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        self.scene.add(helper); //@
        self.setView(this.settings.view);
        self.render();
    }

    // extends
    I3DViewer3D.prototype = Object.create(xyzslicer.I3DViewer.prototype);
    I3DViewer3D.prototype.constructor = I3DViewer3D;

    // -------------------------------------------------------------------------

    I3DViewer3D.prototype.dropObject = function (object) {
        var volume = this.buildVolume.size;
        var size = object.geometry.boundingBox.size();
        object.position.z = -((volume.z - size.z) / 2);
    };

    I3DViewer3D.prototype.addObject = function (object) {
        // drop object on build plate
        this.dropObject(object);

        // call parent method
        xyzslicer.I3DViewer.prototype.addObject.call(this, object);
    };

    // -------------------------------------------------------------------------

    I3DViewer3D.prototype.setBuildVolume = function (settings) {
        this.buildVolume = _.defaultsDeep({}, settings, this.buildVolume);

        var size = this.buildVolume.size;
        var unit = this.buildVolume.unit;
        var color = this.buildVolume.color;
        var opacity = this.buildVolume.opacity;

        if (unit == 'in') { // -> mm
            size.x *= 25.4;
            size.y *= 25.4;
            size.z *= 25.4;
        }

        var geometry = new THREE.CubeGeometry(size.x, size.y, size.z);
        var material = new THREE.MeshBasicMaterial({
            color: 0x9f0fa5,
            opacity: opacity,
            transparent: true
        });

        var buildVolumeObject = new xyzslicer.Mesh(geometry, material);

        this.buildVolumeObject && this.removeObject(this.buildVolumeObject);
        this.buildVolumeObject = buildVolumeObject;
        this.scene.add(this.buildVolumeObject);

        if (!this.buildVolumeBox) {
            this.buildVolumeBox = new THREE.BoxHelper();
            this.buildVolumeBox.material.color.setHex(color);
            this.scene.add(this.buildVolumeBox);
        }

        this.buildVolumeBox.update(this.buildVolumeObject);
    };

    I3DViewer3D.prototype.setView = function (view) {
        this.view.set(view !== undefined ? view : this.settings.view);
    };

    // -------------------------------------------------------------------------

    // global settings
    I3DViewer3D.i3dglblSettings = i3dglblSettings;

    // export module
    xyzslicer.I3DViewer3D = I3DViewer3D;

})();
