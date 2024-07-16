class femaleBird {
    constructor(x, y, scale, mate, perch) {
        this.initialX = x
        this.initialY = y

        this.sprite = createSprite(x, y);
        this.sprite.scale = scale;

        this.perchX = perch[0]
        this.perchY = perch[1]

        this.matingStage = 0;

        // Animations
        this.sprite.addAnimation('fly', femalebird_fly);
        this.sprite.addAnimation('stand', imagePath + 'femalebird_stand.png');

        this.sprite.friction = 0.1;
        this.sprite.depth = 20;

        this.mate = mate; // Assign the sprite of the maleBird

        femaleBirdsArray.push(this);
        console.log('femaleBirdsArray', femaleBirdsArray.length)

        this.singFrameCount = 0;
    }

    mateBehavior() {

        // if = 1, bird is singing and female bird is flying to it
        //if = 2, male bird sings for 5 more cycles
        //if = 3, heart shows 
        //if = 4, heart disappeared and femae bird flies out of frame

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
            console.log('sing frame count', this.singFrameCount)
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
            console.log('matingStage', this.natingStage)
        }

        if (this.matingStage == 5) {
            console.log('matingStage', this.matingStage)
            this.sprite.changeAnimation('fly')
            this.sprite.attractionPoint(0.2, this.initialX, this.initialY)
            if (this.sprite.position.x < 0 || this.sprite.position.x > width) {
                this.mate.mate = null; //set male's mate variable to null
                femaleBirdsArray.pop(this)
                this.sprite.remove()
            }      
        }
    }
}
