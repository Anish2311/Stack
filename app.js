let bricks = []
let misses = []
let y = 0
let score = 0
let hs = 0
if(JSON.parse(localStorage.getItem('hs')) != null){
    hs = JSON.parse(localStorage.getItem('hs'))
}

let phone = false

if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)) {
            phone = true
         }

class Brick{
    constructor(x,y,w,mv){
        this.x = x
        this.y = y
        this.w = w
        this.moving = mv
        this.downs = false
        this.c = 0
        this.inc = width/80
    }
    show(){
        noStroke()
        if(bricks.indexOf(this)*10 > 255){
            this.co = 255 - (bricks.indexOf(this)*10)%255
        }
        else{
            this.co = (bricks.indexOf(this)*10)%255
        }
        fill(this.co*0.5,this.co,150)
        // rectMode(CENTER)
        rect(this.x,this.y,this.w,20)
        if(this.moving){
            this.move()
        }
        if(this.downs){
            this.down()
        }
    }
    move(){
        if(this.x + this.w >= width){
            this.inc = -width/80
        }
        else if(this.x <= 0 ){
            this.inc = width/80
        }
        this.x += this.inc
    }
    down(){
        this.y += 2.5
        this.c += 2.5
        if(this.c >= 20){
            this.downs = false
            this.c = 0
        }
    }
}

class Miss{
    constructor(x,y,w){
        this.x = x
        this.y = y
        this.w = w
        this.alpha = 255
    }
    show(){
        noStroke()
        fill(150,10,50,this.alpha)
        rect(this.x,this.y,this.w,20)
        this.alpha -= 10
        if(this.alpha <= 0){
            this.del()
        }
    }
    del(){
        misses.splice(misses.indexOf(this),1)
    }
}

function preload() {
    fontRegular = loadFont('font.ttf');
}

function setup(){
    createCanvas(window.innerWidth,window.innerHeight)
    y = height
    for(let i = 0; i < 15; i++){
        bricks.push(new Brick(floor(width/20)*10 - width/4,y,width/2,false))
        y -= 20
    }
    bricks.push(new Brick(-width/2,y,width/2,true))
}

function draw(){
    gradient()
    bricks.forEach(e => {
        e.show()
    });
    misses.forEach(e => {
        e.show()
    });
    noStroke()
    fill(100,170,170)
    textSize(52)
    textFont(fontRegular)
    textAlign(CENTER)
    text(score,width/2,height/8)
    textSize(16)
    text(`HS : ${hs}`,width/2 + 100,height/9)
    text('RETRY',width/2 - 100,height/9)
}

function mouseClicked(){
    if(phone){
        render()
    }
}

function mousePressed(){
    if(phone == false){
        render()
    }
}

function render(){
    if(mouseX > width/2 - 150 && mouseX < width/2 - 50 && mouseY < height/9 + 16 && mouseY > height/9 - 16){
        location.reload()
    }
    else{
        console.log('PRESSED');
        bricks[bricks.length - 1].moving = false
        bricks.forEach(e => {
            e.downs = true
        });
        cut(bricks.length - 1)
        bricks.push(new Brick(-1 * bricks[bricks.length - 1].w,y,bricks[bricks.length - 1].w,true))
        score += 1
    }
}

function cut(i){
    e = bricks[i]
    if(e.x <= bricks[i-1].x && e.x + e.w > bricks[i-1].x){
        misses.push(new Miss(e.x,e.y,bricks[i-1].x - e.x))
        e.w = (e.x + e.w) - bricks[i-1].x
        e.x = bricks[i-1].x
    }
    else if(e.x > bricks[i-1].x && e.x < bricks[i-1].x + bricks[i-1].w){
        misses.push(new Miss(bricks[i-1].x + bricks[i-1].w,e.y,(e.x + e.w) - (bricks[i-1].x + bricks[i-1].w)))
        e.w = (bricks[i-1].x + bricks[i-1].w) - e.x
    }
    else{
        // resizeCanvas(width,bricks[0].y)
        // console.log(height);
        if(score > hs){
            hs = score
            localStorage.setItem('hs',JSON.stringify(hs))
        }
        noLoop()
    }
}

function gradient(){
    c1 = color(10,50,70);
    c2 = color(50,100,120);
    for(let y=0; y<height; y++){
        n = map(y,0,height,0,1);
        let newc = lerpColor(c1,c2,n);
        stroke(newc);
        line(0,y,width, y);
    }
}