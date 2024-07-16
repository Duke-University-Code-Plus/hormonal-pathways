class maleBird {
    constructor(x, y, scale, nest, perch, femaleperch) {
        this.sprite = createSprite(x, y);
        this.sprite.scale = scale
        this.nest = nest;
        this.perchX = perch[0]
        this.perchY = perch[1]

        this.femaleperchX = femaleperch[0]
        this.femaleperchY = femaleperch[1]

        console.log('male perch x', this.perchX)
        console.log('male perch y', this.perchY)

        console.log('female perch x', this.femaleperchX)
        console.log('female perch y', this.femaleperchY)

        this.scavengeCondition = false
        this.scavengeChange = false; //keeps track of whether bird is in the process of scavenging

        this.matingCondition = false
        this.mateCreated = false

        this.matingStage = 0 //keeps track of mating stage 
        // if = 1, bird is singing and female bird is flying to it
        //if = 2, female bird is at its perch spot
        //if = 3, heart is created

        //animations
        this.sprite.addAnimation('fly', malebird_fly);
        this.sprite.addAnimation('stand', imagePath + 'malebird_stand.png'); sing = this.sprite.addAnimation('sing', imagePath + 'malebird_sing0001.png', imagePath + 'malebird_sing0002.png');
        peck = this.sprite.addAnimation('peck', imagePath + 'malebird_peck0001.png', imagePath + 'malebird_peck0002.png');
        this.sprite.addAnimation('transformed', imagePath + 'malebird_death.png');

        this.sprite.changeAnimation('stand');

        peck.frameDelay = peckFrameCycle / 2;
        sing.frameDelay = singFrameCycle / 4;

        this.notes = null;
        this.notes_flipped = null;

        this.love = null; 

        this.babyBirdChange = false; //true if baby bird has already been created for current mating cycle, false otherwise

        // create collider for player 
        this.sprite.setCollider('circle', 0, 0, 200);
        this.sprite.depth = 20;
        this.sprite.friction = 0.05;

        this.mate = null;

        maleBirdsArray.push(this)
    }

    mateBehavior() {

        // if = 1, bird is singing and female bird is flying to it
        //if = 2, heart shows 
        //if = 3, heart disappeared and femae bird flies out of frame

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
                this.sprite.attractionPoint(0.2, this.perchX, this.perchY)
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
                this.matingStage = 4
                this.mate.matingStage = 4

            }
        }

        if (this.matingStage == 4) { //baby bird created
            console.log('matingStage', this.matingStage)

            if (!this.babyBirdChange) { //if baby bird hasnt already been created
                this.nest.addBabyBird(); //create baby bird
                this.babyBirdChange = true;
                this.matingStage = 5;
                this.mate.matingStage = 5;
            }
        }

        if (this.matingStage == 5) { //female bird flies away and male returns to nest 
            console.log('matingStage', this.matingStage)

            this.sprite.changeAnimation('fly')
            this.sprite.attractionPoint(0.2, this.nest.sprite.position.x + 17, this.nest.sprite.position.y - 20)

            if ((abs(this.sprite.position.y - (this.nest.sprite.position.y - 20)) < 1) && (abs(this.sprite.position.x - (this.nest.sprite.position.x + 17)) < 1)) {
                this.sprite.velocity.x = 0; //stop moving
                this.sprite.velocity.y = 0;
                this.sprite.changeAnimation('stand')
                if (this.mate == null) {
                    this.matingCondition = false
                    this.mateCreated = false
                    this.matingStage = 0;
                    this.babyBirdChange = false;
                    this.notes = null
                    this.notes_flipped = null
                    this.love = null

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
                this.love = new Heart(this.mate.sprite.position.x + midpointX, this.mate.sprite.position.y - 20);
            if (this.mate.sprite.position.x > this.sprite.position.x)
                this.love = new Heart(this.sprite.position.x + midpointX, this.mate.sprite.position.y - 20);
        }
        this.love.fade();
        this.love.show();
    }

}

