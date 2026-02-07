const tree = {
  s1: {
    text: "Beslisboom aanvraag zelfbeheer van het groen in het Kleiwegkwartier.",
    options: [
      { label: "Volgende", next: "s2" }
    ]
  },

  s2: {
    text: "Uitleg van het stappenplan voor het aanvragen van zelfbeheer van openbaar groen.",
    options: [
      { label: "Volgende", next: "s3" },
      { label: "Eigen tuin vergroenen", next: "s96" }
    ]
  },

  s3: {
    text: "Overzicht van de tijdlijn van het stappenplan.",
    options: [
      { label: "Start stappenplan", next: "s4" }
    ]
  },

  s4: {
    text: "Wilt u een stuk openbaar groen in het Kleiwegkwartier zelf beheren?",
    options: [
      { label: "Ja", next: "s5" },
      { label: "Nee, maar ik blijf actief in de wijk", next: "s93" },
      { label: "Eigen tuin vergroenen", next: "s96" }
    ]
  },

  s5: {
    text: "Wilt u een geveltuin aanleggen en in zelfbeheer nemen?",
    options: [
      { label: "Ja", next: "s7" },
      { label: "Nee, ander groen", next: "s6" }
    ]
  },

  s6: {
    text: "U wilt ander openbaar groen beheren dan een geveltuin.",
    options: [
      { label: "Verder", next: "s8" }
    ]
  },

  // … (nodes s7 through s95 continue in the same pattern)

  s93: {
    text: "U wilt geen openbaar groen beheren, maar wel betrokken blijven bij de wijk.",
    result: true
  },

  s96: {
    text: "Informatie over het vergroenen en onderhouden van uw eigen tuin.",
    result: true
  }
};
