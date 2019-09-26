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

function diffCounter(jsonArray, preserveKey) {
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
                    tempSpace[k] = []
                    tempSpace[k].push(jsonArray[i])
                } else {
                    tempSpace[k].push(jsonArray[i]);
                }
            }
        }
    }

    if (tempSpace[0].length != tempSpace[1].length) {
        // print("Failure!");
        return false;
    }

    outputArray = []

    for (var i = 0; i < tempSpace[0].length; i++) {
        tempStor = {}
        for (var k in tempSpace[0][i]) {
            if (k == "time") {
                tempStor['time1'] = tempSpace[0][i]['time']
                // print(tempSpace[0][i]['time'])
                tempStor['time2'] = tempSpace[1][i]['time']
                continue;
            }
            if ((preserveKey.indexOf(k) != -1)) {
                tempStor[k] = tempSpace[1][i][k];
                continue;
            }
            tempStor[k] = tempSpace[1][i][k] - tempSpace[0][i][k];
        }
        outputArray.push(tempStor)
    }

    return outputArray;
}

function prometheus_host_windows_iis_server_uri_metrics_inventory(data) 
{
    var count = 0;

    if (data.snmpData != undefined || data.snmpData != null) 
    {
        var result = JSON.parse(data.snmpData);

        collection_time = result["time"];
        if (collection_time == undefined || collection_time == null){
            collection_time = java.lang.System.currentTimeMillis();
        }

        var merge_result = merge_by_key("site", result);

        var counter_result = diffCounter(merge_result, ["time", "assetId", "assetLabel", "customerId","site","wmi_iis_current_connections"],"site");

        finalResult = [];

        for (i = 0; i < counter_result.length; i++) 
        {
            var fileObj = {}; 
            fileObj["name"] = counter_result[i]["site"];            
            finalResult.push(fileObj);
            count = count + 1;
        }
        print("finalResult",JSON.stringify(finalResult));
        data.scriptOutputs.put("result", JSON.stringify(finalResult));
    }
    if (count > 0)
        data.scriptOutputs.put("status", "SUCCESS");
    else
        data.scriptOutputs.put("status", "FAIL");
}