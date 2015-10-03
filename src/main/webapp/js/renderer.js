/**
	This class is responsible for the the dashboard rendering
**/

DataViz = window['DataViz'] || {};

DataViz.DataRenderer = function() {
	this._context = undefined;
	this._width = undefined;
	this._height = undefined;
	this._screenPoints = [];
	//default line colors
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
	this._dimentionFilter = {};
	this._xAxisLines = [];
	this._yAxisLines = [];
}

DataViz.DataRenderer.prototype = {

	_isAvailableDimention: function(key) {
		var value = this._dimentionFilter[key];
		if (value === true || value === undefined) {
			return true;
		}
		return false;
	},

	_process: function(data) {
		var maxValue = 0;
		for (var key in data) {
			if (!this._isAvailableDimention(key)) {
				continue;
			}
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
			index++;
			if (!this._isAvailableDimention(key)) {
				continue;
			}
			this._drawDimension(key, data[key], this._duration);
		}
	},

	_showAxis: function() {
		var date = this._currentDate;
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
			ctx.fillText(text, endPosX - 30, this._height + 20);
		}
		//y axis
		var valueEach = this._maxValue / 5;

		for (var i = 0; i < 5; i++) {
			var startY = this._height - this._verticalScale * valueEach * i;
			var text = Math.round(valueEach * i);
			ctx.fillText(text, 0, startY + 4);
		}

		//show x,y axis lines
		ctx.beginPath();
		ctx.strokeStyle = '#bbbfc2';
		ctx.lineWidth = 0.6;
		this._xAxisLines = [];
		this._yAxisLines = [];
		for (var i = 0; i < 5; i++) {
			var endPosX = this._width - endPadding - this._horizontalScale * i  * 60 * durationEach;
			var startX = endPosX - 20;
			var startY = this._verticalScale * valueEach;
			var endX = endPosX - 20;
			var endY = this._height;
			ctx.moveTo(endPosX - 20, this._verticalScale * valueEach);
			ctx.lineTo(endPosX - 20, this._height);
			this._xAxisLines.push({
				startX: startX,
				startY: startY,
				endX: endX,
				endY: endY
			});
		}
		for (var i = 0; i < 5; i++) {
			var y = this._height - this._verticalScale * valueEach * i;
			ctx.moveTo(0, y);
			ctx.lineTo(this._width, y);
			this._yAxisLines.push({
				startX: 0,
				startY: y,
				endX: this._width,
				endY: y
			});
		}
		ctx.stroke();
		ctx.fillStyle = '#000';
	},

	_createSubtitle: function() {
		$('#subtitle').html('');
		var me = this;
		for (var key in this._lineColors) {
			var color = this._lineColors[key];
			color = this._convertColor(color);
			var lineDiv = $('<div></div>').addClass('line').css('border-top-color', color);
			$('#subtitle').append(lineDiv);
			var keySpan = $('<span></span>').text(key).css('color', color).attr('key', key);
			if (this._dimentionFilter[key] === false) {
				keySpan.css('color', '#7f7f7f');
			} else {
				keySpan.css('color', color);
			}
			keySpan.click(function(e) {
				var target = e.currentTarget;
				var key = $(target).attr('key');
				if (me._dimentionFilter[key] === false) {
					me._dimentionFilter[key] = true;
				} else {
					me._dimentionFilter[key] = false;
				}
				//refresh dashboard
				me.render(me._initialData, me._duration);
			});
			$('#subtitle').append(keySpan);
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
			var dist = (pos.x - screenPoints[i].x) * (pos.x - screenPoints[i].x) + (pos.y - screenPoints[i].y) * (pos.y - screenPoints[i].y);
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
			if (!this._isAvailableDimention(key)) {
				continue;
			}
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
        ctx.strokeStyle = this._convertColor(color);
        ctx.stroke();
		ctx.fill();
	},

	_clearCircle: function(index) {
		this._hideTooltip();
		$('#metricsCanvas').css('cursor', 'default')
		var ctx = this._context;
		//restore line
		var screenPoints = this._screenPoints[this._pickedLine];
		var length = screenPoints.length;

		var delta = Math.floor(10 / this._horizontalScale);
		if (delta < 30) {
			delta = 30;
		}

		var minIndex = (index - delta) < 0 ? 0 : index - delta;
		var maxIndex = (index + delta) > length - 1 ? length - 1 : index + delta;

		var startX = minIndex * this._horizontalScale;
		ctx.clearRect(minIndex * this._horizontalScale, 0, (maxIndex - minIndex) * this._horizontalScale, this._height + 10);
		//redraw
		this._restore(minIndex, maxIndex);
	},

	_restore: function(minIndex, maxIndex) {
		var ctx = this._context;
		var startX = minIndex * this._horizontalScale;
		var endX = maxIndex * this._horizontalScale;

		//restore axis lines
		ctx.beginPath();
		ctx.lineWidth = 0.6;
		ctx.strokeStyle = '#bbbfc2';
		this._xAxisLines.forEach(function(line) {
			if (line.startX > startX && line.startX < endX) {
				//redraw
				ctx.moveTo(line.startX, line.startY);
				ctx.lineTo(line.endX, line.endY);
			}
		});
		this._yAxisLines.forEach(function(line) {
			ctx.moveTo(startX, line.startY);
			ctx.lineTo(endX, line.endY);
		});
		ctx.stroke();
		//restore each dimensions
		for (var key in this._screenPoints) {
			if (!this._isAvailableDimention(key)) {
				continue;
			}
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

	_dateToStr: function(date) {
		var hour = date.getHours();
		var min = date.getMinutes();
		var seconds = date.getSeconds();
		var displayHour = hour;
		if (hour < 10) {
			displayHour = '0' + hour;
		}
		var displayMin = min;
		if (min < 10) {
			displayMin = '0' + min;
		}
		var displaySecond = seconds;
		if (seconds < 10) {
			displaySecond = '0' + seconds;
		}
		return displayHour + ':' + displayMin + ':' + displaySecond;
	},

	_showTooltip: function(point) {
		var x = point.x + 65;
		var y = point.y + 60;
		var value = Math.round((this._height - point.y) / this._verticalScale);
		var date = new Date();
		var ts = date.getTime() - 1000 * (this._duration - Math.round(point.x / this._horizontalScale));
		date.setTime(ts);
		var tsString = this._dateToStr(date);
		var ts = Math.round(point.x / this._horizontalScale);
		$('#metricsTooltip').css('display', 'block')
			.css('left', x + 'px')
			.css('top', y + 'px');
		$('#metricsTooltip > span').text(value + ' @ ' + tsString);
	},

	_hideTooltip: function() {
		$('#metricsTooltip').css('display', 'none');
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
		this._showTooltip(point);
	},

	render: function(data, duration, date) {
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
		if (date) {
			this._currentDate = date;
		}
		this._duration = duration;
		this._initialData = data;
		this._process(data);
		this._showAxis();
		this._drawDimensions(data);
		this._createSubtitle();
	},

	clear: function() {
		if (this._context) {
			this._context.clearRect(0, 0, this._width, this._height + 20);
		}
	}
}