function ParticleEffect(posX, posY) {
    
    var pieces = [];
    var views = [];
    var speed = 4;
    var gravity = 1;
    
    var thisClass = this;
    
    var mouseX = posX;
    var mouseY = posY;
    
    var isEnd = false;
    
    var randColors = ["#" + Math.floor(Math.random()*16777215).toString(16),
                      "#" + Math.floor(Math.random()*16777215).toString(16),
                      "#" + Math.floor(Math.random()*16777215).toString(16),
                      "#" + Math.floor(Math.random()*16777215).toString(16),
                      "#" + Math.floor(Math.random()*16777215).toString(16),
                      "#" + Math.floor(Math.random()*16777215).toString(16),
                      "#" + Math.floor(Math.random()*16777215).toString(16),
                      "#" + Math.floor(Math.random()*16777215).toString(16),
                      "#" + Math.floor(Math.random()*16777215).toString(16),
                      "#" + Math.floor(Math.random()*16777215).toString(16)
                      ];
    this.run = function(){
       
        if(window[requestAnimation]){
            thisClass.update();
        }else{
            setTimeout(thisClass.update, 1000/30);
        }
    }
    this.addPiece = function(piece) {
        ySpeed = Math.sin(-90) * speed * Math.floor(Math.random() * 5);
        xSpeed = Math.cos(Math.floor(Math.random()* 90)) * speed;
        
        pieces.push({xSpeed:xSpeed, ySpeed:ySpeed, delay:Math.floor(Math.random() * 5), maxBounce:Math.floor(Math.random() * 5)});
        
        
       
        piece.style.top = mouseY + "px";
        piece.style.left = mouseX + "px"
        
        // this is not my code
        piece.style.background = randColors[Math.floor(Math.random() * 10)];
        // this is not my code    
        //piece.style.top = document.body.clientHeight - 120  + "px";
        //piece.style.left = Math.random() * document.body.clientWidth + "px"
        views.push(piece);
    }
    this.initPiece = function(index){
        var piece = pieces[index];
        
        
        var view = views[index];
        if(piece.maxBounce <= 0) {
            /*
            view.style.top = mouseY + "px";
            view.style.left = mouseX + "px"
            piece.maxBounce = Math.floor(Math.random() * 5);
            ySpeed = Math.sin(-90) * speed * Math.random() * 10;
            xSpeed = Math.cos(Math.floor(Math.random()* 90)) * speed;
            
            
            //alert("asdasd");
            
            
            */
            views.splice(index, 1);
            pieces.splice(index, 1);
            
            document.body.removeChild(document.getElementById(view.id));
            
            if(views.length == 0){
                isEnd = true;
            }
            
        } else {
            if(view.style.width == ""){
                view.style.width = "10px";
                view.style.height = "10px";
            }
            
            view.style.width = parseInt(view.style.width)-2 + "px";
            view.style.height = parseInt(view.style.height)-2 + "px";
            
            view.style.top = document.body.clientHeight - 120  + "px";
            piece.maxBounce--;
            
            ySpeed = Math.sin(-90) * piece.maxBounce * 10;
            xSpeed = Math.cos(Math.floor(Math.random()* 90)) * speed;
            
            piece.xSpeed = xSpeed;
            piece.ySpeed = ySpeed;
        }
        
        
       
        
    }
    this.update = function() {
        var piecesCount = pieces.length;
        for(var i = 0; i < piecesCount; ++i) {
            var piece = pieces[i];
            
            if(piece == undefined)
                continue;
            if(piece.delay > 0) {
                piece.delay--;
                continue;
            }
            //piece.xSpeed = xSpeed;
            piece.ySpeed += gravity;
            
            var view = views[i];
            if(parseInt(view.style.top) > document.body.clientHeight - 100){
                thisClass.initPiece(i);
                //view.style.top = document.body.clientHeight - 120  + "px";
            }else if(parseInt(view.style.left) > document.body.clientWidth){
                thisClass.initPiece(i);
               // view.style.left = document.body.clientWidth - 20  + "px";
            }else if(parseInt(view.style.left) < 0){
                thisClass.initPiece(i);
               // view.style.left = 20  + "px";
            }else {
                view.style.top = Math.floor(parseInt(view.style.top) + piece.ySpeed) + "px";
                view.style.left = Math.floor(parseInt(view.style.left) + piece.xSpeed) + "px";
            
            }
        }
        if(isEnd) {
            thisClass.destroy();
            return;
        }
        if(window[requestAnimation]) {
            window[requestAnimation](thisClass.update);
        }else {
            setTimeout(thisClass.update, 1000/30);
        }
    }
    this.destroy = function() {
        pieces = null;
        views = null;
        speed = null;
        gravity = null;
        
        thisClass = null;
        
        mouseX = null;
        mouseY = null;
    }
    this.getPieces = function() {
        return pieces;
    }
}
var particleEffect;
var requestAnimation;
if(window.webkitRequestAnimationFrame){
    requestAnimation = "webkitRequestAnimationFrame";
}else if(window.mozRequestAnimationFrame){
    requestAnimation = "mozRequestAnimationFrame";
}
function initParticle(xPos, yPos) {
    particleEffect = new ParticleEffect(xPos, yPos);
    for(var i = 0; i < 30; ++i) {
        particleEffect.addPiece(newPiece("piece", "particle" + i));    
    }
    particleEffect.run();
    
}