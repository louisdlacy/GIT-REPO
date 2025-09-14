import { Dbentry } from "gameManager";
import { NinetiesHipHop } from "qb_1990HipHop";
import { Drake } from "qb_drake";
import { NinetiesRnB } from "qb_1990RnB";
import { AnimeTrivia } from "qb_anime";
import { BusinessConceptsTrivia } from "qb_business";
import { DBZTrivia } from "qb_dragonballz";
import { FashionTrivia } from "qb_fashion";
import { FoodTrivia } from "qb_food";
import { GamingSystems } from "qb_gamingSys";
import { GTA } from "qb_GTA";
import { BasicHistory } from "qb_historybasic";
import { HumanAnatomyTrivia } from "qb_humanBody";
import { BasicLiterature } from "qb_literature";
import { USMilitaryTrivia } from "qb_military";
import { BasicScience } from "qb_science";
import { StateCapitals } from "qb_statesCapitals";
import { TaylorSwiftTrivia } from "qb_taylorSwift";
import { TravelTrivia } from "qb_travel";
import { MathTrivia } from "qb_math";
import { PopularMovies } from "qb_movie";

export function seededRandom(seed: number): number {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
}

export const categories: [string, Dbentry[]][] = [
    ["Drake", Drake], //1
    ["1990's Hip Hop", NinetiesHipHop], //2//!
    ["1990's RnB", NinetiesRnB], //3//!
    ["Taylor Swift", TaylorSwiftTrivia], //4//!
    ["State Capitals", StateCapitals], //5//!
    ["Movies", PopularMovies], //6//!
    ["Gaming Systems", GamingSystems], //7//!
    ["Science", BasicScience], //8//!
    ["American History", BasicHistory], //9//!
    ["Literature", BasicLiterature], // 10//!
    ["Travel", TravelTrivia], //11//!
    ["Grand Theft Auto", GTA], //12//!
    ["Fashion", FashionTrivia], //13//!
    ["Food", FoodTrivia], //14//!
    ["Military", USMilitaryTrivia], //15//!
    ["Human Body", HumanAnatomyTrivia], //16//!
    ["Anime", AnimeTrivia], //17 //!
    ["Mathematics", MathTrivia], //18
    ["Dragon Ball Z", DBZTrivia], //19//!
    ["Business", BusinessConceptsTrivia], //Stopping Point//20 //!
    ["Marketing", Drake], //21
    ["General Knowledge", Drake], //22
    ["Engineering", Drake], //23
    ["Architecture", Drake], //24
    ["Black History", Drake], //25
    ["Astronomy", Drake], //26
    ["Biology", Drake], //27
    ["Marvel", Drake], //28
    ["Disney", Drake], //29
    ["Geography", Drake], //30
    ["Politics", Drake], //31
    ["Psychology", Drake], //32
    ["Philosophy", Drake], //33
    ["Sociology", Drake], //34
    ["Anthropology", Drake], //35
    ["Culture", Drake], // 36
    ["National Parks", Drake], //37
    ["Economics", Drake], //38
    ["Adventure", Drake], //39
    ["Comedy", Drake], //40
    ["Drama", Drake], //41
    ["Horror", Drake], //42
    ["Mystery", Drake], //43
    ["Romance", Drake], //44
    ["Sci-Fi", Drake], //45
    ["Fantasy", Drake], //46
    ["Thriller", Drake], //47
    ["Animation", Drake], //48
    ["Documentary", Drake], //49
    ["Classical Music", Drake], //50
    ["Rock", Drake], //51
    ["Pop", Drake], //52
    ["Country", Drake], //53
    ["Jazz", Drake], //54
    ["Blues", Drake], //55
    ["Reggae", Drake], //56
    ["Metal", Drake], //57
    ["Punk", Drake], //58
    ["Rap", Drake], //59
    ["Hip Hop", Drake], //60
    ["RnB", Drake], //61
    ["Social Media", Drake], //62
    ["Technology", Drake], //63
    ["Video Games", Drake], //64
    ["Board Games", Drake], //65
    ["Card Games", Drake], //66
    ["Sports - General", Drake], //67
    ["Basketball", Drake], //68
    ["Football", Drake], //69
    ["Baseball", Drake], //70
    ["Soccer", Drake], //71
    ["Hockey", Drake], //72
    ["Tennis", Drake], //73
    ["Golf", Drake], //74
    ["Boxing", Drake], //75
    ["2000 Decades", Drake], //76
    ["2010 Decades", Drake], //77
    ["2020 Decades", Drake], //78
    ["90's Decades", Drake], //79
    ["80's Decades", Drake], //80
    ["70's Decades", Drake], //81
    ["60's Decades", Drake], //82
    ["50's Decades", Drake], //83
    ["40's Decades", Drake], //84
    ["30's Decades", Drake], //85
    ["20's Decades", Drake], //86
    ["Big Box Store", Drake], //87
    ["Department Store", Drake], //88
    ["Grocery Store", Drake], //89
    ["Fast Food", Drake], //90
    ["Measurements", Drake], //91
    ["Minecraft", Drake], //92
    ["Fortnite", Drake], //93
    ["Call of Duty", Drake], //94
    ["Apex Legends", Drake], //95
    ["Overwatch", Drake], //96
    ["Rainbow Six Siege", Drake], //97
    ["Valorant", Drake], //98
    ["League of Legends", Drake], //99
    ["Common Misspelling", Drake], //100
];

export const images = [
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
