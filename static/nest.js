class Nest {
    constructor(x, y, scale, bird) {
        this.sprite = createSprite(x, y);
        this.sprite.scale = scale
        this.sprite.addAnimation('normal', imagePath + 'nest.png');

        this.babyBirdCount = 0;
        this.bird = bird;

        this.babyBirdsInNest = [];
    }

    addBabyBird() {
        console.log('in add baby bird')

        this.babyBirdCount++;
        var babybirdX = this.sprite.position.x - this.sprite.originalWidth / 4 + ((this.sprite.originalWidth / 5) * this.babyBirdCount);
        new babyBird(babybirdX, this.sprite.position.y - this.sprite.originalWidth / 8, 0.05, this);
    }

    removeBabyBird() {
        console.log('in remove baby bird')
        //baby bird movement function
    }
}