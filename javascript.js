// this is first external JavaScript
//Wooooooooooooooow

// ***********************************
// Declarations
// ***********************************

// defining constant cvs
// selecting my canvas created in html file
const cvs = document.getElementById("mycanvas");

// defining constant ctx
// specify a 2d canvas to get methods and properties for drawing on canvas
const ctx = cvs.getContext("2d");

// this is block declaration let v var that can be used globally
// https://www.w3schools.com/js/js_let.asp
let frames = 0;

// test RR and endCountRR
var endCountRR = 0;

// creating sprite image to be used to draw on canvas
const sprite = new Image();
sprite.src = "img/sprite.png";

// GAME STATE 
const gamestate = {
  Current: 0,
  Start: 0,
  Play: 1,
  Over: 2
}

// RR CONTROL THE GAME with Click
//document.addEventListener("click", function(evt){
  //bird.flap();
//});

// CONTROL THE GAME
var myKeys = []; // this array will keep track of what keys are pressed
myKeys[32] = 0; // spacebar
myKeys[37] = 0; // left arrow key
myKeys[38] = 0; // up arrow key
myKeys[39] = 0; // right arrow key
myKeys[40] = 0; // down arrow key

// listen for keys down
// RR was document
document.addEventListener("keydown", function(evt){
  // if spacebar is pressed
  if (evt.keyCode == 32){
    myKeys[evt.keyCode] = 1;
    
    // switch statement to determine which gameState and increment if needed
    // Start to Play to Over
    switch(gamestate.Current){
      // if at Start change to Play
      case gamestate.Start:
        gamestate.Current = gamestate.Play;
        break;

      // if at Play do nothing
      case gamestate.Play:
        break;

      // if at Over change to Start
      case gamestate.Over:
        gamestate.Current = gamestate.Start;

        // reset score counter RR
        endCountRR = 0;

        // reset score
        bird.score = 0;

        break;      
    }
  }
  
  // if left arrow key is pressed
  if (evt.keyCode == 37){
    myKeys[evt.keyCode] = 1;
  }

  // if up arrow key is pressed
  if (evt.keyCode == 38){
    myKeys[evt.keyCode] = 1;
  }

  // if right arrow key is pressed
  if (evt.keyCode == 39){
    myKeys[evt.keyCode] = 1;
  }

  // if down arrow key is pressed
  if (evt.keyCode == 40){
    myKeys[evt.keyCode] = 1;
  }
});

// listen for key up
document.addEventListener("keyup", function(evt){
  // if spacebar is released
  if (evt.keyCode == 32){
    myKeys[evt.keyCode] = 0;
  }
  
  // if left arrow key is released
  if (evt.keyCode == 37){
    myKeys[evt.keyCode] = 0;
  }

  // if up arrow key is released
  if (evt.keyCode == 38){
    myKeys[evt.keyCode] = 0;
  }

  // if right arrow key is released
  if (evt.keyCode == 39){
    myKeys[evt.keyCode] = 0;
  }

  // if down arrow key is released
  if (evt.keyCode == 40){
    myKeys[evt.keyCode] = 0;
  }
});


// create object with name for each item to be drawn
// bird
const bird = {
  // animation array to display different sprites to animate movement
  animation: [
    {sX: 276, sY: 112}, // index 0
    {sX: 276, sY: 139}, // index 1 bird will go up 1 px
    {sX: 276, sY: 164}, // index 2 bird will go down 1 px
    {sX: 276, sY: 139} // index 3 bird will go up 1 px - this is the second sprite repeated before going back to first
  ],

  sX: 276,
  sY: 112,
  w: 34,
  h: 26,
  x: 50,
  y: 77,

  //RR come back to this
  prevxpos: 0, // keep track of prev x pos RR del later
  prevypos: 0, // keep track of prev y pos RR del later

  radius: 12, // this is the radius of the circle bird used for pipes collision detection

  frame: 0, // this is for the animation array
  period: 7, // this is how fast the bird flaps
  speed: 0, // this is how fast the bird moves up or down
  gravity: 0.07, // this is the gravity pulling the bird down
  jump: 1.47, // number of pixels that jump up

  score: 0, // this is to keep score

  //flap method
  flap: function(){
    this.speed = - this.jump;
  },

  //moveDown method
  moveDown: function(){
    this.speed = this.jump * 1.5;
  },

  //moveRight method
  moveRight: function(){
    this.x = this.x + 2;
  },

  //moveLeft method
  moveLeft: function(){
    this.x = this.x - 2;
  },

  // update method for updating frame and position
  updateObj: function(){
    // use modulus to return remainder number
    // only incriment bird frame by 1 every 5 game frames
    // 5 will be replaced by period variable to make the speed adjustable
    // greater period number will make the bird flap more slowly
    if (frames % this.period == 0) {
      // increment bird frame
      this.frame = this.frame + 1;
      
      // use modulus to return remaineder which will be the index of the animation array - this is a little tricky
      // use the length of the animation array to determine what the modulus should be
      this.frame = this.frame % this.animation.length;  
    }

    // check pipe collision first AND score
    for (let i = 0; i < pipes.position.length; i++){
      // local variables
      let p = pipes.position[i]; // pipe array entry with x, y and pass values

      // collision detection for the pipes
      if (
          // center collision point top pipe
          (this.x + this.radius >= p.x &&
           this.x - this.radius <= p.x + pipes.w &&
           this.y + this.radius >= p.y &&
           this.y - this.radius <= p.y + pipes.h)
           ||
          // top collision point top pipe
          (this.x + this.radius >= p.x &&
           this.x + this.radius <= p.x + pipes.w &&
           this.y               >= p.y &&
           this.y               <= p.y + pipes.h)
           ||
          // center collision point bottom pipe
          (this.x + this.radius >= p.x &&
           this.x - this.radius <= p.x + pipes.w &&
           this.y + this.radius >= p.y + pipes.h + pipes.gap &&
           this.y - this.radius <= p.y + pipes.h + pipes.gap + pipes.h)
           ||
          // bottom collision point bottom pipe
          (this.x               >= p.x &&
           this.x               <= p.x + pipes.w &&
           this.y + this.radius >= p.y + pipes.h + pipes.gap &&
           this.y + this.radius <= p.y + pipes.h + pipes.gap + pipes.h)
         ){
           gamestate.Current = gamestate.Over;
        }

      // check if the pipe has not been passed
      if (p.passed == 0){
        // did the bird pass the pipe
        if (this.x - this.radius >= p.x + pipes.w){
        p.passed = 1; // set flag if passed
        this.score = this.score + 1; // increment score
        }
      }
    }

    // this is to move the bird up
    if (myKeys[32] == 1 || myKeys[38]) {
      if (gamestate.Current == gamestate.Play){
        bird.flap();
      }
    }

    // this is to move the bird down
    if (myKeys[40] == 1) {
      bird.moveDown();
    }

    // this is to move the bird to the right
    if (myKeys[39] == 1) {
      if (gamestate.Current == gamestate.Play){
        bird.moveRight();
      }
    }

    // this is to move the bird to the left
    if (myKeys[37] == 1) {
      if (gamestate.Current == gamestate.Play){
        bird.moveLeft();
      }
    }
    
    // this is to animate the y position
    if (gamestate.Current == gamestate.Start){
      // keep bird at top with speed 0
      this.x = 50;
      this.y = 77;
      this.speed = 0;        
    }
    else if (gamestate.Current == gamestate.Play){
      this.speed = this.speed + this.gravity;
      this.y = this.y + this.speed;
    }
    else {
      // drop straight down and faster
      this.speed = 0;
      this.speed = this.speed + (this.gravity * 100);
      this.y = this.y + this.speed;
    }

    //this is so that the lowest that the bird can go is the ground (foreground)
    if (this.y + this.h/2 >= cvs.height-fg.h){
      this.y = cvs.height - fg.h - this.h/2;
    }

    //this is so that the highest that the bird can go is the top of the canvas
    if (this.y - this.h/2 <= 0){
      this.y = 0 + this.h/2;
    }

    //this is so that the most right that the bird can go is the end of canvas
    if (this.x + this.w/2 >= cvs.width){
      this.x = cvs.width - this.w/2;
    }

    //this is so that the most left that the bird can go is the beginning of the canvas
    if (this.x - this.w/2 <= 0){
      this.x = 0 + this.w/2;
    }

  },

  // draw method
  drawObj: function(){
    // variable to equal the sprite used in array
    let birdAnimation = this.animation[this.frame];

    // this is to draw the image onto the canvas
    // source image, source x, source y, source width, source height, destination x, dest y, dest width, dest height
    // using birdAnimation sX and sY from array
    // centering bird by subtracting half of its width and height

    ctx.drawImage(sprite, birdAnimation.sX, birdAnimation.sY, this.w, this.h, this.x -this.w/2, this.y - this.h/2, this.w, this.h); 
  }
}

// background
const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 228,
  x: 0,
  y: cvs.height - 228, // this takes into account the canvas size
  frame: 0, // this is for the animation array
  period: 7, // this is how fast the background moves
  move: -0.7, // this is the number of pixels for the background to move

  // update method for updating frame and position
  updateObj: function(){
    // count frames to get update frame for object
    if (frames % this.period == 0) {
      // increment background frame
      this.frame = this.frame + 1;
      this.x = this.x + this.move;

      if (this.x + this.w <= 0){
        this.x = 0;
      } 
    }
  },

  drawObj: function(){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h); 

    // this is a second draw because the sprite file item width is too short for the canvas
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);   

    // this is a third draw because the background is not exactly the same that when interrupting halfway through it does not match - comment out and change x reset logic to see
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w + this.w, this.y, this.w, this.h);   
  }
}

// foreground
const fg = {
  sX: 276, // end 499
  sY: 0, // end 111
  w: 223,
  h: 111,
  x: 0,
  y: cvs.height - 111, // cannot use h here instead use the number
  frame: 0, // this is for the animation array
  period: 7, // this is how fast the foreground moves
  move: -4, // this is the number of pixels for the foreground to move

  // this is an array to keep track of 3 fg pieces
  position: [0, 0 + 223, 0 + 223 + 223], // this is an empty array to hold the fg position

  // update method for updating frame and position
  updateObj: function(){
    // count frames to get update frame for object
    if (frames % this.period == 0) {
      // increment foreground frame
      this.frame = this.frame + 1;

      //update fg positions
      this.position[0] = this.position[0] + this.move;
      this.position[1] = this.position[1] + this.move;
      this.position[2] = this.position[2] + this.move;

      //check that position has not gone beyond the canvas
      for (let i = 0; i < this.position.length; i++){
        if (this.position[i] + this.w <= 0){
          // move fg position to the end
          this.position[i] = this.position[i] + this.w + this.w + this.w;
        }
      }
    }  
  },


  drawObj: function(){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.position[0], this.y, this.w, this.h); 
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.position[1], this.y, this.w, this.h); 
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.position[2], this.y, this.w, this.h); 
  }
}

// pipes
const pipes = {
  bottom: {
    sX: 502, // end 553
    sY: 0 // end 399
  },  

  top: {
    sX: 554, // end 605
    sY: 0 // end 399
  },

  w: 51,
  h: 399,

  gap: 85,
  maxYPos: -150, // the max y position of the top pipe
  position: [], // this is an empty array to hold the random pipe positions so it can be redrawn correctly

  frame: 0, // this is for the animation array
  period: 5, // this is how fast the pipes move
  move: -2, // this is the number of pixels for the foreground to move

  // update method for updating frame and position
  updateObj: function(){
    // only update pipes if game is in play
    if (gamestate.Current == gamestate.Play){
    // generate new y position for new pipe every period*num frames
    // num is pipe spacing
      if (frames % (this.period * 100) == 0){
        // here we will ad an object that has x and y for each array entry
        this.position.push(
          {
          x: cvs.width, // start at end of canvas
          y: this.maxYPos * (Math.random() + 1), // random gives number between 0 and 1
          passed: 0 // keep track if pipe is passed for score
          }
        );
      }
    }

    // clear pipes if game state set to start
    if (gamestate.Current == gamestate.Start){
      // this is to clear the array so that when you restart the pipes are erased
      this.position.length = 0;
    }
    
    for (let i = 0; i < this.position.length; i++){
    // count frames to get update frame for object
      if (frames % this.period == 0) {
        // check to see if the bird is inside the top pipe
        // collision detection for the pipes
        let p = this.position[i]; // pipe array entry with x and y values        

        if ( 
            // top pipe
            (bird.x + bird.radius >= p.x &&
             bird.x - bird.radius <= p.x + this.w &&
             bird.y + bird.radius >= p.y &&
             bird.y - bird.radius <= p.y + this.h)
             ||
            // bottom pipe
            (bird.x + bird.radius >= p.x &&
             bird.x - bird.radius <= p.x + this.w &&
             bird.y + bird.radius >= p.y + this.h + this.gap &&
             bird.y - bird.radius <= p.y + this.h + this.gap + this.h)
           ){
             gamestate.Current = gamestate.Over;
             this.lastxpos = p.x - bird.radius; // position to draw the bird if there is a collision
        } 

        // increment pipes frame
        this.frame = this.frame + 1;
        this.position[i].x = this.position[i].x + this.move;

        // remove pipes if they have left the canvas area 
        if (this.position[i].x + this.w <= 0) {
          this.position.shift(); // this will remove the first entry in the array
        }
      }
    }
  },

  drawObj: function(){
    // draw each pipe created in position array
    for (let i = 0; i < this.position.length; i++){
      // draw top pipe
      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, this.position[i].x, this.position[i].y, this.w, this.h); 

      // draw bottom pipe
      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, this.position[i].x, this.position[i].y + this.h + this.gap, this.w, this.h); 
    }
  }
}

// get ready start splash screen
const startsplash = {
  sX: 0, // end 174
  sY: 228, // end 387
  w: 174,
  h: 159,
  x: cvs.width/2 - 174/2,
  y: cvs.height/5, // top one fifth

  drawObj: function(){
    // only draw if gamestate is at Start
    if (gamestate.Current == gamestate.Start){
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
}

// game over splash screen
const gameoversplash = {
  sX: 174, // end 400
  sY: 228, // end 427
  w: 226,
  h: 199,
  x: cvs.width/2 - 226/2,
  y: cvs.height/5, // top one fifth

  drawObj: function(){
    // only draw if gamestate is at Over
    if (gamestate.Current == gamestate.Over){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

    // RR score
    ctx.fillStyle = "#1c1c1c"; //remember to change fillstyle when drawing something new
    ctx.font = "70px Arial";
    // write score at x345ish ybot323ish
    ctx.fillText(bird.score,this.x + 180,this.y + 107);
    }
  }
}


// ***********************************
// FUNctions Defined
// ***********************************

// this function will handle all of the drawing on the canvas
function draw(){
  // initial to clear the canvas before drawing new frame background color
  ctx.fillStyle = "#e5e5ce"; //#1c1c1c

  // create rectangle with that fill
  ctx.fillRect(0, 0, cvs.width, cvs.height); //x start, y start, x end, y end

  // draw first item - background
  bg.drawObj();

  // draw second item - pipes
  pipes.drawObj();

  // draw third item - foreground
  fg.drawObj();

  // draw start splash screen
  startsplash.drawObj();

  // draw game over splash screen
  gameoversplash.drawObj();


  // RRRRRRRRRRRRRRRRRRRRRRRRRRRR
  // RRRRRRRRRRRRRRRRRRRRRRRRRRRR
  // RRRRRRRRRRRRRRRRRRRRRRRRRRRR
  // display frame number RRdebug

  //ctx.fillStyle = "#000000"; //remember to change fillstyle when drawing something new
  //ctx.font = "30px Arial";
  //ctx.fillText(frames,100,100);

  // display frame number RRdebug
  
  ctx.fillStyle = "#000000"; //remember to change fillstyle when drawing something new
  ctx.font = "30px Arial";
  //ctx.fillText(fg.x,100,200);
  //ctx.fillText(bg.x.toFixed(1),100,225); //toFixed so that will only show one decimal

  //ctx.fillText("pipe array",100,250);
  //ctx.fillText(pipes.position.length,250,250);

  // post score when ground is touched
  // if endCount not set

  if (endCountRR == 0) {
    // if bird has hit the ground
    if (bird.y + bird.h/2 >= cvs.height-fg.h) {
      endCountRR = frames; // set end count

      // set gamestate to game over
      gamestate.Current = gamestate.Over;
      }
  }

  // RR score
  //ctx.fillText(bird.score,100,200);

  // write score if end
  //if (endCountRR != 0) {
    //ctx.fillText(bird.score,100,300);
  //}
  // RRRRRRRRRRRRRRRRRRRRRRRRRRRR
  // RRRRRRRRRRRRRRRRRRRRRRRRRRRR
  // RRRRRRRRRRRRRRRRRRRRRRRRRRRR


  // draw last item - bird
  bird.drawObj();
}

function update(){
//dont update if the gamestate has reached gameover
  if (gamestate.Current != gamestate.Over){
    // update first item - background
    bg.updateObj();

    // update second item - pipes
    pipes.updateObj();

    // update third item - foreground
    fg.updateObj();
  }

  // update last item - bird
  bird.updateObj();
}

// loop will call the draw function
// we need a loop function because the game has to be update every second
function loop(){
  // this is to update the position of items on canvas
  update();

  // we need to draw continously to update the game
  draw();

  // increase frames by 1 to keep track of how many frames are drawn to canvas
  frames = frames + 1;

  // call back to loop function that will be called on average 50 times per sec
  // this allows for smooth code and will only redraw when the machine is ready - http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
  requestAnimationFrame(loop);
}



// ***********************************
// Script
// ***********************************

// will call loop function just one time
loop();