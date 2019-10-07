function prometheus_host_postgresql_database_metrics_inventory(data) 
{
    var count = 0;

    if (data.snmpData != undefined || data.snmpData != null) 
    {
        var result = JSON.parse(data.snmpData);
        
        finalResult = [];

        for (i = 0; i < result.length; i++) 
        {
            var Obj = {}; 
            Obj["name"] = result[i]["datname"];            
            finalResult.push(Obj);
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