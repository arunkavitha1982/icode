
const apiUrlBase = 'https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/employee';

// function showProgressIndicator() {
//     document.getElementById('overlay').style.display = 'flex';
// }

// function hideProgressIndicator() {
//     document.getElementById('overlay').style.display = 'none';
// }

// Remove Data

function dataRemove(e) {
    document.getElementById("instructor").value = "";
    document.getElementById("fName").value = "";
    document.getElementById("lName").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("savebtn").value = "";
}

// Create Data

function addEmpdetails() {
    const isValidFName = validFName();
    const isValidLName = validLName();
    const isValidPhoneNumber = validPhoneno();
    if (isValidFName && isValidLName && isValidPhoneNumber) {
        const empupdateid = document.getElementById("savebtn").value;
        const empfname = document.getElementById("fName").value;
        const emplname = document.getElementById("lName").value;
        const empphoneno = document.getElementById("phoneNumber").value;
        const empinst = document.getElementById("instructor").value;
        const empactive = true;
        const empid = 'eid_' + Math.random().toString(36).substr(2, 12);
        const empcid = localStorage.getItem('companyID');

        if (empupdateid == "") {
            const apiUrl = `${apiUrlBase}/create`;

            const employeeObject = {
                EmpID: empid,
                CID: empcid,
                FName: empfname,
                LName: emplname,
                IsActive: empactive,
                PhoneNumber: empphoneno,
                Pin: empinst
            };

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeObject)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        document.querySelector(".e-msg").textContent = data.error;
                        $(".error-msg").show();
                        setTimeout(function () {
                            $(".error-msg").hide();
                            window.location.href = "employee_list.html";
                        }, 1000);
                    } else {
                        document.querySelector(".s-msg").textContent = data.message;
                        $(".success-msg").show();
                        setTimeout(function () {
                            $(".success-msg").hide();
                            window.location.href = "employee_list.html";
                        }, 1000);
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            const apiUrl = `${apiUrlBase}/update/${empupdateid}`;

            const updateEmployeeObject = {
                EmpID: empid,
                CID: empcid,
                FName: empfname,
                LName: emplname,
                IsActive: empactive,
                PhoneNumber: empphoneno,
                Pin: empinst
            };

            fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateEmployeeObject)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        document.querySelector(".e-msg").textContent = data.error;
                        $(".error-msg").show();
                        setTimeout(function () {
                            $(".error-msg").hide();
                            window.location.href = "employee_list.html";
                        }, 1000);
                    } else {
                        document.querySelector(".s-msg").textContent = data.message;
                        $(".success-msg").show();
                        setTimeout(function () {
                            $(".success-msg").hide();
                            window.location.href = "employee_list.html";
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
    }
}


// View Data

function viewEmpdetails() {
    const tableBody = document.getElementById("tBody");
    const company_id = localStorage.getItem('companyID');
    const apiUrl = `${apiUrlBase}/getall/${company_id}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(element => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                <td class="fName">${element.FName}</td>
                <td class="lName">${element.LName}</td>
                <td class="instructor">${element.Pin}</td>
                <td class="phoneNumber">${element.PhoneNumber}</td>
                <td>
                <button class="btn icon-button btn-green" onclick="editEmpdetails('${element.EmpID}')" data-bs-toggle="modal" data-bs-target="#myModal"> Edit </button>
                 <button class="btn icon-button btn-outline-green" id="buttonClick" onclick="showLogoutModal()">Delete</button>
                </td>
            `;
                tableBody.appendChild(newRow);
            });
            document.getElementById('overlay').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

// Call fetchData when the page is fully loaded
document.addEventListener('DOMContentLoaded', viewEmpdetails);
document.getElementById('overlay').style.display = 'flex';
// Edit Data

function editEmpdetails(emId) {
    const apiUrl = `${apiUrlBase}/get/` + emId;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(formvalue => {
                document.getElementById("instructor").value = formvalue.Pin;
                document.getElementById("fName").value = formvalue.FName;
                document.getElementById("lName").value = formvalue.LName;
                document.getElementById("phoneNumber").value = formvalue.PhoneNumber;
                document.getElementById("savebtn").value = formvalue.EmpID;
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Delete Data

function deleteEmpdetails(emId) {

    const apiUrl = `${apiUrlBase}/delete/${emId}`;

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
                document.querySelector(".e-msg").textContent = data.error;
                $(".error-msg").show();
                setTimeout(function () {
                    $(".error-msg").hide();
                    window.location.href = "employee_list.html";
                }, 1000);
            } else {
                document.querySelector(".s-msg").textContent = data.message;
                $(".success-msg").show();
                setTimeout(function () {
                    $(".success-msg").hide();
                    window.location.href = "employee_list.html";
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            ;
        });
}



// Validation
var isAlpha = /^[a-zA-Z\s]+$/;

function validFName() {
    const fname = document.getElementById('fName').value;
    const errorFName = document.getElementById('showMsg1');
    if (fname.trim() === '') {
        errorFName.textContent = 'First name is required';
        return false;
    }
    else if (!isAlpha.test(fname)) {
        errorFName.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorFName.textContent = '';
    return true;
}

function validLName() {
    const lname = document.getElementById('lName').value;
    const errorLName = document.getElementById('showMsg2');
    if (lname.trim() === '') {
        errorLName.textContent = 'Last name is required';
        return false;
    }
    else if (!isAlpha.test(lname)) {
        errorLName.textContent = 'Only use letters, don\'t use digits';
        return false;
    }
    errorLName.textContent = '';
    return true;
}

function validPhoneno() {
    const input = document.querySelector("#phoneNumber");
    const phoneError = document.querySelector("#showMsg3");
    const employePin = document.getElementById("instructor");
    const phoneNumber = input.value;

    employePin.value = (input.value).substring((input.value).length - 4);

    const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;

    if (phoneNumber === "") {
        phoneError.textContent = 'Enter phone number.';
        return false;
    } else if (!phoneRegex.test(phoneNumber)) {
        phoneError.textContent = 'Invalid phone number.';
        return false;
    } else {
        phoneError.textContent = '';
        return true;
    }


}


function validateInstructerPin() {
    const instructerPin = document.getElementById('instructor').value;
    const errorInstructerPin = document.getElementById('showMsg');
    if (instructerPin.trim() === '') {
        errorInstructerPin.textContent = 'Instructer pin is required';
        return false;
    }
    errorInstructerPin.textContent = '';
    return true;
}


function formatPhoneNumber() {
    const inputField = document.getElementById('phoneNumber');
    let value = inputField.value;
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    // Format the phone number
    if (value.length > 3 && value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length > 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    inputField.value = value;
}

function showLogoutModal() {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'addEntryModal2';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'addEntryModalLabel2');
    modal.setAttribute('aria-hidden', 'true');
    

    // Modal dialog
    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog modal-dialog-centered';

    // Modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.id = 'addEntryModalLabel2';
    modalTitle.textContent = 'Delete';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');

    // Append title and close button to header
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body d-flex align-items-center';

    const bodyText = document.createElement('h5');
    bodyText.className = 'fw-bold mb-3';
    bodyText.textContent = 'Are you sure you are deleting the data?';

    const yesButton = document.createElement('button');
    yesButton.className = 'btn yes';
    yesButton.textContent = 'Yes';
    yesButton.style="margin-left:15px"
    yesButton.addEventListener('click', function() {
        deleteEmpdetails()
    });

    const noButton = document.createElement('button');
    noButton.className = 'btn btn-outline-green';
    noButton.setAttribute('data-bs-dismiss', 'modal');
    noButton.textContent = 'No';

    // Append elements to body
    modalBody.appendChild(bodyText);
    modalBody.appendChild(yesButton);
    modalBody.appendChild(noButton);

    // Append header and body to content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    // Append content to dialog
    modalDialog.appendChild(modalContent);

    // Append dialog to modal
    modal.appendChild(modalDialog);

    // Append modal to body
    document.body.appendChild(modal);

    // Show the modal using Bootstrap's modal plugin
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}
document.getElementById('buttonClick').addEventListener('click', showLogoutModal);