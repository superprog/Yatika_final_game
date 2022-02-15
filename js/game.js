class Game{
    constructor(){
        this.resetTitle=createElement("h2")
        this.resetButton=createButton("")
        this.leadeboardTitle = createElement("h2");

        this.leader1 = createElement("h2");
        this.leader2 = createElement("h2");
        this.playerMoving=false;
        this.hit=false
        

    }
    getState(){
        db.ref("gameState").on("value",data=>{
            gameState=data.val()
        })
    }
    updateState(state){
        db.ref("/").update({
            gameState:state
        })
    }
    start(){
        player=new Player();
        playerCount=player.getCount();
        
        form= new Form();
        form.display();
        gamer1=createSprite(width/2-50,height-100)
        gamer1.addAnimation("gamer1",player1Img)
        gamer1.scale=0.3
        gamer2=createSprite(width/+100,height-100)
        gamer2.addImage("gamer2",player2Img)
        gamer2.scale=0.7
        gamers=[gamer1,gamer2];
        ballsGroup = new Group();
        coinsGroup=new Group();
    }
    handleElements(){
       form.hide()
       this.resetButton.position(width/2+230,100) 
       this.resetButton.class("resetButton")
       this.resetTitle.html("reset game")
       this.resetTitle.class("resetText")
       this.resetTitle.position(width/2+200,40)
       this.leadeboardTitle.html("Leaderboard");
       this.leadeboardTitle.class("resetText");
       this.leadeboardTitle.position(width / 3 - 60, 40);
   
       this.leader1.class("leadersText");
       this.leader1.position(width / 3 - 50, 80);
   
       this.leader2.class("leadersText");
       this.leader2.position(width / 3 - 50, 130);
    }
    handleResetButton(){
        this.resetButton.mousePressed(()=>{
           
            db.ref("/").set({
                playerCount:0,
                gameState:0,
                players:{},
                gamersAtEnd:0
               
            })
           window.location.reload()
        })
    }
    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
      for (var i = 0; i < numberOfSprites; i++) {
        var x, y;
        this.hit=false
        //C41 //SA
        if (positions.length > 0) {
          x = positions[i].x;
          y = positions[i].y;
          spriteImage = positions[i].image;
        } else {
         // x = random(width / 2 + 150, width / 2 - 150);
          //y = random(-height * 4.5, height - 400);
          var x=random(width/2-600,width/2+900)
          var y=-height * 6
        }
        var sprite = createSprite(x, y);
        sprite.addImage("sprite", spriteImage);
        sprite.velocityY=10
        sprite.scale = scale;
        spriteGroup.add(sprite);
      }
    }
  
    play(){
        this.handleElements();
        this.handleResetButton();
        Player.getPlayersInfo();
        player.getGamersAtEnd();
        
        var rand=Math.round(random(1,3))
        var size;
        if (rand===1){
          img=ball
          size=0.09

        }
        else if (rand===2){
          img=ball2
          size=0.2
        }
        else {
          img=ball3
          size=0.09
        }
        if(frameCount % 20===0){
          this.addSprites(ballsGroup, 1, img, size);
        }
        if(frameCount % 25===0){
          this.addSprites(coinsGroup, 1, coinImg, 0.09);
        }
      
      

      
       if (allPlayers!== undefined){
            background(ground);
           image(track,0,-height*5,width,height*6)
           this.showLeaderboard();
         
           this.showLife();
           //console.log(allPlayers)

           var index = 0;

        for (var plr in allPlayers) {
        //add 1 to the index for every loop
        
            index = index + 1;

            //use data form the database to display the cars in x and y direction
            var x = allPlayers[plr].positionX;
            var y = height - allPlayers[plr].positionY;
        
            
            gamers[index - 1].position.x = x;
            gamers[index - 1].position.y = y;

            if (index === player.index) {
            stroke(10);
            fill("red");
            ellipse(x-5, y+77, 60, 10);
            this.handleObstacleCollision(index);
            this.handlePowerCoins(index)
            if(player.life<=0){
              //this.blast=true;
              this.playerMoving=false;
              gameState = 2;
              this.gameOver();
              
            }
            
            
            // Changing camera position in y direction
            camera.position.y = gamers[index - 1].position.y;
            //camera.position.x = gamers[index - 1].position.x-100;
            camera.position.z = gamers[index - 1].position.x-100;
            }
      }
      if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }

      this.handlePlayerControls();
      const finshLine = height * 6 - 100;

      if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateGamersAtEnd(player.rank);
        player.update();
        this.showRank();
      }


       }
       drawSprites();
    }
  
    showLife() {
      push();
      image(lifeImage, width / 2 - 130, height - player.positionY - 200, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 200, 185, 20);
      fill("#f50057");
      rect(width / 2 - 100, height - player.positionY - 200, player.life, 20);
      noStroke();
      pop();
    }

    handleObstacleCollision(index){
      if(gamers[index-1].collide(ballsGroup)){
        this.hit=true
        if(this.hit=true){
          this.hit=false
          player.positionY+=100;
        
        }

        if(player.life>0){
          player.life-=185/4;
        }
      }
      player.update()
    }
    handlePowerCoins(index) {
      gamers[index - 1].overlap(coinsGroup, function(collector, collected) {
        player.score += 10;
        player.update();
        //collected is the sprite in the group collectibles that triggered
        //the event
        collected.remove();
      });
    }
    showLeaderboard() {
        var leader1, leader2;
        var players = Object.values(allPlayers);
        if (
          (players[0].rank === 0 && players[1].rank === 0) ||
          players[0].rank === 1
        ) {
          // &emsp;    This tag is used for displaying four spaces.
          leader1 =
            players[0].rank +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
           players[0].score;
    
          leader2 =
            players[1].rank +
            "&emsp;" +
            players[1].name +
           "&emsp;" +
            players[1].score;
        }
    
        if (players[1].rank === 1) {
          leader1 =
            players[1].rank +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
           players[1].score;
    
          leader2 =
            players[0].rank +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
        }
    
        this.leader1.html(leader1);
        this.leader2.html(leader2);
      }
    

    handlePlayerControls() {
    
          if (keyIsDown(UP_ARROW)) {
            this.playerMoving = true;
            player.positionY += 10;
         
            player.update();
          }
      
          if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
            player.positionX -= 5;
            player.update();
           
          }
      
          if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
            player.positionX += 5;
            player.update();
           
          }
        
       
      }
      showRank() {
        swal({
          title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
          text: "You reached the finish line successfully",
          imageUrl:
            "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
          imageSize: "100x100",
          confirmButtonText: "Ok"
        });
      }
      
 gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }
  end(){
    console.log("Game OVer")
  }
      
}
