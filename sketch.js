var dog,Dogs,happyDog, database,foodS,foodStock,fedTime,lastFed,feed,addFood,foodObj,sadDog;
var changingGameState,readGameState;
var Bathroom_img,Graden_img,Bedroom_img;
function preload(){
  Bathroom_img=loadImage('images/Wash Room.png');
Graden_img=loadImage('images/Graden.png');
  Bedroom_img=loadImage('images/Bed Room.png');
Dogs=loadImage('images/dogImg1.png');
happyDog=loadImage('images/dogImg.png');
sadDog=loadImage('images/Lazy.png');
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(Dogs);
  dog.scale=0.2;
  
  feed=createButton("Feed your dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Milk");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(rgb(46,139,87));
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  readGameState=database.ref('gameState');
  readGameState.on("value",function(data){
gameState=data.val();
  });
  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFodd.show();
    dog.addImage(sadDog);
  }
 
  textSize(15);
  fill("white");
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
   text("Imaportant Note:Press Up_Arrow key to feed the Milk and food to the dog.",300,80);
   text("name of you dog: Your choice",300,100);
   if(currentTime==(lastFed+1)){
     update("playing");
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
update("hungry");
foodObj.display();
  }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}


