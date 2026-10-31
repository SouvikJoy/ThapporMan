// Excuse, crowd comeback and the next morning's headline, in mission order.
export const comedy = [
 ['ভাই, গুগল ম্যাপই উল্টা দেখাইছে!','ম্যাপ ঠিক আছে, চালক আপডেট লাগে!','LOCAL RIDER DISCOVERS ROADS HAVE DIRECTIONS'],
 ['ফল না ভাই, অমরত্ব বিক্রি করি!','আম কিনতে আসছি, মমি না!','MANGOES FINALLY ALLOWED TO AGE NATURALLY'],
 ['সিঁড়ি উঠলে আমার স্টেপ কাউন্ট শেষ!','ফিটনেস অ্যাপও লজ্জা পাইছে!','LOCAL MAN MEETS STAIRS; BOTH SURVIVE'],
 ['আমি তো গান প্র্যাকটিস করতেছিলাম!','অডিশন শেষ। বাসায় যান!','UNSOLICITED STREET CONCERT CANCELLED'],
 ['চা ছাড়া ফাইল নড়ে না ভাই!','ফাইলের ক্যাফেইন আসক্তি ছাড়ান!','OFFICE FILE MOVES WITHOUT TEA MONEY'],
 ['এটা চাঁদা না, পাড়া সাবস্ক্রিপশন!','আনসাবস্ক্রাইব বাটন পাওয়া গেছে!','NEIGHBORHOOD CANCELS UNWANTED SUBSCRIPTION'],
 ['হর্ন দিলে জ্যাম ভয় পায়!','জ্যাম তো বধির, আমরা না!','DRIVER DISCOVERS SILENT MODE'],
 ['ব্যাগটা নিজেই আমার হাতে আসছে!','তাইলে নিজেই ফেরত যাক!','BAG ENDS UNPLANNED SIGHTSEEING TOUR'],
 ['ময়লাটা বাতাসে উড়ে গেছে!','বাতাস না, অজুহাত উড়তেছে!','CHIPS PACKET REUNITED WITH ITS BIN'],
 ['বাইকও তো দুই পায়ে চলে!','তাই বলে হাঁটার ক্লাসে ভর্তি হবে?','MOTORBIKE REJECTED FROM WALKING CLUB'],
 ['আমি লাইনের প্রিমিয়াম মেম্বার!','আজকে সবার প্যাকেজ একই!','QUEUE JUMPER DOWNGRADED TO REGULAR HUMAN'],
 ['আমার কেজি একটু স্লিম ফিট!','ওজনেরও ডায়েট শুরু হইছে নাকি?','ONE KILOGRAM REGAINS ITS MISSING GRAMS'],
 ['তারিখ পুরান, অনুভূতি একদম ফ্রেশ!','বিস্কুটের জন্মদিন পালন করেন!','BISCUITS RETIRE AFTER LONG CAREER'],
 ['এই রংটা খাবারের মেকআপ!','বিরিয়ানির বিউটি পার্লার বন্ধ!','CURRY WINS BEST NATURAL LOOK'],
 ['ভাড়া বাড়ে, আবেগ বাড়ে!','মিটার চলে না, কবিতা চলে!','FARE RETURNS FROM IMAGINARY INFLATION'],
 ['মানিব্যাগের সিকিউরিটি চেক করছিলাম!','সিকিউরিটি গার্ড এখন নিজেই ধরা!','WALLET DECLINES SURPRISE OWNERSHIP TRANSFER'],
 ['আমারও খুব ইমার্জেন্সি—চা ঠান্ডা হবে!','চা অপেক্ষা করবে, জীবন না!','TEA CAN WAIT: AMBULANCE GETS PRIORITY'],
 ['দুই মিনিটের জন্য রাখছি!','আপনার দুই মিনিটে যুগ বদলায়!','TWO-MINUTE PARKING ENDS AFTER HISTORIC ERA'],
 ['আমি শুধু কলারটা ঠিক করছিলাম!','দর্জির দোকান ওইদিকে!','SELF-APPOINTED COLLAR INSPECTOR RESIGNS'],
 ['ফুটপাতটা আমার দোকানের বারান্দা!','তাইলে রাস্তা কি আপনার ড্রয়িংরুম?','FOOTPATH RETURNS TO ITS WALKING CAREER'],
];
export const missLines=['হাওয়ার সাথে ঝগড়া কইরা লাভ নাই!','মশাটা বাঁচল। আবার চেষ্টা করেন!','ওটা ছিল ওয়ার্ম-আপ। তাই না?'];
export const hitWords=['THAPPOR!','THASH!','DHISHOOM!'];

export function award({badges,perfects,lives}) {
 if(badges===3&&perfects===3)return ['NEIGHBORHOOD LEGEND','Three badges. Three perfect hits. Even the tea stall is talking about you.'];
 if(perfects===3)return ['PALM PROFESSOR','Three perfect hits. Your hand deserves its own certificate.'];
 if(badges===3)return ['PARAR CELEBRITY','You explored every corner. The neighborhood knows your name.'];
 if(lives===3)return ['NO-NONSENSE HERO','Not a single miss. The excuses never stood a chance.'];
 return ['COMEBACK CHAMP','A little practice, a lot of attitude. Job done.'];
}
