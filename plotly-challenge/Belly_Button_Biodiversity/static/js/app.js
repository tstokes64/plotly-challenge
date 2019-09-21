function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata_panel = d3.select('#sample-metadata');
    var url = `/metadata/${sample}`;

    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(url).then(result => {
      for (var [key, value] of Object.entries(result)) {
        metadata_panel.append("p").text(`${key}: ${value}`);

        var trace3 = {
          type: "gauge",
          domain: { x: [0, 1], y: [0, 1] },
          value: result.WFREQ,
          mode: "gauge+number",
          type: "indicator",
          gauge: {
            axis: { range: [null, 9] }}
        };

        var data3 = [trace3]

        Plotly.newPlot("gauge", data3, "");
      }
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(result =>{
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;

    var trace = {
      type: "bubble",
      x: otu_ids,
      y: sample_values,
      size: sample_values,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels
    };

    var layout = {
      title: "OTU ID",
      showlegend: false,
      xaxis: {
        title: "Operational Taxonomic Unit Level"
      },
      yaxis: {
        title: "Sample Size"
      }
    };

    var data = [trace];

    Plotly.newPlot("bubble", data, layout);
  })

    // @TODO: Build a Bubble Chart using the sample data
  d3.json(url).then(result => {
    var sample_values_slice = result.sample_values.slice(0,10);
    var otu_ids_slice = result.otu_ids.slice(0,10);
    var otu_labels_slice = result.otu_labels.slice(0,10);
    var trace2 = {
      type: "pie",
      values: sample_values_slice,
      labels: otu_ids_slice,
      hovertext: otu_labels_slice
    };

    var layout2 = {
      title: "Bacteria Diversity"
    };

    var data2 = [trace2]

    Plotly.newPlot("pie", data2, layout2);
  })
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

