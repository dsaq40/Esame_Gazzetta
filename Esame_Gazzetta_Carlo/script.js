/*const svgDOM = document.querySelector('#barchart')
const svgWidth = svgDOM.getAttribute('width')
const svgHeight = svgDOM.getAttribute('height')
const svgPadding = 20*/
var div = d3.select("#my_dataviz")
var margin = {top: 30, right: 30, bottom: 40, left: 60},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
//const svg = d3.select('#barchart')
/*idea bocciata poichè mancano sia i dati del soy sia del tofu
var allVegFoods = ["Soymilk", "Tofu"]
var allNVegFoods = ["Milk" , "Beef (beef herd)"]

var myColor = d3.scaleOrdinal()
.domain(allVegFoods)
.range(d3.schemeSet2);
*/
const data = d3.csvParse(dataset, d => {
    return {
        food_name: d["Food product"],
        land_use : d["Land use change"],
        animal_feed: d["Animal Feed"],
        farm : d.Farm,
        processing : d.Processing,
        transport: d.Transport,
        packaging: d.Packging,
        retail: d.Retail,
        total_emission : d.Total_emissions,
        freshwater_kcal : d["Freshwater withdrawals per 1000kcal (liters per 1000kcal)"],
        greenhouse_kcal : d["Greenhouse gas emissions per 1000kcal (kgCO₂eq per 1000kcal)"],
        land_use_kcal : d["Land use per 1000kcal (m² per 1000kcal)"] 
    }
})
new_data = data.filter(d => d.food_name == "Beef (beef herd)" || d.food_name == "Beef (dairy herd)")
// List of subgroups = header of the csv files = food name here
var subgroups = [//"land_use", "animal_feed", "farm", "processing", "transport",
//"packaging", "retail", "total_emission", 
"freshwater_kcal","greenhouse_kcal", "land_use_kcal"]

var groups = ["Beef (beef herd)", "Beef (dairy herd)"]
var alt = ["Lamb & Mutton", "Pig Meat", "Poultry"]

var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSize(0));

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 1000])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

var y2 = d3.scaleLinear()
  .domain([0, 200])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisRight(y2));



var xSubgroup = d3.scaleBand()
.domain(subgroups)
.range([0, x.bandwidth()])
.padding([0.05])
// color palette = one color per subgroup
var color = d3.scaleOrdinal()
.domain(subgroups)
.range(['#e41a1c','#377eb8','#4daf4a'])

svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(new_data)
    .enter()
    .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.food_name) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });

//
var legend = svg.selectAll(".legend")
.data(["litri per 1000 kcal","gas serra emessi per 1000 kcal", "metri quadrati usati per 1000 kcal"].slice())
.enter()
.append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
.attr("x", width )
.attr("width", 18)
.attr("height", 18)
.style("fill", color);

legend.append("text")
.attr("x", width )
.attr("y", 9)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text(function(d) { return d; });
