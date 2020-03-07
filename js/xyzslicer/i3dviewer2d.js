// namespace
var xyzslicer = xyzslicer || {};

;(function() {

    // global settings
    var i3dglblSettings = {
        screen: {
            width   : 1680, // px
            height  : 1050, // px
            diagonal: { size: 22, unit: 'in' }
        },
        buildPlate: {
            size: {
                x: 100, // mm
                y: 100  // mm
            },
            unit: 'mm',
            color: 0xff0000,
            opacity: 0.1
        }
    };

    // -------------------------------------------------------------------------

    // Constructor
    function I3DViewer2D(settings) {
        xyzslicer.I3DViewer.call(this, settings);
        _.defaultsDeep(this.settings, I3DViewer2D.i3dglblSettings);
        this.setScreenResolution(this.settings.screen);
        this.setBuildPlate(this.settings.buildPlate);
        this.setView();
        this.render();
    }

    // extends
    I3DViewer2D.prototype = Object.create(xyzslicer.I3DViewer.prototype);
    I3DViewer2D.prototype.constructor = I3DViewer2D;

    // -------------------------------------------------------------------------

    I3DViewer2D.prototype.updatePixelDensity = function() {
        var diagonalPixels     = Math.sqrt(Math.pow(this.screen.width, 2) + Math.pow(this.screen.height, 2));
        var pixelPerCentimeter = diagonalPixels / this.screen.diagonal.size * 10;

        if (this.screen.diagonal.unit == 'in') {
            pixelPerCentimeter = pixelPerCentimeter / 25.4;
        }

        this.dotPitch = 10 / pixelPerCentimeter;
    };

    I3DViewer2D.prototype.setScreenResolution = function(settings) {
        this.screen = _.defaultsDeep(settings, this.screen);
        this.updatePixelDensity();
        this.setSize(this.screen);
        this.setView();
    };

    I3DViewer2D.prototype.setBuildPlate = function(settings) {
        this.buildPlate = _.defaultsDeep(settings, this.buildPlate);

        var size    = this.buildPlate.size;
        var unit    = this.buildPlate.unit;
        var color   = this.buildPlate.color;
        var opacity = this.buildPlate.opacity;

        if (unit == 'in') { // -> mm
            size.x *= 25.4;
            size.y *= 25.4;
        }

        var geometry = new THREE.PlaneGeometry(size.x, size.y, 1);
        var material = new THREE.MeshBasicMaterial({
            color: color,
            opacity: opacity,
            transparent: true
        });

        var buildPlateObject = new THREE.Mesh(geometry, material);

        this.replaceObject(this.buildPlateObject, buildPlateObject);
        this.buildPlateObject = buildPlateObject;

        if (! this.buildPlateBox) {
            this.buildPlateBox = new THREE.BoxHelper();
            this.buildPlateBox.material.color.setHex(color);
            this.scene.add(this.buildPlateBox);
        }

        this.buildPlateBox.update(this.buildPlateObject);
    };

    I3DViewer2D.prototype.setView = function() {
        var distance = this.screen.height / 2;
        distance /= Math.tan(Math.PI * this.camera.fov / 360);
        distance *= this.dotPitch;

        this.camera.position.z = distance;
    };

    // -------------------------------------------------------------------------

    // global settings
    I3DViewer2D.i3dglblSettings = i3dglblSettings;

    // export module
    xyzslicer.I3DViewer2D = I3DViewer2D;

})();
