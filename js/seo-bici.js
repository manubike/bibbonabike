/* ==========================================================================
   FILE ESTERNO: js/seo-bici.js
   Gestisce Keywords estese e Dati Strutturati JSON-LD (BikeStore)
   preservando titolo e descrizione specifici di ciascuna pagina HTML.
   ========================================================================== */

(function () {
  const SITE_CONFIG = {
    name: "Magona Bike Garage - Val di Cecina Biking",
    url: "https://www.bibbonabike.com/",
    image: "https://bibbonabike.com/img/Magona_Bike_preview.png",
    locale: "it_IT",
    defaultTitle: "Magona Bike Garage – BibbonaBike",
    defaultDescription:
      "Officina specializzata bici ed e-bike, noleggio, tour guidati, ricambi e accessori a Bibbona (Val di Cecina, Costa degli Etruschi). Assistenza motori Bosch, Shimano, Brose, Yamaha, TQ, Mahle, Bafang e sospensioni RockShox e Fox.",
    injectJsonLdAtBottomOfBody: true
  };

  const CATEGORIES_AND_TERMS = [
    "biciclette", "bici", "e-bike", "ebike", "bici elettriche", "bici muscolari",
    "MTB", "mountain bike", "e-MTB", "mountain bike elettrica",
    "cross country", "XC", "trail", "all mountain", "enduro", "downhill", "DH",
    "dirt jump", "fat bike", "hardtail", "full suspended", "biammortizzata", "front suspended",
    "bici da corsa", "BDC", "road bike", "e-road", "bici da corsa elettrica",
    "bici aero", "endurance", "cronometro", "triathlon", "scatto fisso", "fixed", "pista",
    "bici gravel", "e-gravel", "gravel elettrica", "ciclocross", "CX",
    "bikepacking", "touring", "bici da viaggio",
    "city bike", "e-city", "trekking bike", "e-trekking",
    "bici pieghevoli", "folding bike", "cargo bike", "e-cargo", "bici bambini",
    "ricambi bici", "componenti ciclismo", "gruppi trasmissione", "cambio elettronico",
    "deragliatore", "pacco pignoni", "catena", "guarnitura", "movimento centrale",
    "freni a disco idraulici", "pastiglie freni", "dischi freno", "manubrio",
    "attacco manubrio", "reggisella", "telescopico", "dropper post", "sella", "pedali",
    "ruote carbonio", "ruote alluminio", "cerchi", "mozzi", "raggi",
    "copertoni", "tubeless", "camere d'aria", "lattice",
    "forcelle ammortizzate", "ammortizzatori posteriori", "serie sterzo",
    "accessori ciclismo", "caschi bici", "scarpe ciclismo", "abbigliamento ciclismo",
    "occhiali bici", "ciclocomputer GPS", "rulli smart", "luci bici", "lucchetti",
    "borse bikepacking", "portaborracce",
    "officina bici Bibbona", "noleggio e-bike Bibbona", "tour MTB Val di Cecina",
    "assistenza e-bike Costa degli Etruschi", "revisione sospensioni MTB",
    "Macchia della Magona Trail Area"
  ];

  const BIKE_BRANDS = [
    "Specialized", "Trek", "Giant", "Scott", "Cannondale", "Bianchi", "Pinarello",
    "Colnago", "Wilier Triestina", "De Rosa", "Cinelli", "Basso", "Cipollini",
    "Bottecchia", "Olmo", "Atala", "Whistle", "Olympia", "Torpado", "Lee Cougan",
    "Titici", "3T", "Factor", "Cervélo", "BMC", "Orbea", "BH Bikes", "Mondraker",
    "Merida", "Cube", "Canyon", "Rose", "Focus", "Ghost", "Haibike", "Kalkhoff",
    "Riese & Müller", "Bergamont", "Lapierre", "Look", "Time", "Moustache", "Sunn",
    "Commencal", "Santa Cruz", "Yeti Cycles", "Pivot", "Kona", "Norco",
    "Rocky Mountain", "Marin", "Ibis", "Transition", "Evil", "Intense", "Niner",
    "GT Bicycles", "Mongoose", "Schwinn", "Felt", "Fuji", "Ridley", "Eddy Merckx",
    "Stevens", "Corratec", "Nicolai", "Liteville", "YT Industries", "Propain",
    "Radon", "Nukeproof", "Vitus", "Ribble", "Boardman", "Brompton", "Dahon",
    "Tern", "VanMoof", "Cowboy", "Stromer", "Fantic", "Thok", "Ducati E-Bikes",
    "Lombardo", "Brinke", "Nilox", "Legnano"
  ];

  const MOTOR_BRANDS = [
    "Bosch eBike Systems", "Shimano STEPS", "Brose", "Yamaha", "Fazua",
    "Mahle", "Bafang", "Polini E-P3", "TQ", "DJI Avinox", "Oli eBike Systems",
    "Panasonic", "Hyena", "FSA"
  ];

  const PARTS_AND_ACCESSORY_BRANDS = [
    "Shimano", "SRAM", "Campagnolo", "MicroSHIFT", "Rotor", "FSA", "Vision",
    "Ritchey", "Deda Elementi", "Prologo", "Selle Italia", "Selle San Marco",
    "Fizik", "Brooks England", "Ergon", "SQLab", "Fox Racing Shox", "RockShox",
    "Öhlins", "Marzocchi", "SR Suntour", "Manitou", "DT Swiss", "Mavic",
    "Fulcrum", "Zipp", "Enve", "Reynolds", "Crankbrothers", "Hunt",
    "Hope Technology", "Magura", "Formula", "TRP", "Tektro", "SwissStop",
    "Galfer", "Pirelli", "Continental", "Schwalbe", "Michelin", "Vittoria",
    "Maxxis", "Goodyear", "Tufo", "Hutchinson", "Panaracer", "WTB", "Kenda",
    "Stan's NoTubes", "Muc-Off", "Park Tool", "Jagwire", "Lizard Skins", "Supacaz",
    "Garmin", "Wahoo", "Hammerhead", "Bryton", "Sigma", "Polar", "Kask", "Giro",
    "Bell", "POC", "Met", "Abus", "Oakley", "100%", "Rudy Project", "Bollé",
    "Assos", "Castelli", "Rapha", "Santini", "Alé Cycling", "Sportful",
    "Gore Wear", "Endura", "Fox Head", "Troy Lee Designs", "Alpinestars",
    "Leatt", "Five Ten", "Sidi", "Northwave", "Gaerne", "DMT", "Lake",
    "Tacx", "Elite", "Saris", "Kryptonite", "Topeak", "Lezyne", "Zefal",
    "SKS Germany", "Ortlieb", "Apidura", "Miss Grape", "Knog", "CatEye",
    "Lupine", "Magicshine"
  ];

  const ALL_BRANDS = Array.from(
    new Set([...BIKE_BRANDS, ...MOTOR_BRANDS, ...PARTS_AND_ACCESSORY_BRANDS])
  );

  function upsertMeta(attrName, attrValue, content, onlyIfEmpty) {
    if (!content) return;
    let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (el && onlyIfEmpty && el.getAttribute("content")) {
      return;
    }
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function injectSeoTags() {
    if (!document.title) {
      document.title = SITE_CONFIG.defaultTitle;
    }

    const pageTitle = document.title;
    const descEl = document.querySelector('meta[name="description"]');
    const pageDesc = (descEl && descEl.getAttribute("content")) || SITE_CONFIG.defaultDescription;
    const pageUrl = window.location.href || SITE_CONFIG.url;

    upsertMeta("name", "description", pageDesc, true);
    upsertMeta(
      "name",
      "keywords",
      [...CATEGORIES_AND_TERMS, ...ALL_BRANDS].join(", "),
      false
    );

    upsertMeta("property", "og:type", "website", true);
    upsertMeta("property", "og:locale", SITE_CONFIG.locale, true);
    upsertMeta("property", "og:site_name", SITE_CONFIG.name, true);
    upsertMeta("property", "og:title", pageTitle, true);
    upsertMeta("property", "og:description", pageDesc, true);
    upsertMeta("property", "og:url", pageUrl, true);
    upsertMeta("property", "og:image", SITE_CONFIG.image, true);

    upsertMeta("name", "twitter:card", "summary_large_image", true);
    upsertMeta("name", "twitter:title", pageTitle, true);
    upsertMeta("name", "twitter:description", pageDesc, true);
    upsertMeta("name", "twitter:image", SITE_CONFIG.image, true);
  }

  function injectJsonLd() {
    const id = "seo-bici-jsonld";
    if (document.getElementById(id)) return;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "BikeStore",
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.defaultDescription,
      url: SITE_CONFIG.url,
      image: SITE_CONFIG.image,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Via del Mandorlo 1",
        addressLocality: "Bibbona",
        addressRegion: "LI",
        addressCountry: "IT"
      },
      areaServed: [
        "Bibbona",
        "Val di Cecina",
        "Costa degli Etruschi",
        "Cecina",
        "Bolgheri",
        "Riparbella",
        "Casale Marittimo",
        "Guardistallo",
        "Castagneto Carducci"
      ],
      knowsAbout: [
        "Mountain Bike (MTB)",
        "Electric Mountain Bike (E-MTB)",
        "Road Bicycles (Bici da Corsa)",
        "Electric Road Bikes (E-Road)",
        "Gravel Bikes",
        "Electric Gravel Bikes (E-Gravel)",
        "E-Bike Drive Systems",
        "Bicycle Parts and Components",
        "Cycling Accessories",
        "Bicycle Repair and Maintenance",
        "Bicycle Rental",
        "Guided MTB Tours"
      ],
      brand: ALL_BRANDS.map((brandName) => ({
        "@type": "Brand",
        name: brandName
      }))
    };

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schemaData);

    if (SITE_CONFIG.injectJsonLdAtBottomOfBody && document.body) {
      document.body.appendChild(script);
    } else {
      document.head.appendChild(script);
    }
  }

  injectSeoTags();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectJsonLd);
  } else {
    injectJsonLd();
  }
})();
