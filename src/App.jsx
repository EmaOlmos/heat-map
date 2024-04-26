import { useEffect } from "react";
import * as d3 from "d3";

function App() {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  useEffect(() => {
    d3.json(url).then((d) => {
      const width = 3000;
      const height = 600;
      const margin = { left: 60, up: 20, right: 30, down: 20 };
      const colors = d3
        .scaleLinear()
        .domain([0, 0.25, 0.5, 0.75, 1])
        .range(["#B0E2FF", "#CEE7FF", "#FFDAB9", "#FFFFE0", "#FFCCCC"]);
      const base = d.baseTemperature;
      console.log(base);

      const months = d.monthlyVariance.map((e) => e.month);
      const years = d.monthlyVariance.map((e) => e.year);
      const variances = d.monthlyVariance.map((e) => e.variance);

      const minMaxYears = d3.extent(years);

      // select and set svg props
      const svg = d3
        .select("#svgDiv")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "aliceblue");

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
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      const yAxis = svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3.axisLeft(y).tickFormat((m) => {
            const date = new Date(0);
            date.setUTCMonth(m - 1);
            const format = d3.utcFormat("%B");
            return format(date);
          })
        );
      console.log(d);
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
        .attr("width", barWidth)
        .attr("height", y.bandwidth())
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(d.month));
    });
  }, []);

  return (
    <>
      <h1>ola</h1>
      <div id="svgDiv"></div>
    </>
  );
}

export default App;
