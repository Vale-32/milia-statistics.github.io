// Whole-script strict mode syntax
"use strict";

// Import all the functions necessary for calculations
import { generateNumberOfTrajectories, countFrequency } from './calculation.mjs';

// Get canvas and context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Define rectangles
const rect1 = {
    x: 50,
    y: 10,
    width: 550,
    height: 250,
    isResizing: false,
    isDragging: false,
    resizeHandleSize: 10,
    offsetX: 0,
    offsetY: 0,
    name: "Score"
};

const rect2 = {
    x: 650,
    y: 10,
    width: 550,
    height: 250,
    isResizing: false,
    isDragging: false,
    resizeHandleSize: 10,
    offsetX: 0,
    offsetY: 0,
    name: "Cumulated"
};

const rect3 = {
    x: 50,
    y: 300,
    width: 550,
    height: 250,
    isResizing: false,
    isDragging: false,
    resizeHandleSize: 10,
    offsetX: 0,
    offsetY: 0,
    name: "Relative"
};

const rect4 = {
    x: 650,
    y: 300,
    width: 550,
    height: 250,
    isResizing: false,
    isDragging: false,
    resizeHandleSize: 10,
    offsetX: 0,
    offsetY: 0,
    name: "Normalized"
};

const rect5 = {
    x: 1250,
    y: 10,
    width: 550,
    height: 250,
    isResizing: false,
    isDragging: false,
    resizeHandleSize: 10,
    offsetX: 0,
    offsetY: 0,
    name: "Variable p random over M"
};

const rect6 = {
    x: 1250,
    y: 300,
    width: 550,
    height: 250,
    isResizing: false,
    isDragging: false,
    resizeHandleSize: 10,
    offsetX: 0,
    offsetY: 0,
    name: "Variable p random over M and N"
};

// Define global variables and get initial values
let systemValue = document.getElementById('systemSlider').value;
let attackValue = document.getElementById('attackSlider').value;
let penetrationValue = document.getElementById('penetrationSlider').value;

// Initial dataset
let data = generateNumberOfTrajectories(systemValue, attackValue, penetrationValue);

// Defines all necessary handlers for rectangle movements etc.
window.onload = function () {

    function isMouseInsideRectangle(rect, x, y) {
        return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
    }

    function isMouseInsideResizeHandle(rect, x, y) {
        return (
            x > rect.x + rect.width - rect.resizeHandleSize &&
            x < rect.x + rect.width &&
            y > rect.y + rect.height - rect.resizeHandleSize &&
            y < rect.y + rect.height
        );
    }

    function onMouseDown(event, rect) {
        var mouseX = event.clientX - canvas.getBoundingClientRect().left;
        var mouseY = event.clientY - canvas.getBoundingClientRect().top;

        // Check if mouse is inside the resize handle area
        if (isMouseInsideResizeHandle(rect, mouseX, mouseY)) {
            rect.isResizing = true;
        }
        // Check if mouse is inside the rectangle
        else if (isMouseInsideRectangle(rect, mouseX, mouseY)) {
            rect.isDragging = true;
            // Calculate the offset between mouse position and top-left corner of the rectangle
            rect.offsetX = mouseX - rect.x;
            rect.offsetY = mouseY - rect.y;
        }
    }

    function onMouseMove(event, rect) {
        var mouseX = event.clientX - canvas.getBoundingClientRect().left;
        var mouseY = event.clientY - canvas.getBoundingClientRect().top;

        var isOverResizeHandle = isMouseInsideResizeHandle(rect, mouseX, mouseY);

        if (isOverResizeHandle) {
            // Set cursor style to 'nwse-resize' for the resize handle
            canvas.style.cursor = 'nwse-resize';
        } else if (isMouseInsideRectangle(rect, mouseX, mouseY)) {
            // Set cursor style to 'move' inside the rectangle
            canvas.style.cursor = 'move';
        } else {
            // Set cursor style to 'default' for other areas
            canvas.style.cursor = 'default';
        }
        
        
        if (rect.isDragging) {
            // Move the rectangle based on mouse position and offset
            rect.x = mouseX - rect.offsetX;
            rect.y = mouseY - rect.offsetY;

            drawRect(data);
        }

        if (rect.isResizing) {
            rect.width = mouseX - rect.x;
            rect.height = mouseY - rect.y;

            drawRect(data);
        }
    }

    function onMouseUp(rect) {
        rect.isDragging = false;
        rect.isResizing = false;
    }

    canvas.addEventListener('mousedown', function (event) {
        onMouseDown(event, rect1);
        onMouseDown(event, rect2);
        onMouseDown(event, rect3);
        onMouseDown(event, rect4);
        onMouseDown(event, rect5);
        onMouseDown(event, rect6);
    });

    canvas.addEventListener('mousemove', function (event) {
        onMouseMove(event, rect1);
        onMouseMove(event, rect2);
        onMouseMove(event, rect3);
        onMouseMove(event, rect4);
        onMouseMove(event, rect5);
        onMouseMove(event, rect6);
    });

    canvas.addEventListener('mouseup', function () {
        onMouseUp(rect1);
        onMouseUp(rect2);
        onMouseUp(rect3);
        onMouseUp(rect4);
        onMouseUp(rect5);
        onMouseUp(rect6);
    });

    drawRect(data);
};

function drawRect(data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;

    // Part a, score, -1 or 1
    const lineChart1 = new LineChart(data[0], rect1);
    lineChart1.drawLineChart();
    const barChart1 = new BarChart(data[0], 0, 10, rect1, false);
    barChart1.drawBarChart();
    const barChart1Frac = new BarChart(data[0], 0, 10, rect1, true);
    barChart1Frac.drawBarChart();  

    // Part b, abs 
    const lineChart2 = new LineChart(data[1], rect2);
    lineChart2.drawLineChart();
    const barChart2 = new BarChart(data[1], 1, 10, rect2, false);
    barChart2.drawBarChart();

    // Part b, rel
    const lineChart3 = new LineChart(data[2], rect3);
    lineChart3.drawLineChart();
    const barChart3 = new BarChart(data[2], 2, 10, rect3, false);
    barChart3.drawBarChart();
    const barChart3Frac = new BarChart(data[2], 2, 10, rect3, true);
    barChart3Frac.drawBarChart();

    // Part b, normalized
    const lineChart4 = new LineChart(data[3], rect4);
    lineChart4.drawLineChart();
    const barChart4 = new BarChart(data[3], 3, 10, rect4, false);
    barChart4.drawBarChart();

    // Part c, attack happens with variable probability p
    // The difference here is that p is not fixed and changes over systems but is constant for each attack
    const lineChart5 = new LineChart(data[4], rect5);
    lineChart5.drawLineChart();
    const barChart5 = new BarChart(data[4], 3, 10, rect5, false);
    barChart5.drawBarChart();

    // Part d, attack happens with variable probability p
    // The difference here is that p is not fixed and changes over systems and days
    const lineChart6 = new LineChart(data[5], rect6);
    lineChart6.drawLineChart();
    const barChart6 = new BarChart(data[5], 3, 10, rect6, false);
    barChart6.drawBarChart();


    //Stroke all rectangles
    ctx.strokeStyle = 'white';
    ctx.strokeRect(rect1.x, rect1.y, rect1.width, rect1.height);
    ctx.strokeRect(rect2.x, rect2.y, rect2.width, rect2.height);
    ctx.strokeRect(rect3.x, rect3.y, rect3.width, rect3.height);
    ctx.strokeRect(rect4.x, rect4.y, rect4.width, rect4.height);
    ctx.strokeRect(rect5.x, rect5.y, rect5.width, rect5.height);
    ctx.strokeRect(rect6.x, rect6.y, rect6.width, rect6.height);
}

// Executed everytime the values of one of the sliders changes or the page is reloaded
export function updateChart () {
    
    systemValue = document.getElementById('systemSlider').value;
    attackValue = document.getElementById('attackSlider').value;
    penetrationValue = document.getElementById('penetrationSlider').value;
    data = generateNumberOfTrajectories(systemValue, attackValue, penetrationValue);

    drawRect(data);
}

// Object LineChart with drawing method
class LineChart {
    constructor(data, rect) {
        this.data = data;
        this.rect = rect;
        this.ctx = ctx;
    }

    drawLineChart() {
        var chartWidth = this.rect.width - 60;
        var chartHeight = this.rect.height - 40;

        let flattenedData = this.data.flat(); // Flatten the multidimensional array
        let maxValue = flattenedData.reduce((max, point) => (point.Y > max ? point.Y : max), flattenedData[0].Y);
        let minValue = flattenedData.reduce((min, point) => (point.Y < min ? point.Y : min), flattenedData[0].Y);


        // Draw x and y axes with arrows
        this.ctx.beginPath();
        this.ctx.moveTo(this.rect.x + 40, this.rect.y + 20);
        this.ctx.lineTo(this.rect.x + 40, this.rect.y + this.rect.height - 20);
        this.ctx.lineTo(this.rect.x + this.rect.width - 20, this.rect.y + this.rect.height - 20);
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();

        // Draw arrowheads for x-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.rect.x + this.rect.width - 20, this.rect.y + this.rect.height - 20);
        this.ctx.lineTo(this.rect.x + this.rect.width - 30, this.rect.y + this.rect.height - 15); // Upper arrow part
        this.ctx.lineTo(this.rect.x + this.rect.width - 30, this.rect.y + this.rect.height - 25); // Lower arrow part
        this.ctx.closePath();
        this.ctx.fillStyle = 'white';
        this.ctx.fill();

        // Draw arrowheads for y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.rect.x + 40, this.rect.y + 20);
        this.ctx.lineTo(this.rect.x + 45, this.rect.y + 30); // Right arrow part
        this.ctx.lineTo(this.rect.x + 35, this.rect.y + 30); // Left arrow part
        this.ctx.closePath();
        this.ctx.fillStyle = 'white';
        this.ctx.fill();


        // Draw y-axis labels
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';

        const minYValue = Math.floor(minValue);
        const maxYValue = Math.ceil(maxValue);
        const valueRange = maxYValue - minYValue;
        const numberOfLabels = 10;
        const labelIncrement = valueRange / numberOfLabels;

        for (var i = 0; i <= numberOfLabels; i++) {
            var labelValue = minYValue + labelIncrement * i;
            var label = labelValue.toFixed(1);
            var y = this.rect.y + this.rect.height - 20 - ((labelValue - minYValue) / valueRange) * chartHeight;
            ctx.fillText(label, this.rect.x + 35, y);
        }

        // Draw data points and x-axis labels
        for (var j = 0; j < this.data.length; j++)
        {

            // Draw data line
            this.ctx.beginPath();
            this.ctx.moveTo(this.rect.x + 40, this.rect.y + this.rect.height - 20 - ((this.data[j][0].Y - minYValue) / valueRange) * chartHeight);
            this.ctx.textAlign = 'center';
            var step = chartWidth / (this.data[j].length - 1);
            for (var i = 1; i <= this.data[j].length; i++) {
                var x = this.rect.x + 40 + (this.data[j][i - 1].X) * step - step;
                var y = this.rect.y + this.rect.height - 20 - ((this.data[j][i - 1].Y - minYValue) / valueRange) * chartHeight;

                // Draw x-axis labels
                if ( j == 0 && (i % (Math.floor(this.data[j].length / 10)) === 0 || i === 1 || i === this.data[j].length)) {
                    var label = i;
                    ctx.fillText(label, x, this.rect.y + this.rect.height - 10);
                }

                // Connect data points with a line
                this.ctx.lineTo(x, y);
            }

            // Choose a different color for each trajectory
            var colors = [
                'red', 
                'blue', 
                'green', 
                'orange', 
                'yellow', 
                'purple', 
                'pink', 
                'brown', 
                'cyan', 
                'magenta', 
                'teal', 
                'lime', 
                'olive', 
                'navy', 
                'indigo'
            ];
            
            this.ctx.strokeStyle = colors[j % colors.length]; // Use modulo to cycle through colors
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }

        // Draw chart description
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.rect.name, this.rect.x + this.rect.width / 2, this.rect.y + 30);
    }
}

// Object BarChart with drawing method
class BarChart {
    constructor(data, mode, intervals, rect, certainPoint) {
        this.data = data;
        this.mode = mode;
        this.intervals = intervals;
        this.rect = rect;
        this.certainPoint = certainPoint; // If certain point is true, the BarChart is drawn on a predefined fractional position of the attack value, instead at the last abscissa
        this.attackValue = attackValue;
        this.systemValue = systemValue;
        this.ctx = ctx;
    }
    
    drawBarChart() {
        
        let attackValueFrac = this.attackValue * 0.1;
        let trajectoryEndValues = [];
        let trajectoryFracValues = [];
        let minValue = 0;
        let maxValue = 0;
        let frequency = [];
        let flattenedData = this.data.flat(); // Flatten the multidimensional array

        for (let i = 0; i < this.systemValue; i++) {    
            trajectoryFracValues.push(this.data[i][Math.floor(attackValueFrac) - 1].Y);
            trajectoryEndValues.push(this.data[i][this.attackValue - 1].Y);
        }

        // This is adaptable based on the necessary boundaries for the intervals given by the user, distinguished by mode (score, cumulated & normalized, relative)
        if (this.mode == 0)
        {  
            maxValue = flattenedData.reduce((max, point) => (point.Y > max ? point.Y : max), flattenedData[0].Y);
            minValue = flattenedData.reduce((min, point) => (point.Y < min ? point.Y : min), flattenedData[0].Y);
        }
        else if (this.mode == 1 || this.mode == 3)
        {
            minValue = 0;
            maxValue = this.attackValue;
        }
        else if (this.mode == 2)
        {
            minValue = 0;
            maxValue = 1;
        }
        
        if (this.certainPoint)
        {
            frequency = countFrequency(trajectoryFracValues, this.intervals, minValue, maxValue);
        }
        else 
        {
            frequency = countFrequency(trajectoryEndValues, this.intervals, minValue, maxValue);
        }

        // Calculate and draw bars
        const barWidth = 10;
        let chartWidth = this.rect.width - 60;
        let chartHeight = this.rect.height - 40;
        let step = chartWidth / (this.data[0].length - 1);

        for (let i = 0; i < frequency.length; i++) {
            const barLength = (frequency[i] / Math.max(...frequency)) * chartWidth * 0.4;
            const y = (this.rect.y + chartHeight - (chartHeight/(this.intervals))*(i));
            let x;
            
            if (this.certainPoint)
            {
                x = (this.rect.x + 40 + (this.data[0][Math.floor(attackValueFrac) - 1].X) * step - step);
            }
            else 
            {
                x = (this.rect.x + this.rect.width - barLength - 20);
            }
            
            this.ctx.fillStyle = 'rgba(0, 128, 0, 0.8)'; // Green color with 50% opacity
            this.ctx.fillRect(x, y, barLength, barWidth);


            // Draw value near the bar
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            
            if (frequency[i] != 0) 
            {
                if (this.certainPoint)
                {
                    this.ctx.fillText(frequency[i], x + barLength + 10, y + barWidth / 2);
                }
                else 
                {
                    this.ctx.fillText(frequency[i], x - 10, y + barWidth / 2);
                }       
            }
        }

        
        if (this.certainPoint)
        {
            // Draw y axes with arrows 
            this.ctx.beginPath();
            this.ctx.moveTo(this.rect.x + 40 + (this.data[0][Math.floor(attackValueFrac) - 1].X) * step - step, this.rect.y + 20);
            this.ctx.lineTo(this.rect.x + 40 + (this.data[0][Math.floor(attackValueFrac) - 1].X) * step - step, this.rect.y + this.rect.height - 20);
            this.ctx.strokeStyle = 'rgba(0, 128, 0, 0.8)'; // Green color with 50% opacity
            this.ctx.stroke();

            // Draw arrowheads for y-axis
            this.ctx.beginPath();
            this.ctx.moveTo(this.rect.x + 40 + (this.data[0][Math.floor(attackValueFrac) - 1].X) * step - step , this.rect.y + 20);
            this.ctx.lineTo(this.rect.x + 40 + (this.data[0][Math.floor(attackValueFrac) - 1].X) * step - step - 5, this.rect.y + 30); // Right arrow part
            this.ctx.lineTo(this.rect.x + 40 + (this.data[0][Math.floor(attackValueFrac) - 1].X) * step - step + 5 , this.rect.y + 30); // Left arrow part
            this.ctx.closePath();
            this.ctx.fillStyle = 'rgba(0, 128, 0, 0.8)'; // Green color with 50% opacity
            this.ctx.fill();

            // Draw y-axis labels
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = 'white';
            this.ctx.textBaseline = 'middle';
        }
        else 
        {
            // Draw y axes with arrows
            this.ctx.beginPath();
            this.ctx.moveTo(this.rect.x + this.rect.width - 20, this.rect.y + 20);
            this.ctx.lineTo(this.rect.x + this.rect.width - 20, this.rect.y + this.rect.height - 20);
            this.ctx.strokeStyle = 'rgba(0, 128, 0, 0.8)'; // Green color with 50% opacity
            this.ctx.stroke();

            // Draw arrowheads for y-axis
            this.ctx.beginPath();
            this.ctx.moveTo(this.rect.x + this.rect.width - 20, this.rect.y + 20);
            this.ctx.lineTo(this.rect.x + this.rect.width - 25, this.rect.y + 30); // Right arrow part
            this.ctx.lineTo(this.rect.x + this.rect.width - 15, this.rect.y + 30); // Left arrow part
            this.ctx.closePath();
            this.ctx.fillStyle = 'rgba(0, 128, 0, 0.8)'; // Green color with 50% opacity
            this.ctx.fill();

            // Draw y-axis labels
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = 'white';
            this.ctx.textBaseline = 'middle';
        }

        // Draw interval values near the y-axis of the BarChart
        let intervalSize = (maxValue - minValue) / this.intervals;
        for (var i = 0; i < frequency.length; i++) {
            let lowerBound = i * intervalSize + minValue;
            let upperBound = (i + 1) * intervalSize + minValue;
            

            if (i == frequency.length - 1)
            {
                var label = "[" + lowerBound.toFixed(2) + ", " + upperBound.toFixed(2) + "]";
            }
            else
            {
                var label = "[" + lowerBound.toFixed(2) + ", " + upperBound.toFixed(2) + ")";
            }
            const y = (this.rect.y + chartHeight - (chartHeight/(this.intervals))*(i));

            if (this.certainPoint)
            {
                this.ctx.fillText(label, this.rect.x + 40 + (this.data[0][Math.floor(attackValueFrac) - 1].X) * step - step + 5, y + barWidth / 2);
            }
            else
            {
                this.ctx.fillText(label, this.rect.x + chartWidth + 35, y + barWidth / 2);
            }
            
        }
    }
}