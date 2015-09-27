dataViz = {};

dataViz.Connection = {
	
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