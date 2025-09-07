"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.images = exports.categories = void 0;
exports.seededRandom = seededRandom;
const qb_1990HipHop_1 = require("qb_1990HipHop");
const qb_drake_1 = require("qb_drake");
const qb_1990RnB_1 = require("qb_1990RnB");
const qb_anime_1 = require("qb_anime");
const qb_business_1 = require("qb_business");
const qb_dragonballz_1 = require("qb_dragonballz");
const qb_fashion_1 = require("qb_fashion");
const qb_food_1 = require("qb_food");
const qb_gamingSys_1 = require("qb_gamingSys");
const qb_GTA_1 = require("qb_GTA");
const qb_historybasic_1 = require("qb_historybasic");
const qb_humanBody_1 = require("qb_humanBody");
const qb_literature_1 = require("qb_literature");
const qb_military_1 = require("qb_military");
const qb_science_1 = require("qb_science");
const qb_statesCapitals_1 = require("qb_statesCapitals");
const qb_taylorSwift_1 = require("qb_taylorSwift");
const qb_travel_1 = require("qb_travel");
const qb_math_1 = require("qb_math");
const qb_movie_1 = require("qb_movie");
function seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0)
        s += 2147483646;
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
}
exports.categories = [
    ["Drake", qb_drake_1.Drake], //1
    ["1990's Hip Hop", qb_1990HipHop_1.NinetiesHipHop], //2//!
    ["1990's RnB", qb_1990RnB_1.NinetiesRnB], //3//!
    ["Taylor Swift", qb_taylorSwift_1.TaylorSwiftTrivia], //4//!
    ["State Capitals", qb_statesCapitals_1.StateCapitals], //5//!
    ["Movies", qb_movie_1.PopularMovies], //6//!
    ["Gaming Systems", qb_gamingSys_1.GamingSystems], //7//!
    ["Science", qb_science_1.BasicScience], //8//!
    ["American History", qb_historybasic_1.BasicHistory], //9//!
    ["Literature", qb_literature_1.BasicLiterature], // 10//!
    ["Travel", qb_travel_1.TravelTrivia], //11//!
    ["Grand Theft Auto", qb_GTA_1.GTA], //12//!
    ["Fashion", qb_fashion_1.FashionTrivia], //13//!
    ["Food", qb_food_1.FoodTrivia], //14//!
    ["Military", qb_military_1.USMilitaryTrivia], //15//!
    ["Human Body", qb_humanBody_1.HumanAnatomyTrivia], //16//!
    ["Anime", qb_anime_1.AnimeTrivia], //17 //!
    ["Mathematics", qb_math_1.MathTrivia], //18
    ["Dragon Ball Z", qb_dragonballz_1.DBZTrivia], //19//!
    ["Business", qb_business_1.BusinessConceptsTrivia], //Stopping Point//20 //!
    ["Marketing", qb_drake_1.Drake], //21
    ["General Knowledge", qb_drake_1.Drake], //22
    ["Engineering", qb_drake_1.Drake], //23
    ["Architecture", qb_drake_1.Drake], //24
    ["Black History", qb_drake_1.Drake], //25
    ["Astronomy", qb_drake_1.Drake], //26
    ["Biology", qb_drake_1.Drake], //27
    ["Marvel", qb_drake_1.Drake], //28
    ["Disney", qb_drake_1.Drake], //29
    ["Geography", qb_drake_1.Drake], //30
    ["Politics", qb_drake_1.Drake], //31
    ["Psychology", qb_drake_1.Drake], //32
    ["Philosophy", qb_drake_1.Drake], //33
    ["Sociology", qb_drake_1.Drake], //34
    ["Anthropology", qb_drake_1.Drake], //35
    ["Culture", qb_drake_1.Drake], // 36
    ["National Parks", qb_drake_1.Drake], //37
    ["Economics", qb_drake_1.Drake], //38
    ["Adventure", qb_drake_1.Drake], //39
    ["Comedy", qb_drake_1.Drake], //40
    ["Drama", qb_drake_1.Drake], //41
    ["Horror", qb_drake_1.Drake], //42
    ["Mystery", qb_drake_1.Drake], //43
    ["Romance", qb_drake_1.Drake], //44
    ["Sci-Fi", qb_drake_1.Drake], //45
    ["Fantasy", qb_drake_1.Drake], //46
    ["Thriller", qb_drake_1.Drake], //47
    ["Animation", qb_drake_1.Drake], //48
    ["Documentary", qb_drake_1.Drake], //49
    ["Classical Music", qb_drake_1.Drake], //50
    ["Rock", qb_drake_1.Drake], //51
    ["Pop", qb_drake_1.Drake], //52
    ["Country", qb_drake_1.Drake], //53
    ["Jazz", qb_drake_1.Drake], //54
    ["Blues", qb_drake_1.Drake], //55
    ["Reggae", qb_drake_1.Drake], //56
    ["Metal", qb_drake_1.Drake], //57
    ["Punk", qb_drake_1.Drake], //58
    ["Rap", qb_drake_1.Drake], //59
    ["Hip Hop", qb_drake_1.Drake], //60
    ["RnB", qb_drake_1.Drake], //61
    ["Social Media", qb_drake_1.Drake], //62
    ["Technology", qb_drake_1.Drake], //63
    ["Video Games", qb_drake_1.Drake], //64
    ["Board Games", qb_drake_1.Drake], //65
    ["Card Games", qb_drake_1.Drake], //66
    ["Sports - General", qb_drake_1.Drake], //67
    ["Basketball", qb_drake_1.Drake], //68
    ["Football", qb_drake_1.Drake], //69
    ["Baseball", qb_drake_1.Drake], //70
    ["Soccer", qb_drake_1.Drake], //71
    ["Hockey", qb_drake_1.Drake], //72
    ["Tennis", qb_drake_1.Drake], //73
    ["Golf", qb_drake_1.Drake], //74
    ["Boxing", qb_drake_1.Drake], //75
    ["2000 Decades", qb_drake_1.Drake], //76
    ["2010 Decades", qb_drake_1.Drake], //77
    ["2020 Decades", qb_drake_1.Drake], //78
    ["90's Decades", qb_drake_1.Drake], //79
    ["80's Decades", qb_drake_1.Drake], //80
    ["70's Decades", qb_drake_1.Drake], //81
    ["60's Decades", qb_drake_1.Drake], //82
    ["50's Decades", qb_drake_1.Drake], //83
    ["40's Decades", qb_drake_1.Drake], //84
    ["30's Decades", qb_drake_1.Drake], //85
    ["20's Decades", qb_drake_1.Drake], //86
    ["Big Box Store", qb_drake_1.Drake], //87
    ["Department Store", qb_drake_1.Drake], //88
    ["Grocery Store", qb_drake_1.Drake], //89
    ["Fast Food", qb_drake_1.Drake], //90
    ["Measurements", qb_drake_1.Drake], //91
    ["Minecraft", qb_drake_1.Drake], //92
    ["Fortnite", qb_drake_1.Drake], //93
    ["Call of Duty", qb_drake_1.Drake], //94
    ["Apex Legends", qb_drake_1.Drake], //95
    ["Overwatch", qb_drake_1.Drake], //96
    ["Rainbow Six Siege", qb_drake_1.Drake], //97
    ["Valorant", qb_drake_1.Drake], //98
    ["League of Legends", qb_drake_1.Drake], //99
    ["Common Misspelling", qb_drake_1.Drake], //100
];
exports.images = [
    960276699258435, //1 Drake
    865408842064760, //2 1990's Hip Hop
    545943014845913, //3 1990's RnB
    516520871372707, //4 Taylor Swift
    939298438099737, //5 State Capitals
    1639263837019592, //6 Movies
    1277622787015688, //7 Gaming Systems
    3878903235730577, //8 Science
    9189340387752308, //9 American History
    972867544680191, //10 Literature
    1277654353571182, //11 Travel
    578191601247496, //12 Grand Theft Auto
    872602555018555, //13 Fashion
    2038659676591073, //14 Food
    946761770680585, //15 Military
    3268959583238475, //16 Human Body
    1120611279395876, //17 Anime
    3958446441099702, //18 Mathematics
    758728733079834, //19 Dragon Ball Z
    1618411399032639, //20 Business
    1185896396383900, //21 Marketing
    1175659910757874, //22 General Knowledge
    1207265264336682, //23 Engineering
    1391350445381848, //24 Architecture
    1334721741101193, //25 Black History
    2665799176955109, //26 Astronomy
    986215460366117, //27 Biology
    2353989504967932, //28 Marvel,
    1866888400751237, //29 Dinsey
    664231372634473, //30 Geography
    2849280195245904, //31 Politics
    2606404739554004, //32 Psychology
    463442060093468, //33 Philosophy
    1288315488919591, //34 Sociology
    667471272591531, //35 Anthropology
    939633238025281, //36 Culture
    524621494034215, //37 National Parks
    933973578632775, //38 Economics
    843076897980384, //39 Adventure
    1207025887676246, //40 Comedy
    2325821327802841, //41 Drama
    1342183170164059, //42 Horror
    2113898222461379, //43 Mystery
    1653372195315110, //44 Romance
    948035670480818, //45 Sci-Fi
    663283286076052, //46 Fantasy
    2335212270187783, //47 Thriller
    628447066481071, //48 Animation
    997506302334197, //49 Documentary
    2457777904567909, //50 Classical Music
    9087020524760210, //51 Rock
    664622622634629, //52 Pop
    583543004730294, //53 Country
    1473175480336679, //54 Jazz
    842921884658571, //55 Blues
    505963612569570, //56 Reggae
    663204259593721, //57 Metal
    9263965930338831, //58 Punk
    620511360887439, //59 Rap
    962068799452036, //60 Hip Hop
    1168962448071124, //61 RnB
    1329603058253704, //62 Social Media
    1376739080192919, //63 Technology
    2258868997842563, //64 Video Games
    650462147701633, //65 Board Games
    886178106885126, //66 Card Games
    632198113303816, //67 Sports
    1374642127024547, //68 Basketball
    534736396322302, //69 Football
    640725555339703, //70 Baseball
    638370008825557, //71 Soccer
    9399648296786893, //72 Hockey
    1648312422492380, //73 Tennis
    663503919563381, //74 Golf
    1369945647330388, //75 Boxing
    1373790620178475, //76 2000 Decades
    2354942018207081, //77 2010 Decades
    1164211042002110, //78 2020 Decades
    620104267481188, //79 90's Decades
    1637685060959341, //80 80's Decades
    631869636439063, //81 70's Decades
    1159331912058136, //82 60's Decades
    986491183138133, //83 50's Decades
    1171510371133499, //84 40's Decades
    658997219949936, //85 30's Decades
    1187233512937584, //86 20's Decades
    663407649407157, //87 Big Box Store
    999021798855993, //88 Department Store
    1990352651488239, //89 Grocery Store
    1166940198262000, //90 Fast Food
    1372882247474537, //91 Measurements
    988351919581684, //92 Minecraft
    1824512038363295, //93 Fortnite
    648020707830348, //94 Call of Duty
    930225029187550, //95 Apex Legends
    4027161080897102, //96 Overwatch
    1036108418381844, //97 Rainbow Six Siege
    997560361882716, //98 Valorant
    1243504604115062, //99 League of Legends
    991002279763494, //100 Common Misspellings
];
