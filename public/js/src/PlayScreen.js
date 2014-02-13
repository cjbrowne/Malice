define(["MaliceDebug","Player"], function(MaliceDebug,Player) {
    function iso_to_screen(iso) {
        // TODO: implement this
        return {
            x: me.game.currentLevel.width / 2,
            y: me.game.currentLevel.height / 2
        }
    }
    return me.ScreenObject.extend({
        init: function() {
            this.parent(true);
            this.player = new Player();
        },

        onResetEvent: function() {
        	var player_pos = me.loader.getTMX("map").player_pos;
            var player_pos_abs = iso_to_screen(player_pos);
            me.game.reset();
            me.levelDirector.loadLevel("map");
            me.game.viewport.move(
                player_pos_abs.x -
                me.game.viewport.width / 2, 
                player_pos_abs.y -
                me.game.viewport.height / 2);
            me.input.bindKey(me.input.KEY.W, "up", false);
            me.input.bindKey(me.input.KEY.A, "left", false);
            me.input.bindKey(me.input.KEY.S, "down", false);
            me.input.bindKey(me.input.KEY.D, "right", false);
        },

        onUpdateFrame: function() {
            if (me.input.isKeyPressed('left')) {
                me.game.viewport.move(-(me.game.currentLevel.tileheight / 2), 0);
                // force redraw
                me.game.repaint();

            } else if (me.input.isKeyPressed('right')) {
                me.game.viewport.move(me.game.currentLevel.tileheight / 2, 0);
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
            this.player.update(); // among other things, draws the HUD
            malice.debug.framecount++;
            malice.debug.update();
        },

        draw: function(context) {
        },

        onDestroyEvent: function() {}
    });
});
