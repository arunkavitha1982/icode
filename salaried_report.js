
const apiUrlBase = 'https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/dailyreport/getdatebasedata';


function viewDateRangewiseReport() {
  document.getElementById('overlay').style.display = 'flex';
  const apiBase = "https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/dailyReport/getDateRangeReport";
  const tableBody = document.getElementById("tbody");
  tableBody.innerHTML = ''; 
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
      case "Bimonthly":
          dateRange = getLastTwoMonthStartAndEndDates();
          break;
      case "Biweekly":
        dateRange = getLastTwoWeeksDateRange();
        break;
      default:
          console.error("Invalid report type");
          return;
  }


  const startVal = dateRange.startRange;
  const endVal = dateRange.endRange;

  document.getElementById("start-date-header").innerHTML = startVal;
  document.getElementById("end-date-header").innerHTML = endVal;

  const apiUrl = `${apiBase}/${cid}/${startVal}/${endVal}`;

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
                  tableBody.appendChild(newRow);
              } else {
                  // Clear existing rows
                  tableBody.innerHTML = '';

                  // Process each employee and create rows
                  Object.entries(totalTimeWorked).forEach(([pin, Employeedata]) => {
                      const newRow = document.createElement('tr');
                      newRow.innerHTML = `
                          <td class="Name">${Employeedata.name}</td>
                          <td class="Pin">${pin}</td>
                          <td class="TimeWorked">${Employeedata.totalHoursWorked}</td>
                      `;
                      tableBody.appendChild(newRow);
                  });
                  document.getElementById('overlay').style.display = 'none';
              }
          } catch (error) {
              console.error('Error processing data:', error);
          }
      })
      .catch(error => {
          console.error('Fetch error:', error);
      });
}

document.addEventListener('DOMContentLoaded', function(){
    selectedValue = localStorage.getItem('reportType');
    document.getElementById("reportName").textContent = selectedValue + " Report";
    document.getElementById("report-type-heading").textContent = selectedValue + " Report";
    viewDateRangewiseReport();
});

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

