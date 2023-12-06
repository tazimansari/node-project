const mySql = require("mysql")

const connectivity = mySql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'log_request'
})
connectivity.connect((error)=>{
    if(error){
        console.log('error')
    } else{
        console.log('connected')
    }
})

module.exports = connectivity;