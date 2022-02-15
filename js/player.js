class Player{
    constructor(){
        this.name=null;
        this.index=null;
        this.positionX=0;
        this.positionY=0;
        this.rank=0;
        this.score=0;
        this.life = 185;
    
    }
    addPlayer(){
        var playerIndex="players/player"+this.index;
        if (this.index===1){
            this.positionX=width/2-300;
        }
        else if(this.index===2){
            this.positionX=width/2+300;
        }
        
        console.log(this.positionX)
        db.ref(playerIndex).set({
            name:this.name,
            positionX:this.positionX,
            positionY:this.positionY,
            rank:this.rank,
            score:this.score
        })
    }
    getCount(){
        db.ref("playerCount").on("value",data=>{
            playerCount=data.val()
        })
    }
    updateCount(count){
        db.ref("/").update({
            playerCount:count
        })
    }
    update(){
        var playerIndex="players/player"+this.index;
        console.log("update"+this.rank)
        db.ref(playerIndex).update({
            name:this.name,
            positionX:this.positionX,
            positionY:this.positionY,
            rank:this.rank,
            score:this.score

        })
    }
getDistance(){
    var playerIndex="players/player"+this.index;
    db.ref(playerIndex).on("value",data=>{
var data=data.val();
this.positionX=data.positionX;
this.positionY=data.positionY;
    })
}
static getPlayersInfo(){
    db.ref("players").on("value",data=>{
      allPlayers=data.val()
    })
}

getGamersAtEnd() {
    db.ref("gamersAtEnd").on("value", data => {
      this.rank = data.val();
    });
    console.log(this.rank)
  }

  static updateGamersAtEnd(rank) {
    db.ref("/").update({
      gamersAtEnd: rank
    });
  }
}