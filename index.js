

// ======== Modules +++++++++++++
var express = require('express');

var app = express();

    //---------------------------------------
    //---- remove char limit ----
    //---------------------------------------

    app.use(express.json({limit: '50mb'})); //Used to parse JSON bodies
    app.use(express.urlencoded({limit: '50mb',extended: true, parameterLimit: 1000000})); //Parse URL-encoded bodies



    //---------------------------------------
    //---- show logs requests of tcp incoming ----
    //---------------------------------------


    app.use(function(req, res,next){
        console.log(req.protocol + '://' + req.get('host') + req.originalUrl);//shor url of request
        
        //---------- cors ----------//cross server communication allow policy
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        next()
    });


    //---------------------------
    // serve images/scripts/etc
    //----------------------------

    app.use(express.static('site'));
    // app.use(express.static('stores_data'));
    // app.use('/stores_data', express.static('stores_data'));//express virtual path static folder methods, it provide fake path to static folder, meaning use() can replace with get()


    
    //---------------------------
    // //handle unknown tcp request// send message to hackers
    //----------------------------


    app.get('*',function(req, res){
        // res.sendFile(path.resolve('static/err.html'));
        res.send('Error, Link not fount. <a href="/">Go to Home Page</a>');
    
    });


 
    //---------------------------
    // -- ports --
    //---------------------------
    // var app_port = process.env.PORT || 8080;//application port 8080 default or from env file if provided
    var app_port = process.env.PORT || process.env.Port || 8081;//application port 8080 default or from env file if provided // leave [ process.env.PORT  ] empty for heroku
    if(process.env.NODE_ENV =='development' ){ //if development enviroment//force local mongo
        app_port = 8084;
    }

    app.set('port', app_port); // set port for TCP with Express

    app.listen(app_port, function(){ //listen for tcp requests
        console.log(`===========================================\nListening for TCP request at port : ${app_port}\n===========================================`);
    }); 






