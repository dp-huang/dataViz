/**
	Class for canvas wrapper
**/
DataViz = window['DataViz'] || {};

DataViz.CanvasWrapper = function(canvas) {
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');
	this._ctx.globalCompositeOperation = 'source-over';
};

DataViz.CanvasWrapper.prototype = {
	
	drawPath: function(pointsArr, prop) {
		var ctx = this._ctx;
		ctx.beginPath();
		if (prop.strokeStyle) {
			ctx.strokeStyle = prop.strokeStyle;
		}
		if (prop.lineWidth) {
			ctx.lineWidth = prop.lineWidth;
		}
		pointsArr.forEach(function(points) {
			for (var i = 0, len = points.length; i < len; i++) {
				var p = points[i];
				if (i == 0) {
					ctx.moveTo(p.x, p.y);
				} else {
					ctx.lineTo(p.x, p.y);
				}
			}
		});
		ctx.stroke();
	},

	drawCircle: function(center, radius, prop) {
		var ctx = this._ctx;
		ctx.beginPath();
		ctx.globalCompositeOperation = "destination-over";
		ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
		if (prop.lineWidth) {
			ctx.lineWidth = prop.lineWidth;
		}
		if (prop.strokeStyle) {
			ctx.strokeStyle = prop.strokeStyle;
		}
		if (prop.fillStyle) {
			ctx.fillStyle = prop.fillStyle;
		}
		ctx.stroke();
		ctx.fill();
	},

	drawText: function(center, text, prop) {
		var ctx = this._ctx;
		if (prop.fillStyle) {
			ctx.fillStyle = prop.fillStyle;
		}
		if (prop.font) {
			ctx.font = prop.font;
		}
		ctx.fillText(text, center.x, center.y);		
		ctx.fill();	
	},

	drawTexts: function(textsArr, prop) {
		var ctx = this._ctx;
		if (prop.fillStyle) {
			ctx.fillStyle = prop.fillStyle;
		}
		if (prop.font) {
			ctx.font = prop.font;
		}
		textsArr.forEach(function(t) {
			ctx.fillText(t.text, t.centerX, t.centerY);
		});
	},

	clearAll: function() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	},

	clearRect: function(startX, startY, width, height) {
		this._ctx.clearRect(startX, startY, width, height);
	}
};