define(function() {
	var MaliceError = function(what,priority) {
		// assume it's our fault by default
		this.priority = priority || MaliceError.BUG;
		this.what = what;
	}
	MaliceError.prototype = {
		show: function() {
			if(!$("#error").length > 0) {
				$('body').append("<div id='error'></div>");
			}
			$("#error").html("<span class='error'><h1>Error!</h1>"+this.what+"<br /></span>");
			switch(this.priority) {
				case MaliceError.BUG: {
					$("#error .error").append($("#bugReportMessage").html());
					break;
				}
				case MaliceError.PEBKAC: {
					$("#error").append($("#pebkacMessage"));
					break;
				}
			}
			$("#error").show();
		},
		reset: function() {
			$("#error").remove();
		}
	}
	MaliceError.BUG = 0;
	MaliceError.PEBKAC = 1;
	return MaliceError;
});