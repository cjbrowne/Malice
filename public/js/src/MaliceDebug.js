// this is a bit of an odd module because it needs to create a globally-accessible "MaliceDebug" object
// and it doesn't explicitly expose the MaliceDebug constructor
var malice = malice || {};
if (!malice.debug) {
    (function() {
        var MaliceDebug = function() {}
        MaliceDebug.prototype = {
            update: function() {
            	$("#debug_coords").text(me.game.viewport.screenX + "," + me.game.viewport.screenY);
            },
            setResolution: function(x,y) {
                $("#debug_res").text(x + "x" + y);
            }
        }
        malice.debug = new MaliceDebug();
    })();
}