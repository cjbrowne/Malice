// this is a bit of an odd module because it needs to create a globally-accessible "MaliceDebug" object
// and it doesn't explicitly expose the MaliceDebug constructor
var malice = malice || {};
if (!malice.debug) {
    (function() {
        var MaliceDebug = function() {
            this.startTime = (new Date()).getTime();
            this.lastDisplayedFramerate = 0;
        }
        MaliceDebug.prototype = {
            framecount: 0,
            update: function() {
                var currentTime = (new Date()).getTime();
                var delta = (currentTime - this.startTime) / 1000;
                this.framerate = this.framecount / delta;
            	$("#debug_coords").text(me.game.viewport.screenX + "," + me.game.viewport.screenY);
                if(Math.abs(this.lastDisplayedFramerate - this.framerate) < 0.5) {
                    this.lastDisplayedFramerate = this.framerate;
                    $("#debug_fps").text(Math.round(this.framerate));
                }
            },
            setResolution: function(x,y) {
                $("#debug_res").text(x + "x" + y);
            }
        }
        malice.debug = new MaliceDebug();
    })();
}