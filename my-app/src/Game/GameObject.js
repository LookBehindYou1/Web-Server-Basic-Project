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

    // Focuses on randomness of jump.
    jumpToRandom(){
        this.x = Math.random()*(this.xBorder - this.xSize)
        this.y = Math.random()*(this.yBorder - this.xSize)
    }

    // For collisions of images.
    hasCollision(other){
        return (
            ((other.x -  this.xSize <= this.x) && (this.x = other.x + other.xSize))
            && ((other.y - this.ySize <= this.y) && (this.y = other.y +other.ySize))
        )
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
        this.basicMovement(stepSize)
        this.checkBorders()
        return this;
    }

    // Changes image properties.
    render(props) {
        return (
            <img
                alt={this.image}
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

// Third
class PlatformerObject extends AccelerationObject {
    // Checks borders.
    checkBorders(){
        if (this.x < 0) {
            this.dx = 0;
            this.x = 0;
        }
        if (this.x > this.xBorder - this.xSize) {
            this.dx = 0;
            this.x = this.xBorder - this.xSize;
        }
        if (this.y < 0) {
            this.dy = 0;
            this.y = 0;
        }
        if (this.y > this.yBorder - this.ySize) {
            this.dy = 0;
            this.y = this.yBorder - this.ySize;
        }    
    }
    // Checks if the object is touching the ground.
    isTouchingGround() {
        return this.y == this.yBorder - this.ySize;
    }
    // 
    jump() {
        if (this.isTouchingGround()) {
            this.dy = -1;
        }
    }
}

// Fourth
class TimeToLiveObject extends GameObject {
    constructor(timeToLive=1000, ...args) {
        super(...args)
        this.timeToLive = timeToLive
        this.steps = 0;
    }
    step(...args) {
        super.step(...args);
        this.steps += 1;
        if (this.steps >= this.timeToLive) return null;
        return this;
    }
}

export {GameObject, AccelerationObject, PlatformerObject, TimeToLiveObject};