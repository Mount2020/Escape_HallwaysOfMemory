const gameState = {
  currentScene: 0,
  inventory: [],
  puzzlesSolved: {
    scene1: [],
    scene2: [],
    scene3: [],
  },
  flags: {
    clockFixed: false,
    radioPlayed: false,
    broadcastPlayed: false,
    diaryRead: false,
    letterRead: false,
  },
  ending: null,
};

const StateManager = {
    hasItem(itemId) {
        return gameState.inventory.includes(itemId);
    },
    addItem(itemId) {
        if (!this.hasItem(itemId)) {
            gameState.inventory.push(itemId);
        }
    },
    isPuzzleSolved(sceneId, puzzleId) {
        return gameState.puzzlesSolved[sceneId].includes(puzzleId);
    },
    solvePuzzle(sceneId, puzzleId) {
        if (!this.isPuzzleSolved(sceneId, puzzleId)) {
            gameState.puzzlesSolved[sceneId].push(puzzleId);
        }
    },
    getFlag(flagName) {
        return gameState.flags[flagName];
    },
    setFlag(flagName, value) {
        gameState.flags[flagName] = value;
    }
};
