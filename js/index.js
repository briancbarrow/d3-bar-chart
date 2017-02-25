$('document').ready(function() {
  var jsonURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  //var data = '';
  
var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  $.getJSON(jsonURL, function(reqData) {
    var data = reqData.data;

    //console.log(data);

    var height = 500,
      width = 1000,
      padding = 50;
    
    var rectWidth = Math.ceil( (width - padding) / data.length)
    
    $('#viz-wrapper').css('width', width + 50)

    var xDomain = d3.extent(data, function(point) {
      console.log(point);
      return point[0];
    });
    
    
    
    minDate = new Date(xDomain[0]);
    maxDate = new Date(xDomain[1]);
    
    var yDomain = d3.extent(data, function(point) {
      return point[1];
    });
    
    //Setting up tooltip div
    var div = d3.select("body").append('div')
    .attr("class", "tooltip")
    .style("opacity", "0");
    
    
    

    var viz = d3.select('#viz-wrapper')
      .append('svg')
      .attr('id', 'main-svg')
      .attr('height', height + padding)
      .attr('width', width);

    var xScale = d3.time.scale()
      .domain([minDate, maxDate])
      //.rangeRoundBands([padding, width - padding]);
      .range([padding, width - padding]);
   // console.log(xDomain);
    
    var ordinalXScale = d3.scale.ordinal()
    .domain(d3.map(data, function(d) { 
      var rDate = new Date(d[0])
      return rDate; }))
    .rangeBands([0, 10], 0.1);

    var yScale = d3.scale.linear()
      .domain(yDomain).nice()
      .range([height - padding, padding]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(15)
      .orient('bottom')
      //.tickFormat(d3.time.format("%m-%Y"));

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

    viz.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);

    viz.append("g")
      .attr("class", "xaxis axis") // two classes, one for css formatting, one for selection below
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".855em")
      .attr("transform", "rotate(-45)" );

    //console.log(ordinalXScale.rangeBand());
    
    
var bars = viz.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", "#0071bc")
      .attr("class", function(d){ return d[0]})
      .attr("x", function(d) { return xScale(new Date(d[0])); })
      //.attr("stroke-width", 0.1)
      //.attr("stroke", '#fff')
      .attr("width", rectWidth)
      //.attr("width", ordinalXScale.rangeBand()/20)
      .attr("y", function(d) { return yScale(d[1]); })
      .attr("height", function(d) { return height - padding - yScale(d[1]); });

    bars.on("mouseover", function(d){
      var date = new Date(d[0]);
      d3.select(this)
        .style('fill', '#00ff00')
      
      
      div.transition()
        .duration(200)
      div.html('<p class="tool-text"><b class="dollars">' + d[1].toLocaleString('en-US', { style: 'currency', currency: 'USD' }) +' Billion</b></p> <p class="tool-text">' + date.getFullYear() + ' - ' + month[date.getMonth()] + '</p>')
      .style("opacity", "0.9")
      .style("left", (d3.event.pageX + 20) + "px")
      .style("top", (d3.event.pageY - 50) + "px");
    });
    
    bars.on('mouseout', function(d){
      d3.select(this)
        .style('fill', '#0071bc')
      div.transition()
        .duration(500)
      div.html("")
        .style("opacity", "0");
    });
    
    //Set up description paragraph at bottom of graph
    var desc = d3.select('#viz-wrapper').append('div')
    .html("<p>" + reqData.description +"</p>")
    .style("margin-top", "-40px")
    .style("padding-bottom", "10px")
    .attr("class", "description");
    
    var sideNote = viz.append('text')
    .attr("class", "sidenote")
    .attr("transform", "translate("+ (padding * 1.4) +","+(height/2.4)+")rotate(-90)")
    .text("Gross Domestic Product, USA")
    
  });
});