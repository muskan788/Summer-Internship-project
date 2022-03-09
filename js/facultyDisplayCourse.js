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

  var courses = firebase.database().ref('courses');

function getBatchSemOption() {
    selectElement = document.querySelector('#batch');
    batch = selectElement.value;
    selectElement = document.querySelector('#yearsem');
    sem = selectElement.value;
    console.log(batch,sem);
}

function fetchCoursesDropdown()
{
    messagesRef.once('value', function(snapshot)
    {
        snapshot.forEach(
            function(ChildSnapshot)
            {
                let course = ChildSnapshot.val().course;
                console.log(course);
                addCoursestoOptions(course);
            }
        )
    })   
}

function addItemstoList(course, code, credits)
{
    var ul = document.getElementById("courselist");
    var dcourse = document.createElement('li');
    var dcode = document.createElement('li');
    var dcredits = document.createElement('li');
    var li = document.createElement('li');
    var copobut = document.createElement('button');
    copobut.setAttribute("id", "copobut");
    var del = document.createElement('button');
    del.setAttribute("id", "del");
    var br = document.createElement('br');
    dcourse.innerHTML = course;
    dcode.innerHTML = code;
    dcredits.innerHTML = credits;
    copobut.innerHTML = "CO-PO Table";
    del.innerHTML = "Delete";
    li.appendChild(copobut);
    li.appendChild(del);
    ul.appendChild(dcourse);
    ul.appendChild(dcode);
    ul.appendChild(dcredits);
    ul.appendChild(li);
    ul.appendChild(br);
    document.getElementById("copobut").onclick = function(){showTable()};
    document.getElementById("del").onclick = function() {hideTable()};
}

function displayCourse()
{
    $('p').empty();
    selectElement = document.querySelector('#batch');
    batch = selectElement.value;
    selectElement = document.querySelector('#yearsem');
    sem = selectElement.value;
    courses.once('value', function(snapshot)
    {
        snapshot.forEach(
            function(ChildSnapshot)
            {
                if(ChildSnapshot.val().batch == batch && ChildSnapshot.val().sem == sem)
                {
                    let course = ChildSnapshot.val().course;
                    let code = ChildSnapshot.val().code;
                    let credits = ChildSnapshot.val().credits;
                    addItemstoList(course, code, credits);
                }
            }
        )
    });
}

function saveCopos()
{
    let i = 1, j = 1, k = 1, l=1;
    for(l = 1; l <= 5; l++)
    {
        var val = `CO${l}`;
        var copoRef = firebase.database().ref('copos/abc/'+val);
        var data = document.getElementById(val).textContent;
        copoRef.set({
            head: val,
            data: data
        });
    }
    for(i = 1; i <= 5; i++)
    {
        for(j = 1; j <= 12; j++)
        {
            var val = `CO${i}PO${j}`;
            var copoRef = firebase.database().ref('copos/abc/'+val);
            var data = document.getElementById(val).textContent;
            copoRef.set({
                head: val,
                data: data
              });
            
        }
        for(k = 1; k <= 3; k++)
        {
            var val = `CO${i}PSO${k}`;
            var copoRef = firebase.database().ref('copos/abc/'+val);
            var data = document.getElementById(val).textContent;
            copoRef.set({
                head: val,
                data: data
              });
        }
    }
}

function fetchAllCopos()
{
    var copoRef = firebase.database().ref('copos/abc')
    copoRef.once('value', function(snapshot)
    {
        snapshot.forEach(
            function(ChildSnapshot)
            {
                let head = ChildSnapshot.val().head;
                let data = ChildSnapshot.val().data;
                //console.log(head, data);
                document.getElementById(head).textContent = data;
            }
        )
    });
    getBatchSemOption();
    var copoRef = firebase.database().ref('courses')
    copoRef.once('value', function(snapshot)
    {
        snapshot.forEach(
            function(ChildSnapshot)
            {
                let batch = ChildSnapshot.val().batch;
                let course = ChildSnapshot.val().course;
                console.log(batch, course);
            }
        )
    })     
}
window.onload = fetchAllCopos;

function poCalculation()
{
    for(let i = 1; i <= 12; i++)
    {
        poCal(i);
    }
}

function poCal(j)
{
    let posum = 0, coposum = 0;
    for(let i = 1; i <= 5; i++)
    {
        var val1 = `CO${i}PO${j}`, po = 0, co = 0;
        firebase.database().ref('copos/abc/'+val1).on('value',(snap)=>{
            if(snap.val().data > 0)
            {
                console.log(snap.val().head);
                po = snap.val().data;
                var val2 = `CO${i}`;
                firebase.database().ref('copos/abc/'+val2).on('value', (snap)=>{
                    console.log(snap.val().data);
                    co = snap.val().data;
                    posum += (po*1) ;
                    coposum += (co*po);
                    
                });
                console.log((coposum/posum).toFixed(2));
                var val3 = `PO${j}`;
                var copoRef = firebase.database().ref('pos/abc/'+val3);
                copoRef.set({
                    head: val3,
                    data: (coposum/posum).toFixed(4)
                });
                }
        });
    }
      /*firebase.database().ref('copos/abc/CO1').on('value',(snap)=>{
        console.log(snap.val().head);
        console.log(snap.val().data);
      });*/
}

function showTable(){
    document.getElementById('copotable').style.display = "block";
}

function hideTable(){
    document.getElementById('copotable').style.display = "none";
}