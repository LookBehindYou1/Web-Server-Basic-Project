import React from 'react';

import GameLevelBase from "./GameLevel";
import {
    GameObject,
    PlatformerObject,
    TimeToLiveObject,
} from "./GameObject"

export default class StickminPlatformerGameLevel extends GameLevelBase {
    constructor(tgtSpeed=0, areas=[], ...args) {
        super(...args);
        this.areas = areas;
        this.currentArea = parseInt(this.areas.length / 2);
        this.bg = this.getCurrentArea();
        this.tgtSpeed = tgtSpeed;
        this.reset()
    }
    reset() {
        super.reset()
        this.fireballs = [];
        this.blackholes = [];
        this.stickmin = new PlatformerObject(0, 0.03, null, null, 0 , 0, "/Person.png", 5, 5, 100, 100, true,);
        this.target = new GameObject(null, null, this.tgtSpeed, this.tgtSpeed, "/Can.png", 2.5, 2.5);
        this.tgtHits = 0;
        this.selfHits = 0;
    }

    getCurrentArea() {
        return this.areas[this.currentArea];
    }

    changeArea(areaChange) {
        if ((areaChange != 0) && (this.currentArea + areaChange >= 0) &&
        (this.currentArea + areaChange < this.areas.length)) {
            this.currentArea += areaChange;
            if (areaChange < 0) {
                this.stickmin.x = this.stickmin.xBorder - this.stickmin.xSize - 1;
            } else {
                this.stickmin.x = 1;
            }
            this.bg = this.getCurrentArea()
        }
    }

    step(stepSize) {
        this.stickmin.step(stepSize);
        this.changeArea(this.stickmin.areaChange());
        this.target.step(stepSize);
        this.blackholeSteps(stepSize);
        // Checks over the fireballs.
        this.fireballs = this.fireballs.filter((fireball) => {
            if (fireball.hasCollision(this.target)) {
                this.scoreAccumulated += 10 * Math.abs(this.target.dx);
                this.tgtHits += 1;
                if (this.tgtHits >= 3)
                    this.levelAccumulation = 1;
                    this.target.jumpToRandom();
                    return null;
            }
            return fireball.step(stepSize);
        });
    }

    shootFireball() {
        // Cooldown for fireball.
        if (this.fireballs.length > 0 &&
            this.fireballs[this.fireballs.length - 1].steps < 50)
            return;
            // Calculations for shooting.
            let fDx = this.stickmin.dx;
            let fDy = this.stickmin.dy;
            if (fDx === 0 && fDy ===0) {
                fDy = -1;
            }
            const newFireball = new TimeToLiveObject(250, this.stickmin.x, this.stickmin.y, Math.sign(fDx) * 1, Math.sign(fDy) * 1,
            "/Trash.png", 2, 2,);
            this.fireballs.push(newFireball);
    }

    blackholeSteps(stepSize) {
        this.blackholes = this.blackholes.filter((bhole) => {
            if  (bhole.hasCollision(this.stickmin)) {
                this.scoreAccumulated -= 10 * Math.abs(this.target.dx);
                this.selfHits += 1;
                if (this.selfHits >= 3)
                    this.levelAccumlulation = -1;
                    return null;
            }
            return bhole.step(stepSize);
        });
        let bholeSteps = 200;
        let bholeSpeed = 0.5;
        if (this.blackholes.length > 0 && this.blackholes[this.blackholes.length - 1].steps < bholeSteps) return;
        let directions = [[0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1], [-1, 0], [1,0]]
        this.blackholes = directions.map(dxy => new TimeToLiveObject(bholeSteps, this.target.x, this.target.y, bholeSpeed*dxy[0], bholeSpeed*dxy[1], "/Blackhole.png", 2, 2))
    }

    keyDown(e) {
        switch (e.keyCode) {
            // Space
            case 32:
                this.shootFireball();
                break;
            // Left
            case 37:
                this.stickmin.dx = -1;
                break;
            // Right
            case 39:
                this.stickmin.dx = 1;
                break;
            // Up
            case 38:
                this.stickmin.jump();
                break;
            // Other keys
            default:
                break;
        }
    }

    // For when the key is no longer pressed down.
    keyUp(e) {
        switch (e.keyCode) {
            case 37:
                this.stickmin.dx = 0;
                break;
            case 39:
                this.stickmin.dx = 0;
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <React.Fragment> { /* {this.areas[this.currentArea].render()} */}
                {this.stickmin.render()}
                {this.target.render()}
                {this.fireballs.map(f => f.render())}
                {this.blackholes.map(f => f.render())}
            </React.Fragment>
        )
    }
}