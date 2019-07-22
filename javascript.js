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

const spritegoodguy = new Image();
spritegoodguy.src = "img/sprite goodguy.png";

const spritemessage = new Image();
spritemessage.src = "img/sprite message.png";

// creating sound to be used to draw on canvas
// need to create a variable for each sound file
const mysound = new Audio();
const scoresound = new Audio();
const endsound = new Audio();

mysound.src = "audio/99sounds loop_008.wav";
scoresound.src ="audio/Generdyn_HITS_04.wav";
endsound.src ="audio/Generdyn_HITS_14.wav";

// GAME STATE 
const gamestate = {
  Current: 0,
  Start: 0,
  Play: 1,
  Over: 2
}

// RR CONTROL THE GAME with Click
//document.addEventListener("click", function(evt){
  //goodguy.bounce();
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
        mysound.loop = true; //RR set audio to loop
	mysound.play(); //RR play background sound remove

        // draw the message for instructions
        messagesplash.drawnum=0;
        messagesplash.drawflag=1;

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
        goodguy.score = 0;

        // reset goodsprite animation
        goodguy.stopanimation = 0;

        // reset game frames
        frames = 0;

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
// goodguy
const goodguy = {
  // animation array to display different sprites to animate movement
  animation: [
    {sX: 0, sY: 0}, // index 0
    {sX: 0, sY: 26}, // index 1 goodguy will go up 1 px
    {sX: 0, sY: 52}, // index 2 goodguy will go down 1 px
    {sX: 0, sY: 26} // index 3 goodguy will go up 1 px - this is the second sprite repeated before going back to first
  ],

  sX: 0,
  sY: 0,
  w: 34,
  h: 26,
  x: 50,
  y: 77,

  //RR come back to this
  prevxpos: 0, // keep track of prev x pos RR del later
  prevypos: 0, // keep track of prev y pos RR del later

  radius: 12, // this is the radius of the circle goodguy used for walls collision detection

  frame: 0, // this is for the animation array
  period: 7, // this is how fast the goodguy bounces
  speed: 0, // this is how fast the goodguy moves up or down
  gravity: 0.07, // this is the gravity pulling the goodguy down
  jump: 1.47, // number of pixels that jump up

  score: 0, // this is to keep score

  stopanimation: 0, // for when the goodsprite touches the ground

  //bounce method
  bounce: function(){
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

    // only if goodguy hasnt touched ground from game over
    if (this.stopanimation == 0){    
      // use modulus to return remainder number
      // only incriment goodguy frame by 1 every 5 game frames
      // 5 will be replaced by period variable to make the speed adjustable
      // greater period number will make the goodguy bounce more slowly
      if (frames % this.period == 0) {
        // increment goodguy frame
        this.frame = this.frame + 1;
      
        // use modulus to return remaineder which will be the index of the animation array - this is a little tricky
        // use the length of the animation array to determine what the modulus should be
        this.frame = this.frame % this.animation.length;  
      }
    }

    // check wall collision first AND score
    for (let i = 0; i < walls.position.length && gamestate.Current != gamestate.Over; i++){
      // local variables
      let p = walls.position[i]; // wall array entry with x, y and pass values

      // collision detection for the walls
      if (
          // center collision point top wall
          (this.x + this.radius >= p.x &&
           this.x - this.radius <= p.x + walls.w &&
           this.y + this.radius >= p.y &&
           this.y - this.radius <= p.y + walls.h)
           ||
          // top collision point top wall
          (this.x + this.radius >= p.x &&
           this.x + this.radius <= p.x + walls.w &&
           this.y               >= p.y &&
           this.y               <= p.y + walls.h)
           ||
          // center collision point bottom wall
          (this.x + this.radius >= p.x &&
           this.x - this.radius <= p.x + walls.w &&
           this.y + this.radius >= p.y + walls.h + walls.gap &&
           this.y - this.radius <= p.y + walls.h + walls.gap + walls.h)
           ||
          // bottom collision point bottom wall
          (this.x               >= p.x &&
           this.x               <= p.x + walls.w &&
           this.y + this.radius >= p.y + walls.h + walls.gap &&
           this.y + this.radius <= p.y + walls.h + walls.gap + walls.h)
         ){

           // call function to end game
           endgame();
        }

      // check if the wall has not been passed
      if (p.passed == 0){
        // did the goodguy pass the wall
        if (this.x - this.radius >= p.x + walls.w){
          p.passed = 1; // set flag if passed
          this.score = this.score + 1; // increment score
          scoresound.play(); //play score sound
        }
      }
    }

    // this is to move the goodguy up
    if (myKeys[32] == 1 || myKeys[38]) {
      if (gamestate.Current == gamestate.Play){
        goodguy.bounce();
      }
    }

    // this is to move the goodguy down
    if (myKeys[40] == 1) {
      goodguy.moveDown();
    }

    // this is to move the goodguy to the right
    if (myKeys[39] == 1) {
      if (gamestate.Current == gamestate.Play){
        goodguy.moveRight();
      }
    }

    // this is to move the goodguy to the left
    if (myKeys[37] == 1) {
      if (gamestate.Current == gamestate.Play){
        goodguy.moveLeft();
      }
    }
    
    // this is to animate the y position
    if (gamestate.Current == gamestate.Start){
      // keep goodguy at top with speed 0
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

    //this is so that the lowest that the goodguy can go is the ground (foreground)
    if (this.y + this.h/2 >= cvs.height-fg.h){
      this.y = cvs.height - fg.h - this.h/2;
      
      // add check if game over stop animating
      if (gamestate.Current == gamestate.Over){
        this.stopanimation = 1; // set this to stop animation
      }
    }

    //this is so that the highest that the goodguy can go is the top of the canvas
    if (this.y - this.h/2 <= 0){
      this.y = 0 + this.h/2;
    }

    //this is so that the most right that the goodguy can go is the end of canvas
    if (this.x + this.w/2 >= cvs.width){
      this.x = cvs.width - this.w/2;
    }

    //this is so that the most left that the goodguy can go is the beginning of the canvas
    if (this.x - this.w/2 <= 0){
      this.x = 0 + this.w/2;
    }

  },

  // draw method
  drawObj: function(){
    // variable to equal the sprite used in array
    let goodguyAnimation = this.animation[this.frame];

    // this is to draw the image onto the canvas
    // source image, source x, source y, source width, source height, destination x, dest y, dest width, dest height
    // using goodguyAnimation sX and sY from array
    // centering goodguy by subtracting half of its width and height

    ctx.drawImage(spritegoodguy, goodguyAnimation.sX, goodguyAnimation.sY, this.w, this.h, this.x -this.w/2, this.y - this.h/2, this.w, this.h); 
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

// walls
const walls = {
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
  maxYPos: -150, // the max y position of the top wall
  position: [], // this is an empty array to hold the random wall positions so it can be redrawn correctly

  frame: 0, // this is for the animation array
  period: 5, // this is how fast the walls move
  move: -2, // this is the number of pixels for the foreground to move

  pause: 0, // this is to pause the wall drawing to show messages on the screen

  // update method for updating frame and position
  updateObj: function(){
    // only update walls if game is in play and not paused
    if (gamestate.Current == gamestate.Play && this.pause == 0){
    // generate new y position for new wall every period*num frames
    // num is wall spacing
      if (frames % (this.period * 100) == 0){
        // here we will ad an object that has x and y for each array entry
        this.position.push(
          {
          x: cvs.width, // start at end of canvas
          y: this.maxYPos * (Math.random() + 1), // random gives number between 0 and 1
          passed: 0 // keep track if wall is passed for score
          }
        );
      }
    }

    // clear walls if game state set to start
    if (gamestate.Current == gamestate.Start){
      // this is to clear the array so that when you restart the walls are erased
      this.position.length = 0;
      this.frame = 0; // reset wall frame
    }
    
    for (let i = 0; i < this.position.length && gamestate.Current != gamestate.Over; i++){
    // count frames to get update frame for object
      if (frames % this.period == 0) {
        // check to see if the goodguy is inside the top wall
        // collision detection for the walls
        let p = this.position[i]; // wall array entry with x and y values        

        if ( 
            // top wall
            (goodguy.x + goodguy.radius >= p.x &&
             goodguy.x - goodguy.radius <= p.x + this.w &&
             goodguy.y + goodguy.radius >= p.y &&
             goodguy.y - goodguy.radius <= p.y + this.h)
             ||
            // bottom wall
            (goodguy.x + goodguy.radius >= p.x &&
             goodguy.x - goodguy.radius <= p.x + this.w &&
             goodguy.y + goodguy.radius >= p.y + this.h + this.gap &&
             goodguy.y - goodguy.radius <= p.y + this.h + this.gap + this.h)
           ){
             // call function to end game
             endgame();

             this.lastxpos = p.x - goodguy.radius; // position to draw the goodguy if there is a collision
        } 

        // increment walls frame
        this.frame = this.frame + 1;
        this.position[i].x = this.position[i].x + this.move;

        // remove walls if they have left the canvas area 
        if (this.position[i].x + this.w <= 0) {
          this.position.shift(); // this will remove the first entry in the array
        }
      }
    }
  },

  drawObj: function(){
    // draw each wall created in position array
    for (let i = 0; i < this.position.length; i++){
      // draw top wall
      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, this.position[i].x, this.position[i].y, this.w, this.h); 

      // draw bottom wall
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
//changing this gameoversplash
  sourcegameover: [
  {sX: 10, // 0
   sY: 179
  },

  {sX: 194, // 1
   sY: 179
  },

  {sX: 378, // 2
   sY: 179
  },

  {sX: 562, // 3
   sY: 179
  }
  ],

  w: 174,
  h: 159,
  x: cvs.width/2 - 174/2,
  y: cvs.height/5, // top one fifth

  // select end splash screen based on score
  select: 0,

  drawObj: function(){
    // only draw if gamestate is at Over
    if (gamestate.Current == gamestate.Over){

      // set based on score
      if (goodguy.score >= 10) {
        this.select = 1;
      } else {
        this.select = 0;
      }

      ctx.drawImage(spritemessage, this.sourcegameover[this.select].sX, this.sourcegameover[this.select].sY, this.w, this.h, this.x, this.y, this.w, this.h);

      // RR score
      ctx.fillStyle = "#1c1c1c"; //remember to change fillstyle when drawing something new
      ctx.font = "70px Arial";
      // write score at x345ish ybot323ish
      ctx.fillText(goodguy.score,this.x + 165,this.y + 107);
    }
  }
}

//RRRRRRRR
// message splash screen
const messagesplash = {
  // this will hold the attributes for the message
  sourcemessage: [
  {sX: 10, // 0
   sY: 10
  },

  {sX: 194, // 1
   sY: 10
  },

  {sX: 378, // 2
   sY: 10
  },

  {sX: 562, // 3
   sY: 10
  }
  ],
  
  w: 174,
  h: 159,
  x: cvs.width/2 - 174/2, // center on x based on width
  y: cvs.height/5, // top one fifth

  drawnum: 2, // this is the message number that should be drawn
  drawflag: 0, // when set to 1 this will start the draw cycle
  
  period: 10, // period 10 and maxtime 5 is about 1 second
  maxtime: 25, // 25 is 5 seconds
  frame: 0,

  drawObj: function(){
    // only draw if draw flag is set - the code will set the drawnum and drawflag to activate this draw
    if (this.drawflag == 1){
      ctx.drawImage(spritemessage, this.sourcemessage[this.drawnum].sX, this.sourcemessage[this.drawnum].sY, this.w, this.h, this.x, this.y, this.w, this.h);    

      walls.pause=1; // pause the walls

      if (frames % this.period == 0){
        // increment message frame and draw
        this.frame = this.frame + 1;
      }

      if (this.frame >= this.maxtime){
        this.drawflag=0; // stop drawing
        this.frame=0; // reset this frame
        walls.pause=0; // walls continue
      }
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

  // RR score
  if (goodguy.score != 0) {
    ctx.fillStyle = "#1c1c1c"; //remember to change fillstyle when drawing something new
    ctx.font = "70px Arial";
    // write score at x345ish ybot323ish
    ctx.fillText(goodguy.score,gameoversplash.x + 165,gameoversplash.y + 107);
  }

  // draw second item - walls
  walls.drawObj();

  // draw third item - foreground
  fg.drawObj();

  // draw start splash screen
  startsplash.drawObj();

  // draw message splash screen
  messagesplash.drawObj();
  // RRdebug
  //ctx.fillStyle = "#000000"; //remember to change fillstyle when drawing something new
  //ctx.font = "30px Arial";
  //ctx.fillText(messagesplash.frame,100,100);

  // draw game over splash screen
  gameoversplash.drawObj();


  // RRRRRRRRRRRRRRRRRRRRRRRRRRRR
  // RRRRRRRRRRRRRRRRRRRRRRRRRRRR
  // RRRRRRRRRRRRRRRRRRRRRRRRRRRR
  // display frame number RRdebug

  //ctx.fillStyle = "#000000"; //remember to change fillstyle when drawing something new
  //ctx.font = "30px Arial";
  //ctx.fillText(frames,100,100);

  // display RRdebug
  
  ctx.fillStyle = "#000000"; //remember to change fillstyle when drawing something new
  ctx.font = "30px Arial";
  //ctx.fillText(frames,100,200);

  //ctx.fillText("wall array",100,250);
  //ctx.fillText(walls.position.length,250,250);

  // post score when ground is touched
  // if endCount not set

  if (endCountRR == 0) {
    // if goodguy has hit the ground
    if (goodguy.y + goodguy.h/2 >= cvs.height-fg.h) {
      endCountRR = frames; // set end count

      // call function to end game
      endgame();
      }
  }

  // draw last item - goodguy
  goodguy.drawObj();
}

function update(){
//dont update if the gamestate has reached gameover
  if (gamestate.Current != gamestate.Over){
    // update first item - background
    bg.updateObj();

    // update second item - walls
    walls.updateObj();

    // update third item - foreground
    fg.updateObj();

  }

    // update last item - goodguy
    goodguy.updateObj();

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


// function to set state to game over for different collisions
function endgame(){
  // set gamestate to game over
  gamestate.Current = gamestate.Over;

  endsound.play(); // end sound  

  messagesplash.drawflag=0; // end message if there is one
  messagesplash.frame=0; // reset frame incase in the middle of message

  // stop and reset sound
  mysound.loop = false; // remove loop setting if this stays on it will break game
  mysound.pause(); // pause music
  mysound.load(); // this will start file from begining again when it plays
}



// ***********************************
// Script
// ***********************************

// will call loop function just one time
loop();