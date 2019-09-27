function prometheus_host_windows_mssql_server_metrics_monitoring(data) 
{
    var collection_time=0;
    var count = 0
	var instanceNameMap = new java.util.HashMap();
	// var volumePercentageMap = new java.util.HashMap();

	if(data.snmpData != undefined || data.snmpData != null)
	{
		var result = JSON.parse(data.snmpData);
		var exporterName = "metric";
		collection_time = result["time"];
		if (collection_time == undefined || collection_time == null)
			collection_time = java.lang.System.currentTimeMillis();

  		for(var i=0; i<result.length;i++)
  		{	
  			record = result[i]
			instanceNameMap.put(record.instance, record.instance);
			var time = result[i].time
			var myDate = Date.parse(time);
		}
		
		for(var instanceName in instanceNameMap)
  		{	
			for(var i=0; i<result.length;i++)
  			{	
  				var record = result[i]
				if(record.instance.equals(instanceName))
				{	
					if(record["wmi_mssql_databases_active_transactions"] != undefined || record["wmi_mssql_databases_active_transactions"] != null){
						var active_transactions = record["wmi_mssql_databases_active_transactions"];
						var metricName = record["instance"];
						var componentId = record["database"];
						var componentIdentifier = "Active_Transactions"
						var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
						pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
						pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
						pointBuilder.addData("assetId", data.assetId);
						pointBuilder.addData("assetLabel", data.assetLabel);
						pointBuilder.addData("customerId", data.customerId);
						pointBuilder.addData("metricValue", active_transactions);
						pointBuilder.addData("metricName", metricName);
						pointBuilder.addData("componentId", componentId);
						pointBuilder.addData("componentIdentifier", componentIdentifier);
						data.points.add(pointBuilder);

						data.scriptOutputs.put("componentIdentifier", componentIdentifier);
						data.scriptOutputs.put("metricValue", active_transactions);
						data.scriptOutputs.put("componentId", componentId);

						// print("active_transactions", active_transactions)
						// print("metricName",metricName)
						// print("componentId",componentId)
					}
					if(record["wmi_mssql_databases_log_used_percent"] != undefined || record["wmi_mssql_databases_log_used_percent"] != null){
						var log_used_percent = record["wmi_mssql_databases_log_used_percent"];
						var metricName = record["instance"];
						var componentId = record["database"];
						var componentIdentifier = "Logs_Used"
						var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
						pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
						pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
						pointBuilder.addData("assetId", data.assetId);
						pointBuilder.addData("assetLabel", data.assetLabel);
						pointBuilder.addData("customerId", data.customerId);
						pointBuilder.addData("metricValue", log_used_percent);
						pointBuilder.addData("metricName", metricName);
						pointBuilder.addData("componentId", componentId);
						pointBuilder.addData("componentIdentifier", componentIdentifier);
						data.points.add(pointBuilder);

						data.scriptOutputs.put("componentIdentifier", componentIdentifier);
						data.scriptOutputs.put("metricValue", log_used_percent);
						data.scriptOutputs.put("componentId", componentId);

						// print("log_used_percent", log_used_percent)
						// print("metricName",metricName)
						// print("componentId",componentId)
					}
					if(record["wmi_mssql_databases_xtp_memory_used_bytes"] != undefined || record["wmi_mssql_databases_xtp_memory_used_bytes"] != null){
						var xtp_memory = round((record["wmi_mssql_databases_xtp_memory_used_bytes"]/1048576));
						var metricName = record["instance"];
						var componentId = record["database"];
						var componentIdentifier = "Xtp_Memory_Used"
						var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
						pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
						pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
						pointBuilder.addData("assetId", data.assetId);
						pointBuilder.addData("assetLabel", data.assetLabel);
						pointBuilder.addData("customerId", data.customerId);
						pointBuilder.addData("metricValue", xtp_memory);
						pointBuilder.addData("metricName", metricName);
						pointBuilder.addData("componentId", componentId);
						pointBuilder.addData("componentIdentifier", componentIdentifier);
						data.points.add(pointBuilder);

						data.scriptOutputs.put("componentIdentifier", componentIdentifier);
						data.scriptOutputs.put("metricValue", xtp_memory);
						data.scriptOutputs.put("componentId", componentId);
						
						// print("xtp_memory", xtp_memory)
						// print("metricName",metricName)
						// print("componentId",componentId)
					}
					if(record["wmi_mssql_databases_data_files_size_bytes"] != undefined || record["wmi_mssql_databases_data_files_size_bytes"] != null){
						var data_files = round((record["wmi_mssql_databases_data_files_size_bytes"]/1048576));
						var metricName = record["instance"];
						var componentId = record["database"];
						var componentIdentifier = "Data_Files_Size"
						var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
						pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
						pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
						pointBuilder.addData("assetId", data.assetId);
						pointBuilder.addData("assetLabel", data.assetLabel);
						pointBuilder.addData("customerId", data.customerId);
						pointBuilder.addData("metricValue", data_files);
						pointBuilder.addData("metricName", metricName);
						pointBuilder.addData("componentId", componentId);
						pointBuilder.addData("componentIdentifier", componentIdentifier);
						data.points.add(pointBuilder);

						data.scriptOutputs.put("componentIdentifier", componentIdentifier);
						data.scriptOutputs.put("metricValue", data_files);
						data.scriptOutputs.put("componentId", componentId);
						
						// print("data_files", data_files)
						// print("metricName",metricName)
						// print("componentId",componentId)
					}
					if(record["wmi_mssql_databases_log_files_used_size_bytes"] != undefined || record["wmi_mssql_databases_log_files_used_size_bytes"] != null){
						var log_files = round((record["wmi_mssql_databases_log_files_used_size_bytes"]/1048576));
						var metricName = record["instance"];
						var componentId = record["database"];
						var componentIdentifier = "Log_Files_Size"
						var pointBuilder = Java.type("com.cfx.pulse.commons.metrics.influxdb.InfluxdbDataPointBuilder").newInstance();
						pointBuilder.withMetric(exporterName, data.influxDB.getMetricsInfo())
						pointBuilder.addTime(myDate, java.util.concurrent.TimeUnit.MILLISECONDS);
						pointBuilder.addData("assetId", data.assetId);
						pointBuilder.addData("assetLabel", data.assetLabel);
						pointBuilder.addData("customerId", data.customerId);
						pointBuilder.addData("metricValue", log_files);
						pointBuilder.addData("metricName", metricName);
						pointBuilder.addData("componentId", componentId);
						pointBuilder.addData("componentIdentifier", componentIdentifier);
						data.points.add(pointBuilder);

						data.scriptOutputs.put("componentIdentifier", componentIdentifier);
						data.scriptOutputs.put("metricValue", log_files);
						data.scriptOutputs.put("componentId", componentId);
						
						// print("log_files", log_files)
						// print("metricName",metricName)
						// print("componentId",componentId)
					}	
				}
				count = count + 1;
			}
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