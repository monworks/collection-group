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
function prometheus_host_mysql_innodb_metrics_inventory(data) {                          
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
		var merge_result = merge_by_key("assetId", result);

		for (i = 0; i < merge_result.length; i++) {
			var obj = {}; 
			var name = "innodb-metrics";
			obj["name"] = name;
			if(merge_result[i]["mysql_info_schema_innodb_metrics_lock_lock_row_lock_time_total"] >= 0){
			var time = merge_result[i]["mysql_info_schema_innodb_metrics_lock_lock_row_lock_time_total"];
			obj["time"] = time;
			}
			if(merge_result[i]["mysql_info_schema_innodb_metrics_lock_lock_row_lock_waits_total"] >= 0){
			var wait = merge_result[i]["mysql_info_schema_innodb_metrics_lock_lock_row_lock_waits_total"];
            obj["wait"] = wait;
            }

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