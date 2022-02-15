class Ball {
    constructor(x, y,img) {
     
   
        this.speed = 0.05;
       // this.body = Bodies.circle(x, y, 30, options);
       this.body=createSprite(x,y,10,10)
        this.image = img
        this.body.addImage(this.image)
        this.body.velocityY=3
        console.log(this.body.y)
        this.trajectory = [];
        
        //World.add(world, this.body);
      }
    display(){
  
    drawSprites();
 
}


 remove(index) {
   


 
    this.speed = 0.05;
    this.r = 150;
    setTimeout(() => {
      this.body.remove(index);
      delete balls[index];
    }, 1000);
  }


}