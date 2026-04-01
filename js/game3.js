const GameController3 = {
    bgm: null,
    musicPlaying: false,
    memoryQueue: [],

    init() {
        this.loadScene(gameState3.currentScene);
        this.updateInventory();
        
        // 確保進度條初始狀態正確
        const ratio = (gameState3.memoryProgress / 4) * 100;
        document.getElementById('progress-fill').style.height = `${ratio}%`;

        // 開場特效
        setTimeout(() => {
            document.getElementById('transition-overlay').classList.remove('active');
        }, 500);
        
        // 綁定點擊播放配樂
        this.initAudio('assets/audio/bgm1_sea.mp3');
    },

    initAudio(src) {
        this.bgm = new Audio(src);
        this.bgm.loop = true;
        
        const startAudio = () => {
            if (!this.musicPlaying) {
                this.bgm.play().then(() => {
                    this.musicPlaying = true;
                    this.updateToggleBtn();
                }).catch(e => console.log('Autoplay prevented', e));
            }
            document.body.removeEventListener('click', startAudio);
        };
        document.body.addEventListener('click', startAudio);
    },

    toggleMusic() {
        if (!this.bgm) {
            this.initAudio('assets/audio/bgm1_sea.mp3'); 
        }
        
        if (this.musicPlaying) {
            this.bgm.pause();
            this.musicPlaying = false;
        } else {
            this.bgm.play().catch(e => console.log('Play prevented', e));
            this.musicPlaying = true;
        }
        this.updateToggleBtn();
    },

    updateToggleBtn() {
        const toggleBtn = document.getElementById('music-toggle');
        if(toggleBtn) toggleBtn.textContent = this.musicPlaying ? '🔊 開' : '🔇 關';
    },

    toggleSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        }
    },

    goHome() {
        document.getElementById('transition-overlay').classList.add('active');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    },

    // --- 核心場景與對話渲染 ---
    loadScene(sceneId) {
        const scene = scenes3[sceneId];
        const view = document.getElementById('scene-view');
        
        // 切換背景圖
        view.style.backgroundImage = scene.bg;
        
        // 進入起始節點
        this.goToNode('start');
    },

    goToNode(nodeId) {
        const scene = scenes3[gameState3.currentScene];
        const node = scene.nodes[nodeId];
        if (!node) return;

        // 清除場景上舊的熱區div（不再使用定位熱區）
        document.getElementById('scene-view').innerHTML = '';

        // 將 hotspots 轉換芳文字選項，合併至 choices
        const mergedNode = Object.assign({}, node);
        if (node.hotspots && node.hotspots.length > 0) {
            const spotChoices = node.hotspots.map(spot => ({
                text: `→ ${spot.title}`,
                target: spot.target
            }));
            mergedNode.choices = [...spotChoices, ...(node.choices || [])];
        }

        // 將展示 vn-box 與打字效果
        const textElement = document.getElementById('vn-text');
        textElement.innerHTML = '';
        
        if (mergedNode.text) {
            document.getElementById('vn-box').style.display = 'block';
            this.typeText(mergedNode.text, mergedNode, nodeId);
        } else {
            document.getElementById('vn-box').style.display = 'none';
            this.renderOptions(mergedNode);
            if (mergedNode.customLogic) mergedNode.customLogic(this);
        }
    },

    // renderHotspots 不再使用，保留為歷存參考
    renderHotspots(node) {},

    typeText(text, node, nodeId) {
        const textElement = document.getElementById('vn-text');
        textElement.innerHTML = '';
        let i = 0;
        const speed = 30; // 每個字母毫秒
        
        // 清除過去的定時器
        if (this.typeInterval) clearInterval(this.typeInterval);
        
        // 簡單隱藏選項
        const oldOptions = document.querySelector('.options-container');
        if (oldOptions) oldOptions.remove();

        this.typeInterval = setInterval(() => {
            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    textElement.innerHTML += '<br>';
                } else {
                    textElement.innerHTML += text.charAt(i);
                }
                i++;
            } else {
                clearInterval(this.typeInterval);
                this.renderOptions(node);
                
                // 檢查自訂邏輯
                if (node.customLogic) {
                    node.customLogic(this);
                }
            }
        }, speed);
    },

    renderOptions(node) {
        if (!node.choices || node.choices.length === 0) return;
        
        const container = document.createElement('div');
        container.className = 'options-container';
        container.style.marginTop = '20px';
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.style.flexWrap = 'wrap';

        node.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.style.width = 'auto';
            btn.style.padding = '8px 20px';
            btn.textContent = choice.text;
            
            btn.onclick = () => {
                if (choice.target) {
                    this.goToNode(choice.target);
                } else if (choice.action) {
                    this.handleAction(choice.action);
                }
            };
            container.appendChild(btn);
        });

        document.getElementById('vn-text').appendChild(container);
    },

    handleAction(action) {
        // 過關邏輯
        if (action === 'next_scene') {
            document.getElementById('transition-overlay').classList.add('active');
            setTimeout(() => {
                gameState3.currentScene++;
                this.loadScene(gameState3.currentScene);
                setTimeout(() => {
                    document.getElementById('transition-overlay').classList.remove('active');
                }, 500);
            }, 1000);
            return;
        }

        // 謎題派發
        if (action.startsWith('puzzle_')) {
            this.openPuzzleModal(action);
            return;
        }
    },

    // --- 道具與狀態系統 ---
    updateInventory() {
        const inv = document.getElementById('inventory');
        inv.innerHTML = '';
        
        const itemMeta = {
            'baseball_card': { emoji: '🎧', name: '棒球卡', desc: '就算三振出局，我們也要一起走下球場。' },
            'compass_half':  { emoji: '🧩', name: '半塊羅盤', desc: '原本以為弄丟的寶物，被他偷偷收著。' },
            'old_photo':     { emoji: '📷', name: '泛黃合照', desc: '藥水氣味中重新鮮活的瞬間，但他眼神遙遠。' },
            'diary_book':    { emoji: '📓', name: '未寫完筆記', desc: '灰塵撲面，記錄著未曾說出口的暴風雨。' },
            'medicine_bottle': { emoji: '💊', name: '空的藥瓶', desc: '標籤模糊，象徵著那段獨自承受的痛苦。' },
            'unsent_letter':   { emoji: '💌', name: '未寄的信', desc: '充滿了對未來的恐懼與對我的抱歉。' },
            'compass_full':  { emoji: '🧭', name: '完整的羅盤', desc: '指向東南方海岸線的指引。' },
            'last_letter':   { emoji: '✉️', name: '最後一封信', desc: '跨越十年，才終於抵達手中的告別。' },
        };

        gameState3.inventory.forEach(itemId => {
            const meta = itemMeta[itemId] || { emoji: '❓', name: '未知道具', desc: '這是一個神秘的物品。' };
            const slot = document.createElement('div');
            slot.className = 'item-slot';
            slot.dataset.name = meta.name;
            slot.title = meta.name;
            slot.style.display = 'flex';
            slot.style.flexDirection = 'column';
            slot.style.alignItems = 'center';
            slot.style.justifyContent = 'center';
            slot.style.gap = '2px';
            slot.style.width = '60px';
            slot.style.height = '60px';
            slot.style.background = 'rgba(240,244,248,0.15)';
            slot.style.border = '1px solid rgba(127,140,154,0.5)';
            slot.style.borderRadius = '6px';
            slot.style.cursor = 'pointer';

            const emoji = document.createElement('span');
            emoji.textContent = meta.emoji;
            emoji.style.fontSize = '1.6rem';
            emoji.style.lineHeight = '1';

            const label = document.createElement('span');
            label.textContent = meta.name;
            label.style.fontSize = '0.55rem';
            label.style.color = 'var(--color-bg)';
            label.style.letterSpacing = '0';
            label.style.textAlign = 'center';
            label.style.lineHeight = '1.2';

            slot.appendChild(emoji);
            slot.appendChild(label);
            
            // 點擊顯示道具說明
            slot.onclick = () => {
                const modal = document.getElementById('puzzle-modal');
                const content = document.getElementById('puzzle-content');
                content.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 10px;">${meta.emoji}</div>
                    <h3 style="margin-top: 0;">${meta.name}</h3>
                    <p style="font-size: 1.1rem; line-height: 1.6;">${meta.desc}</p>
                    <div class="puzzle-actions">
                        <button class="puzzle-btn close-btn" onclick="document.getElementById('puzzle-modal').style.display='none'">關閉</button>
                    </div>
                `;
                modal.style.display = 'flex';
            };
            
            inv.appendChild(slot);
        });
    },

    addItem(itemId) {
        if (!gameState3.inventory.includes(itemId)) {
            gameState3.inventory.push(itemId);
            this.updateInventory();
            this.updateProgressBar(itemId);
        }
    },

    // --- 新系統：情感進度條 ---
    updateProgressBar(itemId) {
        gameState3.memoryProgress++;
        const fill = document.getElementById('progress-fill');
        const ratio = (gameState3.memoryProgress / 8) * 100; // 總共有 8 個關鍵里程碑
        fill.style.height = `${ratio}%`;
    },

    // --- 新系統：回憶插敘 ---
    triggerMemory(memoryId, nextNodeId) {
        this.pendingNextNode = nextNodeId;
        const overlay = document.getElementById('memory-overlay');
        overlay.innerHTML = '<div class="memory-close-hint">點擊任意處繼續</div>';
        
        this.memoryQueue = [...memories3[memoryId]];
        overlay.classList.add('active');
        
        this.showNextMemoryBubble();
    },

    showNextMemoryBubble() {
        if (this.memoryQueue.length === 0) {
            const hint = document.querySelector('.memory-close-hint');
            if(hint) hint.style.opacity = 1;
            return;
        }
        
        const data = this.memoryQueue.shift();
        const bubble = document.createElement('div');
        bubble.className = `memory-bubble ${data.speaker}`;
        bubble.textContent = data.text;
        
        const overlay = document.getElementById('memory-overlay');
        const hint = document.querySelector('.memory-close-hint');
        overlay.insertBefore(bubble, hint);
        
        setTimeout(() => bubble.classList.add('show'), 50);
        setTimeout(() => this.showNextMemoryBubble(), 1500);
    },

    advanceMemory() {
        if (this.memoryQueue.length > 0) return; // 播放中無法略過
        
        const overlay = document.getElementById('memory-overlay');
        overlay.classList.remove('active');
        
        // 回憶結束後解鎖對應的日記
        if (gameState3.memoryProgress === 1) this.unlockDiary(0); // 看到 memory1 後解鎖日記 1
        if (gameState3.memoryProgress === 3) this.unlockDiary(1); // 看到 memory2 後解鎖日記 2
        if (gameState3.memoryProgress === 6) this.unlockDiary(2); // 看到 memory_room 後解鎖日記 3
        if (gameState3.memoryProgress === 7) this.unlockDiary(3); // 看到 memory3 後解鎖日記 4
        if (gameState3.memoryProgress === 8) this.unlockDiary(4); // 看到 memory4 後解鎖日記 5
        
        setTimeout(() => {
            overlay.innerHTML = '';
            if (this.pendingNextNode) {
                this.goToNode(this.pendingNextNode);
            }
        }, 1000);
    },

    // --- 新系統：日記本 ---
    unlockDiary(index) {
        if (!gameState3.unlockedDiaries.includes(index)) {
            gameState3.unlockedDiaries.push(index);
            const btn = document.getElementById('diary-btn');
            btn.style.display = 'block';
            btn.classList.add('has-new');
            
            // 漂浮文字通知
            const toast = document.createElement('div');
            toast.textContent = '日記更新';
            toast.style.position = 'absolute';
            toast.style.top = '-20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = '#e74c3c';
            toast.style.color = 'white';
            toast.style.padding = '4px 8px';
            toast.style.borderRadius = '12px';
            toast.style.fontSize = '0.75rem';
            toast.style.whiteSpace = 'nowrap';
            toast.style.pointerEvents = 'none';
            toast.style.opacity = '1';
            toast.style.transition = 'all 2s ease-out';
            btn.appendChild(toast);
            
            setTimeout(() => {
                toast.style.top = '-40px';
                toast.style.opacity = '0';
            }, 100);
            
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 2100);
        }
    },

    toggleDiary() {
        const modal = document.getElementById('diary-modal');
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
            return;
        }
        
        document.getElementById('diary-btn').classList.remove('has-new');
        
        const content = document.getElementById('diary-content');
        content.innerHTML = '';
        
        if (gameState3.unlockedDiaries.length === 0) {
            content.innerHTML = '<p class="diary-text" style="text-align:center;">目前沒有日記。</p>';
        } else {
            gameState3.unlockedDiaries.forEach(index => {
                const entry = diaryEntries3[index];
                content.innerHTML += `
                    <div class="diary-entry">
                        <div class="diary-date">${entry.date}</div>
                        <div class="diary-text">${entry.text}</div>
                    </div>
                `;
            });
        }
        modal.style.display = 'flex';
    },

    // --- 謎題系統實作 ---
    openPuzzleModal(puzzleId) {
        const modal = document.getElementById('puzzle-modal');
        const content = document.getElementById('puzzle-content');
        modal.style.display = 'flex';
        
        if (puzzleId === 'puzzle_mailbox') {
            content.innerHTML = `
                <h3>信箱密碼鎖</h3>
                <p>生鏽的二碼轉盤鎖需要兩位數字。<br>但佔盤上的符號已读不清了……<br><br>「藍是 5，光是藍加 2。我們各自的數字，排成密碼。」</p>
                <div class="puzzle-actions">
                    <input type="text" id="puzzle-input" class="puzzle-input" placeholder="_ _" maxlength="2">
                    <button class="puzzle-btn" onclick="GameController3.checkPuzzle('mailbox')">解鎖</button>
                    <button class="puzzle-btn close-btn" onclick="document.getElementById('puzzle-modal').style.display='none'">放棄</button>
                </div>
            `;
        } else if (puzzleId === 'puzzle_toy') {
            content.innerHTML = `
                <h3>四色按鈕玩具</h3>
                <p>四個按鈕上刻著不同的圖案，順序好像和什麼有關……</p>
                <div class="puzzle-actions" id="toy-btns" style="flex-direction: row; justify-content: center; gap: 12px; flex-wrap: wrap;">
                    <button class="puzzle-btn" style="background:#2980b9; padding: 15px; font-size: 1.4rem;" onclick="GameController3.toyInput('blue')" title="海洋">🌊</button>
                    <button class="puzzle-btn" style="background:#e74c3c; padding: 15px; font-size: 1.4rem;" onclick="GameController3.toyInput('red')" title="楓葉">🍂</button>
                    <button class="puzzle-btn" style="background:#27ae60; padding: 15px; font-size: 1.4rem;" onclick="GameController3.toyInput('green')" title="草地">🌿</button>
                    <button class="puzzle-btn" style="background:#f39c12; padding: 15px; font-size: 1.4rem;" onclick="GameController3.toyInput('yellow')" title="向日葵">🌻</button>
                </div>
                <div id="toy-seq" style="margin-top:15px; font-size: 1.1rem; min-height: 30px; color: var(--color-accent);">按下的順序：</div>
                <div class="puzzle-actions" style="margin-top:15px;">
                    <button class="puzzle-btn" style="background: var(--color-accent);" onclick="GameController3.toySeq = []; document.getElementById('toy-seq').textContent = '按下的順序：'">重新開始</button>
                    <button class="puzzle-btn close-btn" onclick="document.getElementById('puzzle-modal').style.display='none'">放棄</button>
                </div>
            `;
            this.toySeq = [];
        } else if (puzzleId === 'puzzle_darkroom') {
            this.filmSeq = [];
            content.innerHTML = `
                <h3>排列底片</h3>
                <p>依照你認為正確的順序，點選這四張底片掛上晾乾架。</p>
                <div id="film-btns" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px;">
                    <button class="puzzle-btn" style="padding: 12px 20px;" onclick="GameController3.filmInput('雨')">☔ 梅雨</button>
                    <button class="puzzle-btn" style="padding: 12px 20px;" onclick="GameController3.filmInput('葉')">🍂 枯葉</button>
                    <button class="puzzle-btn" style="padding: 12px 20px;" onclick="GameController3.filmInput('花')">🌸 春光</button>
                    <button class="puzzle-btn" style="padding: 12px 20px;" onclick="GameController3.filmInput('日')">☀️ 烈日</button>
                </div>
                <div id="film-seq" style="font-size: 1rem; min-height: 25px; color: var(--color-accent); margin-bottom: 10px;">已選擇：</div>
                <div class="puzzle-actions">
                    <button class="puzzle-btn" style="background: var(--color-accent);" onclick="GameController3.filmSeq = []; document.getElementById('film-seq').textContent = '已選擇：'">重新選擇</button>
                    <button class="puzzle-btn close-btn" onclick="document.getElementById('puzzle-modal').style.display='none'">關閉</button>
                </div>
            `;
        } else if (puzzleId === 'puzzle_locker') {
            content.innerHTML = `
                <h3>鐵櫃密碼</h3>
                <p>輸入四位數密碼：</p>
                <div class="puzzle-actions">
                    <input type="text" id="puzzle-input" class="puzzle-input" placeholder="_ _ _ _" maxlength="4">
                    <button class="puzzle-btn" onclick="GameController3.checkPuzzle('locker')">解鎖</button>
                    <button class="puzzle-btn close-btn" onclick="document.getElementById('puzzle-modal').style.display='none'">放棄</button>
                </div>
            `;
        } else if (puzzleId === 'puzzle_medicine') {
            content.innerHTML = `
                <h3>藥盒密碼</h3>
                <p>10 月的日曆上，12 號被畫了一個大大的黑叉。<br>如果這是最後的極限，請輸入這天的日期（四位數）：</p>
                <div class="puzzle-actions">
                    <input type="text" id="puzzle-input" class="puzzle-input" placeholder="_ _ _ _" maxlength="4">
                    <button class="puzzle-btn" onclick="GameController3.checkPuzzle('medicine')">解鎖</button>
                    <button class="puzzle-btn close-btn" onclick="document.getElementById('puzzle-modal').style.display='none'">放棄</button>
                </div>
            `;
        } else if (puzzleId === 'puzzle_envelope') {
            content.innerHTML = `
                <h3>信件拼圖</h3>
                <p>信紙被撕成了四片。邊緣有編號，內容分別是：<br>1. 是因為我...<br>2. 我不告而別<br>3. 致 蒼：<br>4. 對不起<br>請輸入這四句話正確的邏輯順序編號：</p>
                <div class="puzzle-actions">
                    <input type="text" id="puzzle-input" class="puzzle-input" placeholder="_ _ _ _" maxlength="4">
                    <button class="puzzle-btn" onclick="GameController3.checkPuzzle('envelope')">拼湊</button>
                    <button class="puzzle-btn close-btn" onclick="document.getElementById('puzzle-modal').style.display='none'">放棄</button>
                </div>
            `;
        } else if (puzzleId === 'puzzle_cafe_seat') {
            content.innerHTML = `
                <h3>找尋失物</h3>
                <p>光曾經說過，他把驚喜藏在了「最靠近光」的地方。<br>在桌子底下的深處，你摸到了一個冰冷的圓環……</p>
                <div class="puzzle-actions">
                    <button class="puzzle-btn" onclick="GameController3.checkPuzzle('cafe_seat')">用力拉出來</button>
                    <button class="puzzle-btn close-btn" onclick="document.getElementById('puzzle-modal').style.display='none'">關閉</button>
                </div>
            `;
        } else if (puzzleId === 'puzzle_lighthouse') {
            content.innerHTML = `
                <h3>羅盤校準</h3>
                <p>將完整的羅盤放入底座。外圈刻著：<br>「當起點與終點重合，燈光將會亮起。」<br><br>請輸入指針應該指向的度數：</p>
                <div class="puzzle-actions">
                    <input type="number" id="puzzle-input" class="puzzle-input" placeholder="0-360">
                    <button class="puzzle-btn" onclick="GameController3.checkPuzzle('lighthouse')">確認方位</button>
                    <button class="puzzle-btn close-btn" onclick="document.getElementById('puzzle-modal').style.display='none'">關閉</button>
                </div>
            `;
        }
    },

    toySeq: [],
    filmSeq: [],

    toyInput(color) {
        this.toySeq.push(color);
        const dict = { 'yellow': '🌻向日葵', 'green': '🌿草地', 'red': '🍂楓葉', 'blue': '🌊海洋' };
        const el = document.getElementById('toy-seq');
        if(el) el.textContent = '按下的順序：' + this.toySeq.map(c => dict[c]).join(' → ');
        
        if (this.toySeq.length >= 4) {
            this.checkPuzzle('toy');
        }
    },

    filmInput(label) {
        this.filmSeq.push(label);
        const el = document.getElementById('film-seq');
        const labelNames = {'花':'🌸春光', '雨':'☔梅雨', '日':'☀️烈日', '葉':'🍂枯葉'};
        if(el) el.textContent = '已選擇：' + this.filmSeq.map(l => labelNames[l]).join(' → ');
        
        if (this.filmSeq.length >= 4) {
            this.checkPuzzle('darkroom');
        }
    },

    checkPuzzle(type) {
        const modal = document.getElementById('puzzle-modal');
        let success = false;
        
        if (type === 'mailbox') {
            const val = document.getElementById('puzzle-input').value;
            if (val === '57') {
                gameState3.puzzlesSolved.scene1.push('mailbox');
                this.addItem('baseball_card');
                success = true;
                this.triggerMemory('memory1', 'mailbox_area');
            }
        } 
        else if (type === 'toy') {
            const target = ['yellow', 'green', 'red', 'blue'];
            if (JSON.stringify(this.toySeq) === JSON.stringify(target)) {
                gameState3.puzzlesSolved.scene1.push('toy');
                this.addItem('compass_half');
                success = true;
                this.goToNode('bicycle_area');
            } else {
                this.toySeq = [];
                document.getElementById('toy-seq').textContent = '密碼錯誤，重新輸入';
                return;
            }
        }
        else if (type === 'darkroom') {
            const target = ['花', '雨', '日', '葉'];
            if (JSON.stringify(this.filmSeq) === JSON.stringify(target)) {
                gameState3.puzzlesSolved.scene2.push('darkroom');
                this.addItem('old_photo');
                success = true;
                this.triggerMemory('memory2', 'darkroom');
            } else {
                this.filmSeq = [];
                const el = document.getElementById('film-seq');
                if(el) el.textContent = '順序不對，請重新選擇';
                return;
            }
        }
        else if (type === 'locker') {
            const val = document.getElementById('puzzle-input').value;
            if (val === '0919') {
                gameState3.puzzlesSolved.scene2.push('locker');
                this.addItem('diary_book');
                success = true;
                this.goToNode('locker_area');
            }
        }
        else if (type === 'medicine') {
            const val = document.getElementById('puzzle-input').value;
            if (val === '1012') {
                if (!gameState3.puzzlesSolved.scene3) gameState3.puzzlesSolved.scene3 = [];
                gameState3.puzzlesSolved.scene3.push('medicine');
                this.addItem('medicine_bottle');
                success = true;
                this.goToNode('desk_area');
            }
        }
        else if (type === 'envelope') {
            const val = document.getElementById('puzzle-input').value;
            if (val === '3421') {
                if (!gameState3.puzzlesSolved.scene3) gameState3.puzzlesSolved.scene3 = [];
                gameState3.puzzlesSolved.scene3.push('envelope');
                this.addItem('unsent_letter');
                success = true;
                this.triggerMemory('memory_room', 'bed_area');
            }
        }
        else if (type === 'cafe_seat') {
            if (!gameState3.puzzlesSolved.scene4) gameState3.puzzlesSolved.scene4 = [];
            gameState3.puzzlesSolved.scene4.push('seat_found');
            this.addItem('compass_full');
            success = true;
            this.triggerMemory('memory3', 'window_seat');
        }
        else if (type === 'lighthouse') {
            const val = document.getElementById('puzzle-input').value;
            if (val === '45') {
                if (!gameState3.puzzlesSolved.scene5) gameState3.puzzlesSolved.scene5 = [];
                gameState3.puzzlesSolved.scene5.push('compass_placed');
                this.addItem('last_letter');
                success = true;
                this.triggerMemory('memory4', 'compass_lock');
            }
        }

        if (success) {
            modal.style.display = 'none';
        } else {
            const input = document.getElementById('puzzle-input');
            if(input) {
                input.value = '';
                input.placeholder = '錯誤！';
                input.style.borderColor = 'red';
            }
        }
    },

    // --- 結局處理 ---
    handleEnding(action) {
        document.getElementById('transition-overlay').classList.add('active');
        setTimeout(() => {
            document.getElementById('transition-overlay').classList.remove('active');
        }, 800);
        
        const overlay = document.getElementById('memory-overlay');
        overlay.classList.add('active');
        overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
        overlay.innerHTML = '<div class="typing-container" id="ending-text" style="color:white; font-size: 1.2rem; padding: 2rem; max-width: 80%; line-height: 1.8;"></div>';
        
        let text = "";
        if (action === 'ending_true') {
            text = "我收起那封信，走出燈塔。\n黎明的曙光正從海平線升起。\n\n「謝謝你，光。」\n「我會帶著這份溫暖，繼續寫下屬於我們的故事。」\n\n(真結局：晨曦中的約定)";
            for(let i=0; i<diaryEntries3.length; i++) {
                this.unlockDiary(i);
            }
        } else {
            text = "我坐在燈塔邊，看著手中的信被風吹皺。\n回憶很美，但我的時間似乎也停留在了那個夏天。\n\n(普通結局：永恆的夏蟬)";
        }

        let i = 0;
        const typeEnding = () => {
            if (i < text.length) {
                document.getElementById('ending-text').innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
                i++;
                setTimeout(typeEnding, 100);
            } else {
                const btn = document.createElement('button');
                btn.className = 'action-btn';
                btn.textContent = '返回主選單';
                btn.style.marginTop = '40px';
                btn.onclick = () => window.location.href = 'index.html';
                document.getElementById('ending-text').appendChild(document.createElement('br'));
                document.getElementById('ending-text').appendChild(btn);
            }
        };
        
        setTimeout(typeEnding, 1500);
    }
};

// 重新定義 handleAction 以支援結局
GameController3.handleAction = function(action) {
    if (action === 'next_scene') {
        document.getElementById('transition-overlay').classList.add('active');
        setTimeout(() => {
            gameState3.currentScene++;
            this.loadScene(gameState3.currentScene);
            setTimeout(() => {
                document.getElementById('transition-overlay').classList.remove('active');
            }, 500);
        }, 1000);
        return;
    }
    if (action.startsWith('puzzle_')) {
        this.openPuzzleModal(action);
        return;
    }
    if (action.startsWith('ending_')) {
        this.handleEnding(action);
        return;
    }
    if (action === 'go_home') {
        this.goHome();
    }
};

window.addEventListener('load', () => {
    GameController3.init();
});
