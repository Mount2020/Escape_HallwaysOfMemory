const GameController = {
    typewriterTimeout: null,
    isTyping: false,
    currentTextStr: '',
    currentInputCheck: null,

    bgm: null,
    musicPlaying: false,

    init() {
        this.initAudio('assets/audio/bgm2.mp3');
        this.loadScene(gameState.currentScene);
        setTimeout(() => {
            document.getElementById('transition-overlay').classList.remove('active');
        }, 500);
        
        document.getElementById('vn-input-submit').addEventListener('click', () => {
            this.handleInputSubmit();
        });
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

    toggleMusic() {
        if (!this.bgm) {
            this.initAudio('assets/audio/bgm2.mp3');
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

    toggleVNBox(hide) {
        const vnBox = document.getElementById('vn-box');
        const showBtn = document.getElementById('show-vn-btn');
        if (hide) {
            vnBox.classList.add('hidden-mode');
            showBtn.style.display = 'block';
        } else {
            vnBox.classList.remove('hidden-mode');
            showBtn.style.display = 'none';
        }
    },

    loadScene(sceneId) {
        const scene = scenes[sceneId];
        if (!scene) return;
        
        const sceneView = document.getElementById('scene-view');
        sceneView.style.backgroundColor = scene.fallbackBg;
        if (scene.background) {
            sceneView.style.backgroundImage = `url('${scene.background}')`;
        } else {
            sceneView.style.backgroundImage = 'none';
        }
        
        this.updateInventoryUI();
        this.goToNode(scene.startNode);
    },

    showClues() {
        if (gameState.globalClues.length === 0) {
            alert('筆記裡目前空蕩蕩的。');
            return;
        }
        const list = document.getElementById('clue-list');
        list.innerHTML = '';
        gameState.globalClues.forEach(clue => {
            let li = document.createElement('li');
            li.textContent = clue;
            li.style.marginBottom = '10px';
            list.appendChild(li);
        });
        document.getElementById('clue-modal').style.display = 'block';
    },

    goToNode(nodeId) {
        const scene = scenes[gameState.currentScene];
        const node = scene.nodes[nodeId];
        if (!node) return;
        
        if (node.onEnter) node.onEnter();
        
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
            }
            
            let choices = typeof node.choices === 'function' ? node.choices() : (node.choices || []);
            choices.forEach(c => {
                const btn = document.createElement('button');
                btn.className = 'action-btn';
                btn.textContent = c.label;
                btn.onclick = () => {
                    if (c.wrongFeedback) {
                        this.showDynamicFeedback(c.target || 'main', c.wrongFeedback);
                    } else {
                        this.goToNode(c.target);
                    }
                };
                choicesBox.appendChild(btn);
            });
        });
    },

    handleInputSubmit() {
        if (!this.currentInputCheck) return;
        const val = document.getElementById('vn-input').value.trim();
        const result = this.currentInputCheck(val);
        
        if (typeof result === 'string') {
            this.goToNode(result);
        } else if (result && result.target) {
            if (result.feedback) {
                this.showDynamicFeedback(result.target, result.feedback);
            } else {
                this.goToNode(result.target);
            }
        }
    },

    showDynamicFeedback(targetNodeId, feedbackText) {
        const choicesBox = document.getElementById('vn-choices-container');
        const inputBox = document.getElementById('vn-input-container');
        choicesBox.innerHTML = '';
        inputBox.style.display = 'none';
        this.currentInputCheck = null;

        const textBox = document.getElementById('vn-text');
        this.typeText(`<span style="color: #a84f4f;">${feedbackText}</span>`, () => {
            setTimeout(() => {
                this.goToNode(targetNodeId);
            }, 2500);
        });
    },

    typeText(text, onComplete) {
        if (this.typewriterTimeout) clearTimeout(this.typewriterTimeout);
        
        const textBox = document.getElementById('vn-text');
        this.currentTextStr = '';
        this.isTyping = true;
        
        let idx = 0;
        let isHTML = false;

        const typeChar = () => {
            if (idx >= text.length) {
                this.isTyping = false;
                textBox.innerHTML = text.replace(/\n/g, '<br>');
                if (onComplete) onComplete();
                return;
            }
            
            // 跳過 HTML 標籤
            if (text.charAt(idx) === '<') isHTML = true;
            if (isHTML) {
                this.currentTextStr += text.charAt(idx);
                if (text.charAt(idx) === '>') isHTML = false;
                idx++;
                typeChar(); // 無延遲處理標籤
                return;
            }

            let char = text.charAt(idx);
            if (char === '\n') {
                this.currentTextStr += '<br>';
            } else {
                this.currentTextStr += char;
            }
            textBox.innerHTML = this.currentTextStr;
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
        if (itemId === 'crest_half') desc = '半片沉重的黃銅徽章，上面刻著獅子的前半身。';
        if (itemId === 'desk_key') desc = '一把簡單的銀色小鑰匙，似乎能打開某個抽屜。';
        if (itemId === 'wine_bottle') desc = '一瓶紅酒。酒標已經不見了，軟木塞上印著一組奇怪的經緯度座標。';
        if (itemId === 'safe_key') desc = '生鏽的黃銅大鑰匙，極其沉重而且做工粗糙。';
        if (itemId === 'attic_map') desc = '閣樓的平面圖。背面塗寫著：家=12, 法院=34, 學校=15。';
        if (itemId === 'gear') desc = '一個金屬製的精密齒輪，邊緣沾滿了機油。';
        if (itemId === 'tape_half') desc = '一條打滿孔洞的紙帶，用來給八音盒讀取旋律。上面有火車壓痕。';
        if (itemId === 'silver_key') desc = '一把造型純淨、做工精美的銀色鑰匙，拿在手中有一絲涼意。';
        if (itemId === 'will_document') desc = '父親親筆寫的最終遺囑，將這棟別墅連同他一生未曾說出口的歉意，一併交給了我。';

        document.getElementById('item-modal-icon').textContent = itemDef.icon;
        document.getElementById('item-modal-name').textContent = itemDef.name;
        document.getElementById('item-modal-desc').textContent = desc;
        document.getElementById('item-modal').style.display = 'block';
    },

    findItemDef(itemId) {
        if (itemId === 'crest_half') return { icon: '🦁', name: '徽章半塊' };
        if (itemId === 'desk_key') return { icon: '🔑', name: '抽屜鑰匙' };
        if (itemId === 'wine_bottle') return { icon: '🍷', name: '舊紅酒' };
        if (itemId === 'safe_key') return { icon: '🗝️', name: '黃銅大鑰匙' };
        if (itemId === 'attic_map') return { icon: '🗺️', name: '閣樓平面圖' };
        if (itemId === 'gear') return { icon: '⚙️', name: '金屬齒輪' };
        if (itemId === 'tape_half') return { icon: '🎼', name: '琴譜孔帶' };
        if (itemId === 'silver_key') return { icon: '🗝️', name: '銀色鑰匙' };
        if (itemId === 'will_document') return { icon: '📜', name: '真正的遺囑' };
        return { icon: '❓', name: '未知道具' };
    }
};

window.onload = () => {
    GameController.init();
};
