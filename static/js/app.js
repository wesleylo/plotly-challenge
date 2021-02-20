var names = [];
var metadata = [];
var samples = [];

function init() {
  // reference the dropdown select element
  var subjectselector = d3.select("#selDataset");

  // add names as selector options
  d3.json("samples.json").then(function (data) {
    names = data.names;

    names.forEach((i) => {
      subjectselector
        .append("option")
        .text(i)
        .property("value", i);
    });

    // build charts for first subject
    buildBarChart(names[0]);
    buildBubbleChart(names[0]);
    buildDemographicInfo(names[0]);
    
  });
}

function buildDemographicInfo(name) {
  d3.json("samples.json").then(function (data) {
    metadata = data.metadata;
    var filteredData = metadata.filter(data => parseInt(data.id) === parseInt(name));

    demographicInfoData = filteredData[0]; // get info corresponding to name

    var demographicInfoBox = d3.select("#sample-metadata");
    demographicInfoBox.html(""); // clear data

    Object.entries(demographicInfoData).forEach(([key, value]) => { // append key value pairs
      demographicInfoBox.append("p").text(`${key.toUpperCase()}: ${value}`);
    });
  })
}

function buildBarChart(name) {
  d3.json("samples.json").then((data) => {
    samples = data.samples;

    var filteredData = samples.filter(data => parseInt(data.id) === parseInt(name));
    
    var chartData = filteredData[0];

    var otu_ids = chartData.otu_ids.slice(0, 10).reverse();
    var sample_values = chartData.sample_values.slice(0, 10).reverse();
    var otu_labels = chartData.otu_labels.slice(0, 10).reverse();

    var barData = [
      {
        y: otu_ids.map(otuID  => `OTU ${otuID}`),
        x: sample_values,
        text: otu_labels,
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}


function buildBubbleChart(name) {
  d3.json("samples.json").then((data) => {
    samples = data.samples;
    var filteredData = samples.filter(data => parseInt(data.id) === parseInt(name));
    
    var chartData = filteredData[0];

    var otu_ids = chartData.otu_ids;
    var sample_values = chartData.sample_values;
    var otu_labels = chartData.otu_labels;
    
    // build chart
    var bubbleLayout = {
      title: "OTU Bacterias Found Per Sample",
      xaxis: { title: "OTU ID" },
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        type: 'scatter',
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
        },
        text: otu_labels
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

function optionChanged(name) {
  // new subject is selected
  buildBarChart(name);
  buildBubbleChart(name);
  buildDemographicInfo(name);
}

init();
