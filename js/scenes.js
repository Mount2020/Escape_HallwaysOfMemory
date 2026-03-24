const scenes = {
    0: {
        id: 0,
        background: 'assets/scenes/opening.png',
        fallbackBg: '#1f1f1f',
        startNode: 'main',
        nodes: {
            'main': {
                text: '【序章】\n\n這是我那嚴格又不多話的祖母，留下的最後一座舊宅。\n遺物整理的工作已經接近尾聲，但我心中始終有個疑問...',
                choices: [{ label: '繼續閱讀', target: 'intro2' }]
            },
            'intro2': {
                text: '她當年為什麼突然放棄了去遠方念音樂的夢想，一輩子留在這平靜的海邊小鎮？\n她從未向任何人提起，直到她離開。',
                choices: [{ label: '繼續閱讀', target: 'intro3' }]
            },
            'intro3': {
                text: '臨走前，律師交給我一把老舊的黃銅鑰匙，說這是祖母生前特別吩咐，要單獨交給我的。\n\n「或許，妳能在她的舊房間裡，找到妳要的答案。」',
                choices: [{ label: '轉動鑰匙，踏入回憶的房間...', target: 'start_game' }]
            },
            'start_game': {
                text: '...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.transitionToNextScene();
                }
            }
        }
    },
    1: {
        id: 1,
        background: 'assets/scenes/scene1-oldhouse.png',
        fallbackBg: '#5c452b',
        startNode: 'main',
        nodes: {
            'main': {
                text: '你站在午後的舊宅中。\n陽光從木窗斜灑進來，空氣中有微塵漂浮。空氣中還有剛泡好不久的茶香。\n\n你要先從哪裡開始這段追憶？',
                choices: () => {
                    let c = [];
                    c.push({ label: '調查桌上的茶几', target: 'teacup_inspect' });
                    c.push({ label: '調查牆上的時鐘', target: 'clock_inspect' });
                    if (StateManager.getFlag('clockFixed')) {
                        c.push({ label: '調查角落的收音機', target: 'radio_inspect' });
                    } else {
                        c.push({ label: '調查角落的收音機', target: 'radio_frozen' });
                    }
                    if (StateManager.hasItem('cabinet_key')) {
                        c.push({ label: '調查右側的書櫃', target: 'cabinet_inspect' });
                    } else {
                        c.push({ label: '調查右側的書櫃', target: 'cabinet_locked' });
                    }
                    c.push({ label: '走到玄關大門前', target: 'door_inspect' });
                    return c;
                }
            },
            'clock_inspect': {
                text: () => {
                    if (StateManager.getFlag('clockFixed')) return '時鐘正穩定地走著，停在 7:30 的位置。你依稀記得，在裝入電池前，它長年停滯在 4:15。';
                    if (!StateManager.hasItem('battery')) {
                        StateManager.addItem('battery');
                        if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                        return '牆上的時鐘停在 4:15，似乎沒有動力了。拉開下方的抽屜，你找到了一顆未生鏽的【電池】。';
                    }
                    return '牆上的時鐘停在 4:15，抽屜裡空空如也。';
                },
                choices: () => {
                    let c = [{ label: '返回', target: 'main' }];
                    if (!StateManager.getFlag('clockFixed') && StateManager.hasItem('battery')) {
                        c.unshift({ label: '為時鐘裝入【電池】', target: 'clock_solve' });
                    }
                    return c;
                }
            },
            'clock_solve': {
                text: '你將電池裝入時鐘背面。秒針開始走動，發出微小但清脆的滴答聲，最終停在了 7:30。',
                onEnter: () => StateManager.setFlag('clockFixed', true),
                choices: [{ label: '返回', target: 'main' }]
            },
            'radio_frozen': {
                text: '這是一台老式收音機。電源燈亮著，但旋鈕沒有任何反應。也許這個空間的時間被停滯了？',
                choices: [{ label: '返回', target: 'main' }]
            },
            'radio_inspect': {
                text: () => StateManager.getFlag('radioPlayed') 
                    ? '收音機閃爍著微光，(已經輸入過正確頻率了)。' 
                    : '收音機開始發出滋滋聲。只要輸入正確的電台頻率或許就能聽到什麼。\n(筆記：停滯的時間也許是某種頻率？)',
                choices: () => StateManager.getFlag('radioPlayed') ? [{label: '返回', target: 'main'}] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.getFlag('radioPlayed') ? null : 'text',
                checkAnswer: (val) => {
                    const ans = ['73.0', '73', '7:30', '7.30', '07:30', '0730', '730'];
                    if (ans.includes(val)) return 'radio_solved';
                    return 'radio_wrong';
                }
            },
            'radio_wrong': {
                text: '收音機發出雜訊，隨後便只剩下沉默。看來這不是頻率的正確答案。',
                choices: [{ label: '重新輸入', target: 'radio_inspect' }, { label: '離開', target: 'main' }]
            },
            'radio_solved': {
                text: '廣播傳出短暫的雜訊，接著是祖母那令人懷念的聲音：「如果你來了，就去我最喜歡的地方⋯⋯終點站，在有海浪的地方。」\n語音的最後，她輕輕哼了一小段旋律：『Sol-Sol-Mi-La-Sol』...',
                onEnter: () => StateManager.setFlag('radioPlayed', true),
                choices: [{ label: '返回', target: 'main' }]
            },
            'teacup_inspect': {
                text: () => StateManager.isPuzzleSolved('scene1', 'teacup') 
                    ? '茶杯已被你整齊排列，茶几的暗格也已經打開了。' 
                    : '桌上有三個茶杯。牆上的老照片裡由左至右並排站著三人：穿著「梅花」和服的祖母、別著「松葉」胸針的爺爺、以及拿著「竹子」折扇的母親。\n這三個茶杯需要被正確地擺放。',
                choices: () => StateManager.isPuzzleSolved('scene1', 'teacup') ? [{ label: '返回', target: 'main' }] : [
                    { label: '排列 (梅、松、竹)', target: 'teacup_solved' },
                    { label: '排列 (竹、梅、松)', target: 'teacup_wrong' },
                    { label: '排列 (梅、竹、松)', target: 'teacup_wrong' },
                    { label: '離開茶几', target: 'main' }
                ]
            },
            'teacup_wrong': {
                text: '茶杯靜靜地擺在那裡，似乎不是對的順序。',
                choices: [{ label: '重新排列', target: 'teacup_inspect' }, { label: '離開', target: 'main' }]
            },
            'teacup_solved': {
                text: '你按著祖母、爺爺、母親的順序排列了茶杯。茶几下方發出「咔」的一聲，彈出一個暗格。裡面有一把【櫃子鑰匙】。',
                onEnter: () => {
                    StateManager.solvePuzzle('scene1', 'teacup');
                    StateManager.addItem('cabinet_key');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收下鑰匙並返回', target: 'main' }]
            },
            'cabinet_locked': {
                text: '書櫃的上層有個鎖孔。看起來需要一把相應的鑰匙才能看到裡面的東西。',
                choices: [{ label: '返回', target: 'main' }]
            },
            'cabinet_inspect': {
                text: () => StateManager.hasItem('train_ticket') 
                    ? '抽屜已經被你解開，裡面現在空空如也。' 
                    : '你用鑰匙打開了書櫃上層，裡面有一個舊相框。翻開相片背面，只留下一句意義不明的話：「時間停滯在了你離開的那一刻」。\n\n下層還有一個上鎖的抽屜，掛著一個四位數密碼鎖。',
                choices: () => StateManager.hasItem('train_ticket') ? [{ label: '返回', target: 'main' }] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.hasItem('train_ticket') ? null : 'text',
                checkAnswer: (val) => val === '0415' || val === '415' ? 'cabinet_solved' : 'cabinet_wrong'
            },
            'cabinet_wrong': {
                text: '你撥動數字密碼，但鎖柄文風不動。',
                choices: [{ label: '重新輸入', target: 'cabinet_inspect' }, { label: '離開', target: 'main' }]
            },
            'cabinet_solved': {
                text: '密碼鎖 咔 了一聲開了！你在抽屜深處找到了一張前往海邊的【舊火車票】。那正是祖母年輕時去的終點站。',
                onEnter: () => {
                    StateManager.addItem('train_ticket');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收下車票並返回', target: 'main' }]
            },
            'door_inspect': {
                text: () => StateManager.hasItem('train_ticket') 
                    ? '你帶著前往遠方的車票。門把毫不費力地轉動，你推開了大門，刺眼的陽光吞沒了這段記憶。' 
                    : '門緊緊鎖著。在離開前，似乎還有些關於祖母秘密的事物沒找到。',
                choices: () => StateManager.hasItem('train_ticket') 
                    ? [{ label: '前往下一段記憶 (進入無人車站)', target: 'next_level' }] 
                    : [{ label: '回到房內', target: 'main' }]
            },
            'next_level': {
                text: '...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.transitionToNextScene();
                }
            }
        }
    },
    2: {
        id: 2,
        background: 'assets/scenes/scene2-station.png',
        fallbackBg: '#8c5a35',
        startNode: 'main',
        nodes: {
            'main': {
                text: '這是一個荒廢的小站。黃昏橘紅天空下，鐵軌延伸到遠方消失在光中。\n月台長椅上有落葉與一份舊報紙。遠處有兩條分岔的鐵軌。\n\n你要先調查哪裡？',
                choices: () => {
                    let c = [];
                    c.push({ label: '調查月台長椅上的舊報紙', target: 'newspaper_inspect' });
                    c.push({ label: '查看牆上的時刻表', target: 'timetable_inspect' });
                    c.push({ label: '調查售票口旁的舊皮箱', target: 'suitcase_inspect' });
                    if (StateManager.hasItem('postcard')) {
                        c.push({ label: '調查售票口內的廣播系統', target: 'broadcast_inspect' });
                    }
                    if (StateManager.getFlag('broadcastPlayed')) {
                        c.push({ label: '走向盡頭的分岔鐵軌', target: 'rail_inspect' });
                    }
                    return c;
                }
            },
            'newspaper_inspect': {
                text: '長椅上散落著落葉與一份泛黃的報紙。\n頭版日期顯示著「昭和 43 年（即 1968 年）」。',
                choices: [{ label: '回到月台', target: 'main' }]
            },
            'timetable_inspect': {
                text: () => StateManager.getFlag('timetableFixed') 
                    ? '時刻表的玻璃櫃已被解開，清楚寫著開往海邊的末班車時間為「17:48」。' 
                    : '月台的時刻表被鎖在一個老舊的玻璃櫃裡，下方掛著一個生鏽的四位數密碼鎖。玻璃上充滿了水氣與灰塵，看不清末班車的時間。',
                choices: () => StateManager.getFlag('timetableFixed') ? [{ label: '返回', target: 'main' }] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.getFlag('timetableFixed') ? null : 'text',
                checkAnswer: (val) => val === '1968' ? 'timetable_solved' : 'timetable_wrong'
            },
            'timetable_wrong': {
                text: '密碼鎖緊緊咬著，完全拉不開。',
                choices: [{ label: '重新填寫', target: 'timetable_inspect' }, { label: '返回', target: 'main' }]
            },
            'timetable_solved': {
                text: '「啪」的一聲，密碼鎖解開了。你拉開玻璃櫃門，仔細看清了時刻表。開往終點站的末班車時間清楚寫著：17:48。',
                onEnter: () => StateManager.setFlag('timetableFixed', true),
                choices: [{ label: '返回', target: 'main' }]
            },
            'suitcase_inspect': {
                text: () => StateManager.hasItem('postcard') 
                    ? '皮箱已被打開，裡面現在空無一物。' 
                    : '售票口旁有一個舊皮箱，上面掛著一個四位數密碼鎖。',
                choices: () => StateManager.hasItem('postcard') ? [{ label: '返回', target: 'main' }] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.hasItem('postcard') ? null : 'text',
                checkAnswer: (val) => val === '1748' || val === '748' ? 'suitcase_solved' : 'suitcase_wrong'
            },
            'suitcase_wrong': {
                text: '密碼錯誤，皮箱的鎖未解開。',
                choices: [{ label: '重新輸入', target: 'suitcase_inspect' }, { label: '返回', target: 'main' }]
            },
            'suitcase_solved': {
                text: '伴隨著鎖扣彈開的聲音皮箱開了！裡面放著一張泛黃的【明信片】，沒有寄出。\n你注意到明信片背面，有人特別用粗字體用力寫下了「夏日海洋」（夏の海へ）幾個字。',
                onEnter: () => {
                    StateManager.addItem('postcard');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收下明信片並返回', target: 'main' }]
            },
            'broadcast_inspect': {
                text: () => StateManager.getFlag('broadcastPlayed') 
                    ? '廣播台閃著燈號，不斷發出電流沙沙聲。(已觸發)' 
                    : '售票亭裡的舊廣播設備突然亮起紅燈，面板顯示需要輸入一組啟動片語。',
                choices: () => StateManager.getFlag('broadcastPlayed') ? [{ label: '返回', target: 'main' }] : [{ label: '退開', target: 'main' }],
                inputType: () => StateManager.getFlag('broadcastPlayed') ? null : 'text',
                checkAnswer: (val) => (val.includes('夏の海へ') || val.includes('夏日海洋') || val.includes('海')) ? 'broadcast_solved' : 'broadcast_wrong'
            },
            'broadcast_wrong': {
                text: '機器發出低沉的錯誤嘟嘟聲。字彙不對。',
                choices: [{ label: '重新輸入', target: 'broadcast_inspect' }, { label: '返回', target: 'main' }]
            },
            'broadcast_solved': {
                text: '廣播突然響起：「各位旅客，下一站，請面向夕陽出發，向西走。」\n月台盡頭處似乎傳來了微小的震動。',
                onEnter: () => StateManager.setFlag('broadcastPlayed', true),
                choices: [{ label: '返回', target: 'main' }]
            },
            'rail_inspect': {
                text: '你走到了月台的盡頭，有兩條長滿雜草的鐵軌。\n左邊通往幽暗的山區，右邊則迎著夕陽餘暉，光芒耀眼。\n廣播的提示言猶在耳：「面向夕陽，向西走」。',
                choices: [
                    { label: '走向左邊的鐵軌', target: 'rail_wrong' },
                    { label: '走向右邊的鐵軌', target: 'rail_solved' },
                    { label: '返回月台', target: 'main' }
                ]
            },
            'rail_wrong': {
                text: '山區的風很冷，你有一種直覺這不是她當年曾走過的路。',
                choices: [{ label: '重新選擇', target: 'rail_inspect' }]
            },
            'rail_solved': {
                text: '你迎著夕陽的光暈走去，畫面逐漸被橘紅色的溫暖光芒包圍... 那是通往海邊的路。',
                choices: [{ label: '進入下一段記憶', target: 'next_level' }]
            },
            'next_level': {
                text: '...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.transitionToNextScene();
                }
            }
        }
    },
    3: {
        id: 3,
        background: 'assets/scenes/scene3-cabin.png',
        fallbackBg: '#59798e',
        startNode: 'main',
        nodes: {
            'main': {
                text: '這是一座安靜的海邊小屋。藍色海面閃著陽光，白色薄紗窗簾隨海風輕飄。\n木桌上有日記、貝殼、和一個舊音樂盒，旁邊還有一個老舊書架。',
                choices: () => {
                    let c = [];
                    c.push({ label: '調查窗邊的潮汐圖與貝殼', target: 'shells_inspect' });
                    c.push({ label: '調查一旁的書架', target: 'bookshelf_inspect' });
                    if (StateManager.hasItem('diary_key')) {
                        c.push({ label: '嘗試閱讀桌上的日記', target: 'diary_inspect' });
                    } else {
                        c.push({ label: '查看桌上那本上鎖的日記', target: 'diary_locked' });
                    }
                    c.push({ label: '調查桌上的舊音樂盒', target: 'musicbox_inspect' });
                    
                    if (StateManager.getFlag('diaryRead') && StateManager.getFlag('letterRead')) {
                        c.push({ label: '【做出最終選擇】', target: 'final_choice' });
                    }
                    return c;
                }
            },
            'bookshelf_inspect': {
                text: () => StateManager.hasItem('folded_paper') 
                    ? '書架上的書整齊排列，已經找不出什麼線索了。' 
                    : '書架上有一排整齊的書，其中一本略微突出了邊緣。你小心翼翼抽出來一看，裡面夾著一張半截的【折疊紙】。',
                choices: () => {
                    if (!StateManager.hasItem('folded_paper')) {
                        return [{ label: '收下【折疊紙】', target: 'bookshelf_take' }];
                    }
                    return [{ label: '回到小屋中央', target: 'main' }];
                }
            },
            'bookshelf_take': {
                text: '你將折疊紙收進口袋。這邊緣有些參差，看起來像是從某本書或筆記上撕下來的殘頁。',
                onEnter: () => {
                    StateManager.addItem('folded_paper');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '返回', target: 'main' }]
            },
            'shells_inspect': {
                text: () => StateManager.hasItem('diary_key') 
                    ? '貝殼依據潮汐順序排好了，放鑰匙的暗格也呈現開啟狀態。' 
                    : '桌上有五個貝殼大小不一；窗邊貼著一張手繪的「潮汐圖」，標記了五個從高到低的刻度。\n依據常理，你試圖照著潮汐大起大落的順序（代表大到小）將貝殼重新排列。',
                choices: () => StateManager.hasItem('diary_key') ? [{ label: '返回', target: 'main' }] : [
                    { label: '將貝殼依大到小排列', target: 'shells_solved' },
                    { label: '將貝殼依小到大排列', target: 'shells_wrong' },
                    { label: '看心情隨機排列', target: 'shells_wrong' },
                    { label: '先不碰它們', target: 'main' }
                ]
            },
            'shells_wrong': {
                text: '貝殼放上去了，但並沒有發生任何事。看來祖母記錄潮汐有她的邏輯。',
                choices: [{ label: '重新嘗試', target: 'shells_inspect' }, { label: '退開', target: 'main' }]
            },
            'shells_solved': {
                text: '你依據潮汐刻度把貝殼從大到小排好，桌面突然彈出一個極小的抽屜，裡面靜靜躺著一把專屬的【日記鑰匙】。',
                onEnter: () => {
                    StateManager.addItem('diary_key');
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收下鑰匙並返回', target: 'main' }]
            },
            'diary_locked': {
                text: '日記被一個精緻的小鎖扣住，鎖孔的形狀有點像某種貝殼。強行破壞太可惜了。',
                choices: [{ label: '返回', target: 'main' }]
            },
            'diary_inspect': {
                text: () => {
                    if (StateManager.getFlag('diaryRead')) {
                        return '上面寫著：「我面臨了留在家鄉照顧家人，或追隨夢想去遠方的抉擇。最後我選擇了留下。」這是個關於割捨的沉重回憶。';
                    }
                    if (StateManager.hasItem('folded_paper')) {
                        return '你用鑰匙打開了日記。但最關鍵的中間一頁卻被撕去了...\n等等！你拿出剛剛找到的【折疊紙】拼上去，嚴絲合縫！\n\n上面寫著：「我面臨了留在家鄉照顧家人，或追隨夢想去遠方的抉擇。最後我選擇了留下。」';
                    }
                    return '你用鑰匙打開了日記。但最關鍵的中間一頁卻被撕去了，留下半截無法解讀的字跡... 似乎需要找到那張殘頁才能知道全部。';
                },
                onEnter: () => {
                    if (StateManager.hasItem('folded_paper') && !StateManager.getFlag('diaryRead')) {
                        StateManager.setFlag('diaryRead', true);
                    }
                },
                choices: [{ label: '輕輕闔上日記', target: 'main' }]
            },
            'musicbox_inspect': {
                text: () => StateManager.getFlag('letterRead') 
                    ? '音樂盒底部的暗格已經拉開，裡面空蕩蕩的。' 
                    : '這是一個舊音樂盒，有五個琴鍵（Do Re Mi Fa Sol La Ti）。不知道該彈奏什麼旋律才能打開？',
                choices: () => StateManager.getFlag('letterRead') ? [{ label: '返回', target: 'main' }] : [
                    { label: '彈奏：Do Mi Sol Do Mi', target: 'musicbox_wrong' },
                    { label: '彈奏：Mi Sol La Sol Mi', target: 'musicbox_wrong' },
                    { label: '彈奏：Sol Sol Mi La Sol', target: 'musicbox_solved' },
                    { label: '彈奏：La Sol Mi Re Do', target: 'musicbox_wrong' },
                    { label: '彈奏：Mi Re Do Re Mi', target: 'musicbox_wrong' },
                    { label: '退開', target: 'main' }
                ]
            },
            'musicbox_wrong': {
                text: '音樂盒發出沉悶的走音聲，又卡住了。',
                choices: [{ label: '重新彈奏', target: 'musicbox_inspect' }, { label: '返回', target: 'main' }]
            },
            'musicbox_solved': {
                text: '清脆的旋律流淌而出，與海風融在一起。音樂盒底層自動滑開，裡面躺著一封【未寄出的信】。\n\n信上寫著：「我選擇留下，因為有你們。即使未能看到遠方的海景，我也從不後悔。」',
                onEnter: () => {
                    StateManager.addItem('letter');
                    StateManager.setFlag('letterRead', true);
                    if (typeof GameController !== 'undefined') GameController.updateInventoryUI();
                },
                choices: [{ label: '收起信件並安靜退開', target: 'main' }]
            },
            'final_choice': {
                text: '所有的線索都已拼湊完成。從殘破的日記到這封未寄出的信，紗月終於懂了祖母那年夏天的心情。\n這是一段關於割捨與成全的故事。\n\n在你心裡，祖母最後的選擇，是⋯⋯？',
                choices: [
                    { label: '帶著一絲「遺憾」', target: 'ending_b' },
                    { label: '其實她「無悔」', target: 'ending_a' }
                ]
            },
            'ending_a': {
                text: '...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.triggerEnding('A');
                }
            },
            'ending_b': {
                text: '...',
                onEnter: () => {
                    if (typeof GameController !== 'undefined') GameController.triggerEnding('B');
                }
            }
        }
    }
};
