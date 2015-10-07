/**
	This class is responsible for the the dashboard rendering
**/

DataViz = window['DataViz'] || {};

DataViz.DataRenderer = function() {
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
		this._verticalScale =  this._height * 0.9/ maxValue;
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
		var verticalScale = this._verticalScale;
		var screenPoints = [];
		
		for (var i = 0, len = items.length; i < len; i++) {
			var xPos = i * this._horizontalScale * this._interval;
			var yPos = this._height - items[i].value * verticalScale;
			screenPoints.push({x: xPos, y: yPos});
		}
		var pathPoints = [];
		var me = this;
		if (this._options && this._options.connected) {
			screenPoints.forEach(function(p) {
				if (p.y < me._height) {
					pathPoints.push(p);
				}
			});
		} else {
			pathPoints = screenPoints.slice(0);
		}
		this._canvasWrapper.drawPath([pathPoints], {
			strokeStyle: this._convertColor(color),
			lineWidth: 1
		});
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

	_showYAxisTexts: function() {
		var valueEach = this._maxValue / 5;
		var textsArr = [];
		for (var i = 0; i <= 5; i++) {
			var startY = this._height - this._verticalScale * valueEach * i;
			var text = Math.round(valueEach * i);
			textsArr.push({text: text, centerX: 0, centerY: startY + 4});
		}

		this._canvasWrapper.drawTexts(textsArr, {
			fillStyle: '#fff', font: "11px Verdana"
		});
	},

	_showAxis: function() {
		var date = this._currentDate;
		var hour = date.getHours();
		var min = date.getMinutes();
		var seconds = date.getSeconds();
		var durationEach = Math.floor(this._duration / 300);
		var endPadding = this._horizontalScale * seconds;
		var textsArr = [];
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
			textsArr.push({text: text, centerX: endPosX - 30, centerY: this._height + 20});
		}
		this._canvasWrapper.drawTexts(textsArr, {
			fillStyle: '#fff', font: "11px Verdana"
		});

		//y axis
		this._showYAxisTexts();
		var valueEach = this._maxValue / 5;

		//show x,y axis lines
		if (this._verticalScale === Infinity) {
			return;
		}
		this._xAxisLines = [];
		this._yAxisLines = [];
		var pointsArr = [];
		for (var i = 0; i <= 5; i++) {
			var endPosX = this._width - endPadding - this._horizontalScale * i  * 60 * durationEach;
			var startX = endPosX - 20;
			var startY = this._height * 0.1;
			var endX = endPosX - 20;
			var endY = this._height;
			this._xAxisLines.push({
				startX: startX,
				startY: startY,
				endX: endX,
				endY: endY
			});
			pointsArr.push([
				{x: endPosX - 20, y: startY},
				{x: endPosX - 20, y: endY}
			]);
		}
		for (var i = 0; i <= 5; i++) {
			var y = this._height - this._verticalScale * valueEach * i;
			this._yAxisLines.push({
				startX: 0,
				startY: y,
				endX: this._width,
				endY: y
			});
			pointsArr.push([
				{x: 0, y: y},
				{x: this._width, y: y}
			]);
		}
		this._canvasWrapper.drawPath(pointsArr, {
			lineWidth: 0.6,
			strokeStyle: '#bbbfc2'
		});
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
				me._render();
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
		var color = this._lineColors[lineKey];

		this._canvasWrapper.drawCircle(center, 8, {
			lineWidth: 4,
			fillStyle: '#000',
			strokeStyle: this._convertColor(color)
		});
	},

	_clearCircle: function(index) {
		this._hideTooltip();
		$('#metricsCanvas').css('cursor', 'default')
		//restore line
		var screenPoints = this._screenPoints[this._pickedLine];
		var length = screenPoints.length;

		var delta = Math.floor(10 / this._horizontalScale);
		if (delta < 15) {
			delta = 15;
		}

		var minIndex = (index - delta) < 0 ? 0 : index - delta;
		var maxIndex = (index + delta) > length - 1 ? length - 1 : index + delta;

		this._canvasWrapper.clearRect(minIndex * this._horizontalScale * this._interval, 0, (maxIndex - minIndex) * this._horizontalScale * this._interval, this._height + 10);
		//redraw
		this._restore(minIndex, maxIndex);
	},

	_restore: function(minIndex, maxIndex) {
		var me = this;
		var startX = minIndex * this._horizontalScale * this._interval;
		var endX = maxIndex * this._horizontalScale * this._interval;

		//restore axis lines
		var pointsArr = [];
		this._xAxisLines.forEach(function(line) {
			if (line.startX > startX && line.startX < endX) {
				//redraw
				pointsArr.push([
					{x: line.startX, y: line.startY},
					{x: line.endX, y: line.endY}
				]);
			}
		});
		this._yAxisLines.forEach(function(line) {
			pointsArr.push([
				{x: startX, y: line.startY},
				{x: endX, y: line.endY}
			]);
		});
		this._canvasWrapper.drawPath(pointsArr, {
			lineWidth: 0.6,
			strokeStyle: '#bbbfc2'
		});
		if (minIndex <= 0) {
			this._showYAxisTexts();
		}
		//restore each dimensions
		for (var key in this._screenPoints) {
			if (!this._isAvailableDimention(key)) {
				continue;
			}
			var points = this._screenPoints[key];
			var color = this._lineColors[key];
			var pointArr = [];
			for (var i = minIndex; i <= maxIndex; i++) {
				var pos = points[i];
				if (!pos) {
					continue;
				}
				pointArr.push(pos);
			}
			//connected option
			var pathPoints = [];
			if (this._options && this._options.connected) {
				if (points[minIndex].y == this._height) {
					var intersect = this._intersection(minIndex, 0, points.length - 1, this._height, points);
					if (intersect) {
						pathPoints.push(intersect);
					}
				}
				pointArr.forEach(function(p) {
					if (p.y < me._height) {
						pathPoints.push(p);
					}
				});
				if (points[maxIndex].y == this._height) {
					var intersect = this._intersection(maxIndex, 0, points.length - 1, this._height, points);
					if (intersect) {
						pathPoints.push(intersect);
					}
				}
			} else {
				pathPoints = pointArr;
			}
			this._canvasWrapper.drawPath([pathPoints], {
				lineWidth: 1,
				strokeStyle: this._convertColor(color)
			});
		}
	},


	_intersection: function(index, minIndex, maxIndex, maxHeight, points) {
		var tmpIndex;
		tmpIndex = index;
		while(tmpIndex-- >= 1) {
			if (points[tmpIndex].y < maxHeight) {
				break;
			}
		}
		var index1 = tmpIndex;
		if (index1 < 0) {
			return undefined;
		}
		tmpIndex = index;
		while(tmpIndex++ < maxIndex) {
			if (points[tmpIndex].y < maxHeight) {
				break;
			}
		}
		var index2 = tmpIndex;
		if (index2 > maxIndex) {
			return undefined;
		}
		if (index1 == index2) {
			return points[index1];
		}
		var y = (points[index2].y - points[index1].y) * (points[index].x - points[index1].x) / (points[index2].x - points[index1].x) + points[index1].y;
		return {x: points[index].x, y: y};
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

	_render: function() {
		this.render(this._initialData, this._duration, undefined, this._options);
	},

	renderWithOptions: function(options) {
		this.render(this._initialData, this._duration, undefined, options);
	},

	render: function(data, duration, date, options) {
		if (!this._canvasWrapper) {
			var canvas = document.getElementById('metricsCanvas');
			canvas.width = $('.container').width();
			this._width = canvas.width;
			this._height = canvas.height - 20;
			this._canvasWrapper = new DataViz.CanvasWrapper(canvas);
		}
		this.clear();
		if (date) {
			this._currentDate = date;
		}
		if (options) {
			this._options = options;
			this._interval = options['interval'];
		}
		this._duration = duration;
		this._initialData = data;
		this._process(data);
		this._showAxis();
		this._drawDimensions(data);
		this._createSubtitle();
	},

	clear: function() {
		if (this._canvasWrapper) {
			this._canvasWrapper.clearAll();
		}
	}
}