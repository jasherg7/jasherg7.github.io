// I have not given nor recieved any unauthorized help on this project - Alex Laisney & Jasher Grunau

// You need a really powerful computer to run this game, suggested running on a desktop 
// and on a browser with no extra tabs. (The collision can occasionally phase through 
// because of frame drops not much we can do about it since there isn't really a better 
// way to handle background drawing.) We poured our hearts and soul into making a 
// faithful legend of Zelda game Hope you enjoy!

// Perlin Noise to draw mountain ranges
// monteCarlo to bias toward white
// splice() and replenish new particles for waterfall

var sketchProc=function(processingInstance){ with (processingInstance){
	size(400, 400); 


	//globals
	frameRate(15);
	angleMode = "radians";
	var state = "title";
	var prevState = "overworld";
	var hp = 6;
	var maxHp = 6;
	var newMap = true;
	var rupeeCount = 0;
	var arrowCount = 15;
	var magic = 10;
	var direction = "down";
	var player;
	var titlePosition = new PVector(width / 2 - 22, height / 2 + 61);
	var serif = createFont("serif", 20);
	var leafs = [];
	var waterfall = [];
	var sand = [];
	var rocks = [];
	var hearts = [];
	var arrows = [];
	var rupees = [];
	var name = "";
	var textsize = 10.6;
	var cursorVisible = false;
	var cursorTime = 0;
	var rupeeObj = function(x, y, s) {
		this.x = x;
		this.y = y;
		this.s = s;
		this.draw = function() {
			noStroke();
			fill(255, 255, 255); //white
			rect(x + -4 * s, y + -5 * s, s * 4, s * 8);
			rect(x + -1 * s, y + -8 * s, s * 1, s * 3);
			rect(x + -2 * s, y + -7 * s, s * 1, s * 2);
			rect(x + -3 * s, y + -6 * s, s * 1, s * 1);

			fill(13, 255, 0); //main color
			rect(x + 1 * s, y + 2 * s, s * 1, s * 1);
			rect(x + -4 * s, y + 2 * s, s * 3, s * 1);
			rect(x + -3 * s, y + 3 * s, s * 6, s * 1);
			rect(x + -2 * s, y + 4 * s, s * 4, s * 1);
			rect(x + -1 * s, y + 5 * s, s * 2, s * 1);
			rect(x + -3 * s, y + 1 * s, s * 1, s * 1);
			rect(x + -1 * s, y + -5 * s, s * 1, s * 7);
			rect(x + -2 * s, y + -4 * s, s * 1, s * 5);
			rect(x + -3 * s, y + -5 * s, s * 1, s * 1);
			rect(x + 0 * s, y + -5 * s, s * 4, s * 8);
			rect(x + 0 * s, y + -8 * s, s * 1, s * 3);
			rect(x + 1 * s, y + -7 * s, s * 1, s * 2);
			rect(x + 2 * s, y + -6 * s, s * 1, s * 1);

			fill(0, 0, 0); //black
			rect(x + -1 * s, y + -9 * s, s * 2, s * 1);
			rect(x + 1 * s, y + -8 * s, s * 1, s * 1);
			rect(x + -2 * s, y + -8 * s, s * 1, s * 1);
			rect(x + 2 * s, y + -7 * s, s * 1, s * 1);
			rect(x + -3 * s, y + -7 * s, s * 1, s * 1);
			rect(x + 3 * s, y + -6 * s, s * 1, s * 1);
			rect(x + -4 * s, y + -6 * s, s * 1, s * 1);
			rect(x + 4 * s, y + -5 * s, s * 1, s * 8);
			rect(x + -5 * s, y + -5 * s, s * 1, s * 8);

			rect(x + -1 * s, y + 6 * s, s * 2, s * 1);
			rect(x + 1 * s, y + 5 * s, s * 1, s * 1);
			rect(x + -2 * s, y + 5 * s, s * 1, s * 1);
			rect(x + 2 * s, y + 4 * s, s * 1, s * 1);
			rect(x + -3 * s, y + 4 * s, s * 1, s * 1);
			rect(x + 3 * s, y + 3 * s, s * 1, s * 1);
			rect(x + -4 * s, y + 3 * s, s * 1, s * 1);
			rect(x + 2 * s, y + -5 * s, s * 1, s * 1);
			rect(x + 0 * s, y + -5 * s, s * 1, s * 1);
			rect(x + 1 * s, y + -4 * s, s * 1, s * 6);
			rect(x + 2 * s, y + 2 * s, s * 1, s * 1);
			rect(x + 0 * s, y + 2 * s, s * 1, s * 1);
		};
	};
	var chars = [
		"", "", "", "", "", "", "", "", "", "    ", "", "", "", "\n", "\n", "", "shift", "ctrl", "alt", "pause/break", "caps", "", "", "", "", "", "", "esc", "", "", "", "", " ", "pg up", "pg down", "end", "home", "", "", "", "", "", "", "", "", "insert", "delete", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "", "", "", "", "", "", "", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
	];

	//var functions
	var find = function(arr, element) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === element) {
				return true;
			}
		}
		return false;
	};
	var fillColorFunction = function() {
		this.backgroundColor = function() {
			fill(0, 178, 255);
		};
		this.red = function() {
			fill(212, 2, 2);
			stroke(212, 2, 2);
		};
		this.darkRed = function() {
			fill(145, 2, 2);
			stroke(145, 2, 2);
		};
		this.white = function() {
			fill(255, 255, 255);
			stroke(255, 255, 255);
		};
		this.green = function() {
			fill(114, 191, 83);
			stroke(114, 191, 83);
		};
		this.orange = function() {
			fill(250, 139, 13);
		};
		this.tan = function() {
			fill(230, 183, 126);
			stroke(238, 226, 168);
		};
		this.brown = function() {
			fill(72, 53, 49);
			stroke(72, 53, 49);
		};
		this.pink = function() {
			fill(231, 109, 131);
			stroke(231, 109, 131);
		};
		this.black = function() {
			fill(0, 0, 0);
			stroke(0, 0, 0);
		};
		this.sand = function() {
			fill(238, 226, 168);
			stroke(230, 183, 126);
		};
		this.rock = function() {
			fill(166, 103, 21);
			stroke(166, 103, 21);
		};
		this.blue = function() {
			fill(65, 105, 225);
		};
		this.lightBlue = function() {
			fill(52, 152, 219);
		};
	};
	var fillColor = new fillColorFunction();
	var spiderObj = function(x, y, s) {
		this.position = new PVector(x, y);
		var timeScale = 1 / 2;
		var self = this;
		var count = [0, 0];
		var crouching = 0;
		var blockSize = 25;
		var moving = false;
		var generatedDest = false;
		var newCoor;
		var velocity = new PVector(0, 0);
		var drawSquatPose = function() {
			noStroke();
			pushMatrix();
			translate(self.position.x, self.position.y);
			scale(s);
			fillColor.red();
			rect(25, 50, blockSize, blockSize);
			rect(0, 75, blockSize, blockSize);
			rect(0, 100, blockSize, blockSize);
			rect(0, 125, blockSize, blockSize);
			rect(0, 150, blockSize, blockSize);
			rect(350, 50, blockSize, blockSize);
			rect(375, 75, blockSize, blockSize);
			rect(375, 100, blockSize, blockSize);
			rect(375, 125, blockSize, blockSize);
			rect(375, 150, blockSize, blockSize);
			rect(325, 50, blockSize, blockSize);
			rect(325, 75, blockSize, blockSize);
			rect(300, 75, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(50, 75, blockSize, blockSize);
			rect(75, 75, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(275, 150, blockSize, blockSize);
			rect(375, 225, blockSize, blockSize);
			rect(375, 250, blockSize, blockSize);
			rect(375, 275, blockSize, blockSize);
			rect(375, 300, blockSize, blockSize);
			rect(375, 325, blockSize, blockSize);
			rect(350, 200, blockSize, blockSize);
			rect(325, 200, blockSize, blockSize);
			rect(300, 200, blockSize, blockSize);
			rect(300, 225, blockSize, blockSize);
			rect(325, 225, blockSize, blockSize);
			rect(0, 225, blockSize, blockSize);
			rect(0, 250, blockSize, blockSize);
			rect(0, 275, blockSize, blockSize);
			rect(0, 300, blockSize, blockSize);
			rect(0, 325, blockSize, blockSize);
			rect(25, 200, blockSize, blockSize);
			rect(50, 200, blockSize, blockSize);
			rect(75, 200, blockSize, blockSize);
			rect(75, 225, blockSize, blockSize);
			rect(50, 225, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			fillColor.orange();
			rect(100, 75, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(225, 50, blockSize, blockSize);
			rect(250, 75, blockSize, blockSize);
			rect(275, 75, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(75, 100, blockSize, blockSize);
			rect(75, 125, blockSize, blockSize);
			rect(50, 125, blockSize, blockSize);
			rect(50, 150, blockSize, blockSize);
			rect(50, 175, blockSize, blockSize);
			rect(75, 175, blockSize, blockSize);
			rect(75, 175, blockSize, blockSize);
			rect(75, 150, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(100, 100, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(250, 100, blockSize, blockSize);
			rect(275, 100, blockSize, blockSize);
			rect(275, 125, blockSize, blockSize);
			rect(300, 100, blockSize, blockSize);
			rect(300, 125, blockSize, blockSize);
			rect(325, 125, blockSize, blockSize);
			rect(325, 150, blockSize, blockSize);
			rect(325, 175, blockSize, blockSize);
			rect(300, 175, blockSize, blockSize);
			rect(300, 150, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(100, 225, blockSize, blockSize);
			rect(100, 250, blockSize, blockSize);
			rect(125, 250, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(275, 225, blockSize, blockSize);
			rect(275, 250, blockSize, blockSize);
			rect(250, 250, blockSize, blockSize);
			rect(250, 275, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(200, 275, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			fillColor.white();
			rect(125, 200, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(250, 200, blockSize, blockSize);
			rect(250, 225, blockSize, blockSize);
			rect(0, 50, blockSize, blockSize);
			rect(375, 50, blockSize, blockSize);
			rect(0, 8 * 25, blockSize, blockSize);
			rect(375, 8 * 25, blockSize, blockSize);
			rect(6 * 25, 12 * 25, blockSize, blockSize);
			rect(9 * 25, 12 * 25, blockSize, blockSize);
			popMatrix();
		};
		var drawJumpPose = function() {
			noStroke();
			pushMatrix();
			translate(self.position.x, self.position.y - blockSize * s);
			scale(s);
			fillColor.red();
			fillColor.orange();
			rect(150, 0, blockSize, blockSize);
			rect(175, 0, blockSize, blockSize);
			rect(200, 0, blockSize, blockSize);
			rect(225, 0, blockSize, blockSize);
			rect(125, 25, blockSize, blockSize);
			rect(100, 25, blockSize, blockSize);
			rect(100, 50, blockSize, blockSize);
			rect(125, 50, blockSize, blockSize);
			rect(250, 25, blockSize, blockSize);
			rect(275, 25, blockSize, blockSize);
			rect(275, 50, blockSize, blockSize);
			rect(250, 50, blockSize, blockSize);
			rect(300, 75, blockSize, blockSize);
			rect(300, 100, blockSize, blockSize);
			rect(300, 125, blockSize, blockSize);
			rect(300, 150, blockSize, blockSize);
			rect(325, 125, blockSize, blockSize);
			rect(325, 150, blockSize, blockSize);
			rect(75, 75, blockSize, blockSize);
			rect(75, 100, blockSize, blockSize);
			rect(75, 125, blockSize, blockSize);
			rect(75, 150, blockSize, blockSize);
			rect(50, 150, blockSize, blockSize);
			rect(50, 125, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(275, 125, blockSize, blockSize);
			rect(275, 150, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(125, 200, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(250, 200, blockSize, blockSize);
			rect(250, 225, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(175, 25, blockSize, blockSize);
			rect(200, 25, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(225, 50, blockSize, blockSize);
			rect(100, 75, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(250, 75, blockSize, blockSize);
			rect(275, 75, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(250, 100, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			fillColor.red();
			rect(175, 150, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(275, 100, blockSize, blockSize);
			rect(225, 25, blockSize, blockSize);
			rect(150, 25, blockSize, blockSize);
			rect(100, 100, blockSize, blockSize);
			rect(300, 50, blockSize, blockSize);
			rect(325, 75, blockSize, blockSize);
			rect(325, 100, blockSize, blockSize);
			rect(75, 50, blockSize, blockSize);
			rect(50, 75, blockSize, blockSize);
			rect(50, 100, blockSize, blockSize);
			rect(25, 125, blockSize, blockSize);
			rect(25, 150, blockSize, blockSize);
			rect(350, 125, blockSize, blockSize);
			rect(350, 150, blockSize, blockSize);
			rect(375, 175, blockSize, blockSize);
			rect(0, 175, blockSize, blockSize);
			rect(300, 175, blockSize, blockSize);
			rect(300, 200, blockSize, blockSize);
			rect(300, 225, blockSize, blockSize);
			rect(325, 225, blockSize, blockSize);
			rect(350, 225, blockSize, blockSize);
			rect(325, 200, blockSize, blockSize);
			rect(350, 275, blockSize, blockSize);
			rect(350, 300, blockSize, blockSize);
			rect(350, 325, blockSize, blockSize);
			rect(375, 350, blockSize, blockSize);
			rect(75, 175, blockSize, blockSize);
			rect(75, 200, blockSize, blockSize);
			rect(75, 225, blockSize, blockSize);
			rect(50, 225, blockSize, blockSize);
			rect(25, 225, blockSize, blockSize);
			rect(50, 200, blockSize, blockSize);
			rect(25, 275, blockSize, blockSize);
			rect(25, 300, blockSize, blockSize);
			rect(25, 325, blockSize, blockSize);
			rect(0, 350, blockSize, blockSize);
			fillColor.white();
			rect(25, 250, blockSize, blockSize);
			rect(350, 250, blockSize, blockSize);
			rect(375, 150, blockSize, blockSize);
			rect(0, 150, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			popMatrix();
		};
		var hopHeight = 25;

		var standStill = function(squating) {
			if (squating) {
				drawSquatPose();
			} else {
				drawJumpPose();
			}
		};
		var vectorsInRange = function(currVector, destVector, range) {
			return abs(currVector.x - destVector.x) <= range || abs(currVector.y - destVector.y) <= range;
		};
		this.draw = function() {
			if (moving) {
				if (generatedDest) {
					if (count[1] > 10 * timeScale) {
						standStill(0);
						if (vectorsInRange(self.position, newCoor, 2)) {
							count[1] = 0;
							generatedDest = false;
							moving = round(random(false, true));
						} else {
							self.position.add(velocity);
						}
					} else {
						standStill(1);
					}
					count[1]++;
				} else {
					standStill(1);
					var nooX = floor(random(width * s / 2, width - floor(width * s / 2)));
					var nooY = floor(random((((height / 10) * 2) + height * s / 2), height - floor(height * s / 2)));
					newCoor = new PVector(nooX, nooY);
					velocity.set(newCoor.x - self.position.x, newCoor.y - self.position.y);
					velocity.div(10);
					generatedDest = true;
				}
			} else {
				if (count[0] > 30 * timeScale) {
					crouching ^= 1;
					count[0] = 0;
					if (crouching) {
						moving = round(random(false, true));
						//moving = false;
					}
				}
				count[0]++;
				standStill(crouching);
			}

		};
	};
	var spiders = [];

	var rockFormationObj = function(x, y, s, type) {
		this.position = new PVector(x, y);
		var blockSize = 25;
		this.type = type;
		noStroke();
		this.drawSand = function() {
			pushMatrix();
			scale(s);
			translate(this.position.x, this.position.y);
			fillColor.sand();
			rect(0, 0, width, height);
			popMatrix();
		};
		this.drawDirt = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			scale(s);
			fillColor.sand();
			rect(0, 0, width, height);
			fillColor.rock();
			rect(375, 0, blockSize, blockSize);
			rect(300, 25, blockSize, blockSize);
			rect(325, 125, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(350, 275, blockSize, blockSize);
			rect(275, 300, blockSize, blockSize);
			rect(225, 375, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(75, 375, blockSize, blockSize);
			rect(0, 325, blockSize, blockSize);
			rect(50, 250, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(25, 125, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			popMatrix();
		};
		this.drawTopLeft = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			scale(s);
			fillColor.rock();
			rect(275, 0, blockSize, blockSize);
			rect(250, 0, blockSize, blockSize);
			rect(275, 25, blockSize, blockSize);
			rect(275, 50, blockSize, blockSize);
			rect(275, 75, blockSize, blockSize);
			rect(275, 100, blockSize, blockSize);
			rect(275, 125, blockSize, blockSize);
			rect(275, 150, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(275, 225, blockSize, blockSize);
			rect(275, 250, blockSize, blockSize);
			rect(275, 275, blockSize, blockSize);
			rect(275, 300, blockSize, blockSize);
			rect(275, 325, blockSize, blockSize);
			rect(275, 350, blockSize, blockSize);
			rect(275, 375, blockSize, blockSize);
			rect(225, 25, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(225, 50, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(250, 25, blockSize, blockSize);
			rect(250, 50, blockSize, blockSize);
			fillColor.black();
			rect(300, 0, blockSize, blockSize);
			rect(325, 0, blockSize, blockSize);
			rect(325, 25, blockSize, blockSize);
			rect(350, 25, blockSize, blockSize);
			rect(350, 50, blockSize, blockSize);
			rect(350, 75, blockSize, blockSize);
			rect(375, 75, blockSize, blockSize);
			rect(350, 100, blockSize, blockSize);
			rect(375, 100, blockSize, blockSize);
			rect(350, 125, blockSize, blockSize);
			rect(375, 125, blockSize, blockSize);
			rect(350, 150, blockSize, blockSize);
			rect(375, 150, blockSize, blockSize);
			rect(350, 175, blockSize, blockSize);
			rect(350, 250, blockSize, blockSize);
			rect(350, 275, blockSize, blockSize);
			rect(350, 300, blockSize, blockSize);
			rect(350, 325, blockSize, blockSize);
			rect(375, 325, blockSize, blockSize);
			rect(375, 300, blockSize, blockSize);
			rect(375, 275, blockSize, blockSize);
			rect(350, 350, blockSize, blockSize);
			rect(350, 375, blockSize, blockSize);
			rect(325, 350, blockSize, blockSize);
			rect(275, 375, blockSize, blockSize);
			rect(250, 375, blockSize, blockSize);
			rect(200, 375, blockSize, blockSize);
			rect(200, 350, blockSize, blockSize);
			rect(175, 350, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(150, 375, blockSize, blockSize);
			rect(175, 375, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(150, 300, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(100, 325, blockSize, blockSize);
			rect(100, 300, blockSize, blockSize);
			rect(100, 275, blockSize, blockSize);
			rect(100, 225, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(75, 200, blockSize, blockSize);
			fillColor.rock();
			rect(0, 375, blockSize, blockSize);
			rect(0, 350, blockSize, blockSize);
			rect(25, 375, blockSize, blockSize);
			rect(25, 350, blockSize, blockSize);
			rect(50, 350, blockSize, blockSize);
			rect(75, 350, blockSize, blockSize);
			rect(75, 375, blockSize, blockSize);
			rect(50, 375, blockSize, blockSize);
			rect(100, 375, blockSize, blockSize);
			rect(100, 350, blockSize, blockSize);
			rect(125, 350, blockSize, blockSize);
			rect(125, 375, blockSize, blockSize);
			rect(25, 325, blockSize, blockSize);
			rect(25, 300, blockSize, blockSize);
			rect(25, 275, blockSize, blockSize);
			rect(25, 250, blockSize, blockSize);
			rect(50, 225, blockSize, blockSize);
			rect(75, 225, blockSize, blockSize);
			rect(75, 250, blockSize, blockSize);
			rect(100, 250, blockSize, blockSize);
			rect(50, 250, blockSize, blockSize);
			rect(50, 275, blockSize, blockSize);
			rect(75, 275, blockSize, blockSize);
			rect(75, 300, blockSize, blockSize);
			rect(50, 300, blockSize, blockSize);
			rect(50, 325, blockSize, blockSize);
			rect(75, 325, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(125, 200, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(125, 250, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(125, 300, blockSize, blockSize);
			rect(125, 325, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(200, 325, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(225, 300, blockSize, blockSize);
			rect(225, 325, blockSize, blockSize);
			rect(225, 350, blockSize, blockSize);
			rect(225, 375, blockSize, blockSize);
			rect(350, 200, blockSize, blockSize);
			rect(350, 225, blockSize, blockSize);
			fillColor.black();
			rect(325, 125, blockSize, blockSize);
			fillColor.rock();
			rect(300, 25, blockSize, blockSize);
			rect(300, 50, blockSize, blockSize);
			rect(325, 50, blockSize, blockSize);
			rect(250, 75, blockSize, blockSize);
			rect(250, 100, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(250, 200, blockSize, blockSize);
			rect(250, 225, blockSize, blockSize);
			rect(250, 250, blockSize, blockSize);
			rect(250, 275, blockSize, blockSize);
			rect(250, 300, blockSize, blockSize);
			rect(250, 325, blockSize, blockSize);
			rect(250, 350, blockSize, blockSize);
			rect(325, 375, blockSize, blockSize);
			rect(300, 375, blockSize, blockSize);
			rect(300, 350, blockSize, blockSize);
			rect(300, 325, blockSize, blockSize);
			rect(325, 325, blockSize, blockSize);
			rect(325, 300, blockSize, blockSize);
			rect(300, 300, blockSize, blockSize);
			rect(300, 275, blockSize, blockSize);
			rect(325, 275, blockSize, blockSize);
			rect(325, 250, blockSize, blockSize);
			rect(300, 250, blockSize, blockSize);
			rect(300, 225, blockSize, blockSize);
			rect(325, 225, blockSize, blockSize);
			rect(325, 200, blockSize, blockSize);
			rect(300, 200, blockSize, blockSize);
			rect(300, 175, blockSize, blockSize);
			rect(325, 175, blockSize, blockSize);
			rect(325, 150, blockSize, blockSize);
			rect(300, 150, blockSize, blockSize);
			rect(300, 125, blockSize, blockSize);
			rect(300, 100, blockSize, blockSize);
			rect(325, 100, blockSize, blockSize);
			rect(325, 75, blockSize, blockSize);
			rect(300, 75, blockSize, blockSize);
			fillColor.sand();
			rect(350, 0, blockSize, blockSize);
			rect(375, 0, blockSize, blockSize);
			rect(375, 25, blockSize, blockSize);
			rect(375, 50, blockSize, blockSize);
			rect(375, 175, blockSize, blockSize);
			rect(375, 200, blockSize, blockSize);
			rect(375, 225, blockSize, blockSize);
			rect(375, 250, blockSize, blockSize);
			rect(375, 350, blockSize, blockSize);
			rect(375, 375, blockSize, blockSize);
			rect(200, 275, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(225, 0, blockSize, blockSize);
			rect(200, 0, blockSize, blockSize);
			rect(200, 25, blockSize, blockSize);
			rect(175, 0, blockSize, blockSize);
			rect(175, 25, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(150, 25, blockSize, blockSize);
			rect(150, 0, blockSize, blockSize);
			rect(125, 0, blockSize, blockSize);
			rect(125, 25, blockSize, blockSize);
			rect(125, 50, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			rect(100, 0, blockSize, blockSize);
			rect(100, 25, blockSize, blockSize);
			rect(100, 50, blockSize, blockSize);
			rect(100, 75, blockSize, blockSize);
			rect(100, 100, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(75, 0, blockSize, blockSize);
			rect(75, 25, blockSize, blockSize);
			rect(75, 50, blockSize, blockSize);
			rect(75, 75, blockSize, blockSize);
			rect(75, 100, blockSize, blockSize);
			rect(75, 125, blockSize, blockSize);
			rect(75, 150, blockSize, blockSize);
			rect(75, 175, blockSize, blockSize);
			rect(50, 0, blockSize, blockSize);
			rect(50, 25, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(50, 75, blockSize, blockSize);
			rect(50, 100, blockSize, blockSize);
			rect(50, 125, blockSize, blockSize);
			rect(50, 150, blockSize, blockSize);
			rect(50, 175, blockSize, blockSize);
			rect(50, 200, blockSize, blockSize);
			rect(25, 0, blockSize, blockSize);
			rect(25, 25, blockSize, blockSize);
			rect(25, 50, blockSize, blockSize);
			rect(25, 75, blockSize, blockSize);
			rect(25, 100, blockSize, blockSize);
			rect(25, 125, blockSize, blockSize);
			rect(25, 150, blockSize, blockSize);
			rect(25, 175, blockSize, blockSize);
			rect(25, 200, blockSize, blockSize);
			rect(25, 225, blockSize, blockSize);
			rect(0, 325, blockSize, blockSize);
			rect(0, 300, blockSize, blockSize);
			rect(0, 275, blockSize, blockSize);
			rect(0, 250, blockSize, blockSize);
			rect(0, 225, blockSize, blockSize);
			rect(0, 200, blockSize, blockSize);
			rect(0, 175, blockSize, blockSize);
			rect(0, 150, blockSize, blockSize);
			rect(0, 125, blockSize, blockSize);
			rect(0, 100, blockSize, blockSize);
			rect(0, 75, blockSize, blockSize);
			rect(0, 50, blockSize, blockSize);
			rect(0, 25, blockSize, blockSize);
			rect(0, 0, blockSize, blockSize);
			popMatrix();
		};
		this.drawTopMiddle = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			scale(s);
			fillColor.sand();
			rect(0, 0, blockSize, blockSize);
			rect(25, 0, blockSize, blockSize);
			rect(0, 25, blockSize, blockSize);
			rect(0, 75, blockSize, blockSize);
			rect(0, 100, blockSize, blockSize);
			rect(0, 125, blockSize, blockSize);
			rect(0, 150, blockSize, blockSize);
			rect(0, 275, blockSize, blockSize);
			rect(150, 0, blockSize, blockSize);
			rect(175, 0, blockSize, blockSize);
			rect(200, 0, blockSize, blockSize);
			rect(225, 0, blockSize, blockSize);
			rect(250, 0, blockSize, blockSize);
			rect(275, 0, blockSize, blockSize);
			rect(300, 0, blockSize, blockSize);
			rect(325, 0, blockSize, blockSize);
			rect(350, 0, blockSize, blockSize);
			rect(375, 0, blockSize, blockSize);
			rect(375, 25, blockSize, blockSize);
			rect(375, 50, blockSize, blockSize);
			rect(375, 75, blockSize, blockSize);
			rect(375, 100, blockSize, blockSize);
			fillColor.rock();
			rect(0, 50, blockSize, blockSize);
			rect(25, 25, blockSize, blockSize);
			rect(50, 0, blockSize, blockSize);
			rect(75, 0, blockSize, blockSize);
			rect(100, 25, blockSize, blockSize);
			rect(125, 50, blockSize, blockSize);
			rect(100, 50, blockSize, blockSize);
			rect(75, 50, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(25, 50, blockSize, blockSize);
			rect(50, 25, blockSize, blockSize);
			rect(75, 25, blockSize, blockSize);
			rect(0, 200, blockSize, blockSize);
			rect(0, 225, blockSize, blockSize);
			rect(0, 250, blockSize, blockSize);
			rect(0, 325, blockSize, blockSize);
			rect(25, 375, blockSize, blockSize);
			rect(25, 350, blockSize, blockSize);
			rect(25, 325, blockSize, blockSize);
			rect(25, 300, blockSize, blockSize);
			rect(25, 275, blockSize, blockSize);
			rect(25, 250, blockSize, blockSize);
			rect(25, 225, blockSize, blockSize);
			rect(25, 200, blockSize, blockSize);
			rect(25, 175, blockSize, blockSize);
			rect(25, 150, blockSize, blockSize);
			rect(25, 125, blockSize, blockSize);
			rect(25, 100, blockSize, blockSize);
			rect(25, 75, blockSize, blockSize);
			rect(50, 350, blockSize, blockSize);
			rect(75, 350, blockSize, blockSize);
			rect(100, 350, blockSize, blockSize);
			rect(100, 375, blockSize, blockSize);
			rect(125, 375, blockSize, blockSize);
			rect(125, 325, blockSize, blockSize);
			rect(100, 325, blockSize, blockSize);
			rect(75, 325, blockSize, blockSize);
			rect(50, 325, blockSize, blockSize);
			rect(50, 300, blockSize, blockSize);
			rect(75, 300, blockSize, blockSize);
			rect(100, 300, blockSize, blockSize);
			rect(125, 300, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(100, 275, blockSize, blockSize);
			rect(75, 275, blockSize, blockSize);
			rect(50, 275, blockSize, blockSize);
			rect(50, 250, blockSize, blockSize);
			rect(75, 250, blockSize, blockSize);
			rect(100, 250, blockSize, blockSize);
			rect(125, 250, blockSize, blockSize);
			rect(50, 75, blockSize, blockSize);
			rect(50, 100, blockSize, blockSize);
			rect(50, 125, blockSize, blockSize);
			rect(50, 150, blockSize, blockSize);
			rect(50, 175, blockSize, blockSize);
			rect(50, 200, blockSize, blockSize);
			rect(50, 225, blockSize, blockSize);
			rect(75, 75, blockSize, blockSize);
			rect(75, 100, blockSize, blockSize);
			rect(75, 125, blockSize, blockSize);
			rect(75, 150, blockSize, blockSize);
			rect(75, 175, blockSize, blockSize);
			rect(75, 200, blockSize, blockSize);
			rect(75, 225, blockSize, blockSize);
			rect(100, 75, blockSize, blockSize);
			rect(100, 100, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(100, 225, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(125, 200, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(225, 300, blockSize, blockSize);
			rect(225, 350, blockSize, blockSize);
			rect(200, 350, blockSize, blockSize);
			rect(200, 375, blockSize, blockSize);
			rect(225, 375, blockSize, blockSize);
			rect(250, 375, blockSize, blockSize);
			rect(250, 350, blockSize, blockSize);
			rect(275, 350, blockSize, blockSize);
			rect(325, 350, blockSize, blockSize);
			rect(325, 375, blockSize, blockSize);
			rect(350, 375, blockSize, blockSize);
			rect(325, 325, blockSize, blockSize);
			rect(350, 325, blockSize, blockSize);
			rect(350, 300, blockSize, blockSize);
			rect(325, 300, blockSize, blockSize);
			rect(325, 275, blockSize, blockSize);
			rect(300, 325, blockSize, blockSize);
			rect(300, 300, blockSize, blockSize);
			rect(300, 275, blockSize, blockSize);
			rect(275, 300, blockSize, blockSize);
			rect(250, 300, blockSize, blockSize);
			rect(300, 250, blockSize, blockSize);
			rect(300, 225, blockSize, blockSize);
			fillColor.black();
			rect(100, 0, blockSize, blockSize);
			rect(125, 0, blockSize, blockSize);
			rect(125, 25, blockSize, blockSize);
			rect(150, 25, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(150, 300, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(125, 350, blockSize, blockSize);
			rect(150, 375, blockSize, blockSize);
			rect(50, 375, blockSize, blockSize);
			rect(75, 375, blockSize, blockSize);
			rect(0, 375, blockSize, blockSize);
			rect(0, 350, blockSize, blockSize);
			rect(0, 300, blockSize, blockSize);
			rect(0, 175, blockSize, blockSize);
			rect(250, 325, blockSize, blockSize);
			rect(275, 325, blockSize, blockSize);
			rect(300, 350, blockSize, blockSize);
			rect(300, 375, blockSize, blockSize);
			rect(275, 375, blockSize, blockSize);
			rect(350, 350, blockSize, blockSize);
			rect(375, 350, blockSize, blockSize);
			rect(375, 375, blockSize, blockSize);
			rect(375, 325, blockSize, blockSize);
			rect(375, 300, blockSize, blockSize);
			rect(375, 275, blockSize, blockSize);
			rect(350, 275, blockSize, blockSize);
			rect(350, 250, blockSize, blockSize);
			rect(325, 250, blockSize, blockSize);
			fillColor.rock();
			rect(225, 175, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(250, 50, blockSize, blockSize);
			rect(275, 25, blockSize, blockSize);
			rect(300, 50, blockSize, blockSize);
			rect(325, 75, blockSize, blockSize);
			rect(275, 50, blockSize, blockSize);
			rect(250, 75, blockSize, blockSize);
			rect(275, 75, blockSize, blockSize);
			rect(300, 75, blockSize, blockSize);
			rect(325, 100, blockSize, blockSize);
			rect(300, 100, blockSize, blockSize);
			rect(275, 100, blockSize, blockSize);
			rect(250, 100, blockSize, blockSize);
			rect(350, 125, blockSize, blockSize);
			rect(350, 150, blockSize, blockSize);
			rect(325, 150, blockSize, blockSize);
			rect(300, 150, blockSize, blockSize);
			rect(275, 150, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(275, 125, blockSize, blockSize);
			rect(300, 125, blockSize, blockSize);
			rect(325, 125, blockSize, blockSize);
			rect(325, 175, blockSize, blockSize);
			rect(325, 200, blockSize, blockSize);
			rect(300, 175, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(250, 200, blockSize, blockSize);
			rect(250, 225, blockSize, blockSize);
			rect(250, 250, blockSize, blockSize);
			rect(250, 275, blockSize, blockSize);
			rect(275, 275, blockSize, blockSize);
			rect(275, 250, blockSize, blockSize);
			rect(275, 225, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(300, 200, blockSize, blockSize);
			fillColor.black();
			rect(325, 225, blockSize, blockSize);
			rect(350, 225, blockSize, blockSize);
			rect(350, 200, blockSize, blockSize);
			rect(350, 175, blockSize, blockSize);
			rect(375, 175, blockSize, blockSize);
			rect(375, 150, blockSize, blockSize);
			rect(375, 125, blockSize, blockSize);
			rect(350, 100, blockSize, blockSize);
			rect(350, 75, blockSize, blockSize);
			rect(325, 50, blockSize, blockSize);
			rect(300, 25, blockSize, blockSize);
			fillColor.sand();
			rect(175, 25, blockSize, blockSize);
			rect(200, 25, blockSize, blockSize);
			rect(225, 25, blockSize, blockSize);
			rect(250, 25, blockSize, blockSize);
			rect(325, 25, blockSize, blockSize);
			rect(350, 25, blockSize, blockSize);
			rect(350, 50, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(225, 50, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(200, 275, blockSize, blockSize);
			rect(200, 325, blockSize, blockSize);
			rect(225, 325, blockSize, blockSize);
			rect(175, 350, blockSize, blockSize);
			rect(175, 375, blockSize, blockSize);
			rect(375, 200, blockSize, blockSize);
			rect(375, 225, blockSize, blockSize);
			rect(375, 250, blockSize, blockSize);
			popMatrix();
		};
		this.drawTopRight = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			scale(s);
			fillColor.sand();
			rect(0, 0, blockSize, blockSize);
			rect(25, 0, blockSize, blockSize);
			rect(50, 0, blockSize, blockSize);
			rect(75, 0, blockSize, blockSize);
			rect(100, 0, blockSize, blockSize);
			rect(125, 0, blockSize, blockSize);
			rect(150, 0, blockSize, blockSize);
			rect(175, 0, blockSize, blockSize);
			rect(200, 0, blockSize, blockSize);
			rect(225, 0, blockSize, blockSize);
			rect(250, 0, blockSize, blockSize);
			rect(275, 0, blockSize, blockSize);
			rect(300, 0, blockSize, blockSize);
			rect(325, 0, blockSize, blockSize);
			rect(350, 0, blockSize, blockSize);
			rect(375, 0, blockSize, blockSize);
			rect(375, 25, blockSize, blockSize);
			rect(375, 50, blockSize, blockSize);
			rect(375, 75, blockSize, blockSize);
			rect(375, 125, blockSize, blockSize);
			rect(375, 100, blockSize, blockSize);
			rect(375, 150, blockSize, blockSize);
			rect(375, 175, blockSize, blockSize);
			rect(375, 200, blockSize, blockSize);
			rect(375, 250, blockSize, blockSize);
			rect(375, 225, blockSize, blockSize);
			rect(375, 275, blockSize, blockSize);
			rect(375, 300, blockSize, blockSize);
			rect(375, 325, blockSize, blockSize);
			rect(375, 350, blockSize, blockSize);
			rect(375, 375, blockSize, blockSize);
			rect(350, 375, blockSize, blockSize);
			rect(200, 375, blockSize, blockSize);
			rect(200, 350, blockSize, blockSize);
			rect(200, 325, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(0, 325, blockSize, blockSize);
			rect(25, 325, blockSize, blockSize);
			rect(0, 275, blockSize, blockSize);
			rect(0, 175, blockSize, blockSize);
			rect(0, 150, blockSize, blockSize);
			rect(0, 125, blockSize, blockSize);
			rect(0, 75, blockSize, blockSize);
			rect(0, 50, blockSize, blockSize);
			rect(0, 25, blockSize, blockSize);
			rect(25, 25, blockSize, blockSize);
			rect(25, 50, blockSize, blockSize);
			rect(50, 25, blockSize, blockSize);
			rect(125, 25, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(150, 25, blockSize, blockSize);
			rect(175, 25, blockSize, blockSize);
			rect(200, 25, blockSize, blockSize);
			rect(225, 25, blockSize, blockSize);
			rect(250, 25, blockSize, blockSize);
			rect(275, 25, blockSize, blockSize);
			rect(300, 25, blockSize, blockSize);
			rect(325, 25, blockSize, blockSize);
			rect(350, 25, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(225, 50, blockSize, blockSize);
			rect(250, 50, blockSize, blockSize);
			rect(275, 50, blockSize, blockSize);
			rect(300, 50, blockSize, blockSize);
			rect(325, 50, blockSize, blockSize);
			rect(350, 50, blockSize, blockSize);
			fillColor.black();
			rect(100, 25, blockSize, blockSize);
			rect(125, 50, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(125, 250, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(175, 350, blockSize, blockSize);
			rect(175, 375, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(100, 350, blockSize, blockSize);
			rect(100, 375, blockSize, blockSize);
			rect(75, 375, blockSize, blockSize);
			rect(50, 325, blockSize, blockSize);
			rect(75, 325, blockSize, blockSize);
			rect(0, 300, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(300, 175, blockSize, blockSize);
			rect(325, 200, blockSize, blockSize);
			rect(325, 225, blockSize, blockSize);
			rect(350, 250, blockSize, blockSize);
			rect(350, 275, blockSize, blockSize);
			rect(350, 300, blockSize, blockSize);
			rect(350, 325, blockSize, blockSize);
			rect(350, 350, blockSize, blockSize);
			rect(325, 325, blockSize, blockSize);
			rect(325, 350, blockSize, blockSize);
			rect(325, 375, blockSize, blockSize);
			rect(275, 375, blockSize, blockSize);
			rect(250, 375, blockSize, blockSize);
			rect(225, 375, blockSize, blockSize);
			rect(225, 350, blockSize, blockSize);
			rect(250, 350, blockSize, blockSize);
			fillColor.sand();
			rect(200, 275, blockSize, blockSize);
			fillColor.rock();
			rect(75, 25, blockSize, blockSize);
			rect(75, 50, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(50, 75, blockSize, blockSize);
			rect(25, 75, blockSize, blockSize);
			rect(25, 100, blockSize, blockSize);
			rect(0, 200, blockSize, blockSize);
			rect(0, 225, blockSize, blockSize);
			rect(0, 250, blockSize, blockSize);
			rect(0, 350, blockSize, blockSize);
			rect(0, 375, blockSize, blockSize);
			rect(25, 375, blockSize, blockSize);
			rect(50, 375, blockSize, blockSize);
			rect(25, 350, blockSize, blockSize);
			rect(50, 350, blockSize, blockSize);
			rect(75, 350, blockSize, blockSize);
			rect(125, 350, blockSize, blockSize);
			rect(125, 375, blockSize, blockSize);
			rect(150, 375, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(150, 300, blockSize, blockSize);
			rect(125, 300, blockSize, blockSize);
			rect(125, 325, blockSize, blockSize);
			rect(100, 325, blockSize, blockSize);
			rect(100, 300, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(100, 275, blockSize, blockSize);
			rect(100, 250, blockSize, blockSize);
			rect(100, 225, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(125, 200, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(100, 75, blockSize, blockSize);
			rect(100, 50, blockSize, blockSize);
			rect(75, 75, blockSize, blockSize);
			rect(75, 100, blockSize, blockSize);
			rect(100, 100, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(75, 125, blockSize, blockSize);
			rect(50, 125, blockSize, blockSize);
			rect(50, 100, blockSize, blockSize);
			rect(25, 125, blockSize, blockSize);
			fillColor.black();
			rect(0, 100, blockSize, blockSize);
			fillColor.rock();
			rect(25, 150, blockSize, blockSize);
			rect(50, 150, blockSize, blockSize);
			rect(75, 150, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(25, 175, blockSize, blockSize);
			rect(50, 175, blockSize, blockSize);
			rect(75, 175, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(25, 200, blockSize, blockSize);
			rect(50, 200, blockSize, blockSize);
			rect(75, 200, blockSize, blockSize);
			rect(25, 225, blockSize, blockSize);
			rect(50, 225, blockSize, blockSize);
			rect(75, 225, blockSize, blockSize);
			rect(25, 250, blockSize, blockSize);
			rect(50, 250, blockSize, blockSize);
			rect(75, 250, blockSize, blockSize);
			rect(25, 275, blockSize, blockSize);
			rect(50, 275, blockSize, blockSize);
			rect(75, 275, blockSize, blockSize);
			rect(25, 300, blockSize, blockSize);
			rect(50, 300, blockSize, blockSize);
			rect(75, 300, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(250, 200, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(300, 200, blockSize, blockSize);
			rect(250, 225, blockSize, blockSize);
			rect(275, 225, blockSize, blockSize);
			rect(300, 225, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(250, 250, blockSize, blockSize);
			rect(275, 250, blockSize, blockSize);
			rect(300, 250, blockSize, blockSize);
			rect(325, 250, blockSize, blockSize);
			rect(300, 375, blockSize, blockSize);
			rect(300, 350, blockSize, blockSize);
			rect(275, 350, blockSize, blockSize);
			rect(300, 325, blockSize, blockSize);
			rect(325, 300, blockSize, blockSize);
			rect(325, 275, blockSize, blockSize);
			rect(300, 275, blockSize, blockSize);
			rect(300, 300, blockSize, blockSize);
			rect(275, 275, blockSize, blockSize);
			rect(275, 300, blockSize, blockSize);
			rect(250, 300, blockSize, blockSize);
			rect(250, 325, blockSize, blockSize);
			rect(275, 325, blockSize, blockSize);
			rect(225, 325, blockSize, blockSize);
			rect(225, 300, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(250, 275, blockSize, blockSize);
			fillColor.sand();
			rect(175, 200, blockSize, blockSize);
			rect(350, 225, blockSize, blockSize);
			rect(350, 200, blockSize, blockSize);
			rect(350, 175, blockSize, blockSize);
			rect(350, 150, blockSize, blockSize);
			rect(350, 125, blockSize, blockSize);
			rect(350, 100, blockSize, blockSize);
			rect(350, 75, blockSize, blockSize);
			rect(325, 75, blockSize, blockSize);
			rect(325, 100, blockSize, blockSize);
			rect(325, 125, blockSize, blockSize);
			rect(325, 150, blockSize, blockSize);
			rect(325, 175, blockSize, blockSize);
			rect(300, 150, blockSize, blockSize);
			rect(300, 125, blockSize, blockSize);
			rect(300, 100, blockSize, blockSize);
			rect(300, 75, blockSize, blockSize);
			rect(275, 75, blockSize, blockSize);
			rect(275, 100, blockSize, blockSize);
			rect(275, 125, blockSize, blockSize);
			rect(275, 150, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(250, 100, blockSize, blockSize);
			rect(250, 75, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			popMatrix();
		};
		this.drawBottomLeft = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			scale(s);
			fillColor.sand();
			fillColor.rock();
			rect(0, 0, blockSize, blockSize);
			rect(25, 0, blockSize, blockSize);
			rect(50, 0, blockSize, blockSize);
			rect(75, 0, blockSize, blockSize);
			rect(0, 25, blockSize, blockSize);
			rect(25, 25, blockSize, blockSize);
			rect(50, 25, blockSize, blockSize);
			rect(75, 25, blockSize, blockSize);
			rect(0, 50, blockSize, blockSize);
			rect(25, 50, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(0, 75, blockSize, blockSize);
			rect(25, 75, blockSize, blockSize);
			rect(50, 75, blockSize, blockSize);
			rect(0, 100, blockSize, blockSize);
			rect(25, 100, blockSize, blockSize);
			rect(50, 100, blockSize, blockSize);
			rect(0, 125, blockSize, blockSize);
			rect(25, 125, blockSize, blockSize);
			rect(50, 125, blockSize, blockSize);
			rect(25, 150, blockSize, blockSize);
			rect(125, 0, blockSize, blockSize);
			rect(125, 25, blockSize, blockSize);
			rect(125, 50, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(125, 200, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(225, 25, blockSize, blockSize);
			rect(200, 25, blockSize, blockSize);
			rect(175, 25, blockSize, blockSize);
			rect(175, 0, blockSize, blockSize);
			rect(150, 0, blockSize, blockSize);
			rect(150, 25, blockSize, blockSize);
			rect(225, 50, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(300, 0, blockSize, blockSize);
			rect(300, 25, blockSize, blockSize);
			rect(300, 50, blockSize, blockSize);
			rect(300, 75, blockSize, blockSize);
			rect(300, 100, blockSize, blockSize);
			rect(300, 125, blockSize, blockSize);
			rect(325, 125, blockSize, blockSize);
			rect(325, 150, blockSize, blockSize);
			rect(350, 150, blockSize, blockSize);
			rect(350, 175, blockSize, blockSize);
			rect(325, 0, blockSize, blockSize);
			rect(325, 25, blockSize, blockSize);
			rect(350, 25, blockSize, blockSize);
			rect(350, 50, blockSize, blockSize);
			rect(375, 75, blockSize, blockSize);
			rect(350, 75, blockSize, blockSize);
			rect(325, 75, blockSize, blockSize);
			rect(325, 50, blockSize, blockSize);
			rect(325, 100, blockSize, blockSize);
			rect(350, 100, blockSize, blockSize);
			rect(375, 100, blockSize, blockSize);
			rect(350, 125, blockSize, blockSize);
			rect(375, 125, blockSize, blockSize);
			rect(375, 150, blockSize, blockSize);
			rect(375, 175, blockSize, blockSize);
			rect(375, 200, blockSize, blockSize);
			rect(350, 200, blockSize, blockSize);
			rect(350, 225, blockSize, blockSize);
			rect(375, 225, blockSize, blockSize);
			rect(350, 250, blockSize, blockSize);
			rect(375, 250, blockSize, blockSize);
			rect(350, 275, blockSize, blockSize);
			rect(375, 275, blockSize, blockSize);
			rect(350, 300, blockSize, blockSize);
			rect(375, 300, blockSize, blockSize);
			rect(350, 325, blockSize, blockSize);
			rect(375, 325, blockSize, blockSize);
			rect(350, 350, blockSize, blockSize);
			rect(375, 350, blockSize, blockSize);
			fillColor.black();
			rect(0, 150, blockSize, blockSize);
			rect(25, 175, blockSize, blockSize);
			rect(50, 175, blockSize, blockSize);
			rect(50, 150, blockSize, blockSize);
			rect(75, 150, blockSize, blockSize);
			rect(75, 175, blockSize, blockSize);
			rect(75, 125, blockSize, blockSize);
			rect(75, 100, blockSize, blockSize);
			rect(75, 75, blockSize, blockSize);
			rect(75, 50, blockSize, blockSize);
			rect(75, 200, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(100, 225, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(125, 250, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(200, 275, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(250, 275, blockSize, blockSize);
			rect(275, 275, blockSize, blockSize);
			rect(300, 275, blockSize, blockSize);
			rect(300, 300, blockSize, blockSize);
			rect(325, 325, blockSize, blockSize);
			rect(325, 350, blockSize, blockSize);
			rect(350, 375, blockSize, blockSize);
			rect(375, 375, blockSize, blockSize);
			rect(300, 250, blockSize, blockSize);
			rect(300, 225, blockSize, blockSize);
			rect(300, 200, blockSize, blockSize);
			rect(300, 175, blockSize, blockSize);
			rect(275, 150, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(250, 100, blockSize, blockSize);
			rect(250, 75, blockSize, blockSize);
			rect(250, 50, blockSize, blockSize);
			rect(250, 25, blockSize, blockSize);
			rect(250, 0, blockSize, blockSize);
			rect(225, 0, blockSize, blockSize);
			rect(200, 0, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(250, 200, blockSize, blockSize);
			rect(250, 225, blockSize, blockSize);
			rect(275, 225, blockSize, blockSize);
			rect(275, 250, blockSize, blockSize);
			rect(250, 250, blockSize, blockSize);
			rect(350, 0, blockSize, blockSize);
			rect(375, 0, blockSize, blockSize);
			rect(375, 25, blockSize, blockSize);
			rect(375, 50, blockSize, blockSize);
			fillColor.sand();
			rect(100, 0, blockSize, blockSize);
			rect(100, 25, blockSize, blockSize);
			rect(100, 50, blockSize, blockSize);
			rect(100, 75, blockSize, blockSize);
			rect(100, 100, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(0, 175, blockSize, blockSize);
			rect(0, 200, blockSize, blockSize);
			rect(25, 200, blockSize, blockSize);
			rect(50, 200, blockSize, blockSize);
			rect(0, 225, blockSize, blockSize);
			rect(25, 225, blockSize, blockSize);
			rect(50, 225, blockSize, blockSize);
			rect(75, 225, blockSize, blockSize);
			rect(0, 250, blockSize, blockSize);
			rect(25, 250, blockSize, blockSize);
			rect(50, 250, blockSize, blockSize);
			rect(75, 250, blockSize, blockSize);
			rect(100, 250, blockSize, blockSize);
			rect(0, 275, blockSize, blockSize);
			rect(25, 275, blockSize, blockSize);
			rect(50, 275, blockSize, blockSize);
			rect(75, 275, blockSize, blockSize);
			rect(100, 275, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(0, 300, blockSize, blockSize);
			rect(25, 300, blockSize, blockSize);
			rect(50, 300, blockSize, blockSize);
			rect(75, 300, blockSize, blockSize);
			rect(100, 300, blockSize, blockSize);
			rect(125, 300, blockSize, blockSize);
			rect(150, 300, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(225, 300, blockSize, blockSize);
			rect(250, 300, blockSize, blockSize);
			rect(275, 300, blockSize, blockSize);
			rect(0, 325, blockSize, blockSize);
			rect(25, 325, blockSize, blockSize);
			rect(50, 325, blockSize, blockSize);
			rect(75, 325, blockSize, blockSize);
			rect(100, 325, blockSize, blockSize);
			rect(125, 325, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(225, 325, blockSize, blockSize);
			rect(200, 325, blockSize, blockSize);
			rect(250, 325, blockSize, blockSize);
			rect(275, 325, blockSize, blockSize);
			rect(300, 325, blockSize, blockSize);
			rect(300, 350, blockSize, blockSize);
			rect(325, 375, blockSize, blockSize);
			rect(300, 375, blockSize, blockSize);
			rect(275, 375, blockSize, blockSize);
			rect(275, 350, blockSize, blockSize);
			rect(250, 350, blockSize, blockSize);
			rect(250, 375, blockSize, blockSize);
			rect(225, 375, blockSize, blockSize);
			rect(225, 350, blockSize, blockSize);
			rect(200, 350, blockSize, blockSize);
			rect(200, 375, blockSize, blockSize);
			rect(175, 375, blockSize, blockSize);
			rect(175, 350, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(150, 375, blockSize, blockSize);
			rect(125, 375, blockSize, blockSize);
			rect(125, 350, blockSize, blockSize);
			rect(100, 350, blockSize, blockSize);
			rect(100, 375, blockSize, blockSize);
			rect(75, 350, blockSize, blockSize);
			rect(75, 375, blockSize, blockSize);
			rect(50, 375, blockSize, blockSize);
			rect(50, 350, blockSize, blockSize);
			rect(25, 350, blockSize, blockSize);
			rect(25, 375, blockSize, blockSize);
			rect(0, 375, blockSize, blockSize);
			rect(0, 350, blockSize, blockSize);
			rect(325, 300, blockSize, blockSize);
			rect(325, 275, blockSize, blockSize);
			rect(325, 250, blockSize, blockSize);
			rect(325, 225, blockSize, blockSize);
			rect(325, 200, blockSize, blockSize);
			rect(325, 175, blockSize, blockSize);
			rect(300, 150, blockSize, blockSize);
			rect(275, 125, blockSize, blockSize);
			rect(275, 100, blockSize, blockSize);
			rect(275, 75, blockSize, blockSize);
			rect(275, 50, blockSize, blockSize);
			rect(275, 25, blockSize, blockSize);
			rect(275, 0, blockSize, blockSize);
			popMatrix();
		};
		this.drawBottomMiddleFill = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			scale(s);
			fillColor.sand();
			rect(100, 0, blockSize, blockSize);
			rect(175, 0, blockSize, blockSize);
			rect(300, 0, blockSize, blockSize);
			rect(375, 25, blockSize, blockSize);
			rect(375, 150, blockSize, blockSize);
			rect(375, 175, blockSize, blockSize);
			rect(300, 150, blockSize, blockSize);
			rect(275, 150, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(250, 200, blockSize, blockSize);
			rect(250, 225, blockSize, blockSize);
			rect(250, 250, blockSize, blockSize);
			rect(250, 275, blockSize, blockSize);
			rect(250, 300, blockSize, blockSize);
			rect(250, 325, blockSize, blockSize);
			rect(275, 375, blockSize, blockSize);
			rect(300, 375, blockSize, blockSize);
			rect(375, 375, blockSize, blockSize);
			rect(375, 325, blockSize, blockSize);
			rect(375, 300, blockSize, blockSize);
			rect(375, 275, blockSize, blockSize);
			rect(150, 25, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(125, 200, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(125, 250, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(100, 275, blockSize, blockSize);
			rect(75, 275, blockSize, blockSize);
			rect(50, 300, blockSize, blockSize);
			rect(50, 325, blockSize, blockSize);
			rect(25, 350, blockSize, blockSize);
			rect(25, 375, blockSize, blockSize);
			rect(75, 375, blockSize, blockSize);
			rect(150, 375, blockSize, blockSize);
			rect(200, 375, blockSize, blockSize);
			rect(75, 325, blockSize, blockSize);
			fillColor.rock();
			rect(75, 325, blockSize, blockSize);
			rect(75, 300, blockSize, blockSize);
			fillColor.sand();
			rect(0, 275, blockSize, blockSize);
			rect(0, 250, blockSize, blockSize);
			rect(0, 75, blockSize, blockSize);
			rect(0, 100, blockSize, blockSize);
			fillColor.rock();
			rect(0, 0, blockSize, blockSize);
			rect(0, 25, blockSize, blockSize);
			rect(0, 50, blockSize, blockSize);
			rect(25, 0, blockSize, blockSize);
			rect(25, 25, blockSize, blockSize);
			rect(25, 50, blockSize, blockSize);
			rect(50, 0, blockSize, blockSize);
			rect(50, 25, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(75, 25, blockSize, blockSize);
			rect(75, 50, blockSize, blockSize);
			rect(75, 75, blockSize, blockSize);
			rect(75, 100, blockSize, blockSize);
			rect(75, 125, blockSize, blockSize);
			rect(75, 175, blockSize, blockSize);
			rect(75, 150, blockSize, blockSize);
			rect(50, 200, blockSize, blockSize);
			rect(50, 225, blockSize, blockSize);
			rect(25, 250, blockSize, blockSize);
			rect(25, 275, blockSize, blockSize);
			rect(0, 300, blockSize, blockSize);
			rect(0, 325, blockSize, blockSize);
			rect(0, 350, blockSize, blockSize);
			rect(0, 225, blockSize, blockSize);
			rect(0, 200, blockSize, blockSize);
			rect(0, 175, blockSize, blockSize);
			rect(0, 150, blockSize, blockSize);
			rect(0, 125, blockSize, blockSize);
			rect(25, 75, blockSize, blockSize);
			rect(25, 100, blockSize, blockSize);
			rect(25, 150, blockSize, blockSize);
			rect(25, 125, blockSize, blockSize);
			rect(25, 175, blockSize, blockSize);
			rect(25, 200, blockSize, blockSize);
			rect(25, 225, blockSize, blockSize);
			rect(50, 75, blockSize, blockSize);
			rect(50, 100, blockSize, blockSize);
			rect(50, 125, blockSize, blockSize);
			rect(50, 150, blockSize, blockSize);
			rect(50, 175, blockSize, blockSize);
			fillColor.black();
			rect(0, 375, blockSize, blockSize);
			rect(25, 325, blockSize, blockSize);
			rect(25, 300, blockSize, blockSize);
			rect(50, 275, blockSize, blockSize);
			rect(50, 250, blockSize, blockSize);
			rect(75, 250, blockSize, blockSize);
			rect(100, 250, blockSize, blockSize);
			rect(100, 225, blockSize, blockSize);
			rect(75, 225, blockSize, blockSize);
			rect(75, 200, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(100, 100, blockSize, blockSize);
			rect(100, 75, blockSize, blockSize);
			rect(100, 50, blockSize, blockSize);
			rect(100, 25, blockSize, blockSize);
			rect(75, 0, blockSize, blockSize);
			rect(125, 0, blockSize, blockSize);
			rect(150, 0, blockSize, blockSize);
			rect(125, 25, blockSize, blockSize);
			rect(125, 50, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(250, 0, blockSize, blockSize);
			rect(275, 0, blockSize, blockSize);
			rect(325, 0, blockSize, blockSize);
			rect(325, 25, blockSize, blockSize);
			rect(300, 25, blockSize, blockSize);
			rect(350, 25, blockSize, blockSize);
			rect(300, 50, blockSize, blockSize);
			rect(325, 50, blockSize, blockSize);
			rect(325, 75, blockSize, blockSize);
			rect(325, 100, blockSize, blockSize);
			rect(375, 50, blockSize, blockSize);
			rect(375, 75, blockSize, blockSize);
			rect(375, 100, blockSize, blockSize);
			rect(375, 125, blockSize, blockSize);
			rect(350, 150, blockSize, blockSize);
			rect(350, 175, blockSize, blockSize);
			rect(325, 150, blockSize, blockSize);
			rect(375, 200, blockSize, blockSize);
			rect(375, 225, blockSize, blockSize);
			rect(375, 250, blockSize, blockSize);
			rect(350, 250, blockSize, blockSize);
			rect(350, 275, blockSize, blockSize);
			rect(350, 300, blockSize, blockSize);
			rect(350, 325, blockSize, blockSize);
			rect(350, 350, blockSize, blockSize);
			rect(350, 375, blockSize, blockSize);
			rect(375, 350, blockSize, blockSize);
			rect(325, 350, blockSize, blockSize);
			rect(325, 375, blockSize, blockSize);
			rect(250, 375, blockSize, blockSize);
			rect(250, 350, blockSize, blockSize);
			rect(225, 350, blockSize, blockSize);
			rect(225, 375, blockSize, blockSize);
			rect(200, 350, blockSize, blockSize);
			rect(175, 375, blockSize, blockSize);
			rect(200, 325, blockSize, blockSize);
			rect(225, 325, blockSize, blockSize);
			rect(225, 300, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			fillColor.rock();
			rect(200, 0, blockSize, blockSize);
			rect(225, 0, blockSize, blockSize);
			rect(350, 0, blockSize, blockSize);
			rect(375, 0, blockSize, blockSize);
			rect(175, 25, blockSize, blockSize);
			rect(200, 25, blockSize, blockSize);
			rect(225, 25, blockSize, blockSize);
			rect(250, 25, blockSize, blockSize);
			rect(275, 25, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(225, 50, blockSize, blockSize);
			rect(250, 50, blockSize, blockSize);
			rect(275, 50, blockSize, blockSize);
			rect(350, 50, blockSize, blockSize);
			rect(350, 75, blockSize, blockSize);
			rect(350, 100, blockSize, blockSize);
			rect(350, 125, blockSize, blockSize);
			rect(325, 125, blockSize, blockSize);
			rect(300, 125, blockSize, blockSize);
			rect(300, 100, blockSize, blockSize);
			rect(300, 75, blockSize, blockSize);
			rect(275, 125, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(200, 275, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(150, 300, blockSize, blockSize);
			rect(125, 300, blockSize, blockSize);
			rect(100, 300, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(125, 325, blockSize, blockSize);
			rect(100, 325, blockSize, blockSize);
			rect(175, 350, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(125, 350, blockSize, blockSize);
			rect(125, 375, blockSize, blockSize);
			rect(100, 375, blockSize, blockSize);
			rect(100, 350, blockSize, blockSize);
			rect(75, 350, blockSize, blockSize);
			rect(50, 350, blockSize, blockSize);
			rect(50, 375, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(250, 100, blockSize, blockSize);
			rect(275, 100, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(250, 75, blockSize, blockSize);
			rect(275, 75, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(300, 175, blockSize, blockSize);
			rect(325, 175, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(300, 200, blockSize, blockSize);
			rect(325, 200, blockSize, blockSize);
			rect(350, 200, blockSize, blockSize);
			rect(275, 225, blockSize, blockSize);
			rect(300, 225, blockSize, blockSize);
			rect(325, 225, blockSize, blockSize);
			rect(350, 225, blockSize, blockSize);
			rect(275, 250, blockSize, blockSize);
			rect(300, 250, blockSize, blockSize);
			rect(325, 250, blockSize, blockSize);
			rect(275, 275, blockSize, blockSize);
			rect(300, 275, blockSize, blockSize);
			rect(325, 275, blockSize, blockSize);
			rect(275, 300, blockSize, blockSize);
			rect(300, 300, blockSize, blockSize);
			rect(325, 300, blockSize, blockSize);
			rect(275, 325, blockSize, blockSize);
			rect(300, 325, blockSize, blockSize);
			rect(325, 325, blockSize, blockSize);
			rect(275, 350, blockSize, blockSize);
			rect(300, 350, blockSize, blockSize);
			popMatrix();
		};
		this.drawBottomRight = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			scale(s);
			fillColor.sand();
			rect(25, 375, blockSize, blockSize);
			rect(25, 325, blockSize, blockSize);
			rect(25, 300, blockSize, blockSize);
			rect(25, 275, blockSize, blockSize);
			rect(25, 250, blockSize, blockSize);
			rect(0, 225, blockSize, blockSize);
			rect(0, 200, blockSize, blockSize);
			rect(0, 175, blockSize, blockSize);
			rect(0, 175, blockSize, blockSize);
			rect(0, 150, blockSize, blockSize);
			rect(0, 125, blockSize, blockSize);
			rect(0, 100, blockSize, blockSize);
			rect(0, 75, blockSize, blockSize);
			rect(0, 50, blockSize, blockSize);
			rect(0, 25, blockSize, blockSize);
			rect(0, 0, blockSize, blockSize);
			rect(0, 375, blockSize, blockSize);
			rect(50, 350, blockSize, blockSize);
			rect(75, 350, blockSize, blockSize);
			rect(100, 350, blockSize, blockSize);
			rect(125, 350, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(175, 350, blockSize, blockSize);
			rect(200, 350, blockSize, blockSize);
			rect(225, 350, blockSize, blockSize);
			rect(250, 350, blockSize, blockSize);
			rect(275, 350, blockSize, blockSize);
			rect(300, 350, blockSize, blockSize);
			rect(325, 350, blockSize, blockSize);
			rect(350, 350, blockSize, blockSize);
			rect(350, 350, blockSize, blockSize);
			rect(375, 350, blockSize, blockSize);
			rect(50, 375, blockSize, blockSize);
			rect(75, 375, blockSize, blockSize);
			rect(100, 375, blockSize, blockSize);
			rect(125, 375, blockSize, blockSize);
			rect(150, 375, blockSize, blockSize);
			rect(175, 375, blockSize, blockSize);
			rect(200, 375, blockSize, blockSize);
			rect(225, 375, blockSize, blockSize);
			rect(250, 375, blockSize, blockSize);
			rect(275, 375, blockSize, blockSize);
			rect(300, 375, blockSize, blockSize);
			rect(325, 375, blockSize, blockSize);
			rect(350, 375, blockSize, blockSize);
			rect(375, 375, blockSize, blockSize);
			rect(25, 75, blockSize, blockSize);
			rect(250, 0, blockSize, blockSize);
			rect(250, 25, blockSize, blockSize);
			rect(250, 50, blockSize, blockSize);
			rect(250, 75, blockSize, blockSize);
			rect(250, 100, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(375, 75, blockSize, blockSize);
			rect(375, 100, blockSize, blockSize);
			rect(375, 125, blockSize, blockSize);
			rect(375, 150, blockSize, blockSize);
			rect(375, 175, blockSize, blockSize);
			rect(375, 200, blockSize, blockSize);
			rect(375, 225, blockSize, blockSize);
			rect(375, 250, blockSize, blockSize);
			rect(375, 275, blockSize, blockSize);
			rect(375, 300, blockSize, blockSize);
			rect(375, 325, blockSize, blockSize);
			rect(350, 125, blockSize, blockSize);
			rect(350, 150, blockSize, blockSize);
			rect(350, 175, blockSize, blockSize);
			rect(350, 200, blockSize, blockSize);
			rect(350, 225, blockSize, blockSize);
			rect(350, 250, blockSize, blockSize);
			rect(350, 275, blockSize, blockSize);
			rect(350, 300, blockSize, blockSize);
			rect(350, 325, blockSize, blockSize);
			fillColor.black();
			rect(0, 350, blockSize, blockSize);
			rect(0, 325, blockSize, blockSize);
			rect(0, 300, blockSize, blockSize);
			rect(0, 300, blockSize, blockSize);
			rect(0, 275, blockSize, blockSize);
			rect(0, 250, blockSize, blockSize);
			rect(25, 350, blockSize, blockSize);
			rect(75, 325, blockSize, blockSize);
			rect(100, 325, blockSize, blockSize);
			rect(125, 325, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(150, 300, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(200, 275, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(275, 150, blockSize, blockSize);
			rect(300, 125, blockSize, blockSize);
			rect(325, 125, blockSize, blockSize);
			rect(350, 100, blockSize, blockSize);
			rect(350, 75, blockSize, blockSize);
			rect(350, 50, blockSize, blockSize);
			rect(350, 25, blockSize, blockSize);
			rect(350, 0, blockSize, blockSize);
			rect(375, 0, blockSize, blockSize);
			rect(375, 25, blockSize, blockSize);
			rect(375, 50, blockSize, blockSize);
			rect(325, 0, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(225, 50, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(200, 25, blockSize, blockSize);
			rect(225, 25, blockSize, blockSize);
			rect(225, 0, blockSize, blockSize);
			rect(200, 0, blockSize, blockSize);
			rect(175, 0, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(75, 50, blockSize, blockSize);
			rect(100, 75, blockSize, blockSize);
			rect(100, 100, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(100, 225, blockSize, blockSize);
			rect(100, 250, blockSize, blockSize);
			rect(100, 275, blockSize, blockSize);
			rect(100, 300, blockSize, blockSize);
			fillColor.rock();
			rect(50, 325, blockSize, blockSize);
			rect(50, 300, blockSize, blockSize);
			rect(75, 300, blockSize, blockSize);
			rect(75, 275, blockSize, blockSize);
			rect(75, 250, blockSize, blockSize);
			rect(75, 225, blockSize, blockSize);
			rect(75, 200, blockSize, blockSize);
			rect(75, 175, blockSize, blockSize);
			rect(75, 150, blockSize, blockSize);
			rect(75, 125, blockSize, blockSize);
			rect(75, 100, blockSize, blockSize);
			rect(75, 75, blockSize, blockSize);
			rect(50, 75, blockSize, blockSize);
			rect(25, 100, blockSize, blockSize);
			rect(25, 125, blockSize, blockSize);
			rect(25, 150, blockSize, blockSize);
			rect(25, 175, blockSize, blockSize);
			rect(25, 200, blockSize, blockSize);
			rect(25, 225, blockSize, blockSize);
			rect(50, 100, blockSize, blockSize);
			rect(50, 125, blockSize, blockSize);
			rect(50, 150, blockSize, blockSize);
			rect(50, 175, blockSize, blockSize);
			rect(50, 200, blockSize, blockSize);
			rect(50, 225, blockSize, blockSize);
			rect(50, 250, blockSize, blockSize);
			rect(50, 275, blockSize, blockSize);
			rect(25, 50, blockSize, blockSize);
			rect(25, 25, blockSize, blockSize);
			rect(25, 0, blockSize, blockSize);
			rect(50, 0, blockSize, blockSize);
			rect(50, 25, blockSize, blockSize);
			rect(75, 25, blockSize, blockSize);
			rect(75, 0, blockSize, blockSize);
			rect(100, 0, blockSize, blockSize);
			rect(100, 25, blockSize, blockSize);
			rect(100, 50, blockSize, blockSize);
			rect(125, 0, blockSize, blockSize);
			rect(125, 25, blockSize, blockSize);
			rect(125, 50, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(125, 200, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(125, 250, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(125, 300, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(150, 25, blockSize, blockSize);
			rect(150, 0, blockSize, blockSize);
			rect(175, 25, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(275, 0, blockSize, blockSize);
			rect(275, 25, blockSize, blockSize);
			rect(275, 50, blockSize, blockSize);
			rect(275, 75, blockSize, blockSize);
			rect(275, 100, blockSize, blockSize);
			rect(275, 125, blockSize, blockSize);
			rect(300, 0, blockSize, blockSize);
			rect(300, 25, blockSize, blockSize);
			rect(300, 50, blockSize, blockSize);
			rect(300, 75, blockSize, blockSize);
			rect(300, 100, blockSize, blockSize);
			rect(325, 100, blockSize, blockSize);
			rect(325, 75, blockSize, blockSize);
			rect(325, 50, blockSize, blockSize);
			rect(325, 25, blockSize, blockSize);
			fillColor.sand();
			rect(325, 325, blockSize, blockSize);
			rect(300, 325, blockSize, blockSize);
			rect(275, 325, blockSize, blockSize);
			rect(250, 325, blockSize, blockSize);
			rect(225, 325, blockSize, blockSize);
			rect(200, 325, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(225, 300, blockSize, blockSize);
			rect(250, 300, blockSize, blockSize);
			rect(275, 300, blockSize, blockSize);
			rect(300, 300, blockSize, blockSize);
			rect(325, 300, blockSize, blockSize);
			rect(325, 275, blockSize, blockSize);
			rect(300, 275, blockSize, blockSize);
			rect(275, 275, blockSize, blockSize);
			rect(250, 275, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(250, 250, blockSize, blockSize);
			rect(275, 250, blockSize, blockSize);
			rect(300, 250, blockSize, blockSize);
			rect(325, 250, blockSize, blockSize);
			rect(325, 225, blockSize, blockSize);
			rect(300, 225, blockSize, blockSize);
			rect(275, 225, blockSize, blockSize);
			rect(250, 225, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(250, 200, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(300, 200, blockSize, blockSize);
			rect(325, 200, blockSize, blockSize);
			rect(325, 175, blockSize, blockSize);
			rect(300, 175, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(300, 150, blockSize, blockSize);
			rect(325, 150, blockSize, blockSize);
			popMatrix();
		};
		this.draw = function() {
			switch (type) {
				case 0:
					this.drawTopLeft();
					break;
				case 1:
					this.drawTopMiddle();
					break;
				case 2:
					this.drawTopRight();
					break;
				case 3:
					this.drawBottomLeft();
					break;
				case 4:
					this.drawBottomMiddleFill();
					break;
				case 5:
					this.drawBottomRight();
					break;
				case 6:
					this.drawDirt();
					break;
				default:
					this.drawSand();
					break;
			}
		};
	};

	var mapObj = function() {
		this.x = 3;
		this.y = 3;
		this.map = [];
		this.enemies = 0;
		this.killed = 0;
		this.currentMap = function() {
			if (this.x === 0 && this.y === 0) {
				this.enemies = 0;
				this.map = [
					"4444444444",
					"4444444444",
					"4444444444",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4    01111"
				];
			} else if (this.x === 0 && this.y === 1) {
				this.enemies = 3;
				this.map = [
					"4    04444",
					"4    44444",
					"4    34444",
					"4        4",
					"4        4",
					"4        4",
					"4    d   4",
					"4        4",
					"4        4",
					"4  0112  4"
				];
			} else if (this.x === 0 && this.y === 2) {
				this.enemies = 2;
				this.map = [
					"4  4444  3",
					"4  4444  3",
					"4  3445  3",
					"4         ",
					"4         ",
					"4 012     ",
					"4         ",
					"4       01",
					"4         ",
					"4         "
				];
			} else if (this.x === 0 && this.y === 3) {
				this.enemies = 1;
				this.map = [
					"4         ",
					"4         ",
					"4         ",
					"4     dd  ",
					"4         ",
					"4         ",
					"4         ",
					"4         ",
					"4         ",
					"4    01111"
				];
			} else if (this.x === 0 && this.y === 4) {
				this.enemies = 0;
				this.map = [
					"4    44444",
					"4    44444",
					"4    34444",
					"4         ",
					"4         ",
					"4         ",
					"4  d      ",
					"4         ",
					"4         ",
					"4        0"
				];
			} else if (this.x === 0 && this.y === 5) {
				this.enemies = 0;
				this.map = [
					"4        4",
					"4        4",
					"4        3",
					"4         ",
					"4         ",
					"4         ",
					"4    01111",
					"4    44444",
					"4    44444",
					"4111144444"
				];
			} else if (this.x === 1 && this.y === 0) {
				this.enemies = 1;
				this.map = [
					"4444444444",
					"4444444444",
					"4444444444",
					"4        d",
					"4  d  d  d ",
					"4  d dd dd",
					"4   d  ddd",
					"4       dd",
					"4  d ddddd",
					"1112 d0111"
				];
			} else if (this.x === 1 && this.y === 1) {
				this.enemies = 0;
				this.map = [
					"4444  4444",
					"4444  4444",
					"4445  3444",
					"4        4",
					"4        3",
					"4         ",
					"4        0",
					"4        4",
					"42      04",
					"4412  0144"
				];
			} else if (this.x === 1 && this.y === 2) {
				this.enemies = 0;
				this.map = [
					"4444  4444",
					"4444  4444",
					"4444  3444",
					"   4     3",
					"   4      ",
					"   4      ",
					"   4   044",
					"1114   444",
					"       444",
					"       444"
				];
			} else if (this.x === 1 && this.y === 3) {
				this.enemies = 0;
				this.map = [
					"       444",
					"       444",
					"       444",
					"       344",
					"        44",
					"        34",
					"  0112    ",
					"  3445    ",
					"          ",
					"2        0",
				];
			} else if (this.x === 1 && this.y === 4) {
				this.enemies = 0;
				this.map = [
					"4        4",
					"4        4",
					"5        4",
					"         4",
					"         3",
					"          ",
					"         0",
					"         4",
					"         4",
					"2        4",
				];
			} else if (this.x === 1 && this.y === 5) {
				this.enemies = 0;
				this.map = [
					"4        4",
					"4        4",
					"5        3",
					"          ",
					"          ",
					"          ",
					"111112    ",
					"4444444444",
					"4444444444",
					"4444444444"
				];
			} else if (this.x === 2 && this.y === 0) {
				this.enemies = 5;
				this.map = [
					"4444444444",
					"4444444444",
					"4444444444",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"1111111111"
				];
			} else if (this.x === 2 && this.y === 1) {
				this.enemies = 2;
				this.map = [
					"4444444444",
					"4444444444",
					"4444444444",
					"4        4",
					"5        4",
					"         4",
					"2        4",
					"4        4",
					"4        4",
					"4112     4"
				];
			} else if (this.x === 2 && this.y === 2) {
				this.enemies = 0;
				this.map = [
					"4444     4",
					"4444     4",
					"4444     4",
					"4445   014",
					"       444",
					"       444",
					"42     344",
					"44       4",
					"4442     4",
					"4444     4"
				];
			} else if (this.x === 2 && this.y === 3) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4444     4",
					"4444     4",
					"4444     4",
					"4445     4",
					"45       4",
					"         3",
					"          ",
					"         0",
					"4442  0444"
				];
			} else if (this.x === 2 && this.y === 4) {
				this.enemies = 2;
				this.map = [
					"          ",
					"4444  4444",
					"4445  3444",
					"4        4",
					"5        3",
					"          ",
					"2        0",
					"4        4",
					"4        4",
					"4112  0114"
				];
			} else if (this.x === 2 && this.y === 5) {
				this.enemies = 0;
				this.map = [
					"4444  4444",
					"4444  4444",
					"4445  3444",
					"        44",
					"        44",
					"        44",
					"        44",
					"1111111144",
					"4444444444",
					"4444444444"
				];
			} else if (this.x === 3 && this.y === 0) {
				this.enemies = 5;
				this.map = [
					"4444444444",
					"4444444444",
					"4444444444",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"1111111111"
				];
			} else if (this.x === 3 && this.y === 1) {
				this.enemies = 0;
				this.map = [
					"4444444444",
					"4444444444",
					"4444444444",
					"45       4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4111112  4"
				];
			} else if (this.x === 3 && this.y === 2) {
				this.enemies = 2;
				this.map = [
					"4444444  4",
					"4444444  4",
					"4444445  4",
					"4        4",
					"4  0111114",
					"4        4",
					"4        4",
					"4        3",
					"4         ",
					"4111112  0"
				];
			} else if (this.x === 3 && this.y === 3) {
				this.enemies = 0;
				this.map = [
					"4444444  4",
					"4444444  4",
					"4444445  4",
					"444445   4",
					"44445    3",
					"45        ",
					"5         ",
					"         0",
					"2        4",
					"4111111114"
				];
			} else if (this.x === 3 && this.y === 4) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4444444444",
					"4444444444",
					"4  4   444",
					"5       44",
					"        44",
					"1111111144",
					"4444444444",
					"4444444444",
					"4444444444"
				];
			} else if (this.x === 3 && this.y === 5) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4444444444",
					"4444444444",
					"4         ",
					"4         ",
					"4         ",
					"4         ",
					"4         ",
					"4         ",
					"4444444444"
				];
			} else if (this.x === 4 && this.y === 0) {
				this.enemies = 5;
				this.map = [
					"4444444444",
					"4444444444",
					"4444444444",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"dddddddddd",
					"1111111111"
				];
			} else if (this.x === 4 && this.y === 1) {
				this.enemies = 3;
				this.map = [
					"          ",
					"4444444444",
					"4444444444",
					"4        4",
					"4        4",
					"4  02    4",
					"4  44    4",
					"4  44    4",
					"4  442   4",
					"4  4441114"
				];
			} else if (this.x === 4 && this.y === 2) {
				this.enemies = 4;
				this.map = [
					"          ",
					"4  4444444",
					"4  3444444",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"5        4",
					"         4",
					"2  0111114"
				];
			} else if (this.x === 4 && this.y === 3) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4  4444444",
					"4  3444444",
					"4        4",
					"411111   4",
					"     4   4",
					"     4   4",
					"1    4   4",
					"4    42  4",
					"41111442 4"
				];
			} else if (this.x === 4 && this.y === 4) {
				this.enemies = 5;
				this.map = [
					"          ",
					"44444444 4",
					"44444445 4",
					"4        4",
					"4        3",
					"4         ",
					"4         ",
					"4112     0",
					"4444     4",
					"4444111114"
				];
			} else if (this.x === 4 && this.y === 5) {
				this.enemies = 7;
				this.map = [
					"          ",
					"4444444444",
					"4444444444",
					"          ",
					"          ",
					"          ",
					"          ",
					"          ",
					"          ",
					"1111111111"
				];
			} else if (this.x === 5 && this.y === 0) {
				this.enemies = 1;
				this.map = [
					"          ",
					"4444444444",
					"4444444444",
					"d    dddd4",
					"d   dd02d4",
					"d  d d35d4",
					"d  d dddd4",
					"dd       4",
					"d  dddd  4",
					"2  d02d  4"
				];
			} else if (this.x === 5 && this.y === 1) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4  d35d  4",
					"4  d dd  4",
					"4   d    4",
					"4        4",
					"4        4",
					"4        4",
					"4  d     4",
					"4   012  4",
					"4  0444  4"
				];
			} else if (this.x === 5 && this.y === 2) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4  4444  4",
					"4  3445  4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"411112   4"
				];
			} else if (this.x === 5 && this.y === 3) {
				this.enemies = 3;
				this.map = [
					"          ",
					"444444   4",
					"444445   4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        3",
					"4         ",
					"4111111111"
				];
			} else if (this.x === 5 && this.y === 4) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4444444444",
					"4444444444",
					"4       44",
					"5       44",
					"        44",
					"        44",
					"112     44",
					"444     44",
					"4441111144"
				];
			} else if (this.x === 5 && this.y === 5) {
				this.enemies = 6;
				this.map = [
					"          ",
					"4444444444",
					"4444444444",
					"          ",
					"          ",
					"          ",
					"          ",
					"          ",
					"          ",
					"1111111111"
				];
			} else if (this.x === 6 && this.y === 0) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4444444444",
					"4444444444",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4"
				];
			} else if (this.x === 6 && this.y === 1) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4       04",
					"4       44"
				];
			} else if (this.x === 6 && this.y === 2) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4       44",
					"4       34",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4112  0114"
				];
			} else if (this.x === 6 && this.y === 3) {
				this.enemies = 2;
				this.map = [
					"          ",
					"4444  4444",
					"4445  3444",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"5        4",
					"         4",
					"2        4"
				];
			} else if (this.x === 6 && this.y === 4) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4",
					"4        4"
				];
			} else if (this.x === 6 && this.y === 5) {
				this.enemies = 0;
				this.map = [
					"          ",
					"4        4",
					"5        4",
					"         4",
					"         4",
					"         4",
					"         4",
					"         4",
					"         4",
					"1111111114"
				];
			}
		};
		this.initTilemaps = function() {
			this.currentMap();
			rocks = [];
			for (var i = 0; i < this.map.length; i++) {
				for (var j = 0; j < this.map[i].length; j++) {
					switch (this.map[i][j]) {
						case '0':
							rocks.push(new rockFormationObj(40 * j, 40 * i, 1 / 10, 0));
							break;
						case '1':
							rocks.push(new rockFormationObj(40 * j, 40 * i, 1 / 10, 1));
							break;
						case '2':
							rocks.push(new rockFormationObj(40 * j, 40 * i, 1 / 10, 2));
							break;
						case '3':
							rocks.push(new rockFormationObj(40 * j, 40 * i, 1 / 10, 3));
							break;
						case '4':
							rocks.push(new rockFormationObj(40 * j, 40 * i, 1 / 10, 4));
							break;
						case '5':
							rocks.push(new rockFormationObj(40 * j, 40 * i, 1 / 10, 5));
							break;
						case 'd':
							sand.push(new rockFormationObj(40 * j, 40 * i, 1 / 10, 6));
							break;
						case ' ':
							//rocks.push(new rockFormationObj(40 * j, 40 * i, 1 / 10, 7));
							break;
						case 'r':
							rupees.push(new rupeeObj(j * 20, i * 20, 1.5));
							break;
					}
				}
			}
			if (spiders.length < this.enemies - this.killed) {
				for (var i = 0; i < this.enemies; i++) {
					spiders.push(new spiderObj(random(40, width - floor(40)), 200, 0.092));
				}
			}
		};
	};
	var miniMap = new mapObj();
	var textBox = function(x, y, width) {
		stroke(0);
		strokeWeight(1);
		textFont(createFont("serif"), 15);
		fill(255, 255, 255);
		rect(x, y, width, 22);

		fill(0, 0, 0);
		text(name.substring(name.length - width / 5.5, name.length), x + 5, y + 16);
		cursorTime -= 1;
		if (cursorVisible) {
			line(x + 5 + name.length * textsize, y + 2, x + 5 + name.length * textsize, y + 20);
			if (cursorTime < 0) {
				cursorVisible = false;
				cursorTime = 20;
			}
		} else {
			if (cursorTime < 0) {
				cursorVisible = true;
				cursorTime = 20;
			}
		}
	};
	var drawTitle = function(position) {
		var draw_TheLegendOf_ = function(pos) {
			textFont(serif, 24);
			fillColor.red();
			text("THE LEGEND OF", position.x + -13, position.y + -179);
		};
		var draw_jokeText_ = function(pos) {
			textFont(serif, 16);
			fillColor.red();
			text("A LINK BETWEEN TIME", position.x + -51, position.y + -57);
		};
		var drawZ = function(Zpos) {
			noStroke();
			pushMatrix();
			translate(Zpos.x, Zpos.y);
			var drawFirstTip = function() {
				fillColor.red();
				pushMatrix();
				translate(position.x + -142, position.y + -141);
				rotate(Math.PI / 4);
				triangle(0, 0, 0 + 10, 0 - 35, 0 - 10, 0 - 35);
				popMatrix();
			};
			var drawTop = function() {
				fillColor.red();
				pushMatrix();
				translate(position.x + -124, position.y + -174);
				rect(0, 0, 100, 15);
				popMatrix();
			};
			var drawMiddle = function() {
				fillColor.red();
				pushMatrix();
				noStroke();
				translate(position.x + -123, position.y + -59);
				rotate(-56 * (Math.PI / 180));
				rect(-27, 0, 166, 20);
				fillColor.backgroundColor();
				rect(127, 20, 33, 17);
				popMatrix();

				fillColor.darkRed();
				noStroke();
				pushMatrix();
				translate(position.x + -83, position.y + -108);
				rotate(-11 * (Math.PI / 180));
				rect(0, 0, 5, 5);
				popMatrix();

				pushMatrix();
				translate(position.x + -44, position.y + -158);
				rotate(33 * (Math.PI / 180));
				triangle(0, 0, 2.5, 45, -2.5, 45);
				popMatrix();

				pushMatrix();
				translate(position.x + -114, position.y + -53);
				rotate(213 * (Math.PI / 180));
				triangle(0, 0, 2.5, 45, -2.5, 45);
				popMatrix();
			};
			var drawBottom = function() {
				fillColor.red();
				noStroke();
				pushMatrix();
				translate(position.x + -121, position.y + -53);
				rect(-18, 0, 100, 15);
				fillColor.backgroundColor();
				rect(-23, 15, 33, 17);
				popMatrix();

				pushMatrix();
				translate(position.x + -123, position.y + -59);
				rotate(-56 * (Math.PI / 180));
				fillColor.backgroundColor();
				rect(-36, -17, 33, 17);
				popMatrix();

				fillColor.red();
				pushMatrix();
				translate(position.x + -20, position.y + -70);
				rotate(225 * (Math.PI / 180));
				triangle(0, 0, 0 + 10, 0 - 35, 0 - 10, 0 - 35);
				popMatrix();
			};

			//stroke(0, 0, 0);
			drawFirstTip();
			drawTop();
			drawMiddle();
			drawBottom();

			popMatrix();
		};
		var drawE = function(Epos) {
			noStroke();
			pushMatrix();
			translate(Epos.x, Epos.y);
			var drawTop = function() {
				fillColor.red();
				pushMatrix();
				translate(position.x + -40, position.y + -171);
				//rect(0, 0, 65, 10);
				rect(0, 0, 60, 10);
				popMatrix();

				pushMatrix();
				translate(position.x + -40, position.y + -161);
				triangle(0, 0, -10, -10, 10, -10);
				popMatrix();

				pushMatrix();
				translate(position.x + 21, position.y + -150);
				triangle(-2, 15, 0, -20, -15, -20);
				popMatrix();
			};
			var drawMiddle = function() {
				fillColor.red();
				pushMatrix();
				translate(position.x + -40, position.y + -130);
				//rect(0, 0, 65, 10);
				rect(0, 0, 44, 10);
				popMatrix();

				pushMatrix();
				translate(position.x + -40, position.y + -129);
				rect(0, -42, 13, 89);
				popMatrix();

				pushMatrix();
				translate(position.x + -5, position.y + -124);
				triangle(0, 0, 10, -20, 10, 20);
				popMatrix();
			};
			var drawBottom = function() {
				fillColor.red();
				pushMatrix();
				translate(position.x + -40, position.y + -91);
				//rect(0, 0, 65, 10);
				rect(0, 0, 60, 10);
				popMatrix();

				pushMatrix();
				translate(position.x + -40, position.y + -81);
				triangle(0, -10, -10, 0, 10, 0);
				popMatrix();

				pushMatrix();
				translate(position.x + 21, position.y + -61);
				triangle(-2, -56, 0, -20, -15, -20);
				popMatrix();
			};

			//stroke(0, 0, 0);
			drawTop();
			drawMiddle();
			drawBottom();
			popMatrix();
		};
		var drawL = function(Epos) {
			noStroke();
			pushMatrix();
			translate(Epos.x, Epos.y);
			var drawMiddle = function() {
				fillColor.red();

				pushMatrix();
				translate(position.x + -40, position.y + -161);
				triangle(0, 0, -10, -10, 10, -10);
				popMatrix();

				pushMatrix();
				translate(position.x + -27, position.y + -161);
				triangle(0, 0, -10, -10, 10, -10);
				popMatrix();

				pushMatrix();
				translate(position.x + -40, position.y + -129);
				rect(0, -42, 13, 89);
				popMatrix();
			};
			var drawBottom = function() {
				fillColor.red();
				pushMatrix();
				translate(position.x + -40, position.y + -91);
				//rect(0, 0, 65, 10);
				rect(0, 0, 50, 10);
				popMatrix();

				pushMatrix();
				translate(position.x + -40, position.y + -81);
				triangle(0, -10, -10, 0, 10, 0);
				popMatrix();

				pushMatrix();
				translate(position.x + 11, position.y + -61);
				triangle(-2, -56, 0, -20, -15, -20);
				popMatrix();
			};

			//stroke(0, 0, 0);
			drawMiddle();
			drawBottom();
			popMatrix();
		};
		var drawD = function(Dpos) {
			noStroke();
			pushMatrix();
			translate(Dpos.x, Dpos.y);
			var drawMiddle = function() {
				fillColor.red();
				pushMatrix();
				translate(position.x + -17, position.y + -126);
				ellipse(0, 0, 82, 89);
				popMatrix();

				fillColor.backgroundColor();
				pushMatrix();
				noStroke();
				translate(position.x + -62, position.y + -172);
				rect(0, 0, 35, 89);
				popMatrix();

				pushMatrix();
				translate(position.x + -19, position.y + -127);
				ellipse(0, 0, 51, 76);
				popMatrix();

				fillColor.red();

				pushMatrix();
				translate(position.x + -40, position.y + -161);
				triangle(0, 0, -10, -10, 10, -10);
				popMatrix();

				pushMatrix();
				translate(position.x + -27, position.y + -161);
				triangle(0, 0, -10, -10, 10, -10);
				popMatrix();

				pushMatrix();
				translate(position.x + -40, position.y + -129);
				rect(0, -42, 13, 89);
				popMatrix();
			};
			var drawBottom = function() {

				fillColor.red();
				pushMatrix();
				translate(position.x + -40, position.y + -81);
				triangle(0, -10, -10, 0, 10, 0);
				popMatrix();

				pushMatrix();
				translate(position.x + -26, position.y + -81);
				triangle(0, -10, -10, 0, 10, 0);
				popMatrix();
			};

			//stroke(0, 0, 0);
			drawMiddle();
			drawBottom();
			popMatrix();
		};
		var drawA = function(Apos) {
			noStroke();
			pushMatrix();
			translate(Apos.x, Apos.y);
			var drawTop = function() {
				fillColor.red();
				pushMatrix();
				translate(position.x + -28, position.y + -161);
				triangle(0, 0, -10, -10, 10, -10);
				popMatrix();
			};
			var drawMiddle = function() {
				fillColor.red();
				pushMatrix();
				translate(position.x + -40, position.y + -122);
				//rect(0, 0, 65, 10);
				rect(0, 0, 36, 10);
				popMatrix();

				pushMatrix();
				translate(position.x + -37, position.y + -131);
				rotate(15 * (Math.PI / 180));
				rect(0, -42, 10, 89);
				popMatrix();

				pushMatrix();
				translate(position.x + -19, position.y + -125);
				rotate(-15 * (Math.PI / 180));
				rect(0, -44, 15, 89);
				popMatrix();
			};
			var drawBottom = function() {
				fillColor.red();

				pushMatrix();
				translate(position.x + -47, position.y + -81);
				triangle(0, -10, -20, 0, 20, 0);
				popMatrix();

				pushMatrix();
				translate(position.x + -3, position.y + -81);
				triangle(0, -15, -18, 0, 18, 0);
				popMatrix();
			};

			//stroke(0, 0, 0);
			drawTop();
			drawMiddle();
			drawBottom();
			popMatrix();
		};
		draw_TheLegendOf_(0, 0);
		draw_jokeText_(0, 0);
		drawZ(new PVector(-28, -12));
		drawE(new PVector(0, 0));
		drawD(new PVector(132, 0));
		drawL(new PVector(70, 0));
		drawA(new PVector(201, 0));

		text(" -- ~ > PRESS ANY KEY < ~ --", 91, 265);
		textFont(serif, 10);
		text("Alex Laisney", 324, 370);
		text("Jasher Grunau", 324, 380);
	};
	var monteCarlo = function() {
		var v1 = random(150, 255);
		var v2 = random(150, 255);
		while (v2 > v1) {
			v1 = random(150, 255);
			v2 = random(150, 255);
		}
		return (v1);
	};
	var drawFullHeart = function() {
		fill(161, 23, 23);
		bezier(0, 30, -25, 10, -40, 30, 0, 67);
		bezier(0, 30, 20, 10, 40, 30, 0, 67);
		stroke(46, 77, 46);
		strokeWeight(1);
	};
	var drawHalfHeart = function() {
		fill(161, 23, 23);
		bezier(0, 30, -25, 10, -40, 30, 0, 67);
		fill(128, 128, 128);
		bezier(0, 30, 20, 10, 40, 30, 0, 67);
		stroke(46, 77, 46);
		strokeWeight(1);
	};
	var drawEmptyHeart = function() {
		fill(128, 128, 128);
		bezier(0, 30, -25, 10, -40, 30, 0, 67);
		bezier(0, 30, 20, 10, 40, 30, 0, 67);
		stroke(46, 77, 46);
		strokeWeight(1);
	};
	var drawTriforce = function() {
		fill(212, 175, 55);
		textFont(serif, 28);
		text("\u25b2", 0, 0);
		text("\u25b2", 10, 21);
		text("\u25b2", -10, 21);
	};
	var leafObj = function(x, y) {
		this.position = new PVector(x, y);
		this.velocity = new PVector(random(-2.0, 2), random(0.5, 2));
		this.angle = 0;
		this.size1 = random(0.1, 0.2);
		this.size = random(0.1, 0.2);
		this.position.y -= (18 - this.size);
		this.c1 = monteCarlo();
		this.timeLeft = 255;
		this.once = false;
		this.greenLeaves = function() {
			fill(152, 50, 72);
			bezier(0, 0, -40, 10, -40, 30, 0, 90);
			fill(100, 50, 76);
			bezier(0, 0, 40, 10, 5, 30, 0, 71);
			stroke(46, 77, 46);
			strokeWeight(1);
			line(0, 0, 2, 60);
		};
		this.redLeaves = function() {
			fill(138, 179, 72);
			bezier(0, 0, -40, 10, -40, 30, 0, 90);
			fill(118, 166, 76);
			bezier(0, 0, 40, 10, 5, 30, 0, 71);
			stroke(46, 77, 46);
			strokeWeight(2);
			line(0, 0, 2, 60);
		};
		this.draw = function() {
			pushMatrix();
			rotate(-this.angle * (Math.PI / 180));
			translate(this.position.x, this.position.y);
			scale(this.size1, this.size1);
			this.greenLeaves();
			resetMatrix();
			rotate(-this.angle * (Math.PI / 180));
			translate(this.position.x + 10, this.position.y + 50);
			scale(this.size, this.size);
			this.redLeaves();
			popMatrix();
		};
		this.move = function() {
			this.position.add(this.velocity);
			this.timeLeft--;
		};
	};
	var waterfallObj = function(x, y) {
		this.position = new PVector(x, y);
		this.velocity = new PVector(random(-0.05, 0.05), random(0.5, 2));
		this.size = random(1, 2);
		this.position.y -= (18 - this.size);
		this.c1 = monteCarlo();
		this.timeLeft = 255;
		this.draw = function() {
			noStroke();
			fill(this.c1, this.c1, this.c1, this.timeLeft);
			ellipse(this.position.x, this.position.y, this.size, this.size * 7);
		};
		this.move = function() {
			this.position.add(this.velocity);
			this.timeLeft--;
		};
	};
	var drawRange = function(c1) {
		var incAmount = 0.01;
		for (var t = 0; t < incAmount * width; t += incAmount) {
			stroke(c1, c1, c1);
			var n = noise(t + c1 * 20);
			var y = map(n, 0, 1, 0, height / 2);
			rect(t * 100, height - y, 1, y);
		}

	};
	var end = function() {
		background(0, 0, 0);
		textFont(serif, 20);
		fillColor.white();
		text("CONGRADULATIONS!", 97, 63);
		textFont(serif, 15);
		text("THANK YOU " + name + ", YOUR HEROISM", 87, 120);
		text("HAS SAVED THE KINGODM OF HYULE", 70, 140);
		text("ONCE AGAIN", 153, 160);
		text("HYRULE HAS RETURNED TO THE", 89, 240);
		text("PEACEFUL KINGDOM IT ONCE WAS", 80, 260);
		text("THE END", 170, 320);
		text("THANK YOU!", 157, 340);
		pushMatrix();
		translate(190, 194);
		drawTriforce();
		popMatrix();
	};
	var gameOverMenu = function() {
		this.y = 178;
		this.draw = function() {
			background(0, 0, 0);
			textFont(serif, 40);
			fillColor.darkRed();
			text("YOU DIED!", 85, 132);
			textFont(serif, 15);
			fillColor.white();
			text("CONTINUE", 185, 195);
			text("RETRY", 185, 225);
			pushMatrix();
			translate(155, this.y);
			scale(0.3, 0.25);
			drawFullHeart();
			popMatrix();
		};
	};
	var drawName = function() {
		background(255);
		for (var i = 0; i < 400; i++) {
			stroke(112, 175, i / 2);
			line(0, i, 400, i);
		}
		textFont(serif, 40);
		fill(1, 100, 255);
		text("ENTER A NAME", 52, 116);
		textBox(152, 250, 100);
		if (name.length > 0) {
			fill(1, 100, 255);
			text(" -- ~ > PRESS ENTER KEY < ~ --", 91, 306);
		}
		pushMatrix();
		translate(190, 190);
		drawTriforce();
		popMatrix();
	};
	var magicBar = function() {
		this.currFrame = frameCount;
		this.update = function() {
			fill(255);
			rect(64, 13, 34, 54, 5);
			fill(128, 128, 128);

			rect(66, 15, 30, 50, 5);
			noStroke();
			fillColor.green();
			rect(66, (13 - magic) * 5, 30, magic * 5, 5);
			if (state === "overworld" || state === "dungeon") {
				if (magic < 10 && frameCount > this.currFrame + 30 && frameCount % 30 === 0) {
					magic++;
				}
			}
		};
	};
	var life = function() {
		fillColor.black();
		rect(0, 0, 400, 75);
		var fullHearts = hp;
		textFont(serif, 15);
		fillColor.white();
		text("--- LIFE ---", 288, 24);
		text("--- LIFE ---", 288, 24);
		pushMatrix();
		translate(255, 30);
		scale(0.3, 0.25);
		for (var i = 0; i < maxHp / 2; i++) {
			if (i === 8) {
				resetMatrix();
				translate(255, 45);
				scale(0.3, 0.25);
			}
			drawEmptyHeart();
			translate(60, 0);
		}
		popMatrix();
		if (hp % 2 !== 0) {
			var fullHearts = hp - 1;
		}
		pushMatrix();
		translate(255, 30);
		scale(0.3, 0.25);
		for (var i = 0; i < fullHearts / 2; i++) {
			if (i === 8) {
				resetMatrix();
				translate(255, 45);
				scale(0.3, 0.25);
			}
			drawFullHeart();
			translate(60, 0);
		}
		if (fullHearts !== hp) {
			if (hp === 17) {
				resetMatrix();
				translate(255, 45);
				scale(0.3, 0.25);
			}
			drawHalfHeart();
		}
		popMatrix();
		if (hp === 0) {
			state = "gameover";
			//gameOverMenu();
		}
	};
	var explosionObj = function(x, y, s, r) {
		var blockSize = 25;
		this.c = 0;
		this.r = r;
		this.s = s;
		this.currFrame = frameCount;
		switch (r) {
			case 0: //up
				this.position = new PVector(x, y);
				break;
			case 90: //right
				this.position = new PVector(x + 37, y);
				break;
			case 180: //down
				this.position = new PVector(x + 35, y + 37);
				break;
			case 270: //left
				this.position = new PVector(x, y + 35);
				break;
		}

		this.frame = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			rotate(r * (Math.PI / 180));
			scale(0.092, s);
			switch (this.c) {
				case 0:
					fillColor.white();
					break;
				case 1:
					fillColor.green();
					break;
			}
			rect(175, 175, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			switch (this.c) {
				case 0:
					fillColor.brown();
					break;
				case 1:
					fillColor.orange();
					break;
			}
			rect(175, 200, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			switch (this.c) {
				case 0:
					fillColor.red();
					break;
				case 1:
					fillColor.white();
					break;
			}
			rect(175, 250, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(275, 150, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(125, 250, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(125, 200, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(100, 75, blockSize, blockSize);
			rect(125, 50, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(100, 100, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			popMatrix();
		};
		this.draw = function() {
			this.c = 1 - this.c;
			if (frameCount < this.currFrame + 7) {
				this.frame();
			} else {
				player.projectiles.pop();
			}
			if (this.s > 0) {
				if (!this.r) {
					this.position.y -= 5;
					this.position.x -= 5;
				} else {
					this.position.y += 5;
					this.position.x += 5;
				}
			} else {
				if (!this.r) {
					this.position.y += 5;
					this.position.x -= 5;
				} else {
					this.position.y -= 5;
					this.position.x += 5;
				}
			}

		};
	};
	var swordObj = function(x, y, s, r) {
		var blockSize = 25;
		this.collision = false;
		this.r = r;
		this.c = 0;
		switch (r) {
			case 0: //up
				this.position = new PVector(x, y);
				break;
			case 90: //right
				this.position = new PVector(x + 37, y);
				break;
			case 180: //down
				this.position = new PVector(x + 35, y + 37);
				break;
			case 270: //left
				this.position = new PVector(x, y + 35);
				break;
		}
		this.frame = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			rotate(r * (Math.PI / 180));
			scale(s);
			switch (this.c) {
				case 0:
					fillColor.blue();
					break;
				case 1:
					fillColor.green();
					break;
			}
			rect(150, 375, blockSize, blockSize);
			rect(175, 375, blockSize, blockSize);
			rect(200, 375, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(200, 325, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(200, 275, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(250, 275, blockSize, blockSize);
			rect(250, 300, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(100, 275, blockSize, blockSize);
			rect(100, 300, blockSize, blockSize);
			switch (this.c) {
				case 0:
					fillColor.white();
					break;
				case 1:
					fillColor.orange();
					break;
			}
			rect(150, 300, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(175, 350, blockSize, blockSize);
			rect(200, 350, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(150, 25, blockSize, blockSize);
			rect(175, 0, blockSize, blockSize);
			rect(175, 25, blockSize, blockSize);
			rect(200, 25, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			popMatrix();
		};
		this.draw = function() {
			this.c = 1 - this.c;
			if (this.position.y > 80 && this.position.y < 410 && this.position.x < 400 && this.position.x > 0 && !this.collision) {
				this.frame();
			} else {
				this.collision = false;
				player.projectiles.pop();
				if (this.r === 0) {
					this.position.y += 35;
				}
				if (this.r === 90) {
					this.position.y += 35;
					this.position.x -= 47;
				}
				if (this.r === 180) {
					this.position.x -= 35;
					this.position.y -= 25;
				}
				if (this.r === 270) {
					this.position.x -= 2;
				}

				player.projectiles.unshift(new explosionObj(this.position.x - 7, this.position.y - 40, 0.092, 0));
				player.projectiles.unshift(new explosionObj(this.position.x - 7, this.position.y + 17, -0.092, 0));
				player.projectiles.unshift(new explosionObj(this.position.x + 15, this.position.y - 20, 0.092, 180));
				player.projectiles.unshift(new explosionObj(this.position.x + 15, this.position.y - 77, -0.092, 180));
			}
			switch (r) {
				case 0: //up
					this.position.y -= 10;
					break;
				case 90: //right
					this.position.x += 10;
					break;
				case 180: //down
					this.position.y += 10;
					break;
				case 270: //left
					this.position.x -= 10;
					break;
			}
		};
	};
	var bowObj = function(x, y, s, r) {
		var blockSize = 25;
		switch (r) {
			case 0: //up
				this.position = new PVector(x, y);
				break;
			case 90: //right
				this.position = new PVector(x + 37, y);
				break;
			case 180: //down
				this.position = new PVector(x + 35, y + 37);
				break;
			case 270: //left
				this.position = new PVector(x, y + 35);
				break;
		}

		this.frame = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			rotate(r * (Math.PI / 180));
			scale(s);
			fillColor.brown();
			rect(50, 375, blockSize, blockSize);
			rect(75, 375, blockSize, blockSize);
			rect(100, 375, blockSize, blockSize);
			rect(125, 350, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(200, 275, blockSize, blockSize);
			rect(50, 0, blockSize, blockSize);
			rect(75, 0, blockSize, blockSize);
			rect(100, 0, blockSize, blockSize);
			rect(125, 25, blockSize, blockSize);
			rect(150, 25, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			fillColor.green();
			rect(50, 25, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(50, 75, blockSize, blockSize);
			rect(50, 100, blockSize, blockSize);
			rect(50, 125, blockSize, blockSize);
			rect(50, 150, blockSize, blockSize);
			rect(50, 175, blockSize, blockSize);
			rect(50, 200, blockSize, blockSize);
			rect(50, 225, blockSize, blockSize);
			rect(50, 250, blockSize, blockSize);
			rect(50, 275, blockSize, blockSize);
			rect(50, 300, blockSize, blockSize);
			rect(50, 325, blockSize, blockSize);
			rect(50, 350, blockSize, blockSize);
			popMatrix();
		};
	};
	var arrowObj = function(x, y, s, r) {
		var blockSize = 25;
		this.collision = false;
		this.r = r;
		switch (r) {
			case 0: //up
				this.position = new PVector(x, y);
				break;
			case 90: //right
				this.position = new PVector(x + 37, y);
				break;
			case 180: //down
				this.position = new PVector(x + 35, y + 37);
				break;
			case 270: //left
				this.position = new PVector(x, y + 35);
				break;
			default:
				this.position = new PVector(x, y);
				break;
		}

		this.frame = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			rotate(r * (Math.PI / 180));
			scale(s);
			fillColor.orange();
			rect(175, 0, blockSize, blockSize);
			rect(175, 25, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			fillColor.green();
			rect(175, 75, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(175, 350, blockSize, blockSize);
			rect(175, 375, blockSize, blockSize);
			fillColor.brown();
			rect(200, 350, blockSize, blockSize);
			rect(225, 375, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(225, 325, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(150, 300, blockSize, blockSize);
			rect(125, 325, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(125, 375, blockSize, blockSize);
			popMatrix();
		};
		this.draw = function() {
			if (this.position.y > 40 && this.position.y < 440 && this.position.x < 440 && this.position.x > -40 && !this.collision) {
				this.frame();
			} else {
				this.collision = false;
				player.projectiles.pop();
			}
			switch (r) {
				case 0: //up
					this.position.y -= 10;
					break;
				case 90: //right
					this.position.x += 10;
					break;
				case 180: //down
					this.position.y += 10;
					break;
				case 270: //left
					this.position.x -= 10;
					break;
			}

		};
	};
	var rodObj = function(x, y, s, r) {
		var blockSize = 25;
		this.r = r;
		switch (r) {
			case 0: //up
				this.position = new PVector(x + 2, y);
				break;
			case 90: //right
				this.position = new PVector(x + 37, y + 2);
				break;
			case 180: //down
				this.position = new PVector(x + 35, y + 37);
				break;
			case 270: //left
				this.position = new PVector(x, y + 35);
				break;
		}

		this.frame = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			rotate(r * (Math.PI / 180));
			scale(s);
			fillColor.red();
			rect(150, 0, blockSize, blockSize);
			rect(175, 0, blockSize, blockSize);
			rect(200, 25, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(125, 25, blockSize, blockSize);
			rect(125, 50, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(175, 25, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(150, 50, blockSize, blockSize);
			fillColor.white();
			rect(150, 25, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(175, 150, blockSize, blockSize);
			fillColor.lightBlue();
			rect(150, 125, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(150, 300, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(175, 325, blockSize, blockSize);
			rect(150, 350, blockSize, blockSize);
			rect(175, 350, blockSize, blockSize);
			fillColor.white();
			rect(125, 75, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			popMatrix();
		};
	};
	var fireballObj = function(x, y, s, r) {
		var blockSize = 25;
		this.c = 0;
		this.r = r;
		this.collision = false;
		switch (r) {
			case 0: //up
				this.position = new PVector(x + 1, y - 40);
				break;
			case 90: //right
				this.position = new PVector(x + 77, y);
				break;
			case 180: //down
				this.position = new PVector(x + 36, y + 77);
				break;
			case 270: //left
				this.position = new PVector(x - 40, y + 36);
				break;
			default:
				this.position = new PVector(x, y);
				break;
		}
		this.frame = function() {
			pushMatrix();
			translate(this.position.x, this.position.y);
			rotate(r * (Math.PI / 180));
			scale(s);
			fillColor.red();
			rect(150, 50, blockSize, blockSize);
			rect(175, 50, blockSize, blockSize);
			rect(200, 50, blockSize, blockSize);
			rect(225, 50, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(125, 75, blockSize, blockSize);
			rect(125, 100, blockSize, blockSize);
			rect(125, 125, blockSize, blockSize);
			rect(100, 125, blockSize, blockSize);
			rect(100, 150, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(100, 200, blockSize, blockSize);
			rect(100, 225, blockSize, blockSize);
			rect(125, 225, blockSize, blockSize);
			rect(125, 250, blockSize, blockSize);
			rect(125, 275, blockSize, blockSize);
			rect(150, 275, blockSize, blockSize);
			rect(150, 300, blockSize, blockSize);
			rect(175, 300, blockSize, blockSize);
			rect(200, 300, blockSize, blockSize);
			rect(225, 300, blockSize, blockSize);
			rect(250, 50, blockSize, blockSize);
			rect(250, 300, blockSize, blockSize);
			rect(250, 275, blockSize, blockSize);
			rect(275, 275, blockSize, blockSize);
			rect(275, 250, blockSize, blockSize);
			rect(275, 225, blockSize, blockSize);
			rect(300, 225, blockSize, blockSize);
			rect(300, 200, blockSize, blockSize);
			rect(300, 175, blockSize, blockSize);
			rect(300, 150, blockSize, blockSize);
			rect(300, 125, blockSize, blockSize);
			rect(275, 125, blockSize, blockSize);
			rect(275, 100, blockSize, blockSize);
			rect(275, 75, blockSize, blockSize);
			rect(250, 75, blockSize, blockSize);
			fillColor.orange();
			rect(275, 150, blockSize, blockSize);
			rect(275, 175, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(175, 275, blockSize, blockSize);
			rect(200, 275, blockSize, blockSize);
			rect(225, 275, blockSize, blockSize);
			rect(250, 250, blockSize, blockSize);
			rect(150, 250, blockSize, blockSize);
			rect(125, 150, blockSize, blockSize);
			rect(125, 175, blockSize, blockSize);
			rect(125, 200, blockSize, blockSize);
			rect(175, 75, blockSize, blockSize);
			rect(200, 75, blockSize, blockSize);
			rect(225, 75, blockSize, blockSize);
			rect(150, 100, blockSize, blockSize);
			rect(250, 100, blockSize, blockSize);
			rect(250, 125, blockSize, blockSize);
			rect(250, 150, blockSize, blockSize);
			rect(250, 175, blockSize, blockSize);
			rect(250, 200, blockSize, blockSize);
			rect(250, 225, blockSize, blockSize);
			rect(175, 250, blockSize, blockSize);
			rect(200, 250, blockSize, blockSize);
			rect(225, 250, blockSize, blockSize);
			rect(175, 100, blockSize, blockSize);
			rect(200, 100, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(150, 125, blockSize, blockSize);
			rect(150, 150, blockSize, blockSize);
			rect(150, 175, blockSize, blockSize);
			rect(150, 200, blockSize, blockSize);
			rect(150, 225, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			rect(200, 225, blockSize, blockSize);
			rect(225, 225, blockSize, blockSize);
			rect(175, 125, blockSize, blockSize);
			rect(200, 125, blockSize, blockSize);
			rect(225, 125, blockSize, blockSize);
			switch (this.c) {
				case 0:
					fillColor.white();
					break;
				case 1:
					fillColor.green();
					break;
			}
			rect(175, 150, blockSize, blockSize);
			rect(175, 175, blockSize, blockSize);
			rect(175, 200, blockSize, blockSize);
			rect(200, 200, blockSize, blockSize);
			rect(225, 200, blockSize, blockSize);
			rect(225, 175, blockSize, blockSize);
			rect(225, 150, blockSize, blockSize);
			rect(200, 150, blockSize, blockSize);
			rect(200, 175, blockSize, blockSize);
			popMatrix();
		};
		this.draw = function() {
			this.c = 1 - this.c;
			if (this.position.y > 40 && this.position.y < 440 && this.position.x < 440 && this.position.x > -40 && !this.collision) {
				this.frame();
			} else {
				this.collision = false;
				player.projectiles.pop();
			}
			switch (r) {
				case 0: //up
					this.position.y -= 10;
					break;
				case 90: //right
					this.position.x += 10;
					break;
				case 180: //down
					this.position.y += 10;
					break;
				case 270: //left
					this.position.x -= 10;
					break;
			}
		};
	};
	var magicMeter = new magicBar();
	var playerObj = function(x, y, s) {
		{
			this.collide = null;
			this.position = new PVector(x, y);
			this.currFrame = frameCount;
			this.frame = 0;
			this.atk = 0;
			this.items = [];
			this.sword = new swordObj(this.position.x, this.position.y + 28, 0.092, 180);
			this.projectiles = [];
			var blockSize = 25;
			this.currentItem = null;
			noStroke();
			this.frame1_1 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(125, 0, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(225, 0, blockSize, blockSize);
				rect(250, 0, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				fillColor.brown();
				rect(100, 75, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(125, 50, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(275, 125, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(75, 325, blockSize, blockSize);
				rect(50, 325, blockSize, blockSize);
				rect(25, 325, blockSize, blockSize);
				rect(0, 325, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(150, 350, blockSize, blockSize);
				rect(150, 375, blockSize, blockSize);
				rect(125, 375, blockSize, blockSize);
				rect(100, 375, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(50, 200, blockSize, blockSize);
				rect(25, 200, blockSize, blockSize);
				rect(0, 225, blockSize, blockSize);
				rect(0, 250, blockSize, blockSize);
				rect(0, 275, blockSize, blockSize);
				rect(0, 300, blockSize, blockSize);
				rect(25, 225, blockSize, blockSize);
				rect(25, 275, blockSize, blockSize);
				rect(25, 300, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(75, 275, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(225, 350, blockSize, blockSize);
				rect(250, 350, blockSize, blockSize);
				rect(275, 350, blockSize, blockSize);
				rect(350, 250, blockSize, blockSize);
				rect(350, 225, blockSize, blockSize);
				rect(350, 200, blockSize, blockSize);
				rect(325, 200, blockSize, blockSize);
				rect(325, 225, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(325, 175, blockSize, blockSize);
				rect(325, 150, blockSize, blockSize);
				fillColor.tan();
				rect(125, 100, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(75, 100, blockSize, blockSize);
				rect(50, 125, blockSize, blockSize);
				rect(50, 100, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(300, 150, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(325, 125, blockSize, blockSize);
				rect(325, 100, blockSize, blockSize);
				rect(325, 75, blockSize, blockSize);
				rect(325, 50, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(325, 250, blockSize, blockSize);
				rect(300, 275, blockSize, blockSize);
				rect(325, 275, blockSize, blockSize);
				rect(350, 275, blockSize, blockSize);
				rect(325, 300, blockSize, blockSize);
				rect(50, 225, blockSize, blockSize);
				rect(50, 250, blockSize, blockSize);
				rect(50, 275, blockSize, blockSize);
				rect(50, 300, blockSize, blockSize);
				rect(25, 250, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(125, 350, blockSize, blockSize);
				rect(100, 350, blockSize, blockSize);
				rect(75, 350, blockSize, blockSize);
				rect(50, 350, blockSize, blockSize);
				rect(25, 350, blockSize, blockSize);
				fillColor.green();
				rect(175, 275, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(100, 175, blockSize, blockSize);
				rect(75, 175, blockSize, blockSize);
				rect(275, 175, blockSize, blockSize);
				rect(300, 175, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(275, 325, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				popMatrix();
			};
			this.frame1_2 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(125, 0, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(225, 0, blockSize, blockSize);
				rect(250, 0, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				fillColor.brown();
				rect(125, 50, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(275, 125, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				fillColor.tan();
				rect(75, 100, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(50, 125, blockSize, blockSize);
				rect(50, 100, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(300, 150, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(325, 100, blockSize, blockSize);
				rect(325, 125, blockSize, blockSize);
				rect(325, 75, blockSize, blockSize);
				rect(325, 50, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				fillColor.brown();
				rect(175, 175, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(50, 200, blockSize, blockSize);
				rect(25, 225, blockSize, blockSize);
				rect(25, 250, blockSize, blockSize);
				rect(25, 275, blockSize, blockSize);
				rect(25, 300, blockSize, blockSize);
				rect(25, 325, blockSize, blockSize);
				rect(50, 225, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(50, 275, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(50, 300, blockSize, blockSize);
				rect(50, 325, blockSize, blockSize);
				rect(75, 325, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				fillColor.tan();
				rect(75, 225, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(50, 250, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(75, 275, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(150, 350, blockSize, blockSize);
				rect(125, 350, blockSize, blockSize);
				rect(100, 350, blockSize, blockSize);
				rect(75, 350, blockSize, blockSize);
				rect(50, 350, blockSize, blockSize);
				fillColor.brown();
				rect(200, 250, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				fillColor.green();
				rect(200, 225, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(275, 175, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				rect(300, 275, blockSize, blockSize);
				fillColor.brown();
				rect(300, 175, blockSize, blockSize);
				rect(325, 175, blockSize, blockSize);
				rect(325, 150, blockSize, blockSize);
				rect(275, 325, blockSize, blockSize);
				rect(275, 350, blockSize, blockSize);
				rect(275, 375, blockSize, blockSize);
				rect(250, 375, blockSize, blockSize);
				rect(225, 375, blockSize, blockSize);
				rect(225, 350, blockSize, blockSize);
				rect(250, 350, blockSize, blockSize);
				fillColor.tan();
				rect(325, 200, blockSize, blockSize);
				rect(325, 225, blockSize, blockSize);
				popMatrix();
			};
			this.frame1_3 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(150, 0, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(225, 0, blockSize, blockSize);
				rect(250, 0, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(300, 50, blockSize, blockSize);
				rect(300, 75, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(125, 50, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(100, 175, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(275, 325, blockSize, blockSize);
				rect(300, 325, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				rect(300, 275, blockSize, blockSize);
				rect(325, 300, blockSize, blockSize);
				rect(325, 275, blockSize, blockSize);
				rect(325, 250, blockSize, blockSize);
				fillColor.tan();
				rect(75, 25, blockSize, blockSize);
				rect(75, 50, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(75, 100, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(50, 100, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(300, 150, blockSize, blockSize);
				rect(325, 125, blockSize, blockSize);
				rect(325, 100, blockSize, blockSize);
				rect(350, 100, blockSize, blockSize);
				rect(350, 75, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(200, 350, blockSize, blockSize);
				rect(225, 350, blockSize, blockSize);
				rect(250, 350, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(50, 175, blockSize, blockSize);
				rect(25, 150, blockSize, blockSize);
				rect(0, 125, blockSize, blockSize);
				fillColor.brown();
				rect(325, 325, blockSize, blockSize);
				rect(350, 300, blockSize, blockSize);
				rect(350, 325, blockSize, blockSize);
				rect(350, 350, blockSize, blockSize);
				rect(325, 350, blockSize, blockSize);
				rect(300, 350, blockSize, blockSize);
				rect(375, 325, blockSize, blockSize);
				rect(375, 350, blockSize, blockSize);
				rect(325, 225, blockSize, blockSize);
				rect(325, 200, blockSize, blockSize);
				rect(300, 175, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(275, 175, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(275, 125, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(75, 175, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(50, 150, blockSize, blockSize);
				rect(50, 125, blockSize, blockSize);
				rect(25, 125, blockSize, blockSize);
				rect(25, 100, blockSize, blockSize);
				rect(0, 100, blockSize, blockSize);
				rect(0, 75, blockSize, blockSize);
				rect(25, 75, blockSize, blockSize);
				rect(25, 50, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(50, 25, blockSize, blockSize);
				rect(75, 0, blockSize, blockSize);
				rect(100, 0, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(75, 325, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(50, 325, blockSize, blockSize);
				popMatrix();
			};
			this.frame2_1 = function() {
				pushMatrix();
				noStroke();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(350, 75, blockSize, blockSize);
				rect(350, 100, blockSize, blockSize);
				rect(325, 75, blockSize, blockSize);
				rect(325, 50, blockSize, blockSize);
				rect(300, 50, blockSize, blockSize);
				rect(300, 75, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(225, 0, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				fillColor.tan();
				rect(250, 50, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				fillColor.green();
				rect(200, 75, blockSize, blockSize);
				fillColor.tan();
				rect(200, 125, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(100, 175, blockSize, blockSize);
				rect(75, 175, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(75, 100, blockSize, blockSize);
				rect(50, 125, blockSize, blockSize);
				rect(25, 125, blockSize, blockSize);
				fillColor.brown();
				rect(275, 125, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(75, 25, blockSize, blockSize);
				rect(75, 50, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(125, 50, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				fillColor.green();
				rect(100, 125, blockSize, blockSize);
				fillColor.tan();
				rect(100, 100, blockSize, blockSize);
				fillColor.tan();
				rect(100, 100, blockSize, blockSize);
				fillColor.green();
				rect(100, 100, blockSize, blockSize);
				fillColor.brown();
				rect(100, 125, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(50, 200, blockSize, blockSize);
				rect(50, 225, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(50, 250, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(0, 200, blockSize, blockSize);
				rect(0, 175, blockSize, blockSize);
				rect(0, 150, blockSize, blockSize);
				rect(0, 125, blockSize, blockSize);
				rect(0, 100, blockSize, blockSize);
				rect(0, 225, blockSize, blockSize);
				rect(0, 250, blockSize, blockSize);
				rect(0, 275, blockSize, blockSize);
				rect(0, 275, blockSize, blockSize);
				rect(0, 300, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				fillColor.green();
				rect(125, 200, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(275, 325, blockSize, blockSize);
				rect(300, 325, blockSize, blockSize);
				rect(325, 325, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				fillColor.tan();
				rect(25, 200, blockSize, blockSize);
				rect(25, 225, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				fillColor.brown();
				rect(250, 250, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(325, 225, blockSize, blockSize);
				rect(325, 250, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(300, 275, blockSize, blockSize);
				rect(325, 275, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(150, 375, blockSize, blockSize);
				rect(175, 350, blockSize, blockSize);
				rect(175, 375, blockSize, blockSize);
				rect(200, 375, blockSize, blockSize);
				rect(225, 375, blockSize, blockSize);
				rect(250, 375, blockSize, blockSize);
				rect(250, 350, blockSize, blockSize);
				rect(225, 350, blockSize, blockSize);
				rect(200, 350, blockSize, blockSize);
				popMatrix();
			};
			this.frame2_2 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(350, 75, blockSize, blockSize);
				rect(350, 100, blockSize, blockSize);
				rect(325, 75, blockSize, blockSize);
				rect(325, 50, blockSize, blockSize);
				rect(300, 50, blockSize, blockSize);
				rect(300, 75, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(225, 0, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(325, 250, blockSize, blockSize);
				rect(325, 275, blockSize, blockSize);
				rect(300, 275, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(275, 325, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				fillColor.tan();
				rect(250, 50, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(100, 175, blockSize, blockSize);
				rect(75, 175, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(75, 100, blockSize, blockSize);
				rect(50, 125, blockSize, blockSize);
				rect(25, 125, blockSize, blockSize);
				rect(50, 200, blockSize, blockSize);
				rect(50, 225, blockSize, blockSize);
				fillColor.brown();
				rect(25, 150, blockSize, blockSize);
				rect(25, 175, blockSize, blockSize);
				rect(25, 200, blockSize, blockSize);
				rect(25, 225, blockSize, blockSize);
				rect(25, 250, blockSize, blockSize);
				rect(25, 275, blockSize, blockSize);
				rect(25, 300, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(75, 325, blockSize, blockSize);
				rect(50, 325, blockSize, blockSize);
				rect(75, 350, blockSize, blockSize);
				rect(100, 350, blockSize, blockSize);
				rect(125, 350, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(75, 25, blockSize, blockSize);
				rect(75, 50, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(125, 50, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(275, 350, blockSize, blockSize);
				rect(275, 350, blockSize, blockSize);
				rect(300, 350, blockSize, blockSize);
				rect(325, 350, blockSize, blockSize);
				rect(325, 325, blockSize, blockSize);
				rect(300, 325, blockSize, blockSize);
				rect(325, 300, blockSize, blockSize);
				rect(350, 300, blockSize, blockSize);
				rect(350, 325, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(275, 125, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				popMatrix();
			};
			this.frame2_3 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(125, 0, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(275, 125, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(325, 125, blockSize, blockSize);
				rect(325, 150, blockSize, blockSize);
				fillColor.brown();
				rect(125, 25, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(75, 25, blockSize, blockSize);
				rect(50, 25, blockSize, blockSize);
				rect(25, 50, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(75, 50, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(125, 50, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				fillColor.green();
				rect(75, 100, blockSize, blockSize);
				fillColor.tan();
				rect(50, 100, blockSize, blockSize);
				rect(50, 125, blockSize, blockSize);
				rect(50, 150, blockSize, blockSize);
				rect(50, 175, blockSize, blockSize);
				rect(75, 175, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(25, 125, blockSize, blockSize);
				rect(0, 125, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(100, 175, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(25, 175, blockSize, blockSize);
				rect(25, 200, blockSize, blockSize);
				rect(50, 200, blockSize, blockSize);
				rect(50, 225, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				fillColor.brown();
				rect(200, 150, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				fillColor.green();
				rect(75, 250, blockSize, blockSize);
				fillColor.brown();
				rect(50, 275, blockSize, blockSize);
				rect(50, 300, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(75, 275, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(50, 325, blockSize, blockSize);
				rect(25, 325, blockSize, blockSize);
				rect(0, 350, blockSize, blockSize);
				rect(25, 350, blockSize, blockSize);
				rect(50, 350, blockSize, blockSize);
				rect(75, 350, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				fillColor.green();
				rect(100, 275, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(75, 325, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(275, 325, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				rect(325, 275, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(300, 275, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				fillColor.brown();
				rect(325, 300, blockSize, blockSize);
				rect(350, 300, blockSize, blockSize);
				rect(350, 325, blockSize, blockSize);
				rect(325, 325, blockSize, blockSize);
				rect(300, 325, blockSize, blockSize);
				rect(300, 350, blockSize, blockSize);
				rect(275, 350, blockSize, blockSize);
				rect(250, 350, blockSize, blockSize);
				popMatrix();
			};
			this.frame3_1 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(175, 0, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				rect(125, 0, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(225, 0, blockSize, blockSize);
				rect(250, 0, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(125, 50, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(300, 75, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				fillColor.tan();
				rect(50, 100, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(50, 125, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(325, 50, blockSize, blockSize);
				rect(325, 75, blockSize, blockSize);
				rect(325, 100, blockSize, blockSize);
				rect(325, 125, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(300, 150, blockSize, blockSize);
				fillColor.brown();
				rect(300, 100, blockSize, blockSize);
				rect(275, 125, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(75, 100, blockSize, blockSize);
				rect(75, 175, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(50, 225, blockSize, blockSize);
				rect(50, 200, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(300, 175, blockSize, blockSize);
				fillColor.green();
				rect(100, 175, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(275, 175, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(75, 275, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				fillColor.tan();
				rect(300, 275, blockSize, blockSize);
				rect(325, 275, blockSize, blockSize);
				rect(325, 250, blockSize, blockSize);
				rect(325, 225, blockSize, blockSize);
				fillColor.brown();
				rect(275, 325, blockSize, blockSize);
				rect(250, 350, blockSize, blockSize);
				rect(225, 350, blockSize, blockSize);
				rect(150, 350, blockSize, blockSize);
				rect(125, 350, blockSize, blockSize);
				rect(100, 350, blockSize, blockSize);
				rect(75, 350, blockSize, blockSize);
				rect(100, 375, blockSize, blockSize);
				rect(125, 375, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(75, 325, blockSize, blockSize);
				popMatrix();
			};
			this.frame3_2 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(175, 0, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				rect(125, 0, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(225, 0, blockSize, blockSize);
				rect(250, 0, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(125, 50, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(300, 75, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(275, 175, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(100, 175, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				rect(300, 275, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				fillColor.brown();
				rect(75, 100, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(275, 125, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(75, 175, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(300, 175, blockSize, blockSize);
				rect(325, 200, blockSize, blockSize);
				rect(325, 225, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(275, 325, blockSize, blockSize);
				rect(300, 325, blockSize, blockSize);
				rect(300, 350, blockSize, blockSize);
				rect(275, 350, blockSize, blockSize);
				rect(250, 350, blockSize, blockSize);
				rect(225, 350, blockSize, blockSize);
				rect(250, 375, blockSize, blockSize);
				rect(275, 375, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(125, 350, blockSize, blockSize);
				rect(150, 350, blockSize, blockSize);
				fillColor.tan();
				rect(75, 275, blockSize, blockSize);
				rect(50, 275, blockSize, blockSize);
				rect(50, 250, blockSize, blockSize);
				rect(50, 225, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(50, 125, blockSize, blockSize);
				rect(50, 100, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(325, 50, blockSize, blockSize);
				rect(325, 75, blockSize, blockSize);
				rect(325, 100, blockSize, blockSize);
				rect(325, 125, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(300, 150, blockSize, blockSize);
				popMatrix();
			};
			this.frame3_3 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.brown();
				rect(75, 0, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(25, 100, blockSize, blockSize);
				rect(25, 125, blockSize, blockSize);
				rect(25, 150, blockSize, blockSize);
				rect(25, 175, blockSize, blockSize);
				rect(50, 150, blockSize, blockSize);
				rect(50, 175, blockSize, blockSize);
				rect(50, 200, blockSize, blockSize);
				rect(50, 225, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(25, 275, blockSize, blockSize);
				rect(25, 300, blockSize, blockSize);
				rect(25, 325, blockSize, blockSize);
				rect(50, 325, blockSize, blockSize);
				rect(0, 325, blockSize, blockSize);
				rect(0, 300, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(75, 100, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				fillColor.green();
				rect(100, 0, blockSize, blockSize);
				rect(125, 0, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(75, 25, blockSize, blockSize);
				rect(75, 50, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(125, 50, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(100, 175, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(75, 175, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(50, 250, blockSize, blockSize);
				rect(50, 275, blockSize, blockSize);
				rect(50, 300, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(75, 275, blockSize, blockSize);
				fillColor.brown();
				rect(150, 275, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(275, 175, blockSize, blockSize);
				rect(300, 175, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				fillColor.tan();
				rect(50, 125, blockSize, blockSize);
				rect(50, 100, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(25, 75, blockSize, blockSize);
				rect(25, 50, blockSize, blockSize);
				rect(25, 25, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(275, 125, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(300, 75, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(325, 175, blockSize, blockSize);
				rect(350, 150, blockSize, blockSize);
				rect(375, 125, blockSize, blockSize);
				fillColor.brown();
				rect(375, 150, blockSize, blockSize);
				rect(375, 175, blockSize, blockSize);
				rect(350, 175, blockSize, blockSize);
				rect(350, 200, blockSize, blockSize);
				rect(375, 200, blockSize, blockSize);
				rect(375, 225, blockSize, blockSize);
				rect(350, 225, blockSize, blockSize);
				rect(325, 225, blockSize, blockSize);
				rect(325, 200, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(325, 250, blockSize, blockSize);
				rect(350, 250, blockSize, blockSize);
				rect(325, 275, blockSize, blockSize);
				rect(300, 275, blockSize, blockSize);
				fillColor.green();
				rect(100, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				fillColor.brown();
				rect(275, 325, blockSize, blockSize);
				rect(300, 325, blockSize, blockSize);
				rect(250, 350, blockSize, blockSize);
				rect(275, 350, blockSize, blockSize);
				rect(300, 350, blockSize, blockSize);
				rect(325, 350, blockSize, blockSize);
				rect(250, 375, blockSize, blockSize);
				rect(275, 375, blockSize, blockSize);
				rect(300, 375, blockSize, blockSize);
				rect(325, 375, blockSize, blockSize);
				popMatrix();
			};
			this.frame4_1 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(25, 75, blockSize, blockSize);
				rect(25, 100, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(75, 50, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(75, 100, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(225, 0, blockSize, blockSize);
				fillColor.tan();
				rect(125, 50, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				fillColor.green();
				rect(175, 75, blockSize, blockSize);
				fillColor.brown();
				rect(175, 75, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(300, 75, blockSize, blockSize);
				rect(300, 50, blockSize, blockSize);
				rect(325, 50, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(300, 25, blockSize, blockSize);
				fillColor.tan();
				rect(175, 100, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(275, 175, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(300, 175, blockSize, blockSize);
				rect(300, 150, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(325, 125, blockSize, blockSize);
				rect(350, 125, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(325, 200, blockSize, blockSize);
				rect(325, 225, blockSize, blockSize);
				fillColor.green();
				rect(200, 175, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				fillColor.brown();
				rect(275, 125, blockSize, blockSize);
				rect(350, 150, blockSize, blockSize);
				rect(350, 175, blockSize, blockSize);
				rect(350, 200, blockSize, blockSize);
				rect(350, 225, blockSize, blockSize);
				rect(350, 250, blockSize, blockSize);
				rect(350, 275, blockSize, blockSize);
				rect(350, 300, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				rect(325, 325, blockSize, blockSize);
				rect(300, 325, blockSize, blockSize);
				rect(300, 350, blockSize, blockSize);
				rect(275, 350, blockSize, blockSize);
				rect(250, 350, blockSize, blockSize);
				fillColor.green();
				rect(300, 300, blockSize, blockSize);
				rect(275, 325, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(75, 275, blockSize, blockSize);
				rect(50, 275, blockSize, blockSize);
				rect(50, 250, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				fillColor.brown();
				rect(100, 125, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(25, 300, blockSize, blockSize);
				rect(50, 300, blockSize, blockSize);
				rect(25, 325, blockSize, blockSize);
				rect(50, 325, blockSize, blockSize);
				rect(75, 325, blockSize, blockSize);
				rect(50, 350, blockSize, blockSize);
				rect(75, 350, blockSize, blockSize);
				rect(100, 350, blockSize, blockSize);
				popMatrix();
			};
			this.frame4_2 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(0, 75, blockSize, blockSize);
				rect(0, 100, blockSize, blockSize);
				rect(25, 75, blockSize, blockSize);
				rect(25, 50, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(50, 100, blockSize, blockSize);
				rect(50, 125, blockSize, blockSize);
				rect(75, 100, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(75, 50, blockSize, blockSize);
				rect(75, 25, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(125, 50, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(125, 0, blockSize, blockSize);
				rect(150, 0, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				fillColor.tan();
				rect(100, 50, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(200, 175, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(275, 175, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(275, 125, blockSize, blockSize);
				rect(275, 100, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(325, 125, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(325, 200, blockSize, blockSize);
				rect(325, 225, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				fillColor.brown();
				rect(250, 125, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(300, 50, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(300, 250, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(350, 100, blockSize, blockSize);
				rect(350, 125, blockSize, blockSize);
				rect(350, 150, blockSize, blockSize);
				rect(350, 175, blockSize, blockSize);
				rect(350, 200, blockSize, blockSize);
				rect(350, 225, blockSize, blockSize);
				rect(350, 250, blockSize, blockSize);
				rect(350, 275, blockSize, blockSize);
				rect(350, 300, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(75, 275, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(50, 275, blockSize, blockSize);
				rect(50, 250, blockSize, blockSize);
				rect(50, 225, blockSize, blockSize);
				rect(50, 200, blockSize, blockSize);
				rect(25, 225, blockSize, blockSize);
				rect(25, 250, blockSize, blockSize);
				rect(25, 275, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(100, 350, blockSize, blockSize);
				rect(125, 350, blockSize, blockSize);
				rect(175, 350, blockSize, blockSize);
				rect(150, 350, blockSize, blockSize);
				rect(100, 375, blockSize, blockSize);
				rect(125, 375, blockSize, blockSize);
				rect(150, 375, blockSize, blockSize);
				rect(175, 375, blockSize, blockSize);
				rect(200, 375, blockSize, blockSize);
				fillColor.green();
				rect(250, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(75, 325, blockSize, blockSize);
				rect(50, 325, blockSize, blockSize);
				rect(50, 300, blockSize, blockSize);
				rect(25, 325, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(100, 175, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				fillColor.brown();
				rect(125, 150, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(75, 150, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				fillColor.green();
				rect(250, 100, blockSize, blockSize);
				popMatrix();
			};
			this.frame4_3 = function() {
				pushMatrix();
				translate(this.position.x, this.position.y);
				scale(s);
				fillColor.green();
				rect(150, 0, blockSize, blockSize);
				rect(175, 0, blockSize, blockSize);
				rect(200, 0, blockSize, blockSize);
				rect(225, 0, blockSize, blockSize);
				rect(200, 25, blockSize, blockSize);
				rect(175, 25, blockSize, blockSize);
				rect(150, 25, blockSize, blockSize);
				rect(125, 25, blockSize, blockSize);
				rect(100, 25, blockSize, blockSize);
				rect(175, 50, blockSize, blockSize);
				rect(150, 50, blockSize, blockSize);
				rect(100, 50, blockSize, blockSize);
				rect(100, 75, blockSize, blockSize);
				rect(100, 100, blockSize, blockSize);
				rect(75, 50, blockSize, blockSize);
				rect(75, 75, blockSize, blockSize);
				rect(75, 100, blockSize, blockSize);
				rect(75, 125, blockSize, blockSize);
				rect(50, 50, blockSize, blockSize);
				rect(50, 75, blockSize, blockSize);
				rect(25, 75, blockSize, blockSize);
				rect(25, 100, blockSize, blockSize);
				fillColor.tan();
				rect(125, 50, blockSize, blockSize);
				rect(125, 75, blockSize, blockSize);
				rect(125, 100, blockSize, blockSize);
				rect(150, 75, blockSize, blockSize);
				rect(150, 100, blockSize, blockSize);
				rect(150, 125, blockSize, blockSize);
				rect(175, 100, blockSize, blockSize);
				rect(175, 125, blockSize, blockSize);
				rect(175, 150, blockSize, blockSize);
				rect(200, 150, blockSize, blockSize);
				rect(225, 150, blockSize, blockSize);
				rect(225, 125, blockSize, blockSize);
				rect(225, 100, blockSize, blockSize);
				rect(225, 175, blockSize, blockSize);
				rect(250, 175, blockSize, blockSize);
				rect(275, 175, blockSize, blockSize);
				rect(300, 175, blockSize, blockSize);
				rect(300, 150, blockSize, blockSize);
				rect(300, 125, blockSize, blockSize);
				rect(300, 100, blockSize, blockSize);
				rect(250, 100, blockSize, blockSize);
				rect(250, 150, blockSize, blockSize);
				rect(250, 125, blockSize, blockSize);
				rect(275, 150, blockSize, blockSize);
				rect(275, 200, blockSize, blockSize);
				rect(300, 200, blockSize, blockSize);
				rect(275, 225, blockSize, blockSize);
				rect(300, 225, blockSize, blockSize);
				rect(325, 200, blockSize, blockSize);
				rect(325, 175, blockSize, blockSize);
				rect(325, 125, blockSize, blockSize);
				rect(350, 125, blockSize, blockSize);
				fillColor.brown();
				rect(275, 125, blockSize, blockSize);
				rect(200, 125, blockSize, blockSize);
				rect(200, 100, blockSize, blockSize);
				rect(200, 75, blockSize, blockSize);
				rect(200, 50, blockSize, blockSize);
				rect(175, 75, blockSize, blockSize);
				rect(225, 75, blockSize, blockSize);
				rect(225, 50, blockSize, blockSize);
				rect(225, 25, blockSize, blockSize);
				rect(250, 25, blockSize, blockSize);
				rect(275, 25, blockSize, blockSize);
				rect(300, 25, blockSize, blockSize);
				rect(250, 50, blockSize, blockSize);
				rect(275, 50, blockSize, blockSize);
				rect(300, 50, blockSize, blockSize);
				rect(325, 50, blockSize, blockSize);
				rect(300, 75, blockSize, blockSize);
				rect(275, 75, blockSize, blockSize);
				rect(250, 75, blockSize, blockSize);
				rect(100, 125, blockSize, blockSize);
				rect(100, 150, blockSize, blockSize);
				rect(125, 150, blockSize, blockSize);
				rect(150, 150, blockSize, blockSize);
				rect(125, 125, blockSize, blockSize);
				rect(225, 200, blockSize, blockSize);
				rect(250, 200, blockSize, blockSize);
				rect(250, 225, blockSize, blockSize);
				rect(250, 250, blockSize, blockSize);
				rect(225, 250, blockSize, blockSize);
				rect(225, 225, blockSize, blockSize);
				rect(200, 200, blockSize, blockSize);
				rect(200, 225, blockSize, blockSize);
				rect(200, 250, blockSize, blockSize);
				rect(175, 250, blockSize, blockSize);
				rect(175, 275, blockSize, blockSize);
				rect(175, 225, blockSize, blockSize);
				rect(175, 200, blockSize, blockSize);
				rect(150, 200, blockSize, blockSize);
				rect(150, 225, blockSize, blockSize);
				rect(150, 250, blockSize, blockSize);
				rect(150, 275, blockSize, blockSize);
				rect(125, 275, blockSize, blockSize);
				rect(125, 250, blockSize, blockSize);
				rect(125, 225, blockSize, blockSize);
				rect(125, 200, blockSize, blockSize);
				rect(100, 225, blockSize, blockSize);
				rect(100, 250, blockSize, blockSize);
				rect(200, 300, blockSize, blockSize);
				rect(225, 300, blockSize, blockSize);
				rect(250, 300, blockSize, blockSize);
				rect(275, 300, blockSize, blockSize);
				rect(300, 300, blockSize, blockSize);
				rect(300, 275, blockSize, blockSize);
				rect(275, 275, blockSize, blockSize);
				fillColor.green();
				rect(200, 175, blockSize, blockSize);
				rect(175, 175, blockSize, blockSize);
				rect(150, 175, blockSize, blockSize);
				rect(125, 175, blockSize, blockSize);
				rect(100, 175, blockSize, blockSize);
				rect(100, 200, blockSize, blockSize);
				rect(75, 200, blockSize, blockSize);
				rect(75, 225, blockSize, blockSize);
				rect(75, 250, blockSize, blockSize);
				rect(50, 250, blockSize, blockSize);
				rect(25, 275, blockSize, blockSize);
				rect(50, 275, blockSize, blockSize);
				rect(75, 275, blockSize, blockSize);
				rect(100, 275, blockSize, blockSize);
				rect(50, 300, blockSize, blockSize);
				rect(75, 300, blockSize, blockSize);
				rect(100, 300, blockSize, blockSize);
				rect(125, 300, blockSize, blockSize);
				rect(150, 300, blockSize, blockSize);
				rect(175, 300, blockSize, blockSize);
				rect(75, 325, blockSize, blockSize);
				rect(100, 325, blockSize, blockSize);
				rect(125, 325, blockSize, blockSize);
				rect(150, 325, blockSize, blockSize);
				rect(175, 325, blockSize, blockSize);
				rect(200, 325, blockSize, blockSize);
				rect(225, 325, blockSize, blockSize);
				rect(250, 325, blockSize, blockSize);
				rect(275, 325, blockSize, blockSize);
				rect(275, 250, blockSize, blockSize);
				rect(200, 275, blockSize, blockSize);
				rect(225, 275, blockSize, blockSize);
				rect(250, 275, blockSize, blockSize);
				fillColor.brown();
				rect(0, 300, blockSize, blockSize);
				rect(25, 300, blockSize, blockSize);
				rect(25, 325, blockSize, blockSize);
				rect(0, 325, blockSize, blockSize);
				rect(25, 350, blockSize, blockSize);
				rect(50, 350, blockSize, blockSize);
				rect(75, 350, blockSize, blockSize);
				rect(50, 325, blockSize, blockSize);
				rect(300, 325, blockSize, blockSize);
				rect(325, 325, blockSize, blockSize);
				rect(275, 350, blockSize, blockSize);
				rect(300, 350, blockSize, blockSize);
				rect(325, 350, blockSize, blockSize);
				rect(350, 350, blockSize, blockSize);
				fillColor.green();
				rect(275, 100, blockSize, blockSize);
				popMatrix();
			};
		}
		this.facing = function() {
			switch (direction) {
				case "down":
					this.frame1_1();
					break;
				case "left":
					this.frame2_1();
					break;
				case "up":
					this.frame3_1();
					break;
				case "right":
					this.frame4_2();
					break;
			}
		};
		this.moving = function() {
			switch (direction) {
				case "down":
					this.frame1_2();
					break;
				case "left":
					this.frame2_2();
					break;
				case "up":
					this.frame3_2();
					break;
				case "right":
					this.frame4_1();
					break;
			}
		};
		this.attack = function() {
			this.frame1_3();
			switch (direction) {
				case "down":
					if (find(this.items, "sword") && this.currentItem === "sword") {
						this.sword = new swordObj(this.position.x, this.position.y + 28, 0.092, 180);
						this.sword.frame();
						if (!this.projectiles.length && hp === maxHp) {
							this.projectiles.unshift(new swordObj(this.position.x, this.position.y + 28, 0.092, 180));
						}
					}
					if (find(this.items, "bow") && this.currentItem === "bow") {
						this.bow = new bowObj(this.position.x, this.position.y + 15, 0.092, 90).frame();
						if (!this.projectiles.length && arrowCount) {
							this.projectiles.unshift(new arrowObj(this.position.x, this.position.y + 15, 0.092, 180));
							arrowCount--;
						}
					}
					if (find(this.items, "rod") && this.currentItem === "rod") {
						this.rod = new rodObj(this.position.x, this.position.y + 25, 0.092, 180).frame();
						if (!this.projectiles.length && magic) {
							this.projectiles.unshift(new fireballObj(this.position.x, this.position.y, 0.080, 180));
							magic--;
							magicMeter.currFrame = frameCount;
						}
					}
					this.frame1_3();
					break;
				case "left":
					if (find(this.items, "sword") && this.currentItem === "sword") {
						this.sword = new swordObj(this.position.x - 28, this.position.y, 0.092, 270);
						this.sword.frame();
						if (!this.projectiles.length && hp === maxHp) {
							this.projectiles.unshift(new swordObj(this.position.x - 28, this.position.y, 0.092, 270));
						}
					}
					if (find(this.items, "bow") && this.currentItem === "bow") {
						this.bow = new bowObj(this.position.x - 15, this.position.y, 0.092, 180).frame();
						if (!this.projectiles.length && arrowCount) {
							this.projectiles.unshift(new arrowObj(this.position.x - 15, this.position.y, 0.092, 270));
							arrowCount--;
						}
					}
					if (find(this.items, "rod") && this.currentItem === "rod") {
						this.rod = new rodObj(this.position.x - 25, this.position.y, 0.092, 270).frame();
						if (!this.projectiles.length && magic) {
							this.projectiles.unshift(new fireballObj(this.position.x, this.position.y, 0.080, 270));
							magic--;
							magicMeter.currFrame = frameCount;
						}
					}
					this.frame2_3();
					break;
				case "up":
					if (find(this.items, "sword") && this.currentItem === "sword") {
						this.sword = new swordObj(this.position.x, this.position.y - 28, 0.092, 0);
						this.sword.frame();
						if (!this.projectiles.length && hp === maxHp) {
							this.projectiles.unshift(new swordObj(this.position.x, this.position.y - 28, 0.092, 0));
						}
					}
					if (find(this.items, "bow") && this.currentItem === "bow") {
						this.bow = new bowObj(this.position.x, this.position.y - 15, 0.092, 270).frame();
						if (!this.projectiles.length && arrowCount) {
							this.projectiles.unshift(new arrowObj(this.position.x, this.position.y - 15, 0.092, 0));
							arrowCount--;
						}
					}
					if (find(this.items, "rod") && this.currentItem === "rod") {
						this.rod = new rodObj(this.position.x, this.position.y - 25, 0.092, 0).frame();
						if (!this.projectiles.length && magic) {
							this.projectiles.unshift(new fireballObj(this.position.x, this.position.y, 0.080, 0));
							magic--;
							magicMeter.currFrame = frameCount;
						}
					}
					this.frame3_3();
					break;
				case "right":
					if (find(this.items, "sword") && this.currentItem === "sword") {
						this.sword = new swordObj(this.position.x + 28, this.position.y, 0.092, 90);
						this.sword.frame();
						if (!this.projectiles.length && hp === maxHp) {
							this.projectiles.unshift(new swordObj(this.position.x + 28, this.position.y, 0.092, 90));
						}
						this.sword.frame();
					}
					if (find(this.items, "bow") && this.currentItem === "bow") {
						this.bow = new bowObj(this.position.x + 15, this.position.y, 0.092, 0).frame();
						if (!this.projectiles.length && arrowCount) {
							this.projectiles.unshift(new arrowObj(this.position.x + 15, this.position.y, 0.092, 90));
							arrowCount--;
						}
					}
					if (find(this.items, "rod") && this.currentItem === "rod") {
						this.rod = new rodObj(this.position.x + 25, this.position.y, 0.092, 90).frame();
						if (!this.projectiles.length && magic) {
							this.projectiles.unshift(new fireballObj(this.position.x, this.position.y, 0.080, 90));
							magic--;
							magicMeter.currFrame = frameCount;
						}
					}
					this.frame4_3();
					break;

			}
		};
		this.draw = function() {
			if (this.atk === 0) {
				switch (this.frame) {
					case 0:
						this.facing();
						break;
					case 1:
					case 2:
						this.moving();
						break;
					default:
						this.facing();
						break;
				}
			} else if (this.frame === 0) {
				switch (this.atk) {
					case 0:
						break;
					case 1:
					case 2:
						this.attack();
						break;
					default:
						this.facing();
						break;
				}
			} else {
				this.facing();
			}
			if (this.frame > 2) {
				this.frame = 0;
			}
			if (this.currFrame < (frameCount - 7)) {
				this.currFrame = frameCount;
				if (this.atk > 0) {
					this.atk = 0;
					this.currentItem = null;
				}
			}
		};
		this.drawProjectiles = function() {
			for (var i = 0; i < this.projectiles.length; i++) {
				this.projectiles[i].draw();
			}
		};
	};
	var sandObj = function(x, y, s) {
		this.position = new PVector(x, y);
		var blockSize = 25;
		this.draw = function() {
			pushMatrix();
			//scale(s);
			translate(this.position.x, this.position.y);
			scale(s);
			fillColor.sand();
			rect(0, 0, width, height);
			fillColor.rock();
			rect(375, 0, blockSize, blockSize);
			rect(300, 25, blockSize, blockSize);
			rect(325, 125, blockSize, blockSize);
			rect(275, 200, blockSize, blockSize);
			rect(350, 275, blockSize, blockSize);
			rect(275, 300, blockSize, blockSize);
			rect(225, 375, blockSize, blockSize);
			rect(150, 325, blockSize, blockSize);
			rect(75, 375, blockSize, blockSize);
			rect(0, 325, blockSize, blockSize);
			rect(50, 250, blockSize, blockSize);
			rect(100, 175, blockSize, blockSize);
			rect(25, 125, blockSize, blockSize);
			rect(50, 50, blockSize, blockSize);
			rect(150, 75, blockSize, blockSize);
			rect(225, 100, blockSize, blockSize);
			rect(175, 225, blockSize, blockSize);
			popMatrix();
			popMatrix();
		};
	};
	var player = new playerObj(180, 250, 0.092);
	var currentItems = function() {
		this.Z = null;
		this.X = null;
		this.draw = function() {
			life();
			magicMeter.update();
			if (find(player.items, "sword")) {
				if (this.Z === "sword") {
					var itemSword = new swordObj(160, 18, 0.08, 0).frame();
				}
				if (this.X === "sword") {
					var itemSword = new swordObj(200, 18, 0.08, 0).frame();
				}
			}
			if (find(player.items, "bow")) {
				if (this.Z === "bow") {
					var itemSword = new bowObj(160, 18, 0.08, 0).frame();
				}
				if (this.X === "bow") {
					var itemSword = new bowObj(200, 18, 0.08, 0).frame();
				}
			}
			if (find(player.items, "rod")) {
				if (this.Z === "rod") {
					var itemRod = new rodObj(160, 18, 0.08, 0).frame();
				}
				if (this.X === "rod") {
					var itemRod = new rodObj(200, 18, 0.08, 0).frame();
				}
			}
			var rupee = new rupeeObj(115, 20, 1).draw();
			var arrow = new arrowObj(112, 25, 0.045, 30).frame();
			noFill();
			stroke(1, 100, 255);
			rect(160, 15, 30, 40, 5);
			rect(200, 15, 30, 40, 5);
			textFont(serif, 15);
			fillColor.white();
			text("x" + rupeeCount, 122, 25);
			text("x" + arrowCount, 122, 45);
			text("Z", 172, 59);
			text("X", 211, 59);
			noFill();
			rect(8, 11, 27, 15, 10);
			text("Ctrl", 10, 24);
			fill(255, 255, 255);
			for (var i = 0; i < 7; i++) {
				for (var j = 0; j < 6; j++) {
					stroke(0);
					fill(255, 255, 255);
					rect(i * 5 + 12, j * 5 + 35, 5, 5);
					if (i === miniMap.x && j === miniMap.y) {
						fillColor.red();
						rect(i * 5 + 12, j * 5 + 35, 5, 5);
					}
				}
			}
			noStroke();
		};
	};
	var items = new currentItems();
	var pauseMenu = function() {
		this.x = 0;
		this.draw = function() {
			background(0, 0, 0);
			pushMatrix();
			translate(0, 320);
			items.draw();
			popMatrix();
			textFont(serif, 40);
			fillColor.darkRed();
			text("INVENTORY", 85, 115);
			textFont(serif, 15);
			fillColor.white();
			text("PRESS Z OR X TO CHANGE", 100, 225);
			text("ITEM ON Z OR X", 132, 242);
			noFill();
			for (var i = 0; i < 4; i++) {
				stroke(1, 100, 255);
				rect(75 + i * 70, 150, 40, 40, 5);
			}
			if (this.x < 0) {
				this.x = 4;
			}
			if (this.x > 3) {
				this.x = 0;
			}
			stroke(255);
			rect(75 + this.x * 70, 150, 40, 40, 5);
			if (find(player.items, "sword")) {
				var inventorySword = new swordObj(80, 155, 0.08, 0).frame();
			}
			if (find(player.items, "bow")) {
				var inventoryBow = new bowObj(155, 155, 0.08, 0).frame();
			}
			if (find(player.items, "rod")) {
				var inventoryRod = new rodObj(220, 155, 0.08, 0).frame();
			}
			if (find(player.items, "boomerang")) {
				var inventoryBoomerang = new swordObj(290, 155, 0.08, 0).frame();
			}
		};
	};
	var gameOver = new gameOverMenu();
	var pause = new pauseMenu();
	var drawTitleLeaves = function() {
		if (leafs.length < 20) {
			leafs.push(new leafObj(-50, 0));
			leafs.push(new leafObj(-50, random(50, 300)));
			leafs.push(new leafObj(-50, random(50, 300)));
		}
		for (var i = 0; i < leafs.length; i++) {
			if ((leafs[i].timeLeft > 0) && (leafs[i].position.y < 500)) {
				leafs[i].draw();
				leafs[i].move();
				leafs[i].angle += i / 40;
			} else {
				leafs.splice(i, 1);
			}
		}
	};
	var drawTitleWaterfall = function() {
		if (waterfall.length < 400) {
			waterfall.push(new waterfallObj(random(180, 190), 315));
			waterfall.push(new waterfallObj(random(180, 190), 315));
			waterfall.push(new waterfallObj(random(170, 180), 315));
			waterfall.push(new waterfallObj(random(170, 180), 315));
			waterfall.push(new waterfallObj(random(190, 200), 315));
			waterfall.push(new waterfallObj(random(190, 200), 315));
		}
		for (var i = 0; i < waterfall.length; i++) {
			if ((waterfall[i].timeLeft > 0) && (waterfall[i].position.y < 400)) {
				waterfall[i].draw();
				waterfall[i].move();
			} else {
				waterfall.splice(i, 1);
			}
		}

	};
	var paused = false;
	keyPressed = function() {
		if (state === "title" && keyCode) {
			state = "name";
		}
		if (state === "name") {
			if (keyCode === 8) {
				name = name.substring(0, name.length - 1);
			}
			if (name.length > 0 && keyCode === ENTER) {
				state = "overworld";
			}
			if (name.length < 8) {
				if (keyCode === 16) {
					name += chars[keyCode];
					name = name.substring(0, name.length - 5);
				} else if (keyCode === 188) {
					name += ",";
				} else if (keyCode === 190) {
					name += ".";
				} else if (keyCode === 173) {
					name += "-";
				} else if (keyCode === 222) {
					name += "'";
				} else if (keyCode >= 48 && keyCode <= 58 || keyCode >= 65 && keyCode <= 90) {
					name += chars[keyCode];
				}
			}
		}
		if (state === "gameover") {
			if (keyCode === UP || keyCode === DOWN) {
				if (gameOver.y === 178) {
					gameOver.y = 205;
				} else {
					gameOver.y = 178;
				}
				//gameOverMenu();
			}
			if (keyCode === 32 || keyCode === ENTER) {
				if (gameOver.y === 178) {
					state = "overworld";
				} else {
					Program.restart();
				}
				hp = 6;
			}
		}
		if (state === "end" && keyCode) {
			Program.restart();
		}
		if (state === "pause") {
			if (keyCode === RIGHT) {
				pause.x++;
			}
			if (keyCode === LEFT) {
				pause.x--;
			}
			if (keyCode === 17 && paused) {
				state = prevState;
			}
			if (pause.x === 0 && find(player.items, "sword")) {
				if (keyCode === 88) {
					if (items.Z === "sword") {
						items.Z = null;
					}
					items.X = "sword";
				}
				if (keyCode === 90) {
					if (items.X === "sword") {
						items.X = null;
					}
					items.Z = "sword";
				}
			}
			if (pause.x === 1 && find(player.items, "bow")) {
				if (keyCode === 88) {
					if (items.Z === "bow") {
						items.Z = null;
					}
					items.X = "bow";
				}
				if (keyCode === 90) {
					if (items.X === "bow") {
						items.X = null;
					}
					items.Z = "bow";
				}
			}
			if (pause.x === 2 && find(player.items, "rod")) {
				if (keyCode === 88) {
					if (items.Z === "rod") {
						items.Z = null;
					}
					items.X = "rod";
				}
				if (keyCode === 90) {
					if (items.X === "rod") {
						items.X = null;
					}
					items.Z = "rod";
				}
			}
			if (pause.x === 3 && find(player.items, "boomerang")) {
				if (keyCode === 88) {
					if (items.Z === "boomerang") {
						items.Z = null;
					}
					items.X = "bow";
				}
				if (keyCode === 90) {
					if (items.X === "boomerang") {
						items.X = null;
					}
					items.Z = "bow";
				}
			}
		}
		if (state === "overworld" || state === "dungeon") {
			if (player.atk === 0) {
				if (keyCode === DOWN) {
					if (player.collide !== "down") {
						direction = "down";
						player.position.y += 3;
						player.frame++;
						player.collide = null;
					}
				}
				if (keyCode === LEFT) {
					if (player.collide !== "left") {
						direction = "left";
						player.position.x -= 3;
						player.frame++;
						player.collide = null;
					}
				}
				if (keyCode === UP) {
					if (player.collide !== "up") {
						direction = "up";
						player.position.y -= 3;
						player.frame++;
						player.collide = null;
					}
				}
				if (keyCode === RIGHT) {
					if (player.collide !== "right") {
						direction = "right";
						player.position.x += 3;
						player.frame++;
						player.collide = null;
					}

				}
				if (keyCode === 17 && !paused) {
					prevState = state;
					state = "pause";
				}
			}
			if (keyCode === 90) {
				player.currentItem = items.Z;
				player.atk++;
			}
			if (keyCode === 88) {
				player.currentItem = items.X;
				player.atk++;
			}
		}
	};
	var keyReleased = function() {
		if (state === "overworld" || state === "dungeon") {
			if (keyCode === DOWN || keyCode === LEFT || keyCode === UP || keyCode === RIGHT) {
				player.frame = 0;
			}
			if (keyCode === 17) {
				paused = false;
			}
		}
		if (state === "pause") {
			if (keyCode === 17) {
				paused = true;
			}
		}
	};

	var heartContainerObj = function(x, y) {
		this.x = x;
		this.y = y;
		this.draw = function() {
			pushMatrix();
			translate(this.x - 1, this.y);
			scale(0.6, 0.5);
			strokeWeight(5);
			stroke(189, 151, 13);
			drawFullHeart();
			popMatrix();
		};

	};

	var heartObj = function(x, y) {
		this.x = x;
		this.y = y;
		this.draw = function() {
			pushMatrix();
			translate(this.x - 1, this.y);
			scale(0.3, 0.25);
			drawFullHeart();
			popMatrix();
		};

	};

	var dropChance = function(x, y) {
		var i = random(0, 10);
		if (i < 3) {
			hearts.unshift(new heartObj(x + 30, y + 5));
		}
		if (i >= 3 && i < 5) {
			rupees.unshift(new rupeeObj(x + 10, y, 1.5));
		}
		if (i >= 5 && i < 6) {
			arrows.unshift(new arrowObj(x + 5, y - 2, 0.08, 30));
		}
	};

	var container1 = 0;
	var container2 = 0;
	var container3 = 0;
	var drawBackground = function() {
		if (newMap) {
			newMap = false;
			miniMap.initTilemaps();
		}
		background(238, 226, 168);
		for (var i = 0; i < rocks.length; i++) {
			rocks[i].draw();
		}
		for (var i = 0; i < sand.length; i++) {
			sand[i].draw();
		}
		for (var i = 0; i < spiders.length; i++) {
			if (spiders[i]) {
				spiders[i].draw();
			}
		}
		for (var i = 0; i < hearts.length; i++) {
			hearts[i].draw();
		}
		for (var i = 0; i < rupees.length; i++) {
			rupees[i].draw();
		}
		for (var i = 0; i < arrows.length; i++) {
			arrows[i].frame();
		}
		if (miniMap.x === 3 && miniMap.y === 3 && !find(player.items, "sword")) {
			var sword = new swordObj(180, 180, 0.092, 180);
			sword.frame();
			if (dist(player.position.x, player.position.y, 189, 175) < 22) {
				player.items.push("sword");
				items.Z = "sword";
			}
		}
		if (miniMap.x === 3 && miniMap.y === 1 && !find(player.items, "rod")) {
			var rod = new rodObj(180, 180, 0.092, 0);
			rod.frame();
			if (dist(player.position.x, player.position.y, 180, 180) < 22) {
				player.items.push("rod");
			}
		}
		if (miniMap.x === 3 && miniMap.y === 4 && !find(player.items, "bow")) {
			var bow = new bowObj(180, 180, 0.092, 0);
			bow.frame();
			if (dist(player.position.x, player.position.y, 180, 180) < 22) {
				player.items.push("bow");
			}
		}
		if (miniMap.x === 0 && miniMap.y === 0 && !container1) {
			var container = new heartContainerObj(180, 180);
			container.draw();
			if (dist(player.position.x, player.position.y, 180, 180) < 22) {
				maxHp += 2;
				hp = maxHp;
				container1 = 1;
			}
		}
		if (miniMap.x === 6 && miniMap.y === 0 && !container2) {
			var container = new heartContainerObj(200, 200);
			container.draw();
			if (dist(player.position.x, player.position.y, 200, 200) < 22) {
				maxHp += 2;
				hp = maxHp;
				container2 = 1;
			}
		}

		if (miniMap.x === 4 && miniMap.y === 3 && !container3) {
			var container = new heartContainerObj(150, 280);
			container.draw();
			if (dist(player.position.x, player.position.y, 150, 280) < 22) {
				maxHp += 2;
				hp = maxHp;
				container3 = 1;
			}
		}
		if (miniMap.x === 3 && miniMap.y === 5) {
			pushMatrix();
			translate(190, 194);
			drawTriforce();
			popMatrix();
			if (dist(player.position.x, player.position.y, 189, 175) < 22) {
				state = "end";
			}
		}
	};

	var mapReset = function() {
		sand = [];
		rocks = [];
		rupees = [];
		spiders = [];
		newMap = true;
	};
	var mapTransition = function() {
		if (player.position.y < 76) {
			mapReset();
			miniMap.killed = 0;
			miniMap.y--;
			player.position.y = 374;
		}
		if (player.position.y > 374) {
			mapReset();
			miniMap.killed = 0;
			miniMap.y++;
			player.position.y = 76;
		}
		if (player.position.x > 368) {
			mapReset();
			miniMap.killed = 0;
			miniMap.x++;
			player.position.x = -2;
		}
		if (player.position.x < -2) {
			mapReset();
			miniMap.killed = 0;
			miniMap.x--;
			player.position.x = 368;
		}

		//loop
		if (miniMap.x < 0) {
			miniMap.x = 6;
		}
		if (miniMap.x > 6) {
			miniMap.x = 0;
		}
		if (miniMap.y < 0) {
			miniMap.y = 5;
		}
		if (miniMap.y > 5) {
			miniMap.y = 0;
		}

	};


	var iFrames = frameCount;
	var collision = function() {
		for (var i = 0; i < hearts.length; i++) {
			if (dist(player.position.x, player.position.y, hearts[i].x, hearts[i].y) < 22) {
				if (hp < maxHp - 1) {
					hp += 2;
				} else if (hp < maxHp) {
					hp++;
				}
				hearts.splice(i, 1);
			}
		}
		for (var i = 0; i < rupees.length; i++) {
			if (dist(player.position.x, player.position.y, rupees[i].x - 2, rupees[i].y - 25) < 22) {
				if (rupeeCount < 99) {
					rupeeCount++;
				}
				rupees.splice(i, 1);
			}
		}
		for (var i = 0; i < arrows.length; i++) {
			if (dist(player.position.x, player.position.y, arrows[i].position.x - 11, arrows[i].position.y) < 22) {
				arrowCount += 5;
				if (arrowCount > 99) {
					arrowCount = 99;
				}
				arrows.splice(i, 1);
			}
		}
		for (var i = 0; i < spiders.length; i++) {
			if (dist(player.position.x, player.position.y, spiders[i].position.x, spiders[i].position.y) < 22) {
				if (frameCount > iFrames + 10) {
					hp--;
					iFrames = frameCount;
				}
			}
			if (player.atk && dist(player.sword.position.x, player.sword.position.y, spiders[i].position.x, spiders[i].position.y) < 22) {
				dropChance(spiders[i].position.x, spiders[i].position.y);
				spiders.splice(i, 1);
				miniMap.killed++;
			}
			if (player.projectiles.length) {
				if (dist(player.projectiles[0].position.x, player.projectiles[0].position.y, spiders[i].position.x, spiders[i].position.y) < 22) {
					dropChance(spiders[i].position.x, spiders[i].position.y);
					spiders.splice(i, 1);
					miniMap.killed++;
					player.projectiles[0].collision = true;
				}
			}
		}
		for (var i = 0; i < rocks.length; i++) {
			if (direction === "up") {
				if (dist(player.position.x, player.position.y, rocks[i].position.x, rocks[i].position.y) < 22) {
					player.collide = direction;
				}
			}
			if (direction === "down") {
				if (dist(player.position.x, player.position.y, rocks[i].position.x, rocks[i].position.y - 25) < 22) {
					player.collide = direction;
				}

			}
			if (direction === "left") {
				if (dist(player.position.x - 9, player.position.y, rocks[i].position.x, rocks[i].position.y) < 22) {
					player.collide = direction;
				}
			}
			if (direction === "right") {
				if (dist(player.position.x + 10, player.position.y, rocks[i].position.x, rocks[i].position.y) < 22) {
					player.collide = direction;
				}
			}
		}
	};

	var draw = function() {
		switch (state) {
			case "title":
				background(0, 178, 255);
				drawTitleLeaves();
				drawRange(100);
				drawRange(50);
				drawTitleWaterfall();
				drawTitle(titlePosition);
				break;
			case "name":
				drawName();
				break;
			case "overworld":
			case "dungeon":
				drawBackground();
				player.drawProjectiles();
				items.draw();
				player.draw();
				collision();
				mapTransition();
				break;
			case "pause":
				pause.draw();
				break;
			case "end":
				end();
				break;
			case "gameover":
				gameOver.draw();
				break;
		}
	};


};
