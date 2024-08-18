
const apiUrlBase = 'https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/company-report-type';

document.addEventListener("DOMContentLoaded", function () {
    selectedValue = localStorage.getItem('reportType');
    document.getElementById("reportViewType").textContent = selectedValue;
});

// Remove Data

function dataRemove(e) {
    document.getElementById("remail").value = "";
    document.getElementById("frequencySelect").value = "";
    document.getElementById("savebtn").value = "";
}

// Create Data and Update Data

function addreportdetails() {
    const isValidRdays = validReportDays();
    const isValidEmail = validREmail();

    if (isValidRdays && isValidEmail) {
        const reportUpdateid = document.getElementById("savebtn").value;
        const reportEmail = document.getElementById("remail").value;
        const reportSelect = document.getElementById("frequencySelect");
        const selectedValues = Array.from(reportSelect.selectedOptions).map(option => option.value);
        let DailyReportActive = false;
        let WeeklyReportActive = false;
        let BiWeeklyReportActive = false;
        let MonthlyReportActive = false;
        let BiMonthlyReportActive = false;
        const company_id = localStorage.getItem('companyID');


        selectedValues.forEach(element => {
            if (element == 'Daily') {
                DailyReportActive = true;
            } else if (element == 'Weekly') {
                WeeklyReportActive = true;
            } else if (element == 'Biweekly') {
                BiWeeklyReportActive = true;
            } else if (element == 'Monthly') {
                MonthlyReportActive = true;
            } else if (element == 'Bimonthly') {
                BiMonthlyReportActive = true;
            }
        });

        if (reportUpdateid == "") {
            const apiUrl = `${apiUrlBase}/create`;

            const reportObject = {
                CompanyReporterEmail: reportEmail,
                CID: company_id,
                IsDailyReportActive: DailyReportActive,
                IsWeeklyReportActive: WeeklyReportActive,
                IsBiWeeklyReportActive: BiWeeklyReportActive,
                IsMonthlyReportActive: MonthlyReportActive,
                IsBiMonthlyReportActive: BiMonthlyReportActive
            };

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportObject)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        $(".error-msg").show();
                        setTimeout(function () {
                            $(".error-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    } else {
                        $(".success-msg").show();
                        setTimeout(function () {
                            $(".success-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            const apiUrl = `${apiUrlBase}/update/${reportUpdateid}/${company_id}`;

            const updateReportObject = {
                CompanyReporterEmail: reportEmail,
                CID: company_id,
                IsDailyReportActive: DailyReportActive,
                IsWeeklyReportActive: WeeklyReportActive,
                IsBiWeeklyReportActive: BiWeeklyReportActive,
                IsMonthlyReportActive: MonthlyReportActive,
                IsBiMonthlyReportActive: BiMonthlyReportActive
            };

            fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateReportObject)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        $(".error-msg").show();
                        setTimeout(function () {
                            $(".error-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    } else {
                        $(".success-msg").show();
                        setTimeout(function () {
                            $(".success-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

    }
    else {
        alert('Please fix the errors in the form');
        document.getElementById('selectError').textContent = null;
    }
}


// View Data

function viewReportdetails() {
    document.getElementById('overlay').style.display = 'flex';
    const tableBody = document.getElementById("tBody");
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/getAllReportEmail/${company_id}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            
            data.forEach(element => {
                const ReportActive = [];
                if (element.IsDailyReportActive == 1) {
                    ReportActive.push('Daily');
                }   
                if (element.IsWeeklyReportActive == 1) {
                    ReportActive.push('Weekly');
                } 
                if (element.IsBiWeeklyReportActive == 1) {
                    ReportActive.push('Biweekly');
                }
                if (element.IsMonthlyReportActive == 1) {
                    ReportActive.push('Monthly');
                } 
                if (element.IsBiMonthlyReportActive == 1) {
                    ReportActive.push('Bimonthly');
                }
                
              // Convert the array to a comma-separated string
                const Frequency = ReportActive.join(',');
                const newRow = document.createElement('tr');

                newRow.innerHTML = `
                <td class="ReporterEmail">${element.CompanyReporterEmail}</td>
                <td class="ReportActive">${Frequency}</td>
                <td>
                <button class="btn icon-button btn-green" onclick="editEmpdetails('${element.CompanyReporterEmail}')" data-bs-toggle="modal" data-bs-target="#myModal"> Edit </button>
                <button class="btn icon-button btn-outline-green" onclick="deleteEmpdetails('${element.CompanyReporterEmail}')"> Delete </button>
                </td>
            `;
                tableBody.appendChild(newRow);
                document.getElementById('overlay').style.display = 'none';
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function viewSecondReportdetails() {
    var reportType = localStorage.getItem('reportType');
    const tableBody = document.getElementById("tBody2");
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/getAllReportEmail/${company_id}`;

    const newRow = document.createElement('tr');

                newRow.innerHTML = `
                <td class="ReportActive">${reportType}</td>
                <td>
                <button class="btn icon-button btn-outline-green" onclick="editReportdetails('${reportType}')" data-bs-toggle="modal" data-bs-target="#myModal2"> Edit </button>
                </td>
            `;
                tableBody.appendChild(newRow);

}

// Call fetchData when the page is fully loaded
document.addEventListener('DOMContentLoaded', viewReportdetails);
document.addEventListener('DOMContentLoaded', viewSecondReportdetails);


// Edit Data

function editEmpdetails(companyEmail) {
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/get/${companyEmail}/${company_id}`;
    const freqselect = document.getElementById('frequencySelect');
    const freqselectedValues = [];
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.IsDailyReportActive) freqselectedValues.push('Daily');
            if (data.IsWeeklyReportActive) freqselectedValues.push('Weekly');
            if (data.IsBiWeeklyReportActive) freqselectedValues.push('Biweekly');
            if (data.IsMonthlyReportActive) freqselectedValues.push('Monthly');
            if (data.IsBiMonthlyReportActive) freqselectedValues.push('Bimonthly');

            // Set the selected values
            $(freqselect).selectpicker('val', freqselectedValues);
            document.getElementById("remail").value = data.CompanyReporterEmail;
            document.getElementById("savebtn").value = data.CompanyReporterEmail;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function editReportdetails(reportType) {
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/admin-report-type/update/${company_id}`;
    const freqselect = document.getElementById('frequencySelect2');
    const freqselectedValues = [];
    
    freqselectedValues.push(reportType);

    $(freqselect).selectpicker('val', freqselectedValues);

}

// Delete Data

function deleteEmpdetails(companyEmail) {
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/delete/${companyEmail}/${company_id}`;

    fetch(apiUrl, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                $(".error-msg").show();
                setTimeout(function () {
                    $(".error-msg").hide();
                    window.location.href = "report_setting.html";
                }, 1000);
            } else {
                document.querySelector(".s-msg").textContent = data.message;
                $(".success-msg").show();
                setTimeout(function () {
                    $(".success-msg").hide();
                    window.location.href = "report_setting.html";
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            ;
        });
}



// Validation
var isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validREmail() {
    const remail = document.getElementById('remail').value;
    const errorrEmail = document.getElementById('error-email');

    if (remail.trim() === '') {
        errorrEmail.textContent = 'Email is required';
        return false;
    }
    else if (!isEmail.test(remail)) {
        errorrEmail.textContent = 'Email pattern is Invalid';
        return false;
    } else {
        errorrEmail.textContent = '';
        return true;
    }

}


function validReportDays() {
    const select = document.getElementById('frequencySelect');
    const errorMsg = document.getElementById('selectError');

    if (select.selectedOptions.length === 0) {
        errorMsg.textContent = 'Please select at least one option.';
        return false;
    } else if (select.selectedOptions.length > 2) {
        errorMsg.textContent = 'Please select only two option.';
        return false;
    } 
    else {
        errorMsg.textContent = '';
        return true;
    }
}


function validReportDays2() {
    const select = document.getElementById('frequencySelect2');
    const errorMsg = document.getElementById('selectError2');

    if (select.selectedOptions.length === 0) {
        errorMsg.textContent = 'Please select at least one option.';
        return false;
    } else if (select.selectedOptions.length > 1) {
        errorMsg.textContent = 'Please select only one option.';
        return false;
    } 
    else {
        errorMsg.textContent = '';
        return true;
    }
}

function updateReportdetails() {
    const isValidRdays = validReportDays2();

    if (isValidRdays) {
        const reportUpdateid = document.getElementById("savebtn2").value;
        const reportSelect = document.getElementById("frequencySelect2");
        const selectedValues = Array.from(reportSelect.selectedOptions).map(option => option.value);
        const company_id = localStorage.getItem('companyID');

        
        const apiUrl = `https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/admin-report-type/update/${company_id}`;
    

            const reportObject = {
                CID: company_id,
                ReportType: selectedValues[0]
            };

            fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportObject)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        $(".error-msg").show();
                        setTimeout(function () {
                            $(".error-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    } else {
                        localStorage.setItem("reportType", selectedValues[0]);
                        console.log(selectedValues[0]);
                        $(".success-msg").show();
                        setTimeout(function () {
                            $(".success-msg").hide();
                            window.location.href = "report_setting.html";
                        }, 1000);
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        

    }
    else {
        
        alert('Please fix the errors in the form');
        document.getElementById('selectError2').textContent = null;
    }
}


