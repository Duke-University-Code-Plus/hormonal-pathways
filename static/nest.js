class Nest {
    constructor(x, y, scale, bird) {
        this.sprite = createSprite(x, y);
        this.sprite.scale = scale
        this.sprite.addAnimation('normal', imagePath + 'nest.png');
        this.depth = 10

        this.babyBirdCount = 0;
        this.bird = bird;

        this.emptySpaceX = 0

        this.babyBirdToRemove = null
        
        this.babyBirdsInNest = [];

        nestArray.push(this)
    }

    addBabyBird(x) {
        console.log('in add baby bird')

        this.babyBirdCount++;
        new babyBird(x, this.sprite.position.y - this.sprite.originalWidth / 8, 0.05, this);
    }

    removeBabyBird() {
        console.log('in remove baby bird')

        this.babyBirdToRemove = this.babyBirdsInNest[0]; //first baby bird

        this.emptySpaceX = this.babyBirdToRemove.initialX //grab their x position
        
        const index = this.babyBirdsInNest.indexOf(this.babyBirdToRemove) //grab index of baby bird
        this.babyBirdsInNest.splice(index, 1) //remove from array and remove sprite
    }
}