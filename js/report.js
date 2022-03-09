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

function getBatch() {
    selectElement = document.querySelector('#batch');
    getbatch = selectElement.value;
}

var cnt, poCourse;
function fetchCourses()
{
    $("#coursepotbody").empty();
    $("#coursepotfoot").empty();
    $("#myCanvas").empty();
    dataList = [];
    getBatch();
    firebase.database().ref("pos/"+getbatch).on('value', function(snapshot){
        snapshot.forEach(function(data) {
            //console.log(data.key);
            firebase.database().ref("courses").once("value", function(snapshot){
                snapshot.forEach(function (childSnapshot){
                    var batch = childSnapshot.val().batch;
                    var course = childSnapshot.val().course;
                    if(batch == getbatch && course == data.key)
                    {
                       fetchAllPos(getbatch, data.key);
                    }
                })
            })  
        })
    calAvg();
    }); 
}

function fetchAllPos(getbatch, course)
{
    var tbody = document.getElementById("coursepotbody");
    var tr = document.createElement('tr');
    var td0 = document.createElement('td');
    td0.innerHTML = course;
    tr.appendChild(td0);
    for(var i = 1; i <= 12; i++)
    {
        var td1 = document.createElement('td');
        var val1 = `PO${i}`;
        firebase.database().ref('pos/'+getbatch+"/"+course+'/'+val1).on('value', (snap)=>{
            if(snap.exists())
            {
                td1.innerHTML = snap.val().data;
                tr.appendChild(td1);
            }
            else    
            { 
                td1.innerHTML = 0;
                tr.appendChild(td1);
            }
        });
    }
    for(var i = 1; i <= 3; i++)
    {
        var td1 = document.createElement('td');
        var val2 = `PSO${i}`;
        firebase.database().ref('pos/'+getbatch+"/"+course+'/'+val2).on('value', (snap)=>{
            if(snap.exists())
            {
                td1.innerHTML = snap.val().data;
                tr.appendChild(td1);
            }
            else    
            {
                td1.innerHTML = 0;
                tr.appendChild(td1);
            }
        });
    }
    tbody.appendChild(tr);
}

function calAvg()
{
    var tfoot = document.getElementById("coursepotfoot");
    var tr = document.createElement('tr');
    var td0 = document.createElement('td');
    td0.innerHTML = "Final PO Attainment";
    tr.appendChild(td0);
    tfoot.appendChild(tr);
    for(let i = 1; i <= 12; i++)
    {
        calPoAvg(i, tfoot, tr);
        
    }
    for(let i = 1; i <=3; i++)
    {
        calPsoAvg(i, tfoot, tr);
    }
}

var dataList = [];
function calPoAvg(j, tfoot, tr)
{
    getBatch();
    //console.log(getbatch);
    var val1 = `PO${j}`;
    var po = 0, posum = 0;
    firebase.database().ref("pos/"+getbatch).on('value', function(snapshot){
        snapshot.forEach(function(data) {
            poCourse = data.key;
            firebase.database().ref("pos/"+getbatch+"/"+poCourse+"/"+val1).on('value', (snap)=>{
                if(snap.exists())
                {
                    console.log(snap.val().data);
                    posum += (snap.val().data * 1);
                    po++;
                }
                else    
                {
                    //console.log("0"); 
                }
            }); 
        });  
    });
    //console.log(posum/po);
    if((posum/po).toFixed(4) > 0)
        dataList.push(((posum/po).toFixed(4)*100)/3);
    else
        dataList.push(0);
    firebase.database().ref('Average/'+getbatch+"/"+val1).set({
        head: val1,
        data: (posum/po).toFixed(4)
    });
    var td1 = document.createElement('td');
    if((posum/po).toFixed(4) > 0)
        td1.innerHTML = (posum/po).toFixed(4);
    else
        td1.innerHTML = 0;
    tr.appendChild(td1);
    tfoot.appendChild(tr);
}

function calPsoAvg(j, tfoot, tr)
{
    getBatch();
    var val2= `PSO${j}`;
    var pso = 0, psosum = 0;
    firebase.database().ref("pos/"+getbatch).on('value', function(snapshot){
        snapshot.forEach(function(data) {
            poCourse = data.key;
            firebase.database().ref("pos/"+getbatch+"/"+poCourse+"/"+val2).on('value', (snap)=>{
                if(snap.exists())
                {
                    //console.log(snap.val().data);
                    psosum += (snap.val().data * 1);
                    pso++;
                }
                else    
                {
                    //console.log("0"); 
                }
            }); 
        });
    });
    //console.log(psosum/pso);
    if((psosum/pso).toFixed(4) > 0)
        dataList.push(((psosum/pso).toFixed(4)*100)/3);
    else
        dataList.push(0);
    firebase.database().ref('Average/'+getbatch+"/"+val2).set({
        head: val2,
        data: (psosum/pso).toFixed(4)
    });
    var td1 = document.createElement('td');
    if((psosum/pso).toFixed(4) > 0)
        td1.innerHTML = (psosum/pso).toFixed(4);
    else
        td1.innerHTML = 0;
    tr.appendChild(td1);
    tfoot.appendChild(tr);
    barGraph(dataList);
}
//window.onload = fetchCourses;

function barGraph(dataList)
{
    getBatch();
    const ctx = document.getElementById("myCanvas").getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["PO1", "PO2", "PO3", "PO4", "PO5", "PO6", "PO7", "PO8", 
        "PO9", "PO10", "PO11", "PO12", "PSO1", "PSO2", "PSO3"],
        datasets: [{
          label: 'PO Attainment(%)',
          backgroundColor: 'rgba(161, 198, 247, 1)',
          borderColor: 'rgb(47, 128, 237)',
          data: dataList,
        }]
      },
      options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                display: true,
                labelString: 'Batch '+getbatch
                }
              }],
          yAxes: [{
            max: 5,
            min: 0,
            ticks: {
                stepSize: 20
            },
            scaleLabel: {
            display: true,
            labelString: 'PO Attainment Percentage(%)'
            }
          }],
          
        }
      },
    });
    //myChart.destroy();
}
