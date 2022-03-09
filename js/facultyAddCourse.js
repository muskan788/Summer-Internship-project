const firebaseConfig = {
    apiKey: "AIzaSyC97NW-btuTa2CdmvmD1qDK9R3JaLxwpNg",
    authDomain: "poattainment.firebaseapp.com",
    databaseURL: "https://poattainment-default-rtdb.firebaseio.com",
    projectId: "poattainment",
    storageBucket: "poattainment.appspot.com",
    messagingSenderId: "401193223106",
    appId: "1:401193223106:web:1eb42d82c026cbae018c5b",
    measurementId: "G-9BY3G20HVG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var srno = 0;

function getBatchSemDisplay() 
{
    selectElement = document.querySelector('#batchdisplay');
    batchdisplay = selectElement.value;
    selectElement = document.querySelector('#yearsemdisplay');
    semdisplay = selectElement.value;
}
function fetchAllCourses()
{
    $("#coursetbody").empty();
    courseList = [];
    srno = 0;
    getBatchSemDisplay();
    if(batchdisplay == "default" || semdisplay == "default")
    {
        window.alert("Select batch and sem then click");
    }
    firebase.database().ref("courses").once("value", function(snapshot){
        snapshot.forEach(function (childSnapshot){
            var course = childSnapshot.val().course;
            var code = childSnapshot.val().code;
            var credits = childSnapshot.val().credits;
            var batch = childSnapshot.val().batch;
            var sem = childSnapshot.val().sem;
            if(batch == batchdisplay && sem == semdisplay)
            {
                addCourseToTable(course, code, credits);
            }
        })
    })
}

var courseList = [];
function addCourseToTable(course, code, credits)
{
    getBatchSemDisplay();
    var tbody = document.getElementById("coursetbody");
    var tr = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    td5.setAttribute("id", "copomatrix");
    courseList.push([course, code, credits]);
    td0.innerHTML = ++srno;
    td1.innerHTML = course;
    td2.innerHTML = code;
    td3.innerHTML = credits;
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    td4.innerHTML = '<button type="button" class="btn btn-primary" id="openCourse" data-bs-toggle="modal" data-bs-target="#myModal" onclick="fillBoxes('+srno+')">Open</button>';
    firebase.database().ref("copos/"+course).once("value",snapshot => {
        if(snapshot.exists()){
            td5.innerHTML += '<button type="button" class="btn btn-primary" id="copomatrix" data-bs-toggle="modal" data-bs-target="#myCopoModal" onclick="fetchAllCopos()">Update matrix</button>';
        }
        else{
            console.log(course+"absent");
            td5.innerHTML += '<button type="button" class="btn btn-primary" id="copomatrix" data-bs-toggle="modal" data-bs-target="#myCopoModal" onclick="fetchAllCopos()">Add matrix</button>';
        }
    })
    tr.appendChild(td4);
    tr.appendChild(td5);
    tbody.appendChild(tr);
}

var course = document.getElementById("course");
var code = document.getElementById("code");
var credits = document.getElementById("credits");
var addbatch = document.getElementById("addbatch");
var addsem = document.getElementById("addsem");


var addCourseBtn = document.getElementById("addCourseBtn");
var updateCourseBtn = document.getElementById("updateCourseBtn");
var deleteCourseBtn = document.getElementById("deleteCourseBtn");

function fillBoxes(index)
{
    getBatchSemDisplay();
    if(batchdisplay == "default" || semdisplay == "default")
    {
        window.alert("Select batch and sem then click");
        course.disabled = true;
        code.disabled = true;
        credits.disabled = true;
    }
    else
    {
        if(index == null)
        {
            course.disabled = false;
            code.disabled = false;
            credits.disabled = false;        
            course.value = "";
            code.value = "";
            credits.value = "";
            addbatch.value = batchdisplay;
            addsem.value = semdisplay;
            course.disabled = false;
            addCourseBtn.style.display = "inline-block";
            updateCourseBtn.style.display = "none";
            deleteCourseBtn.style.display = "none";
        }
        else
        {
            --index;
            course.value = courseList[index][0];
            code.value = courseList[index][1];
            credits.value = courseList[index][2];
            addbatch.value = batchdisplay;
            addsem.value = semdisplay;
            course.disabled = false;
            addCourseBtn.style.display = "none";
            updateCourseBtn.style.display = "inline-block";
            deleteCourseBtn.style.display = "inline-block";
        }
    }
}

function addCourse()
{
    firebase.database().ref("courses/" + course.value).set({
        batch: addbatch.value,
        sem: addsem.value,
        course: course.value,
        code: code.value,
        credits: credits.value
    },
    (error) =>{
        if(error){
            alert("Course was not added, there was problem");
        }
        else{
            alert("Course was added");
            fetchAllCourses();
            $("#myModal").modal('hide');
        }
    });
}

function updateCourse()
{
    firebase.database().ref("courses/" + course.value).update({
        course: course.value,
        batch: addbatch.value,
        sem: addsem.value,
        code: code.value,
        credits: credits.value
    },
    (error) =>{
        if(error){
            alert("Course was not updated, there was problem");
        }
        else{
            alert("Course was updated");
            fetchAllCourses();
            $("#myModal").modal('hide');
        }
    });
}

function deleteCourse()
{
    getBatchSemDisplay();
    firebase.database().ref("courses/" + course.value).remove().then(function(){
        firebase.database().ref("copos/" + course.value).remove().then(function()
        {
            firebase.database().ref("pos/"+batchdisplay+"/"+course.value).remove().then(function()
            {
                alert("Course was deleted");
                fetchAllCourses();
                $("#myModal").modal('hide');
            });
        });
    });
}

function fetchAllCopos()
{
    var table = document.getElementById("coursetable"), rIndex, cIndex;
    //var courseValue;
    for(var p = 1; p < table.rows.length; p++)
    {
        // row cells
            table.rows[p].cells[5].onclick = function()
            {
                rIndex = this.parentElement.rowIndex;
                cIndex = this.cellIndex+1;
                //console.log("Row : "+rIndex+" , Cell : "+cIndex);
                //console.log(table.rows[rIndex].cells[1].innerHTML);
                courseValue = table.rows[rIndex].cells[1].innerHTML;
                console.log(courseValue);
                firebase.database().ref('copos/').once('value', function(snapshot)
                {
                    if(snapshot.child(courseValue).exists())
                    {
                        console.log("true");
                        var copoRef = firebase.database().ref('copos/'+courseValue+"/")
                        copoRef.once('value', function(snapshot)
                        {    
                            snapshot.forEach(
                                function(ChildSnapshot)
                                {
                                    let head = ChildSnapshot.val().head;
                                    let data = ChildSnapshot.val().data;
                                    document.getElementById(head).textContent = data;
                                }
                            )
                        });  
                    }
                    else{
                        console.log("false");
                    }
                })
            };
    }
}

function getRow()
{
    var table = document.getElementById("coursetable"), rIndex, cIndex;
    for(var p = 1; p < table.rows.length; p++)
    {
            table.rows[p].cells[5].onclick = function()
            {
                rIndex = this.parentElement.rowIndex;
                cIndex = this.cellIndex+1;
                courseValue = table.rows[rIndex].cells[1].innerHTML;
            };
    }
}

function addCopoMatrix()
{
    getRow();
    getBatchSemDisplay()
    console.log(courseValue);
    let i = 1, j = 1, k = 1, l=1;
    for(l = 1; l <= 5; l++)
    {
        var val = `CO${l}`;
        var copoRef = firebase.database().ref('copos/'+courseValue+'/'+val);
        var data = document.getElementById(val).textContent;
        copoRef.set({
            head: val,
            data: data,
            batch: batchdisplay,
            sem: semdisplay
        });
    }
    for(i = 1; i <= 5; i++)
    {
        for(j = 1; j <= 12; j++)
        {
            var val = `CO${i}PO${j}`;
            var copoRef = firebase.database().ref('copos/'+courseValue+'/'+val);
            var data = document.getElementById(val).textContent;
            copoRef.set({
                head: val,
                data: data,
                batch: batchdisplay,
                sem: semdisplay
              });
            
        }
        for(k = 1; k <= 3; k++)
        {
            var val = `CO${i}PSO${k}`;
            var copoRef = firebase.database().ref('copos/'+courseValue+'/'+val);
            var data = document.getElementById(val).textContent;
            copoRef.set({
                head: val,
                data: data,
                batch: batchdisplay,
                sem: semdisplay
              });
        }
    }
    alert("Data was submitted");
    fetchAllCopos();
    $("#myCopoModal").modal('hide');
    poCalculation(courseValue);
    fetchAllCourses();
    //document.getElementById("copomatrix").innerHTML = '<button type="button" class="btn btn-primary" id="copomatrix" data-bs-toggle="modal" data-bs-target="#myCopoModal" onclick="fetchAllCopos()">Update matrix</button>';  
}

function poCalculation(courseValue)
{
    for(let i = 1; i <= 12; i++)
    {
        poCal(i, courseValue);
    }
    for(let i = 1; i <=3; i++)
    {
        psoCal(i, courseValue);
    }
}

function poCal(j, courseValue)
{
    let posum = 0, coposum = 0;
    for(let i = 1; i <= 5; i++)
    {
        var val1 = `CO${i}PO${j}`, po = 0, co = 0;
        firebase.database().ref('copos/'+courseValue+'/'+val1).on('value',(snap)=>{
            if(snap.val().data > 0)
            {
                //console.log(snap.val().head);
                po = snap.val().data;
                var val2 = `CO${i}`;
                firebase.database().ref('copos/'+courseValue+'/'+val2).on('value', (snap)=>{
                    console.log(snap.val().data);
                    co = snap.val().data;
                    posum += (po*1) ;
                    coposum += (co*po);
                    
                });
                //console.log((coposum/posum).toFixed(2));
                var val3 = `PO${j}`;
                var copoRef = firebase.database().ref('pos/'+batchdisplay+"/"+courseValue+'/'+val3);
                copoRef.set({
                    head: val3,
                    data: (coposum/posum).toFixed(4),
                    batch: batchdisplay,
                    sem: semdisplay
                });
                }
        });
    }
}

function psoCal(j, courseValue)
{
    let psosum = 0, coposum = 0;
    for(let i = 1; i <= 5; i++)
    {
        var val1 = `CO${i}PSO${j}`, pso = 0, co = 0;
        firebase.database().ref('copos/'+courseValue+'/'+val1).on('value',(snap)=>{
            if(snap.val().data > 0)
            {
                //console.log(snap.val().head);
                pso = snap.val().data;
                var val2 = `CO${i}`;
                firebase.database().ref('copos/'+courseValue+'/'+val2).on('value', (snap)=>{
                    console.log(snap.val().data);
                    co = snap.val().data;
                    psosum += (pso*1) ;
                    coposum += (co*pso);
                    
                });
                //console.log((coposum/posum).toFixed(2));
                var val3 = `PSO${j}`;
                var copoRef = firebase.database().ref('pos/'+batchdisplay+"/"+courseValue+'/'+val3);
                copoRef.set({
                    head: val3,
                    data: (coposum/psosum).toFixed(4),
                    batch: batchdisplay,
                    sem: semdisplay
                });
            }
        });
    }
}