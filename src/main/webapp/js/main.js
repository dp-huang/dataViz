DataViz = DataViz || {};

DataViz.PageEvent = function() {
	this._init();
	this._renderer;
}

DataViz.PageEvent.prototype = {
	_init: function() {
		this._registerEvent();
		this._initialRequest();
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
				$('.timer-picker .selected > span:first-child').html(value);
				me._refreshDashboard(target.value);
			}
			me._hidePickerDropdown();
		});
	},

	_initialRequest: function() {
		this._refreshDashboard(300);
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
		var me = this;
		var url = DataViz.Connection.buildUrl(duration);
		DataViz.Connection.requestGet(url).then(function(e) {
			if (e.errCode != 0) {
				alert('get data error from server');
			} else {
				var items = e.items;
				if (me._renderer) {
					me._renderer.render(items);
				}
			}
		});
	},
	registerRenderer: function(renderer) {
		this._renderer = renderer;
	},
	clearRenderer: function() {
		this._renderer = undefined;
	}
}

DataViz.DataRenderer = function() {
	this._context = undefined;
	this._width = undefined;
	this._height = undefined;
}

DataViz.DataRenderer.prototype = {

	render: function(data) {
		if (!this._context) {
			var canvas = document.getElementById('metricsCanvas');
			var width = $('.container').width();
			canvas.width = width;
			this._context = canvas.getContext('2d');
			this._width = canvas.width;
			this._height = canvas.height;
		}
		debugger
		this.clear();
		var context = this._context;
		context.strokeStyle = "red";
		context.strokeRect(10, 10, 190, 100);
		context.fillStyle = "blue";
        context.fillRect(110,110,100,100);
	},

	clear: function() {
		if (this._context) {
			this._context.clearRect(0, 0, this._width, this._height);
		}
	}
}

$(document).ready(function(e) {
	var pageEvent = new DataViz.PageEvent();
	var renderer = new DataViz.DataRenderer();
	pageEvent.registerRenderer(renderer);
});