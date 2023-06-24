// Set url as variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Use D3 to retrieve the data
d3.json(url).then(function(data) {
  console.log(data);
});

// Function to initialize the dashboard
function init() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Retrieve all sample names using D3
    d3.json(url).then((data) => {
        
        let names = data.names;

        // Loop through each name in the array and append to the dropdown menu
        names.forEach((id) => {
            dropdownMenu.append("option")
                .text(id)
                .property("value", id);
        });

        // Set the first sample from the list
        let first_sample = names[0];

        // Build the initial plots
        metadata(first_sample);
        barChart(first_sample);
        bubbleChart(first_sample);
    });
}

// Function for the metadata panel
function metadata(selection) {
    // Retrieve all the data using D3
    d3.json(url).then((data) => {
    
        let metadata = data.metadata;

        // Filter based on the value of the selection
        let value = metadata.filter(result => result.id == selection);
        console.log(value);

        // Get the first match from the array
        let valueData = value[0];

        // Clear the metadata
        d3.select("#sample-metadata").html("");

        // Add each key/value pair to the metadata panel using Object.entries
        Object.entries(valueData).forEach(([key, value]) => {
            console.log(key, value); // Log the individual key/value pairs

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
}

// Function to build the bar chart
function barChart(selection) {
    // Retrieve all the data using D3
    d3.json(url).then((data) => {
        
        let selectionData = data.samples;
  
        // Filter based on the value of the selection
        let value = selectionData.filter(result => result.id == selection);
  
        // Get the first match from the array
        let valueData = value[0];
  
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
  
        console.log(otu_ids, otu_labels, sample_values);
  
        // Set up the trace for the bar chart, slice top 10 values
        let trace = {
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
  
        // Set up the layout
        let layout = {
            title: "Top 10 OTUs"
        };
  
        // Use Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout);
    });
}


// Function to build the bubble chart
function bubbleChart(selection) {
    // Retrieve all the data using D3
    d3.json(url).then((data) => {
        // Retrieve all sample data
        let sampleData = data.samples;

        // Filter based on the value of the selection
        let value = sampleData.filter(result => result.id == selection);

        // Get the first match from the array
        let valueData = value[0];

        // Get the values for the bubble chart
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids, otu_labels, sample_values);

        // Set up the trace
        let trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
        };

        // Use Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace], layout);
    });
}

// Update the plots when a new sample is selected
function optionChanged(selection) {
    console.log(selection); // Log the new value

    // Call the functions to update the plots
    metadata(selection);
    barChart(selection);
    bubbleChart(selection);
}

// Initialize the dashboard
init();