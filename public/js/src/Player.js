define(function() {
	var Player = function() {};
	Player.prototype = {
		entity: null,
		displayedHealth: 100,
		actualHealth: 100,
		addFakeHealth: function(amount) {
			if(!amount || amount < 0) {
				throw new Error("Programming error: cannot add negative or non-existent health!");
			}
			if(this.displayedHealth + amount < 100) {
				this.displayedHealth += amount;
			} else {
				this.displayedHealth = 100;
			}
		},
		addRealHealth: function(amount) {
			if(!amount || amount < 0) {
				throw new Error("Programming error: cannot add negative or non-existent health!");
			}
			if(this.actualHealth + amount < 100) {
				this.actualHealth += amount;
			} else {
				this.actualHealth = 100;
			}
		},
		removeFakeHealth: function(amount) {
			if(!amount || amount < 0) {
				throw new Error("Programming error: cannot remove negative or non-existent health!");
			}
			if(this.displayedHealth - amount > 0) {
				this.displayedHealth -= amount;
			} else {
				this.displayedHealth = 0;
			}
		},
		removeRealHealth: function(amount) {
			if(!amount || amount < 0) {
				throw new Error("Programming error: cannot remove negative or non-existent health!");
			}
			if(this.actualHealth - amount > 0) {
				this.actualHealth -= amount;
			} else {
				this.actualHealth = 0;
			}
		}
	}
	return Player;
});