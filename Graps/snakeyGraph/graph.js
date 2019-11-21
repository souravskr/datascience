var margin = { top: 30, right: 60, bottom: 100, left: 50 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append('text')
.text('Active')
.attr('class', 'dropbtn')
.attr('x', width/2)
.attr('y', height + 50)

var svg_1 = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg_1.append('text')
    .text('Idle')
    .attr('x', width / 2)
    .attr('y', height + 50)

// Color scale used
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Set the sankey diagram properties
var sankey = d3
  .sankey()
  .nodeWidth(5)
  .nodePadding(20)
  .size([width, height]);




// load the data
d3.json("notZeroSpeed.json", function(error, graph) {
  // Constructs a new Sankey generator with the default settings.
  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(0);

  // add in the links
  var link = svg
    .append("g")
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .sort(function(a, b) {
      return b.dy - a.dy;
    });

    link
        .style("stroke-width", function (d) {
            return Math.max(3, d.dy);
        })
        .transition()
        .duration(1000)
        .delay(function (d, i) {
            return i * 50;
        })
        .attr("d", sankey.link())
        .style("stroke", function (d) {
            return (d.color = color(d.source.name));
        });

    link.append("title").text(function (d) {
        return d.source.name + "\n" + "There is " + d.value + " stuff in this node";
    });



  // add in the nodes
  var node = svg
    .append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .call(
      d3
        .drag()
        .subject(function(d) {
          return d;
        })
        .on("start", function() {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove)
    );

  // add the rectangles for the nodes
  node
    .append("rect")
    .attr("height", function(d) {
      return d.dy;
    })
    .attr("width", sankey.nodeWidth())

    // .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
    .style("stroke", function(d) {
      return d3.rgb(d.color).darker(2);
    })
    // Add hover text
    node
        .append("text")
        .transition()
        .duration(1000)
        .delay(function (d, i) {
            return i * 50;
        })
        .attr("x", -6)
        .attr("y", function (d) {
            return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
            return d.name;
        })
        .filter(function (d) {
            return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");


    node
        .append("title")
        .text(function (d) {
            return d.name + "\n" + "There is " + d.value + " stuff in this node";
        });




  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr(
      "transform",
      "translate(" +
        d.x +
        "," +
        (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
        ")"
    );
    sankey.relayout();
    link.attr("d", sankey.link());
  }
});





    d3.json("zeroSpeed.json", function (error, graph) {
        // Constructs a new Sankey generator with the default settings.
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(0);

        // add in the links
        var link = svg_1
            .append("g")
            .selectAll(".link")
            .data(graph.links)
            .enter()
            .append("path")
            .attr("class", "link")
            .sort(function (a, b) {
                return b.dy - a.dy;
            });

        link
            .style("stroke-width", function (d) {
                return Math.max(3, d.dy);
            })
            .transition()
            .duration(1000)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("d", sankey.link())
            .style("stroke", function (d) {
                return (d.color = color(d.source.name));
            });

        link.append("title").text(function (d) {
            return d.source.name + "\n" + "There is " + d.value + " stuff in this node";
        });

        // add in the nodes
        var node = svg_1
            .append("g")
            .selectAll(".node")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .call(
                d3
                    .drag()
                    .subject(function (d) {
                        return d;
                    })
                    .on("start", function () {
                        this.parentNode.appendChild(this);
                    })
                    .on("drag", dragmove)
            );

        // add the rectangles for the nodes
        node
            .append("rect")
            .attr("height", function (d) {
                return d.dy;
            })
            .attr("width", sankey.nodeWidth())

            // .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            })
            // Add hover text
            .append("title")
            .text(function (d) {
                return d.name + "\n" + "There is " + d.value + " stuff in this node";
            });

        // add in the title for the nodes
        node

            .append("text")
            .transition()
            .duration(1000)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("x", -6)
            .attr("y", function (d) {
                return d.dy / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) {
                return d.name;
            })
            .filter(function (d) {
                return d.x < width / 2;
            })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this).attr(
                "transform",
                "translate(" +
                d.x +
                "," +
                (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
                ")"
            );
            sankey.relayout();
            link.attr("d", sankey.link());
        }
    });

