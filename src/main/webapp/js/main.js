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
				if (me._renderer) {
					me._renderer.render(e.items, duration);
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

	_process: function(data, duration) {
		var maxValue = 0;
		for (var key in data) {
			var items = data[key];
			items.forEach(function(e) {
				if (maxValue < e.value) {
					maxValue = e.value;
				}
			});
		}
		this._verticalScale =  this._height / maxValue;
		this._horizontalScale = this._width / duration;
	},
	
	_drawDimension: function(items, duration) {
		debugger
		var context = this._context;
		context.strokeStyle = 'red';
		context.beginPath();
		var verticalScale = this._verticalScale * 0.8;
		for (var i = 0; i < duration; i++) {
			if (i == 0) {
				context.moveTo(i * this._horizontalScale, this._height - items[i].value * verticalScale);
			} else {
				context.lineTo(i * this._horizontalScale, this._height - items[i].value * verticalScale);
			}
		}
		context.stroke();
	},

	_drawDimensions: function(data, duration) {
		for (var key in data) {
			this._drawDimension(data[key], duration);
		}
	},

	render: function(data, duration) {
		if (!this._context) {
			var canvas = document.getElementById('metricsCanvas');
			var width = $('.container').width();
			canvas.width = width;
			this._context = canvas.getContext('2d');
			this._width = canvas.width;
			this._height = canvas.height;
		}
		this.clear();
		this._process(data, duration);
		this._drawDimensions(data, duration);
		/*
		var context = this._context;
		context.strokeStyle = "red";
		context.strokeRect(10, 10, 190, 100);
		context.fillStyle = "blue";
        context.fillRect(110,110,100,100);
        */
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