/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */


var margin = {
  left: 100,
  right: 10,
  bottom: 100,
  top: 10
};

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;

var t = d3.transition().duration(750);

var data = d3.json('data/revenues.json').then((data) => {
  console.log(data);

  data.forEach(d => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });


  var svg = d3.select('#chart-area')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  var g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var x = d3.scaleBand()

    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);



  var xAxisGroup = g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`);



  var yAxisGroup = g.append('g')
    .attr("class", "y-axis");

  var y = d3.scaleLinear()

    .range([height, 0]);

  g.append("text")
    .attr("class", "x-axis-label")
    .attr("cx", width / 2)
    .attr("cy", height + 80)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Months");


  var yLabel = g.append("text")
    .attr("class", "y-axis-label")
    .attr("xy", -(height / 2))
    .attr("cy", -80)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")




  d3.interval(() => {
    var newData = flag ? data : data.slice(1);
    update(newData);
    flag = !flag;
  }, 1000);

  update(data); 

  function update(data) {
    var value = flag ? "revenue" : "profit";
    console.log(value)
    x.domain(data.map(d => d.month));
    y.domain([0, d3.max(data, d => d[value])]);

    var xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall)

    var yAxisCall = d3.axisLeft(y)
      .tickFormat((d) => "$ " + d);
    yAxisGroup.transition(t).call(yAxisCall)


    // Join new data with old elements
    var rects = g.selectAll('circle')
      .data(data, (d) => d.month);

    // EXIT
    rects.exit()
      .attr("fill", "red")
    .transition(t)
      .attr("cy", y(0))
      .remove();

    // UPDATE
    // rects.transition(t)
    //   .attr('x', (d) => x(d.month))
    //   .attr('y', (d) => y(d[value]))
    //   .attr('width', x.bandwidth)
    //   .attr('height', (d) => height - y(d[value]))

    // Enter
    rects.enter()
      .append('circle')
      .attr('cx', (d) => x(d.month) + x.bandwidth() / 2)
      .attr('cy', (d) => y(0))
      .attr('r', 10)
      .attr('fill', 'grey')
      .attr('fill-opacity', 0)
      .merge(rects)
       // APLLY AFTER MERGE - APPLY FOR ENTER AND UPDATE SELECTORS
      .transition(t)
        .attr('cx', (d) => x(d.month) + x.bandwidth() / 2)
        .attr('cy', (d) => y(d[value]))
        .attr('r', 10)
        .attr('fill-opacity', 1)  
  }

  var label = flag ? "Revenue" : "Profit";
  yLabel.text(label);

});