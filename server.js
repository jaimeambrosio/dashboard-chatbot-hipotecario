/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var express = require('express');
var app = express();

var path = require('path');
var ejs = require('ejs');


var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views')); // here the .ejs files is in views folders
app.set('view engine', 'ejs'); //tell the template engine

// Util is handy to have around, so thats why that's here.
const util = require('util')
// and so is assert
const assert = require('assert');

// We want to extract the port to publish our app on
var port = process.env.PORT || 8080;

// Then we'll pull in the database client library
var pg = require('pg');

/*

// Now lets get cfenv and ask it to parse the environment variable
var cfenv = require('cfenv');
var appenv = cfenv.getAppEnv();

// Within the application environment (appenv) there's a services object
var services = appenv.services;

// The services object is a map named by service so we extract the one for PostgreSQL
var pg_services = services["compose-for-postgresql"];

// This check ensures there is a services for PostgreSQL databases
// assert(!util.isUndefined(pg_services), "Must be bound to compose-for-postgresql services");

// We now take the first bound PostgreSQL service and extract it's credentials object
var credentials = pg_services[0].credentials;

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.

*/

//var ca = new Buffer(credentials.ca_certificate_base64, 'base64');
//var connectionString = credentials.uri;
/*
var ca = new Buffer('LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURlekNDQW1PZ0F3SUJBZ0lFV0xXZEJEQU5CZ2txaGtpRzl3MEJBUTBGQURBL01UMHdPd1lEVlFRREREUjUKWVd4cFlXZGhjRUJ3WlM1cFltMHVZMjl0TFRSaVpURTVZMlkwWXpWak1UTmpZakF4TjJJMk5ERTFNVGt3TlRrdwpOMkZpTUI0WERURTNNREl5T0RFMU5UTTBNRm9YRFRNM01ESXlPREUxTURBd01Gb3dQekU5TURzR0ExVUVBd3cwCmVXRnNhV0ZuWVhCQWNHVXVhV0p0TG1OdmJTMDBZbVV4T1dObU5HTTFZekV6WTJJd01UZGlOalF4TlRFNU1EVTUKTURkaFlqQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQU5wUTljZWVsSmdqRTlIZwo0OHFQQjF2UHVoemZqOGpFa2c5WnZUbWhObFp0WHVvWTdUZHlORGxmSFM3Y1E0VWMyVm5ZaVNqU0xYTmZWWmFhClkxbUNxMTNjQ0pCRUpvUmJ0cmgvRzFNajVEUVVNU2dMMExGS3hSZ3g2bzlmVDFoNGtxL3k3UVJ1dFgyYVFacmwKQnhZTFJpNDd3b0NadnFyRW1VSmF0cGdUMVVGVzZkRFZTaE01TFk2MXpEYU1lUHdIZHhLcU1VSXp3RHNmelNZRgpHS21GWUdxc3dacFhvbkdja0ZhSGFvWVpMMU9KcHY0OXI5Q2dDRjFSYnRKZEsxeDNOZGFISmVUWElUeThhaUViCkc5N3d3Qjl2VWtCTHgxK3hCRlF5N0JpbmQ2SEFrM1Z3ejluaituZDh0aWNMd2hVb1FQZ3ZHTVlpUmgvT2hPaDkKUEJyTjVrMENBd0VBQWFOL01IMHdIUVlEVlIwT0JCWUVGTFNKUkJ1VEZremJqbk1VTXA2c1kvMWxMbmE5TUE0RwpBMVVkRHdFQi93UUVBd0lDQkRBZEJnTlZIU1VFRmpBVUJnZ3JCZ0VGQlFjREFRWUlLd1lCQlFVSEF3SXdEQVlEClZSMFRCQVV3QXdFQi96QWZCZ05WSFNNRUdEQVdnQlMwaVVRYmt4Wk0yNDV6RkRLZXJHUDlaUzUydlRBTkJna3EKaGtpRzl3MEJBUTBGQUFPQ0FRRUFPZnd5Slk5Q2dmdDJjYWZMK014RTZFeC8rc3lKUDBlK2tqNmV5YTlXNUxYTgovdGNPS1RtdktaZVVHdDNxTUlSb1VUVEFnUXFUTG5tVE9WN3VVeS9SYzdUeU0wOURLamY0WXk2TUlHcnlwSWl2CkpSMUVoNE1FWUE5SGVnNWQ5TVhSOWgwWTRtTk5zZ1Ezc1psOTY2NWRaaHU1RjRtTHdYRld6NUpZemdObHVPZDUKclREZVdvNjU3VmEvTDI5ME16YWt4L29jbUJiV0ZxZjU4VmR0K3ErUEk2dGF5TUlhQW14QXJ1NE1PeGFYMWJVOQpHcFl6TFUvOXRCc1ZISGhXY0NpeGxUWWpmK0NhbmJDQ1ZPbjRXWThJZ1VYZ3dERzlkSWIrT1FPdmRaN2JVV1FqCjIyMjNWV3BWQjZsdFNaZzFMSk0zL1pTQmJiVk1TNmZXd2xSYWNrVzFnUT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K','base64');
var connectionString = 'postgres://admin:YTOAWUWLFCAJXQAI@sl-us-dal-9-portal.0.dblayer.com:23239/compose';
*/
var ca = new Buffer(JSON.parse(process.env.VCAP_SERVICES)["compose-for-postgresql"][0]["credentials"]["ca_certificate_base64"],'base64');
var connectionString = JSON.parse(process.env.VCAP_SERVICES)["compose-for-postgresql"][0]["credentials"]["uri"];

// We want to parse connectionString to get username, password, database name, server, port
// So we can use those to connect to the database

var parse = require('pg-connection-string').parse;
config = parse(connectionString);

// Add some ssl
config.ssl = {
  rejectUnauthorized: false,
  ca: ca
}

// set up a new client using our config details
var client = new pg.Client(config);

client.connect(function(err) {
  if (err) {
   response.status(500).send(err);
  } else {

  }
});

// We can now set up our web server. First up we set it to serve static pages
app.use(express.static(__dirname + '/public'));


app.get('/index', function(req, res, next) { // route for '/'

  res.render('index');
});

app.get('/login', function(req, res, next) { // route for '/'

  res.render('index');
});

app.get('/', function(req, res, next) { // route for '/'

  res.render('index');
});

app.get('/dashboard', function(req, res, next) { // route for '/'

  res.render('index');
});

app.post('/dashboard', function(req, res, next) { // route for '/'

  res.render('dashboard');
});

//Read from the database the logs of conversations
app.get("/getAllMensajes", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;
    // execute a query on our database
    client.query('select * from mensajes order by conversation_id, datetime', function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }

    });

  });

});

//Read from the database the logs of conversations
app.get("/getAllMensajesMonth", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;
    // execute a query on our database
    client.query("select conversation_id, input, message, confidence, intent, datetime, product from mensajes where (datetime > CURRENT_DATE - interval '1 month') order by conversation_id, datetime", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }

    });

  });

});

//Read from the database the logs of conversations
app.get("/getAllMensajesWeek", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;
    // execute a query on our database
    client.query("select conversation_id, input, message, confidence, intent, datetime, product from mensajes where (datetime > CURRENT_DATE - interval '1 week') order by conversation_id, datetime", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }

    });

  });

});

app.post("/login",function(request,response){
  var client = new pg.Client(config);

  var username = request.body.username;
  var password = request.body.password;

  var passEncriptada = encriptar(username,password);

  client.connect(function(err){

    if(err) throw err;

    var queryLogin = 'select * from usuarios where usuario = $1 and password = $2 ';
    client.query(queryLogin,[username,passEncriptada],function(err,result){
      client.end();
      if(err){
        response.status(500).send(err);
      }else{
        //response.send(result);
        var rowCount = result.rowCount;

        if(rowCount > 0){
          //response.send({success : "1"});
          response.render('dashboard');
        }else{
          response.render('index',{falloLogin:"1"})
        }
      }
    });

  });
});

app.get("/getCountConversaciones", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {
    if (err) throw err;
    // execute a query on our database
    client.query('select count (distinct conversation_id) from mensajes', function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getCountMensajes", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query('select count(*) from mensajes', function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getCountConversacionesMonth", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {
    if (err) throw err;
    // execute a query on our database
    client.query("select count (distinct conversation_id) from mensajes where (datetime > CURRENT_DATE - interval '1 month')", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getCountMensajesMonth", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query("select count(*) from mensajes where (datetime > CURRENT_DATE - interval '1 month')", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getCountConversacionesWeek", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {
    if (err) throw err;
    // execute a query on our database
    client.query("select count (distinct conversation_id) from mensajes where (datetime > CURRENT_DATE - interval '6 days')", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getCountMensajesWeek", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query("select count(*) from mensajes where (datetime > CURRENT_DATE - interval '6 days')", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getMensajesPorProducto", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query('select intent, count(conversation_id) cantidad from logs group by intent order by intent', function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getProductosCantidad", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query("select product,  count(*) as cantidad from mensajes where product not in ('none') group by product", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getTopProductosCantidad", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query("select product,  count(*) as cantidad from mensajes where product not in ('none')  group by product order by cantidad desc fetch first 5 rows only", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getProductos", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query("select row_number() OVER () as indice, F.producto from (select distinct product as producto from mensajes where product not in ('none','pro') order by producto) F", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getDiasDashboard", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query('select row_number() OVER () as indice, F.fecha from (select distinct datetime::date as fecha from mensajes where (current_date::date - datetime::date) < 7 order by fecha) F ', function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getMensajesProductoDia", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query("Select Y.indice as indice, X.fecha, X.producto,X.suma as cantidad FROM (select A.fecha, A.product as producto, SUM(A.cantidad) as suma from (select  datetime::date as fecha,product, count(conversation_id) cantidad from mensajes     group by datetime, product     order by product,datetime ) A     where (CURRENT_DATE::date - A.fecha::date) < 7     group by A.fecha, A.product     order by A.product, A.fecha ) X inner join (   select row_number() OVER () as indice, F.producto from (select distinct product as producto from mensajes where product not in ('none','pro') order by product) F     )Y on X.producto = Y.producto ", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getMensajesPorDia", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query("(select A.fecha as fecha, SUM(A.cantidad) as cantidad from (select  datetime::date as fecha, count(conversation_id) cantidad from mensajes group by datetime order by datetime) A where (CURRENT_DATE::date - A.fecha::date) < 7 group by A.fecha order by A.fecha)", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.get("/getMensajesPorMes", function(request, response) {
  // set up a new client using our config details
  var client = new pg.Client(config);
  // connect to the database
  client.connect(function(err) {

    if (err) throw err;

    // execute a query on our database
    client.query(" select B.mes, SUM(B.cantidad) from (select to_char(A.fecha,'Mon') as mes, SUM(A.cantidad) as cantidad from (select  datetime::date as fecha, count(conversation_id) cantidad from mensajes group by datetime order by datetime) A  group by A.fecha order by A.fecha)B group by B.mes", function (err, result) {
      client.end();
      if (err) {
       response.status(500).send(err);
      } else {
       response.send(result.rows);
      }
    });
  });
});

app.post('/registrar', function(req, res) {
   //Obtenemos los datos username y password
   var username = req.body.username;
   var password = req.body.password;
   //Encriptamos por medio de una función la contraseña
   var passEncriptada = encriptar(username, password);

   var client = new pg.Client(config);

   client.connect(function(err){

    if(err) throw err;

    var queryLogin = 'insert into usuarios(usuario,password) values ($1,$2)';
    client.query(queryLogin,[req.body.username,passEncriptada],function(err,result){
      client.end();
      if(err){
        response.status(500).send(err);
      }else{

          res.send({success : "1"});

      }
    });

  });
});

function encriptar(user, pass) {
   var crypto = require('crypto');
   // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
   var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex');
   return hmac;
}

// Now we go and listen for a connection.
console.log(port);
app.listen(port);

require("cf-deployment-tracker-client").track();
