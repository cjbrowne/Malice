define(["PlayScreen", "MaliceError"], function(PlayScreen, MaliceError) {
    function randomExpletive() {
        var expletives = [
            "fuck",
            "sod",
            "screw",
            "bugger"
        ];
        return expletives[Math.round(Math.random() * expletives.length)];
    }
    return me.ScreenObject.extend({
        init: function() {
            this.parent(true);
            this.font = new me.BitmapFont("menu_font", 32);
            this.background = me.loader.getImage("menu_background");
            $("#menu").show();
            $("#new").on('click', function(evt) {
                $("#menu").empty();
                $("#menu").append("<input type='text' id='seed' placeholder='seed (leave blank to generate random seed)'/>");
                $("#menu").append("<button id='create'>Create</button>");
                $("#create").on('click', function(evt) {
                    $("#menu").empty();
                    var seed = $(evt.target).val();
                    me.loader.load({
                        name: "map",
                        type: "tmx",
                        src: "/map" + (seed && "/" + seed) + "/" + randomExpletive() + "MelonJS.json"
                    }, function() {
                        me.state.set(me.state.PLAY, new PlayScreen());
                        me.state.change(me.state.PLAY);
                    }, function() {
                        var error = new MaliceError("Could not load map from server.", MaliceError.BUG);
                        error.show();
                    });
                });
            });
        },

        onResetEvent: function() {
            me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        },

        update: function() {
        },

        draw: function(context) {
            context.drawImage(this.background, 0, 0);
        },

        onDestroyEvent: function() {
            me.input.unbindKey(me.input.KEY.ENTER);
        }
    });
});
