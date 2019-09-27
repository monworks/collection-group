function merge_by_key(key, jsonArray) {
	outputArray = []
	timeArr = []
	//find the timestamps and put it uniquely in an array
	for (var i = 0; i < jsonArray.length; i++) {
		if (!(timeArr.indexOf(jsonArray[i].time) != -1)) {
			timeArr.push(jsonArray[i].time)
		}
	}

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
		if (tempSpace[0][j] == null || tempSpace[1][j] == null)
			continue;
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

function prometheus_host_mysql_global_status_monitoring(data) {
	//console.log("Interface monitoring started");
	var collection_time = 0;
	var count = 0
	var finalResult = [];
	if (data.snmpData != undefined || data.snmpData != null) {
		print("data.snmpdata", data.snmpData)
		var result = JSON.parse(data.snmpData);
		var exporterName = "metric";
		var collection_time = result["collection-time"];
		if (collection_time == undefined || collection_time == null)
			collection_time = java.lang.System.currentTimeMillis();

		merge_result = merge_by_key("assetId", result);
		
		for (i = 0; i < merge_result.length; i++) {
			
			
			var receivedStatus = merge_result[i]["mysql_global_status_bytes_received"]/1024;
			

			var metricNamemd = "global-status-bytes";

			var componentId1 = "received";

			var name = "global-status";			

			var myDate = Date.parse(merge_result[i]["time"]);
			
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			// pointBuilder.addData("name", name);
			pointBuilder.addData("componentIdentifier", name);
			pointBuilder.addData("metricValue", receivedStatus);
			pointBuilder.addData("metricName", metricNamemd);
			pointBuilder.addData("componentId", componentId1);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricValue", receivedStatus);
			data.scriptOutputs.put("componentId", componentId1);
		
	       
			var sentStatus = merge_result[i]["mysql_global_status_bytes_sent"]/1024;
		    
			var metricNamemd = "global-status-bytes";

			var componentId2 = "sent";

			var name = "global-status";		
			
			var myDate = Date.parse(merge_result[i]["time"]);
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			// pointBuilder.addData("name", name);
			pointBuilder.addData("componentIdentifier", name);
			pointBuilder.addData("metricValue", sentStatus);
			pointBuilder.addData("metricName", metricNamemd);
			pointBuilder.addData("componentId", componentId2);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricValue", sentStatus);
			data.scriptOutputs.put("componentId", componentId2);	
	

			count = count + 1;			
		}
	}

	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");

}