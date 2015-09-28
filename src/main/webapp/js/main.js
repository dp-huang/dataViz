DataViz = window['DataViz'] || {};

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
		//register event on canvas

		$('#metricsCanvas').on('mousemove', function(e) {
			var pos = me._getMousePos(this, e);
			if (me._renderer) {
				me._renderer.pick(pos);
			}
		})
	},

	_initialRequest: function() {
		this._refreshDashboard(300);
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
	this._screenPoints = [];
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
		var ctx = this._context;
		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 1;
		var verticalScale = this._verticalScale * 0.8;
		var screenPoints = [];
		for (var i = 0; i < duration; i++) {
			var xPos = i * this._horizontalScale;
			var yPos = this._height - items[i].value * verticalScale;
			if (i == 0) {
				ctx.moveTo(xPos, yPos);
			} else {
				ctx.lineTo(xPos, yPos);
			}
			screenPoints.push({'x': xPos, 'y': yPos});
		}
		ctx.stroke();
		this._screenPoints = screenPoints;
	},

	_drawDimensions: function(data, duration) {
		for (var key in data) {
			this._drawDimension(data[key], duration);
		}
	},

	_binarySearch: function(find, points, low, high) {
		if(low <= high){
			if(points[low].x == find) {
				return low;
			}
			if(points[high].x == find) {
				return high;
			}
			var mid = Math.ceil((high+low)/2);
			if(Math.abs(points[mid].x - find) <= 2){
				return mid;
			} else if(points[mid].x > find) {
				return this._binarySearch(find, points, low, mid - 1);
			} else {
				return this._binarySearch(find, points, mid + 1, high);
			}
		}
		return -1;
	},

	_getPickPoint: function(pos) {
		var screenPointLength = this._screenPoints.length;
		var pickXIndex = this._binarySearch(pos.x, this._screenPoints, 0, screenPointLength - 1);
		if (pickXIndex == -1) {
			return -1;
		}
		if (pickXIndex == 0 || pickXIndex == this._screenPoints.length - 1) {
			return -1;
		}
		var bestCandidateIndex = -1;
		var minDistance = 10000000;
		var maxStep = parseInt(10 / this._horizontalScale);
		for (var i = pickXIndex - maxStep; i < pickXIndex + maxStep; i++) {
			if (i < 0 || i > screenPointLength - 1) {
				continue;
			}
			var dist = Math.sqrt((pos.x - this._screenPoints[i].x) * (pos.x - this._screenPoints[i].x) + (pos.y - this._screenPoints[i].y) * (pos.y - this._screenPoints[i].y));
			if (dist < minDistance) {
				minDistance = dist;
				bestCandidateIndex = i;
			}
		}
		//good enough
		var delta = 8 / this._horizontalScale;
		if (delta > 30) {
			delta = 30;
		}
		if (minDistance <= delta) {
			return bestCandidateIndex;
		}
		return -1;
	},

	_drawCircle: function(center) {
		var ctx = this._context;
		ctx.beginPath();
		ctx.globalCompositeOperation="destination-over";
		ctx.arc(center.x, center.y, 8, 0, 2 * Math.PI, false);
		ctx.lineWidth = 4;
        ctx.strokeStyle = 'green';
        ctx.stroke();
		ctx.fill();
	},

	_clearCircle: function(index) {
		var ctx = this._context;
		
		//restore line
		var length = this._screenPoints.length;
		var minIndex = (index - 10) < 0 ? 0 : index - 10;
		var maxIndex = (index + 10) > length - 1 ? length - 1 : index + 10;

		var startX = minIndex * this._horizontalScale;
		var endX = (maxIndex - minIndex) * this._horizontalScale;

		ctx.clearRect(minIndex * this._horizontalScale, 0, (maxIndex - minIndex) * this._horizontalScale, this._height);
		
		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 1;

		for (var i = minIndex; i <= maxIndex; i++) {
			var pos = this._screenPoints[i];
			if (i == minIndex) {
				ctx.moveTo(pos.x, pos.y);
			} else {
				ctx.lineTo(pos.x, pos.y);
			}
		}
		ctx.stroke();
	},

	pick: function(pos) {
		var pickedIndex = this._getPickPoint(pos);
		if (pickedIndex == -1) {
			if (this._pickedIndex) {
				this._clearCircle(this._pickedIndex);
				this._pickedIndex = undefined;
			}
			return;
		}
		if (this._pickedIndex == pickedIndex) {
			return;
		}
		if (this._pickedIndex) {
			this._clearCircle(this._pickedIndex);
		}
		this._pickedIndex = pickedIndex;
		var point = this._screenPoints[pickedIndex];
		//draw circle
		this._drawCircle(point);
	},

	render: function(data, duration) {
		if (!this._context) {
			var canvas = document.getElementById('metricsCanvas');
			var width = $('.container').width();
			canvas.width = width;
			this._context = canvas.getContext('2d');
			this._width = canvas.width;
			this._height = canvas.height - 10;
		}
		this._context.globalCompositeOperation = 'source-over';
		this.clear();
		this._process(data, duration);
		this._drawDimensions(data, duration);
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