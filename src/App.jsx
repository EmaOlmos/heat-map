import { useEffect } from "react";
import * as d3 from "d3";

function App() {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  useEffect(() => {
    d3.json(url).then((d) => {
      const width = 1200;
      const height = 600;
      const margin = { left: 100, up: 20, right: 30, down: 60 };

      const colors = d3
        .scaleLinear()
        .domain([0, 0.25, 0.5, 0.75, 1])
        .range(["#2870FF", "#536AFF", "#7362FF", "#9157FF", "#AB49FF"]);
      const legendColors = d3
        .scaleLinear()
        .domain([2.8, 12.8])
        .range(["#2870ff", "#b83fff"])
        .interpolate(d3.interpolateHcl);

      const base = d.baseTemperature;
      const format = d3.utcFormat("%B");
      console.log(base);

      const months = d.monthlyVariance.map((e) => e.month);
      const years = d.monthlyVariance.map((e) => e.year);
      const variances = d.monthlyVariance.map((e) => e.variance);

      const lData = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

      const minMaxYears = d3.extent(years);

      // making the tooltip
      const tip = d3
        .select("body")
        .append("div")
        .attr("class", "totip")
        .style("opacity", 0)
        .attr("id", "tooltip");

      // select and set svg props
      const svg = d3
        .select("#svgDiv")
        .append("svg")
        .attr("width", width)
        .attr("height", height + 100)
        .attr("class", "svg-wrapper");

      // scales
      const x = d3
        .scaleLinear()
        .domain(minMaxYears)
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleBand()
        .domain(d3.range(1, 13))
        .range([margin.up, height - margin.down])
        .padding(0.1);

      // axis
      const xAxis = svg
        .append("g")
        .attr("transform", `translate (0,${height - margin.down})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .attr("id", "x-axis");

      const yAxis = svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3.axisLeft(y).tickFormat((m) => {
            const date = new Date(0);
            date.setUTCMonth(m - 1);
            return format(date);
          })
        )
        .attr("id", "y-axis");

      const barWidth =
        (x(minMaxYears[1]) - x(minMaxYears[0])) /
        (minMaxYears[1] - minMaxYears[0]);

      const rects = svg
        .append("g")
        .selectAll()
        .data(d.monthlyVariance)
        .join("rect")
        .attr("fill", (d) => {
          let variance = base - d.variance;
          if (variance <= 3.9) {
            return colors(0.1);
          } else if (variance <= 5) {
            return colors(0.2);
          } else if (variance <= 6.1) {
            return colors(0.3);
          } else if (variance <= 7.2) {
            return colors(0.5);
          } else if (variance <= 8.3) {
            return colors(0.6);
          } else if (variance <= 9.5) {
            return colors(0.7);
          } else if (variance <= 10.6) {
            return colors(0.8);
          } else if (variance <= 11.7) {
            return colors(0.9);
          } else {
            return colors(1);
          }
        })
        .on("mouseover", (e, d) => {
          const date = new Date(d.year, d.month);
          const temp = base + d.variance;

          d3.select(this).attr("data-month", date.getMonth());
          d3.select(this).attr("data-year", date.getFullYear());
          d3.select(this).attr("data-temp", temp);

          tip
            .style("opacity", 0.8)
            .html(
              d3.utcFormat("%Y - %B")(date) +
                "<br>" +
                "Temperature: " +
                Math.round(temp * 10) / 10 +
                "<br/>" +
                "Variance: " +
                Math.round(d.variance * 10) / 10
            )
            .attr("data-year", date.year);

          d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
        })
        .on("mousemove", (e, d) => {
          tip
            .style("left", e.pageX + 40 + "px")
            .style("top", e.pageY - 50 + "px");
        })
        .on("mouseout", (e, d) => {
          tip.style("opacity", 0);

          d3.select(this).attr("stroke", "none").attr("stroke-width", 0);
        })
        .attr("width", barWidth + 1)
        .attr("height", height / 12 - 5)
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(d.month))
        .attr("class", "cell");

      // legend thing
      const legendW = width - margin.left - margin.right - 500;
      const legendH = 50;

      const legendX = d3.scaleLinear().domain([2.8, 12.8]).range([0, legendW]);

      const legendSvg = svg
        .append("g")
        .attr(
          "transform",
          `translate(${margin.left},${height + margin.down - 60})`
        )
        .attr("id", "legend");

      const legendRectWidth = legendW / lData.length;

      legendSvg
        .selectAll("rect")
        .data(lData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * legendRectWidth)
        .attr("y", 0)
        .attr("width", legendRectWidth)
        .attr("height", legendH)
        .style("fill", (d) => legendColors(d));

      legendSvg
        .append("g")
        .attr("transform", `translate(0, ${legendH})`)
        .call(
          d3
            .axisBottom(legendX)
            .tickValues(lData)
            .tickFormat(d3.format(".1f"))
            .tickSize(10, 0)
        );

      svg
        .append("text")
        .text("Years")
        .attr("x", width / 2)
        .attr("y", height - 20);

      svg
        .append("text")
        .text("Months")
        .style("text-anchor", "middle")
        .attr(
          "transform",
          `translate(${width - 1150}, ${height / 2}), rotate(-90)`
        );

      svg
        .append("text")
        .text("Made by Cherry ~ 🍒")
        .attr("x", width / 2)
        .attr("y", height - 20)
        .attr("transform", "translate(400,60)");
    });
  }, []);

  return (
    <>
      <div className="all-wrapper">
        <div className="title-wrapper">
          <h1 id="title" className="title">
            Monthly Global Land-Surface Temperature
          </h1>
          <h2 id="description" className="subtitle">
            1753 - 2015: base temperature 8.66℃
          </h2>
        </div>
        <div id="svgDiv"></div>
      </div>
    </>
  );
}

export default App;
