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
            me.input.bindKey(me.input.KEY.W, "up", false);
            me.input.bindKey(me.input.KEY.A, "left", false);
            me.input.bindKey(me.input.KEY.S, "down", false);
            me.input.bindKey(me.input.KEY.D, "right", false);
        },

        onUpdateFrame: function() {
            if (me.input.isKeyPressed('left')) {
                me.game.viewport.move(-(me.game.currentLevel.tilewidth / 2), 0);
                // force redraw
                me.game.repaint();

            } else if (me.input.isKeyPressed('right')) {
                me.game.viewport.move(me.game.currentLevel.tilewidth / 2, 0);
                // force redraw
                me.game.repaint();
            }

            if (me.input.isKeyPressed('up')) {
                me.game.viewport.move(0, -(me.game.currentLevel.tileheight / 2));
                // force redraw
                me.game.repaint();
            } else if (me.input.isKeyPressed('down')) {
                me.game.viewport.move(0, me.game.currentLevel.tileheight / 2);
                // force redraw
                me.game.repaint();
            }
            me.game.update();
            me.game.draw();
        },

        draw: function(context) {
        },

        onDestroyEvent: function() {}
    });
});
