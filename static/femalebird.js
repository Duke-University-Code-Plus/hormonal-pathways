class femaleBird {
    constructor(x, y, scale, mate, perch) {
        this.initialX = x
        this.initialY = y
        this.sprite = createSprite(x, y);
        this.sprite.scale = scale;
        // Animations
        this.sprite.addAnimation('fly', femalebird_fly);
        this.sprite.addAnimation('stand', imagePath + 'femalebird_stand.png');


        //mating variables
        this.perchX = perch[0]
        this.perchY = perch[1]
        this.matingStage = 0;
        // if = 1, bird is singing and female bird is flying to it
        //if = 2, female bird is at its perch spot
        //if = 3, heart is created
        //if = 4, baby bird created 
        //if = 5 male flies back to nest and variables all reinitialized
        //its mate's perch spot
        this.sprite.friction = 0.1;
        this.sprite.depth = 20;
        this.singFrameCount = 0; //keeps track of how many times male has sung to it
        this.mate = mate; // Assign the sprite of the maleBird

        femaleBirdsArray.push(this);
    }

    mateBehavior() {
        if (this.matingStage == 1) { //female bird flying to male bid
            console.log('matingStage', this.matingStage)
            if ((abs(this.sprite.position.y - this.perchY) < 1) && (abs(this.sprite.position.x - this.perchX) < 1)) { //if close to perch stop
                this.sprite.velocity.x = 0; //stop moving
                this.sprite.velocity.y = 0
                this.sprite.changeAnimation('stand')

                if (this.mate.sprite.position.x < this.sprite.position.x) {
                    this.sprite.mirrorX(1);
                } else {
                    this.sprite.mirrorX(-1);
                }

                this.matingStage = 2;
                this.mate.matingStage = 2;
            } else {
                this.sprite.changeAnimation('fly')
                this.sprite.attractionPoint(0.2, this.perchX, this.perchY)
            }
        }

        if (this.matingStage == 2) { //bird sings for 1 more frame cycles
            console.log('matingStage', this.matingStage)
            this.sprite.changeAnimation('stand')
            this.singFrameCount++
            if (this.singFrameCount > singFrameCycle) {
                this.matingStage = 3;
                this.mate.matingStage = 3;
            }
        }

        if (this.matingStage == 3) {
            console.log('matingStage', this.matingStage)
        }

        if (this.matingStage == 4) {
            console.log('matingStage', this.matingStage)
        }

        if (this.matingStage == 5) {
            console.log('matingStage', this.matingStage)
            this.sprite.changeAnimation('fly')
            this.sprite.attractionPoint(0.2, this.initialX, this.initialY)
            if (this.sprite.position.x < 0 || this.sprite.position.x > width) {
                this.mate.mate = null; //set male's mate variable to null
                const index = femaleBirdsArray.indexOf(this)
                femaleBirdsArray.splice(index, 1)
                this.sprite.remove()
            }      
        }
    }
}
