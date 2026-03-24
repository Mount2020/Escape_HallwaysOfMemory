const gameState = {
  currentScene: 1,
  inventory: [],
  globalClues: [],
  puzzlesSolved: {
    scene1: [],
    scene2: [],
    scene3: [],
    scene4: [],
    scene5: []
  },
  flags: {
    clockChecked: false,
    registerRead: false,
    hallwayOpen: false,
    diaryOpened: false
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
    addClue(clueStr) {
        if (!gameState.globalClues.includes(clueStr)) {
            gameState.globalClues.push(clueStr);
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
