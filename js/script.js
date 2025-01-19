const createRadarChart = (svg, attributesGroups, playerName, colorScale, width, height) => {
    console.log(`radar chart: ${playerName}`);
    const radius = Math.min(width, height) / 2 - 50;
    const angleSlice = (2 * Math.PI) / attributesGroups.allAttributes.length;
    const rScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, radius]);
    const radarLine = d3.lineRadial()
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice)
        .curve(d3.curveCardinalClosed);
    const g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    g.selectAll(".grid-circle")
        .data(rScale.ticks(5))
        .join("circle")
        .attr("r", d => rScale(d))
        .attr("class", "grid-circle")
        .attr("fill", "none")
        .attr("stroke", "lightgray");
    g.selectAll(".axis-line")
        .data(attributesGroups.allAttributes)
        .join("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("class", "axis-line")
        .attr("stroke", "lightgray");
    g.selectAll(".axis-label")
        .data(attributesGroups.allAttributes)
        .join("text")
        .attr("x", (d, i) => (rScale(115) * Math.cos(angleSlice * i - Math.PI / 2)))
        .attr("y", (d, i) => (rScale(105) * Math.sin(angleSlice * i - Math.PI / 2)))
        .attr("text-anchor", "middle")
        .attr("class", "axis-label")
        .text(d => d.key)
        .style("font-size", "11px");

    attributesGroups.groups.forEach((group, index) => {
        const fullData = attributesGroups.allAttributes.map(attr => {
            const match = group.find(g => g.key === attr.key);
            return { key: attr.key, value: match ? match.value : 0 };
        });
        console.log(`Group ${index + 1} Data:`, fullData); 
        g.append("path")
            .datum(fullData)
            .attr("d", radarLine)
            .attr("fill", colorScale(index / attributesGroups.groups.length))
            .attr("stroke", colorScale((index + 1) / attributesGroups.groups.length))
            .attr("stroke-width", 1.5)
            .attr("fill-opacity", 0.8);
    });
    console.log(`Radar chart ${playerName} created`);
};

d3.csv("/data/fifa_players.csv").then(data => {
    console.log("CSV Data Loaded:", data);
    const messiData = data.find(player => player.name === "L. Messi");
    const ronaldoData = data.find(player => player.name === "Cristiano Ronaldo");
    if (!messiData) {
        console.error("Messi data missing");
    }
    if (!ronaldoData) {
        console.error("Ronaldo data missing");
    }
    const allAttributes = [
        { key: "Dribbling", value: 0 },
        { key: "Balance", value: 0 },
        { key: "Agility", value: 0 },
        { key: "Vision", value: 0 },
        { key: "Shortpass", value: 0 },
        { key: "Curve", value: 0 },
        { key: "Freekick", value: 0 },
        { key: "Longball", value: 0 },
        { key: "Aggression", value: 0 },
        { key: "Power", value: 0 },
        { key: "Head", value: 0 },
        { key: "Jump", value: 0 },
    ];

    const messiGroups = [
        [
            { key: "Dribbling", value: +messiData.dribbling },
            { key: "Agility", value: +messiData.agility },
            { key: "Balance", value: +messiData.balance },
            { key: "Vision", value: +messiData.vision },
        ],
        [
            { key: "Shortpass", value: +messiData.short_passing },
            { key: "Curve", value: +messiData.curve },
            { key: "Freekick", value: +messiData.freekick_accuracy },
            { key: "Longball", value: +messiData.long_passing },
        ],
        [
            { key: "Aggression", value: +messiData.aggression },
            { key: "Power", value: +messiData.shot_power },
            { key: "Head", value: +messiData.heading_accuracy },
            { key: "Jump", value: +messiData.jumping },
        ],
    ];

    const ronaldoGroups = [
        [
            { key: "Dribbling", value: +ronaldoData.dribbling },
            { key: "Agility", value: +ronaldoData.agility },
            { key: "Balance", value: +ronaldoData.balance },
            { key: "Vision", value: +ronaldoData.vision },
        ],
        [
            { key: "Shortpass", value: +ronaldoData.short_passing },
            { key: "Curve", value: +ronaldoData.curve },
            { key: "Freekick", value: +ronaldoData.freekick_accuracy },
            { key: "Longball", value: +ronaldoData.long_passing },
        ],
        [
            { key: "Aggression", value: +ronaldoData.aggression },
            { key: "Power", value: +ronaldoData.shot_power },
            { key: "Head", value: +ronaldoData.heading_accuracy },
            { key: "Jump", value: +ronaldoData.jumping },
        ],
    ];

    createRadarChart(
        d3.select("#left-visualization"),
        { allAttributes, groups: messiGroups },
        "Lionel Messi",
        d3.scaleOrdinal(d3.schemeCategory10),
        400,
        400
    );
    createRadarChart(
        d3.select("#right-visualization"),
        { allAttributes, groups: ronaldoGroups },
        "Cristiano Ronaldo",
        d3.scaleOrdinal(d3.schemeCategory10),
        400,
        400
    );
}).catch(error => {
    console.error("Error with csv", error);
});
