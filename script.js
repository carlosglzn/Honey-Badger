// CANVAS SETUP

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
let gameOver = false;
ctx.font = '40px Georgia'

// MOUSE INTERACTIVITY

let canvasPosition = canvas.getBoundingClientRect(); // Measure current size and position of canvas element

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
            this.x -= dx / 30;
        }                           // If there's no equality, update this.positions(x, y)

        if (mouse.y != this.y) {
            this.y -= dy / 30;  // divided so we can change movement speed
        }
    
    }

    draw() {  // Draw Player

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

const honeyArray = []

class Honey {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100; // All the honey starts at the bottom of the canvas
        this.radius = 50; // All hone have the same size
        this.speed = Math.random() * 5 + 1; // Random between 1 and 6
        this.distance;
        this.counted = false;
    }

    update() {  // Behavior Honey
        this.y -= this.speed; // Here the honey moves from the bottom of the canvas to the top
        const dx = this.x - player.x;   
        const dy = this.y - player.y;                   // Calculate distance between player and honey
        this.distance = Math.sqrt(dx * dx + dy * dy); // Pythagorean Theorem: a^2 + b^2 = c
    }

    draw() {
        ctx.fillStyle = 'blue';  // Draw Honey
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

function handleHoney() {
    if (gameFrame % 50 === 0) {  // Run this code every 50 frames
        honeyArray.push(new Honey());
    }

    for (let i = 0; i < honeyArray.length; i++) {  // Loop in honey array

        honeyArray[i].update(); // Draw and update the position of the honey
        honeyArray[i].draw();
        
        if (honeyArray[i].y < 0 - honeyArray[i].radius * 2) { // If the honey leaves the canvas... 
            honeyArray.splice(i, 1); // remove the honey from the array. In other loop to solve the blinking for now
            i --;
        } else if (honeyArray[i].distance < honeyArray[i].radius + player.radius) {
           
          if (!honeyArray[i].counted) {
                score ++;
                honeyArray[i].counted = true;   // If there's a collision, add 1 to the counter, and eliminate the honey in the array.
                honeyArray.splice(i, 1);  
                i --;  
            }
        }
        
    }

}



// SNAKES

class Enemy {
    constructor() {
        this.x = canvas.width + 200;   // Starting point
        this.y = Math.random() * canvas.height;  // Random from the right of the canvas
        this.radius = 60;
        this.speed = Math.random() * 2 + 2; // Random between 2 and 4
        this.frame = 0
        this.frameX = 0; // Later review for animation
        this.frameY = 0; // Later review for animation
        this.spriteWidth = 418; // Later review for animation
        this.spriteHeight = 397; // Later review for animation

    }

    draw() {                        // Draw enemy
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Draw the enemy
        ctx.fill();

        
    }

    update() {                  // Behavior of the enemy
        this.x -= this.speed
        if (this.x < 0 - this.radius * 2) { // If the enemy leaves the canvas screen to the left...
            this.x = canvas.width + 200;
            this.y = Math.random() * canvas.height;  // Change position random
            this.speed = Math.random() * 2 + 2;
        }

        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy); // Pythagorean Theorem: a^2 + b^2 = c

        if (distance < this.radius + player.radius) {
            handleGameOver();                           // If collision, game over!
        }
    }
}

const enemy1 = new Enemy(); // Create enemy
const enemy2 = new Enemy()


function handleEnemy() {
    
    enemy1.draw();
    enemy2.draw();
    enemy1.update();
    enemy2.update();
    
}

function handleGameOver() {         // Game Over Function
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER! Your score was: ' + score, 110, 250);
    gameOver = true;

}


// ANIMATION LOOP / Motor

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height) // To clear the entire canvas from old paint between every animation frame
    handleHoney()    // Call Honey
    player.update(); // Calculate player position
    player.draw(); // Draw the line and the circle
    handleEnemy() // Call enemy
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50); // Print the score in canvas
    gameFrame ++;  // Frame counter
    if (!gameOver) {
        requestAnimationFrame(animate); // Animation loop, recursion when function calls itself over and over
    }
    
};


animate(); // Invoke the function



window.addEventListener('rezise', function(){
    canvasPosition = canvas.getBoundingClientRect();  // Register mouse position when we rezise the window.
})