define(function() {
    "use strict";
    var Player = function() {
        Player.RESOURCES_ELEMENTS.container.fadeIn('fast');
    }
    Player.RESOURCES_ELEMENTS = {
        container: $("#resources"),
        wood: $("#wood"),
        food: $("#food"),
        scrapMetal: $("#scrap_metal")
    };
    Player.prototype = {
        resources: {
            wood: 0,
            food: 0,
            scrapMetal: 0
        },
        // informs the draw procedure whether an (expensive) DOM traversal is necessary or not
        dirtyResources: {
            wood: true,
            food: true,
            scrapMetal: true
        },
        update: function() {
            var res;
            for (res in this.dirtyResources) {
                if (this.dirtyResources.hasOwnProperty(res) && this.dirtyResources[res]) {
                    Player.RESOURCES_ELEMENTS[res].html(this.resources[res]);
                    this.dirtyResources[res] = false;
                }
            }
        }
    };
    return Player;
});
