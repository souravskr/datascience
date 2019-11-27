var margin = { top: 150, right: 0, bottom: 30, left: 180 },
    width = 2500 - margin.left - margin.right,
    height = 850 - margin.top - margin.bottom;



var map = L.map('map').setView([47.5827, -52.7927], 13);
mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18, 
    // layers: [cloudmade]
}).addTo(map);





map._initPathRoot() 

var svg = d3.select("#map").select("svg"),
    g = svg.append("g");

d3.csv("balancedData.csv", function (collection) {

    collection.forEach(function (d) {

        d.LatLng = new L.LatLng(+d.latitude,
            +d.longitude)
        d.speed = +d.speed;

        // console.log(d.LatLng)
    })
    console.log(collection)

    var color = ['#4ECDC4', '#FF6B6B', '#1B065E', '#5C2751', '#FFBF46']

    const nestedDevice = d3
        .nest()
        .key(d => d.uuid)
        .entries(collection);

        const nestedWeek = d3.nest()
        .key (d=> d.weekday)
        .entries(collection)


    var groupDevice = nestedDevice.map(d => d.key);
    var groupWeek = nestedWeek.map(d => d.key)


    // d3.select("#selectButton")
    //     .selectAll("myOptions")
    //     .data(groupDevice)
    //     .enter()
    //     .append("option")
    //     .text(d => d) // text showed in the menu
    //     .attr("value", d => d);

    d3.select ('#weekDay')
        .selectAll("myOptions")
        .data(groupWeek)
        .enter()
        .append("option")
        .text(d => d) // text showed in the menu
        .attr("value", d => d);

    // console.log([nestedDevice[0]][0].values[0].weekday)
    console.log(nestedDevice.values)

    var colours = d3
        .scale.linear()
        .domain(d3.range(1, 10, 1))
        .range([
            "#87cefa",
            "#86c6ef",
            "#85bde4",
            "#83b7d9",
            "#82afce",
            "#80a6c2",
            "#7e9fb8",
            "#7995aa",
            "#758b9e",
            "#708090"
        ]);


 
    d3.select("#selectButton").on("change", function onchange() {
        // recover the option that has been chosen
        var selectedName = parseInt(d3.select('#selectButton').property("value"));
        // var selectedDay = d3.select('#weekDay').property("value")
        // run the updateChart function with this selected option
        // updateData(selectedName, selectedDay);
        console.log(typeof(selectedName))



        var feature = g.selectAll(".circle")
            .data(nestedDevice[selectedName].values)
            .enter().append("circle")
            .attr('class', 'circle')
            .style("stroke", "black")
            .style("opacity", .5)
            .style("fill", function (d){
                return colours (d.speed)
            })
            .attr("r", 10)

        feature.append('title')
            .attr('class', 'text')
            .text(function (d) {
                // console.log(d.speed)
                return d.speed;
            })

        map.on("viewreset", update);
        update();

        function update() {
            feature.attr("transform",
                function (d) {
                    return "translate(" +
                        map.latLngToLayerPoint(d.LatLng).x + "," +
                        map.latLngToLayerPoint(d.LatLng).y + ")";
                }
            )
        }


        feature.selectAll(".circle").remove()

    });

   







    
//     console.log(map.on("viewreset", update))


// function updateData(device, weekdays) {

   


//     var dataFilter = nestedDevice.filter(d => d.key === device);
//     // console.log(dataFilter)

//     const nestedDataFilter = d3
//         .nest()
//         .key(d => d.weekday)
//         .entries([dataFilter[0].values][0]);


//         // console.log(nestedDataFilter)

//         var weekFilter = nestedDataFilter.filter(d=> d.key === weekdays)

//         console.log(weekFilter[0].values)


//     g
//         .selectAll('.circle')
//         .data(weekFilter[0].values)
//         .attr('class', 'circle')
//         .transition()
//         .duration(1000)
//         .style("stroke", "black")
//         .style("opacity", .3)
//         .style("fill", "red")
//         .attr("r", 20)



//     map._initPathRoot() 
//     map.on("viewreset", update);
//     // update();

//     // console.log(map.on("viewreset", update))

//     // function update() {
//     //     feature.attr("transform",
//     //         function (d) {
//     //             return "translate(" +
//     //                 map.latLngToLayerPoint(d.LatLng).x + "," +
//     //                 map.latLngToLayerPoint(d.LatLng).y + ")";
//     //         }
//     //     )
//     // }

//     console.log(map.on("viewreset", update))


// }



//     // updateData('Device_1', 'Saturday')

//     d3.select("#weekDay").on("change", function onchange () {
//         // recover the option that has been chosen
//         var selectedName = d3.select('#selectButton').property("value");
//         var selectedDay = d3.select('#weekDay').property("value")
//         // run the updateChart function with this selected option
//         updateData(selectedName, selectedDay);
//     });
    








})