import { useEffect } from "react";
import * as d3 from "d3";

function App() {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  useEffect(() => {
    d3.json(url).then((d) => {
      const width = 800;
      const height = 600;
      const margin = 40;

      const months = d.monthlyVariance.map((e) => e.month);
      const years = d.monthlyVariance.map((e) => e.year);
      const variances = d.monthlyVariance.map((e) => e.variance);

      const minMaxYears = [d3.min(years), d3.max(years)];
      const minMaxMonths = [d3.min(months), d3.max(months)];

      // select and set svg props
      const svg = d3
        .select("#svgDiv")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "blue");

      // scales
      const x = d3.scaleLinear(minMaxYears, [0, width]);
      const y = d3.scaleLinear(minMaxMonths, [0, height]);

      // axis
      svg.append("g")
      .attr("transform", )
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
