import type { Word, CountryInfo, CatInfo, MonsterInfo, TitleInfo } from '../types';

export const WORDS: Word[] = [
  {id:1,word:"negotiate",phonetic:"/nɪˈɡoʊʃieɪt/",meaning:"協商、談判",example:"We need to ______ the contract terms.",cat:"business",country:"au",monster:"book",day:1},
  {id:2,word:"implement",phonetic:"/ˈɪmplɪment/",meaning:"實施、執行",example:"The company will ______ new policies.",cat:"business",country:"au",monster:"book",day:1},
  {id:3,word:"collaborate",phonetic:"/kəˈlæbəreɪt/",meaning:"合作、協作",example:"Teams ______ across departments.",cat:"business",country:"au",monster:"book",day:1},
  {id:4,word:"procurement",phonetic:"/prəˈkjʊərmənt/",meaning:"採購",example:"The ______ team handles vendors.",cat:"business",country:"au",monster:"book",day:1},
  {id:5,word:"confidential",phonetic:"/ˌkɒnfɪˈdenʃəl/",meaning:"機密的",example:"This is ______ information.",cat:"business",country:"au",monster:"book",day:2},
  {id:6,word:"itinerary",phonetic:"/aɪˈtɪnəreri/",meaning:"行程表",example:"Please review the travel ______.",cat:"travel",country:"au",monster:"koala",day:1},
  {id:7,word:"accommodate",phonetic:"/əˈkɒmədeɪt/",meaning:"容納、提供住宿",example:"The hotel can ______ 200 guests.",cat:"travel",country:"au",monster:"koala",day:1},
  {id:8,word:"venue",phonetic:"/ˈvenjuː/",meaning:"場地、舉辦地點",example:"The ______ was booked for the conference.",cat:"travel",country:"au",monster:"koala",day:2},
  {id:9,word:"reservation",phonetic:"/ˌrezəˈveɪʃən/",meaning:"預訂、預約",example:"I'd like to make a ______ for two.",cat:"travel",country:"au",monster:"koala",day:2},
  {id:10,word:"departure",phonetic:"/dɪˈpɑːrtʃər/",meaning:"出發、離境",example:"The ______ gate is at B12.",cat:"travel",country:"au",monster:"koala",day:2},
  {id:11,word:"subsidiary",phonetic:"/səbˈsɪdiəri/",meaning:"子公司",example:"They opened a ______ in Tokyo.",cat:"business",country:"au",monster:"boss",day:3},
  {id:12,word:"infrastructure",phonetic:"/ˈɪnfrəstrʌktʃər/",meaning:"基礎設施",example:"The city improved its ______.",cat:"tech",country:"au",monster:"boss",day:3},
  {id:13,word:"allocate",phonetic:"/ˈæləkeɪt/",meaning:"分配、撥出",example:"We need to ______ resources carefully.",cat:"finance",country:"uk",monster:"book",day:1},
  {id:14,word:"surplus",phonetic:"/ˈsɜːrpləs/",meaning:"剩餘、盈餘",example:"There is a budget ______ this year.",cat:"finance",country:"uk",monster:"book",day:1},
  {id:15,word:"fluctuate",phonetic:"/ˈflʌktʃueɪt/",meaning:"波動、起伏",example:"Stock prices ______ daily.",cat:"finance",country:"uk",monster:"book",day:2},
  {id:16,word:"customs",phonetic:"/ˈkʌstəmz/",meaning:"海關",example:"Please declare your goods at ______.",cat:"travel",country:"uk",monster:"koala",day:1},
  {id:17,word:"landmark",phonetic:"/ˈlændmɑːrk/",meaning:"地標",example:"Big Ben is a famous ______ in London.",cat:"travel",country:"uk",monster:"koala",day:1},
  {id:18,word:"parliamentary",phonetic:"/ˌpɑːrləˈmentri/",meaning:"議會的",example:"The ______ debate lasted for hours.",cat:"business",country:"uk",monster:"boss",day:3},
  {id:19,word:"inventory",phonetic:"/ˈɪnvəntɔːri/",meaning:"庫存、存貨清單",example:"Check the ______ levels weekly.",cat:"logistics",country:"us",monster:"book",day:1},
  {id:20,word:"merchandise",phonetic:"/ˈmɜːrtʃəndaɪz/",meaning:"商品、貨物",example:"The store displays new ______.",cat:"shopping",country:"us",monster:"book",day:1},
  {id:21,word:"warranty",phonetic:"/ˈwɒrənti/",meaning:"保固、保證書",example:"The product comes with a 2-year ______.",cat:"shopping",country:"us",monster:"book",day:2},
  {id:22,word:"sightseeing",phonetic:"/ˈsaɪtsiːɪŋ/",meaning:"觀光、遊覽",example:"We went ______ around the city.",cat:"travel",country:"us",monster:"koala",day:1},
  {id:23,word:"shuttle",phonetic:"/ˈʃʌtl/",meaning:"接駁車、穿梭巴士",example:"Take the free ______ to the terminal.",cat:"travel",country:"us",monster:"koala",day:2},
  {id:24,word:"sustainable",phonetic:"/səˈsteɪnəbl/",meaning:"永續的、可持續的",example:"______ practices benefit the environment.",cat:"business",country:"us",monster:"boss",day:3},
  {id:25,word:"recruitment",phonetic:"/rɪˈkruːtmənt/",meaning:"招募、招聘",example:"______ efforts increased this year.",cat:"hr",country:"ca",monster:"book",day:1},
  {id:26,word:"demographic",phonetic:"/ˌdeməˈɡræfɪk/",meaning:"人口統計的、目標族群",example:"We analyzed the target ______.",cat:"marketing",country:"ca",monster:"book",day:1},
  {id:27,word:"reimburse",phonetic:"/ˌriːɪmˈbɜːrs/",meaning:"報銷、退款",example:"Submit receipts to get ______d.",cat:"finance",country:"ca",monster:"book",day:2},
  {id:28,word:"excursion",phonetic:"/ɪkˈskɜːrʒən/",meaning:"短途旅行、遠足",example:"We joined a day ______ to the mountains.",cat:"travel",country:"ca",monster:"koala",day:1},
  {id:29,word:"glacier",phonetic:"/ˈɡleɪʃər/",meaning:"冰河、冰川",example:"The ______ is a popular tourist attraction.",cat:"travel",country:"ca",monster:"koala",day:2},
  {id:30,word:"bilateral",phonetic:"/ˌbaɪˈlætərəl/",meaning:"雙邊的",example:"The ______ trade agreement was signed.",cat:"business",country:"ca",monster:"boss",day:3},
];

export const COUNTRIES: Record<string, CountryInfo> = {
  au:{name:"澳洲",flag:"🇦🇺",accent:"澳洲腔",days:3,cardClass:"au-card",chipClass:"au-chip"},
  uk:{name:"英國",flag:"🇬🇧",accent:"英式腔",days:3,cardClass:"uk-card",chipClass:"uk-chip"},
  us:{name:"美國",flag:"🇺🇸",accent:"美式腔",days:3,cardClass:"us-card",chipClass:"us-chip"},
  ca:{name:"加拿大",flag:"🇨🇦",accent:"加式腔",days:3,cardClass:"ca-card",chipClass:"ca-chip"},
};

export const CAT_INFO: Record<string, CatInfo> = {
  business:{name:"商務辦公",icon:"🏢",monster:"book",monsterName:"書本怪獸",color:"#6366F1",bg:"#EDE9FE"},
  travel:{name:"旅遊交通",icon:"✈️",monster:"koala",monsterName:"旅遊怪獸",color:"#0891B2",bg:"#CFFAFE"},
  shopping:{name:"購物消費",icon:"🛒",monster:"book",monsterName:"購物怪獸",color:"#D97706",bg:"#FEF3C7"},
  health:{name:"醫療健康",icon:"🏥",monster:"koala",monsterName:"健康怪獸",color:"#059669",bg:"#D1FAE5"},
  daily:{name:"生活日常",icon:"🏠",monster:"book",monsterName:"日常怪獸",color:"#7C3AED",bg:"#EDE9FE"},
  hr:{name:"人力資源",icon:"💼",monster:"boss",monsterName:"HR Boss",color:"#B45309",bg:"#FEF3C7"},
  finance:{name:"財務金融",icon:"📊",monster:"boss",monsterName:"金融 Boss",color:"#1D4ED8",bg:"#DBEAFE"},
  logistics:{name:"製造物流",icon:"🏭",monster:"book",monsterName:"物流怪獸",color:"#374151",bg:"#F3F4F6"},
  marketing:{name:"行銷廣告",icon:"📢",monster:"koala",monsterName:"行銷怪獸",color:"#BE185D",bg:"#FCE7F3"},
  tech:{name:"科技資訊",icon:"🖥️",monster:"boss",monsterName:"科技 Boss",color:"#0F766E",bg:"#CCFBF1"},
};

export const MONSTERS: Record<string, MonsterInfo> = {
  book:{name:"書本怪獸",emoji:"📚",hp:100},
  koala:{name:"旅遊怪獸",emoji:"🐨",hp:80},
  boss:{name:"Boss 怪獸",emoji:"👹",hp:150},
};

export const TITLES: TitleInfo[] = [
  {name:"🌱 初學者",level:1},{name:"📖 努力學習",level:3},
  {name:"⚡ 單字達人",level:5},{name:"🌟 冒險家",level:8},
  {name:"🏹 怪獸獵人",level:12},{name:"👑 英語王者",level:20},
];

export const XP_TABLE = [0,100,250,450,700,1000,1350,1750,2200,2700,3250,3850,4500];

export const DAYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as const;
export const DAY_NAMES = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];

export function getMonsterSVG(type: string): string {
  if(type==='book') return `<svg width="100%" height="100%" viewBox="0 0 32 32" style="image-rendering:pixelated">
    <rect x="4" y="6" width="24" height="20" fill="#6366F1" rx="2"/>
    <rect x="6" y="4" width="20" height="22" fill="#818CF8" rx="1"/>
    <rect x="8" y="8" width="16" height="2" fill="#fff" opacity=".7"/>
    <rect x="8" y="12" width="12" height="2" fill="#fff" opacity=".7"/>
    <rect x="8" y="16" width="14" height="2" fill="#fff" opacity=".7"/>
    <rect x="10" y="20" width="4" height="4" fill="#FDE68A"/>
    <rect x="18" y="20" width="4" height="4" fill="#FDE68A"/>
    <rect x="11" y="21" width="2" height="2" fill="#1E293B"/>
    <rect x="19" y="21" width="2" height="2" fill="#1E293B"/>
    <rect x="12" y="24" width="8" height="2" fill="#F87171" rx="1"/>
    <rect x="2" y="14" width="4" height="4" fill="#818CF8"/>
    <rect x="26" y="14" width="4" height="4" fill="#818CF8"/>
    <rect x="12" y="2" width="2" height="4" fill="#818CF8"/>
    <rect x="18" y="2" width="2" height="4" fill="#818CF8"/>
  </svg>`;
  if(type==='koala') return `<svg width="100%" height="100%" viewBox="0 0 32 32" style="image-rendering:pixelated">
    <rect x="8" y="4" width="16" height="16" fill="#9CA3AF" rx="8"/>
    <rect x="4" y="6" width="6" height="6" fill="#6B7280" rx="3"/>
    <rect x="22" y="6" width="6" height="6" fill="#6B7280" rx="3"/>
    <rect x="10" y="8" width="12" height="8" fill="#D1D5DB" rx="4"/>
    <rect x="12" y="12" width="3" height="3" fill="#1E293B"/>
    <rect x="17" y="12" width="3" height="3" fill="#1E293B"/>
    <rect x="13" y="16" width="6" height="3" fill="#374151" rx="1"/>
    <rect x="8" y="20" width="16" height="8" fill="#9CA3AF" rx="2"/>
    <rect x="6" y="26" width="4" height="4" fill="#9CA3AF"/>
    <rect x="22" y="26" width="4" height="4" fill="#9CA3AF"/>
    <rect x="14" y="20" width="4" height="2" fill="#F9A8D4"/>
  </svg>`;
  return `<svg width="100%" height="100%" viewBox="0 0 32 32" style="image-rendering:pixelated">
    <rect x="6" y="8" width="20" height="18" fill="#DC2626" rx="2"/>
    <rect x="10" y="4" width="4" height="6" fill="#7F1D1D"/>
    <rect x="18" y="4" width="4" height="6" fill="#7F1D1D"/>
    <rect x="8" y="10" width="4" height="4" fill="#FDE68A" rx="1"/>
    <rect x="20" y="10" width="4" height="4" fill="#FDE68A" rx="1"/>
    <rect x="9" y="11" width="2" height="2" fill="#1E293B"/>
    <rect x="21" y="11" width="2" height="2" fill="#1E293B"/>
    <rect x="10" y="18" width="12" height="4" fill="#7F1D1D" rx="1"/>
    <rect x="11" y="19" width="2" height="2" fill="#fff"/>
    <rect x="15" y="19" width="2" height="2" fill="#fff"/>
    <rect x="19" y="19" width="2" height="2" fill="#fff"/>
    <rect x="2" y="16" width="6" height="4" fill="#DC2626"/>
    <rect x="24" y="16" width="6" height="4" fill="#DC2626"/>
    <rect x="12" y="26" width="4" height="4" fill="#DC2626"/>
    <rect x="16" y="26" width="4" height="4" fill="#DC2626"/>
  </svg>`;
}
