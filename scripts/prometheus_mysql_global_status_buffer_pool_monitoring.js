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



function prometheus_mysql_global_status_buffer_pool_monitoring(data) {
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

            if(merge_result[i]["mysql_global_status_innodb_buffer_pool_read_ahead"] >= 0){
			var statusAhead = merge_result[i]["mysql_global_status_innodb_buffer_pool_read_ahead"];
           
			var metricNamemd = "Status-buffer-pool";

			var componentId3= "ahead"

			var name = "global-status-buffer-pool";			

			var myDate = Date.parse(merge_result[i]["time"]);
			
			
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			// pointBuilder.addData("name", name);
			pointBuilder.addData("componentIdentifier", name);
			pointBuilder.addData("metricValue", statusAhead);
			pointBuilder.addData("metricName", metricNamemd);
			pointBuilder.addData("componentId", componentId3);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricValue", statusAhead);
			data.scriptOutputs.put("componentId", componentId3);
		    }

			if(merge_result[i]["mysql_global_status_innodb_buffer_pool_read_ahead_evicted"] >= 0){

			var statusEvicted = merge_result[i]["mysql_global_status_innodb_buffer_pool_read_ahead_evicted"];
            
			var metricNamemd = "Status-buffer-pool";

			var componentId4= "evicted"

			var name = "global-status-buffer-pool";			

			var myDate = Date.parse(merge_result[i]["time"]);
			
			
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			// pointBuilder.addData("name", name);
			pointBuilder.addData("componentIdentifier", name);
			pointBuilder.addData("metricValue", statusEvicted);
			pointBuilder.addData("metricName", metricNamemd);
			pointBuilder.addData("componentId", componentId4);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricValue", statusEvicted);
			data.scriptOutputs.put("componentId", componentId4);
			}

			if(merge_result[i]["mysql_global_status_innodb_buffer_pool_read_ahead_rnd"] >=0){

			var statusRnd = merge_result[i]["mysql_global_status_innodb_buffer_pool_read_ahead_rnd"];
            	
			var metricNamemd = "Status-buffer-pool";

			var componentId5 = "rnd"

			var name = "global-status-buffer-pool";			

			var myDate = Date.parse(merge_result[i]["time"]);
			
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			// pointBuilder.addData("name", name);
			pointBuilder.addData("componentIdentifier", name);
			pointBuilder.addData("metricValue", statusRnd);
			pointBuilder.addData("metricName", metricNamemd);
			pointBuilder.addData("componentId", componentId5);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricValue", statusRnd);
			data.scriptOutputs.put("componentId", componentId5);	
            }

            if(merge_result[i]["mysql_global_status_innodb_buffer_pool_wait_free"] >=0) {

			var statusWait = merge_result[i]["mysql_global_status_innodb_buffer_pool_wait_free"];

		    

			var metricNamemd = "Status-buffer-pool";

			var componentId6= "wait"

			var name = "global-status-buffer-pool";			

			var myDate = Date.parse(merge_result[i]["time"]);
			
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			// pointBuilder.addData("name", name);
			pointBuilder.addData("componentIdentifier", name);
			pointBuilder.addData("metricValue", statusWait);
			pointBuilder.addData("metricName", metricNamemd);
			pointBuilder.addData("componentId", componentId6);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricValue", statusWait);
			data.scriptOutputs.put("componentId", componentId6);
			}	

            if(merge_result[i]["mysql_global_status_innodb_buffer_pool_reads"] >=0){
			var status = merge_result[i]["mysql_global_status_innodb_buffer_pool_reads"];
            
			var metricNamemd = "Status-buffer-pool";

			var componentId7= "read"

			var name = "global-status-buffer-pool";			

			var myDate = Date.parse(merge_result[i]["time"]);
			
			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			// pointBuilder.addData("name", name);
			pointBuilder.addData("componentIdentifier", name);
			pointBuilder.addData("metricValue", status);
			pointBuilder.addData("metricName", metricNamemd);
			pointBuilder.addData("componentId", componentId7);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("metricValue", status);
			data.scriptOutputs.put("componentId", componentId7);
			}	
	

			count = count + 1;			
		}
	}

	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");

}