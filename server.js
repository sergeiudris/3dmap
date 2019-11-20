var express = require('express');
var port = 3344;
var app = express();

//configure app
app.set('views', __dirname);

//use middleware

app.use(express.static(__dirname));

app.get('/', function(req,res){
	res.render('index');
});

app.listen(port, function () {
    console.log('>app is running on port '+port+'\n>type   http://127.0.0.1:'+port+'   in your browser to use the application\n>to stop the server: press  ctrl + c' );
});

