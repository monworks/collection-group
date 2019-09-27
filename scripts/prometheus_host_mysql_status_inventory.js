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

function prometheus_host_mysql_status_inventory(data) {
	//console.log("Interface monitoring started");                           
	var collection_time = 0;
	var count = 0
	if (data.snmpData != undefined || data.snmpData != null) {
		print("data.snmpdata", data.snmpData)
		var result = JSON.parse(data.snmpData);
		var exporterName = "metric";
		var collection_time = result["collection-time"];
		if (collection_time == undefined || collection_time == null)
			collection_time = java.lang.System.currentTimeMillis();

		var merge_result = merge_by_key("command", result);
		var finalResult = []

		for (i = 0; i < merge_result.length; i++) {
			var obj = {}; 
			var command=merge_result[i]["command"];
			if(merge_result[i].command=="insert" || merge_result[i].command=="commit" || merge_result[i].command=="delete" || merge_result[i].command=="rollback" || merge_result[i].command=="select" || merge_result[i].command=="update" ){              
			name = merge_result[i]["command"];				
			obj["name"] = name;
    		finalResult.push(obj);
    	}           
    		count = count + 1;
		}	
		data.scriptOutputs.put("result", JSON.stringify(finalResult));
	}

	if (count > 0)
		data.scriptOutputs.put("status", "SUCCESS");
	else
		data.scriptOutputs.put("status", "FAIL");

}