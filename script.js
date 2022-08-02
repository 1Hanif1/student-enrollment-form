'use strict';

// I/O fields
const userName = document.querySelector(".name--js");
const email = document.querySelector(".email--js");
const website = document.querySelector(".website--js");
const imgLink = document.querySelector(".image--js");
let gender = null;
let skills = null;
const errorMessage = document.querySelector('.error--js');

// User interactive fields
const enrollBtn = document.querySelector(".enroll--js");
const clearBtn = document.querySelector(".clear--js");
const studentTable = document.querySelector(".student_table");

// All Enrolled Students
let numStudents = {};

const showErrMsg = function (str) {
    errorMessage.style.visibility = "visible";
    errorMessage.textContent = `${str}`;
    setTimeout(() => errorMessage.style.visibility = "hidden", 2000);
    return false;
}

const validateInput = function (allInputs) {
    // throw error if any input is empty
    for (let input of allInputs) {

        // Empty gender section
        if (input === gender && gender == null)
            return showErrMsg("Error: Please select your gender");

        // Empty Skills section
        if (input === skills && input.length == 0)
            return showErrMsg("Error: Please select some skills");


        // Empty text fields
        if (!input || input !== skills && input.value.trim() === "")
            return showErrMsg(`Error: Please enter your ${input.getAttribute('name')}`);

    }

    // Invalid Email address
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value))
        return showErrMsg("Please enter a valid email address");

    // Invalid website url
    if (!/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(website.value))
        return showErrMsg("Please enter a valid website url")

    // Invalid Image url
    if (!/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(website.value))
        return showErrMsg("Please enter a valid image link")

    return true;
}

const colorizeTableRows = function () {
    let counter = 0;
    const studentRows = document.querySelectorAll('.student_info');
    for (let row of studentRows) {
        if (row.classList.contains('even-row')) row.classList.remove('even-row');
        if (row.classList.contains('odd-row')) row.classList.remove('odd-row');
        row.classList.add(counter++ % 2 == 0 ? "even-row" : "odd-row");
    }
}

const renderStudentData = function (obj) {

    // Generate html markup
    let html = `
    <tr class="student_info" data-id=${obj.id}>
        <td>
            <p>${obj.userName}</p>
            <p>${obj.gender}</p>
            <p>${obj.email}</p>
            <p><a href="${obj.website}">${obj.website}</a></p>
            <p>${obj.skills}</p>
            <div class="cross"></div>
        </td >
    <td>
        <figure style="background-image: url(${obj.imgLink});"></figure>
    </td>
    </tr >
    `
    // render the markup inside the table
    studentTable.insertAdjacentHTML('beforeend', html);
    colorizeTableRows();
}

const enrollFunction = function () {

    // get values of selected gender and skills
    gender = document.querySelector('input[name="gender"]:checked');
    skills = document.querySelectorAll('input[type="checkbox"]:checked');
    const allInputs = [userName, email, website, imgLink, gender, skills];

    // Validate the input
    if (!validateInput(allInputs)) return;

    // Create a student data object
    let studentData = {
        "id": email.value,
        "userName": userName.value,
        "email": email.value,
        "website": website.value,
        "imgLink": imgLink.value,
        "gender": gender.value,
        "skills": (() => {
            let string = "";
            skills.forEach(skill => string += `${skill.getAttribute('value')} `);
            return string;
        })()
    }

    // render the data
    renderStudentData(studentData);

    // store the data in global variable
    numStudents[studentData.email] = studentData;

    // update the value in local storage
    localStorage.setItem('students', JSON.stringify(numStudents));
}
enrollBtn.addEventListener('click', enrollFunction);

const clearFunction = function () {
    // get values of selected gender and skills
    gender = document.querySelector('input[name="gender"]:checked');
    skills = document.querySelectorAll('input[type="checkbox"]:checked');
    const allInputs = [userName, email, website, imgLink, gender, skills];

    // clear all inputs
    for (let input of allInputs) {
        if (input == gender)
            if (gender != null) gender.checked = false;
            else continue;
        else if (input == skills)
            if (skills.length > 0) skills.forEach(skill => skill.checked = false);
            else continue;
        else input.value = "";
    }

}
clearBtn.addEventListener('click', clearFunction);

const studentTableHandler = function (e) {
    // delete an enrolled student
    if (!e.target.classList.contains('cross')) return;
    const studentRow = e.target.closest(".student_info");
    delete numStudents[studentRow.dataset.id];
    localStorage.setItem('students', JSON.stringify(numStudents));
    studentRow.remove();
    colorizeTableRows();
}
studentTable.addEventListener('click', studentTableHandler);


// Render any data from local storage, if any.
(function () {
    const allStudents = localStorage.getItem('students');
    if (!allStudents) return;
    numStudents = JSON.parse(allStudents);
    for (let student of Object.values(numStudents))
        renderStudentData(student);
})();