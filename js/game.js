// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos


// http://juegos.canvas.ninja/

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;
var stone = {};

var monster = {
	speed:40
};
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var princesascogidas = function () {
princessesCaught = localStorage.getItem("Princesas");
if(princessesCaught=="undefined"){
		princessesCaught=0;
		localStorage.setItem("Princesas", princessesCaught);
	}

}

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	if(hero.x<25){
		hero.x=25;
	}
	if(hero.x>455){
		hero.x=455;
	}

	if(hero.y<25){
		hero.y=25;
	}
	if(hero.y>415){
		hero.y=415;
	}

	// Throw the princess somewhere on the screen randomly
	// La princesa se sitúa en el mapa aleatoriamente

	princess.x = localStorage.getItem("PrincesaX");
	princess.y = localStorage.getItem("PrincesaY");

	if(princess.x=="undefined"){
		princess.x = 32 + (Math.random() * (canvas.width - 64));
		localStorage.setItem("PrincesaX", princess.x);
	}

	if(princess.y=="undefined"){
		princess.y = 32 + (Math.random() * (canvas.height - 64));
		localStorage.setItem("PrincesaY", princess.y);
	}

	//princess.x = 32 + (Math.random() * (canvas.width - 64));
	//princess.y = 32 + (Math.random() * (canvas.height - 64));

	princess.x=460;

	if(princess.x<25){
		princess.x=25;
	}
	if(princess.x>455){
		princess.x=455;
	}

	if(princess.y<25){
		princess.y=25;
	}
	if(princess.y>415){
		princess.y=415;
	}

	stone.x  = localStorage.getItem("StoneX");
	stone.y = localStorage.getItem("StoneY");

	if(stone.x =="undefined"){
		stone.x = 32 + (Math.random() * (canvas.width - 64));
		localStorage.setItem("StoneX", stone.x);
	}

	if(stone.y=="undefined"){
		stone.y = 32 + (Math.random() * (canvas.height - 64));
		localStorage.setItem("StoneY", stone.y);
	}

	monster.x  = localStorage.getItem("MonsterX");
	monster.y = localStorage.getItem("MonsterY");

	if(monster.x =="undefined"){
		monster.x = 32 + (Math.random() * (canvas.width - 64));
		localStorage.setItem("MonsterX", monster.x);
	}

	if(monster.y=="undefined"){
		monster.y = 32 + (Math.random() * (canvas.height - 64));
		localStorage.setItem("MonsterY", monster.y);
	}



	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));

	if(tocaprincesa(hero.x, hero.y)||tocapiedra(hero.x, hero.y)||tocapiedra(princess.x, princess.y)||
		tocamonster(hero.x, hero.y)||tocamonster(princess.x, princess.y)||tocamonster(stone.x, stone.y)){
			reset();
	}
	
};

var compruebatocar = function(){
	// Are they touching?
	if (tocaprincesa(hero.x, hero.y)) {
		if(princessesCaught%10==0 && princessesCaught>9){
			nextLevels();
		}
		++princessesCaught;
		localStorage.setItem("Princesas", princessesCaught);
		localStorage.setItem("PrincesaX","undefined");
		localStorage.setItem("PrincesaY","undefined");
		localStorage.setItem("StoneX","undefined");
		localStorage.setItem("StoneY","undefined");
		localStorage.setItem("MonsterX","undefined");
		localStorage.setItem("MonsterY","undefined");
		reset();
	}else if(tocamonster(hero.x, hero.y)){
		princessesCaught=0;
		monster.speed = 40;
		reset();
	}
};


// Update game objects
var update = function (modifier) {
	if (38 in keysDown && hero.y>20) {
		if(!tocapiedra(hero.x, (hero.y - 7))){
			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown && hero.y<415) { // Player holding down
		if(!tocapiedra(hero.x, (hero.y + 7))){
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown && hero.x>25) { // Player holding left
		if(!tocapiedra((hero.x - 7), hero.y)){
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown && hero.x<450) { // Player holding right
		if(!tocapiedra((hero.x + 7), hero.y)){
			hero.x += hero.speed * modifier;
		}
	}

	///////////PERSEGUIR/////////////////////////////////
	if (hero.x-monster.x > 0){
		if(!tocapiedra(monster.x, (monster.y+7))){
			monster.x += monster.speed*modifier;
		}
	}else{
		if(!tocapiedra(monster.x, (monster.y-7))){
			monster.x -= monster.speed*modifier;
		}
	}
	if (hero.y-monster.y>0){
		if(!tocapiedra((monster.x+7), monster.y)){
			monster.y += monster.speed*modifier;
		}
	}else{
		if(!tocapiedra((monster.x - 7), monster.y)){
			monster.y -= monster.speed*modifier;
		}
	}
	//////////////////////////////////////////////////////
	compruebatocar();
};

var nextLevels = function(){
	//Para subir de nivel
	monster.speed += 30;
	++numstone;
}

var tocaprincesa = function(px, py){
	//Comprueba si se toca a la princesa con las x e y de parametro
	var touch = false;
	if (px <= (princess.x + 30) && princess.x <= (px + 30) && py <= (princess.y + 30) && princess.y <= (py + 30)) {
		touch = true;
	}
	return touch;
}

var tocapiedra = function (px, py){
	//Comprueba si se toca a la piedra con las x e y de parametro
	var touch = false;
	if (px <= (stone.x + 30) && stone.x <= (px + 30) && py <= (stone.y + 30) && stone.y <= (py + 30)) {
		touch = true;
	}
	return touch;
}

var tocamonster = function(px, py){
	//Comprueba si se toca al monster con las x e y de parametro
	var touch = false;

	if (px <= (monster.x + 30) && monster.x <= (px + 30) && py <= (monster.y + 30) && monster.y <= (py + 30)) {
		touch = true;
	}
	return touch;
}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady) {
		ctx.drawImage(stoneImage, stone.x, stone.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);

};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
princesascogidas();
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible