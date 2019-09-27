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

function diffCounter(jsonArray, preserveKey) {
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
                    tempSpace[k] = []
                    tempSpace[k].push(jsonArray[i])
                } else {
                    tempSpace[k].push(jsonArray[i]);
                }
            }
        }
    }

    if (tempSpace[0].length != tempSpace[1].length) {
        // print("Failure!");
        return false;
    }

    outputArray = []

    for (var i = 0; i < tempSpace[0].length; i++) {
        tempStor = {}
        for (var k in tempSpace[0][i]) {
            if (k == "time") {
                tempStor['time1'] = tempSpace[0][i]['time']
                // print(tempSpace[0][i]['time'])
                tempStor['time2'] = tempSpace[1][i]['time']
                continue;
            }
            if ((preserveKey.indexOf(k) != -1)) {
                tempStor[k] = tempSpace[1][i][k];
                continue;
            }
            tempStor[k] = tempSpace[1][i][k] - tempSpace[0][i][k];
        }
        outputArray.push(tempStor)
    }

    return outputArray;
}

function prometheus_host_windows_iis_server_file_cache_monitoring(data) {
	var count = 0;

	if (data.snmpData != undefined || data.snmpData != null) {
		var result = JSON.parse(data.snmpData);
		var exporterName = "metric";
		collection_time = result["time"];
		if (collection_time == undefined || collection_time == null)
			collection_time = java.lang.System.currentTimeMillis();

		var merge_result = merge_by_key("time", result);

		var counter_result = diffCounter(merge_result, ["time", "assetId", "assetLabel", "customerId", "wmi_iis_server_file_cache_memory_bytes"]);

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
             
            if(counter_result[i]["wmi_iis_server_file_cache_items_total"] >= 0){
			var file_cache_items_total = counter_result[i]["wmi_iis_server_file_cache_items_total"];
            var metricNameIT = "FileCache"
            var componentIdIT = "TotalItems"
            var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
            pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
            pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
            pointBuilder.addData("assetId", data.assetId);
            pointBuilder.addData("assetLabel", data.assetLabel);
            pointBuilder.addData("customerId", data.customerId);
            pointBuilder.addData("metricValue", file_cache_items_total);
            pointBuilder.addData("metricName", metricNameIT);
            pointBuilder.addData("componentId", componentIdIT);
            data.points.add(pointBuilder);

            data.scriptOutputs.put("metricValue", file_cache_items_total);
            data.scriptOutputs.put("componentId", componentIdIT);
            }			

            if(counter_result[i]["wmi_iis_server_file_cache_hits_total"] >= 0){
			var file_cache_hits_total = counter_result[i]["wmi_iis_server_file_cache_hits_total"];
            var metricNameHits = "FileCache";
            var componentIdHits = "TotalHits";
            var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
            pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
            pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
            pointBuilder.addData("assetId", data.assetId);
            pointBuilder.addData("assetLabel", data.assetLabel);
            pointBuilder.addData("customerId", data.customerId);
            pointBuilder.addData("metricValue", file_cache_hits_total);
            pointBuilder.addData("metricName", metricNameHits);
            pointBuilder.addData("componentId", componentIdHits);
            data.points.add(pointBuilder);

            data.scriptOutputs.put("metricValue", file_cache_hits_total);
            data.scriptOutputs.put("componentId", componentIdHits);
            }		
            
			var totalmemKBytes = getRoundedToTwoDecimalPlaces((counter_result[i]["wmi_iis_server_file_cache_memory_bytes"] / 1024));
            var metricNameMem = "Memory";
            var componentIdMem = "Memory";
            var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
            pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
            pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
            pointBuilder.addData("assetId", data.assetId);
            pointBuilder.addData("assetLabel", data.assetLabel);
            pointBuilder.addData("customerId", data.customerId)
            pointBuilder.addData("metricValue", totalmemKBytes);
            pointBuilder.addData("metricName", metricNameMem);
            pointBuilder.addData("componentId", componentIdMem);
            data.points.add(pointBuilder);

            data.scriptOutputs.put("metricValue", totalmemKBytes);
            data.scriptOutputs.put("componentId", componentIdMem);          
			count = count + 1;
		}
	}
	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");
}

function getRoundedToTwoDecimalPlaces(doubleValue) {
	return (new java.lang.Double(java.lang.Math.round(doubleValue * 100))) / (100.0);
}