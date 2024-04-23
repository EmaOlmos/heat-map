import { useEffect } from "react";
import * as d3 from "d3";

function App() {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  useEffect(() => {
    d3.json(url).then((d) => {
      const width = 1000;
      const height = 600;
      const margin = { left: 60, up: 20, right: 30, down: 20 };

      const months = d.monthlyVariance.map((e) => e.month);
      const years = d.monthlyVariance.map((e) => e.year);
      const variances = d.monthlyVariance.map((e) => e.variance);

      const minMaxYears = [d3.min(years) - 1, d3.max(years) + 1];
      const minMaxMonths = [d3.min(months) - 1.5, d3.max(months) - 0.5];

      // select and set svg props
      const svg = d3
        .select("#svgDiv")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "aliceblue");

      // scales
      const x = d3.scaleLinear(minMaxYears, [
        margin.left,
        width - margin.right,
      ]);
      const y = d3.scaleLinear(minMaxMonths, [margin.down, height - margin.up]);

      // axis
      const xAxis = svg
        .append("g")
        .attr("transform", `translate (0,${height - margin.down})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      const yAxis = svg
        .append("g")
        .attr("transform", `translate(60,0)`)
        .call(
          d3.axisLeft(y).tickFormat((m) => {
            const date = new Date(0);
            date.setUTCMonth(m);
            const format = d3.utcFormat("%B");
            return format(date);
          })
        );
    });
  }, []);

  return (
    <>
      <h1>adios</h1>
      <div id="svgDiv"></div>
    </>
  );
}

export default App;
