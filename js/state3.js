const gameState3 = {
    currentScene: 1,
    inventory: [], // 例如：'baseball_card', 'compass_half', 'old_photo', 'diary_book'
    
    // 進度追蹤
    puzzlesSolved: {
        scene1: [], 
        scene2: [], 
        scene3: [],
        scene4: [],
        scene5: []
    },
    
    // 專屬系統：回憶與情感
    memoryProgress: 0, // 滿分為 6，對應 6 個關鍵里程碑
    unlockedDiaries: [], // 存放已解鎖的日記索引 [0-4]
    
    // 劇情標記
    flags: {
        readFirstMemory: false,
        readSecondMemory: false
    },
    
    ending: null
};
