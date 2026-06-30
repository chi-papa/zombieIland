export type GameStage = 'TITLE' | 'READY_GO' | 'PLAYING' | 'GAMEOVER' | 'VICTORY';

export type RyuAction = 'idle' | 'punch' | 'kick' | 'hurt' | 'dead' | 'victory';
export type ZombieAction = 'idle' | 'attack' | 'hurt' | 'dead';

export interface ZombieWord {
  text: string;
  meaning: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare';
}

export interface BloodParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  type: 'damage' | 'combo' | 'heal' | 'scary' | 'fever';
}

export interface TypingEffect {
  id: number;
  char: string;
  x: number;
  y: number;
  isMiss: boolean;
}

// 豊富なゾンビ・オカルト・和風・アニメ・時代劇・ネットミームタイピング単語リスト（160語以上！）
export const ZOMBIE_WORDS: ZombieWord[] = [
  // ==================== EASY DIFFICULTY (短い単語、基礎英単語、短い日本語) ====================
  // 英語・ゾンビ・ホラー
  { text: "DEAD", meaning: "死者 (デッド)", difficulty: "easy" },
  { text: "BITE", meaning: "噛みつき (バイト)", difficulty: "easy" },
  { text: "KILL", meaning: "倒す / 殺害 (キル)", difficulty: "easy" },
  { text: "HELL", meaning: "地獄 (ヘル)", difficulty: "easy" },
  { text: "SOUL", meaning: "魂 (ソウル)", difficulty: "easy" },
  { text: "FIST", meaning: "拳 (フィスト)", difficulty: "easy" },
  { text: "KICK", meaning: "蹴り (キック)", difficulty: "easy" },
  { text: "DARK", meaning: "闇 (ダーク)", difficulty: "easy" },
  { text: "FEAR", meaning: "恐怖 (フィアー)", difficulty: "easy" },
  { text: "CURE", meaning: "治療薬 (キュア)", difficulty: "easy" },
  { text: "CLAW", meaning: "鋭い爪 (クロウ)", difficulty: "easy" },
  { text: "GRAVE", meaning: "墓穴 (グレイヴ)", difficulty: "easy" },
  { text: "BLOOD", meaning: "血液 (ブラッド)", difficulty: "easy" },
  { text: "BEAST", meaning: "野獣 (ビースト)", difficulty: "easy" },
  { text: "WAVE", meaning: "ゾンビの大波 (ウェイヴ)", difficulty: "easy" },
  { text: "SOS", meaning: "救難信号 (エスオーエス)", difficulty: "easy" },
  { text: "FIRE", meaning: "烈火の如く (ファイア)", difficulty: "easy" },
  { text: "RUN", meaning: "走れ！逃げろ！ (ラン)", difficulty: "easy" },
  { text: "HELP", meaning: "助けてくれ！ (ヘルプ)", difficulty: "easy" },
  { text: "HOPE", meaning: "一筋の希望 (ホープ)", difficulty: "easy" },
  { text: "WOLF", meaning: "狂暴な狼 (ウルフ)", difficulty: "easy" },

  // 日本語基本
  { text: "UTSU", meaning: "撃つ！ (うつ)", difficulty: "easy" },
  { text: "TEKI", meaning: "目の前の敵！ (てき)", difficulty: "easy" },
  { text: "NIGERU", meaning: "逃げるが勝ち (にげる)", difficulty: "easy" },
  { text: "KOWAI", meaning: "お化けは怖い (こわい)", difficulty: "easy" },
  { text: "IKIRU", meaning: "絶対に生きる (いきる)", difficulty: "easy" },
  { text: "YABAI", meaning: "ヤバい！囲まれた (やばい)", difficulty: "easy" },
  { text: "TASUKU", meaning: "仲間を救う (すくう)", difficulty: "easy" },
  { text: "OSOU", meaning: "背後から襲う (おそう)", difficulty: "easy" },
  { text: "TAOSU", meaning: "強敵を倒す (たおす)", difficulty: "easy" },
  { text: "KAGE", meaning: "不気味な影 (かげ)", difficulty: "easy" },
  { text: "KOE", meaning: "ゾンビの呻き声 (こえ)", difficulty: "easy" },
  { text: "SHINU", meaning: "死なば諸共 (しぬ)", difficulty: "easy" },
  { text: "HASIRU", meaning: "全速力で走る (はしる)", difficulty: "easy" },
  { text: "NIKU", meaning: "新鮮な肉 (にく)", difficulty: "easy" },
  { text: "HONE", meaning: "骨まで愛して (ほね)", difficulty: "easy" },
  { text: "KATANA", meaning: "日本刀の刃 (かたな)", difficulty: "easy" },
  { text: "SAKURA", meaning: "桜咲く春 (さくら)", difficulty: "easy" },
  { text: "NINJA", meaning: "闇に潜む忍者 (にんじゃ)", difficulty: "easy" },
  { text: "SAMURAI", meaning: "孤高の武士・侍 (さむらい)", difficulty: "easy" },
  { text: "FUJI", meaning: "日本の魂・富士山 (ふじ)", difficulty: "easy" },
  { text: "NEKO", meaning: "我が家の猫 (ねこ)", difficulty: "easy" },
  { text: "INU", meaning: "忠実な犬 (いぬ)", difficulty: "easy" },

  // 日本文化・グルメ
  { text: "RAMEN", meaning: "豚骨ラーメン (らーめん)", difficulty: "easy" },
  { text: "UDON", meaning: "讃岐うどん (うどん)", difficulty: "easy" },
  { text: "SOBA", meaning: "十割そば (そば)", difficulty: "easy" },
  { text: "SUSHI", meaning: "大トロ握り寿司 (すし)", difficulty: "easy" },
  { text: "SAKE", meaning: "厳選された日本酒 (さけ)", difficulty: "easy" },
  { text: "BENTO", meaning: "幕の内お弁当 (べんとう)", difficulty: "easy" },
  { text: "WASABI", meaning: "鼻にツンとくる山葵 (わさび)", difficulty: "easy" },
  { text: "MATCHA", meaning: "宇治の濃厚抹茶 (まっちゃ)", difficulty: "easy" },
  { text: "TEMPURA", meaning: "サクサクの天ぷら (てんぷら)", difficulty: "easy" },

  // 短い時代劇・アニメ・ネット
  { text: "SEIBAI", meaning: "【時代劇】成敗いたす！ (せいばい)", difficulty: "easy" },
  { text: "ZANSHIN", meaning: "【剣術】残心を忘れるな (ざんしん)", difficulty: "easy" },
  { text: "BANKAI", meaning: "【アニメ】魂を解放せよ、卍解！ (ばんかい)", difficulty: "easy" },
  { text: "KIMETSU", meaning: "【アニメ】悪鬼を滅する刃・鬼滅 (きめつ)", difficulty: "easy" },
  { text: "NANDATO", meaning: "【アニメ】なん…だと…！？ (なんだと)", difficulty: "easy" },
  { text: "OTAKU", meaning: "日本のオタク文化 (おたく)", difficulty: "easy" },
  { text: "SUSHITABETA", meaning: "お腹が空いた、寿司食べたい (すしたべた)", difficulty: "easy" },

  // ==================== MEDIUM DIFFICULTY (標準単語、カタカナ語、技名) ====================
  // 英語
  { text: "ZOMBIE", meaning: "生ける屍の群れ (ゾンビ)", difficulty: "medium" },
  { text: "ATTACK", meaning: "一斉強襲開始 (アタック)", difficulty: "medium" },
  { text: "SHADOW", meaning: "月夜に伸びる暗影 (シャドウ)", difficulty: "medium" },
  { text: "AMBUSH", meaning: "物陰からの奇襲 (アンブッシュ)", difficulty: "medium" },
  { text: "HUNTER", meaning: "飢えた野生の捕食者 (ハンター)", difficulty: "medium" },
  { text: "HAUNTED", meaning: "呪われた心霊地帯 (ホーンテッド)", difficulty: "medium" },
  { text: "VICTIM", meaning: "悲劇の犠牲者 (ヴィクティム)", difficulty: "medium" },
  { text: "MURDER", meaning: "惨殺事件の謎 (マーダー)", difficulty: "medium" },
  { text: "MUTANT", meaning: "恐るべき凶暴変異体 (ミュータント)", difficulty: "medium" },
  { text: "SURVIVE", meaning: "何が何でも生き残る (サバイブ)", difficulty: "medium" },
  { text: "OUTBREAK", meaning: "最悪のウイルス感染爆発 (アウトブレイク)", difficulty: "medium" },
  { text: "APOCALYPSE", meaning: "世界の終焉と崩壊 (アポカリプス)", difficulty: "medium" },
  { text: "HALLOWEEN", meaning: "カボチャとお化けの祭り (ハロウィン)", difficulty: "medium" },
  { text: "GRAVEYARD", meaning: "霧が立ち込める夜の墓地 (グレイヴヤード)", difficulty: "medium" },
  { text: "FRANKENSTEIN", meaning: "心優しき人造人間 (フランケンシュタイン)", difficulty: "medium" },

  // 日本語
  { text: "HADOUKEN", meaning: "【必殺】波動を凝縮せよ、波動拳！ (はどうけん)", difficulty: "medium" },
  { text: "SHORYUKEN", meaning: "【必殺】天を衝く一撃、昇竜拳！ (しょうりゅうけん)", difficulty: "medium" },
  { text: "KATANAKEN", meaning: "名刀「虎徹」の切れ味 (にほんとう)", difficulty: "medium" },
  { text: "ZOMBIETAIJI", meaning: "ゾンビ退治の専門家部隊 (ぞんびたいじ)", difficulty: "medium" },
  { text: "NIGERUNA", meaning: "背中を見せるな、戦え！ (にげるな)", difficulty: "medium" },
  { text: "KESSENNOTOK", meaning: "ついに決戦の時が来た (けっせんのとき)", difficulty: "medium" },
  { text: "YASURAGI", meaning: "束の間しか得られぬ安らぎ (つかのまのやす)", difficulty: "medium" },
  { text: "SABAIBARU", meaning: "極限状態のサバイバル生活 (さばいばる)", difficulty: "medium" },
  { text: "TETSUGAKU", meaning: "生と死を巡る深き哲学 (せいとしのてつ)", difficulty: "medium" },
  { text: "DOKUDOKU", meaning: "毒々しい紫色の沼地 (どくどくしい)", difficulty: "medium" },
  { text: "HIKARIYAMI", meaning: "光と闇が交錯する境界線 (ひかりとやみ)", difficulty: "medium" },
  { text: "TSUSHINKI", meaning: "壊れた無線通信機のパーツ (つうしんき)", difficulty: "medium" },
  { text: "TAIPINGU", meaning: "電光石火の超速タイピング (たいぴんぐ)", difficulty: "medium" },
  { text: "YAKITORI", meaning: "炭火焼き鳥（ねぎま・塩） (やきとり)", difficulty: "medium" },
  { text: "TAKOPACK", meaning: "みんなで楽しいたこ焼きパーティー (たこぱ)", difficulty: "medium" },
  { text: "SENPAI", meaning: "密かに憧れる部活の先輩 (せんぱい)", difficulty: "medium" },
  { text: "TSUNDERE", meaning: "素直になれないツンデレ気質 (つんでれ)", difficulty: "medium" },
  { text: "YANDERE", meaning: "愛が重すぎるヤンデレの眼差し (やんでれ)", difficulty: "medium" },

  // 時代劇・アニメ・ご当地
  { text: "DURANDAL", meaning: "【聖剣】輝ける不滅の剣・デュランダル", difficulty: "medium" },
  { text: "RASENGAN", meaning: "【アニメ】超凝縮回転球、螺旋丸！ (らせんがん)", difficulty: "medium" },
  { text: "CHIDORI", meaning: "【アニメ】千羽の鳥が囁く電光、千鳥！ (ちどり)", difficulty: "medium" },
  { text: "SHINIGAMI", meaning: "【怪談】命を刈り取る死神の大きな鎌 (しにがみ)", difficulty: "medium" },
  { text: "SESHU", meaning: "【時代劇】拙者、ただの通りすがりの武芸者", difficulty: "medium" },
  { text: "KATANAKAJI", meaning: "【時代劇】魂を吹き込む伝説の刀鍛冶 (かたなかじ)", difficulty: "medium" },
  { text: "KABUKI", meaning: "【伝統】絢爛豪華な歌舞伎の大舞台 (かぶき)", difficulty: "medium" },
  { text: "GOEMON", meaning: "【時代劇】天下の義賊、大泥棒石川五右衛門", difficulty: "medium" },
  { text: "VAMPIRE", meaning: "【怪異】夜の支配者、吸血鬼ドラキュラ伯爵", difficulty: "medium" },
  { text: "SHINJYUKU", meaning: "不夜城、眠らない街・新宿歌舞伎町", difficulty: "medium" },
  { text: "AKIHABARA", meaning: "世界のオタクの聖地・秋葉原電脳街", difficulty: "medium" },
  { text: "SHIBUYACROSS", meaning: "人が行き交う渋谷スクランブル交差点", difficulty: "medium" },
  { text: "MAIDCAFE", meaning: "「萌え萌えキュン」メイドカフェの魔法", difficulty: "medium" },

  // ==================== HARD DIFFICULTY (長文、難しい熟語、アニメ・時代劇セリフ) ====================
  // 英語
  { text: "INFECTION", meaning: "世界中に蔓延する未知のウイルス感染症", difficulty: "hard" },
  { text: "NIGHTMARE", meaning: "決して目覚めることのない無限の悪夢", difficulty: "hard" },
  { text: "QUARANTINE", meaning: "政府によって封鎖された極秘強制隔離地域", difficulty: "hard" },
  { text: "BIOHAZARD", meaning: "生物化学兵器の漏洩による壊滅的災害", difficulty: "hard" },
  { text: "SCAVENGER", meaning: "荒廃した世界を彷徨い物資を回収する者", difficulty: "hard" },
  { text: "ANNIHILATION", meaning: "すべての生ける脅威の完全消滅および殲滅", difficulty: "hard" },
  { text: "NECROMANCER", meaning: "死者を操る禁忌の秘術を体得した魔導士", difficulty: "hard" },

  // 日本語
  { text: "YURUSANAIZO", meaning: "お前たちの非道、絶対に許さぬぞ！ (ゆるさない)", difficulty: "hard" },
  { text: "TASUKETEMASU", meaning: "おーい！誰か助けてくれ、ここにいるぞ！ (たすけて)", difficulty: "hard" },
  { text: "SABAIBARUKING", meaning: "過酷な荒野を生き抜くサバイバルキング (おうじゃ)", difficulty: "hard" },
  { text: "HAJIKEROFIRE", meaning: "キーボードが赤く燃える！タイピングの火花", difficulty: "hard" },
  { text: "RYUKENBUTO", meaning: "昇竜の怒り、打鍵がキーボードに風穴を穿つ", difficulty: "hard" },
  { text: "KAMIKAMITYPE", meaning: "噛み噛みにならず、最後まで流麗に叩けるか？", difficulty: "hard" },
  { text: "KOREDESAIGO", meaning: "これが救命ボートを動かす最後の通信パーツだ", difficulty: "hard" },
  { text: "GENKIDASEYO", meaning: "下を向くな、生き抜くために元気を出せ！", difficulty: "hard" },
  { text: "ZOMBIEGAOSOU", meaning: "一瞬の油断、背後の暗闇からゾンビが強襲する！", difficulty: "hard" },
  { text: "URANOMANJOU", meaning: "裏の林に隠されてる幻の秘薬を回収せよ", difficulty: "hard" },
  { text: "YAKUSHOKUDESU", meaning: "約束の灯火が見えるあの高い丘の上で待っている", difficulty: "hard" },
  { text: "TONIMAKUNIGE", meaning: "考えるな、とにかく無我夢中でダッシュして逃げろ", difficulty: "hard" },
  { text: "DANGASANGETS", meaning: "迫り来るゾンビの群れ、断崖絶壁に追い詰められる", difficulty: "hard" },
  { text: "HOSHIZORALOVE", meaning: "満天の星空に届け、涙のSOS信号機 (ひかり)", difficulty: "hard" },
  { text: "SAYONARAZOM", meaning: "さようなら、全ての生ける屍、そして愛しき世界よ", difficulty: "hard" },
  { text: "YUMEOMITEIRU", meaning: "これは現実なのか？それともただの悪夢なのか…", difficulty: "hard" },
  { text: "SHINNDEKUKAI", meaning: "こんな場所で死んでたまるか、意地でも生き抜く", difficulty: "hard" },
  { text: "DANGERZONE", meaning: "立入禁止区域、人類未踏の危険地帯に突入する！", difficulty: "hard" },
  { text: "SAIKOUNOHIBI", meaning: "ピンチを楽しめ！最高にエキサイティングな日々", difficulty: "hard" },
  { text: "YAKINIKUTABETAI", meaning: "高級な特上カルビと霜降り牛タンをたらふく食べたい", difficulty: "hard" },
  { text: "CHUNIBYOUDA", meaning: "闇の焔に抱かれて消えろ！邪気眼が疼きだす…！", difficulty: "hard" },
  { text: "KAGEBUNSHIN", meaning: "【忍者】一瞬にして幻影を作る、影分身の術！", difficulty: "hard" },
  { text: "KOTATSUMIKAN", meaning: "寒い冬の日は、温かいコタツで甘いみかんを食べる", difficulty: "hard" },
  { text: "REINKARUNATION", meaning: "不慮の事故から中世ヨーロッパ風の異世界へ転生する", difficulty: "hard" },

  // 時代劇・アニメ
  { text: "BUSIDOTOHA", meaning: "【時代劇】武士道というは、死ぬ事と見付けたり", difficulty: "hard" },
  { text: "SHUGEKIDAN", meaning: "【時代劇】火急の事態！浪士たちの夜襲に備えよ", difficulty: "hard" },
  { text: "TENKAFUBU", meaning: "【時代劇】魔王・織田信長が掲げた覇道「天下布武」", difficulty: "hard" },
  { text: "YAHARIMURI", meaning: "【アニメ】やはり俺の青春ラブコメはまちがっている", difficulty: "hard" },
  { text: "REZEROSTART", meaning: "【アニメ】絶望を巻き戻せ、ゼロから始める異世界生活", difficulty: "hard" },
  { text: "NIGETEKATSU", meaning: "【ドラマ】負けるが勝ち、逃げるは恥だが役に立つ", difficulty: "hard" },
  { text: "KOKOKARAHIGERU", meaning: "【時代劇】ここから先は、この私が一歩も通さぬ！", difficulty: "hard" },
  { text: "ONOREZOMBIE", meaning: "【時代劇】おのれ奇怪なゾンビめ、直ちに成敗してくれる", difficulty: "hard" },

  // ==================== NIGHTMARE DIFFICULTY (早口言葉、神業・超長文、名台詞、鬼畜課題) ====================
  // 早口言葉 (Typing Hell)
  { text: "TOKYOTOKKYOHOKYOKUKYOKUCHOU", meaning: "【早口】東京特許許可局 局長（とうきょうとっきょきょかきょく）", difficulty: "nightmare" },
  { text: "AKAMAKIGAMIAOMAKIGAMIKIMAKIGAMI", meaning: "【早口】赤巻紙青巻紙黄巻紙（あかまきがみあおまきがみきまきがみ）", difficulty: "nightmare" },
  { text: "BOUZUGABYOUBLEUNITATETAKAJI", meaning: "【早口】坊主が屏風に上手に絵を描いた（ぼうずがびょうぶに）", difficulty: "nightmare" },
  { text: "NOMINOOMINOSOSHITEBUSUNIKU", meaning: "【早口】隣の客はよく柿食う客だ（となりのきゃくはよくかきくう）", difficulty: "nightmare" },
  { text: "SHANSHANSHANSONSHOW", meaning: "【早口】新春シャンソンショー（しんしゅんしゃんそんしょー）", difficulty: "nightmare" },
  { text: "TAKEGAKINITAKETATETAKETA", meaning: "【早口】竹垣に竹立てかけたのは竹立てたかったから竹立てかけた", difficulty: "nightmare" },

  // 神業・超長文 (Typing Master)
  { text: "KYUKYOKUNOTAIPIST", meaning: "【神業】キーボードの極限に挑む究極のタイピストが今ここに覚醒する！", difficulty: "nightmare" },
  { text: "YURUSANAIZOZOMBIE", meaning: "【執念】この危険極まりないゾンビだらけの孤島から、絶対に全員で生きて脱出する！", difficulty: "nightmare" },
  { text: "ARIGATOUGOZAIMASHITA", meaning: "【大感謝】私たちの作った和風ゾンビタイピングゲームを最後まで遊んでくれて大感謝！", difficulty: "nightmare" },
  { text: "KOKOMADENOYOUDANAZOMBIE", meaning: "【深淵】これにて終局だ。私の前に立ちはだかる哀れな屍は、全て指先の打鍵で塵と化せ！", difficulty: "nightmare" },
  { text: "OMAEWAMOUSHINDERU", meaning: "【世紀末】北斗百裂拳タイピング！「お前はもう、死んでいる…！たわば！」", difficulty: "nightmare" },
  { text: "HADOUKENTATSUMAKISHORYU", meaning: "【必殺】究極無双奥義：波動拳！竜巻旋風脚！昇竜拳！真空波動拳！瞬獄殺！", difficulty: "nightmare" },
  { text: "BUTSURIKIBODOKAKUSEI", meaning: "【神業】青軸メカニカルキーボードから放たれる、雷鳴の如き爆速打鍵連打音", difficulty: "nightmare" },
  { text: "MINAMIMURANOMINAMIKAZE", meaning: "【叙情】うららかな南の村に優しい南風が吹き抜ける頃、私は必ずあなたの元へ還る", difficulty: "nightmare" },
  { text: "KAGUATSUSHINKIKAGUATSU", meaning: "【煉獄】神々の逆鱗に触れ、活火山から放たれた灼熱の溶岩とタイピングの業火", difficulty: "nightmare" },
  { text: "YOROSHIKUONEGAISHIMASU", meaning: "【丁寧】本日はご多忙のところ恐縮ですが、何卒よろしくお願い申し上げます！", difficulty: "nightmare" },
  { text: "FINGERFIREWORK", meaning: "【絶技】キーボードの上を激しく乱舞する、まるで千手観音の如き超絶技巧の指先", difficulty: "nightmare" },
  { text: "SOSFROMISLAND", meaning: "【絶体絶命】波飛沫が吹き荒れる絶海の孤島から、壊れたアンテナで満天の夜空にSOSを放て！", difficulty: "nightmare" },
  { text: "CHIKYUSAIGO", meaning: "【人類】これは地球の存亡を賭けた、人類最後にして最高峰のタイピングサバイバルバトルだ", difficulty: "nightmare" },

  // 時代劇名セリフ・名著
  { text: "SHIZUMARESHIZUMARE", meaning: "【時代劇】静まれ、静まれい！この格調高き黄門様の御紋所が目に入らぬか！控えおろう！", difficulty: "nightmare" },
  { text: "TOYAMASAKURA", meaning: "【時代劇】おうおう！この背中に咲いた見事な桜吹雪、まさか見忘れたとは言わせねえぜ！", difficulty: "nightmare" },
  { text: "SHISEKABANE", meaning: "【時代劇】死して屍拾う者なし。無念の怨敵たち、いざ尋常に勝負いたす！", difficulty: "nightmare" },
  { text: "KONOMONDOROGA", meaning: "【時代劇】こちらにおわすお方をどなたと心得る！恐れ多くも先の副将軍、水戸光圀公なるぞ！", difficulty: "nightmare" },
  { text: "KUBIWOSASHIDASE", meaning: "【時代劇】悪党ども！観念して神妙にお縄を頂戴しろ！正義の刃の露と消えよ！", difficulty: "nightmare" },
  { text: "ECHIYAWAIKAGA", meaning: "【時代劇】悪代官「越後屋、お主もなかなかの悪よのう」越後屋「いえいえ、お代官様ほどでは…」", difficulty: "nightmare" },
  { text: "WAGAHAIWANEKODA", meaning: "【文学】吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。", difficulty: "nightmare" },
  { text: "KINKAKUTEMPLE", meaning: "【古典】祇園精舎の鐘の声、諸行無常の響きあり。沙羅双樹の花の色、盛者必衰の理をあらわす。", difficulty: "nightmare" },

  // アニメ・映画名セリフ・ネットミーム
  { text: "KUCHIKUSHITEYARU", meaning: "【アニメ】駆逐してやる！この汚れた世界から、巨人のごときゾンビを一匹残らず！", difficulty: "nightmare" },
  { text: "AKIRAMETARAOWARI", meaning: "【アニメ】諦めたらそこで試合終了だよ。最後まで希望を捨てちゃいけない、諦めるな！", difficulty: "nightmare" },
  { text: "SHINJITSUITSUMO", meaning: "【アニメ】見た目は子供、頭脳は大人！真実はいつもひとつ！たった一つの真実を暴け！", difficulty: "nightmare" },
  { text: "WAGAIKIGITEN", meaning: "【アニメ】我が究極の拳は天をも穿つ！我が生涯に、一片の悔いなし！さらばだ！", difficulty: "nightmare" },
  { text: "KAMIWAKOETA", meaning: "【アニメ】私は新世界の神となる！世界中の悪をこの手で裁き、理想の楽園を創るのだ！", difficulty: "nightmare" },
  { text: "BALUSUSEKAI", meaning: "【アニメ】終末の呪文を唱えよ！３分間待ってやる！目が、目がぁ！バルス！", difficulty: "nightmare" },
  { text: "JIGOKURAKU", meaning: "【アニメ】生殺与奪の権を他人に握らせるな！惨めな姿で敵に屈するな、立ち上がれ！", difficulty: "nightmare" },
  { text: "IWILLBEBACK" , meaning: "【映画】ここでの戦いは一度引くが、必ずや再び舞い戻ってくる。「地獄で会おうぜ」", difficulty: "nightmare" }
];
