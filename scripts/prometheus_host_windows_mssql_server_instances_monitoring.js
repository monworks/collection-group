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

function prometheus_host_windows_mssql_server_instances_monitoring(data) {
	var count = 0;

	if (data.snmpData != undefined || data.snmpData != null) {
		var result = JSON.parse(data.snmpData);
		var exporterName = "metric";
		collection_time = result["time"];
		if (collection_time == undefined || collection_time == null)
			collection_time = java.lang.System.currentTimeMillis();

		var merge_result = merge_by_key("instance", result);

		var counter_result = diffCounter(merge_result,["time", "assetId", "assetLabel", "customerId","instance", "wmi_mssql_memmgr_lock_memory_bytes", "wmi_mssql_memmgr_optimizer_memory_bytes", "wmi_mssql_bufman_buffer_cache_hit_ratio", "wmi_mssql_genstats_sql_trace_io_provider_lock_waits", "wmi_mssql_bufman_page_life_expectancy_seconds", "wmi_mssql_genstats_user_connections","wmi_mssql_memmgr_free_memory_bytes", "wmi_mssql_memmgr_total_server_memory_bytes", "wmi_mssql_memmgr_database_cache_memory_bytes", "wmi_mssql_memmgr_sql_cache_memory_bytes"], "instance");

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
			var bufman_page_lookups =counter_result[i]["wmi_mssql_bufman_page_lookups"];
			print("bufman_page_lookups",bufman_page_lookups)

			var Page_Reads = counter_result[i]["wmi_mssql_bufman_page_reads"];
			print("Page_Reads",Page_Reads)

			var Page_Writes = counter_result[i]["wmi_mssql_bufman_page_writes"];
			print("Page_Writes",Page_Writes)

			var Page_Splits = counter_result[i]["wmi_mssql_accessmethods_page_splits"];
			print("Page_Splits",Page_Splits)

		    if(counter_result[i]["wmi_mssql_bufman_page_lookups"] >=0){
		        var bufman_page_lookups =counter_result[i]["wmi_mssql_bufman_page_lookups"];
				var metricName = "Page_Lookups";
				var componentId = counter_result[i]["instance"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", bufman_page_lookups);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", bufman_page_lookups);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    if (counter_result[i]["wmi_mssql_bufman_page_reads"] >=0) {
		        var Page_Reads = counter_result[i]["wmi_mssql_bufman_page_reads"];
				var metricName = "Page_Reads";
				var componentId = counter_result[i]["instance"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Page_Reads);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Page_Reads);
				data.scriptOutputs.put("componentId", componentId);
		    }
		    if (counter_result[i]["wmi_mssql_bufman_page_writes"] >=0) {
		    	var Page_Writes = counter_result[i]["wmi_mssql_bufman_page_writes"];
				var metricName = "Page_Writes";
				var componentId = counter_result[i]["instance"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Page_Writes);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Page_Writes);
				data.scriptOutputs.put("componentId", componentId);		        
		    }
		    if (counter_result[i]["wmi_mssql_accessmethods_page_splits"] >=0) {
		    	var Page_Splits = counter_result[i]["wmi_mssql_accessmethods_page_splits"];
				var metricName = "Page_Splits";
				var componentId = counter_result[i]["instance"];
				var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
				pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
				pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
				pointBuilder.addData("assetId", data.assetId);
				pointBuilder.addData("assetLabel", data.assetLabel);
				pointBuilder.addData("customerId", data.customerId);
				pointBuilder.addData("metricValue", Page_Splits);
				pointBuilder.addData("metricName", metricName);
				pointBuilder.addData("componentId", componentId);
				data.points.add(pointBuilder);

				data.scriptOutputs.put("metricName", metricName);
				data.scriptOutputs.put("metricValue", Page_Splits);
				data.scriptOutputs.put("componentId", componentId);		        
		    }

		    var Lock_Memory_KB = round((counter_result[i]["wmi_mssql_memmgr_lock_memory_bytes"] / 1048576));
			var metricName = "Lock_Memory";
			var componentId = counter_result[i]["instance"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", Lock_Memory_KB);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", Lock_Memory_KB);
			data.scriptOutputs.put("componentId", componentId);

			var Optimizer_Memory_KB = round((counter_result[i]["wmi_mssql_memmgr_optimizer_memory_bytes"] / 1048576));
			var metricName = "Optimizer_Memory";
			var componentId = counter_result[i]["instance"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", Optimizer_Memory_KB);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", Optimizer_Memory_KB);
			data.scriptOutputs.put("componentId", componentId);

			var cache_hit_ratio = counter_result[i]["wmi_mssql_bufman_buffer_cache_hit_ratio"];
			var metricName = "Buffer_Cache_Hit_Ratio";
			var componentId = counter_result[i]["instance"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", cache_hit_ratio);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", cache_hit_ratio);
			data.scriptOutputs.put("componentId", componentId);

			var Lock_Waits = counter_result[i]["wmi_mssql_genstats_sql_trace_io_provider_lock_waits"];
			var metricName = "Lock_Waits";
			var componentId = counter_result[i]["instance"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", Lock_Waits);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", Lock_Waits);
			data.scriptOutputs.put("componentId", componentId);

			var Life_Expectancy = counter_result[i]["wmi_mssql_bufman_page_life_expectancy_seconds"];
			var metricName = "Life_Expectancy";
			var componentId = counter_result[i]["instance"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", Life_Expectancy);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", Life_Expectancy);
			data.scriptOutputs.put("componentId", componentId);

			var User_Connections = counter_result[i]["wmi_mssql_genstats_user_connections"];
			var metricName = "User_Connections";
			var componentId = counter_result[i]["instance"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", User_Connections);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);
			
			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", User_Connections);
			data.scriptOutputs.put("componentId", componentId);

			var Freememory = counter_result[i]["wmi_mssql_memmgr_free_memory_bytes"];
			var Totalmemory = counter_result[i]["wmi_mssql_memmgr_total_server_memory_bytes"];
			var used = Totalmemory - Freememory;
			var MemoryPercent = getRoundedToTwoDecimalPlaces((used / Totalmemory) * 100);
			var metricName = "Memory";
			var componentId = counter_result[i]["instance"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", MemoryPercent);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);
			
			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", MemoryPercent);
			data.scriptOutputs.put("componentId", componentId);			

			var Cache_Pages = round((counter_result[i]["wmi_mssql_memmgr_database_cache_memory_bytes"]/1048576));
			var metricName = "Cache_Pages";
			var componentId = counter_result[i]["instance"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", Cache_Pages);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);
			
			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", Cache_Pages);
			data.scriptOutputs.put("componentId", componentId);

			var Cache_Memory = round((counter_result[i]["wmi_mssql_memmgr_sql_cache_memory_bytes"]/1048576));
			var metricName = "Cache_Memory";
			var componentId = counter_result[i]["instance"];
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("metricValue", Cache_Memory);
			pointBuilder.addData("metricName", metricName);
			pointBuilder.addData("componentId", componentId);
			data.points.add(pointBuilder);
			
			data.scriptOutputs.put("metricName", metricName);
			data.scriptOutputs.put("metricValue", Cache_Memory);
			data.scriptOutputs.put("componentId", componentId);

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

function round(value) {
  return Number(Math.round(value+'e'+3)+'e-'+3);
}