function init() {

    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}
init();

function optionChanged(newSample) {

    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);

}

//Demographics Panel

function buildMetadata(sample) {

    d3.json("samples.json").then((data) => {
        console.log(data);
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });
}

//  Create the buildCharts function.
function buildCharts(sample) {

    // Use `d3.json` to fetch the sample data for the plots
    d3.json("samples.json").then((data) => {
        console.log(data);

        // hold data from sample {}
        var samples = data.samples;
        var resultsarray = samples.filter(sampleobject => sampleobject.id == sample);
        var result = resultsarray[0];

        //  hold data from metadata {}
        var metadata = data.metadata;
        var metaArray = metadata.filter(sampleobject => sampleobject.id == sample);
        var metaResult = metaArray[0];

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        var wref = parseFloat(metaResult.wfreq);

        //console.log(wref);

        var yticks = ids.map(id => `OTU ${id}`).slice(0, 10).reverse();

        var barData = {
            x: values.slice(0, 10).reverse(),
            y: yticks,
            text: labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var traceBar = [barData];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            },
            xaxis: { title: "Sample Values" },
            yaxis: { title: "Bacteria ID" }
        };

        Plotly.newPlot("bar", traceBar, barLayout);

        var bubbleData = [{
            x: ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                color: ids,
                size: values,
                colorscale: "Picnic"
            }
        }];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            xaxis: { title: "OTU ID" },
            hovermode: "closest",
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        var gaugeData = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: wref,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {
                    range: [null, 10]

                },
                bar: { color: "#424949 " },
                steps: [{ range: [0, 2], color: "#EC7063" },
                    { range: [2, 4], color: "#F1948A" },
                    { range: [4, 6], color: "#F5B7B1 " },
                    { range: [6, 8], color: "#FADBD8 " },
                    { range: [8, 10], color: "#FDEDEC  " },
                ]

            },




        }];

        var gaugeLayout = { width: 500, height: 500, margin: { t: 0, b: 0 } };

        Plotly.newPlot('gauge', gaugeData, gaugeLayout);

    });
}