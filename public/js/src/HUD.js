define(["jquery"],function($) {
	var HUD = function() {

	}
	HUD.prototype = {
		draw: function(playerInfo) {
			function _draw() {
				$("#healthBar").width(playerInfo.displayedHealth);
				requestAnimationFrame(_draw);
			}
			requestAnimationFrame(_draw);
		}
	}
	return HUD;
});