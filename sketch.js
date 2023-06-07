/*

Coursework 2.2 Game project submission [002]
Game Project 7
Student: Simone Mazzini
Student number: 210103513

Comment about the project:
I have choosen to implement two extensions, in specific:
- SOUND
- ENEMY
- PLATFORMS
For every extension I followed the video instructions and I created my personal choice on that. Implement the sound extension has been particular funny.
About the difficult bits I found particularly tricky understand the logic how computer works because it is my first time with programming but thanks to the video lessons I found the way to put all togheter and now it works so it is fantastic.
Probabily the most important skill that I learnt during this course is how to solve problems, obviusly also to programming but problem solving in this case I think is so important and now I have no fear to programming because I know the way to debug an error.



*/

var contactenemiessound
var deadSound;
var collectableSound;
var startSound;
var jumpSound;
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var clouds;
var mountains;
var canyons;
var collectables;

var enemies;

var treePos_y;
var game_score;
var lives;
var flagpole;

var platforms;

var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //jump audio here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.3);
    
    //start audio here
    startSound = loadSound('assets/ES_Game On - Tricycle Riot.mp3')
    startSound.setVolume (0.1);
    
    //dead sound here
    deadSound = loadSound('assets/ES_Fall Descend - SFX Producer.mp3')
    startSound.setVolume (0.1);
    
    //collectable sound here
    collectableSound= loadSound('assets/ES_Magical Twinkle 3 - SFX Producer.mp3')
    startSound.setVolume (0.1);
    
    //contact enemies sound here
    contactenemiessound = loadSound('assets/ES_Evil Laugh 3 - SFX Producer.mp3')
    startSound.setVolume (0.1);
    
    
    
    
}


function setup()
{
	createCanvas(1024, 576);
    
    floorPos_y = height * 3/4;
    lives = 3;
    
    startGame();
    startSound.play();
    
    enemies = [];
    enemies.push(new Enemy(100,floorPos_y -10,100));
    enemies.push(new SecondEnemy(100,floorPos_y -10,100));
    
    platforms = [];
    
    platforms.push(createPlatforms(1000,floorPos_y -50,80));
    platforms.push(createPlatforms(750,floorPos_y -30,80));
    platforms.push(createPlatforms(1450,floorPos_y -30,80));
    platforms.push(createPlatforms(1750,floorPos_y -50,80));
    

}


function draw()

{
    push();
    translate(scrollPos,0);
    
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0 -abs(scrollPos), floorPos_y, width + 2 * abs(scrollPos), height/4); // draw some green ground

	// Draw clouds.
    drawClouds();
    

	// Draw mountains.
   drawMountains();

	// Draw trees.
    drawTrees();
    
    //Draw Platforms.
    
    for (var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }

	// Draw canyons.
    
    for (var i = 0; i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }

	// Draw collectable items.
    
   for(var i = 0; i < collectables.length; i++)
        {
            
            if (!collectables[i].isFound)
                {
                    drawCollectable(collectables[i]);
                    checkCollectable(collectables[i]);
                }
        }
     
    renderFlagpole(); //function to draw flagpole
    checkFlagpole();  //function to check flagpole
    checkPlayerDie(); //function to check if player died
    
    
    for(var i=0; i < enemies.length; i++)
        {
            enemies[i].draw();
            
            var isContact = 
                enemies[i].checkContact(gameChar_world_x, gameChar_y)
            
            if(isContact)
                {
                    if(lives > 0)
                        {
                            startGame();
                            lives -=1;
                            contactenemiessound.play ();
                            break;
                        }
                }
        }
      
    
    pop();
    
	// Draw game character.
	
	drawGameChar();
    
    
    fill(255);
    noStroke();
    text ("score: " + game_score,20,20);
    text ("lives: " + lives,20,50);
    
    if (lives < 1)
    {
        fill(255);
        textSize(50);
        text("GameOver", width/2-200,height/2+50);
        text("Press Space to Continue", width/2-200, height/2);
        textSize(12);
        return;
    }
    if (flagpole.isReached)
    {
        fill(255);
        textSize(50);
        text("Level complete", width/2-200,height/2+50);
        text("Press Space to Continue", width/2-200, height/2);
        textSize(12);
        return;
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    
    if (gameChar_y < floorPos_y)
        {
            var isContact = false;
            for(var i = 0; i < platforms.length ; i ++)
                {
                    if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
                        {
                            isContact = true;
                            break;
                        }
                }
            if(isContact == false)
                {
            gameChar_y +=2;
            isFalling = true;
                }
        }
    else 
        {
            isFalling = false;
        }
    if (isPlummeting)
        {
            gameChar_y +=10;
        }
    if(flagpole.isReached == false)
        {
             checkFlagpole();
        }
   
    

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	if (keyCode == 37)
        {
          
            isLeft = true;
        }
     else if (keyCode == 39)
        {
          
            isRight = true;
        }
     
    else if (keyCode == 32 && gameChar_y >= floorPos_y)
        { 
        isFallling = true;
        gameChar_y -= 100;
        
        jumpSound.play();
        }
}

function keyReleased()
{

	if (keyCode == 37)
        {
           
            isLeft = false;
        }
    else if (keyCode == 39)
        {
            
            isRight = false;
        }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	if(isLeft && isFalling)
	{
		// add your jumping-left code
         fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x,gameChar_y-60, 20,20);
    fill(255,99,71);
    rect(gameChar_x-8,gameChar_y-50,15,30);
    
    fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x+6,gameChar_y-40, 20,5);
    
    fill(0,0,0);
    rect(gameChar_x-3,gameChar_y-10,5,10);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        
         fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x,gameChar_y-60, 20,20);
    fill(255,99,71);
    rect(gameChar_x-8,gameChar_y-50,15,30);
    
    fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x-9,gameChar_y-40, 20,5);
    
    fill(0,0,0);
    rect(gameChar_x-3,gameChar_y-10,5,10);


	}
	else if(isLeft)
	{
		// add your walking left code
         fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x,gameChar_y-50, 20,20);
    fill(255,99,71);
    rect(gameChar_x-8,gameChar_y-40,15,30);
    
    fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x-3,gameChar_y-25, 5,20);
    
    fill(0,0,0);
    rect(gameChar_x-3,gameChar_y-10,5,10);
     fill(0,0,0);
    rect(gameChar_x-7,gameChar_y-10,5,5);


	}
	else if(isRight)
	{
		// add your walking right code
         fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x,gameChar_y-50, 20,20);
    fill(255,99,71);
    rect(gameChar_x-8,gameChar_y-40,15,30);
    
    fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x+2,gameChar_y-25, 5,20);
    
    fill(0,0,0);
    rect(gameChar_x-3,gameChar_y-10,5,10);
    
    fill(0,0,0);
    rect(gameChar_x+1,gameChar_y-10,5,5);
    


	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
         fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x,gameChar_y-60, 20,20);
    fill(255,99,71);
    rect(gameChar_x-8,gameChar_y-50,15,30);
    fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x+10,gameChar_y-45, 5,20);
    fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x-10,gameChar_y-45, 5,20);
    fill(255,255,255);
    rect(gameChar_x-8,gameChar_y-47,15,5);
    fill(255,255,255);
    rect(gameChar_x-8,gameChar_y-39,15,5);
    fill(0,0,0);
    rect(gameChar_x-8,gameChar_y-15,5,10);
    fill(0,0,0);
    rect(gameChar_x+1,gameChar_y-15,5,10);

	}
	else
	{
		// add your standing front facing code
        fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x,gameChar_y-50, 20,20);
    fill(255,99,71);
    rect(gameChar_x-8,gameChar_y-40,15,30);
    fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x+10,gameChar_y-25, 5,20);
    fill(255,228,225);
    stroke(0,0,0);
    ellipse(gameChar_x-10,gameChar_y-25, 5,20);
    fill(255,255,255);
    rect(gameChar_x-8,gameChar_y-37,15,5);
    fill(255,255,255);
    rect(gameChar_x-8,gameChar_y-29,15,5);
    fill(0,0,0);
    rect(gameChar_x-8,gameChar_y-10,5,10);
    fill(0,0,0);
    rect(gameChar_x+1,gameChar_y-10,5,10);


	}

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)
        {
            fill(255, 255, 255);
            ellipse(clouds[i].x_pos, clouds[i].y_pos, 100 * clouds[i].size, 59 * clouds[i].size);
            ellipse(clouds[i].x_pos -41 * clouds[i].size, clouds[i].y_pos, 60 * clouds[i].size, 50 * clouds[i].size);
            ellipse(clouds[i].x_pos + 41 * clouds[i].size, clouds[i].y_pos, 60 * clouds[i].size, 50 * clouds[i].size);
        }
}

// Function to draw mountains objects.
function drawMountains()
{
    for (var i = 0; i < mountains.length; i++)
        {
            fill(101, 56, 117);
            triangle (mountains[i].x_pos, mountains[i].y_pos + 235, mountains[i].x_pos + 200 , mountains[i].y_pos + 235, mountains[i].x_pos + 100 , mountains[i].y_pos - 50);
            fill(101, 56, 117);
            triangle (mountains[i].x_pos + 100, mountains[i].y_pos + 235, mountains[i].x_pos + 300 , mountains[i].y_pos + 235, mountains[i].x_pos + 200 , mountains[i].y_pos + 40);
                }
}


// Function to draw trees objects.

function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
        {
           fill(79,68,21);
            rect ( trees_x[i],treePos_y, 11, 80);
            fill (82, 209, 90);
        ellipse(trees_x[i] + 5, treePos_y + 7, 60, 110);
        }
        
  }


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
     noStroke();
    fill(100,155,255);
    rect(t_canyon.x_pos, 432, t_canyon.width, 154);
    
    fill(0,155,0);
    rect(t_canyon.x_pos -92, 432, 102, 154, 10);
    rect(t_canyon.x_pos + t_canyon.width - 10, 432, 100, 154, 10);
    
    fill(255, 0, 0);
    rect (t_canyon.x_pos + 10, 556, t_canyon.width - 20, 30, 5);
    
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
 if (gameChar_world_x >= t_canyon.x_pos + 7 && gameChar_world_x <= t_canyon.x_pos + t_canyon.width - 7 && gameChar_y >= floorPos_y)
     {
         isPlummeting = true;
         deadSound.play();
         
     }

}


// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    noFill();
    strokeWeight(6);
    stroke(220,185,0);
    ellipse(t_collectable.x_pos, floorPos_y - t_collectable.size * 0.4,
           t_collectable.size * 0.8,
           t_collectable.size * 0.8);
    }

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{

    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < (t_collectable.size))
        {
            t_collectable.isFound = true;
            game_score += 1;
            collectableSound.play();
           
        }
    
}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(100);
    line(flagpole.x_pos, floorPos_y,flagpole.x_pos,floorPos_y - 250);
    fill(255,0,255);
    
    if( flagpole.isReached)
        {
    rect(flagpole.x_pos, floorPos_y -250, 50,50);
        }
    else{
         rect(flagpole.x_pos, floorPos_y -50, 50,50);
    }
    pop();
}

function checkFlagpole()
{
  var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if (d < 15)
        {
            flagpole.isReached = true;
            
        }
}
// enemy number 1
function Enemy(x,y,range)
{
    this.x = 550;
    this.y = y;
    this.range = 30;
    
    this.currentX = 550;
    this.inc = 0.5;
    
    this.update = function()
    {
        this.currentX += this.inc;
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();
        fill(255,228,225);
       
        ellipse(this.currentX,this.y-60, 20,20);
        fill(255,99,71);
        rect(this.currentX-8,this.y-50,15,30);
        fill(255,228,225);
        stroke(0,0,0);
        ellipse(this.currentX+10,this.y-45, 5,20);
        fill(255,228,225);
        stroke(0,0,0);
        ellipse(this.currentX-10,this.y-45, 5,20);
        fill(255,255,255);
        rect(this.currentX-8,this.y-47,15,5);
        fill(255,255,255);
        rect(this.currentX-8,this.y-39,15,5);
        fill(0,0,0);
        rect(this.currentX-8,this.y-15,5,10);
        fill(0,0,0);
        rect(this.currentX+1,this.y-15,5,10);
             }
    
    this.checkContact = function(gameChar_x, gameChar_y)
    {
        var d = dist(gameChar_x, gameChar_y, this.currentX, this.y)
        
        if(d<20)
            {
                return true;
            }
        return false;
    }   
}

// enemy number 2
function SecondEnemy(x,y,range)
{
    this.x = 1300;
    this.y = y;
    this.range = 30;
    
    this.currentX = 1300;
    this.inc = 0.5;
    
    this.update = function()
    {
        this.currentX += this.inc;
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();
        fill(255,228,225);
       
        ellipse(this.currentX,this.y-60, 20,20);
        fill(255,99,71);
        rect(this.currentX-8,this.y-50,15,30);
        fill(255,228,225);
        stroke(0,0,0);
        ellipse(this.currentX+10,this.y-45, 5,20);
        fill(255,228,225);
        stroke(0,0,0);
        ellipse(this.currentX-10,this.y-45, 5,20);
        fill(255,255,255);
        rect(this.currentX-8,this.y-47,15,5);
        fill(255,255,255);
        rect(this.currentX-8,this.y-39,15,5);
        fill(0,0,0);
        rect(this.currentX-8,this.y-15,5,10);
        fill(0,0,0);
        rect(this.currentX+1,this.y-15,5,10);
             }
    
    this.checkContact = function(gameChar_x, gameChar_y)
    {
        var d = dist(gameChar_x, gameChar_y, this.currentX, this.y)
        
        if(d<20)
            {
                return true;
            }
        return false;
    }   
}

function checkPlayerDie()
{
    var playerDead = false;
    
    if(gameChar_y > height)
        {
            playerDead = true;
            
            if (playerDead)
            {
                lives -=1;
                
            }
            if (lives >-1)
                {
                    startGame();
                }
        }
    for(var i = 0; i < lives; i++)
        {
            //life tokens
            fill(255,0,255);
            rect(20+i*20,60,10,10);
        }
}

function startGame()
{
    
	gameChar_x = 400 ;
	gameChar_y = floorPos_y;
    

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    trees_x = [150, 300, 900, 1320, 1630, 2100];
    treePos_y = 352;
    
    clouds = [{x_pos : 116, y_pos : 140, size : 1},
              {x_pos : 900, y_pos : 135, size : 1},
              {x_pos : 1500, y_pos : 120, size : 1},
              {x_pos : 2000, y_pos : 100, size : 1}];
    
    
    mountains = [{x_pos : 700, y_pos : 200},
                 {x_pos : 1700, y_pos : 200},
                 {x_pos : 2700, y_pos : 200}];
    
    canyons = [{x_pos : 170, width : 100},
              {x_pos : 1100, width : 100}];
    
    collectables = [
                    {x_pos : 700, y_pos: floorPos_y, size : 50 , isFound : false},
                    {x_pos : 1400, y_pos: floorPos_y, size : 50 , isFound : false},
                    {x_pos : 2100, y_pos: floorPos_y, size : 50 , isFound : false},
                    {x_pos : 2800, y_pos: floorPos_y, size : 50 , isFound : false}];
    
    
    flagpole = {isReached: false, x_pos: 2000};
    
    
    game_score = 0;
    
    
    enemies = [];
    enemies.push(new Enemy(100,floorPos_y -10,100));
    
    

               
}

function createPlatforms(x,y,length )
{
    var p = {
        
        x: x,
        y: y,
        length: length,
        draw: function(){
            
            fill(130,0,45);
            rect( this.x, this.y, this.length, 10);
        
    },
        checkContact: function(gc_x, gc_y)
        {

        if(gc_x > this.x && gc_x < this.x + this.length)
        {
          var d = this.y - gc_y;
            if(d >= 0 && d < 5)
                {
                    return true;
                }
        
        }
        
            return false;
        }
    }
    
    return p
}

