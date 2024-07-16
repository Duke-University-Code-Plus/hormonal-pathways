class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.loveX = 100;
        this.loveY = 3 * (cos(100) + sin(100 / 2)) + 110;
        this.fadeEffect = 1;
        this.fadeEffectCondition = true;
        this.loveCondition = true;
    }

    fade() {
        if (!this.loveCondition) return
        if (this.fadeEffectCondition) {
            this.fadeEffect += 2;
            if (this.fadeEffect >= 255) {
                this.fadeEffect = 255;
                this.fadeEffectCondition = false;
            }
        } else {
            this.fadeEffect -= 2;
            if (this.fadeEffect <= 0) {
                this.fadeEffect = 0;
                this.fadeEffectCondition = true;
                this.loveCondition = false;
            }
        }
    }

    show() {
        push();
        fill(250, 0, 0, this.fadeEffect);
        noStroke();
        this.loveX += 54;
        this.loveY = 3 * (cos(this.loveX) + sin(this.loveX / 2)) + 110;

        translate(this.x, this.y);
        rotate(45);
        // Calculate sizes based on loveY
        let sizeRect = this.loveY / 6;
        let sizeEllipse = this.loveY / 6;

        // Draw the rectangle
        rectMode(CENTER);
        rect(0, 0, sizeRect, sizeRect);

        // Draw the semi-circles
        arc(0, -sizeRect / 2, sizeEllipse, sizeEllipse, 180, 0, CHORD); // Right semi-circle
        arc(-sizeRect / 2, 0, sizeEllipse, sizeEllipse, 90, -90, CHORD); // Top semi-circle
        pop();

    }
}