import React from 'react';

// First
class GameObject {
    constructor(x=0, y=0, dx=0, dy=0, image=null,
                xSize=0, ySize=0, xBorder=1000, yBorder=1000){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.image = image;
        this.xSize = xSize;
        this.ySize = ySize;
        this.xBorder = xBorder;
        this.yBorder = yBorder;
    }
    
    // Direction changes after hitting border.
    checkBorders() {
        if (this.x <= 0) this.dx = Math.abs(this.dx);
        if (this.x >= this.xBorder - this.xSize) this.dx = -Math.abs(this.dx);
        if (this.y <= 0) this.dy = Math.abs(this.dy);
        if (this.y >= this.yBorder - this.ySize) this.dy = -Math.abs(this.dy);
    }

    // Movement determined.
    basicMovement(stepSize=0.01) {
        this.x += this.dx * stepSize;
        this.y += this.dy * stepSize;
    }

    // Movement and bounce is put together.
    step(stepSize=0.01) {
        this.checkBorders()
        this.basicMovement(stepSize)
        return this;
    }

    // Changes image properties.
    render(props) {
        return (
            <img
                alt="Trash"
                src={this.image}
                style={{
                    position: 'absolute',
                    left: this.x,
                    top: this.y,
                    width: `${this.xSize}px`,
                    height: `${this.ySize}px`,
                }}
                {...props}
            />
        )
    }
}

// Second 
class AccelerationObject extends GameObject {
    constructor(ddx=0, ddy=0, ...args) {
        super(...args);
        this.ddx = ddx;
        this.ddy = ddy;
    }
    
    // Determines velocity.
    basicVelocity(stepSize=0.01) {
        this.dx += this.ddx * stepSize;
        this.dy += this.ddy * stepSize;
    }

    // Movement determined with acceleration.
    step(stepSize=0.01) {
        this.basicVelocity(stepSize);
        return super.step(stepSize);
    }
}

export {GameObject, AccelerationObject};