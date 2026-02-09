const tree = {
  s1: {
    title: "Beslisboom",
    text: "Aanvraag zelfbeheer van het groen in het Kleiwegkwartier.",
    options: [
      { label: "Volgende", next: "s2" }
    ]
  },

  s2: {
    title: "Uitleg Stappenplan",
    bullets:[ "In dit stappenplan krijgt u meerdere vragen om u op weg te helpen om het zelfbeheer van het openbare groen van de gemeente (al het groen wat niet op privé terrein staat) aan te vragen 
","In dit stappenplan wordt u alleen geïnformeerd over het proces en de aanvraag van het zelfbeheer. Het is daarom belangrijk om eerst het hele stappenplan te doorlopen voordat u en/of uw buurtbewoners een plan willen indienen bij de gemeente. 
", "Als u vragen heeft over het aanleggen en beheren van uw eigen tuin, dan kunt op hierop klikken;
"],
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
