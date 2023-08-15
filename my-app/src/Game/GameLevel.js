import React from 'react';

export default class GameLevelBase {
    constructor(bg) {
        this.bg = bg;
        this.reset()
    }

    step(stepSize) {

    }

    accumulatedScore() {
        let score = this.scoreAccumulated;
        this.scoreAccumulated = 0;
        return score;
    }

    completed() {
        let lvl = this.levelAccumulation;
        this.levelAccumulation = 0;
        return lvl;
    }

    reset() {
        this.scoreAccumulated = 0;
        this.levelAccumulation = 0;
    }
}