let stopwordArr = getStopWords();
var Tmp_Kwrd_Arr, Tmp_Arr, Loc_Arr, Tmp_Str;

function getStopWords() {
    var stopwords = "guaranteed|100% garunteed|100 garunteed|100% guaranteed|100 guaranteed|100% Job Assistance|100 Job Assistance|Account no|Account number|Amount|Application fee|Arsehole|Ass|Ass fuck|Ass hole|Asshole|Attractive discounts|Auctus|Bastard|Bescumber|Bimbo|Bitch|Bomb blast|Boobs|Breast|Blow|Bullshit|Butt|By Industry Professionals|Certification Program|Certification Programme|Charges|Coccydynia|Cock|Cocksucker|Complimentary cover letter|Congratulations|Costs|Courses we offer|Criminal|Cunt|Dag|Degree Program|Degree Programme|Deposit cash|Deposit the cash|Detailed resume critique|Dick|Discount|Discover a bright future in ERP|Donkey|Dope|Dork|Early Bird Offer|Economy Pack|Electronic mail award promotion|Express Resume|Facial|Fart|FESTIVAL OFFER|For admission|For Enquiries|For Enquiries and Registration|For Registration|Freak|Free|Free Class|Free Demo|Free Demo Class|Free registration|Frenchify|Fuck|Fucking|Fucker|Fuckhole|Full Payment|Funds to an account|Gangbang|Garunteed placement|Gasbag|Get Certified|Get Trained|Get Trained Certified & Placed !|Goose|Guarantee|Guaranteed placement|Guaranty|High Paying|I luv You|Illegal|In favor of|In favour of|Interview knowhows|Jackpot lottery|Jerk|Job opportunities|LIC of India|Lick|Lottery|LOTTERY DRAW|Lotto|Loudmouth|Lucky winners|Microphallus|Mothafucka|Motherfucker|Murder|Murderer|New Batch|New Batches|NEW BATCHES STARTING|Nigerian local office|Nigga|Nigger|Nominated bank account|Nonsense|Nut|Offer letter|Opportunities!!!!!!!!!|Opportunity!!!|Paedophile|Participate as an investor|Partner naukri.com|Payment|Penis|Placement assistance|Porn|Premium Resume Development|Privately looking|Pussy|Pyt|Rape|Rapist|Redneck|Refugee camp|Refundable|Replacement Clause|Resume Critique|Resume Development|Resume Flash|Scam|Scholarship|Scum|Scumbag|Sex|Shit|Sicko|Skill oriented course|Smartass|Start-Up Kit|Student visa|Suck|Through Industry Professionals|Tight ass|Tits|Training Cum Placement|Turd|Twat|Twerp|Twit|Urgent Attention|Valid till|Value Pack|We charge|Will of god|Winning|Wish to invite|Wog|Wop|WORLDWIDE OPPORTUNITIES|Yid|Yob|You are a winner|sexual harassment|terror|terrorist|anus|assclown|asses|ass-hole|assbanger|assbite|asshead|asswipe|boob| bar girl|bar girls|bitchy|bisexual|sexual|blowjob|blowjobs|bollocks|call girl|call girls|cunnilingus|cuntface|cuntass|cum|dickbag|dickfuck|dickfucker|dickhead|dickjuice|dickweed|dumass|fag|faggot| female escort|fellatio|fuckbutt|fuckhead|fuckup|gay|gayass|gayfuck|gringo|guido| gooch|handjob|homo|hump|homosexual|homo|hot mms|humping|hell|hoe|ho|jackass|jagoff|jap|jizz|jerkoff|kyke|kraut|kunt|lesbian|lesbo|lezzie|muthafucka|male escort|motherfucking| nude|nude jobs|nude girl|nude girls|nude party girls|nude party girl|negro|nutsack|paki|pecker| party girls|party girl|piss|poontang|pedophile|pedo|prostitute|puta|queef|queer|schlong|shitass|shitbrains|shitter|shitting|suckass|titfuck|titty|titties|twat|vag|vagina|vajayjay|wank|whore|whorebag|whoreface|whores|xxx|xxxgirls|xxx girls|gigolo|prostitution|terrorism|sexy|nude boy|nude boys|nude party boys|nude party boy|premium|cheat|job";

    var stopwordArr = stopwords.split("|");

    return stopwordArr;
}

function replaceAll(txt, replace, with_this) {
    return txt.replace(new RegExp(replace, 'gi'), with_this);
}

export default function generateStaticURL(h, g) {
    var j = "";
    var k = "";
    var c = "";
    var d = {
        "+": " plus ",
        "#": " sharp ",
        ".": " dot ",
        "-": " ",
        '"': " ",
        "'": " ",
        "/": " "
    };
    if (h) {
        h = h.toLowerCase().replace(/\s{2,}/g, " ").replace(/\bjobs in\b/gi, "").replace(/\bjobs\b/gi, "").replace(/\blimited\b/gi, "").replace(/\bcorporation\b/gi, "").replace(/\bcareers\b/gi, "");
        while (h.indexOf("c++ c++") != -1) {
            h = h.replace("c++ c++", "c++")
        }
        for (var e = 0; e < stopwordArr.length; e++) {
            h = replaceAll(h, "\\b" + stopwordArr[e].toLowerCase() + "\\b", "")
        }
        h = replaceAll(h, ",", " ");
        h = h.replace(/[^.+#\-'" a-zA-Z0-9]/ig, " ").replace(/and {1,}$/g, "");
        var b = $.trim(h).toLowerCase();
        Tmp_Kwrd_Arr = b.split(",");
        for (var e = 0; e < Tmp_Kwrd_Arr.length; e++) {
            for (var key in d) {
                Tmp_Kwrd_Arr[e] = replaceAll(Tmp_Kwrd_Arr[e], "\\" + key, d[key])
            }
            Tmp_Kwrd_Arr[e] = $.trim(replaceAll(Tmp_Kwrd_Arr[e], "  ", " "));
            Tmp_Arr = Tmp_Kwrd_Arr[e].split(" ")
        }
        j = Tmp_Kwrd_Arr.join(" ")
    }
    if (g) {
        g = g.replace(/\bjobs in\b/gi, "").replace(/\bjobs\b/gi, "").split("\\").join(" ").split("/").join(" ").replace(/[^, a-zA-Z]/ig, "").replace(/,{1,}$/g, "");
        g = replaceAll($.trim(g).toLowerCase(), "  ", " ");
        for (var e = 0; e < stopwordArr.length; e++) {
            g = replaceAll(g, "\\b" + stopwordArr[e].toLowerCase() + "\\b", "")
        }
        Loc_Arr = g.split(",");
        Tmp_Str = Loc_Arr.join(" and ");
        Tmp_Arr = Tmp_Str.split(" ");
        k = Tmp_Arr.join(" ")
    }
    if (j == "" && k != "") {
        c = c + "jobs in " + k
    } else {
        if (j != "" && k == "") {
            c = c + j + " jobs"
        } else {
            if (j != "" && k != "") {
                c = c + j + " jobs in " + k
            }
        }
    }
    c = c.replace(/[\s]*plus[\s]+(plus[\s]*)+/gi, " + ").replace(/-/g, " ").replace(/\s{2,}/g, " ");
    do {
        var f = c;
        var c = f.replace(/\s(\w+\s)\1/, " $1");
        c = c.replace(/^(\w+\s)\1/, "$1").replace(/(\s\w+)\1$/, "$1")
    } while (c.length != f.length);
    while (c.indexOf(" + ") != -1) {
        c = c.replace(" + ", " plus plus ")
    }
    c = $.trim(c).replace(/\s/g, "-");
    if (c == "") {
        c = "jobs-in-india"
    }
    return c
}
