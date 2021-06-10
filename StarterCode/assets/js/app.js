// @TODO: YOUR CODE HERE!

// Stablish Width and Height of the SVG
let svgWidth = 960;
let svgHeight = 500;

// svg margins
let margin = {
    top: 20,
    bottom: 40,
    right: 80,
    left: 100
};

// Create height and width for chart group
let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.right - margin.left;

// Append SVG element
let svg = d3
.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

// Append SVG Group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv('data.csv').then(successHandle, errorHandle);

// Read csv file with error handling to reflect it in the console
function errorHandle(error) {
    throw err;
}
    
function successHandle(healthData) {
            
   // Convert the info to numbers
    healthData.forEach(d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    // Create scaling Functions
    let xLinearScale = d3.scaleLinear()
        .domain([7,d3.max(healthData, d => d.poverty)])
        .range([0,width]);
        
    let yLinearScale = d3.scaleLinear()
        .domain([3,d3.max(healthData, d => d.healthcare)])
        .range([height,0]);

    //Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale)

    let leftAxis = d3.axisLeft(yLinearScale)
       
  
    //Append bottom axis to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
	.call(bottomAxis);
	
	
    // Append left axis to  chart
    chartGroup.append("g")
        .call(leftAxis);

    //Create circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill","blue")
        .attr("opacity", "0.5");

    //Append text to circles
    let circlesGroup1 = chartGroup.selectAll()
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));

    //Run toolTip
    let toolTip = d3.tip()
        .attr("class","tooltip")
        .offset([80,-60])
        .html(function(d) {
        return (`${d.state} <br> Poverty: ${d.poverty}% <br> Lacks Healthcare: ${d.healthcare}%`);
        });
    
    //Get toolTip
    chartGroup.call(toolTip);

    //Event listensers to display and hide the tooltip
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data,this);
    }).on("mouseout", function(data){
            toolTip.hide(data);
        });

    //Create axes label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

}
