var margin = { top: 20, right: 30, bottom: 0, left: 10 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("cleaned.csv").then(data => {
  const group = d3
    .nest()
    .key(d => d.uuid)
    .entries(data);

  const x = d3
    .scaleTime()
    .domain(
      d3.extent(data, d => {
        return d3.timeParse("%Y-%m-%d")(d.date);
      })
    )
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => +d.speed)])
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

   console.log(group)

  const deviceNames = group.map(d => d.key);

  const color = d3.scaleOrdinal(d3["schemeSet1"]);

  svg.selectAll('.line')
  .data(group)
  .enter()
  .append('path')
  .attr('fill', 'none')
  .attr('stroke', d => color(d.key))
  .attr('d', d=> {
    //   console.log(d.values[0].speed)
      console.log(d3.line()
      .x(d => x(d.date))
      .y(d=> y(+d.speed))
      (d.values))

  })




});
