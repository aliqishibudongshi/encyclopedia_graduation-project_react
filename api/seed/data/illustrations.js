const armorIllustrations = [
    {
        name: '锁子黄金甲',
        description: '第六回合主线获取',
        image: '/images/armor/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '大力山文甲',
        description: '第五回【隐·壁水洞】击败BOSS【壁水金晴兽】铸造获得，一周目一定要拿完4个大力铁角，二周目才能完成全部制作',
        image: '/images/armor/2.png',
        collected: false,
        categoryId: null,
    },
    {
        name: '锦鳞战袍',
        description: '第一回主线击败BOSS【白衣秀士】铸造获得',
        image: '/images/armor/3.png',
        collected: false,
        categoryId: null,
    },
    {
        name: '行者直裰',
        description: '第一回主线开铸造后即可铸造获得',
        image: '/images/armor/4.png',
        collected: false,
        categoryId: null,
    },
    {
        name: '阴阳法衣',
        description: '第五回主线击败BOSS【火焰山土地】必定掉落',
        image: '/images/armor/5.png',
        collected: false,
        categoryId: null,
    },
    {
        name: '厌火绣衫',
        description: '第五回击败BOSS【夜叉王】铸造获得',
        image: '/images/armor/6.png',
        collected: false,
        categoryId: null,
    },
    {
        name: '玄铁征袍铠',
        description: '第三回解锁【六六村】后击败【寅虎】可铸造衣、臂、腿，第四回【隐·紫云山】击败BOSS【晦月魔君】后可铸造头',
        image: '/images/armor/7.png',
        collected: false,
        categoryId: null,
    },
    {
        name: '羽士戗金甲',
        description: '第四回主线击败BOSS【百眼魔君】铸造获得',
        image: '/images/armor/8.png',
        collected: false,
        categoryId: null,
    },
    {
        name: '昆歧毒敌甲',
        description: '第二回【隐·斯哈里国】击败BOSS【蝮蝂】可铸造头、臂、足，第四回【隐·紫云山】击败BOSS【毒敌大王】后可铸造衣甲',
        image: '/images/armor/9.png',
        collected: false,
        categoryId: null,
    },
    {
        name: '不净盘龙甲',
        description: '第四回主线第二次击败【猪八戒】铸造获得',
        image: '/images/armor/10.png',
        collected: false,
        categoryId: null,
    },
    {
        name: '金身绣衫',
        description: '第三回主线击败BOSS【黄眉】铸造获得',
        image: '/images/armor/11.png',
        collected: false,
        categoryId: null,
    },
];

const boozeIllustrations = [
    {
        name: '甜雪',
        description: '在【小西天-小雷音寺-寺门】右侧往上走，右侧门左转上去，进门往前走左转出来下方亭子里开箱获得',
        image: '/images/booze/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '胆中珠',
        description: '【黑风山-翠竹林-白雾泽】主线救申猴获得',
        image: '/images/booze/2.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '嫩玉藕',
        description: '采集【碧藕】概率获得,无忧涧水里比较多',
        image: '/images/booze/3.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '梭罗琼芽',
        description: '在【黄风岭-沙门村-村口】然后走右侧小路过去，在右侧的佛像前开箱获得',
        image: '/images/booze/4.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '铁弹',
        description: '在【黄风岭-挟魂崖-藏风山凹】石中人处购买',
        image: '/images/booze/5.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '铜丸',
        description: '在【黄风岭-黄风阵-定风桥】右侧下去佛像前开箱获得',
        image: '/images/booze/6.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '十二重楼胶',
        description: '在【小西天-苦海-龟岛】击败青背龙后开启出现的宝箱获得',
        image: '/images/booze/7.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '瑶池莲子',
        description: '在【申猴处购买】',
        image: '/images/booze/8.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '霹雳角',
        description: '完成辰龙支线，在六六村【申猴】处购买获得',
        image: '/images/booze/9.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '龟泪',
        description: '在【小西天-苦海-苦海北岸】完成蛇龟二将支线前去拾取',
        image: '/images/booze/10.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '铁骨银参',
        description: '采集人参概率获得，人参路线【小西天-极乐谷-罪业塔林】往后走，路上1人参，石塔前面2人参2人参精',
        image: '/images/booze/11.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    }
];

const crownIllustrations = [
    {
        name: '凤翅紫金冠',
        description: '第六回主线获取',
        image: '/images/crown/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '大力王面',
        description: '第五回【隐·壁水洞】击败老大【壁水金晴兽】铸造获得，一周目一定要拿完4个大力铁角，二周目才能完成全部制作',
        image: '/images/crown/2.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '行者戒箍',
        description: '第一回主线开铸造后即可铸造获得',
        image: '/images/crown/3.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '厌火夜叉面',
        description: '第五回击败老板(Boss)【夜叉王】铸造获得',
        image: '/images/crown/4.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '玄铁双角盔',
        description: '第三回解锁【六六村】后击败【寅虎】可铸造衣、臂、腿，第四回【隐·紫云山】击败BOSS【晦月魔君】后可铸造头',
        image: '/images/crown/5.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '羽士云笠',
        description: '第四回主线击败BOSS【百眼魔君】铸造获得',
        image: '/images/crown/6.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '不净残面',
        description: '第四回主线第二次击败【猪八戒】铸造获得',
        image: '/images/crown/7.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '金身怒目面',
        description: '第三回主线击败BOSS【黄眉】铸造获得',
        image: '/images/crown/8.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '昆歧佛笠',
        description: '第二回【隐·斯哈里国】击败BOSS【蝮蝂】可铸造头、臂、足，第四回【隐·紫云山】击败BOSS【毒敌大王】后可铸造衣甲',
        image: '/images/crown/9.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '地灵伞盖',
        description: '第五回【火光地·火燎三关】击败BOSS【九叶灵芝精】必定掉落',
        image: '/images/crown/10.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '鉴宝头骨',
        description: '击败【鉴主】概率掉落',
        image: '/images/crown/11.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
];

const curioIllustrations = [
    {
        name: '猫睛宝串',
        description: '无',
        image: '/images/curio/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '玛瑙罐',
        description: '无',
        image: '/images/curio/2.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '不求人',
        description: '无',
        image: '/images/curio/3.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '砗磲佩',
        description: '无',
        image: '/images/curio/4.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '琉璃舍利瓶',
        description: '无',
        image: '/images/curio/5.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '虎头牌',
        description: '无',
        image: '/images/curio/6.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '摩尼珠',
        description: '无',
        image: '/images/curio/7.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '细磁茶盂',
        description: '无',
        image: '/images/curio/8.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '耐雪枝',
        description: '无',
        image: '/images/curio/9.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '白狐毫',
        description: '无',
        image: '/images/curio/10.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '风铎',
        description: '无',
        image: '/images/curio/11.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '博山炉',
        description: '无',
        image: '/images/curio/12.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '金棕衣',
        description: '无',
        image: '/images/curio/13.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '未来珠',
        description: '无',
        image: '/images/curio/14.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '金花玉萼',
        description: '无',
        image: '/images/curio/15.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '铜佛坠',
        description: '无',
        image: '/images/curio/16.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '雷榍',
        description: '无',
        image: '/images/curio/17.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '雷火印',
        description: '无',
        image: '/images/curio/18.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
];

const gardebrasIllustrations = [
    {
        name: '点翠飞龙釬',
        description: '第六回主线获取',
        image: '/images/gardebras/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '大力臂甲',
        description: '第五回【隐·壁水洞】击败BOSS【壁水金晴兽】铸造获得，一周目一定要拿完4个大力铁角，二周目才能完成全部制作',
        image: '/images/gardebras/2.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '锦鳞护臂',
        description: '第一回主线击败BOSS【白衣秀士】铸造获得',
        image: '/images/gardebras/3.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '行者扎腕',
        description: '第一回主线开铸造后即可铸造获得',
        image: '/images/gardebras/4.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '厌火魔手',
        description: '第五回击败BOSS【夜叉王】铸造获得',
        image: '/images/gardebras/5.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '玄铁硬手',
        description: '第三回解锁【六六村】后击败【寅虎】可铸造衣、臂、腿，第四回【隐·紫云山】击败BOSS【晦月魔君】后可铸造头',
        image: '/images/gardebras/6.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '羽士刺釬',
        description: '第四回主线击败BOSS【百眼魔君】铸造获得',
        image: '/images/gardebras/7.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '不净护釬',
        description: '第四回主线第二次击败【猪八戒】铸造获得',
        image: '/images/gardebras/8.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '金身护臂',
        description: '第三回主线击败BOSS【黄眉】铸造获得',
        image: '/images/gardebras/9.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '下毒手',
        description: '第四回隐藏图支线第一次遇见BOSS【黑手道人】，先打断其四条手臂，击败后必定掉落',
        image: '/images/gardebras/10.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
];

const gourdIllustrations = [
    {
        name: '上清宝葫芦',
        description: '天命人开局自带葫芦升级而来',
        image: '/images/gourd/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '乾坤彩葫芦',
        description: '饮尽葫芦中最后一口酒，30秒内增加30%伤害',
        image: '/images/gourd/2.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '妙仙葫芦',
        description: '恢复效果减半，但饮酒后20秒内，增加20攻击力',
        image: '/images/gourd/3.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '湘妃葫芦',
        description: '饮酒后15秒内增加45点火焰耐性',
        image: '/images/gourd/4.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '玉观音葫芦',
        description: '饮酒时，完全恢复场中毛猴的生命',
        image: '/images/gourd/5.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '青田葫芦',
        description: '每20秒恢复，葫芦中盛酒量',
        image: '/images/gourd/6.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '彩玉葫芦',
        description: '大大加快饮酒速度',
        image: '/images/gourd/7.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '燃葫芦',
        description: '饮酒后15秒内增加15点寒冻耐性并提升30点气力',
        image: '/images/gourd/8.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '争先红葫芦',
        description: '盛满酒时，饮下第一口酒，可恢复全部生命',
        image: '/images/gourd/9.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '五鬼葫芦',
        description: '恢复效果减半，但饮酒后20秒内增加15点攻击',
        image: '/images/gourd/10.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
];

const seedIllustrations = [
    {
        name: '碧藕种子',
        description: '【位置】水潭处有，推荐小西天·极乐谷·无忧涧处刷取。',
        image: '/images/seed/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '交梨种子',
        description: '【位置】推荐小西天·极乐谷·无忧涧附近往下跳，河道两边刷取。',
        image: '/images/seed/2.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '龙胆种子',
        description: '【位置】到处都有，推荐小西天·雪山径·披霜道处刷取。',
        image: '/images/seed/3.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '甘草种子',
        description: '位置】到处都有，推荐黄风岭·沙门村·村口以及 盘丝洞·兰喜村·朱家大院刷取。',
        image: '/images/seed/4.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '火铃草种子',
        description: '【位置】到处都有，推荐小西天·极乐谷·无忧涧处刷取。',
        image: '/images/seed/5.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '火枣种子',
        description: '【位置】推荐到火焰山·丹灶谷·谷口处，罗刹宫岩浆里有很多。',
        image: '/images/seed/6.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '珠树种子(可栽培出树珍珠)',
        description: '【位置】推荐盘丝岭·隐·紫云山·千花谷刷取。',
        image: '/images/seed/7.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '漱玉花种子',
        description: '【位置】推荐盘丝岭·兰喜村·朱家大院刷取。',
        image: '/images/seed/8.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '地莲种子(可栽培出地涌金莲)',
        description: '【位置】推荐小西天·苦海·龟岛，打地莲精刷取。',
        image: '/images/seed/9.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '猴头菌种子(可栽培猴头菌和葛草)',
        description: '【位置】盘丝岭·黄花观·金光苑击杀蘑女获取。',
        image: '/images/seed/10.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '九叶灵芝草种子(可栽培九叶灵芝草和紫芝)',
        description: '【位置】火焰山·火光地·火燎三关击杀九叶灵芝精获得。',
        image: '/images/seed/11.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '千年人参种子(可栽培千年人参和老山参)',
        description: '【位置】小西天·极乐谷·罪业塔林 人参田击杀千年人参精获得。',
        image: '/images/seed/12.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
];

const spiritIllustrations = [
    {
        name: '不净',
        description: '无',
        image: '/images/spirit/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '幽魂',
        description: '无',
        image: '/images/spirit/2.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '波里个浪',
        description: '无',
        image: '/images/spirit/3.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '广谋',
        description: '无',
        image: '/images/spirit/4.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '狼刺客',
        description: '无',
        image: '/images/spirit/5.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '鼠弩手',
        description: '无',
        image: '/images/spirit/6.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '沙二郎',
        description: '无',
        image: '/images/spirit/7.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '疾蝠',
        description: '无',
        image: '/images/spirit/8.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '鼠禁卫',
        description: '无',
        image: '/images/spirit/9.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '百目真人',
        description: '无',
        image: '/images/spirit/10.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '狸侍长',
        description: '无',
        image: '/images/spirit/11.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '骨悚然',
        description: '无',
        image: '/images/spirit/12.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '石双双',
        description: '无',
        image: '/images/spirit/13.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '不白',
        description: '无',
        image: '/images/spirit/14.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
];

const tassetIllustrations = [
    {
        name: '藕丝步云履',
        description: '第六回主线获取',
        image: '/images/tasset/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '大力胫甲',
        description: '第五回【隐·壁水洞】击败BOSS【壁水金晴兽】铸造获得，一周目一定要拿完4个大力铁角，二周目才能完成全部制作',
        image: '/images/tasset/2.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '锦鳞行缠',
        description: '第一回主线击败BOSS【白衣秀士】铸造获得',
        image: '/images/tasset/3.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '行者腿绷',
        description: '第一回主线开铸造后即可铸造获得',
        image: '/images/tasset/4.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '厌火魔足',
        description: '第五回击败BOSS【夜叉王】铸造获得',
        image: '/images/tasset/5.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '玄铁硬足',
        description: '第三回解锁【六六村】后击败【寅虎】可铸造衣、臂、腿，第四回【隐·紫云山】击败BOSS【晦月魔君】后可铸造头',
        image: '/images/tasset/6.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '羽士护腿',
        description: '第四回主线击败BOSS【百眼魔君】铸造获得',
        image: '/images/tasset/7.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '不净泥足',
        description: '第四回主线第二次击败【猪八戒】铸造获得',
        image: '/images/tasset/8.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '金身护腿',
        description: '第三回主线击败BOSS【黄眉】铸造获得',
        image: '/images/tasset/9.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '昆歧刺足',
        description: '第二回【隐·斯哈里国】击败BOSS【】可铸造头、臂、足，第四回【隐·紫云山】击败BOSS【毒敌大王】后可铸造衣甲',
        image: '/images/tasset/10.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '龙鳞胫甲',
        description: '第三回主线击败BOSS【亢金星君】铸造获得',
        image: '/images/tasset/11.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
];

const weaponIllustrations = [
    {
        name: '柳木棍',
        description: '开局自带',
        image: '/images/weapon/1.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '铜云棒',
        description: '游戏豪华版奖励。',
        image: '/images/weapon/2.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '鳞棍·双蛇',
        description: '“翠竹林一白雾泽”区域击败白衣秀士获得玉垂牙后获得配方。',
        image: '/images/weapon/3.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '出云棍',
        description: '“挟魂崖-枕石坪”区域中击败石先锋后获得配方',
        image: '/images/weapon/4.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '兽棍·貂鼠',
        description: '击败黄风岭最终BOSS黄风大圣获得神风玛瑙后解锁配方。',
        image: '/images/weapon/5.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '鳞棍·亢金',
        description: '“雪山径-照镜湖”区域中击败亢金龙后解锁配方。',
        image: '/images/weapon/6.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '鳞棍·蟠龙',
        description: '“苍狼林一林外”击败赤髯龙，“挟魂崖-枕石坪”击败小骊龙后获得配方。',
        image: '/images/weapon/7.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '几丁棍',
        description: '“兰喜村-青家大院”击败BOSS二姐后解锁配方。',
        image: '/images/weapon/8.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '诸白枪',
        description: '完成魔将小张太子支线后获得。',
        image: '/images/weapon/9.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
    {
        name: '狼牙棒',
        description: '击败“小西天”区域最终BOSS后获得。',
        image: '/images/weapon/10.png',
        collected: false,
        categoryId: null, // Will be set dynamically
    },
];
module.exports = { armorIllustrations, boozeIllustrations, crownIllustrations, curioIllustrations, gardebrasIllustrations, gourdIllustrations, seedIllustrations, spiritIllustrations, tassetIllustrations, weaponIllustrations };
