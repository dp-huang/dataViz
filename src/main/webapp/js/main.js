/**
	This is the main class that registers events
**/

DataViz = window['DataViz'] || {};

DataViz.PageEvent = function() {
	this._init();
	this._renderer = undefined;
	this._options = {
		interval: 1
	};
}

DataViz.PageEvent.prototype = {
	_init: function() {
		this._options = {};
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
		//register event on canvas
		$('#metricsCanvas').on('mousemove', function(e) {
			var pos = me._getMousePos(this, e);
			if (me._renderer) {
				me._renderer.pick(pos);
			}
		});

		//register events on options
		$('#options [name=connected]').change(function(e) {
			var isChecked = $(this).is(':checked');
			me._options['connected'] = isChecked;
			me._render();
		});

		$('#options .interval').change(function(e) {
			var interval = $(this).val();
			me._options['interval'] = interval;
			me._refreshDashboard(me._duration);
		});

		$('#options .aggregation').change(function(e) {
			var agg = $(this).val();
			me._options['aggregation'] = agg;
			me._refreshDashboard(me._duration);
		});
	},

	_initialRequest: function() {
		this._refreshDashboard(300);
		var me = this;
		
		setInterval(function(e) {
			me._refreshDashboard(me._duration);
		}, 5000);
	},

	_getMousePos: function (canvas, evt) {
	    var rect = canvas.getBoundingClientRect();
	    return {
	        x: evt.clientX - rect.left,
	        y: evt.clientY - rect.top
	    };
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
		this._duration = duration;
		var me = this;
		var url = DataViz.Connection.buildUrl(duration, this._options['interval'], this._options['aggregation']);
		DataViz.Connection.requestGet(url).then(function(e) {
			if (e.errCode != 0) {
				alert('get data error from server');
			} else {
				if (me._renderer) {
					me._renderer.render(e.items, duration, new Date(), me._options);
				}
			}
		});
	},
	_render: function() {
		if (this._renderer) {
			this._renderer.renderWithOptions(this._options);
		}
	},
	registerRenderer: function(renderer) {
		this._renderer = renderer;
	},
	clearRenderer: function() {
		this._renderer = undefined;
	}
}

$(document).ready(function(e) {
	var pageEvent = new DataViz.PageEvent();
	var renderer = new DataViz.DataRenderer();
	pageEvent.registerRenderer(renderer);
});