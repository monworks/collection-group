function prometheus_host_mysql_availability(data) {
	var count = 0;

	if (data.snmpData != undefined || data.snmpData != null) {
		var result = JSON.parse(data.snmpData);
		var exporterName = "availability";

		for (var i = 0; i < result.length; i++) {
			deviceIP = result[i]["device-ip"];
			var system_up_time = result[i].mysql_global_status_uptime;
			// print("system_up_time",system_up_time)

			var system_up_time1 = system_up_time * 100;

			var percent = (system_up_time1 / 30000) * 100;
			// print(percent)

			if (percent >= 100) {
				sysAvailabilityPercent = 100
			} else {
				sysAvailabilityPercent = percent;
			}
			// print("sysAvailabilityPercent",sysAvailabilityPercent)

			var time = result[i].time
			var myDate = Date.parse(time);

			var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
			pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
			pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
			pointBuilder.addData("assetId", data.assetId);
			pointBuilder.addData("assetLabel", data.assetLabel);
			pointBuilder.addData("customerId", data.customerId);
			pointBuilder.addData("sysAvailabilityPercent", sysAvailabilityPercent);
			pointBuilder.addData("deviceIP", deviceIP);
			data.points.add(pointBuilder);

			data.scriptOutputs.put("sysAvailabilityPercent", sysAvailabilityPercent);

			count = count + 1;
		}
	}

	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");
}