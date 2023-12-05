require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const ejs = require("ejs");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(data) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "tazimansari1999@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });


    const responseTimeRows = Array.isArray(data.top5Average_Response_Time)
      ? data.top5Average_Response_Time
      : [];
      

    const maxResponseTimeRows = Array.isArray(data.top5Maximum_Response_Time)
      ? data.top5Maximum_Response_Time
      : [];

    const minResponseTimeRows = Array.isArray(data.top5Minimum_Response_Time)
      ? data.top5Minimum_Response_Time
      : [];

    const htmlTemplate = `
    
          <div style="font-family: 'Arial', sans-serif;">
            <h1>Total Requests: ${data.totalRequests}</h1>
            <h1>Unique Url: ${data.uniqueUrl}</h1>
          
            <table style="border-collapse: collapse; width: 100%; table-layout: fixed; ">
              <tbody>
              <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue">URL</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue">Max Average Response Time</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue">Maximum Response Time</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue">Minimum Response Time</th>
            </tr>
        
            ${responseTimeRows.map((value) =>
              `<tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${value.url}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${value.avg_response_time}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${value.max_response_time}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${value.min_response_time}</td>
              </tr>`
              )
              .join("")}
              </tbody>

              <tbody>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue;">URL</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue;">Maximum Response Time</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue;">Average Response Time</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue;">Minimum Response Time</th>
              </tr>
              
              ${maxResponseTimeRows.map((value) =>
                `<tr>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${value.url}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${value.max_response_time}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${value.avg_response_time}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${value.min_response_time}</td>
                </tr>`
                )
                .join("")}
              </tbody>

              <tbody>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue;">URL</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue;">Minimum Response Time</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue;">Average Response Time</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: aliceblue;">Maximum Response Time</th>
              </tr>
              
              ${minResponseTimeRows.map((value) =>
                `<tr>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${value.url}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${value.min_response_time}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${value.avg_response_time}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${value.max_response_time}</td>
                </tr>`
                )
                .join("")}
              </tbody>
            </table>
          </div>
          `;

          const renderedTemplate = ejs.render(htmlTemplate, data);
      
          const mailOptions = {
            from: "Tazim Ansari <tazimansari1999@gmail.com>",
            to: "tazimansari7739@gmail.com",
            subject: "Nodemailer has sent the data from server to check response time",
            text: "Hello from gmail email using API",
            html: renderedTemplate,
          };
      
          const result = await transport.sendMail(mailOptions);
          //console.log("Successful ",result)
            return result;
          } catch (error) {
            console.log(error);
          }
  }

module.exports = sendMail;
