const scenes = {
    1: {
        id: 1,
        background: 'assets/scenes/game2_scene1.png',
        startNode: 'opening',
        nodes: {
            'opening': {
                text: '【序章：遺囑與回鄉】\n\n我是中村健一，一個四處奔波的平庸律師。\n十年前，因為沒能考上法官，我與那位嚴厲且永遠高高在上的法官父親大吵一架，從此離家出走。十年來，我們沒有說過一句話。\n\n直到昨天，我收到了一份公證文件——他過世了。\n遺產是這棟位於山丘上的廢棄西式老宅。但在厚厚的文件中，夾著他親筆寫下的一張字條：\n「在你拿走任何實質的財產之前，請先找到我真正想留給你的東西。」\n\n我站在這棟緊閉的大門前。我不確定這趟旅程究竟是為了解謎，還是為了...和解。',
                choices: [{ label: '推開厚重的木門，進入屋內', target: 'main' }]
            },
            'main': {
                text: '【第一關：玄關與接待室】\n\n門軸發出乾澀的悲鳴，揚起的灰塵在斜陽下飛舞。這裡充滿了我所不熟悉的那種氣味——他晚年獨居時孤傲的氣味。\n『在你拿走任何東西之前，請先找到我真正想留給你的。』公證文件裡夾著的那句話，像極了他生前習慣的法庭盤問。',
                choices: () => {
                    let c = [];
                    c.push({ label: '調查牆角的巨大老爺鐘', target: 'clock_inspect' });
                    c.push({ label: '查看接待桌上的訪客登記簿', target: 'book_inspect' });
                    c.push({ label: '調查門旁的私人信箱', target: 'mailbox_inspect' });
                    if (StateManager.hasItem('crest_half')) {
                        c.push({ label: '調查壁爐上方殘缺的家族紋章 (多步解謎)', target: 'crest_step1' });
                    }
                    if (StateManager.getFlag('hallwayOpen')) {
                        c.push({ label: '走進壁爐後的暗門 (前往書房)', target: 'next_level' });
                    }
                    return c;
                }
            },
            'clock_inspect': {
                text: () => StateManager.getFlag('clockChecked') 
                    ? '鐘擺依舊停滯著，指針永遠卡在 10:24。這是我第一次注意到這件事。' 
                    : '一座巨大的黑木老爺鐘。鐘擺早已停滯，指針永遠卡在 10:24。\n鐘面下方有一個暗格，需要放入什麼東西才能啟動。',
                choices: () => {
                    let c = [{ label: '退開', target: 'main' }];
                    if (!StateManager.getFlag('clockChecked')) {
                        c.unshift({ label: '記下這個停滯的時間', target: 'clock_clue' });
                    }
                    return c;
                }
            },
            'clock_clue': {
                text: '我將這個奇特的時間記在筆記裡。我們父子的時間，是不是也停在了某個 10 月 24 日？',
                onEnter: () => {
                    StateManager.setFlag('clockChecked', true);
                    StateManager.addClue('停滯的老爺鐘：時間永遠卡在了 10:24。');
                },
                choices: [{ label: '返回', target: 'main' }]
            },
            'book_inspect': {
                text: () => StateManager.getFlag('registerRead')
                    ? '訪客登記簿上寫著奇怪的推演：A-03, C-15, D-24...'
                    : '皮質的訪客登記簿。最後一頁根本不是訪客紀錄，而是父親生前寫下的某種密碼推演：「A-03, C-15, D-24」。\n中間有一筆「B-??」被撕去了。',
                onEnter: () => {
                    if (!StateManager.getFlag('registerRead')) {
                        StateManager.setFlag('registerRead', true);
                        StateManager.addClue('登記簿密碼推演：「A-03, C-15, D-24」。中間的 B 似乎規律遺失了。');
                    }
                },
                choices: [{ label: '闔上登記簿', target: 'main' }]
            },
            'mailbox_inspect': {
                text: () => StateManager.hasItem('crest_half')
                    ? '黃銅信箱已經被打開，裡面現在空了。'
                    : '門旁掛著一個私人的黃銅信箱。上面有一個兩位數密碼轉盤。\n旁邊刻著一段話：「下一個（B）來訪者，將帶走秘密」。',
                choices: () => StateManager.hasItem('crest_half') ? [{ label: '返回', target: 'main' }] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.hasItem('crest_half') ? null : 'text',
                checkAnswer: (val) => {
                    if (val === '08' || val === '8') return 'mailbox_solved';
                    if (val === '07' || val === '15') return { target: 'mailbox_inspect', feedback: '密碼盤卡死了。雖然數學上合理，但健一直覺這不是數字遊戲，或許更像是某種字首？' };
                    return { target: 'mailbox_inspect', feedback: '密碼不對。健一嘆了口氣，也許該重新看看訪客登記簿。' };
                }
            },
            'mailbox_solved': {
                text: '密碼鎖「喀」一聲旋開。信箱裡沒有信，只有一塊沉甸甸的【獅紋徽章半塊】。\n\n「3, 8, 15, 24... 相鄰數字的差值是 5, 7, 9 逐漸遞增。或者是位置數加一的平方再減一。父親生前最喜歡考我這種數學邏輯，我居然還記得。」',
                onEnter: () => {
                    StateManager.addItem('crest_half');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收下徽章並返回', target: 'main' }]
            },
            'crest_step1': {
                text: '【機關破解步驟 1/2】\n壁爐上方有一個殘缺的雕花紋章。半邊的紋章空缺著。你將剛找到的半塊徽章放了上去。',
                choices: [
                    { label: '用力往下壓', target: 'crest_step2' },
                    { label: '往左側旋轉', target: 'main', wrongFeedback: '徽章被卡住轉不過去，似乎不是這個方向。' }
                ]
            },
            'crest_step2': {
                text: '【機關破解步驟 2/2】\n徽章被壓下後，壁爐發出輕微的震動，但似乎還差一個步驟才能完全解開鎖扣。',
                choices: [
                    { label: '將徽章往右拔出', target: 'main', wrongFeedback: '這太暴力了，徽章紋絲不動。' },
                    { label: '順時針轉動徽章', target: 'crest_solved' }
                ]
            },
            'crest_solved': {
                text: '徽章嚴絲合縫地轉入正確位置。壁爐發出沉悶的機械運轉聲，緩緩向側邊移開，露出一條通往深處的幽暗走廊。\n\n「他總是把家族榮譽看得比一切都重，甚至比我還重。」',
                onEnter: () => {
                    StateManager.setFlag('hallwayOpen', true);
                },
                choices: [{ label: '退開', target: 'main' }]
            },
            'next_level': {
                text: '牆內的走廊吹來一陣冷風。我跨過門檻，走進了他那個永遠對我緊閉的權威領域。',
                choices: [{ label: '進入書房', target: 'do_transition' }]
            },
            'do_transition': {
                text: '前往下一區...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.transitionToNextScene();
                }
            }
        }
    },
    2: {
        id: 2,
        background: 'assets/scenes/game2_scene2.png',
        startNode: 'main',
        nodes: {
            'main': {
                text: '【第二關：父親的書房】\n\n巨大的胡桃木書架直達天花板，藏書多為厚重的法學詞典。空氣中帶著一絲微酸的紙張霉味。只有一盞孤零零的綠色玻璃罩桌燈，讓這裡看起來像是一個審判庭。',
                choices: () => {
                    let c = [];
                    c.push({ label: '調查書桌上攤開的卷宗與訃聞', target: 'desk_inspect' });
                    c.push({ label: '調查抽屜裡的精緻雪茄盒', target: 'cigar_inspect' });
                    c.push({ label: '查看書架上的《民法大全》', target: 'books_inspect' });
                    if (StateManager.hasItem('wine_bottle')) {
                        c.push({ label: '調查落地窗旁的巨大地球儀', target: 'globe_inspect' });
                    }
                    return c;
                }
            },
            'books_inspect': {
                text: () => StateManager.getFlag('booksSolved')
                    ? '書架上的暗格已經開啟，裡面空了。'
                    : '書架上一排明顯被翻動過的《民法大全》。四本書的羅馬數字順序被打亂 (I, III, IV, VII)，需要嘗試重新排列它們。',
                choices: () => StateManager.getFlag('booksSolved') ? [{ label: '返回', target: 'main' }] : [
                    { label: '排列：I, III, IV, VII', target: 'main', wrongFeedback: '書本放回去後毫無反應，順序的正常遞增似乎行不通。' },
                    { label: '排列：IV, I, VII, III', target: 'books_solved' },
                    { label: '排列：VII, IV, III, I', target: 'main', wrongFeedback: '倒序排列也沒有任何機關被觸發。' },
                    { label: '退開', target: 'main' }
                ]
            },
            'books_solved': {
                text: '書本歸位後，後方的木板緩緩降下，露出一個隱藏的小暗格。裡面放著一把【書桌鑰匙】！',
                onEnter: () => {
                    StateManager.setFlag('booksSolved', true);
                    StateManager.addItem('desk_key');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收下鑰匙返回', target: 'main' }]
            },
            'desk_inspect': {
                text: () => StateManager.hasItem('desk_key') 
                    ? '你用剛找到的鑰匙打開了書桌下方，裡面放著父親的生平訃聞。上面寫著他出生於 1935 年。旁邊抽屜掛著健一生平第一張律師執業證書：「授予... 出生於 1972 年」。' 
                    : '書桌主抽屜緊緊鎖著。似乎需要一把鑰匙。',
                onEnter: () => {
                    if (StateManager.hasItem('desk_key') && !StateManager.getFlag('obitRead')) {
                        StateManager.setFlag('obitRead', true);
                        StateManager.addClue('父親的訃聞：出生 1935 年。');
                        StateManager.addClue('健一的律師證書：出生 1972 年。');
                    }
                },
                choices: [{ label: '返回', target: 'main' }]
            },
            'cigar_inspect': {
                text: () => StateManager.hasItem('wine_bottle')
                    ? '雪茄盒打開著，裡面放著一張男嬰的照片。'
                    : '抽屜裡的一個精緻雪茄盒，上面有一個四位數密碼鎖。\n密碼提示極小字寫著：「生辰之上，延續之始」。',
                choices: () => StateManager.hasItem('wine_bottle') ? [{ label: '返回', target: 'main' }] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.hasItem('wine_bottle') ? null : 'text',
                checkAnswer: (val) => {
                    if (val === '1935') return { target: 'cigar_inspect', feedback: '密碼錯誤。「他真會用自己的出生年這麼無聊的數字嗎？這不像是他的作風。」健一搖了搖頭。' };
                    if (val === '1972') return 'cigar_solved';
                    return { target: 'cigar_inspect', feedback: '密碼不對。這似乎不是正確的年份。' };
                }
            },
            'cigar_solved': {
                text: '鎖扣解開了。裡面沒有雪茄，只有一瓶年份久遠的【紅酒】與一張健一小時候的照片。\n\n「他居然把我的照片藏在最私密的雪茄盒裡...我以為他早就把有關我的一切都扔了。」',
                onEnter: () => {
                    StateManager.addItem('wine_bottle');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收下紅酒並返回', target: 'main' }]
            },
            'globe_inspect': {
                text: '巨大的地球儀卡死了，似乎必須轉到特定的經緯度方位。你想起剛剛找到的紅酒軟木塞上正好有一組經緯度座標。',
                choices: [
                    { label: '依照軟木塞上的座標轉動地球儀', target: 'globe_solved' },
                    { label: '退開', target: 'main' }
                ]
            },
            'globe_solved': {
                text: '地球儀應聲向兩側彈開，露出一條掩藏在地板下、通往深處的石磚通道。\n「原來這棟房子的地下，還有他不為人知的空間。」',
                choices: [{ label: '走入地下通道', target: 'do_transition' }]
            },
            'do_transition': {
                text: '前往下一區...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.transitionToNextScene();
                }
            }
        }
    },
    3: {
        id: 3,
        background: 'assets/scenes/game2_scene3.png',
        fallbackBg: '#1b221e',
        startNode: 'main',
        nodes: {
            'main': {
                text: '【第三關：地下酒窖】\n\n溫度驟降，四壁是粗糙的石磚，長滿了暗綠色的苔蘚。空氣裡帶著發酵的酸甜味與濕冷的泥土氣息。昏暗的鎢絲燈泡閃爍不定，酒架上的酒瓶像是一排排沉默的衛兵。',
                choices: () => {
                    let c = [];
                    c.push({ label: '調查牆上的古董溫度計機關', target: 'temp_inspect' });
                    c.push({ label: '查看最深處的木製酒架', target: 'wine_inspect' });
                    c.push({ label: '調查牆上的保險絲與隱藏畫布', target: 'uv_inspect' });
                    if (StateManager.getFlag('safeUnlocked')) {
                        c.push({ label: '走向通往閣樓的暗門', target: 'next_level' });
                    } else if (StateManager.getFlag('uvLit')) {
                        c.push({ label: '調查地上的生鏽保險箱', target: 'safe_inspect' });
                    }
                    return c;
                }
            },
            'temp_inspect': {
                text: () => StateManager.getFlag('tempSolved')
                    ? '溫度計指針穩穩停在 12 度，前方的鐵柵欄已經升起。'
                    : '牆上的古董溫度計旁連接著三個閥門。必須將酒窖溫度精準控制在 12 度，前方的鐵柵欄才會升起。',
                choices: () => StateManager.getFlag('tempSolved') ? [{ label: '返回', target: 'main' }] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.getFlag('tempSolved') ? null : 'text',
                checkAnswer: (val) => {
                    if (val === '12') return 'temp_solved';
                    return { target: 'temp_inspect', feedback: '指針轉動了一下又掉下來，溫度不對，鐵柵欄毫無反應。' };
                }
            },
            'temp_solved': {
                text: '「喀啦——」鐵柵欄緩緩升起，露出更深處的酒架。\n「他總是喜歡把事物控制在最完美的狀態，包括我。」',
                onEnter: () => StateManager.setFlag('tempSolved', true),
                choices: [{ label: '返回', target: 'main' }]
            },
            'wine_inspect': {
                text: () => StateManager.hasItem('safe_key')
                    ? '你已經解開了酒架的謎題。'
                    : (StateManager.getFlag('tempSolved') 
                        ? '酒架上有五個空位，分別標示著五個年份：1912, 1935, 1972, 1998, 2015。\n你的手中有一瓶剛從書房拿來、沒有酒標的紅酒，該放在哪個位置？'
                        : '前方的鐵柵欄擋住了去路，無法靠近酒架。'),
                choices: () => {
                    if (StateManager.hasItem('safe_key') || !StateManager.getFlag('tempSolved')) return [{ label: '返回', target: 'main' }];
                    return [
                        { label: '放進 1935 年的空位', target: 'main', wrongFeedback: '瓶身卡住了，這不是屬於他出生的年份。' },
                        { label: '放進 1972 年的空位', target: 'main', wrongFeedback: '瓶身卡住了。雖然這是我出生的年份，但感覺不對。' },
                        { label: '放進 1998 年的空位', target: 'wine_solved' },
                        { label: '退開', target: 'main' }
                    ];
                }
            },
            'wine_solved': {
                text: '紅酒完美地推入 1998 年的空位中。機關啟動，從酒架中彈出了一張紙條：【保險箱密碼的一部分：左3, 右1】。\n\n「1998年...那是我因考不上法學院，和他大吵一架離家的那一年。」',
                onEnter: () => {
                    StateManager.addClue('酒架線索：保險箱密碼包含 左3, 右1。');
                    StateManager.setFlag('wineSolved', true);
                },
                choices: [{ label: '返回', target: 'main' }]
            },
            'uv_inspect': {
                text: () => StateManager.getFlag('uvLit')
                    ? '紫外光燈泡亮起，畫布上浮現螢光字跡：『我們都在釀造自己的苦果 (左4)』'
                    : '牆上有一盞破舊的紫外光燈泡與一張空白畫布。旁邊的保險絲盒被打開了，兩條電線垂在外面。',
                choices: () => StateManager.getFlag('uvLit') ? [{ label: '返回', target: 'main' }] : [
                    { label: '將紅色與藍色電線接合', target: 'uv_solved' },
                    { label: '將紅色與接地線接合', target: 'main', wrongFeedback: '發出危險的火花！健一趕緊鬆手。' },
                    { label: '退開', target: 'main' }
                ]
            },
            'uv_solved': {
                text: '通電成功，紫外光燈泡接通！空白畫布上浮現出螢光字跡：『我們都在釀造自己的苦果 (左4)』',
                onEnter: () => {
                    StateManager.addClue('畫布線索：保險箱密碼最後一步是 左4。');
                    StateManager.setFlag('uvLit', true);
                },
                choices: [{ label: '記下線索並返回', target: 'main' }]
            },
            'safe_inspect': {
                text: '生鏽的保險箱上只有單一轉盤。根據筆記裡的線索，必須一氣呵成輸入正確的三組方向組合。',
                choices: [
                    { label: '左4, 右1, 左3', target: 'main', wrongFeedback: '密碼盤卡住了。順序似乎錯了。' },
                    { label: '左3, 右1, 左4', target: 'safe_solved' },
                    { label: '左3, 左4, 右1', target: 'main', wrongFeedback: '密碼盤卡住了。順序不對。' },
                    { label: '退開', target: 'main' }
                ]
            },
            'safe_solved': {
                text: '保險箱沉重地打開。裡面沒有金條，只有一把【生鏽黃銅鑰匙】和一張折疊的【閣樓平面圖】。\n「他守護的不是財富，而是比那更沉重的東西。通往閣樓的鑰匙...他為什麼要藏在地下底層？」',
                onEnter: () => {
                    StateManager.addItem('safe_key');
                    StateManager.addItem('attic_map');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                    StateManager.setFlag('safeUnlocked', true);
                },
                choices: [{ label: '前往閣樓', target: 'next_level' }]
            },
            'next_level': {
                text: '我拿著鑰匙走向隱藏在酒窖最後方的暗梯。從最深暗的地下室，走向屋子的最高處。我覺得自己不是在尋找遺產，而是在剖析他的大腦。',
                choices: [{ label: '前往閣樓', target: 'do_transition' }]
            },
            'do_transition': {
                text: '前往下一區...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.transitionToNextScene();
                }
            }
        }
    },
    4: {
        id: 4,
        background: 'assets/scenes/game2_scene4.png',
        fallbackBg: '#2a2a30',
        startNode: 'main',
        nodes: {
            'main': {
                text: '【第四關：閣樓】\n\n屋頂是傾斜的，木樑上掛滿了蜘蛛網。只有一扇天窗透進蒼白的月光。四處堆滿了用紙箱封存的舊物，空氣悶熱且靜謐，彷彿時間被徹底封鎖。',
                choices: () => {
                    let c = [];
                    c.push({ label: '調查桌上攤開的褪色地圖', target: 'map_inspect' });
                    c.push({ label: '調查箱子裡的老舊鐵皮火車', target: 'train_inspect' });
                    c.push({ label: '調查角落的殘缺音樂盒', target: 'music_inspect' });
                    if (StateManager.hasItem('silver_key') || StateManager.hasItem('safe_key')) {
                        c.push({ label: '面對通往頂樓花園的鐵門', target: 'door_inspect' });
                    }
                    return c;
                }
            },
            'map_inspect': {
                text: () => StateManager.hasItem('gear')
                    ? '地圖底座的暗格已經打開，齒輪已被拿走。'
                    : '地圖底座有一個兩位數輸入裝置。',
                choices: () => StateManager.hasItem('gear') ? [{ label: '返回', target: 'main' }] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.hasItem('gear') ? null : 'text',
                checkAnswer: (val) => {
                    if (val === '61') return 'map_solved';
                    return { target: 'map_inspect', feedback: '錯誤。健一看了看背包裡的閣樓平面圖，背面似乎有這些地點對應的數字(家12, 法院34, 學校15)。' };
                }
            },
            'map_solved': {
                text: '「喀噠」一聲，底座彈開，裡面放著一個沉重的【金屬齒輪】。\n「他每天的路線只有這兩點一線，那時的他，是不是也很孤單？」',
                onEnter: () => {
                    StateManager.addItem('gear');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收下齒輪', target: 'main' }]
            },
            'train_inspect': {
                text: () => StateManager.getFlag('trainSolved')
                    ? '火車車廂打開著，理頭空蕩蕩的。'
                    : '裝著鐵皮火車的木箱上有一個四位數密碼鎖。旁邊壓著一張紙條：「密碼是回到我們時間停滯的那一刻」。',
                choices: () => StateManager.getFlag('trainSolved') ? [{ label: '返回', target: 'main' }] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.getFlag('trainSolved') ? null : 'text',
                checkAnswer: (val) => {
                    if (val === '1024') return 'train_solved';
                    if (val === '1998' || val === '1972') return { target: 'train_inspect', feedback: '密碼錯誤。但紙條上說的是「時間停滯的那一刻」，也許不是年份而是一個具體的指針時間點？大廳的那個鐘...' };
                    return { target: 'train_inspect', feedback: '密碼錯誤。健一覺得，大廳裡那個壞掉的老爺鐘，是指著幾點來著？可以看看線索筆記。' };
                }
            },
            'train_solved': {
                text: '火車車廂彈開！裡面是一封未開封的信，寫著『給18歲的健一』，旁邊還放著半張打孔的【琴譜孔帶】。',
                onEnter: () => {
                    StateManager.setFlag('trainSolved', true);
                    StateManager.addItem('tape_half');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '拆開信件閱讀', target: 'train_letter' }]
            },
            'train_letter': {
                text: '信很短，平日剛硬的筆跡竟有些凌亂：\n『健一，當你看見這封信時，也許已經提著行李離開了。\n你昨晚說得對，我用法律的嚴苛與對秩序的病態執著，逼走了我唯一的兒子。我停下了客廳那座鐘，因為我不敢面對沒有你的時間流逝。\n\n我很抱歉，從來沒學會怎麼當一個父親。』\n\n我的手微微顫抖。「原來...這就是他一生未能在法庭上承認的敗訴。」',
                onEnter: () => {
                    StateManager.addClue('十八歲的信：「我停下了鐘，不敢面對沒有你的時間。我很抱歉，沒學會怎麼當父親。」');
                },
                choices: [{ label: '將信與孔帶收好並返回', target: 'main' }]
            },
            'music_inspect': {
                text: () => StateManager.hasItem('silver_key')
                    ? '音樂盒已經開啟，裡面空空如也。'
                    : '角落的木盒打開，是個殘缺的八音盒。旁邊少了一個齒輪，並且上面沒有讀取旋律的打孔紙帶。',
                choices: () => {
                    if (StateManager.hasItem('silver_key')) return [{ label: '返回', target: 'main' }];
                    if (StateManager.hasItem('gear') && StateManager.hasItem('tape_half')) {
                        return [
                            { label: '裝上金屬齒輪與半張孔帶', target: 'music_solved' },
                            { label: '退開', target: 'main' }
                        ];
                    }
                    return [{ label: '退開', target: 'main' }];
                }
            },
            'music_solved': {
                text: '裝上齒輪後，你將半張孔帶放入。音樂盒輕輕轉動，發出清脆而悲傷的爵士搖籃曲。暗格隨著音樂彈開，裡面是一把精緻的【銀色鑰匙】！',
                onEnter: () => {
                    StateManager.addItem('silver_key');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收下鑰匙', target: 'main' }]
            },
            'door_inspect': {
                text: '通往頂樓花園的鐵門上，有兩個鎖孔：一個是黃銅的孔隙（象徵過去的禁錮），一個是純銀的孔隙（象徵諒解的心）。\n只能選擇一把插入，另一把將會報廢。',
                choices: () => {
                    let opts = [];
                    if (StateManager.hasItem('safe_key')) opts.push({ label: '插入地下室找到的黃銅鑰匙', target: 'main', wrongFeedback: '黃銅鑰匙太過粗糙，卡在鎖孔裡轉不動，強行扭轉鑰匙就斷了...這顯然是不正確的選擇。' });
                    if (StateManager.hasItem('silver_key')) opts.push({ label: '插入八音盒裡的銀色鑰匙', target: 'door_solved' });
                    opts.push({ label: '退開', target: 'main' });
                    return opts;
                }
            },
            'door_solved': {
                text: '銀色鑰匙順暢地滑入並轉動，沉重的鐵門向外推開。夜風帶著花香與涼意湧入。\n在一切的最高處，等待著我的是他最深的沉默。',
                choices: [{ label: '前往頂樓花園', target: 'do_transition' }]
            },
            'do_transition': {
                text: '前往下一區...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.transitionToNextScene();
                }
            }
        }
    },
    5: {
        id: 5,
        background: 'assets/scenes/game2_scene5.png',
        fallbackBg: '#1f2e26',
        startNode: 'main',
        nodes: {
            'main': {
                text: '【第五關：花園與最終房間】\n\n這是一個建在屋頂的玻璃溫室花園，與下方屋子的壓抑截然不同。月光透過玻璃灑在蒼翠的植物上，中央有一張白色的藤椅和一圓桌。這裡如同他生前不受冷漠世俗打擾的最後避風港。',
                choices: () => {
                    let c = [];
                    if (!StateManager.getFlag('flowerSolved')) {
                        c.push({ label: '調查枯萎與盛開的花圃', target: 'flower_inspect' });
                    } else if (!StateManager.hasItem('will_document')) {
                        c.push({ label: '調查被水沖刷出的石板', target: 'stone_inspect' });
                    } else {
                        c.push({ label: '調查圓桌上的木盒與終章抉擇', target: 'box_inspect' });
                    }
                    return c;
                }
            },
            'flower_inspect': {
                text: '四個花盆上各刻著一句短詩，需要按照植物的生長週期(種子、發芽、盛開、凋零)來為這四個盆栽重新排序。',
                choices: [
                    { label: '依序排好：種子、發芽、盛開、凋零', target: 'flower_solved' },
                    { label: '隨便排列', target: 'main', wrongFeedback: '花盆的卡榫無法咬合，沒有任何事情發生。' },
                    { label: '退開', target: 'main' }
                ]
            },
            'flower_solved': {
                text: '花圈重新排列後，一旁隱藏的水閥自動開啟，水流沖刷出地板裡一塊滿是泥濘的機關石板。\n「生命的枯榮有其規律，遺憾的也是。」',
                onEnter: () => StateManager.setFlag('flowerSolved', true),
                choices: [{ label: '調查出現的石板', target: 'main' }]
            },
            'stone_inspect': {
                text: '石板被水洗去淤泥後，露出一個古老的字母與拼字盤。\n上面用父親剛硬的筆跡刻著一句話：\n「所有的懲罰都有盡頭。唯有『__ __』，才能讓生者真正自由。」\n\n(需要填入代表這兩個字的核心詞彙，中文或英文皆可)',
                choices: [{ label: '退開', target: 'main' }],
                inputType: 'text',
                checkAnswer: (val) => {
                    let ans = val.toUpperCase().trim();
                    if (ans === 'FORGIVENESS' || ans === '寬恕' || ans === '原諒') return 'stone_solved';
                    return { target: 'stone_inspect', feedback: '拼字盤卡住。健一心想，什麼東西才能讓互相折磨的兩人真正自由？是「原諒」還是某種「寬恕」？' };
                }
            },
            'stone_solved': {
                text: '石板發出清脆的解鎖聲。圓桌的玻璃桌面緩緩滑開，露出一個精緻的木盒。\n裡面平放著一卷羊皮紙，上面寫著【真正的遺囑】。',
                onEnter: () => {
                    StateManager.addItem('will_document');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '拿起遺囑', target: 'main' }]
            },
            'box_inspect': {
                text: '我展開了那張泛黃的羊皮紙。這是一份財產轉讓同意書。\n但在冗長的法律條文下方，父親用他那熟悉的筆跡寫著一句話：\n\n「健一，這棟房子裡藏著我所有的固執與控制欲。如果你願意原諒一個不知道怎麼當父親的男人，就簽下你的名字。如果你覺得這份愛太過沉重，你可以隨時轉身離開。我不再強求。」\n\n同意書的最末端，一個空白的簽名欄靜靜地等待著我。\n抉擇的時刻到了。',
                choices: [
                    { label: '簽下名字，接受這份遲來的愛', target: 'ending_a' },
                    { label: '撕毀遺囑，徹底走出過去的牢籠', target: 'ending_b' }
                ]
            },
            'ending_a': {
                text: '我拔出鋼筆，筆尖在紙上懸停了許久，最終還是簽下了「中村健一」。\n這不是為了那座宅邸，更不是為了財富，而是為了填補那段名為『10:24』的十年空白。\n\n我終於明白，這位一生都在法庭上做出冷酷判決的法官，下定決心放手讓我離開時，內心有多麼煎熬。他用這整棟屋子的謎題，笨拙地向我展示了他的脆弱與懊悔。\n\n晨光透過溫室的玻璃天花板灑在我的肩膀上。停滯的時間，終於重新開始轉動了。',
                choices: [{ label: '返回遊戲大廳', target: 'do_home' }]
            },
            'ending_b': {
                text: '我深吸了一口氣，將那份羊皮紙對折，然後毫不猶豫地撕成了兩半。\n\n有些裂痕是不需要被修補的，有些沉重的愛，我也沒有義務去承接。這是我第一次，也是最後一次，真正意義上拒絕了他。\n\n我沒有再看那張碎裂的遺囑一眼，轉身走下了樓梯，永遠離開了這座洋館。當我推開大門走到街道上時，清冷的夜風迎面吹來，但我卻覺得前所未有的自由與輕盈。',
                choices: [{ label: '返回遊戲大廳', target: 'do_home' }]
            },
            'do_home': {
                text: '正在返回迴廊...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.goHome();
                }
            }
        }
    }
};
