// 記憶插敘對話資料庫
const memories3 = {
    // 記憶 1：信箱解開後
    memory1: [
        { speaker: 'left', text: '「蒼，如果有一天我們走丟了怎麼辦？」' },
        { speaker: 'right', text: '「怎麼會走丟？我家就在你家樓下啊。」' },
        { speaker: 'left', text: '「我是說如果嘛。如果我躲到一個你找不到的地方呢？」' },
        { speaker: 'right', text: '「那我就找遍所有我們去過的地方，總是會找到的。」' },
        { speaker: 'left', text: '「……嗯。說好了喔。」' }
    ],
    // 記憶 2：洗出底片後
    memory2: [
        { speaker: 'right', text: '「你怎麼都不拍自己？底片全是我這張白痴臉。」' },
        { speaker: 'left', text: '「因為相機在我手裡啊。」' },
        { speaker: 'right', text: '「下次換我拿相機，幫你拍一張帥的。」' },
        { speaker: 'left', text: '「……不用了。有你在畫面裡，就夠了。」' }
    ],
    // 記憶 2.5：小房間解開信封後
    memory_room: [
        { speaker: 'left', text: '「蒼，如果有一天我們必須分開，你會怎麼辦？」' },
        { speaker: 'right', text: '「分開？你要搬家了嗎？」' },
        { speaker: 'left', text: '「我是說，如果我不得不去一個很遠的地方，連信都寄不到的地方。」' },
        { speaker: 'right', text: '「那我就把自己打包成包裹寄過去找你。」' },
        { speaker: 'left', text: '「……噗，你還真是一點都沒變啊。」' }
    ],
    // 記憶 3：咖啡廳入座後
    memory3: [
        { speaker: 'left', text: '「蒼，如果以後我不當攝影師了，你說我能做什麼？」' },
        { speaker: 'right', text: '「那就來當我的專屬攝影師啊。我當主編，你當攝影，我們聯手統治出版界。」' },
        { speaker: 'left', text: '「聽起來不錯……但如果我哪天消失了，你一定要繼續寫下去。」' },
        { speaker: 'right', text: '「消失？你在說什麼傻話？」' },
        { speaker: 'left', text: '「沒什麼。只是覺得這杯蘇打水特別甜。」' }
    ],
    // 記憶 4：燈塔合上羅盤後
    memory4: [
        { speaker: 'right', text: '「光，你看！羅盤指著大海的那一端。」' },
        { speaker: 'left', text: '「蒼，你要記住，燈塔不只是為了指引回家的路。」' },
        { speaker: 'right', text: '「那是為了什麼？」' },
        { speaker: 'left', text: '「是為了讓迷失的人知道，在這漆黑的海面上，還有人在為你亮著燈。」' }
    ]
};

// 光的日記資料庫
const diaryEntries3 = [
    {
        id: 'diary1',
        date: '2016年 4月 10日',
        text: '又在樓梯口遇到蒼了。他還是老樣子，總是大聲笑著，好像全世界都沒有煩惱。真好。有時候我會想，如果能一直待在有他的時間裡，會不會我就不用去面對那些逐漸崩壞的現實了？<br><br>但這是不可能的。我不能把他捲進來。'
    },
    {
        id: 'diary2',
        date: '2016年 9月 5日',
        text: '倒數的開始。醫生說，時間可能比想像中短。<br>我在暗房裡待了很久，看著每一張洗出來的底片。這裡面有我們的整個夏天。<br>再過 14 天，我就要交出退社申請了。<br>蒼，對不起。如果有一天我不能按下快門了，替我記住這一切好嗎？'
    },
    {
        id: 'diary3',
        date: '2016年 10月 12日',
        text: '痛。連握住筆的力氣都沒有了。<br>我把自己關在這個狹小的租屋處裡，不想讓他看見我這副狼狽的模樣。<br>桌上的藥瓶已經空了，我不斷寫著又心虛地撕去了給他的信。<br>「對不起，我不告而別…」我知道這句話會有多傷人，但我只能用這種笨拙的方式，讓他在記憶裡只保留我最好的樣子。'
    },
    {
        id: 'diary4',
        date: '2016年 11月 20日',
        text: '這家咖啡廳的陽光還是這麼暖。我坐在我們最常坐的窗邊，試著把羅盤修好。<br>這是我答應要送給他的成年禮物。但我發現我的手開始不聽使喚地發抖。<br>蒼坐在對面興奮地說著未來的計畫，我只能微笑著點頭。我多想告訴他，我的未來裡，可能沒有「以後」了。'
    },
    {
        id: 'diary5',
        date: '2017年 2月 14日',
        text: '我把另一半羅盤藏在了這盞燈下。如果他真的在那一天來到了燈塔，他一定能找到它。<br>如果兩個羅盤重新合而為一，是不是代表，我也能以某種形式，重新回到他身邊？<br>今天的海潮聲很大，像是在替我哭泣。'
    },
    {
        id: 'diary6',
        date: '最後一封信',
        text: '蒼，當你讀到這裡時，我應該已經在很遠的地方了。<br>對不起，沒能親口跟你告別。我知道你一定很恨我的突然消失。<br>那是因為，我希望你記憶裡的光，永遠是那個在陽光下大笑、在暗房裡忙碌、在燈塔前與你分擔夢想的少年，而不是病院床榻上日漸枯萎的身影。<br>我的離開不是背叛，而是我想留給你最後一點溫柔。<br>謝謝你，找回了所有的答案。現在，請帶著我的那份夢想，繼續往前走吧。'
    }
];

// 場景與節點資料庫
const scenes3 = {
    // --- 關卡一：兒時的公寓樓道 ---
    1: {
        bg: 'url("assets/scenes/scene3-corridor.png")',
        label: '兒時的公寓樓道',
        nodes: {
            start: {
                text: '這是我最後一次收到他的訊息。\n\n「我知道你一直在等一個答案。去我們的老地方，從最開始找起。」\n\n午後的陽光穿過磨砂玻璃，樓道裡瀰漫著一股老舊木頭受潮的氣味。',
                choices: [
                    { text: '環顧四周', target: 'explore' }
                ]
            },
            explore: {
                text: '三十年前我們在這裡長大。信箱區積著薄薄的灰塵，樓梯下方停著一台生鏽的腳踏車。佈告欄上貼著泛黃的「社區資源回收規定」。',
                hotspots: [
                    { x: 10, y: 70, width: 25, height: 30, target: 'mailbox_area', title: '信箱區' },
                    { x: 60, y: 80, width: 30, height: 20, target: 'bicycle_area', title: '舊腳踏車' },
                    { x: 40, y: 30, width: 20, height: 25, target: 'notice_board', title: '佈告欄' }
                ],
                customLogic: (controller) => {
                    // 若同時解開兩謎題，觸發前往下一關
                    if (gameState3.puzzlesSolved.scene1.includes('mailbox') && gameState3.puzzlesSolved.scene1.includes('toy')) {
                        setTimeout(() => {
                            controller.goToNode('ready_to_leave_scene1');
                        }, 500);
                    }
                }
            },
            mailbox_area: {
                text: '一排綠色的破舊信箱。其中屬於光家的信箱上，掛著一個生鏽的二碼轉盤鎖。',
                choices: [
                    { text: '嘗試解開密碼鎖', action: 'puzzle_mailbox' },
                    { text: '返回樓道', target: 'explore' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene1.includes('mailbox')) {
                        controller.goToNode('mailbox_solved');
                    }
                }
            },
            mailbox_solved: {
                text: '信箱已經打開。裡面除了灰塵什麼都沒有。那張棒球卡已經被我收好。',
                choices: [{ text: '返回樓道', target: 'explore' }]
            },
            mailbox_opened_options: {
                choices: [{ text: '返回樓道', target: 'explore' }]
            },
            bicycle_area: {
                text: '生鏽腳踏車的籃子裡，有一個四色按鈕玩具（黃、綠、紅、藍）。旁邊的牆壁轉角處似乎有什麼塗鴉。',
                choices: [
                    { text: '查看牆角塗鴉', target: 'wall_drawing' },
                    { text: '按下玩具按鈕', action: 'puzzle_toy' },
                    { text: '返回樓道', target: 'explore' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene1.includes('toy')) {
                        controller.goToNode('toy_solved');
                    }
                }
            },
            toy_solved: {
                text: '玩具的卡榫已經鬆開，半塊羅盤安然地躺在我的口袋裡。這是我當年以為弄丟的寶物，原來他一直偷偷替我收著。',
                choices: [{ text: '返回樓道', target: 'explore' }]
            },
            wall_drawing: {
                text: '牆角有四幅用蠟筆畫的圖案，高低不一地貼在牆壁上：🌻 向日葵 🌿 草地 🍂 楓葉 🌊 海洋 按壓旁邊的按鈕時，記得先搞清楚它們各自站在哪個位置。',
                choices: [{ text: '返回腳踏車', target: 'bicycle_area' }]
            },
            notice_board: {
                text: '除了褪色的回收規定外，角落有光小時候的塗鴉：\n「蒼是 5，光是蒼加 2。我們各自的數字，前後排列就是密碼。」',
                choices: [{ text: '返回樓道', target: 'explore' }]
            },
            ready_to_leave_scene1: {
                text: '信箱空了，樓道裡的殘光也漸漸褪去。\n我握著那張棒球卡與羅盤，突然明白，有些東西並不會因為時間流逝而消失。它們只是在等待一個重新被拾起的時刻。\n\n我們總以為長大是一瞬間的事。\n卻沒發現，弄丟彼此，也是。',
                choices: [
                    { text: '前往高中的社團教室', action: 'next_scene' }
                ]
            }
        }
    },
    // --- 關卡二：高中的社團教室 ---
    2: {
        bg: 'url("assets/scenes/scene3-darkroom.png")',
        label: '高中的社團教室',
        nodes: {
            start: {
                text: '推開木門，空氣中瞬間湧入顯影液的微酸氣味。\n\n高中的攝影社，曾是我們躲避升學壓力的防空洞。光在這裡拍下了無數張相片，唯獨不愛拍自己。',
                choices: [
                    { text: '環顧四周', target: 'explore' }
                ]
            },
            explore: {
                text: '桌上有凌亂的照片。角落的暗房門半掩著，透出一絲幽幽的紅光。教室深處有一個上鎖的鐵櫃，旁邊放著社團日誌。',
                hotspots: [
                    { x: 30, y: 40, width: 25, height: 40, target: 'darkroom', title: '暗房' },
                    { x: 70, y: 50, width: 20, height: 40, target: 'locker_area', title: '密碼鐵櫃' },
                    { x: 60, y: 70, width: 15, height: 15, target: 'diary_book', title: '社團日誌' }
                ],
                customLogic: (controller) => {
                    // 若同時解開兩謎題，觸發前往下一關
                    if (gameState3.puzzlesSolved.scene2.includes('darkroom') && gameState3.puzzlesSolved.scene2.includes('locker')) {
                        setTimeout(() => {
                            controller.goToNode('ready_to_leave_scene2');
                        }, 500);
                    }
                }
            },
            darkroom: {
                text: '暗房的沖洗池旁，桌上有四張未懸掛好的底片：\n[太陽]、[黑板]、[花朵]、[雨傘]\n\n旁邊有一個晾乾架，似乎要把底片按正確順序掛上去。',
                choices: [
                    { text: '排列底片', action: 'puzzle_darkroom' },
                    { text: '離開暗房', target: 'explore' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene2.includes('darkroom')) {
                        controller.goToNode('darkroom_solved');
                    }
                }
            },
            darkroom_solved: { 
                text: '照片洗出來了，是我們那年夏天的合照。',
                choices: [{ text: '離開暗房', target: 'explore' }] 
            },
            diary_book: {
                text: '社團日誌的扉頁有一行字：「按照這一年的呼吸順序，將底片掛回去。」底片上的籤條分別寫著：春光、梅雨、烈日、枯葉。至於這一年的呼吸是什麼順序——也許你已經知道了。旁邊散落了一本月曆，他唯獨將 09/05 重重圈起，寫著：「倒數的開始」。旁邊的個人日記寫：「再過 14 天，我就要失去他了。」',
                choices: [{ text: '放回日誌', target: 'explore' }]
            },
            locker_area: {
                text: '教室深處的鐵櫃上鎖了，需要輸入一個四位數字的密碼。',
                choices: [
                    { text: '輸入密碼', action: 'puzzle_locker' },
                    { text: '返回教室', target: 'explore' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene2.includes('locker')) {
                        controller.goToNode('locker_solved');
                    }
                }
            },
            locker_solved: {
                 text: '鐵櫃已經打開，那本未寫完的筆記靜靜躺在裡面。',
                 choices: [{ text: '返回教室', target: 'explore' }]
            },
            ready_to_leave_scene2: {
                text: '暗房裡的紅燈黯淡了下去。\n我翻閱著那本筆記，字跡在最後一頁突然變得凌亂無力。\n原來那個夏天，他獨自面對著一場我一無所知的暴風雨。\n\n那些未曾說出口的話，\n都成了洗不出來的底片，在暗盒裡逐漸腐壞。',
                choices: [
                    { text: '前往光租住的小房間', action: 'next_scene' }
                ]
            }
        }
    },
    // --- 關卡三：光消失前租住的小房間 ---
    3: {
        bg: 'url("assets/scenes/scene3-smallroom.png")',
        label: '光消失前租住的小房間',
        nodes: {
            start: {
                text: '這裡是他最後住過的地方。\n\n房間裡瀰漫著一股淡淡的霉味和消毒水交雜的氣味。窗簾緊閉，只有從縫隙透進來的微弱光線。',
                choices: [ { text: '環顧四周', target: 'explore' } ]
            },
            explore: {
                text: '書桌上散落著幾張泛黃的日曆和空藥瓶。床鋪整理得很整齊，枕頭邊放著一個未封口的信封和幾張碎片。',
                hotspots: [
                    { x: 30, y: 50, width: 25, height: 30, target: 'desk_area', title: '書桌區' },
                    { x: 60, y: 60, width: 30, height: 20, target: 'bed_area', title: '床鋪區' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene3 && 
                        gameState3.puzzlesSolved.scene3.includes('medicine') && 
                        gameState3.puzzlesSolved.scene3.includes('envelope')) {
                        setTimeout(() => { controller.goToNode('ready_to_leave_scene3'); }, 500);
                    }
                }
            },
            desk_area: {
                text: '桌上的藥瓶標示早已模糊，旁邊有一張 10 月的日曆，12 號被畫了一個大大的黑叉。\n上面寫著：「如果疼痛超過了忍耐的極限，請輸入對應的日期加減密碼。」',
                choices: [
                    { text: '輸入藥盒密碼', action: 'puzzle_medicine' },
                    { text: '返回房間', target: 'explore' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene3 && gameState3.puzzlesSolved.scene3.includes('medicine')) {
                        controller.goToNode('desk_solved');
                    }
                }
            },
            desk_solved: {
                 text: '藥盒已經打開，裡面只剩下一張寫著「抱歉」的紙條，藥瓶被我收了起來。',
                 choices: [{ text: '返回房間', target: 'explore' }]
            },
            bed_area: {
                text: '床邊散落著幾塊撕碎的信件拼圖。似乎是他本來想寄出，最後卻撕毀的信。',
                choices: [
                    { text: '嘗試拼湊信件', action: 'puzzle_envelope' },
                    { text: '返回房間', target: 'explore' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene3 && gameState3.puzzlesSolved.scene3.includes('envelope')) {
                        controller.goToNode('bed_solved');
                    }
                }
            },
            bed_solved: {
                 text: '拼湊出的信件已經被我收好。',
                 choices: [{ text: '返回房間', target: 'explore' }]
            },
            ready_to_leave_scene3: {
                text: '那封未寄出的信裡，寫滿了對未來的恐懼與對我的抱歉。\n\n「所以你就選擇自己一個人承受嗎？笨蛋。」\n\n我握著那張紙條，轉身離開了這間充滿遺憾的小房間。',
                choices: [
                    { text: '前往午後的舊咖啡廳', action: 'next_scene' }
                ]
            }
        }
    },
    // --- 關卡四：午後的舊咖啡廳 ---
    4: {
        bg: 'url("assets/scenes/scene3-coffeeshop.png")',
        label: '午後的舊咖啡廳',
        nodes: {
            start: {
                text: '鈴鐺聲響起，這家開在轉角的舊咖啡廳依然維持著三十年前的模樣。\n溫熱的咖啡香與爵士樂交織，這裡曾是我們討論夢想的總部。',
                choices: [ { text: '環顧四周', target: 'explore' } ]
            },
            explore: {
                text: '牆上掛著許多黑膠唱片。窗邊的位置空著，那是光的專屬座位。櫃檯上擺著一張發黃的點單紀錄。',
                hotspots: [
                    { x: 20, y: 50, width: 25, height: 40, target: 'window_seat', title: '窗邊的座位' },
                    { x: 70, y: 40, width: 20, height: 30, target: 'counter_area', title: '櫃檯區' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene4 && 
                        gameState3.puzzlesSolved.scene4.includes('seat_found') && 
                        gameState3.puzzlesSolved.scene4.includes('counter_read')) {
                        setTimeout(() => { controller.goToNode('ready_to_leave_scene4'); }, 500);
                    }
                }
            },
            window_seat: {
                text: '夕陽斜射在木質桌面上。桌面上刻著一個淡淡的「光」字。\n這曾是我們約定好要一起慶祝成年禮的地方。',
                choices: [
                    { text: '查看桌底', action: 'puzzle_cafe_seat' },
                    { text: '返回店內', target: 'explore' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene4 && gameState3.puzzlesSolved.scene4.includes('seat_found')) {
                        controller.goToNode('cafe_solved');
                    }
                }
            },
            cafe_solved: {
                text: '在桌縫中，我找到了另一半的羅盤。當兩個半塊湊在一起時，指標顫抖著指向了東南方的海岸線。',
                choices: [ { text: '返回店內', target: 'explore' } ]
            },
            counter_area: {
                text: '櫃檯的點單紀錄上，有一張 2017 年的存根：\n「兩杯藍色蘇打，窗邊位。PS: 留在這裡的東西，請等他回來再交給他。」',
                choices: [ { text: '返回店內', target: 'explore' } ],
                customLogic: (controller) => {
                    if (!gameState3.puzzlesSolved.scene4) gameState3.puzzlesSolved.scene4 = [];
                    if (!gameState3.puzzlesSolved.scene4.includes('counter_read')) {
                        gameState3.puzzlesSolved.scene4.push('counter_read');
                    }
                }
            },
            ready_to_leave_scene4: {
                text: '咖啡廳的鈴鐺再次響起，推開門時，一陣鹹鹹的海風撲面而來。\n所有的線索都指向了那個我們最後一次慶祝生日的地方。\n\n「光，我快要找到你了，對吧？」',
                choices: [
                    { text: '前往海岸邊的守望燈塔', action: 'next_scene' }
                ]
            }
        }
    },
    // --- 關卡五：海岸邊的守望燈塔 ---
    5: {
        bg: 'url("assets/scenes/scene3-lighthouse.png")',
        label: '海岸邊的守望燈塔',
        nodes: {
            start: {
                text: '白色的塔身在暮色中顯得有些孤寂。\n潮汐拍打著岩石，發出沉重的悶響。這裡曾是我們交換羅盤、發誓要環遊世界的地方時。',
                choices: [ { text: '環顧四周', target: 'explore' } ]
            },
            explore: {
                text: '燈塔的大門鎖著。門邊有一個嵌入牆面的羅盤底座，外圈刻著奇怪的符號。',
                hotspots: [
                    { x: 40, y: 60, width: 20, height: 25, target: 'compass_lock', title: '羅盤底座' },
                    { x: 10, y: 75, width: 20, height: 20, target: 'shore_rocks', title: '礁石區' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene5 && gameState3.puzzlesSolved.scene5.includes('compass_placed')) {
                        setTimeout(() => { controller.goToNode('ready_to_leave_scene5'); }, 500);
                    }
                }
            },
            compass_lock: {
                text: '這個底座的大小，剛好能放入我的那枚羅盤。底座周圍刻著：\n「當起點與終點重合，燈光將會亮起。」',
                choices: [
                    { text: '放置羅盤並調整方向', action: 'puzzle_lighthouse' },
                    { text: '環顧四周', target: 'explore' }
                ],
                customLogic: (controller) => {
                    if (gameState3.puzzlesSolved.scene5 && gameState3.puzzlesSolved.scene5.includes('compass_placed')) {
                        controller.goToNode('compass_solved');
                    }
                }
            },
            compass_solved: {
                text: '我的羅盤緊緊崁入底座，隨著指針轉向正確的位置，沉重的機關發出低沉的摩擦聲。',
                choices: [ { text: '退回一步', target: 'explore' } ]
            },
            shore_rocks: {
                text: '礁石縫隙中卡著一隻被海水泡得發白的帆布船模型。上面寫著：\n「北偏東 45 度，是夢想出發的方向。」',
                choices: [ { text: '返回燈塔', target: 'explore' } ]
            },
            ready_to_leave_scene5: {
                text: '隨著一聲清脆的「喀嚓」聲，燈塔頂端那盞塵封已久的燈突然亮了。那一束光穿透海霧，精準地照在燈塔下方的一個隱藏暗格上。\n\n那裡靜靜地放著一封信。\n一封跨越了十年，才終於抵達我手中的信。',
                choices: [
                    { text: '取下信件，讀完它', action: 'next_scene' }
                ]
            }
        }
    },
    // --- 關卡六：答案的終點 ---
    6: {
        bg: 'url("assets/scenes/scene3-letter.png")',
        label: '最後一封信',
        nodes: {
            start: {
                text: '海風漸漸平息。\n我拆開信封，那熟悉的筆跡依然清晰，帶著淡淡的、早已乾透的顯影液氣味。\n\n「蒼，當你讀到這裡時……」',
                choices: [
                    { text: '繼續閱讀', target: 'letter_reading' }
                ]
            },
            letter_reading: {
                text: '「對不起，沒能親口跟你告別。我知道你一定很恨我的突然消失……那是因為，我希望你記憶裡的光，永遠是那個在陽光下大笑、在暗房裡忙碌、在燈塔前與你分擔夢想的少年。」\n\n「我的離開不是背叛，而是我想留給你最後一點溫柔。」',
                choices: [
                    { text: '翻到最後一頁', target: 'ending_deciding' }
                ]
            },
            ending_deciding: {
                text: '信的最後寫著：\n「蒼，帶著這所有的答案，你打算如何開始你的明天？」',
                choices: [
                    { text: '帶著這份溫柔，繼續前行', action: 'ending_true' },
                    { text: '停留在回憶裡，不再追尋', action: 'ending_normal' }
                ]
            }
        }
    }
};
