define(function() {
	return me.ScreenObject.extend({

		init: function() {
			this.parent(true);
			this.font = new me.BitmapFont("menu_font", 32);
			this.background = me.loader.getImage("menu_background");
		},

		onResetEvent: function() {
			me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		},

		update: function() {

		},

		draw: function(context) {
			context.drawImage(this.background,0,0);
			
		},

		onDestroyEvent: function() {
			me.input.unbindKey(me.input.KEY.ENTER);
		}
	});
});