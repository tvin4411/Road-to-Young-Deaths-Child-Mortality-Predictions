// GlobalCM - Global Child Mortality Rates Graph
// In the following graph, the data is sourced from the WHOregionsCM csv file 
// It will contain different line traces for each region. - Choose to sort my data by WHO Regions because it had relevant supporting data for my message and it's a reliable source of information. 
// In each region's data, I have used hovertemplate to edit the labels that appear when hovering over the data which was inspired by:
// plotly. (n.d.). 'Hover Text and Formatting'. Retrieved from https://plotly.com/javascript/hover-text-and-formatting/
function all_WHOregions(csv_global) {
  let layout = {
    title: "<b>Child Mortality Rate Per WHO Region</b>",
    font: { size: 17 },
    xaxis: { title: "Year" },
    yaxis: { title: "Deaths (per 1000 live births)" },
    legend: { x: 0.05, y: 1.1, "orientation": "h" },
    hoverlabel: { font: { size: 16 } }
  }
  let Africa_region = csv_global.filter(d => d.region == "Africa");
  let AfricaData = {
    x: Africa_region.map(d => d.year),
    y: Africa_region.map(d => d.average_mortality), 
    mode: 'line',
    name: 'Africa',
    hovertemplate: '<b>%{x}</b>' +
                   '<br>%{y:.5r} Deaths',
  }
  let Europe_region = csv_global.filter(d => d.region == "Europe");
  let EuropeData = {
    x: Europe_region.map(d => d.year), 
    y: Europe_region.map(d => d.average_mortality),
    mode: 'line',
    name: 'Europe',
    hovertemplate: '<b>%{x}</b>' +
                   '<br>%{y:.5r} Deaths',
  }
  let EasternMed_region = csv_global.filter(d => d.region == "EasternMediterranean");
  let EastMedData = {
    x: EasternMed_region.map(d => d.year), 
    y: EasternMed_region.map(d => d.average_mortality),
    mode: 'line',
    name: 'Eastern Mediterranean',
    hovertemplate: '<b>%{x}</b>' +
                   '<br>%{y:.5r} Deaths',
  }
  let Americas_region = csv_global.filter(d => d.region == "Americas");
  let AmericasData = {
    x: Americas_region.map(d => d.year),
    y: Americas_region.map(d => d.average_mortality), 
    mode: 'line',
    name: 'Americas',
    hovertemplate: '<b>%{x}</b>' +
                   '<br>%{y:.5r} Deaths',
  }
  let SEAsia_region = csv_global.filter(d => d.region == "South-EastAsia");
  let SEAData = {
    x: SEAsia_region.map(d => d.year), 
    y: SEAsia_region.map(d => d.average_mortality),
    mode: 'line',
    name: 'South-East Asia',
    hovertemplate: '<b>%{x}</b>' +
                   '<br>%{y:.5r} Deaths',
  }
  let WestPacific_region = csv_global.filter(d => d.region == "WesternPacific");
  let WPacData = {
    x: WestPacific_region.map(d => d.year), 
    y: WestPacific_region.map(d => d.average_mortality),
    mode: 'line',
    name: 'Western Pacific',
    hovertemplate: '<b>%{x}</b>' +
                   '<br>%{y:.5r} Deaths',
  }
  //Created an array which will have data for each region
  let globalData = [ AfricaData, EuropeData, EastMedData, AmericasData, SEAData, WPacData ];

  //Links to the appropriate csv which is WHOregionsCM
  Plotly.newPlot('GlobalCM', globalData, layout);
}
Plotly.d3.csv("CSV/WHOregionsCM.csv", all_WHOregions);

//incomeDeaths and roadUserType data came from https://apps.who.int/iris/bitstream/handle/10665/162176/WHO_NMH_NVI_15.3_eng.pdf?sequence=1
//incomeDeaths - Shows road traffic death rates in each region (per 100 000 population) of children under 18 years in 2012
//The code below was inspired from https://stackoverflow.com/questions/44199938/how-to-plot-multiple-lines-from-csv-data-using-plotly/49702694
//It basically reads through the income.csv and takes data from the appropriate row and column based on the string given for the key variable
Plotly.d3.csv("CSV/income.csv", function (err, rows) {
  function incomeUnpack(rows, key) {
    return rows.map(function (row) { return row[key]; });
  };
  let layout = {
    title: "<b>Under 18 Road-traffic Deaths Based On Income (2012)</b>",
    barmode: 'group',
    margin: { l: 185, r: 60, b: 120, t: 90, pad: 15 },
    paper_bgcolor: "#052a4f",
    plot_bgcolor: "#052a4f",
    font: { size: 20, color: "#F58A07" },
    xaxis: { title: "World Health Organisation Regions", color: 'white' },
    yaxis: { title: "Death Rates (per 100,000)", color: 'white' },
    legend: { x: 0.75, y: 1.1, color: "red" },
    hoverlabel: { font: { size: 15 } }
  };
  let Htrace = {
    name: 'High-income',
    type: 'bar',
    x: incomeUnpack(rows, 'WHOregion'),
    y: incomeUnpack(rows, 'highIncome'),
    marker: { line: { width: 2, color: "white" } }
  };
  let LMtrace = {
    name: 'Low & Middle-income',
    type: 'bar',
    x: incomeUnpack(rows, 'WHOregion'),
    y: incomeUnpack(rows, 'lowmidIncome'),
    marker: { line: { width: 2, color: "white" } }
  };
  let incomeData = [Htrace, LMtrace];
  Plotly.newPlot('incomeDeaths', incomeData, layout);
})

// ChildRestraintsMap - Creating a world map which will display levels of countries meeting the best practice of child restraints
// Data is from a pdf downloaded at this site: World Health Organization. (n.d.). 'Existence of a national child-restraint law'. Retrieved from https://www.who.int/data/gho/data/indicators/indicator-details/GHO/existence-of-a-national-child-restraint-law
// Coding structure is taken from the plotly reference library which shows how to set up a world choropleth map: plotly. (n.d.). 'Choropleth Maps in JavaScript'. Retrieved from https://plotly.com/javascript/choropleth-maps/
// For this since it seems doing a categorical choropleth isn't possible (to my knowledge) I had replaced all the 'Yes' values with 1 and 'No' values with 0, just to have them shown on the map. I also chose not to show the scale because of this.
Plotly.d3.csv("CSV/childRestraints.csv", function (err, rows) {
  function restraintUnpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
  }
  let layout = {
    geo: { projection: { type: 'robinson' }, bgcolor:'#F7F5FB' },
    width: 1000,
    height: 800,
    margin: { l: 0, t: 0, r: 250, b: 300 },
    paper_bgcolor: "#F7F5FB",
    hoverlabel: { font: { size: 17 } }
  };
  let restraintData = [{
    type: 'choropleth',
    locationmode: 'country names',
    locations: restraintUnpack(rows, 'Country'),
    z: restraintUnpack(rows, 'Existence of a national child-restraint law'),
    text: restraintUnpack(rows, 'Country'),
    colorscale: [ [0, 'rgb(165, 2, 2)'], [1, 'rgb(87, 141, 5)'] ],
    showscale: false
  }];
  var config = { displayModeBar: false };
  Plotly.newPlot("ChildRestraintsMap", restraintData, layout, config);
})

//roadUserType - Shows how much deaths are caused by different vehicles in 2010
function roadPie() {
  let layout = {
    title: "<b>2010: Deaths by road user<b>",
    font: { size: 18, },
    paper_bgcolor: "#F9AB55",
    margin: { l: 0, r: 0, b: 20, t: 50 },
    showlegend: false,
    hovermode: !1      // Found how to hide the hover label from a post in stackoverflow: Iaaposto. (2016). 'Disable hover in Plotly.js'. Retrieved from https://stackoverflow.com/questions/35705885/disable-hover-in-plotly-js
  };
  let typeData = [{
    text: ['Pedistrians', 'Occupants', 'Motorcyclists', 'Cyclists', 'Other'],
    values: [38, 26, 14, 6, 7],
    type: 'pie',
    marker: {
      colors: [
        '#3CB043', //Green colour
        '#AEF359', //Lime colour
        '#74B72E', //Pear colour
        '#32341E', //Pine colour
        '#597D35', //Pickle colour
      ],
      line : { color: 'white', width: 2 }
    },
  }];
  Plotly.newPlot('roadUserType', typeData, layout);
}
Plotly.d3.csv("CSV/roadUser.csv", roadPie);

//Future Graph - a prediction graph which is entirely taken and inspired from Week 8's tutorial which explain to us how we can create predicts from the data given through a csv.
//This line graph will show that taking action in reducing the number of accidents through following road safety guidelines as parents and as drivers will no doubt reduce as well as help with the global child mortality rate.
function predict_plot(csv_WHOregionsFuture) {
  let Afr_region = csv_WHOregionsFuture.filter(d => d.Location == "Africa");
  let Eur_region = csv_WHOregionsFuture.filter(d => d.Location == "Europe");
  let EM_region = csv_WHOregionsFuture.filter(d => d.Location == "Eastern Mediterranean");
  let Ame_region = csv_WHOregionsFuture.filter(d => d.Location == "Americas");
  let SEA_region = csv_WHOregionsFuture.filter(d => d.Location == "South-East Asia");
  let WP_region = csv_WHOregionsFuture.filter(d => d.Location == "Western Pacific");
  //To normalise our data, we need to know the minimum and maximum values
  //Math.min doesn't work with strings so we need to convert
  let AfrInjuryD_data = Afr_region.map(d => Number(d.Injury_Deaths))
  let Afr_min = Math.min(...AfrInjuryD_data)
  let Afr_max = Math.max(...AfrInjuryD_data)
  let EurInjuryD_data = Eur_region.map(d => Number(d.Injury_Deaths))
  let Eur_min = Math.min(...EurInjuryD_data)
  let Eur_max = Math.max(...EurInjuryD_data)
  let EMInjuryD_data = EM_region.map(d => Number(d.Injury_Deaths))
  let EM_min = Math.min(...EMInjuryD_data)
  let EM_max = Math.max(...EMInjuryD_data)
  let AmeInjuryD_data = Ame_region.map(d => Number(d.Injury_Deaths))
  let Ame_min = Math.min(...AmeInjuryD_data)
  let Ame_max = Math.max(...AmeInjuryD_data)
  let SEAInjuryD_data = SEA_region.map(d => Number(d.Injury_Deaths))
  let SEA_min = Math.min(...SEAInjuryD_data)
  let SEA_max = Math.max(...SEAInjuryD_data)
  let WPInjuryD_data = WP_region.map(d => Number(d.Injury_Deaths))
  let WP_min = Math.min(...WPInjuryD_data)
  let WP_max = Math.max(...WPInjuryD_data)

  //This regression library needs values stored in arrays
  //We are using the strech function to normalise our data
  let Afr_regressData = Afr_region.map(d => [stretch(d.Period, 2000, 2017, 0, 1),
                                             stretch(d.Injury_Deaths, Afr_min, Afr_max, 0, 1)])
  let Eur_regressData = Eur_region.map(d => [stretch(d.Period, 2000, 2017, 0, 1),
                                             stretch(d.Injury_Deaths, Eur_min, Eur_max, 0, 1)])
  let EM_regressData = EM_region.map(d => [stretch(d.Period, 2000, 2017, 0, 1),
                                           stretch(d.Injury_Deaths, EM_min, EM_max, 0, 1)])
  let Ame_regressData = Ame_region.map(d => [stretch(d.Period, 2000, 2017, 0, 1),
                                             stretch(d.Injury_Deaths, Ame_min, Ame_max, 0, 1)])
  let SEA_regressData = SEA_region.map(d => [stretch(d.Period, 2000, 2017, 0, 1),
                                             stretch(d.Injury_Deaths, SEA_min, SEA_max, 0, 1)])
  let WP_regressData = WP_region.map(d => [stretch(d.Period, 2000, 2017, 0, 1),
                                           stretch(d.Injury_Deaths, WP_min, WP_max, 0, 1)])

  //Train the regressors
  // In order to get to result I wanted as close as possible (that is a decrease in the number of injury-related deaths) I experimented with the order values of each WHO region.
  // I either increased or descrease each one then looked at the graph. If it arched down to 0 then thats the order value for the region but if not I experimented again.
  // In the end, I had  a mix of order values as it seems the data impacted each other (I don't know the reason as to why) 
  let Afr_regressionResult = regression.polynomial(Afr_regressData, { order: 3 });
  let Eur_regressionResult = regression.polynomial(Eur_regressData, { order: 1 });
  let EM_regressionResult = regression.polynomial(EM_regressData, { order: 3 });
  let Ame_regressionResult = regression.polynomial(Ame_regressData, { order: 2 });
  let SEA_regressionResult = regression.polynomial(SEA_regressData, { order: 2 });
  let WP_regressResult = regression.polynomial(WP_regressData, { order: 1 });

  //Using the trained predictors (which is from the above code)
  let all_predict_x = [], africa = [], europe = [], eastmed = [], americas = [], seasia = [], wpacific = [];
  for (let Period = 2017; Period <= 2027; Period++) {
    //Working in the normalised scale
    let Afr_prediction = Afr_regressionResult.predict(stretch(Period, 2000, 2017, 0, 1))[1]
    let Eur_prediction = Eur_regressionResult.predict(stretch(Period, 2000, 2017, 0, 1))[1]
    let EM_prediction = EM_regressionResult.predict(stretch(Period, 2000, 2017, 0, 1))[1]
    let Ame_prediction = Ame_regressionResult.predict(stretch(Period, 2000, 2017, 0, 1))[1]
    let SEA_prediction = SEA_regressionResult.predict(stretch(Period, 2000, 2017, 0, 1))[1]
    let WP_prediction = WP_regressResult.predict(stretch(Period, 2000, 2017, 0, 1))[1]

    //Un-normalises for displaying on the plot
    africa.push(stretch(Afr_prediction, 0, 1, WP_min, WP_max));
    europe.push(stretch(Eur_prediction, 0, 1, Eur_min, Eur_max));
    eastmed.push(stretch(EM_prediction, 0, 1, EM_min, EM_max));
    americas.push(stretch(Ame_prediction, 0, 1, Ame_min, Ame_max));
    seasia.push(stretch(SEA_prediction, 0, 1, SEA_min, SEA_max));
    wpacific.push(stretch(WP_prediction, 0, 1, WP_min, WP_max));

    all_predict_x.push(Period);
  }

  // My graph will not include the data in the injuryChildDeaths csv but instead have multiple prediction traces representing each WHO region
  let layout = {
    title: "<b>Injury-related Deaths from 2017 to 2027</b>",
    font: { size: 22 },
    xaxis: { title: "Year" },
    yaxis: { title: "Total Deaths Per Region" },
    margin: { l: 120, r: 40 },
    legend: { x: 0.05, y: 1.08, "orientation": "h" },
    hoverlabel: { font: { size: 17 } }
  };
  // I chosen to have the graph be a filled area plot because it:
  // - had the visualisation of the data going down without obstructing the other region's traces like it did when I tried using a line plot.
  // - distinguished regions more clearly over a long period of time than if I were to use a bar plot.
  //Africa
  let futureData = [
    //Africa
    {
      x: all_predict_x, 
      y: africa, 
      name: 'Africa', 
      stackgroup: 'one',
      hovertemplate: '<b>%{x}</b>' +
                    '<br>%{y:.6r} Deaths',
    },
    //Europe
    {
      x: all_predict_x, 
      y: europe, 
      name: 'Europe',
      stackgroup: 'one',
      hovertemplate: '<b>%{x}</b>' +
                    '<br>%{y:.6r} Deaths',
    },
    //Eastern Mediterranean
    {
      x: all_predict_x, 
      y: eastmed, 
      name: 'Eastern Mediterranean',
      stackgroup: 'one',
      hovertemplate: '<b>%{x}</b>' +
                    '<br>%{y:.6r} Deaths',
    },
    //Americas
    {
      x: all_predict_x, 
      y: americas, 
      name: 'Americas',
      stackgroup: 'one',
      hovertemplate: '<b>%{x}</b>' +
                    '<br>%{y:.6r} Deaths',
    },
    //South-East Asia
    {
      x: all_predict_x, 
      y: seasia, 
      name: 'South-East Asia',
      stackgroup: 'one',
      hovertemplate: '<b>%{x}</b>' +
                    '<br>%{y:.6r} Deaths',
    },
    //West Pacific
    {
      x: all_predict_x, 
      y: wpacific, 
      name: 'West Pacific',
      stackgroup: 'one',
      hovertemplate: '<b>%{x}</b>' +
                    '<br>%{y:.6r} Deaths',
    }
  ]

  Plotly.newPlot('futureGraph', futureData, layout);
}
Plotly.d3.csv("CSV/injuryChildDeaths.csv", predict_plot);

//This stretch function is actually just the map function from p5.js
function stretch(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};
