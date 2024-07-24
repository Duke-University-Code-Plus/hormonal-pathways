class Nest {
    constructor(x, y, scale, bird) {
        this.sprite = createSprite(x, y);
        this.sprite.scale = scale;
        this.sprite.addAnimation('normal', imagePath + 'nest.png');
        this.depth = 10;

        this.babyBirdCount = 0;
        this.bird = bird;

        this.emptySpaceX = 0;

        this.babyBirdToRemove = null;

        this.babyBirdsInNest = [];

        nestArray.push(this);
    }

    addBabyBird(x) {
        this.babyBirdCount++;
        new babyBird(x, this.sprite.position.y - this.sprite.originalWidth / 8, 0.05, this);
    }

    removeBabyBird() {
        if (this.babyBirdsInNest.length == 2) {
            this.babyBirdToRemove = this.babyBirdsInNest[0]; // First baby bird
            this.emptySpaceX = this.babyBirdToRemove.initialX; // Grab their x position
            const index = this.babyBirdsInNest.indexOf(this.babyBirdToRemove); // Grab index of baby bird
            this.babyBirdsInNest.splice(index, 1); // Remove from array 
        }
    }
}
