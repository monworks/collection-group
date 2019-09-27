function prometheus_host_mysql_reachability(data) {
	var count = 0;

	if (data.snmpData != undefined || data.snmpData != null) {
		var result = JSON.parse(data.snmpData);
		var exporterName = "availability";
		
		if (result.length == 0) {

			var status = "Down";
			var reachabilityStatus = 0;

			var assetAtrMap = new java.util.HashMap();
			data.scriptOutputs.put("persistence", "true");
			assetAtrMap.put("reachability-status", status);
			data.scriptOutputs.put("asset-attributes", assetAtrMap);
			
			type = "MySQL Rechability";

			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			//pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			//pointBuilder.addData("deviceIP", data.deviceIP);
			pointBuilder.addData("reachabilityStatus", reachabilityStatus);
			pointBuilder.addData("type", type);
			data.points.add(pointBuilder);
			count = count + 1;
			data.scriptOutputs.put("reachabilityStatus", reachabilityStatus);
			data.scriptOutputs.put("type", type);

		} 
		else {		
			for (var i = 0; i < result.length; i++) {
				var time = result[i].time
				var myDate = Date.parse(time);
				var mysql_up = result[i]["mysql_up"];
				deviceIP = result[i]["device-ip"];
			}
			if (mysql_up == 1) {
				reachabilityStatus = 100;
				status = "UP";
			} else {
				reachabilityStatus = 0;
				status =0;
			}
			type = "MySQL Rechability"

			var assetAtrMap = new java.util.HashMap();

			data.scriptOutputs.put("persistence", "true");

			assetAtrMap.put("reachability-status", status);
			data.scriptOutputs.put("asset-attributes", assetAtrMap);


			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("deviceIP", deviceIP);
			pointBuilder.addData("reachabilityStatus", reachabilityStatus);
			pointBuilder.addData("type", type);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("reachabilityStatus", reachabilityStatus);
			data.scriptOutputs.put("type", type);

			count = count + 1;
		}

	}

	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");
}
