

// ======== Modules +++++++++++++
var express = require('express');

var app = express();


const fs = require('fs');
const path = require('path');

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



    app.post('/add_atendee', (req, res)=>{

        console.log(req.body)

        // return

        function checkAndCreateAttendee(attendeeData, callback) {

            const { name, surname, phone } = attendeeData;
            const filename = `${name}_${phone}.json`;
            const filePath = path.join(__dirname, 'attendees', filename);

            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // File doesn't exist, create it
                    const attendeeJson = JSON.stringify(attendeeData, null, 2);
                    fs.writeFile(filePath, attendeeJson, (err) => {
                        if (err) {
                        callback(err);
                        } else {
                        callback(null, `Attendee created successfully: ${filename}`);
                        }
                    });
                } 
                else {
                    // File exists, return error
                    callback(new Error('Attendee already exists'), fs.readFileSync(filePath, 'utf8'));
                }
            });
        }

        const attendeeData = { name: req.body.name, surname: req.body.surname, phone: req.body.phone, date : Date.now()};

        checkAndCreateAttendee(attendeeData, (err, message) => {
        if (err) {
            console.error(err.message, message);
            res.jsonp({ result : 'error', data : JSON.parse(message)})
        } else {
            console.log(message);
            res.jsonp({ result : 'success', data : {}})//record exist
        }
        });



    });


    
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






