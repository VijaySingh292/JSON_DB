
// public/script.js
document.addEventListener('DOMContentLoaded', function() {
    const rollNoInput = document.getElementById('rollNo');
    rollNoInput.addEventListener('change', checkRollNo);
});

function checkRollNo() {
    const rollNo = document.getElementById('rollNo').value;
    
    // AJAX call to check if the roll number exists in the database
    fetch(`http://localhost:3000/checkRollNo?rollNo=${rollNo}`)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                // If exists, populate the form with the data
                const student = data.student;
                document.getElementById('fullName').value = student.fullName;
                document.getElementById('class').value = student.class;
                document.getElementById('birthDate').value = student.birthDate.split('T')[0];
                document.getElementById('address').value = student.address;
                document.getElementById('enrollmentDate').value = student.enrollmentDate.split('T')[0];

                // Enable Update and Reset buttons
                document.getElementById('updateBtn').disabled = false;
                document.getElementById('resetBtn').disabled = false;
            } else {
                // If doesn't exist, clear the form and enable Save and Reset buttons
                resetForm();
                document.getElementById('saveBtn').disabled = false;
                document.getElementById('resetBtn').disabled = false;
            }

            // Enable all fields except Roll No
            document.getElementById('fullName').disabled = false;
            document.getElementById('class').disabled = false;
            document.getElementById('birthDate').disabled = false;
            document.getElementById('address').disabled = false;
            document.getElementById('enrollmentDate').disabled = false;
        })
        .catch(error => console.error('Error:', error));
}

function resetForm() {
    document.getElementById('enrollmentForm').reset();
    document.getElementById('fullName').disabled = true;
    document.getElementById('class').disabled = true;
    document.getElementById('birthDate').disabled = true;
    document.getElementById('address').disabled = true;
    document.getElementById('enrollmentDate').disabled = true;
    document.getElementById('saveBtn').disabled = true;
    document.getElementById('updateBtn').disabled = true;
}

function saveData() {
    const studentData = {
        rollNo: document.getElementById('rollNo').value,
        fullName: document.getElementById('fullName').value,
        class: document.getElementById('class').value,
        birthDate: document.getElementById('birthDate').value,
        address: document.getElementById('address').value,
        enrollmentDate: document.getElementById('enrollmentDate').value,
    };

    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            resetForm();
        })
        .catch(error => console.error('Error:', error));
}

function updateData() {
    saveData();
}
