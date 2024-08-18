
        document.addEventListener("DOMContentLoaded", function () {
            // Retrieve the logo from local storage
            const companyLogo = localStorage.getItem('companyLogo');

            // If a logo exists, set it as the source for the image
            if (companyLogo) {
                const logoImg = document.getElementById('logo-img');
                logoImg.src = companyLogo; // Set the logo image source
                logoImg.onload = function () {
                    console.log('Logo image loaded successfully');
                };
                logoImg.onerror = function () {
                    console.error('Error loading logo image');
                };
            }
        });
        document.getElementById('loginBtn').addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            loginCheck(username, password)
                .then(isAuthenticated => {
                    if (isAuthenticated) {
                        document.getElementById('overlay').style.display = 'flex';
                        let exm = localStorage.getItem("companyID");
                        getCustmData(exm);
                        setTimeout(function () {
                                window.location.href = 'employee_list.html';
                            }, 3000);

                    } else {
                        document.getElementById('errorMsg').innerHTML = "Invalid username or password";
                        document.getElementById('errorMsg').style = "color:red";
                    }
                })
                .catch(error => {
                    console.error('Error during authentication:', error);
                    alert('An error occurred during authentication');
                });
        });

        const key1 = new Uint8Array([16, 147, 220, 113, 166, 142, 22, 93, 241, 91, 13, 252, 112, 122, 119, 95]);

        async function loginCheck(username, password) {
            try {
                const response = await fetch(`https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/company/getuser/${username}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } else {
                    const data = await response.json();
                    const decryptPassword = await decrypt(data["Password"], key1);
                    const companyID = data["CID"];
                    localStorage.setItem('companyID', companyID);
                    localStorage.setItem('companyName', data["CName"]);
                    localStorage.setItem('companyLogo', data["CLogo"]);
                    localStorage.setItem('companyAddress', data["CAddress"]);
                    localStorage.setItem('username', data["UserName"]);
                    localStorage.setItem('password', data["Password"]);
                    localStorage.setItem('reportType', data["ReportType"]);

                    const user = data["UserName"] === username && decryptPassword === password;

                    return user ? true : false;
                }
            } catch (error) {
                console.error('Login check error:', error);
                return false;
            }
        }

        async function decrypt(encryptedDataWithIV, key) {
            const buffer = new Uint8Array(atob(encryptedDataWithIV).split('').map(char => char.charCodeAt(0)));
            const iv = buffer.slice(0, 12);
            const encryptedData = buffer.slice(12);

            const algorithm = { name: 'AES-GCM', iv: iv };
            const importedKey = await window.crypto.subtle.importKey(
                'raw', key, algorithm, false, ['decrypt']
            );

            const decryptedData = await window.crypto.subtle.decrypt(
                algorithm, importedKey, encryptedData
            );

            return new TextDecoder().decode(decryptedData);
        }

        function getCustmData(cid1) {
            const apiUrlBase2 = 'https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/customer';
            const apiUrl2 = `${apiUrlBase2}/getUsingCID/${cid1}`;

            fetch(apiUrl2)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data fetched:', data["CustomerID"]);
                    localStorage.setItem('customId', data["CustomerID"]);
                    localStorage.setItem('firstName', data["FName"]);
                    localStorage.setItem('lastName', data["LName"]);
                    localStorage.setItem('address', data["Address"]);
                    localStorage.setItem('phone', data["PhoneNumber"]);
                    localStorage.setItem('email', data["Email"]);

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
