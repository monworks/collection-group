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

	if (tempSpace[0].length != tempSpace[1].length) {
		// print("Failure!");
		return false;
	}

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


function prometheus_host_windows_physcial_disk_read_bytes_monitoring(data) {
	var collection_time = 0;
	var count = 0
	var volumeNameMap = new java.util.HashMap();
	var volumeTotalMap = new java.util.HashMap();

	if (data.snmpData != undefined || data.snmpData != null) {
		var result = JSON.parse(data.snmpData);
		merge_result = merge_by_key("volume", result);
		pKeys = ["time", "assetId", "assetLabel", "customerId", "volume"]
		counter_result = diffCounter(merge_result, pKeys, "volume");

		finalResult = []
		var count = 0;
		var exporterName = "disk";
		

		for (i = 0; i < counter_result.length; i++) {
			time1 = counter_result[i]["time1"];
			time2 = counter_result[i]["time2"];

			var myDate1 = Date.parse(time1);

			var myDate2 = Date.parse(time2);
			var myDate = 0;
			if (myDate1 > myDate2) {
				myDate = myDate1
			} else {
				myDate = myDate2
			}
			sectorSize = 512;
			var componentIdentifier=counter_result[i]["volume"];
			var diskInBytes = ((counter_result[i]["wmi_logical_disk_read_bytes_total"] / sectorSize)*1024);
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addTagData("assetId", data.assetId);
			pointBuilder.addTagData("assetLabel", data.assetLabel);
			pointBuilder.addTagData("customerId", data.customerId);
			pointBuilder.addTagData("componentId", "Disk-Device");
			pointBuilder.addTagData("metricName", "disk-read-bytes");
			pointBuilder.addTagData("cisco-flash-partition-index", counter_result[i]["volume"]);
			pointBuilder.addTagData("componentIdentifier", componentIdentifier);
			pointBuilder.addFieldData("diskInBytes", diskInBytes);
			metricName = 'disk-read-bytes'
			data.points.add(pointBuilder);
			data.scriptOutputs.put("diskInBytes", diskInBytes);
			data.scriptOutputs.put("componentIdentifier", componentIdentifier);

			count = count + 1;
		}
		// data.scriptOutputs.put("result", JSON.stringify(finalResult));

	}

	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");
}

function getRoundedToTwoDecimalPlaces(doubleValue) {
	return (new java.lang.Double(java.lang.Math.round(doubleValue * 100))) / (100.0);
}