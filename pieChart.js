(function(d3) {
    'use strict';

    // Donut Chart Vars
    var width = 360;
    var height = 360;
    var donutWidth = 75;
    var radius = Math.min(width, height) / 2;

    // Legend Vars
    var legendRectSize = 18;
    var legendSpacing = 4;

    // Color scheme
    var color = d3.scaleOrdinal(d3.schemeCategory20b);

    // Create SVG element from chart div
    var svg = d3.select('#pieChart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

    // Define Inner and outer angles
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);

    // Call chart
    var pie = d3.pie()
        .value(function(d) { return d.count; })
        .sort(null);

    // Add tooltip elements
    var tooltip = d3.select('#pieChart')
        .append('div')
        .attr('class', 'tooltip');

    tooltip.append('div')
        .attr('class', 'label');

    tooltip.append('div')
        .attr('class', 'count');

    tooltip.append('div')
        .attr('class', 'percent');

    // Load Dataset Pre-processed by Python
    d3.csv('weekday.csv', function(error, dataset) {

        // Convert data to int
        dataset.forEach(function(d) {
            d.count = +d.count
            d.enabled = true;
        });

        // Define path
        var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d) {
                return color(d.data.label);
            })
            .each(function(d) { this._current; });

        // Tooltip event handlers
        path.on('mouseover', function(d) {
            // Mouseover handler
            var total = d3.sum(dataset.map(function(d) {
                return (d.enabled) ? d.count : 0;
            }));
            var percent = Math.round(1000 * d.data.count / total) / 10;
            tooltip.select('.label').html(d.data.label);
            tooltip.select('.count').html(d.data.count);
            tooltip.select('.percent').html(percent + '%');
            tooltip.style('display', 'block');
        });

        path.on('mouseout', function(d) {
            // Mouseout handler
            tooltip.style('display', 'none');
        });

        path.on('mousemove', function(d) {
            // Mousemove handler
            tooltip.style('top' (d3.event.offsetY + 10) + 'px')
                .style('left', (d3.event.offsetX + 10) + 'px');
        });

        // Add legend
        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                    return 'translate(' + horz + ',' + vert + ')';
                });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color)
            .on('click', function(label) {

                /*** Animate by 'enabling' days of the week ***/
                // Helper variables
                var rect = d3.select(this); //Wrap selectables rects
                var enabled = true; // flag
                var totalEnabled = d3.sum(dataset.map(function(d) {
                    return (d.enabled) ? 1 : 0;
                }));

                // Check if current square is disabled
                if (rect.attr('class') === 'disabled') {
                    rect.attr('class', 'disabled');
                } else {
                    // Check min number of enabled squares
                    if (totalEnabled < 2) return;
                    // Flag as disabled
                    rect.attr('class', 'disabled');
                    enabled = false;
                }

                // Define hoe to retrieve values
                pie.value(function(d) {
                    if (d.label === label) d.enabled = enabled;
                    return (d.enabled) ? d.count : 0;
                });

                // Update path with data method
                path = path.data(pie(dataset));

                // Interpolate between updated data points for smooth transition
                path.transition()
                    .duration(750)
                    .attrTween('d', function(d) {
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            return arc(interpolate(t));
                        };
                    });

            });

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });

    });

})(window.d3);
