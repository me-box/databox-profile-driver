import https from 'https';
import http from 'http';
import express from "express";
import bodyParser from "body-parser";
import fs from "fs"
import databox from 'node-databox';

const DATABOX_ZMQ_ENDPOINT = process.env.DATABOX_ZMQ_ENDPOINT
const credentials = databox.getHttpsCredentials();

const PORT = process.env.port || '8080';

const kvc = databox.NewKeyValueClient(DATABOX_ZMQ_ENDPOINT, false);

let profileAge = databox.NewDataSourceMetadata();
console.log("profile age settings are", profileAge);

profileAge.Description = 'User profile: age';
profileAge.ContentType = 'application/json';
profileAge.Vendor = 'Databox Inc.';
profileAge.DataSourceType = 'profileAge';
profileAge.DataSourceID = 'profileAge';
profileAge.StoreType = 'kv';

kvc.RegisterDatasource(profileAge).then(() => {
    console.log("registered driver data source!!");
})

console.log("[Creating server]");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/ui', express.static('./www'));
app.use('/static', express.static('./www/static'));

app.get("/status", function (req, res) {
    res.send("active");
});

//app.get('/ui', function (req, res) {
//    res.render('index');
//}

https.createServer(credentials, app).listen(PORT);


/*
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/ui', express.static('./www'));
app.use('/static', express.static('./www/static'));
const server = http.createServer(app);
server.listen(8080);*/