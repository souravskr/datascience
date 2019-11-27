var margin = { top: 150, right: 20, bottom: 30, left: 380 },
  width = 2200 - margin.left - margin.right,
  height = 850 - margin.top - margin.bottom;

var map = L.map("map").setView([47.5827, -52.7927], 13);
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; " + mapLink + " Contributors",
  maxZoom: 18
}).addTo(map);

L.svg().addTo(map);

var svg = d3.select("#map").select("svg");
var g = svg.append("g").attr('width', width)
.attr('height', height);

var colours = d3
  .scaleSequential(d3.interpolateTurbo)
  .domain(d3.range(1, 33, 9));

var linear = d3
  .scaleQuantize()
  .domain([0, 32])
    .range([
        '#CE93D8',
        '#BA68C8',
        '#AB47BC',
        '#9C27B0',
        '#8E24AA',
        '#7B1FA2',
        '#6A1B9A',
        '#4A148C'
    ]);

var legendNew = d3
.select('#legend')
.append('svg')
.attr('width', 400)
.attr('height', 600)

legendNew.append('text')
    .attr('x', 15)
    .attr('y', 35)
    .style('fill', 'grey')
    .style("font-size", "34px")
    .text('Speed (m/s)')


legendNew
  .append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(10,70)")
  ;


var legendLinear = d3
  .legendColor()
  .labelFormat(d3.format(".2f"))
  .shapePadding(10)
  .shapeWidth(30)
  .shapeHeight(30)
  .cells(10)
  .orient("vertical")
  .scale(linear)
  .labelOffset(12);

legendNew
    .selectAll(".legendLinear")
    .style("font-size", "22px")
    .call(legendLinear);

// circleData = [d3.range(0, 31, 1)]
// console.log(circleData[0])

// svg.selectAll('legendCircle')
// .data(circleData[0])
// .enter()
// .append('circle')
// .attr('r', (d, i) => d + 10 )
// .attr("cx", function (d, i) { return i * 50 + 200 })
// .attr("cy", 100)
// .attr('fill', (d, i) => linear(d))

const render = data => {
  // console.log(d3.range(1, 33, 9))

  const nestedDevice = d3
    .nest()
    .key(d => d.uuid)
    .entries(data);

  const deviceGroup = nestedDevice.map(d => d.key);

  const nestedWeek = d3
    .nest()
    .key(d => d.weekday)
    .entries(data);

  var days = nestedWeek.map(d => d.key);

  var days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  //   console.log(nestedDevice[0].values);

  //   console.log(deviceGroup);
  d3.select("#selectButton")
    .selectAll("myOptions")
    .data(deviceGroup)
    .enter()
    .append("option")
    .text(d => d) // text showed in the menu
    .attr("value", d => d);

  d3.select("#selectWeek")
    .selectAll("myOption")
    .data(days)
    .enter()
    .append("option")
    .text(d => d) // text showed in the menu
    .attr("value", d => d);

  function filterDevice(selectedDevice, seletedDay) {
    var dataFilter = nestedDevice.filter(d => d.key === selectedDevice);
    var week = d3
      .nest()
      .key(d => d.weekday)
      .entries(dataFilter[0].values);

    var dayFilter = week.filter(d => d.key === seletedDay);

    console.log(dayFilter[0].values);

    // console.log(dataFilter)

    svg.selectAll(".myCircles").remove();

    var circle = g
      .selectAll(".myCircles")
      .data(dayFilter[0].values)
      .enter()
      .append("circle")
      .attr("class", "myCircles")
      .attr("cx", d => map.latLngToLayerPoint([d.latitude, d.longitude]).x)
      .attr("cy", d => map.latLngToLayerPoint([d.latitude, d.longitude]).y)
      .attr("r", d => d.speed + 10)
      .style("fill", d => linear(d.speed))
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .attr("fill-opacity", 0.6);

    circle
      .append("title")
      .attr("class", "text")
      .text(d => d.speed);


    function update() {
      d3.selectAll("circle")
        .attr("cx", d => map.latLngToLayerPoint([d.latitude, d.longitude]).x)
        .attr("cy", d => map.latLngToLayerPoint([d.latitude, d.longitude]).y);

    }

    map.on("moveend", update);

    // console.log(dataFilter)
  }

  filterDevice("Device_1", "Monday");

  d3.select("#selectWeek").on("change", function onchange() {
    // recover the option that has been chosen
    var selectedName = d3.select("#selectButton").property("value");
    var selectedDay = d3.select("#selectWeek").property("value");
    // run the updateChart function with this selected option
    filterDevice(selectedName, selectedDay);
  });

  window.onerror = function() {
    alert(`No Travel History On This Day!`);
    return true;
  };
};

d3.csv("balancedData.csv").then(data => {
  data.forEach(d => {
    d.latitude = +d.latitude;
    d.longitude = +d.longitude;
    d.speed = +d.speed;
  });

  render(data);
});
