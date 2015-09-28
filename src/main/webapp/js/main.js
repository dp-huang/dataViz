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
	this._colors = [
		{ r: 126, g: 178, b: 109 },
		{ r: 234, g: 184, b: 57 },
		{ r: 110, g: 208, b: 224 },
		{ r: 239, g: 132, b: 60 },
		{ r: 226, g: 77, b: 66 },
		{ r: 31, g: 120, b: 193 },
		{ r: 186, g: 67, b: 169}
	];
	this._lineColors = {};
	this._screenPoints = {};
}

DataViz.DataRenderer.prototype = {

	_process: function(data) {
		var maxValue = 0;
		for (var key in data) {
			var items = data[key];
			items.forEach(function(e) {
				if (maxValue < e.value) {
					maxValue = e.value;
				}
			});
		}
		this._maxValue = maxValue;
		this._verticalScale =  this._height / maxValue;
		this._horizontalScale = this._width / this._duration;
	},

	_createRandomColor: function() {
		return {
			r: Math.floor(Math.random() * 255),
			g: Math.floor(Math.random() * 255),
			b: Math.floor(Math.random() * 255)
		}
	},

	_convertColor: function(rgb) {
		return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
	},

	_convertAlphaColor: function(rgb, alpha) {
		return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
	},
	
	_drawDimension: function(key, items) {
		var color = this._lineColors[key];
		var ctx = this._context;
		ctx.beginPath();
		ctx.strokeStyle = this._convertColor(color);
		ctx.lineWidth = 1;
		var verticalScale = this._verticalScale * 0.8;
		var screenPoints = [];
		for (var i = 0; i < this._duration; i++) {
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
		this._screenPoints[key] = screenPoints;
	},

	_drawDimensions: function(data) {
		var index = 0;
		for (var key in data) {
			if (index < this._colors.length) {
				this._lineColors[key] = this._colors[index];
			} else {
				this._lineColors[key] = this._createRandomColor();
			}
			this._drawDimension(key, data[key], this._duration);
			index++;
		}
	},

	_showAxis: function() {
		var date = new Date();
		var hour = date.getHours();
		var min = date.getMinutes();
		var seconds = date.getSeconds();
		var durationEach = Math.floor(this._duration / 300);

		var ctx = this._context;
		ctx.fillStyle = '#fff';
		ctx.font="11px Verdana";
		var endPadding = this._horizontalScale * seconds;
		//x axis
		for (var i = 0; i < 5; i++) {
			var endPosX = this._width - endPadding - this._horizontalScale * i  * 60 * durationEach;
			var min1 = min - i * durationEach;
			while (min1 < 0) {
				min1 += 60;
				min += 60;
				hour--;
				if (hour < 0) {
					hour = 23;
				}
			}
			var displayHour = hour;
			if (hour < 10) {
				displayHour = '0' + hour;
			}
			var displayMin = min1;
			if (min1 < 10) {
				displayMin = '0' + min1;
			}
			var text = displayHour + ':' + displayMin;
			ctx.fillText(text, endPosX - 20, this._height + 20);
		}
		//y axis
		var valueEach = Math.floor(this._maxValue / 5);

		for (var i = 0; i < 5; i++) {
			var startY = this._height - this._verticalScale * valueEach * i;
			var text = valueEach * i;
			ctx.fillText(text, 0, startY);
		}

		ctx.fillStyle = '#000';


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

	_getSingleLinePickPoint: function(pos, screenPoints) {
		var screenPointLength = screenPoints.length;
		var pickXIndex = this._binarySearch(pos.x, screenPoints, 0, screenPointLength - 1);
		var defaultReturn = {index: -1};
		if (pickXIndex == -1) {
			return defaultReturn;
		}
		if (pickXIndex == 0 || pickXIndex == screenPoints.length - 1) {
			return defaultReturn;
		}
		var bestCandidateIndex = -1;
		var minDistance = 10000000;
		var maxStep = parseInt(10 / this._horizontalScale);
		for (var i = pickXIndex - maxStep; i < pickXIndex + maxStep; i++) {
			if (i < 0 || i > screenPointLength - 1) {
				continue;
			}
			var dist = Math.sqrt((pos.x - screenPoints[i].x) * (pos.x - screenPoints[i].x) + (pos.y - screenPoints[i].y) * (pos.y - screenPoints[i].y));
			if (dist < minDistance) {
				minDistance = dist;
				bestCandidateIndex = i;
			}
		}
		//good enough ?
		var delta = 8 / this._horizontalScale;
		if (delta > 30) {
			delta = 30;
		}
		if (minDistance <= delta) {
			return { index: bestCandidateIndex, dist: minDistance };
		}
		return defaultReturn;
	},

	_getPickPoint: function(pos) {
		var minDistance = 10000000;
		var lineKey = '';
		var index = -1;
		for (var key in this._screenPoints) {
			var result = this._getSingleLinePickPoint(pos, this._screenPoints[key]);
			if (result.index == -1) {
				continue;
			}
			if (result.dist < minDistance) {
				minDistance = result.dist;
				lineKey = key;
				index = result.index;
			}
		}
		if (index > -1) {
			return {key: lineKey, index: index};
		}
		return {index: -1};
	},

	_drawCircle: function(lineKey, center) {
		$('#metricsCanvas').css('cursor', 'pointer');
		var ctx = this._context;
		ctx.beginPath();
		ctx.globalCompositeOperation="destination-over";
		ctx.arc(center.x, center.y, 8, 0, 2 * Math.PI, false);
		ctx.lineWidth = 4;
		var color = this._lineColors[lineKey];
        ctx.strokeStyle = this._convertAlphaColor(color, 0.5);
        ctx.stroke();
		ctx.fill();
	},

	_clearCircle: function(index) {
		$('#metricsCanvas').css('cursor', 'default')
		var ctx = this._context;
		//restore line
		var screenPoints = this._screenPoints[this._pickedLine];
		var length = screenPoints.length;
		var minIndex = (index - 10) < 0 ? 0 : index - 10;
		var maxIndex = (index + 10) > length - 1 ? length - 1 : index + 10;

		var startX = minIndex * this._horizontalScale;
		var endX = (maxIndex - minIndex) * this._horizontalScale;

		ctx.clearRect(minIndex * this._horizontalScale, 0, (maxIndex - minIndex) * this._horizontalScale, this._height + 10);
		
		for (var key in this._screenPoints) {
			var points = this._screenPoints[key];
			var color = this._lineColors[key];
			ctx.beginPath();
			ctx.strokeStyle = this._convertColor(color);
			ctx.lineWidth = 1;

			for (var i = minIndex; i <= maxIndex; i++) {
				var pos = points[i];
				if (!pos) {
					continue;
				}
				if (i == minIndex) {
					ctx.moveTo(pos.x, pos.y);
				} else {
					ctx.lineTo(pos.x, pos.y);
				}
			}
			ctx.stroke();
		}
	},

	pick: function(pos) {
		var result = this._getPickPoint(pos);
		var pickedIndex = result.index;
		var lineKey = result.key;
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
		this._pickedLine = lineKey;
		var point = this._screenPoints[lineKey][pickedIndex];
		//draw circle
		this._drawCircle(lineKey, point);
	},

	render: function(data, duration) {
		if (!this._context) {
			var canvas = document.getElementById('metricsCanvas');
			var width = $('.container').width();
			canvas.width = width;
			this._context = canvas.getContext('2d');
			this._width = canvas.width;
			this._height = canvas.height - 20;
		}
		this._context.globalCompositeOperation = 'source-over';
		this.clear();
		this._duration = duration;
		this._process(data);
		this._drawDimensions(data);
		this._showAxis();
	},

	clear: function() {
		if (this._context) {
			this._context.clearRect(0, 0, this._width, this._height + 20);
		}
	}
}

$(document).ready(function(e) {
	var pageEvent = new DataViz.PageEvent();
	var renderer = new DataViz.DataRenderer();
	pageEvent.registerRenderer(renderer);
});