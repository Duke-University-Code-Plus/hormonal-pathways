class maleBird {
    constructor(name, x, y, scale, nest, perch, femaleperch, color, neutralSpeed) {
        this.neutralState = true
        this.name = name
        this.proportion = null
        this.currentProportion = null
        this.matingCount = 0; 
        this.scavengeCount = 0; 

        this.sprite = createSprite(x, y);
        this.sprite.scale = scale
        this.nest = nest;
        this.sprite.velocity.x = neutralSpeed;

        //perch spot
        this.perchX = perch[0]
        this.perchY = perch[1]
        //animations
        if (color == "blue/") {
            this.sprite.addAnimation('fly', malebird1_fly);
        }
        else if (color == "purple/") {
            this.sprite.addAnimation('fly', malebird2_fly);
        }
        else {
            this.sprite.addAnimation('fly', malebird3_fly);
        }
        this.sprite.addAnimation('stand', imagePath + color + 'malebird_stand.png'); 
        sing = this.sprite.addAnimation('sing', imagePath + color + 'malebird_sing0001.png', imagePath + color + 'malebird_sing0002.png');
        peck = this.sprite.addAnimation('peck', imagePath + color + 'malebird_peck0001.png', imagePath + color + 'malebird_peck0002.png');
        this.sprite.addAnimation('transformed', imagePath + color + 'malebird_death.png');

        this.sprite.changeAnimation('stand');
        // create collider for player 
        this.sprite.setCollider('circle', 0, 0, 200);
        this.sprite.depth = 20;
        this.sprite.friction = 0.1;
        this.sprite.debug = false;


        //mating variables
        this.matingCondition = false
        this.mateCreated = false
        this.matingStage = 0 //keeps track of mating stage 
        // if = 1, bird is singing and female bird is flying to it
        //if = 2, female bird is at its perch spot
        //if = 3, heart is created
        //if = 4, baby bird created 
        //if = 5 male flies back to nest and variables all reinitialized
        //its mate's perch spot
        this.femaleperchX = femaleperch[0]
        this.femaleperchY = femaleperch[1]
        peck.frameDelay = peckFrameCycle / 2;
        sing.frameDelay = singFrameCycle / 4;
        this.notes = null;
        this.notes_flipped = null;
        this.love = null;
        this.babyBirdChange = false; //true if baby bird has already been created for current mating cycle, false otherwise
        this.mate = null;
        this.fullNest = false;
        this.babyBirdFlying = false


        //scavenge variables
        this.scavengeCondition = false
        this.scavengeChange = false //keeps track of whether worm was already chosen 
        this.scavengeState = 0
        // if = 1, fly to worm on ground 
        // if = 2, peck at ground 
        //if = 3, change animation to include worm and remove worm from ground
        //if = 4, fly back to nest with worm, add worm to remove the one that was taken
        //if = 5, feed 
        this.worm = null;
        this.scavengeX = 0;
        this.scavengeY = 0;
        this.scavengeFrameCount = 0;
        this.peckColliderY = 0;
        this.caughtPrey = false

        maleBirdsArray.push(this)
    }

    mateBehavior() {
        // if = 1, bird is singing and female bird is flying to it
        //if = 2, female bird is at its perch spot
        //if = 3, heart is created
        //if = 4, baby bird created 
        //if = 5 male flies back to nest and variables all reinitialized
        //its mate's perch spot

        if (this.mate != null) this.mate.mateBehavior();

        if (this.matingStage == 0) {
            if ((abs(this.sprite.position.y - this.perchY) < 1) && (abs(this.sprite.position.x - this.perchX) < 1)) { //if close to perch stop
                this.sprite.velocity.x = 0; //stop moving
                this.sprite.velocity.y = 0;
                this.sprite.changeAnimation('stand')

                //facing mate
                if (this.mate.sprite.perchX < this.sprite.perchX) {
                    this.sprite.mirrorX(-1);
                } else {
                    this.sprite.mirrorX(1);
                }

                this.matingStage = 1
                this.mate.matingStage = 1

            } else {
                this.sprite.changeAnimation('fly')
                this.sprite.attractionPoint(0.3, this.perchX, this.perchY)
            }
        }


        if (this.matingStage == 1) { //start to sing 
            this.sprite.changeAnimation('sing')
            if (this.notes == null && this.notes_flipped == null) {
                this.createNotes();
            }
        }

        if (this.matingStage == 3) { //heart will appear 
            if (this.notes != null) {
                this.notes.remove();
            }
            if (this.notes_flipped != null) {
                this.notes_flipped.remove()
            }
            this.sprite.changeAnimation('stand')
            this.createLove();
            if (!this.love.loveCondition) {
                if (this.nest.babyBirdsInNest.length == 2) {
                    this.fullNest = true 
                }
                this.matingStage = 4
                this.mate.matingStage = 4
            }
        }

        if (this.babyBirdFlying) {
            this.nest.babyBirdToRemove.leaveNest()  
        }

        if (this.matingStage == 4) { //baby bird created
            if (!this.babyBirdChange && this.fullNest) { //if baby bird hasnt already been created and there's two baby birds in the nest 
                this.nest.removeBabyBird() //remove baby bird
                this.babyBirdFlying = true
                if (this.nest.babyBirdsInNest.length == 1) { //once baby bird sprite is out of frame 
                    this.nest.addBabyBird(this.nest.emptySpaceX) //add baby bird at the x position of bird that left 
                    this.babyBirdChange = true;
                    this.matingStage = 5;
                    this.mate.matingStage = 5;
                }
            }

            if (!this.babyBirdChange && !this.fullNest) {
                var babybirdX = this.nest.sprite.position.x - this.nest.sprite.originalWidth / 5 + ((this.sprite.originalWidth / 8) * this.nest.babyBirdCount);
                this.nest.addBabyBird(babybirdX); //create baby bird
                this.babyBirdChange = true;
                this.matingStage = 5;
                this.mate.matingStage = 5;
            }
        }

        if (this.matingStage == 5) { //female bird flies away and male returns to nest 
            this.sprite.changeAnimation('fly')
            this.sprite.attractionPoint(0.2, this.nest.sprite.position.x + 17, this.nest.sprite.position.y - 20)

            if ((abs(this.sprite.position.y - (this.nest.sprite.position.y - 20)) < 1) && (abs(this.sprite.position.x - (this.nest.sprite.position.x + 17)) < 1)) {
                this.sprite.velocity.x = 0; //stop moving
                this.sprite.velocity.y = 0;
                this.sprite.changeAnimation('stand')
                if (this.mate == null && !this.babyBirdFlying ) {
                    this.matingCount++; 
                    this.matingCondition = false
                    this.mateCreated = false
                    this.matingStage = 0;
                    this.babyBirdChange = false;
                    this.notes = null
                    this.notes_flipped = null
                    this.love = null
                    this.neutralState = true;
                }
            }
        }
    }

    createNotes() {
        if (this.notes != null) this.notes.remove();
        if (this.notes_flipped != null) this.notes_flipped.remove()

        if (this.mate.sprite.perchX < this.sprite.perchX) {
            this.notes = createSprite(this.sprite.position.x + 0.3 * this.sprite.originalWidth, this.sprite.position.y - 0.3 * this.sprite.originalHeight);
            music = this.notes.addAnimation('normal', notes_play);
            this.notes.scale = 0.1;
            music.frameDelay = singFrameCycle / 4;
        }
        else {
            this.notes_flipped = createSprite(this.sprite.position.x - 0.3 * this.sprite.originalWidth, this.sprite.position.y - 0.3 * this.sprite.originalHeight);
            music_flipped = this.notes_flipped.addAnimation('normal', notes_flipped_play);
            this.notes_flipped.scale = 0.1;
            music_flipped.frameDelay = singFrameCycle / 4;
        }
    }

    createLove() {
        if (this.love == null) {
            var midpointX = abs(this.mate.sprite.position.x - this.sprite.position.x) / 2;
            if (this.mate.sprite.position.x <= this.sprite.position.x)
                this.love = new Heart(this.mate.sprite.position.x + midpointX, this.mate.sprite.position.y - 30);
            if (this.mate.sprite.position.x > this.sprite.position.x)
                this.love = new Heart(this.sprite.position.x + midpointX, this.mate.sprite.position.y - 30);
        }
        this.love.fade();
        this.love.show();
    }

    scavengeBehavior() {
        // if = 0, choose worm
        // if = 1, fly to worm on ground 
        // if = 2, peck at ground 
        //if = 3, change animation to include worm and remove worm from ground
        //if = 4, fly back to nest with worm, add worm to remove the one that was taken
        //if = 5, feed 
        if (this.scavengeState == 0 && this.scavengeCondition) { //choose
            this.findWorm(); //find worm
            this.scavengeState = 1
        }

        if (this.scavengeState == 1) { // if = 1, fly to worm
            this.sprite.changeAnimation('fly')
            this.sprite.attractionPoint(0.3, this.scavengeX, this.scavengeY)

            if ((abs(this.sprite.position.y - this.scavengeY) < 1) && (abs(this.sprite.position.x - this.scavengeX) < 1)) { //if close to scavenge stop

                this.sprite.velocity.x = 0; //stop moving
                this.sprite.velocity.y = 0;

                //facing mate
                if (this.worm.sprite.position.x < this.sprite.scavengeX) {
                    this.sprite.mirrorX(-1);
                } else {
                    this.sprite.mirrorX(1);
                }
                this.scavengeState = 2;
            }
        }

        // at ground
        if (this.scavengeState == 2) { //if = 2, peck at ground 

            this.sprite.changeAnimation('peck')

            const peckNum = int(random(2, 4))
            if (this.scavengeFrameCount > peckNum * peckFrameCycle) {
                this.worm.sprite.changeAnimation('dead') //worm dies
                this.caughtPrey = true; //caught prey 
                this.scavengeStage = 3; //stage 3
                this.scavengeFrameCount = 0;
            }
            this.scavengeFrameCount++;
        }


        if (this.caughtPrey) {  //if caught prey 
            this.sprite.setCollider('circle', 0, 0, 200);
            this.worm.sprite.friction = 0.3
            this.scavengeState = 3
            if (this.sprite.mirrorX() == -1) {
                this.worm.sprite.attractionPoint(3, this.sprite.position.x + 20, this.sprite.position.y);
            } else {
                this.worm.sprite.attractionPoint(3, this.sprite.position.x - 20, this.sprite.position.y);
            }
        }

        if (this.scavengeState == 3) {  //fly to nest

            this.sprite.changeAnimation('fly')
            this.sprite.attractionPoint(0.3, this.nest.sprite.position.x + 17, this.nest.sprite.position.y - 20) // fly to nest 

            if ((abs(this.sprite.position.y - (this.nest.sprite.position.y - 20)) < 1) && (abs(this.sprite.position.x - (this.nest.sprite.position.x + 17)) < 1)) { //if at nest 
                if (this.nest.sprite.position.x < this.sprite.position.x) {
                    this.sprite.velocity.x = 0; //stop moving
                    this.sprite.velocity.y = 0;
                    this.sprite.mirrorX(1)
                    this.sprite.changeAnimation('stand')
                } else {
                    this.sprite.mirror(-1)
                    this.sprite.velocity.x = 0; //stop moving
                    this.sprite.velocity.y = 0;
                    this.sprite.changeAnimation('stand')
                }
                this.scavengeState = 4;
            }
        }

        if (this.scavengeState == 4) { //feed birds

            this.scavengeFrameCount++

            if (this.scavengeFrameCount <= peckFrameCycle / 2) {
                this.sprite.changeAnimation('peck')
            } else {
                this.worm.sprite.remove()
                this.scavengeState = 5
                /*
                const index = wormsArray.indexOf(this.worm)
                wormsArray.splice(index, 1)
                */
            }
        }

        if (this.scavengeState == 5) {
            this.scavengeCount++; 
            this.caughtPrey = false
            this.scavengeChange = false
            this.scavengeState = 0
            this.worm = null;
            this.scavengeX = 0;
            this.scavengeY = 0;
            this.scavengeFrameCount = 0;
            this.peckColliderY = 0;
            this.scavengeCondition = false;
            this.neutralState = true;
        }
    }

    deathBehavior() {
        this.sprite.changeAnimation('transformed');
        this.sprite.velocity.x = 0;
        this.sprite.velocity.y = 2;

        if (this.sprite.position.y >= ground.position.y - ground.originalHeight / 2 && this.sprite.getAnimationLabel() == 'transformed') 
            this.sprite.remove();
    }

    findWorm() {
        this.worm = random(wormsArray)

        const index = wormsArray.indexOf(this.worm)
        wormsArray.splice(index, 1)

        this.worm.sprite.velocity.x = 0.05

        if (this.worm.sprite.velocity.x < 0) {
            this.scavengeX = this.worm.sprite.position.x - 5
        } else {
            this.scavengeX = this.worm.sprite.position.x + 5
        }
        this.scavengeY = ground.position.y - ground.originalHeight / 2

    }

    determineBehavior() {
        this.currentProportion = this.proportion[timeStep-1]; 
        console.log(this.currentProportion)
        const randomNum = random(0, 1)
        if (randomNum < this.currentProportion && this.nest.babyBirdCount > 0) { //smaller proportion, smaller chance of scavenging
            this.scavengeCondition = true
        } else {
            this.matingCondition = true
        }
    }

    neutralStateBehavior() {
        this.sprite.changeAnimation('fly')
        this.sprite.friction = 0.1;
        if (this.sprite.position.y > height / 4) { //flies upward
            this.sprite.attractionPoint(0.3, width / 2, height / 4);
        }
        else { 
            if (this.sprite.velocity.x > 0) {
                this.sprite.velocity.x = 2; 
            } else {
                this.sprite.velocity.x = -2; 
            }
        }
    }

    updateHTML() {
        const displayData = [this.name, this.nest.babyBirdCount, this.matingCount, this.scavengeCount, int((this.currentProportion / 1) * 100), 100 - int((this.currentProportion / 1) * 100), timeStep - 1]
        window.top.postMessage(JSON.stringify(displayData), '*') //inside the iframe
    }
}

