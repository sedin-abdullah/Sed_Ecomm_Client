// AUTO-GENERATED product-vocabulary translations for the 9 supported
// shopping languages. Product names/categories/descriptions are composed
// from this fixed vocabulary, so translating it lets the client render
// translated product content without storing per-language copies in the DB.

export type ProductLang = 'en' | 'ta' | 'hi' | 'ar' | 'fr' | 'de' | 'es' | 'zh' | 'ja';

type TermMap = Record<string, Partial<Record<ProductLang, string>>>;

export const ADJECTIVES: TermMap = {
  "Classic": {
    "en": "Classic",
    "ta": "கிளாசிக்",
    "hi": "क्लासिक",
    "ar": "كلاسيكي",
    "fr": "Classique",
    "de": "Klassisch",
    "es": "Clásico",
    "zh": "经典",
    "ja": "クラシック"
  },
  "Premium": {
    "en": "Premium",
    "ta": "பிரீமியம்",
    "hi": "प्रीमियम",
    "ar": "ممتاز",
    "fr": "Premium",
    "de": "Premium",
    "es": "Premium",
    "zh": "高级",
    "ja": "プレミアム"
  },
  "Everyday": {
    "en": "Everyday",
    "ta": "தினசரி",
    "hi": "रोज़",
    "ar": "يومي",
    "fr": "Quotidien",
    "de": "Alltäglich",
    "es": "Diario",
    "zh": "日常",
    "ja": "デイリー"
  },
  "Urban": {
    "en": "Urban",
    "ta": "நகர்ப்புற",
    "hi": "अर्बन",
    "ar": "حضري",
    "fr": "Urbain",
    "de": "Urban",
    "es": "Urbano",
    "zh": "都市",
    "ja": "アーバン"
  },
  "Comfort": {
    "en": "Comfort",
    "ta": "வசதி",
    "hi": "आराम",
    "ar": "مريح",
    "fr": "Confort",
    "de": "Komfort",
    "es": "Confort",
    "zh": "舒适",
    "ja": "コンフォート"
  },
  "Essential": {
    "en": "Essential",
    "ta": "அத்தியாவசிய",
    "hi": "एसेंशियल",
    "ar": "أساسي",
    "fr": "Essentiel",
    "de": "Essenziell",
    "es": "Esencial",
    "zh": "必备",
    "ja": "エッセンシャル"
  },
  "Signature": {
    "en": "Signature",
    "ta": "சிக்னேச்சர்",
    "hi": "सिग्नेचर",
    "ar": "مميز",
    "fr": "Signature",
    "de": "Signature",
    "es": "Signature",
    "zh": "招牌",
    "ja": "シグネチャー"
  },
  "Active": {
    "en": "Active",
    "ta": "ஆக்டிவ்",
    "hi": "एक्टिव",
    "ar": "نشط",
    "fr": "Actif",
    "de": "Aktiv",
    "es": "Activo",
    "zh": "运动",
    "ja": "アクティブ"
  },
  "Deluxe": {
    "en": "Deluxe",
    "ta": "டீலக்ஸ்",
    "hi": "डीलक्स",
    "ar": "فاخر",
    "fr": "Deluxe",
    "de": "Deluxe",
    "es": "De lujo",
    "zh": "豪华",
    "ja": "デラックス"
  },
  "Minimalist": {
    "en": "Minimalist",
    "ta": "மினிமலிஸ்ட்",
    "hi": "मिनिमलिस्ट",
    "ar": "بسيط",
    "fr": "Minimaliste",
    "de": "Minimalistisch",
    "es": "Minimalista",
    "zh": "极简",
    "ja": "ミニマリスト"
  }
};

export const NOUNS: TermMap = {
  "T-Shirt": {
    "en": "T-Shirt",
    "ta": "டி-ஷர்ட்",
    "hi": "टी-शर्ट",
    "ar": "تي شيرت",
    "fr": "T-shirt",
    "de": "T-Shirt",
    "es": "Camiseta",
    "zh": "T恤",
    "ja": "Tシャツ"
  },
  "Shirt": {
    "en": "Shirt",
    "ta": "ஷர்ட்",
    "hi": "शर्ट",
    "ar": "قميص",
    "fr": "Chemise",
    "de": "Hemd",
    "es": "Camisa",
    "zh": "衬衫",
    "ja": "シャツ"
  },
  "Jeans": {
    "en": "Jeans",
    "ta": "ஜீன்ஸ்",
    "hi": "जीन्स",
    "ar": "جينز",
    "fr": "Jean",
    "de": "Jeans",
    "es": "Vaqueros",
    "zh": "牛仔裤",
    "ja": "ジーンズ"
  },
  "Hoodie": {
    "en": "Hoodie",
    "ta": "ஹூடி",
    "hi": "हुडी",
    "ar": "هودي",
    "fr": "Sweat à capuche",
    "de": "Kapuzenpulli",
    "es": "Sudadera",
    "zh": "连帽衫",
    "ja": "パーカー"
  },
  "Jacket": {
    "en": "Jacket",
    "ta": "ஜாக்கெட்",
    "hi": "जैकेट",
    "ar": "سترة",
    "fr": "Veste",
    "de": "Jacke",
    "es": "Chaqueta",
    "zh": "夹克",
    "ja": "ジャケット"
  },
  "Shoes": {
    "en": "Shoes",
    "ta": "காலணிகள்",
    "hi": "जूते",
    "ar": "حذاء",
    "fr": "Chaussures",
    "de": "Schuhe",
    "es": "Zapatos",
    "zh": "鞋",
    "ja": "シューズ"
  },
  "Sneakers": {
    "en": "Sneakers",
    "ta": "ஸ்னீக்கர்ஸ்",
    "hi": "स्नीकर्स",
    "ar": "أحذية رياضية",
    "fr": "Baskets",
    "de": "Sneaker",
    "es": "Zapatillas",
    "zh": "运动鞋",
    "ja": "スニーカー"
  },
  "Sandals": {
    "en": "Sandals",
    "ta": "செருப்புகள்",
    "hi": "सैंडल",
    "ar": "صنادل",
    "fr": "Sandales",
    "de": "Sandalen",
    "es": "Sandalias",
    "zh": "凉鞋",
    "ja": "サンダル"
  },
  "Slippers": {
    "en": "Slippers",
    "ta": "ஸ்லிப்பர்ஸ்",
    "hi": "चप्पल",
    "ar": "شبشب",
    "fr": "Chaussons",
    "de": "Hausschuhe",
    "es": "Pantuflas",
    "zh": "拖鞋",
    "ja": "スリッパ"
  },
  "Watch": {
    "en": "Watch",
    "ta": "கடிகாரம்",
    "hi": "घड़ी",
    "ar": "ساعة",
    "fr": "Montre",
    "de": "Uhr",
    "es": "Reloj",
    "zh": "手表",
    "ja": "腕時計"
  },
  "Wallet": {
    "en": "Wallet",
    "ta": "பணப்பை",
    "hi": "वॉलेट",
    "ar": "محفظة",
    "fr": "Portefeuille",
    "de": "Geldbörse",
    "es": "Cartera",
    "zh": "钱包",
    "ja": "財布"
  },
  "Sunglasses": {
    "en": "Sunglasses",
    "ta": "சன்கிளாஸ்",
    "hi": "धूप का चश्मा",
    "ar": "نظارة شمسية",
    "fr": "Lunettes de soleil",
    "de": "Sonnenbrille",
    "es": "Gafas de sol",
    "zh": "太阳镜",
    "ja": "サングラス"
  },
  "Cap": {
    "en": "Cap",
    "ta": "தொப்பி",
    "hi": "कैप",
    "ar": "قبعة",
    "fr": "Casquette",
    "de": "Mütze",
    "es": "Gorra",
    "zh": "帽子",
    "ja": "キャップ"
  },
  "Earbuds": {
    "en": "Earbuds",
    "ta": "இயர்பட்ஸ்",
    "hi": "ईयरबड्स",
    "ar": "سماعات أذن",
    "fr": "Écouteurs",
    "de": "Ohrhörer",
    "es": "Auriculares",
    "zh": "耳机",
    "ja": "イヤホン"
  },
  "Headphones": {
    "en": "Headphones",
    "ta": "ஹெட்ஃபோன்ஸ்",
    "hi": "हेडफ़ोन",
    "ar": "سماعات رأس",
    "fr": "Casque",
    "de": "Kopfhörer",
    "es": "Auriculares",
    "zh": "头戴耳机",
    "ja": "ヘッドホン"
  },
  "Smartwatch": {
    "en": "Smartwatch",
    "ta": "ஸ்மார்ட்வாட்ச்",
    "hi": "स्मार्टवॉच",
    "ar": "ساعة ذكية",
    "fr": "Montre connectée",
    "de": "Smartwatch",
    "es": "Reloj inteligente",
    "zh": "智能手表",
    "ja": "スマートウォッチ"
  },
  "Power Bank": {
    "en": "Power Bank",
    "ta": "பவர் பேங்க்",
    "hi": "पावर बैंक",
    "ar": "بنك طاقة",
    "fr": "Batterie externe",
    "de": "Powerbank",
    "es": "Batería externa",
    "zh": "充电宝",
    "ja": "モバイルバッテリー"
  },
  "Water Bottle": {
    "en": "Water Bottle",
    "ta": "தண்ணீர் பாட்டில்",
    "hi": "पानी की बोतल",
    "ar": "زجاجة ماء",
    "fr": "Gourde",
    "de": "Trinkflasche",
    "es": "Botella de agua",
    "zh": "水瓶",
    "ja": "水筒"
  },
  "Bag": {
    "en": "Bag",
    "ta": "பை",
    "hi": "बैग",
    "ar": "حقيبة",
    "fr": "Sac",
    "de": "Tasche",
    "es": "Bolso",
    "zh": "包",
    "ja": "バッグ"
  },
  "Desk Organizer": {
    "en": "Desk Organizer",
    "ta": "மேசை ஒழுங்கமைப்பான்",
    "hi": "डेस्क ऑर्गनाइज़र",
    "ar": "منظم مكتب",
    "fr": "Organiseur de bureau",
    "de": "Schreibtisch-Organizer",
    "es": "Organizador de escritorio",
    "zh": "桌面收纳",
    "ja": "デスクオーガナイザー"
  },
  "Perfume": {
    "en": "Perfume",
    "ta": "வாசனை திரவியம்",
    "hi": "परफ्यूम",
    "ar": "عطر",
    "fr": "Parfum",
    "de": "Parfüm",
    "es": "Perfume",
    "zh": "香水",
    "ja": "香水"
  },
  "Face Cream": {
    "en": "Face Cream",
    "ta": "முகப் பூச்சு",
    "hi": "फेस क्रीम",
    "ar": "كريم وجه",
    "fr": "Crème visage",
    "de": "Gesichtscreme",
    "es": "Crema facial",
    "zh": "面霜",
    "ja": "フェイスクリーム"
  }
};

export const CATEGORIES: TermMap = {
  "Fashion": {
    "en": "Fashion",
    "ta": "ஃபேஷன்",
    "hi": "फैशन",
    "ar": "أزياء",
    "fr": "Mode",
    "de": "Mode",
    "es": "Moda",
    "zh": "时尚",
    "ja": "ファッション"
  },
  "Footwear": {
    "en": "Footwear",
    "ta": "காலணிகள்",
    "hi": "फुटवियर",
    "ar": "أحذية",
    "fr": "Chaussures",
    "de": "Schuhe",
    "es": "Calzado",
    "zh": "鞋类",
    "ja": "履物"
  },
  "Accessories": {
    "en": "Accessories",
    "ta": "துணைக்கருவிகள்",
    "hi": "एक्सेसरीज़",
    "ar": "إكسسوارات",
    "fr": "Accessoires",
    "de": "Accessoires",
    "es": "Accesorios",
    "zh": "配件",
    "ja": "アクセサリー"
  },
  "Electronics": {
    "en": "Electronics",
    "ta": "எலக்ட்ரானிக்ஸ்",
    "hi": "इलेक्ट्रॉनिक्स",
    "ar": "إلكترونيات",
    "fr": "Électronique",
    "de": "Elektronik",
    "es": "Electrónica",
    "zh": "电子产品",
    "ja": "電子機器"
  },
  "Home": {
    "en": "Home",
    "ta": "வீடு",
    "hi": "होम",
    "ar": "المنزل",
    "fr": "Maison",
    "de": "Zuhause",
    "es": "Hogar",
    "zh": "家居",
    "ja": "ホーム"
  },
  "Beauty": {
    "en": "Beauty",
    "ta": "அழகு",
    "hi": "ब्यूटी",
    "ar": "جمال",
    "fr": "Beauté",
    "de": "Schönheit",
    "es": "Belleza",
    "zh": "美妆",
    "ja": "ビューティー"
  },
  "T-Shirts": {
    "en": "T-Shirts",
    "ta": "டி-ஷர்ட்கள்",
    "hi": "टी-शर्ट",
    "ar": "تي شيرتات",
    "fr": "T-shirts",
    "de": "T-Shirts",
    "es": "Camisetas",
    "zh": "T恤",
    "ja": "Tシャツ"
  },
  "Shirts": {
    "en": "Shirts",
    "ta": "ஷர்ட்கள்",
    "hi": "शर्ट",
    "ar": "قمصان",
    "fr": "Chemises",
    "de": "Hemden",
    "es": "Camisas",
    "zh": "衬衫",
    "ja": "シャツ"
  },
  "Hoodies": {
    "en": "Hoodies",
    "ta": "ஹூடிகள்",
    "hi": "हुडी",
    "ar": "هوديات",
    "fr": "Sweats à capuche",
    "de": "Kapuzenpullis",
    "es": "Sudaderas",
    "zh": "连帽衫",
    "ja": "パーカー"
  },
  "Jackets": {
    "en": "Jackets",
    "ta": "ஜாக்கெட்டுகள்",
    "hi": "जैकेट",
    "ar": "سترات",
    "fr": "Vestes",
    "de": "Jacken",
    "es": "Chaquetas",
    "zh": "夹克",
    "ja": "ジャケット"
  },
  "Sneakers": {
    "en": "Sneakers",
    "ta": "ஸ்னீக்கர்ஸ்",
    "hi": "स्नीकर्स",
    "ar": "أحذية رياضية",
    "fr": "Baskets",
    "de": "Sneaker",
    "es": "Zapatillas",
    "zh": "运动鞋",
    "ja": "スニーカー"
  },
  "Sandals": {
    "en": "Sandals",
    "ta": "செருப்புகள்",
    "hi": "सैंडल",
    "ar": "صنادل",
    "fr": "Sandales",
    "de": "Sandalen",
    "es": "Sandalias",
    "zh": "凉鞋",
    "ja": "サンダル"
  },
  "Watches": {
    "en": "Watches",
    "ta": "கடிகாரங்கள்",
    "hi": "घड़ियाँ",
    "ar": "ساعات",
    "fr": "Montres",
    "de": "Uhren",
    "es": "Relojes",
    "zh": "手表",
    "ja": "腕時計"
  },
  "Wallets": {
    "en": "Wallets",
    "ta": "பணப்பைகள்",
    "hi": "वॉलेट",
    "ar": "محافظ",
    "fr": "Portefeuilles",
    "de": "Geldbörsen",
    "es": "Carteras",
    "zh": "钱包",
    "ja": "財布"
  },
  "Caps": {
    "en": "Caps",
    "ta": "தொப்பிகள்",
    "hi": "कैप",
    "ar": "قبعات",
    "fr": "Casquettes",
    "de": "Mützen",
    "es": "Gorras",
    "zh": "帽子",
    "ja": "キャップ"
  },
  "Smart Watches": {
    "en": "Smart Watches",
    "ta": "ஸ்மார்ட் வாட்ச்கள்",
    "hi": "स्मार्टवॉच",
    "ar": "ساعات ذكية",
    "fr": "Montres connectées",
    "de": "Smartwatches",
    "es": "Relojes inteligentes",
    "zh": "智能手表",
    "ja": "スマートウォッチ"
  },
  "Power Banks": {
    "en": "Power Banks",
    "ta": "பவர் பேங்க்குகள்",
    "hi": "पावर बैंक",
    "ar": "بنوك طاقة",
    "fr": "Batteries externes",
    "de": "Powerbanks",
    "es": "Baterías externas",
    "zh": "充电宝",
    "ja": "モバイルバッテリー"
  },
  "Water Bottles": {
    "en": "Water Bottles",
    "ta": "தண்ணீர் பாட்டில்கள்",
    "hi": "पानी की बोतलें",
    "ar": "زجاجات ماء",
    "fr": "Gourdes",
    "de": "Trinkflaschen",
    "es": "Botellas de agua",
    "zh": "水瓶",
    "ja": "水筒"
  },
  "Bags": {
    "en": "Bags",
    "ta": "பைகள்",
    "hi": "बैग",
    "ar": "حقائب",
    "fr": "Sacs",
    "de": "Taschen",
    "es": "Bolsos",
    "zh": "包",
    "ja": "バッグ"
  },
  "Office Accessories": {
    "en": "Office Accessories",
    "ta": "அலுவலக துணைக்கருவிகள்",
    "hi": "ऑफिस एक्सेसरीज़",
    "ar": "إكسسوارات مكتبية",
    "fr": "Accessoires de bureau",
    "de": "Bürozubehör",
    "es": "Accesorios de oficina",
    "zh": "办公配件",
    "ja": "オフィス用品"
  },
  "Skin Care": {
    "en": "Skin Care",
    "ta": "சரும பராமரிப்பு",
    "hi": "स्किन केयर",
    "ar": "العناية بالبشرة",
    "fr": "Soin de la peau",
    "de": "Hautpflege",
    "es": "Cuidado de la piel",
    "zh": "护肤",
    "ja": "スキンケア"
  }
};

export const DESCRIPTION_TEMPLATE: Record<ProductLang, string> = {
  "en": "{adjective} {noun} from {brand}, designed for everyday comfort, durability, and style. A great addition to your {category} collection.",
  "ta": "{brand} நிறுவனத்தின் {adjective} {noun} — தினசரி வசதி, நீடித்த தன்மை மற்றும் ஸ்டைலுக்காக வடிவமைக்கப்பட்டது. உங்கள் {category} சேகரிப்பிற்கு சிறந்த சேர்க்கை.",
  "hi": "{brand} का {adjective} {noun}, रोज़ाना के आराम, टिकाऊपन और स्टाइल के लिए डिज़ाइन किया गया। आपके {category} संग्रह में एक शानदार जोड़।",
  "ar": "{noun} {adjective} من {brand}، مصمم للراحة اليومية والمتانة والأناقة. إضافة رائعة إلى مجموعة {category} الخاصة بك.",
  "fr": "{noun} {adjective} de {brand}, conçu pour le confort, la durabilité et le style au quotidien. Un excellent ajout à votre collection {category}.",
  "de": "{adjective} {noun} von {brand}, entworfen für Komfort, Langlebigkeit und Stil im Alltag. Eine großartige Ergänzung für Ihre {category}-Kollektion.",
  "es": "{noun} {adjective} de {brand}, diseñado para la comodidad, la durabilidad y el estilo diarios. Una gran adición a tu colección de {category}.",
  "zh": "来自 {brand} 的{adjective}{noun}，专为日常舒适、耐用和时尚而设计。是您{category}系列的绝佳之选。",
  "ja": "{brand} の{adjective}{noun}。日常の快適さ、耐久性、スタイルを追求してデザインされました。あなたの{category}コレクションに最適な一品です。"
};
