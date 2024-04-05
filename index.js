

// ======== Modules +++++++++++++
var express = require('express');

var app = express();


const fs = require('fs');
const path = require('path');




//create folders
if (!fs.existsSync('./attendees')) {
    
    //sites
    fs.mkdirSync('./attendees');

}

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

            const { name, surname, contact, drink} = attendeeData;
            const filename = `${name}_${contact}.json`;
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

        const attendeeData = { 
            name: req.body.name, 
            surname: req.body.surname, 
            contact: req.body.contact, 
            drink : req.body.drink,
            attend : req.body.attend,
            partner : req.body.partner,
            date : Date.now()
        };

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





    // Define folder path
    const attendeesFolder = path.join(__dirname, 'attendees');
    
    // Function to read JSON files in a directory
    function readJsonFiles(directory) {
        return fs.readdirSync(directory)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(directory, file);
                const fileContents = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(fileContents);
            });
    }
    
    // Serve HTML with table of attendees
    app.get('/attendees', (req, res) => {
        const attendees = readJsonFiles(attendeesFolder);
        let tableHtml = `
            <html>
            <head>
                <title>Attendees</title>
                <!-- Add any CSS frameworks for styling -->
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
            </head>
            <body>
                <h1>Attendees List</h1>
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Contact</th>
                            <th>Drink</th>
                            <th>Attend</th>
                            <th>Partner</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>`;
    
        attendees.forEach(attendee => {
            tableHtml += `
                <tr>
                    <td>${attendee.name}</td>
                    <td>${attendee.surname}</td>
                    <td>${attendee.contact}</td>
                    <td>${attendee.drink}</td>
                    <td>${attendee.attend}</td>
                    <td>${attendee.partner}</td>
                    <td>${new Date(attendee.date).toLocaleString()}</td>
                </tr>`;
        });
    
        tableHtml += `
                    </tbody>
                </table>
            </body>
            </html>`;
    
        res.send(tableHtml);
    });
    

    const attendeesDir = path.join(__dirname, 'attendees'); // Ensure correct path handling

// Function to read and parse JSON files
// Function to read and parse JSON files
async function readAttendees() {
    // let fs = require('fs').promises; // Use promises for cleaner async/await syntax

    try {
      const files =  fs.readdirSync(attendeesDir);
      const attendees = [];
      for (const file of files) {
        if (path.extname(file) === '.json') {
          const filePath = path.join(attendeesDir, file);
          const data = fs.readFileSync(filePath, 'utf8');
          attendees.push(JSON.parse(data));
        }
      }
      return attendees;
    } catch (error) {
      throw error;
    }
  }
  

// Function to create HTML table with search functionality (using Bootstrap)
function createAttendeeTable(attendees) {
  let tableHtml = `
    <table class="table table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Surname</th>
          <th>Contact</th>
          <th>Drink</th>
          <th>Attend</th>
          <th>Partner</th>
          <th>Date</th>
        </tr>
      </thead>
    <tbody>
    `;

  for (const attendee of attendees) {
    tableHtml += `
        <tr>
            <td><span class="math-inline">${attendee.name}</td\>
            <td\></span>${attendee.surname}</td>
            <td><span class="math-inline">${attendee.contact}</td\>
            <td\></span>${attendee.drink}</td>
            <td><span class="math-inline">${attendee.attend}</td\>
            <td\></span>${attendee.partner}</td>
            <td>${new Date(attendee.date).toLocaleDateString()}</td> 
        </tr>
    `;
  }

  tableHtml += `</tbody></table>`;

  // Add search bar using Bootstrap (replace with your preferred search library/method)
  tableHtml += `
    <div class="mb-3">
      <input class="form-control" type="text" placeholder="Search attendees..." id="searchInput">
    </div>`;

  return tableHtml;
}

// Express route handler with error handling
app.get('/attendees2/', async (req, res) => {

    //checkpassword
    if(req.query.p !== 'admin'){
        return res.send('Access not allowed.')
    };



  try {
    const attendees = await readAttendees();
    const tableHtml = createAttendeeTable(attendees);
    res.send(`<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Birthday Attendees List</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
            </head>
            <body>
                <div class="container mt-3">
                    <h1>Attendees</h1>
                    ${tableHtml}
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jY38PBHQiwNzxEhCVIFvVHdWUMxdzC7" crossorigin="anonymous"></script>
                <script>
                    const searchInput = document.getElementById('searchInput');
                    searchInput.addEventListener('keyup', function() {
                        const searchTerm = this.value.toLowerCase();
                        const tableBody = document.querySelector('tbody');
                        const tableRows = tableBody.querySelectorAll('tr');
                        for (const row of tableRows) {
                            let found = false;
                            const cells = row.querySelectorAll('td');
                            for (const cell of cells) {
                                const cellText = cell.textContent.toLowerCase();
                                if (cellText.includes(searchTerm)) {
                                    found = true;
                                    break;
                                }
                            }
                            
                            if (found) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        }
                    });
                </script>
            </body>
        </html>
        `);
    
    } catch (error) {
        console.error('Error reading attendees:', error);
        res.status(500).send('Internal Server Error');
    }

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






