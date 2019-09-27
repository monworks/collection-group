function prometheus_host_mysql_global_status_slow_inventory(data) {                          
	var collection_time = 0;
	var count = 0
	if (data.snmpData != undefined || data.snmpData != null) {
		print("data.snmpdata", data.snmpData)
		var result = JSON.parse(data.snmpData);
		var exporterName = "metric";
		var collection_time = result["collection-time"];
		if (collection_time == undefined || collection_time == null)
			collection_time = java.lang.System.currentTimeMillis();

		var finalResult = []

		for (i = 0; i < result.length; i++) {
			var obj = {}; 
			var name = "slow";
			obj["name"] = name;
			var slow1 = result[i]["mysql_global_status_slow_queries"];
			obj["slow1"] = slow1;

    		finalResult.push(obj);
            
    		count = count + 1;
		}	
		data.scriptOutputs.put("result", JSON.stringify(finalResult));
	}

	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");

}