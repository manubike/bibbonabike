/* ==========================================================================
   FILE ESTERNO: seo-bici.js
   Inclusione in index.html (sopra o sotto il blocco principale, fuori dal core):
   <script src="/js/seo-bici.js"></script>
   ========================================================================== */

(function () {
  const SITE_CONFIG = {
    name: "Nome del Tuo Store / Portale Bici",
    url: "https://www.tuodominio.it/",
    image: "https://www.tuodominio.it/immagini/anteprima-bici.jpg",
    locale: "it_IT",
    title: "Bici MTB, Corsa, Gravel, E-Bike, Ricambi e Accessori | Tutti i Marchi",
    description:
      "Catalogo completo di biciclette muscolari ed elettriche: MTB (XC, Trail, Enduro, DH), Bici da Corsa, Gravel, E-MTB, E-Road, E-Gravel, ricambi, motori e accessori dei migliori marchi.",
    injectJsonLdAtBottomOfBody: true // true = inietta lo schema in fondo al body; false = in head
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
    "borse bikepacking", "portaborracce"
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
    "Mahle", "Bafang", "Polini E-P3", "TQ", "DJI Avinox", "Oli eBike Systems"
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

  function upsertMeta(attrName, attrValue, content) {
    if (!content) return;
    let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function injectSeoTags() {
    document.title = SITE_CONFIG.title;

    upsertMeta("name", "description", SITE_CONFIG.description);
    upsertMeta(
      "name",
      "keywords",
      [...CATEGORIES_AND_TERMS, ...ALL_BRANDS].join(", ")
    );

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", SITE_CONFIG.locale);
    upsertMeta("property", "og:site_name", SITE_CONFIG.name);
    upsertMeta("property", "og:title", SITE_CONFIG.title);
    upsertMeta("property", "og:description", SITE_CONFIG.description);
    upsertMeta("property", "og:url", SITE_CONFIG.url);
    upsertMeta("property", "og:image", SITE_CONFIG.image);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", SITE_CONFIG.title);
    upsertMeta("name", "twitter:description", SITE_CONFIG.description);
    upsertMeta("name", "twitter:image", SITE_CONFIG.image);
  }

  function injectJsonLd() {
    const id = "seo-bici-jsonld";
    if (document.getElementById(id)) return;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "BikeStore",
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      url: SITE_CONFIG.url,
      image: SITE_CONFIG.image,
      knowsAbout: [
        "Mountain Bike (MTB)",
        "Electric Mountain Bike (E-MTB)",
        "Road Bicycles (Bici da Corsa)",
        "Electric Road Bikes (E-Road)",
        "Gravel Bikes",
        "Electric Gravel Bikes (E-Gravel)",
        "E-Bike Drive Systems",
        "Bicycle Parts and Components",
        "Cycling Accessories"
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

