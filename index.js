const express = require("express");
const connectivity = require("./connection");
const cron = require("node-cron");
const sendMail = require("./nodeMail");
const app = express();


app.use('/assets',express.static('assets'))
app.set("views", "./views");

app.get('/api/filter', (req, resp) => {

    const sql = "SELECT * FROM requests";

    const top5AvgData = "SELECT url, AVG(response_time) AS avg_response_time, MAX(response_time) AS max_response_time, MIN(response_time) AS min_response_time FROM requests GROUP BY url ORDER BY avg_response_time DESC LIMIT 5";

    const top5MaxData = "SELECT url, MAX(response_time) AS max_response_time, AVG(response_time) AS avg_response_time, MIN(response_time) AS min_response_time FROM requests GROUP BY url ORDER BY max_response_time DESC LIMIT 5";
    
    const top5MinData = "SELECT url, MIN(response_time) AS min_response_time, AVG(response_time) AS avg_response_time, MAX(response_time) AS max_response_time FROM requests GROUP BY url ORDER BY min_response_time ASC LIMIT 5";
    
        connectivity.query(sql, (error, result) => {
            if (error) throw error;

        const totalRequests = result.length;
        const uniqueUrl = new Set(result.map((value) => value.url)).size;

        connectivity.query(top5AvgData, (error, top5Average_Response_Time) => {
            if (error) throw error;

        connectivity.query(top5MaxData, (error, top5Maximum_Response_Time)=>{
            if (error) throw error;

        connectivity.query(top5MinData, (error, top5Minimum_Response_Time)=>{
            if (error) throw error;    
           
        const data = { totalRequests, uniqueUrl, top5Average_Response_Time, top5Maximum_Response_Time, top5Minimum_Response_Time };

            cron.schedule('* * 15 * * *',()=>{
                sendMail(data );
            })

                //sendMail(data)
                resp.render('./index.ejs', data);
            });
          });
        });
    });
});

app.listen(7700);


