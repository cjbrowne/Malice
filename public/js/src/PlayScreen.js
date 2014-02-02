define(["HUD"], function(HUD) {
    return me.ScreenObject.extend({
        init: function() {
            this.parent(true);
            this.HUD = new HUD();
            me.game.world.addChild(this.HUD);
        },

        onResetEvent: function() {
        	me.game.reset();
            me.levelDirector.loadLevel("map");
            me.game.viewport.move(me.game.currentLevel.realwidth / 2, me.game.currentLevel.realheight / 2);
        },

        update: function() {
        },

        draw: function(context) {
        },

        onDestroyEvent: function() {}
    });
});
