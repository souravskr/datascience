var margin = { top: 150, right: 0, bottom: 30, left: 180 },
  width = 2500 - margin.left - margin.right,
  height = 850 - margin.top - margin.bottom;

var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left + 100},${margin.top - 50})`);

const render = data => {
  // console.log(data);

  const nestedData = d3
    .nest()
    .key(d => d.uuid)
    .entries(data);

  temp = nestedData[0].values;

  temp_1 = temp.filter(function(d, i) {
    if (i > 480 && i < 500) {
      return d;
    }
  });
  console.log(temp_1);

  var groupName = nestedData.map(d => d.key);

  var timeGroup = d3.map(temp_1, d => d.timestamp).keys();
  var weekDayGroup = d3.map(temp_1, d => d.weekday).keys();

  console.log(timeGroup);

  // console.log(nestedData[0].values);

  var x = d3
    .scaleBand()
    .range([0, 300])
    .domain(timeGroup)
    .padding(0.5);

  var xAxis = d3
    .axisTop(x)
    .tickSize(0)
    .tickPadding(1);

  var xAxisG = svg
    .append("g")
    .style("font-size", 20)
    .style("opacity", 0.5)
    // .attr("transform", `translate(0, ${20})`)
    // .call(d3.axisTop(x).tickSize(0))
    .call(xAxis);

  // xAxisG.selectAll(".domain").remove();

  var y = d3
    .scaleBand()
    .range([height, 0])
    .domain(weekDayGroup)
    .padding(0.5);

  svg
    .append("g")
    .style("font-size", 20)
    .style("opacity", 0.5)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain")
    .remove();

  const colorScale = d3
    .scaleSequential(d3.interpolateGreens)
    .domain([0, timeGroup.length]);

  const tip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(d => {
      console.log(d.speed);
      let content = `<div class='house'>Speed: <span style='color:black'>${d.speed} m/s</span></div>`;
      return content;
    });
  svg.call(tip);

  svg
    .selectAll(".hit")
    .data(temp_1, function(d) {
      return d.timestamp + ":" + d.weekday;
    })
    .enter()
    .append("rect")
    .attr("class", "hit")
    .attr("x", function(d) {
      console.log(d.timestamp, d.weekday);
      return x(d.timestamp);
    })
    .attr("y", function(d) {
      return y(d.weekday);
    })
    .attr("width", 50)
    .attr("height", y.bandwidth())
    .attr("rx", 6)
    .attr("ry", 6)
    .style("fill", function(d) {
      return colorScale(d.speed);
    })
    .style("stroke-width", 0.4)
    .style("stroke", "green")
    .style("opacity", 0.8)
    .on("mouseover", tip.show)
    // .on("mousemove", mousemove)
    .on("mouseleave", tip.hide);

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -50)
    .attr("text-anchor", "left")
    .style("font-size", "30px")
    .text("Maximum Speed (Hourly) of Devices ");

  var linear = d3
    .scaleLinear()
    .domain(d3.extent(temp_1, d => d.speed))
    .range(["white", "green"])
    .interpolate(d3.interpolateCubehelix.gamma(1));

  svg
    .append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(0,700)");

  var legendLinear = d3
    .legendColor()
    .shapeWidth(100)
    .cells(10)
    .orient("horizontal")
    .scale(linear);

  svg.select(".legendLinear").call(legendLinear);

  // Add subtitle to graph
  // svg.append("text")
  //     .attr("x", 0)
  //     .attr("y", -20)
  //     .attr("text-anchor", "left")
  //     .style("font-size", "14px")
  //     .style("fill", "grey")
  //     .style("max-width", 40)
  //     .text("A short description of the take-away message of this chart.");

  d3.select("#selectButton")
    .selectAll("myOptions")
    .data(groupName)
    .enter()
    .append("option")
    .text(d => d) // text showed in the menu
    .attr("value", d => d);

  // console.log([nestedData[2]][0].values)

  function update(selectedGroup) {
    var dataFilter = nestedData.filter(d => d.key === selectedGroup);
    var timeGroup = d3.map(dataFilter[0].values, d => d.timestamp).keys();

    console.log(dataFilter[0].values);
    console.log(timeGroup);

    x.domain(timeGroup);
    xAxisG.transition().call(xAxis);

    svg
      .append("g")
      .call(xAxis)
      // .selectAll(".domain")
      .remove();

    svg
      .selectAll(".hit")
      .data(dataFilter[0].values, function(d) {
        return d.timestamp + ":" + d.weekday;
      })
      .attr("class", "hit")
      .transition()
      .duration(1000)
      .attr("x", function(d) {
        return x(d.timestamp);
      })
      .attr("y", function(d) {
        return y(d.weekday);
      })

      .style("fill", function(d) {
        return colorScale(d.speed);
      });

    linear.domain(d3.extent(dataFilter[0].values, d => d.speed));
    // .interpolate(d3.interpolateHcl)

    const max_r = d3.max(dataFilter[0].values, d => d.speed);

    // console.log(dataFilter[0]);
    let count = 0;
    dataFilter[0].values.forEach(function(d, i) {
      count += 1;
      if (d.speed === max_r) {
        console.log(d);
        console.log(count);
      }
    });

    svg.select(".legendLinear").call(legendLinear);
  }

  // update('Device_1')

  d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value");
    // run the updateChart function with this selected option
    update(selectedOption);
  });
};

d3.csv("balancedData.csv").then(data => {
  const parser = d3.timeFormat("%I%p");

  data.forEach(d => {
    d.speed = +d.speed;
    // d.mean = +d.mean;
    d.timestamp = parser(new Date(d.timestamp));
  });
  // console.log(data)
  render(data);
});
