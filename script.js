// CANVAS SETUP

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia'

// MOUSE INTERACTIVITY

let canvasPosition = canvas.getBoundingClientRect(); // Measure current size and position of canvas element
console.log(canvasPosition)

const mouse = {
    x: canvas.width / 2,  // To initiate in the center of the canvas
    y: canvas.height / 2,
    click: false
};

canvas.addEventListener('mousedown', function(event){

    mouse.click = true;
    mouse.x = event.x - canvasPosition.left; // Adjustment to have the coordinates beginning at 0, 0
    mouse.y = event.y - canvasPosition.top; // Adjustment to have the coordinates beginning at 0, 0

});

canvas.addEventListener('mouseup', function(){

    mouse.click = false;

});

// PLAYER

class Player {
    constructor() {
        this.x = canvas.width / 2; // Initial coordinates in the center of the canvas when the player stars moving
        this.y = canvas.height / 2;
        this.radius = 50; // To draw the circle of the player
        this.angle = 0; // We will use this later to rotate player towards current mouse position
        this.frameX = 0;
        this.frameY = 0; // Coordinates sprite sheet of the badger animation; Later review
        this.frame = 0; // Later review for animation
        this.spriteWidth = 498;  // Later review for animation
        this.spriteHeight = 327; // Later review for animation
    }

    update() {  // To update player position to move the player towards the mouse -> compare current position with mouse position
        const dx = this.x  - mouse.x;   // Distance in the horizontal x-axis
        const dy = this.y - mouse.y;    // Distance in the vertical y-axis

        if (mouse.x != this.x) {
            this.x -= dx / 50;
        }                           // If there's no equality, update this.positions(x, y)

        if (mouse.y != this.y) {
            this.y -= dy / 50;  // divided so we can change movement speed
        }
    
    }

    draw() { 

        if (mouse.click) {
            ctx.lineWidth = 0.2; // Draw a line so we can see the direction of movement of the player
            ctx.beginPath();
            ctx.moveTo(this.x, this.y); // Start point = current position
            ctx.lineTo(mouse.x, mouse.y); // End point of the line = mouse click position
            ctx.stroke() // Will connect the two points
        }

        ctx.fillStyle = 'red'; // Circle red
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Create a circle
        ctx.fill();
        ctx.closePath();
    }
}

const player = new Player();  // Create a new player object

// HONEY

// SNAKES

// ANIMATION LOOP

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height) // To clear the entire canvas from old paint between every animation frame
    player.update(); // Calculate player position
    player.draw(); // Draw the line and te circle
    requestAnimationFrame(animate); // Animation loop, recursion when function calls itself over and over in line 90
    
};

animate(); // Invoke the function

