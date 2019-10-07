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

function prometheus_host_postgresql_database_checkpoint_metrics_monitoring(data) {
	var count = 0;

	if (data.snmpData != undefined || data.snmpData != null) {
		var result = JSON.parse(data.snmpData);
		var exporterName = "metric";
		collection_time = result["time"];
		if (collection_time == undefined || collection_time == null)
			collection_time = java.lang.System.currentTimeMillis();

		var merge_result = merge_by_key("server", result);

		var counter_result = diffCounter(merge_result,["time", "assetId", "assetLabel", "customerId","server"], "server");

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
			
		    if(counter_result[i]["pg_stat_bgwriter_checkpoints_req"] >=0){
		        var CheckpointsRequests =counter_result[i]["pg_stat_bgwriter_checkpoints_req"];
				var metricName = "CheckpointsRequests";
				var componentId = counter_result[i]["server"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", CheckpointsRequests);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", CheckpointsRequests);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("CheckpointsRequests",counter_result[i]["pg_stat_bgwriter_checkpoints_req"]);
		    }

		    if (counter_result[i]["pg_stat_bgwriter_checkpoints_timed"] >=0) {
		        var CheckpointsTimed = counter_result[i]["pg_stat_bgwriter_checkpoints_timed"];
				var metricName = "CheckpointsTimed";
				var componentId = counter_result[i]["server"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", CheckpointsTimed);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", CheckpointsTimed);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("CheckpointsTimed",counter_result[i]["pg_stat_bgwriter_checkpoints_timed"]);
		    }

		    if (counter_result[i]["pg_stat_bgwriter_buffers_checkpoint"] >=0) {
		        var BuffersCheckpoint = counter_result[i]["pg_stat_bgwriter_buffers_checkpoint"];
				var metricName = "BuffersCheckpoint";
				var componentId = counter_result[i]["server"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", BuffersCheckpoint);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", BuffersCheckpoint);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("BuffersCheckpoint",counter_result[i]["pg_stat_bgwriter_buffers_checkpoint"]);
		    }

		    if (counter_result[i]["pg_stat_bgwriter_buffers_clean"] >=0) {
		        var BuffersClean = counter_result[i]["pg_stat_bgwriter_buffers_clean"];
				var metricName = "BuffersClean";
				var componentId = counter_result[i]["server"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", BuffersClean);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", BuffersClean);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("BuffersClean",counter_result[i]["pg_stat_bgwriter_buffers_clean"]);
		    }

		    if (counter_result[i]["pg_stat_bgwriter_buffers_backend"] >=0) {
		        var BuffersBackend = counter_result[i]["pg_stat_bgwriter_buffers_backend"];
				var metricName = "BuffersBackend";
				var componentId = counter_result[i]["server"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", BuffersBackend);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", BuffersBackend);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("BuffersBackend",counter_result[i]["pg_stat_bgwriter_buffers_backend"]);
		    }	        
			count = count + 1;
		}
	}
	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");
}