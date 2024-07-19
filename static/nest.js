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
        this.updateHTML();  // Update HTML after adding a baby bird
    }

    removeBabyBird() {
        if (this.babyBirdsInNest.length > 0) {
            this.babyBirdToRemove = this.babyBirdsInNest[0]; // First baby bird
            this.emptySpaceX = this.babyBirdToRemove.initialX; // Grab their x position
            const index = this.babyBirdsInNest.indexOf(this.babyBirdToRemove); // Grab index of baby bird
            this.babyBirdsInNest.splice(index, 1); // Remove from array and remove sprite
            this.babyBirdToRemove.remove(); // Ensure the sprite is removed
            this.babyBirdCount--;
            this.updateHTML();  // Update HTML after removing a baby bird
        }
    }

    updateHTML() {

        const displayData = [this.bird.name, this.babyBirdCount]

        window.top.postMessage(JSON.stringify(displayData), '*') //inside the iframe
    }
}
