export const belegKeyMapping = {
	id: {
        label: "DBOE-ID",
        modify: false,
        description: "DBÖ-ID"
    },
	hl: {
        label: "HL",
        modify: true,
        description: "Hauptlemma"
    },
	nl: {
        label: "NL",
        modify: true,
        description: "Nebenlemma"
    },
	qu:{
        label: "QU",
        modify: true,
        description: "Quelle"
    },
	bibl: {
        label: "BIBL",
        modify: true,
        description: "Bibliographie"
    },
	pos: {
        label: "POS",
        modify: true,
        description: "Part of speech tag",
        choice_values: ["Subst", "Interj", "Verb", "Adj"],
    },
	archivzeile: {
        label: "Archiv",
        modify: false,
        description: "Arichvzeile",
        choice_values: ["Subst", "Interj", "Verb", "Adj"],
    },
	bd_lt_star: {
        label: "BD/LT*",
        modify: true,
        description: "Bedeutung/Lautung",
        endpoint: "api/bedeutungen/?beleg=",
    }
};

export const colKeys = Object.keys(belegKeyMapping);

