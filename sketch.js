var trex,trex_run,trex_collide;
var ground,ground_img,invisibleGround;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,obstaclesGroup;
var cloud,cloudsGroups,cloud_img;
var restart,restart_img,gameOver,gameOver_img;
var score;
var PLAY, END,gameState;


function preload(){
 trex_run=loadAnimation( "trex1.png", " trex3.png", " trex4.png");
  trex_collide=loadAnimation(" trex_collided.png" );
  ground_img=loadImage("ground2.png");
  cloud_img=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
    
  
  gameOver_img=loadImage('gameOver.png');
  restart_img=loadImage('restart.png')
     
}


function setup() {
  createCanvas(600, 200);
  trex=createSprite( 50,100,5,80);
  trex.addAnimation("running",trex_run);
  trex.addAnimation(" colliding",trex_collide);

  //scale and position the trex
trex.scale = 0.5;
trex.x = 50;

//initiate Game STATEs
 PLAY = 1;
 END = 0;
 gameState = PLAY;

//set collision radius for the trex
trex.setCollider("circle",0,0,30);

//create a ground sprite
 ground = createSprite(300,180,600,20);
ground.addImage(ground_img);
ground.x = ground.width /2;

//invisible Ground to support Trex
 invisibleGround = createSprite(100,185,600,5);
invisibleGround.visible = false;

//create Obstacle and Cloud Groups
 ObstaclesGroup = new Group();
 CloudsGroup = new Group();

//place gameOver and restart icon on the screen
gameOver = createSprite(300,50);
 restart = createSprite(300,140);
gameOver.addImage(gameOver_img);
gameOver.scale = 0.5;
restart.addImage(restart_img);
restart.scale = 0.5;


//set text
textSize(18);
textFont("Georgia");
textStyle(BOLD);

//score
 count = 0;
}

function draw() {
  //set background to white
  
  background("white");
  //display score
  text("Score:"+ count, 500, 40);
 //     console.log(trex.y);
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    
    
    count =count+ Math.round(getFrameRate()/60);
  gameOver.visible = false;
  restart.visible = false;
    
    if (count>0 && count%100 === 0){
   //   playSound("checkPoint.mp3");
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 167){
      trex.velocityY = -12 ;
   //   playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
     // playSound("die.mp3");
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change animation
    trex.changeAnimation(" colliding",trex_collide);      
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
  CloudsGroup.destroyEach();
  ObstaclesGroup.destroyEach();
  count=0;
  trex.changeAnimation( "running",trex_run);
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //genranderate random obstacles
    var rand = Math.round (random(1,6));
    
    console.log(rand);
    switch (rand) {
      
        case 1:  obstacle.addImage( obstacle1); break ;
        case 2:  obstacle.addImage(obstacle2); break ;
        case 3:  obstacle.addImage(obstacle3); break ;
        case 4:  obstacle.addImage(obstacle4); break ;
        case 5:  obstacle.addImage(obstacle5); break ;
        case 6:  obstacle.addImage(obstacle6); break ;
        default: break ;
    }    
   
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(80,120);
    cloud.addImage(cloud_img);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
