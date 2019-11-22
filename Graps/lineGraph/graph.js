const svg = d3.select(".line");
const svg_1 = d3.select(".area");
const width = 960;
const height = 500;
const margin = { top: 60, right: 50, bottom: 88, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// var margin_1 = { top: 30, right: 60, bottom: 90, left: 250 },
//     width_1 = 1560 - margin_1.left - margin_1.right,
//     height_1 = 900 - margin_1.top - margin_1.bottom;



// var svg_3 = d3
//     .select("#my_dataviz")
//     .append("svg")
//     .attr("width", width_1 + margin_1.left + margin_1.right)
//     .attr("height", height_1 + margin_1.top + margin_1.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin_1.left + "," + margin_1.top + ")");



const render = data => {
  const title = "Activities of the Devices";

  const xValue = d => d.timestamp;
  const xAxisLabel = "Time";

  const yValue = d => d.speed;
  // const circleRadius = 6;
  const yAxisLabel = "Speed (m/s)";

  const colorValue = d => d.uuid;

 

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
      .nice(7);

    // const x = d3
    //     .scaleLinear()
    //     .domain(d3.extent(data, d => d.speed))
    //     .range([0, width]);


  var yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
      .nice();

    // var y = d3
    //     .scaleLinear()
    //     .range([height, 0])
    //     .domain([0, 0.4])
    //     .nice();




  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const g_1 = svg_1
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top - 50})`);

    // const g_2 = svg_3
    //     .append("g")
    //     .attr("transform", `translate(${margin.left},${margin.top - 50})`);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);

  var yAxis = d3
    .axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

    // const x_Axis = d3
    //     .axisBottom(x)
    //     .tickSize(-innerHeight)
    //     .tickPadding(15);

    // const y_Axis = d3
    //     .axisLeft(y)
    //     .tickSize(-innerWidth)
    //     .tickPadding(10);




  var yAxisG = g.append("g").call(yAxis);
  yAxisG.selectAll(".domain").remove();

  var yAxisG_1 = g_1.append("g").call(yAxis);
  yAxisG.selectAll(".domain").remove();

    // var y_AxisG = g_2.append("g").call(y_Axis);
    // y_AxisG.selectAll(".domain").remove();




  yAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -60)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yAxisLabel);

  yAxisG_1
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -60)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yAxisLabel);


    // y_AxisG
    //     .append("text")
    //     .attr("class", "axis-label")
    //     .attr("y", -60)
    //     .attr("x", -innerHeight / 2)
    //     .attr("fill", "black")
    //     .attr("transform", `rotate(-90)`)
    //     .attr("text-anchor", "middle")
    //     .text(yAxisLabel);





  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  const xAxisG_1 = g_1
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

    // const x_AxisG = g
    //     .append("g")
    //     .call(x_Axis)
    //     .attr("transform", `translate(0,${innerHeight})`);




  xAxisG.select(".domain").remove();

  xAxisG_1.select(".domain").remove();

    // x_AxisG.select(".domain").remove();



  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 80)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xAxisLabel);

  xAxisG_1
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 80)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xAxisLabel);

    // x_AxisG
    //     .append("text")
    //     .attr("class", "axis-label")
    //     .attr("y", 80)
    //     .attr("x", innerWidth / 2)
    //     .attr("fill", "black")
    //     .text(xAxisLabel);




  const lineGenerator = d3
    .line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(d3.curveBasis);

  const areaGenerator = d3
    .area()
    // .interpolate("monotone")
    .y1(d => yScale(yValue(d)))
    .y0(innerHeight)
    .x(d => xScale(xValue(d)))
    .curve(d3.curveBasis);

  const lastYValue = d => yValue(d.values[d.values.length - 1]);

  const nestedData = d3
    .nest()
    .key(colorValue)
    .entries(data);
  // .sort((a, b) => d3.ascending(lastYValue(a), lastYValue(b)))

  groupName = nestedData.map(d => d.key);

  // colorScale.domain(nestedData.map(d => d.key));
  // var myColor = d3.scaleOrdinal()
  //     .domain(groupName)
  //     .range(d3.schemeSet2);

  //  console.log(groupName)

  d3.select("#selectButton")
    .selectAll("myOptions")
    .data(groupName)
    .enter()
    .append("option")
    .text(d => d) // text showed in the menu
    .attr("value", d => d);

  //     var dataFilter = data.map(function (d) { return { date: d.date, value: d['Device_1'] } })
  // console.log(nestedData)

  g.selectAll(".line-path")
    .data([nestedData[0]])
    .enter()
    .append("path")
    .attr("class", "line-path")
    .attr("d", d => lineGenerator(d.values))
    .attr("stroke", d => colorScale(d.key));

  g.append("text")
    .attr("class", "title")
    .attr("y", -10)
    .attr("x", innerWidth / 2 - 130)
    .text(title);

  g_1
    .append("path")
    .attr("class", "areas")
    .attr("d", areaGenerator(nestedData[0].values))
    .attr("fill", colorScale(nestedData[0].key));

  g_1
    .append("text")
    .attr("class", "title")
    .attr("y", -10);

  function update(selectedGroup) {
    // Create new data with the selection?
    var dataFilter = nestedData.filter(d => d.key === selectedGroup);
    // console.log(dataFilter)

    yScale.domain(d3.extent(dataFilter[0].values, yValue)).nice();
    // yAxis.d3.axisLeft(ex)
    yAxisG
      .transition()
      // .duration(1000)
      .call(yAxis);
    // yAxisG.selectAll('.domain').remove();
    yAxisG_1
      .transition()
      // .duration(1000)
      .call(yAxis);

    // console.log(yScale.domain())

    g.append("g").call(yScale);

    // Give these new data to update line
    g.selectAll(".line-path")
      .data(dataFilter)
      // .enter()
      // .append('path')
      .transition()
      .duration(1000)
      .attr("class", "line-path")
      .attr("d", d => lineGenerator(d.values))
      .attr("stroke", d => colorScale(d.key));

    g.append("text")
      .attr("class", "title")
      .attr("y", -10);
    // .text(title);

    g_1
      .selectAll("path")
      // .attr('class', 'areas')
      .transition()
      .duration(1000)
      .attr("d", areaGenerator(dataFilter[0].values))
      .attr("fill", colorScale(dataFilter[0].key))
      .attr("stroke", colorScale(dataFilter[0].key));

    g_1
      .append("text")
      .attr("class", "title")
      .attr("y", -10);
    // .text(title);
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value");
    // run the updateChart function with this selected option
    update(selectedOption);
  });
};

d3.csv("cleaned.csv").then(data => {
  data.forEach(d => {
    d.speed = +d.speed;
    d.timestamp = new Date(d.timestamp);
  });
  // console.log(data)
  render(data);
});

// uuid, latitude, longitude, altitude, speed, timestamp, time, weekday, date, location
