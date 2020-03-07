// namespace
var xyzslicer = xyzslicer || {};

;(function() {

    // global settings
    var i3dglblSettings = {
        view    : 'default',
        camera  : null,
        controls: null,
        target  : null,
        margin  : 10
    };

    // Constructor
    function I3DViewControls(settings) {
        var settings = _.defaults(settings || {}, I3DViewControls.i3dglblSettings);

        this.view        = null;
        this.defaultView = settings.view;
        this.controls    = settings.controls;
        this.target      = settings.target;
        this.camera      = settings.camera;
        this.margin      = settings.margin;
        this.focusPoint  = new THREE.Object3D();

        this.update();
    };

    // methods

    I3DViewControls.prototype.setFocusAt = function(point) {
        _.assign(this.focusPoint.position, point || {});
    };

    

    I3DViewControls.prototype.update = function() {
        this.target.geometry.computeBoundingBox();
        this.setFocusAtCenter();
    };

    I3DViewControls.prototype.getVisibleDistance = function(width, height) {
        var margin = this.margin * 2;
        var size   = height + margin;
        var aspect = width / height;

        // landscape or portrait orientation
        if (this.camera.aspect < aspect) {
            size = (width + margin) / this.camera.aspect;
        }

        return size / 2 / Math.tan(Math.PI * this.camera.fov / 360);
    };

    I3DViewControls.prototype.lookAtFocusPoint = function() {
        // set camera target to center of build volume
        this.controls.target  = this.focusPoint.position.clone();
        this.controls.target0 = this.controls.target.clone();

        // update controls
        this.controls.update();
    };

    I3DViewControls.prototype.setFocusAtCenter = function() {
        var size = this.target.geometry.boundingBox.size();
        this.setFocusAt({ x: 0, y: 0, z: 0 });
    };

    I3DViewControls.prototype.set = function(view) {
        // reset camera position
        this.controls.reset();

        // set new position
        var x = 0;
        var y = 0;
        var z = 0;
        var w, h;

        var size = this.target.geometry.boundingBox.size();
        var view = view || this.defaultView;

        this.view = view;

        if (view == 'default' || view == 'front') {
            y = -size.y / 2;
            w = size.x;
            h = size.z;
        }
        else if (view == 'right') {
            x = size.x / 2;
            w = size.y;
            h = size.z;
        }
        else if (view == 'back') {
            y = size.y / 2;
            w = size.x;
            h = size.z;
        }
        else if (view == 'left') {
            x = -size.x / 2;
            w = size.y;
            h = size.z;
        }
        else if (view == 'top') {
            z = size.z / 2;
            w = size.x;
            h = size.y;
        }
        else if (view == 'bottom') {
            z = -size.z / 2;
            w = size.x;
            h = size.y;
        }

        // ensure the build volume is visible
        var distance = this.getVisibleDistance(w, h);

        if (view == 'default' || view == 'front') {
            y = y - distance;
        }
        else if (view == 'top') {
            z = z + distance;
        }
        else if (view == 'back') {
            y = y + distance;
        }
        else if (view == 'left') {
            x = x - distance;
        }
        else if (view == 'right') {
            x = x + distance;
        }
       
        else if (view == 'bottom') {
            z = z - distance;
        }

        // set default view
        if (view == 'default') {
            z = size.z / 2;
            x = size.x / 2;
        }

        // set new camera position
        this.camera.position.set(x, y, z);

        // set the camera look at focus point
        this.lookAtFocusPoint();
    };

    // global settings
    I3DViewControls.i3dglblSettings = i3dglblSettings;

    // export module
    xyzslicer.I3DViewControls = I3DViewControls;

})();
