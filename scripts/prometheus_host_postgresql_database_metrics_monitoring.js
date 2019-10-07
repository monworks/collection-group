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

function prometheus_host_postgresql_database_metrics_monitoring(data) {
	var count = 0;

	if (data.snmpData != undefined || data.snmpData != null) {
		var result = JSON.parse(data.snmpData);
		var exporterName = "metric";
		collection_time = result["time"];
		if (collection_time == undefined || collection_time == null)
			collection_time = java.lang.System.currentTimeMillis();

		var merge_result = merge_by_key("datname", result);

		var counter_result = diffCounter(merge_result,["time", "assetId", "assetLabel", "customerId","datname", "pg_locks_count"], "datname");

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

		    if(counter_result[i]["pg_stat_database_tup_deleted"] >=0){
		        var Rows_deleted =counter_result[i]["pg_stat_database_tup_deleted"];
				var metricName = "RowsDeleted";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Rows_deleted);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Rows_deleted);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("Rows_deleted",counter_result[i]["pg_stat_database_tup_deleted"]);
		    }

		    if (counter_result[i]["pg_stat_database_tup_fetched"] >=0) {
		        var Rows_fetched = counter_result[i]["pg_stat_database_tup_fetched"];
				var metricName = "RowsFetched";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Rows_fetched);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Rows_fetched);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("Rows_fetched",counter_result[i]["pg_stat_database_tup_fetched"]);
		    }

		    if (counter_result[i]["pg_stat_database_tup_inserted"] >=0) {
		        var Rows_inserted = counter_result[i]["pg_stat_database_tup_inserted"];
				var metricName = "RowsInserted";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Rows_inserted);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Rows_inserted);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("Rows_inserted",counter_result[i]["pg_stat_database_tup_inserted"]);
		    }

		    if (counter_result[i]["pg_stat_database_tup_returned"] >=0) {
		        var Rows_returned = counter_result[i]["pg_stat_database_tup_returned"];
				var metricName = "RowsReturned";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Rows_returned);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Rows_returned);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("Rows_returned",counter_result[i]["pg_stat_database_tup_returned"]);
		    }

		    if (counter_result[i]["pg_stat_database_tup_updated"] >=0) {
		        var Rows_updated = counter_result[i]["pg_stat_database_tup_updated"];
				var metricName = "RowsUpdated";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Rows_updated);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Rows_updated);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("Rows_updated",counter_result[i]["pg_stat_database_tup_updated"]);
		    }
		    
	        var locks_count = counter_result[i]["pg_locks_count"];
			var metricName = "LocksCount";
			var componentId = counter_result[i]["datname"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", locks_count);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", locks_count);
			data.scriptOutputs.put("componentId", componentId);
		    
		    if (counter_result[i]["pg_stat_database_deadlocks"] >=0) {
		        var deadlocks = counter_result[i]["pg_stat_database_deadlocks"];
				var metricName = "DeadLocks";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", deadlocks);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", deadlocks);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("deadlocks",counter_result[i]["pg_stat_database_deadlocks"]);
		    }

		    if (counter_result[i]["pg_stat_database_xact_commit"] >=0) {
		        var Commits = counter_result[i]["pg_stat_database_xact_commit"];
				var metricName = "Commits";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Commits);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Commits);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("Commits",counter_result[i]["pg_stat_database_xact_commit"]);
		    }

		    if (counter_result[i]["pg_stat_database_xact_rollback"] >=0) {
		        var Rollback = counter_result[i]["pg_stat_database_xact_rollback"];
				var metricName = "Rollbacks";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Rollback);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Rollback);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("Rollback",counter_result[i]["pg_stat_database_xact_rollback"]);
		    }

	        var active_connections = counter_result[i]["pg_stat_database_numbackends"];
			var metricName = "ActiveConnections";
			var componentId = counter_result[i]["datname"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", active_connections);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", active_connections);
			data.scriptOutputs.put("componentId", componentId);		    

		    if (counter_result[i]["pg_stat_database_blks_hit"] >= 0) {
		        var BlockHits = counter_result[i]["pg_stat_database_blks_hit"];
				var metricName = "BlockHits";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", BlockHits);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", BlockHits);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("BlockHits",counter_result[i]["pg_stat_database_blks_hit"]);
		    }

		    if (counter_result[i]["pg_stat_database_blks_read"] >= 0) {
		        var BlockReads = counter_result[i]["pg_stat_database_blks_read"];
				var metricName = "BlockReads";
				var componentId = counter_result[i]["datname"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", BlockReads);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", BlockReads);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    else{
		    	print("BlockReads",counter_result[i]["pg_stat_database_blks_read"]);
		    }
			count = count + 1;
		}
	}
	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");
}