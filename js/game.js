const GameController = {
    typewriterTimeout: null,
    isTyping: false,
    currentTextStr: '',
    currentInputCheck: null,

    bgm: null,
    musicPlaying: false,
    currentBgmSrc: '',

    init() {
        this.currentBgmSrc = this.getBgmForScene(gameState.currentScene);
        this.initAudio(this.currentBgmSrc);
        this.loadScene(gameState.currentScene);
        setTimeout(() => {
            document.getElementById('transition-overlay').classList.remove('active');
        }, 500);
        
        document.getElementById('vn-input-submit').addEventListener('click', () => {
            this.handleInputSubmit();
        });
    },

    getBgmForScene(sceneId) {
        if (sceneId === 0 || sceneId === 1) return 'assets/audio/bgm1_house.mp3';
        if (sceneId === 2) return 'assets/audio/bgm1_train.mp3';
        if (sceneId === 3) return 'assets/audio/bgm1_sea.mp3';
        return 'assets/audio/bgm1_house.mp3';
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

    changeBGM(src) {
        if (this.currentBgmSrc === src) return;
        this.currentBgmSrc = src;
        
        this.bgm.pause();
        this.bgm.src = src;
        this.bgm.load();
        
        if (this.musicPlaying) {
            this.bgm.play().catch(e => console.log('Play prevented', e));
        }
    },

    toggleMusic() {
        if (!this.bgm) {
            this.currentBgmSrc = this.getBgmForScene(gameState.currentScene);
            this.initAudio(this.currentBgmSrc);
        }
        
        if (this.musicPlaying) {
            this.bgm.pause();
            this.musicPlaying = false;
            this.updateToggleBtn();
        } else {
            this.bgm.play().then(() => {
                this.musicPlaying = true;
                this.updateToggleBtn();
            }).catch(e => {
                console.log('Play prevented', e);
                // Cannot play, maybe user didn't interact or file is missing
            });
        }
    },

    goHome() {
        const overlay = document.getElementById('transition-overlay');
        overlay.classList.add('active');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    },

    loadScene(sceneId) {
        const scene = scenes[sceneId];
        if (!scene) return;
        
        if (this.bgm) {
            const newBgm = this.getBgmForScene(sceneId);
            this.changeBGM(newBgm);
        }

        const sceneView = document.getElementById('scene-view');
        sceneView.style.backgroundColor = scene.fallbackBg;
        sceneView.style.backgroundImage = `url('${scene.background}')`;
        
        this.updateInventoryUI();
        this.goToNode(scene.startNode);
    },

    goToNode(nodeId) {
        const scene = scenes[gameState.currentScene];
        const node = scene.nodes[nodeId];
        if (!node) return;
        
        if (node.onEnter) node.onEnter();
        
        const textBox = document.getElementById('vn-text');
        const choicesBox = document.getElementById('vn-choices-container');
        const inputBox = document.getElementById('vn-input-container');
        const inputField = document.getElementById('vn-input');
        
        choicesBox.innerHTML = '';
        inputBox.style.display = 'none';
        inputField.value = '';
        this.currentInputCheck = null;
        
        let textContent = typeof node.text === 'function' ? node.text() : node.text;
        
        this.typeText(textContent, () => {
            const inputType = typeof node.inputType === 'function' ? node.inputType() : node.inputType;
            if (inputType === 'text') {
                inputBox.style.display = 'flex';
                inputField.focus();
                this.currentInputCheck = node.checkAnswer;
            } else {
                let choices = typeof node.choices === 'function' ? node.choices() : (node.choices || []);
                choices.forEach(c => {
                    const btn = document.createElement('button');
                    btn.className = 'action-btn';
                    btn.textContent = c.label;
                    btn.onclick = () => this.goToNode(c.target);
                    choicesBox.appendChild(btn);
                });
            }
        });
    },

    handleInputSubmit() {
        if (!this.currentInputCheck) return;
        const val = document.getElementById('vn-input').value.trim();
        const nextNode = this.currentInputCheck(val);
        if (nextNode) {
            this.goToNode(nextNode);
        }
    },

    typeText(text, onComplete) {
        if (this.typewriterTimeout) clearTimeout(this.typewriterTimeout);
        
        const textBox = document.getElementById('vn-text');
        textBox.innerHTML = '';
        this.isTyping = true;
        this.currentTextStr = text;
        
        let idx = 0;
        
        const typeChar = () => {
            if (idx >= text.length) {
                this.isTyping = false;
                textBox.innerHTML = text.replace(/\n/g, '<br>');
                if (onComplete) onComplete();
                return;
            }
            
            let char = text.charAt(idx);
            if (char === '\n') {
                textBox.innerHTML += '<br>';
            } else {
                textBox.innerHTML += char;
            }
            idx++;
            this.typewriterTimeout = setTimeout(typeChar, 30);
        };
        typeChar();
    },

    transitionToNextScene() {
        const overlay = document.getElementById('transition-overlay');
        overlay.classList.add('active');
        
        setTimeout(() => {
            if (gameState.currentScene < Object.keys(scenes).length) {
                gameState.currentScene++;
                this.loadScene(gameState.currentScene);
                // 延遲後淡入
                setTimeout(() => {
                    overlay.classList.remove('active');
                }, 500);
            }
        }, 1500);
    },

    triggerEnding(type) {
        const overlay = document.getElementById('transition-overlay');
        overlay.classList.add('active');
        document.getElementById('vn-box').style.display = 'none';
        document.getElementById('inventory-bar').style.display = 'none';
        
        // 記憶回顧過場
        setTimeout(() => {
            const sceneView = document.getElementById('scene-view');
            sceneView.style.backgroundImage = 'none';
            sceneView.style.backgroundColor = '#000';
            
            const textBox = document.createElement('div');
            textBox.style.position = 'absolute';
            textBox.style.top = '50%';
            textBox.style.left = '50%';
            textBox.style.transform = 'translate(-50%, -50%)';
            textBox.style.color = '#fff';
            textBox.style.fontSize = '1.8rem';
            textBox.style.textAlign = 'center';
            textBox.style.zIndex = '1000';
            textBox.style.lineHeight = '1.6';
            textBox.style.opacity = '0';
            document.body.appendChild(textBox);
            
            overlay.classList.remove('active');
            
            let flashbacks = [
                '「她保留著每一張車票。」',
                '「她寫了信，但沒有寄出。」',
                '「她一直等你來了解這一切。」'
            ];
            
            let fIdx = 0;
            const flashNext = () => {
                if (fIdx < flashbacks.length) {
                    textBox.textContent = flashbacks[fIdx];
                    textBox.style.transition = 'opacity 1.5s ease';
                    textBox.style.opacity = 1;
                    fIdx++;
                    setTimeout(() => {
                        textBox.style.opacity = 0;
                        setTimeout(flashNext, 1500);
                    }, 3000); // 顯示停留時間
                } else {
                    this.showActualEnding(type, textBox);
                }
            };
            
            // 開始閃回文字
            setTimeout(flashNext, 1000);
            
        }, 1500);
    },

    showActualEnding(type, textBox) {
        const sceneView = document.getElementById('scene-view');
        textBox.style.color = 'var(--color-bg)';
        textBox.innerHTML = '';
        
        if (type === 'A') {
            sceneView.style.backgroundImage = `url('assets/scenes/ending-a.png')`;
            sceneView.style.backgroundSize = 'cover';
            sceneView.style.opacity = 0;
            sceneView.style.transition = 'opacity 4s ease';
            
            setTimeout(() => sceneView.style.opacity = 1, 100);
            
            setTimeout(() => {
                textBox.innerHTML = '「紗月站在門口，第一次覺得自己真的認識了她。不是作為高高在上的祖母，而是一個普通人。」<br><br><span style="font-size:2.5rem; color:var(--color-accent); font-weight:bold;">奈津的選擇，是愛。</span>';
                textBox.style.opacity = 1;
                textBox.style.backgroundColor = 'rgba(0,0,0,0.5)';
                textBox.style.padding = '30px';
                textBox.style.borderRadius = '8px';
            }, 3000);
        } else {
            sceneView.style.backgroundImage = `url('assets/scenes/ending-b.png')`;
            sceneView.style.backgroundSize = 'cover';
            sceneView.style.opacity = 0;
            sceneView.style.transition = 'opacity 4s ease';
            
            setTimeout(() => sceneView.style.opacity = 1, 100);
            
            setTimeout(() => {
                textBox.innerHTML = '「紗月離開了，帶著一個可能永遠沒有答案的問題。但也許有些記憶，原本就需要更漫長的時間才能讀懂。」<br><br><span style="font-size:2.5rem; color:#888;">只留下一絲遺憾的海風。</span>';
                textBox.style.opacity = 1;
                textBox.style.backgroundColor = 'rgba(0,0,0,0.6)';
                textBox.style.padding = '30px';
                textBox.style.borderRadius = '8px';
            }, 3000);
        }
        
        // 重新開始
        setTimeout(() => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = '重新開始這段回憶';
            btn.style.marginTop = '40px';
            btn.style.fontSize = '1.2rem';
            btn.style.padding = '15px 30px';
            btn.onclick = () => location.reload();
            textBox.appendChild(document.createElement('br'));
            textBox.appendChild(btn);
        }, 6000);
    },

    updateInventoryUI() {
        const list = document.getElementById('inventory-list');
        list.innerHTML = '';
        gameState.inventory.forEach(itemId => {
            let itemDef = this.findItemDef(itemId);
            if (itemDef) {
                const el = document.createElement('div');
                el.className = 'inventory-item';
                el.textContent = itemDef.icon;
                el.setAttribute('data-name', itemDef.name);
                el.onclick = () => this.inspectItem(itemId, itemDef);
                list.appendChild(el);
            }
        });
    },

    inspectItem(itemId, itemDef) {
        let desc = '';
        if (itemId === 'battery') desc = '一顆未生鏽的舊電池，似乎還有電力。';
        if (itemId === 'cabinet_key') desc = '一把小巧的黃銅鑰匙。';
        if (itemId === 'train_ticket') desc = '一張前往「終點站」的舊火車票，沒有打孔，代表從未使用過。';
        if (itemId === 'postcard') desc = '一張泛黃的明信片。翻到背面，有人刻意用粗體字寫下：「夏日海洋」（夏の海へ）。';
        if (itemId === 'diary_key') desc = '一把造型如貝殼般的精緻小鑰匙。';
        if (itemId === 'folded_paper') desc = '一張從筆記本上撕下來的殘頁。除了正面的字跡外，背面還用鉛筆輕輕寫下了一段簡譜：「Sol-Sol-Mi-La-Sol」。';
        if (itemId === 'letter') desc = '一封未寄出的信。信上寫著：「我選擇留下，因為有你們。即使未能看到遠方的海景，我也從不後悔。」';

        document.getElementById('item-modal-icon').textContent = itemDef.icon;
        document.getElementById('item-modal-name').textContent = itemDef.name;
        document.getElementById('item-modal-desc').textContent = desc;
        document.getElementById('item-modal').style.display = 'block';
    },

    findItemDef(itemId) {
        if (itemId === 'battery') return { icon: '🔋', name: '電池' };
        if (itemId === 'cabinet_key') return { icon: '🗝️', name: '櫃子鑰匙' };
        if (itemId === 'train_ticket') return { icon: '🎫', name: '舊火車票' };
        if (itemId === 'postcard') return { icon: '📮', name: '明信片' };
        if (itemId === 'diary_key') return { icon: '🔑', name: '日記鑰匙' };
        if (itemId === 'folded_paper') return { icon: '📄', name: '折疊紙' };
        if (itemId === 'letter') return { icon: '✉️', name: '未寄出的信' };
        return { icon: '❓', name: '未知道具' };
    }
};

window.onload = () => {
    GameController.init();
};
