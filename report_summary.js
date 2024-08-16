
const apiUrlBase = 'https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/dailyreport/getdatebasedata';



function viewCurrentDateReport() {
  document.getElementById('overlay').style.display = 'flex';
  selectedValue = localStorage.getItem('reportType');
    document.getElementById("reportName").textContent = selectedValue + " Report";

    const tableBody3 = document.getElementById("current-checkin-tbody");
    const heading = document.getElementById("current-checkin-header");
    tableBody3.innerHTML = '';
    // Get the current date
    const now = new Date();

    // Get the date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');

    // Format as yyyy-mm-dd
    var date = `${year}-${month}-${day}`;

    heading.innerHTML = date;
    const apiUrl = `${apiUrlBase}/${date}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            try {
        data.forEach(element => {
          console.log(element)
            // Create a new table row
            const newRow = document.createElement('tr');
           console.log(element.CheckInTime)
           
            // Check if CheckOutTime is null
            if (element.CheckOutTime == null) {
              const datetimeId = `datetime-${element.CheckInTime}-${element.Pin}`;
              const checkOutId = `check_out-${element.CheckInTime}-${element.Pin}`;       
              newRow.innerHTML = `
                <td class="Name">${element.Name}</td>
                <td class="Pin">${element.Pin}</td>
                <td class="CheckInTime">${(convertToAmPm((element.CheckInTime).substring(11)))}</td>
                <td>
                  <div class="text-center">
                                    <input type="time" id="${datetimeId}" name="time" class="time-input" step="1">
                                    <div class="calendar-icon" onclick="openTimePicker();"></div>
                                </div>
                </td>
                <td class="text-center">
                  <button type="button" class="btn btn-green" id="${checkOutId}" disabled>Check-out</button>
                </td>
              `;

              tableBody3.appendChild(newRow);

              // Get references to the input and button for this row (using the unique IDs)
              const datetimeInput = document.getElementById(datetimeId);
              const checkOutButton = document.getElementById(checkOutId);
          
              // Set initial disabled state
              checkOutButton.disabled = true;
          
              // Add event listener for this specific input
              datetimeInput.addEventListener('change', function() {
                if (this.value) {
                  checkOutButton.disabled = false;
                } else {
                  checkOutButton.disabled = true;
                }
              });

              checkOutButton.addEventListener('click', function(){
                
                const dateWithTime = getDateTimeFromTimePicker(datetimeInput.value);

                
                const date1 = new Date(dateWithTime);
                const date2 = new Date(element.CheckInTime);

                // Calculate the difference in milliseconds
                const diffInMs = date1 - date2;

                // Convert the difference from milliseconds to total minutes
                const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

                // Calculate the total hours and remaining minutes
                const totalHours = Math.floor(diffInMinutes / 60);
                const minutes = diffInMinutes % 60;

                // Format the hours and minutes
                const formattedHours = String(totalHours).padStart(2, '0');
                const formattedMinutes = String(minutes).padStart(2, '0');

                const timeWorkedHours = formattedHours + ":" +formattedMinutes;

                updateDailyReportAPiData(element.EmpID, element.CID, date, element.Type, element.CheckInSnap, element.CheckInTime, element.CheckOutSnap, dateWithTime, timeWorkedHours)
                
                datetimeInput.value = '';
                checkOutButton.disabled = true;
              });
          
              
            }
            else{
                const datetimeId = `datetime-${element.CheckInTime}-${element.Pin}`;
                const checkOutId = `check_out-${element.CheckInTime}-${element.Pin}`;       
                newRow.innerHTML = `
                  <td class="Name">${element.Name}</td>
                  <td class="Pin">${element.Pin}</td>
                  <td class="CheckInTime">${(convertToAmPm((element.CheckInTime).substring(11)))}</td>
                  <td class="CheckOutTime">${(convertToAmPm((element.CheckOutTime).substring(11)))}</td>
                  <td class="text-center">
                    <button type="button" class="btn btn-grey" id="${checkOutId}" disabled>Check-out</button>
                  </td>
                `;
  
                tableBody3.appendChild(newRow);
  
              }
          });

          if( tableBody3.innerHTML == '')
              {

                      const newRow = document.createElement('tr');
                      newRow.innerHTML = `
                      <td colspan="6" class="text-center">No Records Found</td>
                  `;
                      tableBody3.innerHTML = '';
                      tableBody3.appendChild(newRow);

              }

            }
            catch {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                <td colspan="6" class="text-center">No Records Found</td>
            `;
                tableBody3.innerHTML = '';
                tableBody3.appendChild(newRow);

            }
            document.getElementById('overlay').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



// View Data

function viewDatewiseReport(dateValue) {
    const tableBody = document.getElementById("tBody");
    tableBody.innerHTML = '';

    if (dateValue != "test") {
        const apiUrl = `${apiUrlBase}/${dateValue}`;
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                try {
                    data.forEach(element => {
                        const newRow = document.createElement('tr');
                        if(element.CheckOutTime != null)
                            {
                        newRow.innerHTML = `
                    <td class="Name">${element.Name}</td>
                    <td class="Pin">${element.Pin}</td>
                    <td class="CheckInTime">${(convertToAmPm((element.CheckInTime).substring(11)))}</td>
                    <td class="CheckOutTime">${(convertToAmPm((element.CheckOutTime).substring(11)))}</td>
                    <td class="TimeWorked">${element.TimeWorked}</td>
                `;
                        tableBody.appendChild(newRow);

                            }
                    });

                }
                catch {
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td colspan="6" class="text-center">No Records Found</td>
                    `;
                    tableBody.appendChild(newRow);

                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    else {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
    <td colspan="6" class="text-center">No Date choosen</td>
`;
        tableBody.innerHTML = '';
        tableBody.appendChild(newRow);

    }

}

function viewDateRangewiseReport(startValue, endValue) {
  const apiBase = "https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/dailyReport/getDateRangeReport";
  const tableBody2 = document.getElementById("tBody2");
  tableBody2.innerHTML = ''; // Clear existing rows
  const cid = localStorage.getItem('companyID');

  let dateRange = {};

  const selectedValue = localStorage.getItem('reportType');

  switch (selectedValue) {
      case "Weekly":
          dateRange = getLastWeekDateRange();
          break;
      case "Monthly":
          dateRange = getLastMonthStartAndEndDates();
          break;
      case "BiMonthly":
          dateRange = getLastTwoMonthStartAndEndDates();
          break;
      case "BiWeekly":
        dateRange = getLastTwoWeeksDateRange();
        break;
      default:
          console.error("Invalid report type");
          return;
  }

  const apiUrl = `${apiBase}/${cid}/${dateRange.startRange}/${dateRange.endRange}`;

  // Fetch data from API and render table
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          try {
              // Calculate total time worked for each employee
              const totalTimeWorked = calculateTotalTimeWorked(data);

              // Check if data is an empty array
              if (Array.isArray(data) && data.length === 0) {
                  const newRow = document.createElement('tr');
                  newRow.innerHTML = `
                      <td colspan="6" class="text-center">No Records Found</td>
                  `;
                  tableBody2.appendChild(newRow);
              } else {
                  // Clear existing rows
                  tableBody2.innerHTML = '';

                  // Process each employee and create rows
                  Object.entries(totalTimeWorked).forEach(([pin, Employeedata]) => {
                      const newRow = document.createElement('tr');
                      newRow.innerHTML = `
                          <td class="Name">${Employeedata.name}</td>
                          <td class="Pin">${pin}</td>
                          <td class="TimeWorked">${Employeedata.totalHoursWorked}</td>
                      `;
                      tableBody2.appendChild(newRow);
                  });
              }
          } catch (error) {
              console.error('Error processing data:', error);
          }
      })
      .catch(error => {
          console.error('Fetch error:', error);
      });
}

// Call fetchData when the page is fully loaded

document.addEventListener('DOMContentLoaded', viewCurrentDateReport());
async function updateDailyReportAPiData(emp_id, cid, date, type, checkin_snap, checkin_time,checkout_snap, checkout_time , time_worked) {
  
    const userData = {
      CID: cid,
        EmpID: emp_id,
        Date: date,
        TypeID: type,
        CheckInSnap: checkin_snap,
        CheckInTime: checkin_time,
        CheckOutSnap: checkout_snap,
        CheckOutTime: checkout_time,
        TimeWorked: time_worked
    }

    var apiBaseUrl = `https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/dailyreport/update/${emp_id}/${cid}/${checkin_time}`;

    try {
      const response = await fetch(apiBaseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      else{
      const data = await response.json();
  
      if (!data.error) {
            setTimeout(() => {
                window.location.href = "report_summary.html"; 
            }, 1000);   
                 
      }
      else{
        alert(data.error);
      }
    }
    } catch (error) {
    }
  }


  function convertToAmPm(timeStr) {
    // Split the input string into components
    let [hours, minutes, seconds] = timeStr.split(':').map(Number);

    // Determine AM or PM
    let amPm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    // Format hours, minutes, and seconds as two digits
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    // Combine into the final formatted string
    return `${hours}:${minutes}:${seconds} ${amPm}`;
}

// Weekly Report Date Calculation.

function getLastWeekDateRange() {
    // Today's date
    let today = new Date();
  
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let dayOfWeek = today.getDay();
  
    // Calculate the difference to the previous Monday (dayOfWeek - 1)
    // If today is Monday, dayOfWeek - 1 is 0, so we go back 7 days (last Monday)
    let daysSinceLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
    // Calculate last Monday's date
    let lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceLastMonday - 7);
  
    // Calculate last Sunday's date
    let lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);
  
    // Format dates to yyyy-mm-dd
    let formatDate = (date) => date.toISOString().split('T')[0];
  
    let lastMondayStr = formatDate(lastMonday);
    let lastSundayStr = formatDate(lastSunday);
  
    return {
      startRange: lastMondayStr,
      endRange: lastSundayStr
    };
  }

  function getLastTwoWeeksDateRange() {
    // Today's date
    let today = new Date();
  
    // Find the start of the current week (Monday)
    let currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
  
    // Calculate the start of the last two weeks (Monday two weeks ago)
    let startDate = new Date(currentWeekStart);
    startDate.setDate(currentWeekStart.getDate() - 14);
  
    // Calculate the end of the last two weeks (Sunday two weeks later)
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 13); // 14 days - 1 day
  
    // Format dates to yyyy-mm-dd
    let formatDate = (date) => date.toISOString().split('T')[0];
  
    let startDateStr = formatDate(startDate);
    let endDateStr = formatDate(endDate);
  
    return {
      startRange: startDateStr,
      endRange: endDateStr
    };
}

  function getLastTwoMonthStartAndEndDates() {
    // Get today's date
    const today = new Date();
    
    // Calculate the start date (first day of the month two months ago)
    const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    
    // Calculate the end date (last day of the previous month)
    const endDate = new Date(today.getFullYear(), today.getMonth(), 0);

    return {
      startRange: formatDate(startDate),
      endRange : formatDate(endDate)
    };
}

function getLastMonthStartAndEndDates() {
  // Set today's date for testing
  const today = new Date();
  
  // Calculate the start date of the last full month
  const startDateLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  
  // Calculate the end date of the last full month
  const endDateLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  
 return {
  startRange: formatDate(startDateLastMonth),
  endRange : formatDate(endDateLastMonth)
  };
}

// Function to format date as "yyyy-MM-dd"
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// Functions to convert time and calculate totals
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}


function calculateTotalTimeWorked(data) {
  const employeeTimes = {};

  data.forEach(entry => {
      const { Name, Pin, TimeWorked } = entry;

      if (TimeWorked) {
          const minutesWorked = timeToMinutes(TimeWorked);

          if (!employeeTimes[Pin]) {
              employeeTimes[Pin] = { name: Name, totalMinutes: 0 };
          }
          employeeTimes[Pin].totalMinutes += minutesWorked;
      }
  });

  // Convert total minutes to time string
  for (const [pin, details] of Object.entries(employeeTimes)) {
      details.totalHoursWorked = minutesToTime(details.totalMinutes);
  }

  return employeeTimes;
}

function getDateTimeFromTimePicker(timeValue) {
  // Get today's date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');

  // Extract time components from the time value
  const [hours, minutes, seconds] = timeValue.split(':').map(part => part.padStart(2, '0'));

  // Combine date with time
  const combinedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

  return combinedDateTime;
}


document.addEventListener('DOMContentLoaded', function () {
  // Initialize Flatpickr
  flatpickr(".datetime", {
      enableTime: true,
      enableTime: true,
      enableSeconds: true,
      time_24hr: true,
      dateFormat: "Y-m-d h:i:S",
      minuteIncrement: 1,
      allowInput: true
  });

  // Show modal on button click
  document.getElementById('add-entry').addEventListener('click', function () {
      var modal = new bootstrap.Modal(document.getElementById('addEntryModal'));
      modal.show();
  });

  // Handle form submission
  var form = document.getElementById('entryForm');
  form.addEventListener('submit', function (e) {
      e.preventDefault();
      document.getElementById('overlay').style.display = 'flex';
      var name = document.getElementById('name').value;
      var type = document.getElementById('type').value;
      var employeeId = document.getElementById('employeeId').value;
      var checkinTime = document.getElementById('checkinTime').value;
      var checkoutTime = document.getElementById('checkoutTime').value;

      const cid = localStorage.getItem('companyID');

      const date1 = new Date(checkoutTime);
      const date2 = new Date(checkinTime);

      // Calculate the difference in milliseconds
      const diffInMs = date1 - date2;

      // Convert the difference from milliseconds to total minutes
      const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

      // Calculate the total hours and remaining minutes
      const totalHours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      // Format the hours and minutes
      const formattedHours = String(totalHours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');

      const timeWorkedHours = formattedHours + ":" +formattedMinutes;

      // Data object to be sent
      var data = {
          CID: cid,
          EmpID: employeeId,
          Date: checkinTime.substring(0,10),
          TypeID: type,
          CheckInSnap: null,
          CheckInTime: checkinTime,
          CheckOutSnap: null,
          CheckOutTime: checkoutTime,
          TimeWorked: timeWorkedHours

      };

      // Send PUT request
      fetch('https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/dailyreport/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          console.log('Success:', data);
          // Close the modal
          var modal = bootstrap.Modal.getInstance(document.getElementById('addEntryModal'));
          modal.hide();
          viewCurrentDateReport();
          // Optionally, you can refresh data or provide a success message
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  });
});
