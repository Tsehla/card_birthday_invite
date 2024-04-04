function updateTimeAndDate() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    let amPm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }
    let timeStr = hours.toString().padStart(2, '0') + minutes;
    if (timeStr.startsWith('0')) {
        timeStr = ' ' + timeStr.slice(1);
    }
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    if (month.startsWith('0')) {
        month = ' ' + month.slice(1);
    }
    if (day.startsWith('0')) {
        day = ' ' + day.slice(1);
    }
    const displayStr = timeStr + amPm + month + day + year;
    for (let i = 0; i < 12; i++) {
        document.getElementById('char' + i + '1').textContent = displayStr[i];
        document.getElementById('char' + i + '2').textContent = displayStr[i];
    }
}
// updateTimeAndDate();
// setInterval(updateTimeAndDate, 60000);


function countdownFromCurrentTime() {

    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Calculate total minutes from current time
    let totalMinutes = hours * 60 + minutes;

    let amPm = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) {
            hours -= 12;
    } 
    else if (hours === 0) {
            hours = 12;
    }


    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    if (month.startsWith('0')) {
        month = ' ' + month.slice(1);
    }
    if (day.startsWith('0')) {
        day = ' ' + day.slice(1);
    }

    // Countdown interval
    const countdownInterval = setInterval(() => {
        // Calculate hours and minutes from total minutes
        hours = Math.floor(totalMinutes / 60);
        minutes = totalMinutes % 60;

        amPm = hours >= 12 ? 'PM' : 'AM';


        // Update display
        let timeStr = hours.toString().padStart(2, '0') + minutes.toString().padStart(2, '0');
        let displayStr = timeStr + amPm + month + day + year;

        for (let i = 0; i < 12; i++) {

            document.getElementById('char' + i + '1').textContent = displayStr[i];
            document.getElementById('char' + i + '2').textContent = displayStr[i];
        }

        // Check if countdown is complete
        if (totalMinutes <= 0) {
            clearInterval(countdownInterval);

            setTimeout(()=>{
                document.body.querySelector('.clock').classList.toggle('off');
                setTimeout(()=>{
                    updateTimeAndDate(); 
                    // alert("Countdown complete!");
                    // document.location.href='/main.html';
                    // window.open('/main.html','_self', "copyhistory=yes");

                    document.getElementById('next_page').click()
                }, 2000)
               
            }, 3000)
       
        } else {
            // Decrease total minutes by 1
            totalMinutes--;
        }
    }, 25); // Update every millisecond
}

// countdownFromCurrentTime();




var on_of_tracker = 0;
var light_effect_1 = setInterval(()=>{

    document.body.querySelector('.clock').classList.toggle('off');

    on_of_tracker +=1;

    if (on_of_tracker===300){
        clearInterval(light_effect_1);

        setTimeout(()=>{

            document.body.querySelector('.clock').classList.toggle('off');
            setTimeout(()=>{
                updateTimeAndDate();

                setTimeout(()=>{
                    countdownFromCurrentTime();
                }, 3000)
            }, 3000)

        }, 5000)
    }

}, 25)