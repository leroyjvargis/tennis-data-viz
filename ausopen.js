let allplayers;
let selectedPlayer;

// main bar chart sorted by most wins
function barChart(start, end) {
    let sliced_data = getTopPlayers(start, end)
    // console.log(sliced_data)
            
    var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    x.domain(sliced_data.map(function (d) {
        return d.key;
    }));
    y.domain([0, d3.max(sliced_data, function (d) {
        return d.value;
    })]);

    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

    g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Wins");

    g.selectAll(".bar")
    .data(sliced_data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
        return x(d.key);
    })
    .attr("width", x.bandwidth());

    g.selectAll("rect")
    .transition()
    .delay(function (d) {return Math.random()*1000;})
    .duration(500)
    .attr("y", function (d) {
        return y(d.value);
    })
    .attr("height", function (d) {
        return height - y(d.value);
    });
    

    svg.selectAll(".bar").on('click', function(d, i) {
        d3.select("#main-chart").style("display", "none");
        d3.select("#support-charts").style("display", "block");
        d3.select("#player-name").text(d.key);
        selectedPlayer = d;
        showPlayerPerformanceByYear(d)
        showPlayerAttributes(d)
        populatePlayerListForCompare()
        d3.select("#select-other-player").on("change", comparePlayers); //attach listener
        d3.select("#back-btn").on("click", ()=> { location.reload()} )
    });

}

// player performance horizontal bar chart
function showPlayerPerformanceByYear(player) {
    // console.log(player)
    
    let user_data = data.filter(function (d) {
        if (d.winner == player.key) {
            return d
        }
    })

    let user_data_2 = d3.nest()
        .key(function(d) { return d.year; })
        .rollup(function (d) { return d.length })
        .entries(user_data)

    user_data_2 = user_data_2.sort(function (d1, d2) {
        return d2.key - d1.key
    });

    // console.log(user_data_2)

    d3.select("svg").html("");
    
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 480 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // set the ranges
    var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

    var x = d3.scaleLinear()
            .range([0, width]);
            
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    // var svg = d3.select("svg")//.append("svg")
    var svg = d3.select("#chart1").append("svg")//.append("svg")
        .attr("width", width + margin.left + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain([0, d3.max(user_data_2, function(d){ return d.value; })])
    y.domain(user_data_2.map(function(d) { return d.key; }));

    // append the rectangles for the bar chart
    var bars = svg.selectAll(".bar")
        .data(user_data_2)
        .enter().append("g")
    
    bars.append("rect")
        .attr("class", "bar2")
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.key); })
        .attr("width", 0)
        .transition()
        .duration(1500)//time in ms
        .attr("width", function(d) {return x(d.value); } )

    bars
        .data(user_data_2)
        .enter()
        .append("text")

    bars
        .append("text")        
        .attr("y", function(d) {
            return y(d.key) + y.bandwidth() / 2 + 5;
        })
        .attr("x", 10)
        .text(function(d) {
            // return d.value
            return d.value == 1 ? "First round" :
                d.value == 2 ? "Second round" :
                d.value == 3 ? "Third round" :
                d.value == 4 ? "Fourth round" :
                d.value == 5 ? "Quarter finalist" :
                d.value == 6 ? "Runner up" : "Winner!"
                
        })
        .attr("x", 0)
        .transition()
        .duration(1500)//time in ms
        .attr("x", function(d) {
            return x(d.value) + 10;
        });

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

}

// player stats against average grouped bar chart
function showPlayerAttributes(player) {
    var groupData = constructPlayerAttributeComparisonData(player);

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var x0  = d3.scaleBand().rangeRound([0, width], .5);
    var x1  = d3.scaleBand();
    var y   = d3.scaleLinear().rangeRound([height, 0]);

    var xAxis = d3.axisBottom().scale(x0)
        .tickValues(groupData.map(d=>d.key));

    var yAxis = d3.axisLeft().scale(y);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("#chart2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var categoriesNames = groupData.map(function(d) { return d.key; });
    var rateNames = groupData[0].values.map(function(d) { return d.name; });

    x0.domain(categoriesNames);
    x1.domain(rateNames).rangeRound([0, x0.bandwidth() / 1.1]);
    y.domain([0, d3.max(groupData, function(key) { return d3.max(key.values, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style('opacity','0')
        .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight','bold')
            .text("Value");

    svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    var slice = svg.selectAll(".slice")
        .data(groupData)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

    slice.selectAll("rect")
    .data(function(d) { return d.values; })
        .enter().append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.name); })
            .style("fill", function(d) { return color(d.name) })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return height - y(0); })
            .style("margin-right", "20px")
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.name)).darker(2));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color(d.name));
            });


    slice.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });

    //Legend
    var legend = svg.selectAll(".legend")
        .data(groupData[0].values.map(function(d) { return d.name; }).reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
            .style("opacity","0");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {return d; });

    legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
}

// populate the player list drop down list, on player profile page load
function populatePlayerListForCompare() {
    allplayers = getAllPlayerNames()
    var select = document.getElementById("select-other-player"); 

    for(var i = 0; i < allplayers.length; i++) {
        var opt = allplayers[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}

// callback to compare players, called whenever drop down list is changed
function comparePlayers() {
    var sel = document.getElementById('select-other-player');
    var otherPlayer = {key: sel.options[sel.selectedIndex].value }
    d3.select("#chart3").html("");
    makeRadarChartComparison(selectedPlayer, otherPlayer);
}

// plot radar chart to compare two players
// code to actually plot is by Nadieh Bremer. 
function makeRadarChartComparison(player1, player2) {
    var players = [player1.key, player2.key]

    var d = [];
    d.push(getPlayerAttributesForRadarCompare(player1));
    d.push(getPlayerAttributesForRadarCompare(player2));
    
    var w = 500, h = 500;
    var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

    //Options for the Radar chart, other than default
    var mycfg = {
        w: w,
        h: h,
        maxValue: 0.6,
        levels: 6,
        ExtraWidthX: 300
    }
    
    RadarChart.draw("#chart3", d, mycfg);
    
    // legend
    var svg = d3.select("#chart3").append('svg')
        .attr("width", w+300)
        .attr("height", 50)
    
    //Create the title for the legend
    var text = svg.append("text")
        .attr("class", "title")
        .attr('transform', 'translate(90,0)') 
        .attr("x", w - 70)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("fill", "#404040")
        .text("Players being compared");
            
    //Initiate Legend	
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)') 
        ;
        //Create colour squares
        legend.selectAll('rect')
            .data(players)
            .enter()
            .append("rect")
            .attr("x", w - 65)
            .attr("y", function(d, i){ return i * 20;})
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d, i){ return colorscale(i);})
            ;
        //Create text next to squares
        legend.selectAll('text')
            .data(players)
            .enter()
            .append("text")
            .attr("x", w - 52)
            .attr("y", function(d, i){ return i * 20 + 9;})
            .attr("font-size", "11px")
            .attr("fill", "#737373")
            .text(function(d) { return d; })
            ;	
}
