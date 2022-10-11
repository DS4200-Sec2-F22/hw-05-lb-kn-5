// div size (frame)
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 600;
const MARGINS = {left: 100, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;


// scatterplot frame
const FRAME_SCATTER = d3.select("#scatterplot")
						.append("svg")
							.attr("height", FRAME_HEIGHT)
							.attr("width", FRAME_WIDTH)
							.attr("class", "frame");

// build interactive scatterplot
function build_scatter() {
	d3.csv("data/scatter-data.csv").then((data) => {

		// x-axis scaling
		const MAX_VALUE_X = d3.max(data, (d) => {return parseInt(d.x);})
		const X_SCALE = d3.scaleLinear()
							.domain([0, MAX_VALUE_X + 1])
							.range([0, VIS_HEIGHT]);

		// y-axis scaling
		const MAX_VALUE_Y = d3.max(data, (d) => {return parseInt(d.y);})
		const Y_SCALE = d3.scaleLinear()
							.domain([0, MAX_VALUE_Y + 1])
							.range([VIS_HEIGHT, 0]);

		// add x-axis
		FRAME_SCATTER.append("g")
						.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
						.call(d3.axisBottom(X_SCALE).ticks(10))
							.attr("font-size", "15px")

		// add y-axis
		FRAME_SCATTER.append("g")
						.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
						.call(d3.axisLeft(Y_SCALE).ticks(10))
							.attr("font-size", "15px");

		// add points for the data
		FRAME_SCATTER.selectAll("points")
						.data(data)
						.enter()
						.append("circle")
							.attr("id", (d) => {return "(" + d.x + "," + d.y + ")";})
							.attr("cx", (d) => {return (MARGINS.left + X_SCALE(d.x));})
							.attr("cy", (d) => {return (MARGINS.top + Y_SCALE(d.y));})
							.attr("r", 10)
							.attr("class", "point");

		// point click functionality
		function selectPoint() {
			let clicked = d3.select(this);
			if (clicked.style("stroke") == "lightgreen") {
				clicked.style("stroke", "none");
			}
			else {
				clicked.style("stroke", "lightgreen").style("stroke-width", 4);
			}
			// display id (coordinates) of last selected point
			let textDiv = document.getElementById("last-selected");
			textDiv.innerHTML = "Last point clicked: " + clicked.attr("id");
		}

		// add click event listener to all points
		FRAME_SCATTER.selectAll(".point")
						.on("click", selectPoint);
		
	});
};
build_scatter();


// form submit to add points



// bar chart frame
const FRAME_BAR = d3.select("#barchart")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame");

// build interactive bar chart
function build_barchart() {
	d3.csv("data/bar-data.csv").then((data) => {

		// x-axis scaling
		const X_SCALE = d3.scaleBand()
							.domain(data.map((d) => {return d.category;}))	// map categories to be equally spaced on x-axis
							.range([0, VIS_WIDTH])
							.padding(0.4);

		// y-axis scaling
		const MAX_VALUE_Y = d3.max(data, (d) => {return parseInt(d.amount);})
		const Y_SCALE = d3.scaleLinear()
							.domain([0, MAX_VALUE_Y + 1])
							.range([VIS_HEIGHT, 0]);	// range = [max, min] for numbers to start from bottom

		// add x-axis
		FRAME_BAR.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
					.call(d3.axisBottom(X_SCALE).ticks())
						.attr("font-size", "15px")

		// add y-axis
		FRAME_BAR.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
					.call(d3.axisLeft(Y_SCALE).ticks(10))
						.attr("font-size", "15px");

		// add bars for data
		FRAME_BAR.selectAll("bars")
					.data(data)
					.enter()
					.append("rect")
						.attr("x", (d) => {return (MARGINS.left + X_SCALE(d.category));})
						.attr("y", (d) => {return (MARGINS.top + Y_SCALE(d.amount));})
						.attr("width", X_SCALE.bandwidth())
						.attr("height", (d) => {return (VIS_HEIGHT - Y_SCALE(d.amount));})
						.attr("fill", "dodgerblue")
						.attr("class", "bar");

		// tooltip
		const TOOLTIP = d3.select(("#barchart"))
							.append("div")
								.attr("class", "tooltip")
								.style("opacity", 0);

		// on mouseover, make tooltip opaque
		function mouseover(event, d) {
			TOOLTIP.style("opacity", 1);
		};

		// position tooltip 
		function mousemove(event, d) {
			TOOLTIP.html("Name: " + d.category + "<br>Value: " + d.amount)
						.style("left", (event.pageX + 10) + "px")
						.style("top", (event.pageY - 50) + "px");
		};

		// on mouseover, make tooltip opaque
		function mouseleave(event, d) {
			TOOLTIP.style("opacity", 0);
		};

		// add event listeners to all of the bars
		FRAME_BAR.selectAll(".bar")
					.on("mouseover", mouseover)
					.on("mousemove", mousemove)
					.on("mouseleave", mouseleave);

	});
};
build_barchart();

