/**
	The class is responsible for the data connection with backend
**/

DataViz = window['DataViz'] || {};

DataViz.Connection = {
	
	buildUrl: function(duration, interval, aggregation) {
		var now = Math.round(new Date().getTime() / 1000);
		var start = now - duration;
		var defaultInterval = 1;
		if (!interval) {
			interval = defaultInterval;
		}
		if (!aggregation) {
			aggregation = 'max';
		}
		var url = '/api/metrics/metric?start=' + start + '&end=' + now + '&interval=' + interval + '&agg=' + aggregation;
		return url;
	},

	requestGet: function(url) {
		if (!url) return Promise.reject(null);
		return new Promise(function(resolve, reject) {
			$.ajax({
				url: url,
				dataType: 'json',
				type: 'GET',
				success: resolve,
				error: reject
			});
		});
	},

	requestPost: function(url, dataObj) {
		if (!url || !dataObj) return Promise.reject(null);
		dataObj = JSON.stringify(dataObj);
        return new Promise(function (resolve,reject) {
            $.ajax({
                type: "POST",
                url: url,
                data: dataObj,              
                contentType: "application/json",
                dataType: "json",
                success: resolve,
                error: reject
            });
        });
	}
}