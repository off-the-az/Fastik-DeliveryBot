const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {User, Ticket} = require("./src/routes/index");
const dbconn = require('./src/database');

app.use(bodyParser.json());
app.use("/api/user", User);
app.use("/api/ticket", Ticket);

/**************************** Main Server ***********************************/
app.listen(5000, () => {
    console.log(`\nFastik API is running at 127.0.0.1:5000 ...\n` +
        `To find endpoint u need jst click 127.0.0.1:5000/api/docs\n`
    );
    dbconn();
});