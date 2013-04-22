
var elementTypes = {
        DIV:"div"
    };
function newElement(type, id) {
    var e = document.createElement(type);
    if(id)
        e.id = id;
    return e;
}
function newPiece(type, id){
    var piece = newElement(elementTypes.DIV, id);
    piece.setAttribute("class", type);
    piece.setAttribute("className", type);
    document.body.appendChild(piece);
    
    return piece;
}



function Snake() {
    var pieces = [];
    var thisClass = this;
    var currentDir;
    var tailDir;
    var tail;
    this.direction = {
            UP:"up",
            DOWN:"down",
            LEFT:"left",
            RIGHT:"right"
        };
    var dir = this.direction;
    
    this.init = function() {
        thisClass.setDirection(dir.RIGHT);
    }
    this.setPiece = function(pos) {
        pieces.push(pos);
    }
    this.move = function() {
        tail = pieces[pieces.length - 1];
        pieces.pop();
        var pos;
        switch(currentDir) {
            case dir.RIGHT:
                pos = [pieces[0][0] + 1, pieces[0][1]];
            break;
            case dir.LEFT:
                pos = [pieces[0][0] - 1, pieces[0][1]];
            break;
            case dir.UP:
                pos = [pieces[0][0], pieces[0][1] - 1];
            break;
            case dir.DOWN:
                pos = [pieces[0][0], pieces[0][1] + 1];
            break;
            default:
            break;
        }
        pieces.splice(0,0, pos);
    }
    this.setDirection = function(d) {
        switch(d) {
            case dir.RIGHT:
                if(currentDir == dir.LEFT)
                    return;
            break;
            case dir.LEFT:
                if(currentDir == dir.RIGHT)
                    return;
            break;
            case dir.UP:
               if(currentDir == dir.DOWN)
                    return;
            break;
            case dir.DOWN:
                if(currentDir == dir.UP)
                    return;
            break;
            default:
            break;
        }
        currentDir = d;
    }
    this.getDirection = function() {
        return currentDir;
    }
    this.addPiece = function() {
        pieces.push(tail);
    }
    this.getPieces = function() {
        return pieces;
    }
    this.reset = function() {
        pieces = [];
    }
}
function Food() {
    var foods = [];
    this.setFood = function(pos) {
        foods.push(pos);
    }
    this.getFoods = function() {
        return foods;
    }
}
    

var fieldWidth;
var fieldHeight;

// game setting
var GAME_SPEED = 12;
var TILE_SIZE = 10;

var snake;
var snakeView;

var food;
var foodView;

var gameLoop;
function init() {
    initField();
   
    initSnake();
    initFood();
    initControls();
    initGame();
}
var test = 0;
function initGame() {
    test = 0;
    onGameTick();
    gameLoop = setInterval(onGameTick, 1000/GAME_SPEED);
}
function onGameTick() {
    snake.move();
    updateView();
}
function resetFood() {
    var foods = food.getFoods();
    var foodCount = foods.length;
    for(var j = 0; j < foodCount; ++j) {
        var f =  foodView[j];
        foods[j] = getRandFieldPos();
    }
}
function resetGame() {
    clearInterval(gameLoop);
    setTimeout(function(){
        removeSnakeView();
        snake.reset();
        setDefaultSnake();
        initGame();    
    }, 500);
}
function removeSnakeView() {
    var snakeViewCount = snakeView.length;
    for(var i = 0; i < snakeViewCount; ++i) {
        var piece = snakeView[i];
        document.body.removeChild(piece);
    }
    snakeView = [];
}
function resetSnakePos() {
    var pieces = snake.getPieces();
    pieces[0] = [10, 0];
    snake.setDirection(snake.direction.RIGHT);
}
function resetAll() {
    resetFood();
    resetSnakePos();
    initField();
}
function updateView() {
    if(fieldWidth != Math.floor(document.body.clientWidth/10) - 5){
        resetAll();
    }else if(fieldHeight != Math.floor(document.body.clientHeight/10) - 5) {
        resetAll();
    }
    updateSnake();
    checkHit();
    updateFood();
}
function checkHit(){
    var snakeHead = snakeView[0];
    var headX = snakeHead.style.left;
    var headY = snakeHead.style.top;
    
    var pieces = snake.getPieces();
    var piecesCount = pieces.length;
    for(var i = 1; i < piecesCount; ++i) {
        var piece =  snakeView[i];
        if(headX == piece.style.left){
            if(headY == piece.style.top){
                resetGame();
            }
        }
    }
}
function updateFood() {
    var snakeHead = snakeView[0];
    var foods = food.getFoods();
    var foodCount = foods.length;
    for(var j = 0; j < foodCount; ++j) {
        var f =  foodView[j];
        f.style.top = foods[j][1] * TILE_SIZE + "px";
        f.style.left = foods[j][0] * TILE_SIZE + "px";
        
        if(snakeHead.style.top == f.style.top && snakeHead.style.left == f.style.left ) {
            initParticle(foods[j][0] * TILE_SIZE, foods[j][1] * TILE_SIZE);
            
            addPiece();
            foods[j] = getRandFieldPos();
            
            // this is not my code
            f.style.background = "#" + Math.floor(Math.random()*16777215).toString(16);
            // this is not my code

            setTimeout(updateSnake, 200);
            test += 100;
            
            
        }
    }
}
function updateSnake() {
    var pieces = snake.getPieces();
    var piecesCount = pieces.length;
    for(var i = 0; i < piecesCount; ++i) {
        var piece =  snakeView[i];
        piece.style.top = pieces[i][1] * TILE_SIZE + "px";
        piece.style.left = pieces[i][0] * TILE_SIZE + "px";
        
        if(pieces[i][0] > fieldWidth)
            pieces[i][0] = 0;
        else if(pieces[i][0] < 0)
            pieces[i][0] = fieldWidth;
            
        if(pieces[i][1] > fieldHeight)
            pieces[i][1] = 0;
        else if(pieces[i][1] < 0)
            pieces[i][1] = fieldHeight;
    }
}
function initSnake() {
    snakeView = [];
    
    snake = new Snake();
    snake.init();
    setDefaultSnake();
}
function setDefaultSnake() {
    snake.setDirection(snake.direction.RIGHT);
    snakeView.push(newPiece("piece"));
    snake.setPiece([0, 0]);
    addPiece();
}
function initFood(){
    foodView = [];
    
    food = new Food();
    foodView.push(newPiece("tile"));
    food.setFood([20, 0]);
    
    // this is not my code
    foodView[0].style.background = "#" + Math.floor(Math.random()*16777215).toString(16);
    // this is not my code
}
function addPiece() {
    snakeView.push(newPiece("piece"));
    snake.addPiece();
}
function initField() {
   fieldWidth = Math.floor(document.body.clientWidth/10) - 5;
   fieldHeight = Math.floor(document.body.clientHeight/10) - 5;
}
function initControls() {
    document.onkeydown = onControl;
    
    //document.ontouchstart = onMouseDown;
}
function onMouseDown(e) {
    if(e.pageX < document.body.clientWidth/2) {
        if(snake.getDirection() == snake.direction.LEFT)
            snake.setDirection(snake.direction.UP);
        else if(snake.getDirection() == snake.direction.RIGHT)
            snake.setDirection(snake.direction.UP);
        else
            snake.setDirection(snake.direction.LEFT);
    }else {
        if(snake.getDirection() == snake.direction.RIGHT)
            snake.setDirection(snake.direction.DOWN);
        else if(snake.getDirection() == snake.direction.LEFT)
            snake.setDirection(snake.direction.DOWN);
        else
            snake.setDirection(snake.direction.RIGHT);
    }
}
function onControl(e) {
    e = (e != undefined) ? e.keyCode : window.event.keyCode;
    switch(e) {
        case 37:
        case 97:
            snake.setDirection(snake.direction.LEFT);
        break;
        case 38:
        case 119:
            snake.setDirection(snake.direction.UP);
        break;
        case 100:
        case 39:
            snake.setDirection(snake.direction.RIGHT);
        break;
        case 40:
        case 115:
            snake.setDirection(snake.direction.DOWN);
        break;
        default:
        break;
        
    }
}
function getRandFieldPos() {
    var randX = Math.floor(Math.random() * fieldWidth);
    var randY = Math.floor(Math.random() * fieldHeight);
    return [randX, randY];
}

window.onload = init;