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

function prometheus_mysql_innodb_buffer_pool_requests_monitoring(data) {
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

            var statusRead = getRoundedToTwoDecimalPlaces(merge_result[i]["mysql_global_status_innodb_buffer_pool_read_requests"]);
            
            var metricNamemd = "request";

            var componentId1 = "read-request"

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
            pointBuilder.addData("metricValue", statusRead);
            pointBuilder.addData("metricName", metricNamemd);
            pointBuilder.addData("componentId", componentId1);
            data.points.add(pointBuilder);

            data.scriptOutputs.put("metricValue", statusRead);
            data.scriptOutputs.put("componentId", componentId1);
         

            var statusWrite = getRoundedToTwoDecimalPlaces(merge_result[i]["mysql_global_status_innodb_buffer_pool_write_requests"]);
            
            var metricNamemd = "request";

            var componentId2 = "write-request"

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
            pointBuilder.addData("metricValue", statusWrite);
            pointBuilder.addData("metricName", metricNamemd);
            pointBuilder.addData("componentId", componentId2);
            data.points.add(pointBuilder);

            data.scriptOutputs.put("metricValue", statusWrite);
            data.scriptOutputs.put("componentId", componentId2);
    

            count = count + 1;
        }
    }

    if (count > 0)
        data.scriptOutputs.put("status", "SUCCESS");
    else
        data.scriptOutputs.put("status", "FAIL");

}
