/* ------------------------------ Includes && Options ------------------------------ */
var exec = require('child_process').exec;

var _entities = {
    "&#x202a;": "wug",
    "&#x202c;": "wug",
    "&nbsp;": " ",
    "&iexcl;": "¡",
    "&cent;": "¢",
    "&pound;": "£",
    "&curren;": "¤",
    "&yen;": "¥",
    "&brvbar;": "¦",
    "&sect;": "§",
    "&uml;": "¨",
    "&copy;": "©",
    "&ordf;": "ª",
    "&laquo;": "«",
    "&not;": "¬",
    "&shy;": "",
    "&reg;": "®",
    "&macr;": "¯",
    "&deg;": "°",
    "&plusmn;": "±",
    "&sup2;": "²",
    "&sup3;": "³",
    "&acute;": "´",
    "&micro;": "µ",
    "&para;": "¶",
    "&middot;": "·",
    "&cedil;": "¸",
    "&sup1;": "¹",
    "&ordm;": "º",
    "&raquo;": "»",
    "&frac14;": "¼",
    "&frac12;": "½",
    "&frac34;": "¾",
    "&iquest;": "¿",
    "&Agrave;": "À",
    "&Aacute;": "Á",
    "&Acirc;": "Â",
    "&Atilde;": "Ã",
    "&Auml;": "Ä",
    "&Aring;": "Å",
    "&AElig;": "Æ",
    "&Ccedil;": "Ç",
    "&Egrave;": "È",
    "&Eacute;": "É",
    "&Ecirc;": "Ê",
    "&Euml;": "Ë",
    "&Igrave;": "Ì",
    "&Iacute;": "Í",
    "&Icirc;": "Î",
    "&Iuml;": "Ï",
    "&ETH;": "Ð",
    "&Ntilde;": "Ñ",
    "&Ograve;": "Ò",
    "&Oacute;": "Ó",
    "&Ocirc;": "Ô",
    "&Otilde;": "Õ",
    "&Ouml;": "Ö",
    "&times;": "×",
    "&Oslash;": "Ø",
    "&Ugrave;": "Ù",
    "&Uacute;": "Ú",
    "&Ucirc;": "Û",
    "&Uuml;": "Ü",
    "&Yacute;": "Ý",
    "&THORN;": "Þ",
    "&szlig;": "ß",
    "&agrave;": "à",
    "&aacute;": "á",
    "&acirc;": "â",
    "&atilde;": "ã",
    "&auml;": "ä",
    "&aring;": "å",
    "&aelig;": "æ",
    "&ccedil;": "ç",
    "&egrave;": "è",
    "&eacute;": "é",
    "&ecirc;": "ê",
    "&euml;": "ë",
    "&igrave;": "ì",
    "&iacute;": "í",
    "&icirc;": "î",
    "&iuml;": "ï",
    "&eth;": "ð",
    "&ntilde;": "ñ",
    "&ograve;": "ò",
    "&oacute;": "ó",
    "&ocirc;": "ô",
    "&otilde;": "õ",
    "&ouml;": "ö",
    "&divide;": "÷",
    "&oslash;": "ø",
    "&ugrave;": "ù",
    "&uacute;": "ú",
    "&ucirc;": "û",
    "&uuml;": "ü",
    "&yacute;": "ý",
    "&thorn;": "þ",
    "&yuml;": "ÿ",
    "&fnof;": "ƒ",
    "&Alpha;": "Α",
    "&Beta;": "Β",
    "&Gamma;": "Γ",
    "&Delta;": "Δ",
    "&Epsilon;": "Ε",
    "&Zeta;": "Ζ",
    "&Eta;": "Η",
    "&Theta;": "Θ",
    "&Iota;": "Ι",
    "&Kappa;": "Κ",
    "&Lambda;": "Λ",
    "&Mu;": "Μ",
    "&Nu;": "Ν",
    "&Xi;": "Ξ",
    "&Omicron;": "Ο",
    "&Pi;": "Π",
    "&Rho;": "Ρ",
    "&Sigma;": "Σ",
    "&Tau;": "Τ",
    "&Upsilon;": "Υ",
    "&Phi;": "Φ",
    "&Chi;": "Χ",
    "&Psi;": "Ψ",
    "&Omega;": "Ω",
    "&alpha;": "α",
    "&beta;": "β",
    "&gamma;": "γ",
    "&delta;": "δ",
    "&epsilon;": "ε",
    "&zeta;": "ζ",
    "&eta;": "η",
    "&theta;": "θ",
    "&iota;": "ι",
    "&kappa;": "κ",
    "&lambda;": "λ",
    "&mu;": "μ",
    "&nu;": "ν",
    "&xi;": "ξ",
    "&omicron;": "ο",
    "&pi;": "π",
    "&rho;": "ρ",
    "&sigmaf;": "ς",
    "&sigma;": "σ",
    "&tau;": "τ",
    "&upsilon;": "υ",
    "&phi;": "φ",
    "&chi;": "χ",
    "&psi;": "ψ",
    "&omega;": "ω",
    "&thetasym;": "ϑ",
    "&upsih;": "ϒ",
    "&piv;": "ϖ",
    "&bull;": "•",
    "&hellip;": "…",
    "&prime;": "′",
    "&Prime;": "″",
    "&oline;": "‾",
    "&frasl;": "⁄",
    "&weierp;": "℘",
    "&image;": "ℑ",
    "&real;": "ℜ",
    "&trade;": "™",
    "&alefsym;": "ℵ",
    "&larr;": "←",
    "&uarr;": "↑",
    "&rarr;": "→",
    "&darr;": "↓",
    "&harr;": "↔",
    "&crarr;": "↵",
    "&lArr;": "⇐",
    "&uArr;": "⇑",
    "&rArr;": "⇒",
    "&dArr;": "⇓",
    "&hArr;": "⇔",
    "&forall;": "∀",
    "&part;": "∂",
    "&exist;": "∃",
    "&empty;": "∅",
    "&nabla;": "∇",
    "&isin;": "∈",
    "&notin;": "∉",
    "&ni;": "∋",
    "&prod;": "∏",
    "&sum;": "∑",
    "&minus;": "−",
    "&lowast;": "∗",
    "&radic;": "√",
    "&prop;": "∝",
    "&infin;": "∞",
    "&ang;": "∠",
    "&and;": "∧",
    "&or;": "∨",
    "&cap;": "∩",
    "&cup;": "∪",
    "&int;": "∫",
    "&there4;": "∴",
    "&sim;": "∼",
    "&cong;": "≅",
    "&asymp;": "≈",
    "&ne;": "≠",
    "&equiv;": "≡",
    "&le;": "≤",
    "&ge;": "≥",
    "&sub;": "⊂",
    "&sup;": "⊃",
    "&nsub;": "⊄",
    "&sube;": "⊆",
    "&supe;": "⊇",
    "&oplus;": "⊕",
    "&otimes;": "⊗",
    "&perp;": "⊥",
    "&sdot;": "⋅",
    "&lceil;": "⌈",
    "&rceil;": "⌉",
    "&lfloor;": "⌊",
    "&rfloor;": "⌋",
    "&lang;": "〈",
    "&rang;": "〉",
    "&loz;": "◊",
    "&spades;": "♠",
    "&clubs;": "♣",
    "&hearts;": "♥",
    "&diams;": "♦",
    "&quot;": "\"",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&OElig;": "Œ",
    "&oelig;": "œ",
    "&Scaron;": "Š",
    "&scaron;": "š",
    "&Yuml;": "Ÿ",
    "&circ;": "ˆ",
    "&tilde;": "˜",
    "&ensp;": " ",
    "&emsp;": " ",
    "&thinsp;": " ",
    "&zwnj;": "‌",
    "&zwj;": "‍",
    "&lrm;": "‎",
    "&rlm;": " ",
    //"&rlm;": "‏",
    "&ndash;": "–",
    "&mdash;": "—",
    "&lsquo;": "‘",
    "&rsquo;": "’",
    "&sbquo;": "‚",
    "&ldquo;": "“",
    "&rdquo;": "”",
    "&bdquo;": "„",
    "&dagger;": "†",
    "&Dagger;": "‡",
    "&permil;": "‰",
    "&lsaquo;": "‹",
    "&rsaquo;": "›",
    "&euro;": "€",
};

function unescape_entity(input) {
    if (input.charAt(1) === '#') {
        return String.fromCharCode(parseInt(input.substr(2), 10));

    } else if (_entities.hasOwnProperty(input)) {
        return _entities[input];

    } else {
        return null;
    }
}

function unescape2(input) {
    input = input.replace('&#x202a;', '').replace('&#x202c;', '')
    var entityRe = /&(#?)(\d{1,5}|\w{1,8});/gm;
    return input.replace(entityRe, unescape_entity);
}

/* ------------------------------ Google ------------------------------ */
function Utils() {

    //var trimLeft = /^\s+/, trimRight = /\s+$/, multipleSpaces = /\s\s+/g;

    var trimLeft = /^\s+/, trimRight = /\s+$/, multipleSpaces = /\s\s+/g;

    function clean( input ) {
	//return input.replace(/[\n\r]/g, '').replace(trimLeft,'').replace(trimRight,'').replace(multipleSpaces, ' ')
	return unescape2( input.replace(/[\n\r]/g, '').replace(trimLeft,'').replace(trimRight,'').replace(multipleSpaces, ' ') )
    }

    this.ddg = function( query, hollaback ) {
	exec("curl -e 'http://medero.org/' 'http://api.duckduckgo.com/?o=json&q=" + escape(query) + "'", function (err, stdout, stderr) {
	  hollaback.call(this, JSON.parse(stdout)["Results"]);
	});
    }

    this.title = function( url, hollaback ) {
	exec("curl -e 'http://medero.org/' " + url, function (err, stdout, stderr) { var re = /<title>([^>]*)<\/title>/i , title = stdout.match( re ); hollaback.call(this, (title?clean(title[1]):false));
	  //hollaback.call(this, stdout.slice(20));
	});
    }

  this.search = function(query, hollaback) {
    exec("curl -e 'http://gf3.ca' 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=" + escape(query) + "'", function (err, stdout, stderr) {
      hollaback.call(this, JSON.parse(stdout)["responseData"]["results"]);
    });
  };

  this.imdb = function(query, hollaback) {
    exec("curl -e 'http://medero.org' 'http://www.imdbapi.com/?t=" + escape(query) + "'", function (err, stdout, stderr) {
      hollaback.call(this, JSON.parse(stdout));
    });
  };
}

/* ------------------------------ Export ------------------------------ */
module.exports = Utils;
