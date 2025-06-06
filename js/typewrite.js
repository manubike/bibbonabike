    document.addEventListener("DOMContentLoaded", () => {
      const textElement = document.getElementById("officinaText");

      const boldText = "Affidati ai nostri esperti meccanici per qualsiasi intervento:";
      const normalText = " dalle riparazioni rapide alle revisioni complete.\nLavoriamo con passione, precisione e attenzione per garantirti una bici sempre efficiente e sicura.";

      let hasTyped = false;

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasTyped) {
            hasTyped = true;
            runTypewriter();
            observer.disconnect(); // smetti di osservare dopo il primo trigger
          }
        });
      }, {
        threshold: 0.4
      });

      observer.observe(textElement);

      function runTypewriter() {
        const strongEl = document.createElement("strong");
        textElement.appendChild(strongEl);

        let i = 0;
        let j = 0;

        function typeBold() {
          if (i < boldText.length) {
            strongEl.textContent += boldText.charAt(i);
            i++;
            setTimeout(typeBold, 20);
          } else {
            typeNormal();
          }
        }

        function typeNormal() {
          if (j < normalText.length) {
            textElement.append(normalText.charAt(j));
            j++;
            setTimeout(typeNormal, 20);
          }
        }

        typeBold();
      }
    });