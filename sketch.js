var bg_img, bg1, bg2;
var playButton, aboutButton;
var gameState = "wait";
var player, player_img;
var enemy1img, enemy2img, enemyGroup, enemyGroupLevel2;
var arrow, arrow_img, arrowGroup;
var levelUp;
var numberOfArrows = 15;
var tiger1, tiger2, bird1, bird2, bird3, enemy2Group;
var score = 0;
var dragon, dragon_img;
var fire, fire_img, fireGroup;
var shootSound, checkPointSound, dieSound, winSound, fireSound, dragonSound;

function preload() {
    bg_img = loadImage("assets/Jungle.gif");
    bg1 = loadImage("assets/background-4.jpg")
    bg2 = loadImage("assets/background-5.png")
    player_img = loadImage("assets/bow.png")
    enemy1img = loadImage("assets/dragon.png")
    enemy2img = loadImage("assets/eagle.png")
    arrow_img = loadImage("assets/arrow1.png")
    levelUp = loadImage("assets/levelUp.png")
    tiger1 = loadImage("assets/Tiger1.png")
    tiger2 = loadImage("assets/Tiger2.png")
    bird1 = loadImage("assets/bird1.png")
    bird2 = loadImage("assets/bird2.png")
    bird3 = loadImage("assets/bird3.png")
    dragon_img = loadImage("assets/dragon1.png")
    fire_img = loadImage("assets/fire.png")
    shootSound = loadSound("assets/shoot.mp3")
    dieSound = loadSound("assets/die.mp3")
    checkPointSound = loadSound("assets/checkpoint.mp3")
    winSound = loadSound("assets/twinkle.mp3")
    fireSound = loadSound("assets/fire.mp3")
    dragonSound = loadSound("assets/dragon.mp3")


}



function setup() {
    createCanvas(windowWidth, windowHeight)
    playButton = createImg("assets/play_button.png");
    playButton.position(990, 500);
    playButton.size(300, 140);
    playButton.hide();

    aboutButton = createImg("assets/about_button.png");
    aboutButton.position(240, 500);
    aboutButton.size(300, 145);
    aboutButton.hide();

    player = createSprite(100, 490);
    player.addImage("main", player_img);
    //player.debug=true;
    player.setCollider("rectangle", 0, 0, 150, 200)
    player.scale = 0.6;
    player.visible = false;

    dragon = createSprite(900, 500);
    dragon.addImage(dragon_img);
    //dragon.debug=true;
    dragon.setCollider("rectangle", 0, 0, 200, 200)
    //dragon.scale = 0.6;
    dragon.visible = false;

    enemyGroup = new Group();
    arrowGroup = new Group();
    fireGroup = new Group();
    enemyGroupLevel2 = new Group();



}

function draw() {
    if (gameState == "wait") {
        background(bg_img)
        playButton.show()
        aboutButton.show()


        aboutButton.mousePressed(() => {
            playButton.hide();
            aboutButton.hide();
            gameState = "about";
        })

        playButton.mousePressed(() => {
            playButton.hide();
            aboutButton.hide();
            gameState = "play";
        })
    }

    if (gameState == "about") {
        aboutGame();

    }

    if (gameState == "play") {
        background(bg1);
        player.visible = true;
        spawnEnemies();
        movement();

        for (var i = 0; i < enemyGroup.length; i++) {
            if (arrowGroup.isTouching(enemyGroup.get(i))) {
                score += 5;
                enemyGroup.get(i).remove()
                arrowGroup.destroyEach()
            }
        }

        for (var i = 0; i < enemyGroup.length; i++) {
            if (player.isTouching(enemyGroup.get(i))) {
                score -= 2;
                dieSound.play();
                player.visible = false;
                enemyGroup.get(i).remove();
                gameState = "die"
            }
        }
        if (gameState == "die") {

            gameState = "play"
        }

        if (score >= 20 && numberOfArrows > 0) {
            gameState = "nextlevelinfo"
            arrowGroup.destroyEach()
            player.visible = false
            enemyGroup.destroyEach()

        }

        if (gameState == "nextlevelinfo") {
            checkPointSound.play();
            nextlevelpopup();

        }

        if (numberOfArrows == 0) {
            gameState = "gameOver"
        }

        if (gameState == "gameOver") {
            dieSound.play();
            enemyGroup.destroyEach();
            arrowGroup.destroyEach();
            player.visible = false;
            fireGroup.destroyEach();
            dragon.visible = false;
            gameOver();
        }


    }

    if (gameState == "level2") {
        // score=0;
        // numberOfArrows=5;
        background(bg2);
        player.visible = true;
        spawnEnemiesLevel2();

        movement();

        for (var i = 0; i < enemyGroupLevel2.length; i++) {
            if (arrowGroup.isTouching(enemyGroupLevel2.get(i))) {
                score += 5;
                enemyGroupLevel2.get(i).remove()
                arrowGroup.destroyEach()
            }
        }

        //  if(score>=10)
        //  {
        //     numberOfArrows=5;
        //  }

        for (var i = 0; i < enemyGroupLevel2.length; i++) {
            if (player.isTouching(enemyGroupLevel2.get(i))) {
                score -= 2;
                dieSound.play();
                player.visible = false;
                enemyGroupLevel2.get(i).remove();
                gameState = "die"
            }
        }
        if (gameState == "die") {

            gameState = "level2"
        }

        if (score >= 50 && numberOfArrows > 0) {

            dragon.visible = true;
            dragonMovement();

            spawnFire();
            
            enemyGroupLevel2.destroyEach();

            for (var i = 0; i < fireGroup.length; i++) {
                if (player.isTouching(fireGroup.get(i))) {
                    //score-= 5
                    fireGroup.get(i).remove();
                    gameState = "gameOver";

                }
            }

            if (gameState == "gameOver") {
                dieSound.play();
                enemyGroupLevel2.destroyEach();
                arrowGroup.destroyEach();
                player.visible = false;
                fireGroup.destroyEach();
                dragon.visible = false;
                gameOver();
            }

            for (var i = 0; i < arrowGroup.length; i++) {
                if (arrowGroup.isTouching(dragon)) {
                    score += 100;
                    dragon.remove()
                    gameState = "win";
                }

                if (gameState == "win") {
                    winSound.play();
                    arrowGroup.destroyEach()
                    fireGroup.destroyEach();
                    player.visible = false;
                    enemyGroupLevel2.destroyEach();
                    dragon.visible = false;
                    win();
                }


            }



        }



        if (numberOfArrows == 0) {
            gameState = "gameOver"

        }

        if (gameState == "gameOver") {
            dieSound.play();
            enemyGroupLevel2.destroyEach();
            arrowGroup.destroyEach();
            player.visible = false;
            fireGroup.destroyEach();
            dragon.visible = false;
            gameOver();
        }




    }
    drawSprites()

    if (gameState == "play" || gameState == "level2") {
        fill(255);
        textSize(25);
        text("SCORE: " + score, 50, 50);

        fill("#FFFF");
        textAlign("center");
        textSize(30);
        text("Remaining Arrows : " + numberOfArrows, 200, 100);



    }


}



function aboutGame() {
    swal({
        title: "About Game = How to Play!!",
        text: "Protect the Jungle from dangerous predators.\n Make a score of 20 to reach level2 .\n Use Arrow keys to move up and down and Space bar to release arrows.",
        textAlign: "center",
        imageUrl: "assets/Jungle1.gif",
        imageSize: "250x250",
        confirmButtonText: "Let's kill the enemy!",
        confirmButtonColor: "brown",
    },
        function () {
            gameState = "wait"
        }
    )
}

function spawnEnemies() {
    if (frameCount % 80 == 0) {
        var randy = Math.round(random(80, 530))
        enemy = createSprite(width, randy);
        enemy.scale = 0.3
        enemy.velocityX = -10;

        var randimg = Math.round(random(1, 2))
        switch (randimg) {

            case 1:

                enemy.addImage(enemy1img)
                enemy.setCollider("rectangle", 0, 0, 250, 300)
                break;

            case 2:
                enemy.addImage(enemy2img)
                enemy.setCollider("rectangle", 0, 0, enemy.width, enemy.height)
                break;

            default: break;

        }


        enemyGroup.add(enemy);



    }
}

function movement() {

    if (player.y <= 10) {
        player.y = 10
    }

    if (player.y >= 525) {
        player.y = 525
    }

    if (keyDown("UP_ARROW")) {
        player.y = player.y - 5;
    }

    if (keyDown("DOWN_ARROW")) {
        player.y = player.y + 5;
    }

}

function spawnArrows() {

    arrow = createSprite(player.x + 3, player.y + 10, 20, 20);
    arrow.addImage(arrow_img);
    arrow.scale = 0.5;
    arrow.velocityX = 10;

    arrow.depth = player.depth;
    player.depth = player.depth + 1;

    arrowGroup.add(arrow);


}

function spawnFire() {
    if (frameCount % 100 == 0) {

        fire = createSprite(dragon.x + 3, dragon.y + 15, 20, 20);
        fire.addImage(fire_img);
        fire.setCollider("rectangle", 0, 0, fire.width, fire.height);
        //fire.debug=true;
        fire.scale = 0.3;
        fire.velocityX = -15;
        fireSound.play();

        fire.depth = dragon.depth;
        dragon.depth = dragon.depth + 1;

        fireGroup.add(fire);
    }

}

function nextlevelpopup() {

    swal({
        title: "HURRAYY!! You have reached Level 2",
        text: "Time for the next adventure.\n Make a score of 50, and kill the dragon to win the game!",
        imageUrl: "assets/levelUp.png",
        imageSize: "200x200",
        confirmButtonText: "Let's Win!",
        confirmButtonColor: "brown",
    },
        function () {

            gameState = "level2"
        }

    )

}

function keyReleased() {
    if (keyCode === 32) {
        shootSound.play();
        if (numberOfArrows > 0) {
            spawnArrows();
            numberOfArrows -= 1;
        }
    }
}

function gameOver() {

    swal({
        title: "You LOST!",
        imageUrl: "assets/game_over.png",
        imageSize: "200x200",
        confirmButtonText: "Try Again",
        confirmButtonColor: "brown",
    },
        function () {
            window.location.reload();
        }

    )


}


function spawnEnemiesLevel2() {
    if (frameCount % 80 == 0) {
        var randy = Math.round(random(80, 530))
        enemy = createSprite(width, randy);
        enemy.scale = 0.4
        enemy.velocityX = -15;

        var randimg = Math.round(random(1, 2))
        switch (randimg) {

            case 1:
                enemy.addImage(bird1)
                enemy.setCollider("rectangle", 0, 0, enemy.width, enemy.height)
                break;

            case 2:
                enemy.addImage(bird3)
                enemy.setCollider("rectangle", 0, 0, enemy.width, enemy.height)
                break;

            default: break;

        }


        enemyGroupLevel2.add(enemy);



    }


}
function win() {

    swal({
        title: "You Won!",
        text: "Congratulations you won the game! \n ",
        imageUrl: "assets/win.png",
        imageSize: "200x200",
        confirmButtonText: "Restart",
        confirmButtonColor: "brown",
    },
        function () {
            window.location.reload();
        }

    )


}

function dragonMovement() {
    if (dragon.y == 500) {
        dragon.velocityY = -5;
        dragon.y -= 5;


    }

    if (dragon.y == 80) {
        dragon.y = dragon.y + 5;
        dragon.velocityY = 5;
    }

}

