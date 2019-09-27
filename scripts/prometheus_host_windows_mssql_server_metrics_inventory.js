function prometheus_host_windows_mssql_server_metrics_inventory(data) 
{
    var count = 0;

    if (data.snmpData != undefined || data.snmpData != null) 
    {
        var result = JSON.parse(data.snmpData);

        collection_time = result["time"];
        if (collection_time == undefined || collection_time == null){
            collection_time = java.lang.System.currentTimeMillis();
        }       

        finalResult = [];

        for (i = 0; i < result.length; i++) 
        {
            var fileObj = {}; 
            fileObj["name"] = result[i]["database"];
            fileObj["fqn"] = result[i]["instance"];            
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