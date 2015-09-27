dataViz = dataViz || {};

dataViz.PageEvent = function() {
	this._init();
}

dataViz.PageEvent.prototype = {
	_init: function() {
		this._registerEvent();
	},

	_registerEvent: function() {
		var me = this;
		//click on timer picker selected
		$('.timer-picker .selected').click(function(e) {
			if (me._isPickerDropdownDisplay()) {
				me._hidePickerDropdown();
			} else {
				me._showPickerDropdown();
			}
		});
		//click on timer picker drop down list
		$('.timer-picker .dropdown li').click(function(e) {
			var target = e.currentTarget;
			if(target && target.id) {
				var value = $('#' + target.id).html();
				$('.timer-picker .selected').html(value);
				me._refreshDashboard(target.value);
			}
			me._hidePickerDropdown();
		});
	},
	_showPickerDropdown: function() {
		$('.timer-picker .dropdown').slideDown('slow');;
	},
	_hidePickerDropdown: function() {
		$('.timer-picker .dropdown').css('display', 'none');
	},
	_isPickerDropdownDisplay: function() {
		return $('.timer-picker .dropdown').css('display') == 'block';
	},
	_refreshDashboard: function(duration) {
		alert('refreshing dashboard with duration ' + duration);
	}
}

$(document).ready(function(e) {
	var pageEvent = new dataViz.PageEvent();
});