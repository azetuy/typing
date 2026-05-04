let levels = [
  {
    name: "Starter",
    rank: "Apprentice",
    note: "まずは短い単語から。",
    xpToNext: 5,
    words: [
      ["apple", "りんご"],
      ["book", "本"],
      ["water", "水"],
      ["happy", "幸せな"],
      ["music", "音楽"],
      ["green", "緑の"],
      ["chair", "いす"],
      ["smile", "ほほえむ"],
    ],
  },
  {
    name: "Daily",
    rank: "Traveler",
    note: "毎日の会話で使う単語。",
    xpToNext: 12,
    words: [
      ["morning", "朝"],
      ["family", "家族"],
      ["picture", "写真、絵"],
      ["kitchen", "台所"],
      ["weather", "天気"],
      ["station", "駅"],
      ["favorite", "お気に入りの"],
      ["message", "伝言、メッセージ"],
    ],
  },
  {
    name: "School",
    rank: "Scholar",
    note: "少し長い学習単語へ。",
    xpToNext: 22,
    words: [
      ["history", "歴史"],
      ["science", "科学"],
      ["library", "図書館"],
      ["practice", "練習する"],
      ["question", "質問"],
      ["language", "言語"],
      ["exercise", "運動、練習"],
      ["knowledge", "知識"],
    ],
  },
  {
    name: "Challenge",
    rank: "Explorer",
    note: "スペルの集中力が試される。",
    xpToNext: 36,
    words: [
      ["adventure", "冒険"],
      ["discover", "発見する"],
      ["improve", "改善する"],
      ["creative", "創造的な"],
      ["confident", "自信のある"],
      ["important", "重要な"],
      ["decision", "決定"],
      ["possible", "可能な"],
    ],
  },
  {
    name: "Master",
    rank: "Word Master",
    note: "英検や読解でも出会う単語。",
    xpToNext: 52,
    words: [
      ["environment", "環境"],
      ["opportunity", "機会"],
      ["responsible", "責任がある"],
      ["communicate", "伝える"],
      ["experience", "経験"],
      ["independent", "独立した"],
      ["achievement", "達成"],
      ["concentrate", "集中する"],
    ],
  },
];

const targetWordCounts = {
  "小1": 80,
  "小2": 160,
  "小3": 200,
  "小4": 202,
  "小5": 193,
  "小6": 191,
};

const targetPracticeCounts = {
  "小1": 240,
  "小2": 480,
  "小3": 600,
  "小4": 404,
  "小5": 386,
  "小6": 382,
};

const levelOrder = {
  "小1": 1,
  "小2": 2,
  "小3": 3,
  "小4": 4,
  "小5": 5,
  "小6": 6,
};

const kyoikuSourceUrls = {
  grades: "https://cdn.jsdelivr.net/gh/fnshr/kyo-kan@master/kyoiku-kanji-2017.csv",
  readings: "https://cdn.jsdelivr.net/gh/mimneko/kanji-data@main/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E8%A1%A8%E6%9C%AC%E8%A1%A8.json",
};

const fallbackReadingUrls = [
  "https://cdn.jsdelivr.net/gh/mimneko/kanji-data@main/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E8%A1%A8%E6%9C%AC%E8%A1%A8.json",
  "https://raw.githubusercontent.com/mimneko/kanji-data/main/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E8%A1%A8%E6%9C%AC%E8%A1%A8.json",
  "https://cdn.jsdelivr.net/gh/mimneko/kanji-data@main/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E8%A1%A8_%E9%9F%B3%E8%A8%93%E3%83%BB%E7%94%A8%E4%BE%8B%E4%BB%98%E3%81%8D.json",
  "https://raw.githubusercontent.com/mimneko/kanji-data/main/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E8%A1%A8_%E9%9F%B3%E8%A8%93%E3%83%BB%E7%94%A8%E4%BE%8B%E4%BB%98%E3%81%8D.json",
];

const dojoDataset = "AkabekoLabs/nihongo-dojo-grades1-2-3-4-5-6-kanji_reading-kanji_writing";
const dojoSplits = ["train", "validation", "test"];

const kyoikuGradeLabels = {
  1: "小1",
  2: "小2",
  3: "小3",
  4: "小4",
  5: "小5",
  6: "小6",
};

const reviewedUpperGradeRows = [
  ["小1", "青空", "あおぞら", "晴れた日の青い空", "熟語", "青空を見る", "", "word", "青 空", "訓", "manual-reviewed", "青空"],
  ["小1", "赤い", "あかい", "赤の色をしている", "送り仮名", "赤い花", "", "word", "赤", "訓", "manual-reviewed", "赤い"],
  ["小1", "石ころ", "いしころ", "小さな石", "送り仮名", "石ころを拾う", "", "word", "石", "訓", "manual-reviewed", "石ころ"],
  ["小1", "糸まき", "いとまき", "糸を巻いたもの", "送り仮名", "糸まきを使う", "", "word", "糸", "訓", "manual-reviewed", "糸まき"],
  ["小1", "音楽", "おんがく", "歌や楽器の音", "熟語", "音楽を聞く", "", "word", "音 楽", "音", "manual-reviewed", "音楽"],
  ["小1", "学校", "がっこう", "勉強する場所", "熟語", "学校へ行く", "", "word", "学 校", "音", "manual-reviewed", "学校"],
  ["小1", "休む", "やすむ", "体や心を休ませる", "送り仮名", "早く休む", "", "word", "休", "訓", "manual-reviewed", "休む"],
  ["小1", "空気", "くうき", "まわりにある気体", "熟語", "空気を入れる", "", "word", "空 気", "音", "manual-reviewed", "空気"],
  ["小1", "見る", "みる", "目でたしかめる", "送り仮名", "絵を見る", "", "word", "見", "訓", "manual-reviewed", "見る"],
  ["小1", "出る", "でる", "外へ行く", "送り仮名", "家を出る", "", "word", "出", "訓", "manual-reviewed", "出る"],
  ["小1", "入る", "はいる", "中へ行く", "送り仮名", "教室に入る", "", "word", "入", "訓", "manual-reviewed", "入る"],
  ["小1", "正しい", "ただしい", "まちがっていない", "送り仮名", "正しい答え", "", "word", "正", "訓", "manual-reviewed", "正しい"],
  ["小1", "生きる", "いきる", "命がある", "送り仮名", "生き物が生きる", "", "word", "生", "訓", "manual-reviewed", "生きる"],
  ["小1", "先生", "せんせい", "教えてくれる人", "熟語", "先生に聞く", "", "word", "先 生", "音", "manual-reviewed", "先生"],
  ["小1", "大きい", "おおきい", "サイズが大きい", "送り仮名", "大きい犬", "ookii", "word", "大", "訓", "manual-reviewed", "大きい"],
  ["小1", "小さい", "ちいさい", "サイズが小さい", "送り仮名", "小さい花", "chiisai", "word", "小", "訓", "manual-reviewed", "小さい"],
  ["小1", "手紙", "てがみ", "用事や気持ちを書いて送るもの", "熟語", "手紙を書く", "", "word", "手 紙", "訓", "manual-reviewed", "手紙"],
  ["小1", "白い", "しろい", "白の色をしている", "送り仮名", "白い雲", "", "word", "白", "訓", "manual-reviewed", "白い"],
  ["小1", "本当", "ほんとう", "うそではないこと", "熟語", "本当の話", "", "word", "本 当", "音", "manual-reviewed", "本当"],
  ["小1", "町中", "まちなか", "町の中", "熟語", "町中を歩く", "", "word", "町 中", "訓", "manual-reviewed", "町中"],
  ["小2", "朝日", "あさひ", "朝の太陽の光", "熟語", "朝日がのぼる", "", "word", "朝 日", "訓", "manual-reviewed", "朝日"],
  ["小2", "歩く", "あるく", "足で進む", "送り仮名", "道を歩く", "", "word", "歩", "訓", "manual-reviewed", "歩く"],
  ["小2", "考える", "かんがえる", "頭を使って思う", "送り仮名", "答えを考える", "", "word", "考", "訓", "manual-reviewed", "考える"],
  ["小2", "強い", "つよい", "力がある", "送り仮名", "強い風", "", "word", "強", "訓", "manual-reviewed", "強い"],
  ["小2", "教室", "きょうしつ", "授業を受ける部屋", "熟語", "教室に入る", "", "word", "教 室", "音", "manual-reviewed", "教室"],
  ["小2", "近く", "ちかく", "距離が短いこと", "送り仮名", "学校の近く", "", "word", "近", "訓", "manual-reviewed", "近く"],
  ["小2", "計算", "けいさん", "数を使って答えを出すこと", "熟語", "計算をする", "", "word", "計 算", "音", "manual-reviewed", "計算"],
  ["小2", "公園", "こうえん", "遊んだり休んだりする広場", "熟語", "公園で遊ぶ", "", "word", "公 園", "音", "manual-reviewed", "公園"],
  ["小2", "心配", "しんぱい", "気にかかって不安なこと", "熟語", "友だちを心配する", "", "word", "心 配", "音", "manual-reviewed", "心配"],
  ["小2", "走る", "はしる", "速く進む", "送り仮名", "校庭を走る", "", "word", "走", "訓", "manual-reviewed", "走る"],
  ["小2", "止まる", "とまる", "動かなくなる", "送り仮名", "車が止まる", "", "word", "止", "訓", "manual-reviewed", "止まる"],
  ["小2", "読む", "よむ", "文字を声や心の中で言葉にする", "送り仮名", "本を読む", "", "word", "読", "訓", "manual-reviewed", "読む"],
  ["小2", "書く", "かく", "文字を書く", "送り仮名", "名前を書く", "", "word", "書", "訓", "manual-reviewed", "書く"],
  ["小2", "買う", "かう", "お金を出して手に入れる", "送り仮名", "本を買う", "", "word", "買", "訓", "manual-reviewed", "買う"],
  ["小2", "売る", "うる", "品物をわたしてお金を受け取る", "送り仮名", "野菜を売る", "", "word", "売", "訓", "manual-reviewed", "売る"],
  ["小2", "夏休み", "なつやすみ", "夏の長い休み", "熟語", "夏休みに出かける", "", "word", "夏 休", "訓", "manual-reviewed", "夏休み"],
  ["小2", "親切", "しんせつ", "人にやさしくすること", "熟語", "親切に教える", "", "word", "親 切", "音", "manual-reviewed", "親切"],
  ["小2", "答える", "こたえる", "質問に返事をする", "送り仮名", "質問に答える", "", "word", "答", "訓", "manual-reviewed", "答える"],
  ["小2", "知らせる", "しらせる", "人に伝える", "送り仮名", "予定を知らせる", "", "word", "知", "訓", "manual-reviewed", "知らせる"],
  ["小2", "帰る", "かえる", "もとの場所へ戻る", "送り仮名", "家に帰る", "", "word", "帰", "訓", "manual-reviewed", "帰る"],
  ["小3", "悪い", "わるい", "よくない", "送り仮名", "悪いくせ", "", "word", "悪", "訓", "manual-reviewed", "悪い"],
  ["小3", "安心", "あんしん", "心配がないこと", "熟語", "安心して眠る", "", "word", "安 心", "音", "manual-reviewed", "安心"],
  ["小3", "医者", "いしゃ", "病気を診る人", "熟語", "医者に相談する", "", "word", "医 者", "音", "manual-reviewed", "医者"],
  ["小3", "委員", "いいん", "役目を受け持つ人", "熟語", "委員を決める", "", "word", "委 員", "音", "manual-reviewed", "委員"],
  ["小3", "育てる", "そだてる", "大きくなるよう世話をする", "送り仮名", "花を育てる", "", "word", "育", "訓", "manual-reviewed", "育てる"],
  ["小3", "泳ぐ", "およぐ", "水の中を進む", "送り仮名", "プールで泳ぐ", "", "word", "泳", "訓", "manual-reviewed", "泳ぐ"],
  ["小3", "荷物", "にもつ", "運ぶ物", "熟語", "荷物を持つ", "", "word", "荷 物", "訓", "manual-reviewed", "荷物"],
  ["小3", "客席", "きゃくせき", "客が座る席", "熟語", "客席に座る", "", "word", "客 席", "音", "manual-reviewed", "客席"],
  ["小3", "急ぐ", "いそぐ", "早くしようとする", "送り仮名", "学校へ急ぐ", "", "word", "急", "訓", "manual-reviewed", "急ぐ"],
  ["小3", "決める", "きめる", "はっきりと選ぶ", "送り仮名", "係を決める", "", "word", "決", "訓", "manual-reviewed", "決める"],
  ["小3", "幸せ", "しあわせ", "うれしく満たされた気持ち", "送り仮名", "幸せな時間", "", "word", "幸", "訓", "manual-reviewed", "幸せ"],
  ["小3", "歯医者", "はいしゃ", "歯を治す医者", "熟語", "歯医者へ行く", "", "word", "歯 医 者", "訓", "manual-reviewed", "歯医者"],
  ["小3", "使う", "つかう", "道具などを役立てる", "送り仮名", "道具を使う", "", "word", "使", "訓", "manual-reviewed", "使う"],
  ["小3", "始める", "はじめる", "物事を始める", "送り仮名", "勉強を始める", "", "word", "始", "訓", "manual-reviewed", "始める"],
  ["小3", "深い", "ふかい", "底までの距離が大きい", "送り仮名", "深い池", "", "word", "深", "訓", "manual-reviewed", "深い"],
  ["小3", "進む", "すすむ", "前へ行く", "送り仮名", "道を進む", "", "word", "進", "訓", "manual-reviewed", "進む"],
  ["小3", "相手", "あいて", "いっしょに何かをする人", "熟語", "相手の話を聞く", "", "word", "相 手", "訓", "manual-reviewed", "相手"],
  ["小3", "短い", "みじかい", "長さや時間が少ない", "送り仮名", "短い文", "", "word", "短", "訓", "manual-reviewed", "短い"],
  ["小3", "鉄橋", "てっきょう", "鉄でできた橋", "熟語", "鉄橋を渡る", "", "word", "鉄 橋", "音", "manual-reviewed", "鉄橋"],
  ["小3", "様子", "ようす", "物事のありさま", "熟語", "外の様子を見る", "", "word", "様 子", "音", "manual-reviewed", "様子"],
  ["小4", "案内", "あんない", "道や内容を知らせること", "熟語", "案内を読む", "", "word", "案 内", "音", "manual-reviewed", "案内"],
  ["小4", "以後", "いご", "その時からあと", "熟語", "以後は静かにする", "", "word", "以 後", "音", "manual-reviewed", "以後"],
  ["小4", "印刷", "いんさつ", "文字や絵を紙に写すこと", "熟語", "資料を印刷する", "", "word", "印 刷", "音", "manual-reviewed", "印刷"],
  ["小4", "加える", "くわえる", "足して多くする", "送り仮名", "水を加える", "", "word", "加", "訓", "manual-reviewed", "加える"],
  ["小4", "改める", "あらためる", "もう一度見直して直す", "送り仮名", "考えを改める", "", "word", "改", "訓", "manual-reviewed", "改める"],
  ["小4", "観察", "かんさつ", "よく見て調べること", "熟語", "植物を観察する", "", "word", "観 察", "音", "manual-reviewed", "観察"],
  ["小4", "関係", "かんけい", "つながり", "熟語", "二つの関係を考える", "", "word", "関 係", "音", "manual-reviewed", "関係"],
  ["小4", "願う", "ねがう", "そうなってほしいと思う", "送り仮名", "成功を願う", "", "word", "願", "訓", "manual-reviewed", "願う"],
  ["小4", "競争", "きょうそう", "勝ち負けを争うこと", "熟語", "競争に参加する", "", "word", "競 争", "音", "manual-reviewed", "競争"],
  ["小4", "訓読み", "くんよみ", "日本語の意味に合わせた漢字の読み", "熟語", "訓読みを覚える", "", "word", "訓 読", "音", "manual-reviewed", "訓読み"],
  ["小4", "建てる", "たてる", "建物を作る", "送り仮名", "家を建てる", "", "word", "建", "訓", "manual-reviewed", "建てる"],
  ["小4", "候補", "こうほ", "選ばれる可能性があるもの", "熟語", "候補を選ぶ", "", "word", "候 補", "音", "manual-reviewed", "候補"],
  ["小4", "差す", "さす", "光などが入る", "送り仮名", "日が差す", "", "word", "差", "訓", "manual-reviewed", "差す"],
  ["小4", "菜園", "さいえん", "野菜を育てる畑", "熟語", "菜園で野菜を育てる", "", "word", "菜 園", "音", "manual-reviewed", "菜園"],
  ["小4", "残る", "のこる", "あとに残される", "送り仮名", "時間が残る", "", "word", "残", "訓", "manual-reviewed", "残る"],
  ["小4", "順番", "じゅんばん", "決まったならび", "熟語", "順番を待つ", "", "word", "順 番", "音", "manual-reviewed", "順番"],
  ["小4", "静か", "しずか", "音や動きが少ない", "送り仮名", "静かな教室", "", "word", "静", "訓", "manual-reviewed", "静か"],
  ["小4", "説明", "せつめい", "分かるように話すこと", "熟語", "理由を説明する", "", "word", "説 明", "音", "manual-reviewed", "説明"],
  ["小4", "続ける", "つづける", "やめずに行う", "送り仮名", "練習を続ける", "", "word", "続", "訓", "manual-reviewed", "続ける"],
  ["小4", "働く", "はたらく", "仕事をする", "送り仮名", "店で働く", "", "word", "働", "訓", "manual-reviewed", "働く"],
  ["小5", "圧力", "あつりょく", "押す力", "熟語", "水の圧力を調べる", "", "word", "圧 力", "音", "manual-reviewed", "圧力"],
  ["小5", "移る", "うつる", "場所や状態が変わる", "送り仮名", "席を移る", "", "word", "移", "訓", "manual-reviewed", "移る"],
  ["小5", "因果", "いんが", "原因と結果のつながり", "熟語", "因果関係を考える", "", "word", "因 果", "音", "manual-reviewed", "因果"],
  ["小5", "永遠", "えいえん", "いつまでも続くこと", "熟語", "永遠に残る", "", "word", "永 遠", "音", "manual-reviewed", "永遠"],
  ["小5", "応える", "こたえる", "期待や呼びかけに反応する", "送り仮名", "期待に応える", "", "word", "応", "訓", "manual-reviewed", "応える"],
  ["小5", "快適", "かいてき", "気持ちよく過ごせること", "熟語", "快適な部屋", "", "word", "快 適", "音", "manual-reviewed", "快適"],
  ["小5", "過ぎる", "すぎる", "時間や程度をこえる", "送り仮名", "時間が過ぎる", "", "word", "過", "訓", "manual-reviewed", "過ぎる"],
  ["小5", "構成", "こうせい", "いくつかの部分で作ること", "熟語", "文章の構成を考える", "", "word", "構 成", "音", "manual-reviewed", "構成"],
  ["小5", "支える", "ささえる", "倒れないようにする", "送り仮名", "柱が屋根を支える", "", "word", "支", "訓", "manual-reviewed", "支える"],
  ["小5", "示す", "しめす", "分かるように表す", "送り仮名", "例を示す", "", "word", "示", "訓", "manual-reviewed", "示す"],
  ["小5", "証明", "しょうめい", "正しいことを明らかにすること", "熟語", "考えを証明する", "", "word", "証 明", "音", "manual-reviewed", "証明"],
  ["小5", "増える", "ふえる", "数や量が多くなる", "送り仮名", "人口が増える", "", "word", "増", "訓", "manual-reviewed", "増える"],
  ["小5", "測る", "はかる", "長さや量を調べる", "送り仮名", "長さを測る", "", "word", "測", "訓", "manual-reviewed", "測る"],
  ["小5", "適切", "てきせつ", "目的によく合っていること", "熟語", "適切な言葉を選ぶ", "", "word", "適 切", "音", "manual-reviewed", "適切"],
  ["小5", "導く", "みちびく", "正しい方向へ案内する", "送り仮名", "答えへ導く", "", "word", "導", "訓", "manual-reviewed", "導く"],
  ["小5", "燃える", "もえる", "火がついて熱や光を出す", "送り仮名", "木が燃える", "", "word", "燃", "訓", "manual-reviewed", "燃える"],
  ["小6", "異なる", "ことなる", "同じではない", "送り仮名", "意見が異なる", "", "word", "異", "訓", "manual-reviewed", "異なる"],
  ["小6", "遺産", "いさん", "後の世に残されたもの", "熟語", "文化遺産を守る", "", "word", "遺 産", "音", "manual-reviewed", "遺産"],
  ["小6", "宇宙", "うちゅう", "地球の外に広がる空間", "熟語", "宇宙を調べる", "", "word", "宇 宙", "音", "manual-reviewed", "宇宙"],
  ["小6", "延びる", "のびる", "長さや時間が長くなる", "送り仮名", "時間が延びる", "", "word", "延", "訓", "manual-reviewed", "延びる"],
  ["小6", "恩恵", "おんけい", "ありがたい助けやめぐみ", "熟語", "自然の恩恵を受ける", "", "word", "恩 恵", "音", "manual-reviewed", "恩恵"],
  ["小6", "拡大", "かくだい", "広げて大きくすること", "熟語", "写真を拡大する", "", "word", "拡 大", "音", "manual-reviewed", "拡大"],
  ["小6", "敬う", "うやまう", "相手を大切に思う", "送り仮名", "先生を敬う", "", "word", "敬", "訓", "manual-reviewed", "敬う"],
  ["小6", "権利", "けんり", "認められている資格や力", "熟語", "権利を守る", "", "word", "権 利", "音", "manual-reviewed", "権利"],
  ["小6", "済む", "すむ", "物事が終わる", "送り仮名", "用事が済む", "", "word", "済", "訓", "manual-reviewed", "済む"],
  ["小6", "姿勢", "しせい", "体の構えや物事への向き合い方", "熟語", "姿勢を正す", "", "word", "姿 勢", "音", "manual-reviewed", "姿勢"],
  ["小6", "従う", "したがう", "決まりや指示の通りにする", "送り仮名", "決まりに従う", "", "word", "従", "訓", "manual-reviewed", "従う"],
  ["小6", "縮む", "ちぢむ", "長さや大きさが小さくなる", "送り仮名", "布が縮む", "", "word", "縮", "訓", "manual-reviewed", "縮む"],
  ["小6", "尊重", "そんちょう", "大切なものとして重んじること", "熟語", "意見を尊重する", "", "word", "尊 重", "音", "manual-reviewed", "尊重"],
  ["小6", "担う", "になう", "役割を引き受ける", "送り仮名", "責任を担う", "", "word", "担", "訓", "manual-reviewed", "担う"],
  ["小6", "展開", "てんかい", "広げることや進むこと", "熟語", "話が展開する", "", "word", "展 開", "音", "manual-reviewed", "展開"],
  ["小6", "討論", "とうろん", "意見を出し合って話し合うこと", "熟語", "討論に参加する", "", "word", "討 論", "音", "manual-reviewed", "討論"],
  ["小6", "優しい", "やさしい", "思いやりがある", "送り仮名", "優しい言葉", "", "word", "優", "訓", "manual-reviewed", "優しい"],
];

function appendReviewedRows(csvText) {
  const existingRows = parseCsv(csvText.trim());
  const header = existingRows[0].map((cell) => cell.toLowerCase());
  const targetHeader = ["level", "kanji", "reading", "meaning", "category", "example", "accepted", "type", "target_kanji", "reading_type", "source", "display"];
  const rows = [targetHeader.join(",")];
  const seen = new Set();

  existingRows.slice(1).forEach((row) => {
    const expanded = targetHeader.map((name, index) => {
      const sourceIndex = header.indexOf(name);
      return sourceIndex >= 0 ? row[sourceIndex] || "" : index < row.length ? row[index] || "" : "";
    });
    if (!expanded[7]) expanded[7] = [...expanded[1]].length === 1 ? "single" : "word";
    if (!expanded[8]) expanded[8] = expanded[1];
    if (!expanded[10]) expanded[10] = "local";
    if (!expanded[11] && expanded[7] === "word") expanded[11] = expanded[1];
    seen.add([expanded[0], expanded[1], expanded[2], expanded[11] || ""].join("|"));
    rows.push(expanded.map(escapeCsvCell).join(","));
  });

  reviewedUpperGradeRows.forEach((row) => {
    const key = [row[0], row[1], row[2], row[11] || ""].join("|");
    if (seen.has(key)) return;
    seen.add(key);
    rows.push(row.map(escapeCsvCell).join(","));
  });
  return rows.join("\n");
}

const kyoikuCacheKey = "wordClimberKyoikuCsv:v6";
const studyStatsKey = "wordClimberKanjiStudyStats:v1";

const state = {
  currentLevel: 0,
  selectedLevel: 0,
  dataSource: "default-kanji-v1",
  currentWord: null,
  problemMode: "mixed",
  currentMistakes: 0,
  typedIndex: 0,
  typedText: "",
  wordIndex: 0,
  xp: 0,
  score: 0,
  combo: 0,
  bestCombo: 0,
  total: 0,
  correct: 0,
  keyTotal: 0,
  keyCorrect: 0,
  roundStartedAt: 0,
  runStartedAt: 0,
  pausedRunSeconds: 0,
  timerId: null,
  soundOn: true,
  meaningHiddenDuringTyping: false,
  meaningRevealedForSpeech: false,
  isAdvancing: false,
  playerName: "Player",
  runId: String(Date.now()),
  particles: [],
};

let studyStats = {};
try {
  studyStats = JSON.parse(localStorage.getItem(studyStatsKey) || "{}");
} catch {
  studyStats = {};
}

let savedProgress = null;
try {
  savedProgress = JSON.parse(localStorage.getItem("wordClimberProgress") || "null");
} catch {
  try {
    localStorage.removeItem("wordClimberProgress");
  } catch {
    // 保存が使えない環境でも、ゲーム本体はそのまま動かします。
  }
}

const elements = {
  soundButton: document.querySelector("#soundButton"),
  levelLabel: document.querySelector("#levelLabel"),
  xpLabel: document.querySelector("#xpLabel"),
  scoreLabel: document.querySelector("#scoreLabel"),
  comboLabel: document.querySelector("#comboLabel"),
  accuracyLabel: document.querySelector("#accuracyLabel"),
  levelProgress: document.querySelector("#levelProgress"),
  nextLevelLabel: document.querySelector("#nextLevelLabel"),
  difficultyBadge: document.querySelector("#difficultyBadge"),
  wordCountBadge: document.querySelector("#wordCountBadge"),
  meaningToggleButton: document.querySelector("#meaningToggleButton"),
  meaningLabel: document.querySelector("#meaningLabel"),
  wordDisplay: document.querySelector("#wordDisplay"),
  hintLabel: document.querySelector("#hintLabel"),
  typingForm: document.querySelector("#typingForm"),
  typingInput: document.querySelector("#typingInput"),
  startButton: document.querySelector("#startButton"),
  endButton: document.querySelector("#endButton"),
  endDialog: document.querySelector("#endDialog"),
  endForm: document.querySelector("#endForm"),
  endSummary: document.querySelector("#endSummary"),
  playerNameInput: document.querySelector("#playerNameInput"),
  cancelEndButton: document.querySelector("#cancelEndButton"),
  levelSelect: document.querySelector("#levelSelect"),
  modeSelect: document.querySelector("#modeSelect"),
  csvInput: document.querySelector("#csvInput"),
  csvExportLink: document.querySelector("#csvExportLink"),
  csvNameLabel: document.querySelector("#csvNameLabel"),
  coverageSummary: document.querySelector("#coverageSummary"),
  feedbackLabel: document.querySelector("#feedbackLabel"),
  timerLabel: document.querySelector("#timerLabel"),
  missionProgress: document.querySelector("#missionProgress"),
  comboProgress: document.querySelector("#comboProgress"),
  rankIcon: document.querySelector("#rankIcon"),
  rankLabel: document.querySelector("#rankLabel"),
  rankNote: document.querySelector("#rankNote"),
  rankingList: document.querySelector("#rankingList"),
  levelList: document.querySelector("#levelList"),
  canvas: document.querySelector("#celebrationCanvas"),
};

const canvasContext = elements.canvas.getContext("2d");

const kanaBaseMap = {
  あ: ["a"], い: ["i"], う: ["u"], え: ["e"], お: ["o"],
  か: ["ka"], き: ["ki"], く: ["ku"], け: ["ke"], こ: ["ko"],
  さ: ["sa"], し: ["shi", "si"], す: ["su"], せ: ["se"], そ: ["so"],
  た: ["ta"], ち: ["chi", "ti"], つ: ["tsu", "tu"], て: ["te"], と: ["to"],
  な: ["na"], に: ["ni"], ぬ: ["nu"], ね: ["ne"], の: ["no"],
  は: ["ha"], ひ: ["hi"], ふ: ["fu", "hu"], へ: ["he"], ほ: ["ho"],
  ま: ["ma"], み: ["mi"], む: ["mu"], め: ["me"], も: ["mo"],
  や: ["ya"], ゆ: ["yu"], よ: ["yo"],
  ら: ["ra"], り: ["ri"], る: ["ru"], れ: ["re"], ろ: ["ro"],
  わ: ["wa"], を: ["wo", "o"], ん: ["n", "nn", "n'"],
  が: ["ga"], ぎ: ["gi"], ぐ: ["gu"], げ: ["ge"], ご: ["go"],
  ざ: ["za"], じ: ["ji", "zi"], ず: ["zu"], ぜ: ["ze"], ぞ: ["zo"],
  だ: ["da"], ぢ: ["ji", "di"], づ: ["zu", "du"], で: ["de"], ど: ["do"],
  ば: ["ba"], び: ["bi"], ぶ: ["bu"], べ: ["be"], ぼ: ["bo"],
  ぱ: ["pa"], ぴ: ["pi"], ぷ: ["pu"], ぺ: ["pe"], ぽ: ["po"],
  ぁ: ["xa", "la"], ぃ: ["xi", "li"], ぅ: ["xu", "lu"], ぇ: ["xe", "le"], ぉ: ["xo", "lo"],
  ゃ: ["xya", "lya"], ゅ: ["xyu", "lyu"], ょ: ["xyo", "lyo"], っ: ["xtu", "ltu", "xtsu", "ltsu"],
  ゔ: ["vu"],
};

const kanaComboMap = {
  きゃ: ["kya"], きゅ: ["kyu"], きょ: ["kyo"],
  しゃ: ["sha", "sya"], しゅ: ["shu", "syu"], しょ: ["sho", "syo"],
  ちゃ: ["cha", "tya", "cya"], ちゅ: ["chu", "tyu", "cyu"], ちょ: ["cho", "tyo", "cyo"],
  にゃ: ["nya"], にゅ: ["nyu"], にょ: ["nyo"],
  ひゃ: ["hya"], ひゅ: ["hyu"], ひょ: ["hyo"],
  みゃ: ["mya"], みゅ: ["myu"], みょ: ["myo"],
  りゃ: ["rya"], りゅ: ["ryu"], りょ: ["ryo"],
  ぎゃ: ["gya"], ぎゅ: ["gyu"], ぎょ: ["gyo"],
  じゃ: ["ja", "jya", "zya"], じゅ: ["ju", "jyu", "zyu"], じょ: ["jo", "jyo", "zyo"],
  ぢゃ: ["ja", "dya"], ぢゅ: ["ju", "dyu"], ぢょ: ["jo", "dyo"],
  びゃ: ["bya"], びゅ: ["byu"], びょ: ["byo"],
  ぴゃ: ["pya"], ぴゅ: ["pyu"], ぴょ: ["pyo"],
  ふぁ: ["fa", "hua", "fuxa", "fula", "huxa", "hula"],
  ふぃ: ["fi", "hui", "fuxi", "fuli", "huxi", "huli"],
  ふぇ: ["fe", "hue", "fuxe", "fule", "huxe", "hule"],
  ふぉ: ["fo", "huo", "fuxo", "fulo", "huxo", "hulo"],
  てぃ: ["thi", "texi", "teli"], でぃ: ["dhi", "dexi", "deli"],
};

const smallKana = new Set(["ゃ", "ゅ", "ょ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"]);

function combineCandidateParts(parts, limit = 512) {
  let candidates = [""];
  parts.forEach((part) => {
    const next = [];
    candidates.forEach((prefix) => {
      part.forEach((piece) => next.push(prefix + piece));
    });
    candidates = [...new Set(next)].slice(0, limit);
  });
  return candidates;
}

function firstConsonant(romaji) {
  if (!romaji) return "";
  if ("aeiou".includes(romaji[0])) return "";
  if (romaji[0] === "c" && romaji[1] === "h") return "c";
  return romaji[0];
}

function lastVowel(romaji) {
  const match = romaji.match(/[aeiou](?!.*[aeiou])/);
  return match ? match[0] : "";
}

function normalizeKanaReading(value) {
  return value
    .trim()
    .replace(/\s+/g, "")
    .replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
    .replace(/[・･.]/g, "")
    .replace(/[（）()]/g, "")
    .replace(/[‐‑‒–—―-]/g, "");
}

function kanaToRomajiCandidates(reading, manualAccepted = "") {
  const normalized = normalizeKanaReading(reading).replace(/ー/g, "ー");
  const parts = [];

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1] || "";
    const pair = char + next;

    if (char === "っ") {
      const nextPair = normalized.slice(index + 1, index + 3);
      const nextOptions = kanaComboMap[nextPair] || kanaBaseMap[next] || [];
      const doubled = nextOptions.map((option) => firstConsonant(option)).filter(Boolean);
      parts.push([...new Set([...doubled, "xtu", "ltu", "xtsu", "ltsu"])]);
      continue;
    }

    if (char === "ー") {
      const existing = combineCandidateParts(parts, 128);
      const vowel = lastVowel(existing[0] || "");
      parts.push(vowel ? [vowel, ""] : [""]);
      continue;
    }

    if (char === "ん") {
      const ambiguousNext = next && "あいうえおやゆよゃゅょぁぃぅぇぉ".includes(next);
      parts.push(ambiguousNext ? ["nn", "n'"] : kanaBaseMap[char]);
      continue;
    }

    if (smallKana.has(next) && kanaComboMap[pair]) {
      const separated = combineCandidateParts([kanaBaseMap[char] || [char], kanaBaseMap[next] || [next]], 64);
      parts.push([...new Set([...kanaComboMap[pair], ...separated])]);
      index += 1;
      continue;
    }

    parts.push(kanaBaseMap[char] || [char]);
  }

  const generated = new Set(combineCandidateParts(parts));
  const extras = manualAccepted
    .split(/[,\s/]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  extras.forEach((value) => {
    if (/[ぁ-んァ-ヶー]/.test(value)) {
      kanaToRomajiCandidates(value).forEach((candidate) => generated.add(candidate));
    } else {
      generated.add(value);
    }
  });

  [...generated].forEach((candidate) => {
    generated.add(candidate.replace(/ou/g, "oo"));
    generated.add(candidate.replace(/ou/g, "o"));
    generated.add(candidate.replace(/oo/g, "o"));
  });

  return [...generated].filter((candidate) => /^[a-z']+$/.test(candidate)).sort((a, b) => a.length - b.length || a.localeCompare(b));
}

function getCompletionInputs(reading, manualAccepted = "") {
  const baseCandidates = kanaToRomajiCandidates(reading, manualAccepted);
  const normalized = normalizeKanaReading(reading);
  if (!/(おう|おお|ー|こう|そう|とう|どう|ほう|もう|よう|ろう)/.test(normalized)) return baseCandidates;
  return baseCandidates.filter((candidate) => candidate.length > 2);
}

function buildLevelList() {
  elements.levelList.innerHTML = "";
  levels.forEach((level, index) => {
    const item = document.createElement("li");
    const label = document.createElement("strong");
    const length = document.createElement("span");
    const target = targetWordCounts[level.name];
    const practiceTarget = targetPracticeCounts[level.name];
    label.textContent = `${index + 1}. ${level.name}`;
    length.textContent = target
      ? `${level.words.length}問 / 配当${target}字 / 充実目標${practiceTarget}問`
      : `${level.words.length}問`;
    item.append(label, length);
    item.addEventListener("click", () => selectLevel(index));
    elements.levelList.appendChild(item);
  });
}

function buildLevelSelect() {
  elements.levelSelect.innerHTML = "";
  levels.forEach((level, index) => {
    const option = document.createElement("option");
    const target = targetWordCounts[level.name];
    const practiceTarget = targetPracticeCounts[level.name];
    option.value = String(index);
    option.textContent = target
      ? `${index + 1}. ${level.name} (${level.words.length}/${practiceTarget}問・配当${target}字)`
      : `${index + 1}. ${level.name} (${level.words.length}問)`;
    elements.levelSelect.appendChild(option);
  });
  elements.levelSelect.value = String(state.selectedLevel);
}

function getRankingKey() {
  const level = levels[state.selectedLevel];
  return `wordClimberRanking:${state.dataSource}:${level.name}:${state.problemMode}`;
}

function getProblemKey(entry, levelName = levels[state.selectedLevel]?.name || "") {
  return [state.dataSource, levelName, entry.kanji, entry.reading, entry.problemType || ""].join("|");
}

function loadProblemStats(entry, levelName) {
  return studyStats[getProblemKey(entry, levelName)] || {
    seen: 0,
    correct: 0,
    wrong: 0,
    bestStreak: 0,
    streak: 0,
    lastSeconds: 0,
    lastSeenAt: 0,
  };
}

function saveStudyStats() {
  try {
    localStorage.setItem(studyStatsKey, JSON.stringify(studyStats));
  } catch {
    // 学習履歴が保存できない環境でも、ゲームは続けられます。
  }
}

function getRankName(score) {
  if (score >= 12000) return ["S", "Legend"];
  if (score >= 8000) return ["A", "Ace"];
  if (score >= 5000) return ["B", "Expert"];
  if (score >= 2500) return ["C", "Challenger"];
  if (score >= 1000) return ["D", "Rookie"];
  return ["E", "Starter"];
}

function loadRanking() {
  try {
    return JSON.parse(localStorage.getItem(getRankingKey()) || "[]");
  } catch {
    return [];
  }
}

function saveRanking(ranking) {
  try {
    localStorage.setItem(getRankingKey(), JSON.stringify(ranking.slice(0, 10)));
  } catch {
    elements.feedbackLabel.textContent = "ランキング保存が使えませんが、スコア計算は続けられます。";
  }
}

function recordRanking(score, seconds) {
  if (score <= 0) return 0;

  const level = levels[state.selectedLevel];
  const ranking = loadRanking();
  const entry = {
    score,
    level: level.name,
    words: state.correct,
    accuracy: state.keyTotal === 0 ? 100 : Math.round((state.keyCorrect / state.keyTotal) * 100),
    bestCombo: state.bestCombo,
    seconds: Number(seconds.toFixed(1)),
    playerName: (state.playerName || "Player").slice(0, 20),
    date: new Date().toLocaleDateString("ja-JP"),
  };
  ranking.push(entry);
  entry.runId = state.runId;
  const nextRanking = ranking.filter((item) => item.runId !== state.runId);
  nextRanking.push(entry);
  nextRanking.sort((a, b) => b.score - a.score || b.bestCombo - a.bestCombo || a.seconds - b.seconds);
  const rank = nextRanking.indexOf(entry) + 1;
  saveRanking(nextRanking);
  renderRanking();
  return rank <= 10 ? rank : 0;
}

function renderRanking() {
  elements.rankingList.textContent = "";
  const ranking = loadRanking();

  if (ranking.length === 0) {
    const item = document.createElement("li");
    item.textContent = "まだ記録がありません";
    elements.rankingList.appendChild(item);
    return;
  }

  ranking.slice(0, 5).forEach((entry, index) => {
    const item = document.createElement("li");
    const score = document.createElement("strong");
    const meta = document.createElement("span");
    const name = entry.playerName || "Player";
    score.textContent = `${index + 1}. ${name} / ${entry.score.toLocaleString()} pt`;
    meta.textContent = `${entry.words}問 / ${entry.accuracy}% / ${entry.bestCombo} combo`;
    item.append(score, meta);
    elements.rankingList.appendChild(item);
  });
}

function getModeFilteredWords(level) {
  const playableWords = level.words.filter(isPlayableProblem);
  if (state.problemMode === "single") return playableWords.filter((entry) => entry.problemType === "single");
  if (state.problemMode === "word") return playableWords.filter((entry) => entry.problemType === "word");
  if (state.problemMode === "review") {
    const reviewWords = playableWords.filter((entry) => {
      const stats = loadProblemStats(entry, level.name);
      return stats.wrong > 0 || stats.streak < 2 || stats.lastSeconds >= 8;
    });
    return reviewWords.length > 0 ? reviewWords : playableWords;
  }
  return playableWords;
}

function modeHasWords(mode, level = levels[state.selectedLevel]) {
  const playableWords = level.words.filter(isPlayableProblem);
  if (mode === "single") return playableWords.some((entry) => entry.problemType === "single");
  if (mode === "word") return playableWords.some((entry) => entry.problemType === "word");
  return playableWords.length > 0;
}

function ensureProblemModeAvailable() {
  if (!modeHasWords(state.problemMode)) state.problemMode = "mixed";
}

function weightWord(entry, levelName) {
  const stats = loadProblemStats(entry, levelName);
  if (state.problemMode === "review") return 8 + stats.wrong * 4 + Math.max(0, 2 - stats.streak) * 3;
  if (stats.seen === 0) return 5;
  if (stats.wrong > 0 && stats.streak < 2) return 4 + stats.wrong;
  if (stats.lastSeconds >= 8) return 3;
  return 1;
}

function chooseWeightedWord(words, levelName) {
  if (!words.length) return null;
  const weighted = words.map((entry) => ({ entry, weight: weightWord(entry, levelName) }));
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * totalWeight;
  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor <= 0) return item.entry;
  }
  return weighted[weighted.length - 1]?.entry || words[0];
}

function pickWord() {
  const level = levels[state.selectedLevel];
  ensureProblemModeAvailable();
  const modeWords = getModeFilteredWords(level);
  let sourceWords = modeWords.length > 0 ? modeWords : level.words.filter(isPlayableProblem);
  if (sourceWords.length === 0 && state.problemMode !== "mixed") {
    state.problemMode = "mixed";
    sourceWords = getModeFilteredWords(level);
  }
  const filtered = sourceWords.filter((entry) => entry.kanji !== state.currentWord?.kanji || entry.reading !== state.currentWord?.reading);
  const available = filtered.length > 0 ? filtered : sourceWords;
  state.currentWord = chooseWeightedWord(available, level.name);
  if (!state.currentWord) return false;
  state.currentMistakes = 0;
  state.typedIndex = 0;
  state.typedText = "";
  state.wordIndex += 1;
  return true;
}

function getPromptText(entry) {
  if (entry.display || entry.prompt) return entry.display || entry.prompt;
  if (entry.readingType === "音") return `${entry.kanji}（音読み）`;
  return entry.kanji;
}

function isExternalGenerated(entry) {
  return entry.source === "kyoiku-kanji" || entry.source === "nihongo-dojo";
}

function isPlayableProblem(entry) {
  if (!entry) return false;
  if (entry.problemType === "word") return true;
  if (entry.display || entry.prompt) return true;
  if (entry.readingType === "音" && !isExternalGenerated(entry)) return true;
  if (!isExternalGenerated(entry)) return true;
  return false;
}

function renderWordDisplay() {
  if (!state.currentWord) {
    elements.wordDisplay.textContent = "READY";
    return;
  }

  elements.wordDisplay.textContent = "";
  [...getPromptText(state.currentWord)].forEach((letter) => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = letter;
    elements.wordDisplay.appendChild(span);
  });
}

function getMeaningText() {
  if (!state.currentWord) return "準備ができたらスタート";
  const typeLabel = state.currentWord.problemType === "single" ? "単字" : "熟語";
  const readingLabel = state.currentWord.readingType ? `${state.currentWord.readingType}読み` : "";
  const details = [typeLabel, readingLabel, state.currentWord.reading, state.currentWord.meaning, state.currentWord.example]
    .filter(Boolean)
    .join(" / ");
  return state.currentWord.category ? `${details} / ${state.currentWord.category}` : details;
}

function getHintText() {
  if (!state.currentWord) return "準備ができたらスタート";
  const typeLabel = state.currentWord.problemType === "single" ? "単字" : "熟語";
  const readingLabel = state.currentWord.readingType ? `${state.currentWord.readingType}読み` : "";
  const details = [typeLabel, readingLabel, state.currentWord.meaning, state.currentWord.example, state.currentWord.category]
    .filter(Boolean)
    .join(" / ");
  return details || "読みを考えて入力";
}

function getCoverageStats(level = levels[state.selectedLevel]) {
  const target = targetWordCounts[level.name] || 0;
  const playableWords = level.words.filter(isPlayableProblem);
  const singleCount = playableWords.filter((entry) => entry.problemType === "single").length;
  const wordCount = playableWords.filter((entry) => entry.problemType === "word").length;
  const deferredCount = level.words.length - playableWords.length;
  const uniqueKanji = new Set(level.words.flatMap((entry) => [...(entry.targetKanji || entry.kanji)])).size;
  const playableKanji = new Set(playableWords.flatMap((entry) => [...(entry.targetKanji || entry.kanji)])).size;
  const studied = playableWords.filter((entry) => loadProblemStats(entry, level.name).correct > 0).length;
  const weak = playableWords.filter((entry) => {
    const stats = loadProblemStats(entry, level.name);
    return stats.wrong > 0 && stats.streak < 2;
  }).length;
  return { target, playableCount: playableWords.length, singleCount, wordCount, deferredCount, uniqueKanji, playableKanji, studied, weak };
}

function updateCoverageSummary() {
  if (!elements.coverageSummary) return;
  const level = levels[state.selectedLevel];
  const stats = getCoverageStats(level);
  const targetText = stats.target ? `配当${stats.target}字` : "目標未設定";
  const practiceTarget = targetPracticeCounts[level.name] || stats.target * 3 || 0;
  const qualityText = stats.playableCount >= practiceTarget ? "量は実用ライン" : "良問追加が必要";
  const deferredText = stats.deferredCount > 0 ? ` / 保留${stats.deferredCount}問` : "";
  elements.coverageSummary.textContent = `${targetText} / 漢字${stats.playableKanji}/${stats.target}字 / 良問${stats.playableCount}/${practiceTarget}問 / 単字${stats.singleCount}問 / 熟語${stats.wordCount}問${deferredText} / 学習済み${stats.studied}問 / 復習${stats.weak}問 / ${qualityText}`;
}

function updateMeaningDisplay() {
  const shouldHide = state.meaningHiddenDuringTyping
    && state.currentWord
    && !state.meaningRevealedForSpeech;
  elements.meaningLabel.textContent = shouldHide ? getHintText() : getMeaningText();
  elements.meaningLabel.classList.toggle("is-hidden", false);
  elements.meaningToggleButton.classList.toggle("is-on", state.meaningHiddenDuringTyping);
  elements.meaningToggleButton.setAttribute("aria-pressed", String(state.meaningHiddenDuringTyping));
  elements.meaningToggleButton.textContent = state.meaningHiddenDuringTyping ? "読みを表示" : "読みを隠す";
}

function saveProgress() {
  try {
    localStorage.setItem(
      "wordClimberProgress",
      JSON.stringify({
        currentLevel: state.currentLevel,
        selectedLevel: state.selectedLevel,
        dataSource: state.dataSource,
        xp: state.xp,
        score: state.score,
        combo: state.combo,
        bestCombo: state.bestCombo,
        total: state.total,
        correct: state.correct,
        keyTotal: state.keyTotal,
        keyCorrect: state.keyCorrect,
        meaningHiddenDuringTyping: state.meaningHiddenDuringTyping,
        problemMode: state.problemMode,
      }),
    );
  } catch {
    elements.feedbackLabel.textContent = "進行の保存が使えませんが、ゲームは続けられます。";
  }
}

function resetRunState(levelIndex = state.selectedLevel) {
  state.selectedLevel = Math.min(levels.length - 1, Math.max(0, levelIndex));
  state.currentLevel = state.selectedLevel;
  state.currentWord = null;
  state.meaningRevealedForSpeech = false;
  state.currentMistakes = 0;
  state.typedIndex = 0;
  state.typedText = "";
  state.wordIndex = 0;
  state.xp = 0;
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.total = 0;
  state.correct = 0;
  state.keyTotal = 0;
  state.keyCorrect = 0;
  state.runStartedAt = 0;
  state.pausedRunSeconds = 0;
  state.isAdvancing = false;
  state.runId = String(Date.now());
  clearInterval(state.timerId);
  elements.timerLabel.textContent = "00.0s";
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  elements.typingInput.value = "";
  elements.typingInput.disabled = true;
  elements.startButton.textContent = "Start";
  elements.startButton.disabled = false;
  elements.endButton.disabled = true;
  elements.meaningLabel.textContent = "準備ができたらスタート";
  elements.meaningLabel.classList.remove("is-hidden");
  elements.difficultyBadge.textContent = levels[state.selectedLevel].name;
  elements.wordCountBadge.textContent = "0 / 10";
  updateMeaningDisplay();
  renderWordDisplay();
}

function selectLevel(levelIndex) {
  resetRunState(levelIndex);
  buildLevelSelect();
  render();
  saveProgress();
  elements.feedbackLabel.textContent = `${levels[state.selectedLevel].name} だけを出題します。Startで始められます。`;
}

function selectMode(mode) {
  const nextMode = ["mixed", "single", "word", "review"].includes(mode) ? mode : "mixed";
  if (!modeHasWords(nextMode)) {
    state.problemMode = "mixed";
    resetRunState(state.selectedLevel);
    render();
    saveProgress();
    elements.feedbackLabel.textContent = "このレベルには選んだ種類の問題がまだありません。単字＋熟語で出題します。";
    return;
  }
  state.problemMode = nextMode;
  resetRunState(state.selectedLevel);
  render();
  saveProgress();
  elements.feedbackLabel.textContent = `練習モードを切り替えました。Startで始められます。`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function buildLevelsFromCsv(text) {
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  if (rows.length === 0) throw new Error("CSVに漢字がありません。");

  const header = rows[0].map((cell) => cell.toLowerCase());
  const hasHeader = header.includes("kanji") && header.includes("reading") && header.includes("meaning");
  const hasLevelColumn = hasHeader ? header.includes("level") : rows[0].length >= 3;
  const kanjiIndex = hasHeader ? header.indexOf("kanji") : hasLevelColumn ? 1 : 0;
  const readingIndex = hasHeader ? header.indexOf("reading") : hasLevelColumn ? 2 : 1;
  const meaningIndex = hasHeader ? header.indexOf("meaning") : hasLevelColumn ? 3 : 2;
  const categoryIndex = hasHeader ? header.indexOf("category") : -1;
  const exampleIndex = hasHeader ? header.indexOf("example") : -1;
  const acceptedIndex = hasHeader ? header.indexOf("accepted") : -1;
  const typeIndex = hasHeader ? header.indexOf("type") : -1;
  const targetKanjiIndex = hasHeader ? header.indexOf("target_kanji") : -1;
  const readingTypeIndex = hasHeader ? header.indexOf("reading_type") : -1;
  const sourceIndex = hasHeader ? header.indexOf("source") : -1;
  const displayIndex = hasHeader ? header.indexOf("display") : -1;
  const levelIndex = hasHeader ? header.indexOf("level") : 0;
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const groups = new Map();

  dataRows.forEach((row) => {
    const kanji = (row[kanjiIndex] || "").trim();
    const reading = (row[readingIndex] || "").trim();
    const meaning = (row[meaningIndex] || "").trim();
    const category = categoryIndex >= 0 ? (row[categoryIndex] || "").trim() : "";
    const example = exampleIndex >= 0 ? (row[exampleIndex] || "").trim() : "";
    const accepted = acceptedIndex >= 0 ? (row[acceptedIndex] || "").trim() : "";
    const explicitType = typeIndex >= 0 ? (row[typeIndex] || "").trim().toLowerCase() : "";
    const problemType = explicitType === "single" || explicitType === "word"
      ? explicitType
      : [...kanji].length === 1 ? "single" : "word";
    const targetKanji = targetKanjiIndex >= 0 ? (row[targetKanjiIndex] || "").trim() : kanji;
    const readingType = readingTypeIndex >= 0 ? (row[readingTypeIndex] || "").trim() : "";
    const source = sourceIndex >= 0 ? (row[sourceIndex] || "").trim() : "";
    const display = displayIndex >= 0 ? (row[displayIndex] || "").trim() : "";
    const rawLevel = hasLevelColumn ? (row[levelIndex] || "1").trim() || "1" : "1";
    if (!kanji || !reading || !meaning) return;
    const acceptedInputs = kanaToRomajiCandidates(reading, accepted);
    const completionInputs = getCompletionInputs(reading, accepted);
    if (acceptedInputs.length === 0) return;
    if (!groups.has(rawLevel)) groups.set(rawLevel, []);
    groups.get(rawLevel).push({
      kanji,
      reading,
      meaning,
      category,
      example,
      accepted,
      problemType,
      targetKanji,
      readingType,
      source,
      display,
      acceptedInputs,
      completionInputs,
      primaryInput: acceptedInputs[0],
    });
  });

  if (groups.size === 0) throw new Error("kanji, reading, meaning が入った行が見つかりません。");

  const xpSteps = [5, 12, 22, 36, 52, 72, 96, 124];
  return [...groups.entries()].sort(([a], [b]) => (levelOrder[a] || 99) - (levelOrder[b] || 99)).map(([name, words], index) => ({
    name: /^\d+$/.test(name) ? `Level ${name}` : name,
    rank: index === 0 ? "Custom" : `Custom ${index + 1}`,
    note: "CSVから読み込んだ漢字リスト。",
    xpToNext: xpSteps[index] || xpSteps[xpSteps.length - 1] + (index - xpSteps.length + 1) * 32,
    words,
  }));
}

function extractKyoikuRows(text) {
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  const header = rows[0].map((cell) => cell.toLowerCase());
  const kanjiIndex = header.indexOf("kanji");
  const gradeIndex = header.indexOf("grade_2017");
  const dataRows = kanjiIndex >= 0 && gradeIndex >= 0 ? rows.slice(1) : rows;

  return dataRows.map((row) => {
    const kanji = (row[kanjiIndex >= 0 ? kanjiIndex : 0] || "").trim();
    const grade = Number((row[gradeIndex >= 0 ? gradeIndex : 1] || "").trim());
    return { kanji, level: kyoikuGradeLabels[grade] };
  }).filter((row) => row.kanji && row.level);
}

function extractDirectLiteralFromEntry(value) {
  if (!value || typeof value !== "object") return "";
  const directKeys = ["漢字", "通用字体", "字", "文字", "テキスト"];
  for (const key of directKeys) {
    if (typeof value[key] === "string" && /^[\u3400-\u9fff]$/.test(value[key])) {
      return value[key];
    }
    if (value[key] && typeof value[key] === "object") {
      const nested = extractDirectLiteralFromEntry(value[key]);
      if (nested) return nested;
    }
  }
  return "";
}

function collectKanaReadings(value, readings = new Set()) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^[ぁ-んァ-ヶー・･.\s（）()‐‑‒–—―-]+$/.test(trimmed) && /[ぁ-んァ-ヶ]/.test(trimmed)) {
      const reading = normalizeKanaReading(trimmed);
      if (reading && reading.length <= 12) readings.add(reading);
    }
    return readings;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectKanaReadings(item, readings));
    return readings;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => {
      if (/[音訓読み]/.test(key) || Array.isArray(child) || typeof child === "object") {
        collectKanaReadings(child, readings);
      }
    });
  }

  return readings;
}

function buildReadingMap(source) {
  const readingMap = new Map();

  function visit(entry) {
    if (!entry || typeof entry !== "object") return;
    const literal = extractDirectLiteralFromEntry(entry);
    const readings = literal ? [...collectKanaReadings(entry)] : [];
    if (literal && readings.length > 0) {
      readingMap.set(literal, readings);
      return;
    }
    Object.values(entry).forEach((child) => {
      if (child && typeof child === "object") visit(child);
    });
  }

  visit(source);

  return readingMap;
}

function levelToCsvValue(level) {
  return level.replace("小", "小");
}

function escapeCsvCell(value) {
  const text = String(value || "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function normalizeDojoReading(value) {
  return normalizeKanaReading(String(value || ""));
}

function appendDojoPracticeRows(csvText, dojoRows) {
  const csvRows = [csvText.trim()];
  const seen = new Set();

  parseCsv(csvText).slice(1).forEach((row) => {
    seen.add([row[0], row[1], normalizeDojoReading(row[2]), row[9] || ""].join("|"));
  });

  dojoRows.forEach((item) => {
    const row = item.row || item;
    const grade = Number(row.grade);
    if (grade < 4 || grade > 6) return;
    if (!String(row.task_type || "").startsWith("kanji_reading_")) return;
    const kanji = String(row.kanji || "").trim();
    const reading = normalizeDojoReading(row.answer);
    if (!kanji || !reading || !/^[ぁ-んー]+$/.test(reading)) return;

    const level = kyoikuGradeLabels[grade];
    const readingType = row.task_type === "kanji_reading_on" ? "音" : "訓";
    const key = [level, kanji, reading, readingType].join("|");
    if (seen.has(key)) return;
    seen.add(key);

    const meanings = Array.isArray(row.meanings) ? row.meanings.filter(Boolean).join("・") : "";
    const meaning = meanings ? meanings : `${readingType}読みの確認`;
    const category = `${readingType}読み`;
    const example = `${kanji} = ${reading}`;
    csvRows.push([level, kanji, reading, meaning, category, example, "", "single", kanji, readingType, "nihongo-dojo", ""].map(escapeCsvCell).join(","));
  });

  return csvRows.join("\n");
}

async function fetchDojoRows() {
  const rows = [];
  for (const split of dojoSplits) {
    let offset = 0;
    const length = 100;
    while (offset < 5000) {
      const url = `https://datasets-server.huggingface.co/rows?dataset=${encodeURIComponent(dojoDataset)}&config=default&split=${split}&offset=${offset}&length=${length}`;
      const response = await fetch(url, { cache: "force-cache" });
      if (!response.ok) break;
      const payload = await response.json();
      const chunk = Array.isArray(payload.rows) ? payload.rows : [];
      rows.push(...chunk);
      const total = payload.num_rows_total || payload.num_rows || 0;
      if (chunk.length < length || offset + length >= total) break;
      offset += length;
    }
  }
  return rows;
}

async function fetchTextWithFallback(urls) {
  const errors = [];
  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: "force-cache" });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }
  throw new Error(errors.join(" / "));
}

async function fetchJsonWithFallback(urls) {
  const text = await fetchTextWithFallback(urls);
  return JSON.parse(text);
}

function mergeKyoikuCoverage(kyoikuRows, readingMap) {
  const existing = new Map();
  levels.forEach((level) => {
    level.words.forEach((word) => existing.set(`${level.name}:${word.kanji}`, word));
  });

  const csvRows = ["level,kanji,reading,meaning,category,example,accepted,type,target_kanji,reading_type,source,display"];
  kyoikuRows.forEach(({ kanji, level }) => {
    const current = existing.get(`${level}:${kanji}`);
    const readings = [...new Set([
      ...(current ? [current.reading] : []),
      ...(readingMap.get(kanji) || []),
    ].filter(Boolean))];
    if (readings.length === 0) return;
    readings.slice(0, 6).forEach((reading, index) => {
      const readingType = /^[ぁ-んー]+$/.test(reading) ? "訓" : "音";
      const meaning = current && index === 0 ? current.meaning : `${readingType}読みの確認`;
      const category = current && index === 0 ? current.category : `${readingType}読み`;
      const example = current && index === 0 ? current.example : `${kanji} = ${reading}`;
      csvRows.push([levelToCsvValue(level), kanji, reading, meaning, category, example, "", "single", kanji, readingType, "kyoiku-kanji", ""].map(escapeCsvCell).join(","));
    });
  });

  return csvRows.join("\n");
}

function hasCompleteKyoikuCoverage(nextLevels) {
  return Object.entries(targetWordCounts).every(([levelName, target]) => {
    const level = nextLevels.find((entry) => entry.name === levelName);
    const uniqueKanji = level ? new Set(level.words.map((entry) => entry.targetKanji || entry.kanji)).size : 0;
    return uniqueKanji >= target;
  });
}

function hasStrongUpperGradeCoverage(nextLevels) {
  return ["小4", "小5", "小6"].every((levelName) => {
    const level = nextLevels.find((entry) => entry.name === levelName);
    const target = targetPracticeCounts[levelName] || 0;
    return level && level.words.length >= target;
  });
}

async function loadRemoteKyoikuCoverage() {
  if (!window.fetch || state.dataSource !== "default-kanji-v1") return;

  try {
    elements.startButton.disabled = true;
    let cachedCsv = "";
    try {
      cachedCsv = localStorage.getItem(kyoikuCacheKey) || "";
    } catch {
      cachedCsv = "";
    }
    if (cachedCsv) {
      try {
        const upgradedCachedCsv = appendReviewedRows(cachedCsv);
        const cachedLevels = buildLevelsFromCsv(upgradedCachedCsv);
        if (hasCompleteKyoikuCoverage(cachedLevels)) {
          levels = cachedLevels;
          state.dataSource = "kyoiku-kanji-2017";
          try {
            localStorage.setItem(kyoikuCacheKey, upgradedCachedCsv);
          } catch {
            // 保存できなくても、合流済みデータでは遊べます。
          }
          resetRunState(Math.min(state.selectedLevel, levels.length - 1));
          buildLevelList();
          buildLevelSelect();
          updateCsvExportLink();
          render();
          elements.startButton.disabled = false;
          elements.csvNameLabel.textContent = hasStrongUpperGradeCoverage(cachedLevels)
            ? "教育漢字1026字＋小4以降読み強化リストを標準使用中"
            : "教育漢字1026字リストを標準使用中";
          elements.feedbackLabel.textContent = hasStrongUpperGradeCoverage(cachedLevels)
            ? "保存済みの小4以降読み強化リストを読み込みました。"
            : "保存済みの教育漢字1026字リストを読み込みました。";
          return;
        }
      } catch {
        // 壊れたキャッシュは無視して、公開データを取り直します。
      }
    }

    elements.csvNameLabel.textContent = "教育漢字1026字の読みデータを確認中...";
    const [gradesText, readingsJson, dojoRows] = await Promise.all([
      fetchTextWithFallback([
        kyoikuSourceUrls.grades,
        "https://raw.githubusercontent.com/fnshr/kyo-kan/master/kyoiku-kanji-2017.csv",
      ]),
      fetchJsonWithFallback([
        ...fallbackReadingUrls,
      ]),
      fetchDojoRows().catch(() => []),
    ]);

    const kyoikuRows = extractKyoikuRows(gradesText);
    const readingMap = buildReadingMap(readingsJson);
    const baseCsv = mergeKyoikuCoverage(kyoikuRows, readingMap);
    const generatedCsv = appendDojoPracticeRows(baseCsv, dojoRows);
    const mergedCsv = appendReviewedRows(generatedCsv);
    const nextLevels = buildLevelsFromCsv(mergedCsv);
    if (!hasCompleteKyoikuCoverage(nextLevels)) throw new Error("reading coverage incomplete");

    levels = nextLevels;
    state.dataSource = "kyoiku-kanji-2017";
    try {
      localStorage.setItem(kyoikuCacheKey, mergedCsv);
    } catch {
      // 保存できなくても、取得済みの1026字リストでは遊べます。
    }
    resetRunState(Math.min(state.selectedLevel, levels.length - 1));
    buildLevelList();
    buildLevelSelect();
    updateCsvExportLink();
    render();
    elements.startButton.disabled = false;
    elements.csvNameLabel.textContent = hasStrongUpperGradeCoverage(nextLevels)
      ? "教育漢字1026字＋小4以降読み強化リストを標準使用中"
      : "教育漢字1026字リストを標準使用中";
    elements.feedbackLabel.textContent = hasStrongUpperGradeCoverage(nextLevels)
      ? "小4以降の音読み・訓読み問題を強化して読み込みました。"
      : "小1から小6までの教育漢字1026字を読み込みました。";
  } catch (error) {
    elements.startButton.disabled = false;
    elements.csvNameLabel.textContent = "kanji_words.csv 小学校漢字リストを標準使用中";
    elements.feedbackLabel.textContent = `オンラインの教育漢字1026字リストを取得できませんでした。${error.message || "通信に失敗しました。"}`;
  }
}

function loadCsvFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      levels = buildLevelsFromCsv(String(reader.result || ""));
      state.dataSource = `csv:${file.name}`;
      resetRunState(0);
      buildLevelList();
      buildLevelSelect();
      updateCsvExportLink();
      render();
      elements.csvNameLabel.textContent = file.name;
      elements.feedbackLabel.textContent = `${file.name} を読み込みました。Startで始められます。`;
      try {
        localStorage.removeItem("wordClimberProgress");
      } catch {
        // 保存が使えない環境でも、読み込みは続けます。
      }
    } catch (error) {
      elements.feedbackLabel.textContent = error.message;
    }
  };
  reader.readAsText(file, "UTF-8");
}

function buildCurrentCsv() {
  const rows = ["level,kanji,reading,meaning,category,example,accepted,type,target_kanji,reading_type,source,display"];
  levels.forEach((level) => {
    level.words.forEach((word) => {
      rows.push([
        level.name,
        word.kanji,
        word.reading,
        word.meaning,
        word.category,
        word.example,
        word.accepted || "",
        word.problemType || "",
        word.targetKanji || word.kanji,
        word.readingType || "",
        word.source || "",
        word.display || "",
      ].map(escapeCsvCell).join(","));
    });
  });
  return rows.join("\n");
}

function updateCsvExportLink() {
  if (!elements.csvExportLink) return;
  const csv = buildCurrentCsv();
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const previousUrl = elements.csvExportLink.dataset.objectUrl;
  if (previousUrl) URL.revokeObjectURL(previousUrl);
  const objectUrl = URL.createObjectURL(blob);
  elements.csvExportLink.href = objectUrl;
  elements.csvExportLink.dataset.objectUrl = objectUrl;
  elements.csvExportLink.download = state.dataSource === "kyoiku-kanji-2017"
    ? "kanji_words_kyoiku_1026.csv"
    : "kanji_words_current.csv";
}

function loadDefaultCsv() {
  if (!window.DEFAULT_KANJI_CSV) return;

  try {
    levels = buildLevelsFromCsv(appendReviewedRows(window.DEFAULT_KANJI_CSV));
    state.dataSource = "default-kanji-v1";
    state.selectedLevel = 0;
    state.currentLevel = 0;
    elements.csvNameLabel.textContent = "kanji_words.csv 小学校漢字リストを標準使用中";
    updateCsvExportLink();
  } catch {
    elements.csvNameLabel.textContent = "標準リストを使用中";
  }
}

function applySavedProgress() {
  if (!savedProgress) return;
  if (savedProgress.dataSource !== state.dataSource) return;

  state.selectedLevel = Math.min(levels.length - 1, savedProgress.selectedLevel ?? savedProgress.currentLevel ?? 0);
  state.currentLevel = state.selectedLevel;
  state.xp = savedProgress.xp || 0;
  state.score = savedProgress.score || 0;
  state.combo = savedProgress.combo || 0;
  state.bestCombo = savedProgress.bestCombo || 0;
  state.total = savedProgress.total || 0;
  state.correct = savedProgress.correct || 0;
  state.keyTotal = savedProgress.keyTotal || 0;
  state.keyCorrect = savedProgress.keyCorrect || 0;
  state.meaningHiddenDuringTyping = Boolean(savedProgress.meaningHiddenDuringTyping);
  state.problemMode = ["mixed", "single", "word", "review"].includes(savedProgress.problemMode)
    ? savedProgress.problemMode
    : "mixed";
}

function speakCurrentWord() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function speakMeaningThenContinue(wordEntry, onComplete) {
  state.meaningRevealedForSpeech = true;
  updateMeaningDisplay();

  if (!state.soundOn || !("speechSynthesis" in window) || !wordEntry?.reading) {
    setTimeout(() => {
      state.meaningRevealedForSpeech = false;
      onComplete();
    }, 1400);
    return;
  }

  window.speechSynthesis.cancel();
  const speechText = [wordEntry.reading, wordEntry.meaning].filter(Boolean).join("。");
  const japanese = new SpeechSynthesisUtterance(speechText);
  japanese.lang = "ja-JP";
  japanese.rate = 0.9;
  japanese.pitch = 1;

  let completed = false;
  const continueOnce = () => {
    if (completed) return;
    completed = true;
    state.meaningRevealedForSpeech = false;
    onComplete();
  };

  japanese.onend = continueOnce;
  japanese.onerror = continueOnce;
  window.speechSynthesis.speak(japanese);
  setTimeout(continueOnce, Math.min(9000, Math.max(2500, speechText.length * 360 + 800)));
}

function startTimer() {
  state.roundStartedAt = performance.now();
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    const seconds = (performance.now() - state.roundStartedAt) / 1000;
    elements.timerLabel.textContent = `${seconds.toFixed(1)}s`;
  }, 100);
}

function render() {
  state.currentLevel = state.selectedLevel;
  const level = levels[state.selectedLevel];
  ensureProblemModeAvailable();
  const progress = Math.min(100, (state.correct / 10) * 100);
  const accuracy = state.keyTotal === 0 ? 100 : Math.round((state.keyCorrect / state.keyTotal) * 100);
  const [rankIcon, rankName] = getRankName(state.score);
  const target = targetWordCounts[level.name];
  const coverageNote = target ? `収録 ${level.words.length}問 / 目安 ${target}字` : `${level.words.length}問`;

  elements.levelLabel.textContent = String(state.selectedLevel + 1);
  elements.xpLabel.textContent = String(state.xp);
  elements.scoreLabel.textContent = state.score.toLocaleString();
  elements.comboLabel.textContent = String(state.combo);
  elements.accuracyLabel.textContent = `${accuracy}%`;
  elements.levelProgress.style.width = `${progress}%`;
  elements.nextLevelLabel.textContent = `${level.name} だけ出題中`;
  elements.difficultyBadge.textContent = level.name;
  elements.wordCountBadge.textContent = `${Math.min(state.wordIndex, 10)} / 10`;
  elements.rankIcon.textContent = rankIcon;
  elements.rankLabel.textContent = rankName;
  elements.rankNote.textContent = `${level.name} / ${state.score.toLocaleString()} pt / ${coverageNote}`;
  elements.missionProgress.style.width = `${Math.min(100, (state.correct / 10) * 100)}%`;
  elements.comboProgress.style.width = `${Math.min(100, (state.bestCombo / 5) * 100)}%`;

  elements.levelSelect.value = String(state.selectedLevel);
  if (elements.modeSelect) elements.modeSelect.value = state.problemMode;
  [...elements.levelList.children].forEach((item, index) => {
    item.classList.toggle("is-current", index === state.selectedLevel);
  });
  updateMeaningDisplay();
  updateCoverageSummary();
  renderRanking();
}

function addXp(seconds) {
  const speedBonus = seconds < 3 ? 2 : seconds < 6 ? 1 : 0;
  const comboBonus = state.combo >= 5 ? 2 : state.combo >= 3 ? 1 : 0;
  state.xp += 1 + speedBonus + comboBonus;
}

function addScore(seconds) {
  const wordLength = state.currentWord.primaryInput.length;
  const levelBonus = 1 + state.selectedLevel * 0.18;
  const speedBonus = Math.max(1, 3.2 - seconds * 0.22);
  const comboBonus = 1 + Math.min(state.combo, 20) * 0.05;
  const accuracy = state.keyTotal === 0 ? 1 : state.keyCorrect / state.keyTotal;
  const points = Math.round(wordLength * 24 * levelBonus * speedBonus * comboBonus * accuracy);
  const safePoints = Math.max(10, points);
  state.score += safePoints;
  return safePoints;
}

function checkLevelUp() {
  return false;
}

function recordProblemResult(wordEntry, wasCorrect, seconds) {
  const level = levels[state.selectedLevel];
  const key = getProblemKey(wordEntry, level.name);
  const stats = loadProblemStats(wordEntry, level.name);
  stats.seen += 1;
  stats.lastSeenAt = Date.now();
  stats.lastSeconds = Number(seconds.toFixed(1));
  if (wasCorrect) {
    stats.correct += 1;
    stats.streak += 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
  } else {
    stats.wrong += 1;
    stats.streak = 0;
  }
  studyStats[key] = stats;
  saveStudyStats();
}

function showWord(feedback = "落ち着いて正確に。コンボでXPが伸びます。") {
  if (!pickWord()) {
    state.problemMode = "mixed";
    if (pickWord()) {
      feedback = "選んだモードの良問が少ないため、単字＋熟語で出題します。";
    } else {
      elements.wordDisplay.textContent = "READY";
      elements.typingInput.value = "";
      elements.typingInput.disabled = true;
      elements.feedbackLabel.textContent = "このレベルとモードで出題できる良問がありません。練習モードを切り替えてください。";
      elements.startButton.textContent = "Start";
      elements.startButton.disabled = false;
      elements.endButton.disabled = state.score <= 0;
      render();
      return;
    }
  }
  state.meaningRevealedForSpeech = false;
  state.isAdvancing = false;
  if (!state.runStartedAt) state.runStartedAt = performance.now();
  elements.typingInput.value = "";
  elements.typingInput.disabled = false;
  elements.typingInput.readOnly = true;
  elements.typingInput.focus();
  updateMeaningDisplay();
  renderWordDisplay();
  elements.hintLabel.textContent = "読みをローマ字で入力。shi/si、xtu/ltu などの入力方式に対応しています。";
  elements.feedbackLabel.textContent = feedback;
  elements.startButton.textContent = "Skip";
  elements.startButton.disabled = false;
  elements.endButton.disabled = false;
  startTimer();
  render();
}

function getRunSeconds() {
  if (!state.runStartedAt) return 0;
  return (performance.now() - state.runStartedAt) / 1000;
}

function openEndDialog() {
  if (state.isAdvancing) {
    elements.feedbackLabel.textContent = "読み上げが終わってから終了できます。";
    return;
  }

  if (state.score <= 0) {
    elements.feedbackLabel.textContent = "まだ登録できるスコアがありません。1問クリアしてから終了できます。";
    return;
  }

  elements.typingInput.disabled = true;
  clearInterval(state.timerId);
  state.pausedRunSeconds = getRunSeconds();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  const accuracy = state.keyTotal === 0 ? 100 : Math.round((state.keyCorrect / state.keyTotal) * 100);
  elements.endSummary.textContent = `${levels[state.selectedLevel].name} / ${state.score.toLocaleString()} pt / ${state.correct}問 / 正確さ ${accuracy}%`;
  try {
    elements.playerNameInput.value = localStorage.getItem("wordClimberPlayerName") || "";
  } catch {
    elements.playerNameInput.value = "";
  }

  if (typeof elements.endDialog.showModal === "function") {
    elements.endDialog.showModal();
    elements.playerNameInput.focus();
    return;
  }

  const fallbackName = window.prompt("ランキングに登録する名前", elements.playerNameInput.value || "Player");
  if (fallbackName !== null) finishRun(fallbackName);
}

function finishRun(playerName) {
  const safeName = playerName.trim() || "Player";
  state.playerName = safeName;
  try {
    localStorage.setItem("wordClimberPlayerName", safeName);
  } catch {
    // 名前の保存に失敗しても、今回のランキング登録は続けます。
  }

  const rankingPosition = recordRanking(state.score, state.pausedRunSeconds || getRunSeconds());
  const message = rankingPosition
    ? `${safeName} さんの記録を登録しました。現在 ${rankingPosition}位です。`
    : `${safeName} さんの記録を登録しました。`;
  resetRunState(state.selectedLevel);
  render();
  elements.feedbackLabel.textContent = message;
}

function submitAnswer() {
  if (!state.currentWord) {
    showWord();
    return;
  }

  const answer = state.typedText.toLowerCase();
  state.total += 1;

  if ((state.currentWord.completionInputs || state.currentWord.acceptedInputs).includes(answer)) {
    const seconds = (performance.now() - state.roundStartedAt) / 1000;
    recordProblemResult(state.currentWord, state.currentMistakes === 0, seconds);
    state.correct += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    addXp(seconds);
    const points = addScore(seconds);
    checkLevelUp();
    saveProgress();
    const message = `Great! +${points} pt  +Combo ${state.combo}`;
    burst(18 + Math.min(24, state.combo * 3));
    const completedWord = state.currentWord;
    state.isAdvancing = true;
    elements.typingInput.disabled = true;
    elements.startButton.disabled = true;
    elements.endButton.disabled = true;
    elements.feedbackLabel.textContent = "正解。意味を聞いてから次へ進みます。";
    render();
    speakMeaningThenContinue(completedWord, () => {
      state.isAdvancing = false;
      showWord(message);
    });
    return;
  }

  state.combo = 0;
  state.currentMistakes += 1;
  recordProblemResult(state.currentWord, false, (performance.now() - state.roundStartedAt) / 1000);
  saveProgress();
  elements.typingInput.classList.add("is-wrong");
  elements.feedbackLabel.textContent = `もう一度。読みは ${state.currentWord.reading}`;
  setTimeout(() => elements.typingInput.classList.remove("is-wrong"), 260);
  render();
}

function rejectKey() {
  state.keyTotal += 1;
  state.currentMistakes += 1;
  elements.wordDisplay.classList.remove("is-shaking");
  elements.wordDisplay.offsetWidth;
  elements.wordDisplay.classList.add("is-shaking");
  elements.feedbackLabel.textContent = "そのキーでは進みません。次の文字を見て打とう。";
  render();
}

function acceptKey(nextText) {
  state.keyTotal += 1;
  state.keyCorrect += 1;
  state.typedText = nextText;
  state.typedIndex = nextText.length;
  elements.typingInput.value = state.typedText;
  renderWordDisplay();
  elements.feedbackLabel.textContent = "Good. その調子。";

  if ((state.currentWord.completionInputs || state.currentWord.acceptedInputs).includes(state.typedText)) {
    submitAnswer();
    return;
  }

  render();
}

function handleTypingKey(event) {
  if (!state.currentWord || elements.typingInput.disabled) return;

  if (event.key === "Backspace" || event.key === "Delete") {
    event.preventDefault();
    rejectKey();
    return;
  }

  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;

  event.preventDefault();
  const pressed = event.key.toLowerCase();
  const nextText = `${state.typedText}${pressed}`;

  if (state.currentWord.acceptedInputs.some((candidate) => candidate.startsWith(nextText))) {
    acceptKey(nextText);
    return;
  }

  rejectKey();
}

function burst(count) {
  const rect = elements.canvas.getBoundingClientRect();
  for (let index = 0; index < count; index += 1) {
    state.particles.push({
      x: rect.width / 2 + (Math.random() - 0.5) * 120,
      y: rect.height / 2 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 7 - 1,
      size: Math.random() * 7 + 4,
      life: 70,
      color: ["#24a176", "#1696a7", "#f2b84b", "#df5b69", "#3867d6"][Math.floor(Math.random() * 5)],
    });
  }
}

function drawParticles() {
  const rect = elements.canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  if (elements.canvas.width !== Math.floor(rect.width * scale)) {
    elements.canvas.width = Math.floor(rect.width * scale);
    elements.canvas.height = Math.floor(rect.height * scale);
  }

  canvasContext.setTransform(scale, 0, 0, scale, 0, 0);
  canvasContext.clearRect(0, 0, rect.width, rect.height);
  state.particles = state.particles.filter((particle) => particle.life > 0);

  state.particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.18;
    particle.life -= 1;
    canvasContext.globalAlpha = Math.max(0, particle.life / 70);
    canvasContext.fillStyle = particle.color;
    canvasContext.fillRect(particle.x, particle.y, particle.size, particle.size);
  });

  canvasContext.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}

elements.startButton.addEventListener("click", () => showWord());

elements.endButton.addEventListener("click", openEndDialog);

elements.cancelEndButton.addEventListener("click", () => {
  elements.endDialog.close();
  state.pausedRunSeconds = 0;
  elements.typingInput.disabled = false;
  elements.typingInput.focus();
  startTimer();
});

elements.endForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const playerName = elements.playerNameInput.value;
  elements.endDialog.close();
  finishRun(playerName);
});

elements.typingForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

elements.typingInput.addEventListener("keydown", handleTypingKey);
document.addEventListener("keydown", (event) => {
  if (document.activeElement !== elements.typingInput) handleTypingKey(event);
});

elements.csvInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) loadCsvFile(file);
  event.target.value = "";
});

elements.levelSelect.addEventListener("change", () => {
  selectLevel(Number(elements.levelSelect.value));
});

elements.modeSelect.addEventListener("change", () => {
  selectMode(elements.modeSelect.value);
});

elements.soundButton.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  elements.soundButton.classList.toggle("is-off", !state.soundOn);
  elements.soundButton.setAttribute("aria-pressed", String(state.soundOn));
  if (!state.soundOn && "speechSynthesis" in window) window.speechSynthesis.cancel();
});

elements.meaningToggleButton.addEventListener("click", () => {
  state.meaningHiddenDuringTyping = !state.meaningHiddenDuringTyping;
  updateMeaningDisplay();
  saveProgress();
});

loadDefaultCsv();
applySavedProgress();
buildLevelList();
buildLevelSelect();
updateCsvExportLink();
render();
loadRemoteKyoikuCoverage();
drawParticles();
