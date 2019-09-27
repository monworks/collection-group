function merge_by_key(key, jsonArray) {
	outputArray = []
	timeArr = []
	//find the timestamps and put it uniquely in an array
	for (var i = 0; i < jsonArray.length; i++) {
		if (!(timeArr.indexOf(jsonArray[i].time) != -1)) {
			timeArr.push(jsonArray[i].time)
		}
	}
	// print("timeArr", timeArr)

	//logic for merging all null components per timestamp and putting it in an outputArray
	for (var l in timeArr) {
		tempStore = {}
		for (var i = 0; i < jsonArray.length; i++) {
			if (jsonArray[i].time == timeArr[l]) {
				if (!(jsonArray[i][key] in tempStore)) {
					tempStore[jsonArray[i][key]] = jsonArray[i]
				} else {
					tempStore[jsonArray[i][key]] = jsonConcat(tempStore[jsonArray[i][key]], jsonArray[i])
				}
			}
		}
		// print("tempStore", tempStore)
		for (var p in tempStore) {
			outputArray.push(tempStore[p])
		}
	}
	return outputArray;
}

function jsonConcat(o1, o2) {
	for (var key in o2) {
		if (o2[key] != null) {
			o1[key] = o2[key];
		}
	}
	return o1;
}

var preserveKey = []

function diffCounter(jsonArray, preserveKey, key) {
	timeArr = []
	//find the timestamps and put it uniquely in an array
	for (var i = 0; i < jsonArray.length; i++) {
		if (!(timeArr.indexOf(jsonArray[i].time) != -1)) {
			timeArr.push(jsonArray[i].time)
		}
	}

	tempSpace = {}
	for (k in timeArr) {
		for (var i = 0; i < jsonArray.length; i++) {
			if (jsonArray[i].time == timeArr[k]) {
				if (!(k in tempSpace)) {
					tempSpace[k] = {}
					tempSpace[k][jsonArray[i][key]] = jsonArray[i]
				} else {
					tempSpace[k][jsonArray[i][key]] = jsonArray[i];
				}
			}
		}
	}

	//here we consider and track the processes which exist for two times consistently otherwise , we dont consider them.

	outputArray = []

	for (var j in tempSpace[0]) {
		tempStor = {}
		//this logic will ensure ephemeral points coming up and going down.

		for (var k in tempSpace[0][j]) {
			if (k == "time") {
				tempStor['time1'] = tempSpace[0][j]['time']
				// print(tempSpace[0][i]['time'])
				tempStor['time2'] = tempSpace[1][j]['time']
				continue;
			}
			if ((preserveKey.indexOf(k) != -1)) {
				tempStor[k] = tempSpace[1][j][k];
				continue;
			}
			tempStor[k] = tempSpace[1][j][k] - tempSpace[0][j][k];
		}
		outputArray.push(tempStor)
	}

	return outputArray;
}

function prometheus_host_windows_iis_server_uri_cache_monitoring(data) {
	var count = 0;

	if (data.snmpData != undefined || data.snmpData != null) {
		var result = JSON.parse(data.snmpData);
		var exporterName = "metric";
		collection_time = result["time"];
		if (collection_time == undefined || collection_time == null)
			collection_time = java.lang.System.currentTimeMillis();

		for (i = 0; i < result.length; i++) {
			mode = result[i]["mode"]

			var cache_items = result[i]["wmi_iis_server_uri_cache_items_total"];
			var cache_hits = result[i]["wmi_iis_server_uri_cache_hits_total"];
			if (mode == "kernel") {
				result[i].kernel_wmi_iis_server_uri_cache_items_total = result[i]["wmi_iis_server_uri_cache_items_total"];
				result[i].kernel_wmi_iis_server_uri_cache_hits_total = result[i]["wmi_iis_server_uri_cache_hits_total"];
				result[i].user_wmi_iis_server_uri_cache_items_total = null;
				result[i].user_wmi_iis_server_uri_cache_hits_total = null;
				delete result[i].wmi_iis_server_uri_cache_items_total;
				delete result[i].wmi_iis_server_uri_cache_hits_total;
			} else {
				result[i].kernel_wmi_iis_server_uri_cache_items_total = null;
				result[i].kernel_wmi_iis_server_uri_cache_hits_total = null;
				result[i].user_wmi_iis_server_uri_cache_items_total = result[i]["wmi_iis_server_uri_cache_items_total"];
				result[i].user_wmi_iis_server_uri_cache_hits_total = result[i]["wmi_iis_server_uri_cache_hits_total"];;
				delete result[i].wmi_iis_server_uri_cache_items_total;
				delete result[i].wmi_iis_server_uri_cache_hits_total;
			}
		}

		var merge_result = merge_by_key("mode", result);

		var counter_result = diffCounter(merge_result, ["time", "assetId", "assetLabel", "customerId", "mode"], "mode");

		for (i = 0; i < counter_result.length; i++) {
			time1 = counter_result[i]["time1"];
			time2 = counter_result[i]["time2"];

			var myDate1 = Date.parse(time1);

			var myDate2 = Date.parse(time2);

			if (myDate1 > myDate2) {
				myDate = myDate1;
			} else {
				myDate = myDate2;
			}

			var mode = counter_result[i]["mode"];
			
			if (mode == "kernel" && counter_result[i].kernel_wmi_iis_server_uri_cache_items_total >= 0) {
				var kernel_items = counter_result[i].kernel_wmi_iis_server_uri_cache_items_total;
				var metricName = "UriItems"
				var name = counter_result[i]["mode"]
				var componentId = counter_result[i]["mode"]
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", kernel_items);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricValue", kernel_items);
				data.scriptOutputs.put("componentId", componentId);
			}

			if (mode == "kernel" && counter_result[i].kernel_wmi_iis_server_uri_cache_hits_total >= 0) {
				var kernel_hits = counter_result[i].kernel_wmi_iis_server_uri_cache_hits_total;
				var metricName = "UriHits"
				var componentId = counter_result[i]["mode"]
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", kernel_hits);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricValue", kernel_hits);
				data.scriptOutputs.put("componentId", componentId);
			}
			if (mode == "user" && counter_result[i].user_wmi_iis_server_uri_cache_items_total >= 0){
				var user_items = counter_result[i].user_wmi_iis_server_uri_cache_items_total;
				var metricName = "UriItems"
				var componentId = counter_result[i]["mode"]
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", user_items);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricValue", user_items);
				data.scriptOutputs.put("componentId", componentId);
			}

			if (mode == "user" && counter_result[i].user_wmi_iis_server_uri_cache_hits_total >= 0){
				var user_hits = counter_result[i].user_wmi_iis_server_uri_cache_hits_total;
				var metricName = "UriHits"
				var componentId = counter_result[i]["mode"]
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", user_hits);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricValue", user_hits);
				data.scriptOutputs.put("componentId", componentId);
			}			
			count = count + 1;
		}
	}
	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");
}