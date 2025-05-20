document.addEventListener('DOMContentLoaded', () => { 

    const inputField = document.getElementById('input'); // Campo di input per i comandi dell'utente

    const outputDiv = document.getElementById('output'); // Div dove mostrare l'output dei comandi

    // Funzioni dei comandi

    const commands = {

        help: () => {

            // Comando help

            return `Comandi disponibili:

            - help: Mostra questo messaggio di aiuto

            - list: Elenca i comuni interventi di riparazione per biciclette

            - fix [intervento]: Ottieni istruzioni per risolvere un problema specifico

            - clear: Pulisce il terminale`;

        },

        list: () => {

            // Comando list

            return `Interventi comuni di riparazione bici:

            - flat_tire (gomma a terra)

            - chain_issue (problema alla catena)

            - brake_adjustment (regolazione freni)

            - gear_shifting (cambio marce)

            - wheel_alignment (centratura ruota)

            - handlebar_adjustment (regolazione manubrio)

            - seat_adjustment (regolazione sella)

            - pedal_replacement (sostituzione pedali)

            - spoke_tightening (tensione raggi)

            - hub_service (manutenzione mozzo)

            - derailleur_adjustment (regolazione deragliatore)

            - bottom_bracket_service (manutenzione movimento centrale)`;

        },

        fix: (task) => {

            // Comando fix

            switch (task) {

                case 'flat_tire':
                    return `Riparazione gomma a terra:

                    1. Rimuovi la ruota.
                    2. Togli copertone e camera d'aria.
                    3. Controlla eventuali danni.
                    4. Ripara o sostituisci la camera d’aria.
                    5. Rimonta copertone e camera d’aria.
                    6. Gonfia la ruota e rimontala.`;

                case 'chain_issue':
                    return `Problemi con la catena:

                    1. Controlla eventuali danni.
                    2. Lubrifica la catena.
                    3. Regola la tensione.
                    4. Sostituiscila se necessario.`;

                case 'brake_adjustment':
                    return `Regolazione freni:

                    1. Controlla pattini e cavi.
                    2. Stringi o sostituisci i cavi.
                    3. Allinea i pattini al cerchio.
                    4. Prova i freni e regola se necessario.`;

                case 'gear_shifting':
                    return `Problemi col cambio:

                    1. Controlla l'allineamento del deragliatore.
                    2. Regola la tensione del cavo.
                    3. Lubrifica le leve cambio.
                    4. Sostituisci componenti usurati.`;

                case 'wheel_alignment':
                    return `Centratura ruota:

                    1. Controlla raggi allentati o rotti.
                    2. Usa una chiave per raggi per regolarli.
                    3. Usa un banco di centratura per allineare.
                    4. Verifica che la ruota giri dritta.`;

                case 'handlebar_adjustment':
                    return `Regolazione manubrio:

                    1. Allenta i bulloni dell’attacco.
                    2. Regola altezza e inclinazione.
                    3. Stringi bene i bulloni.
                    4. Verifica comfort e allineamento.`;

                case 'seat_adjustment':
                    return `Regolazione sella:

                    1. Allenta il morsetto.
                    2. Regola altezza e inclinazione.
                    3. Stringi il morsetto.
                    4. Controlla stabilità e comfort.`;

                case 'pedal_replacement':
                    return `Sostituzione pedali:

                    1. Rimuovi i pedali vecchi con una chiave.
                    2. Applica grasso sui nuovi filetti.
                    3. Monta i nuovi pedali (filettatura destra/destra, sinistra/sinistra).
                    4. Stringi bene e verifica il funzionamento.`;

                case 'spoke_tightening':
                    return `Tensione dei raggi:

                    1. Controlla se ci sono raggi allentati o danneggiati.
                    2. Usa una chiave per stringere quelli allentati.
                    3. Assicurati che la ruota resti centrata.
                    4. Controlla regolarmente la tensione.`;

                case 'hub_service':
                    return `Manutenzione mozzo:

                    1. Rimuovi la ruota.
                    2. Smonta il mozzo.
                    3. Pulisci e controlla i cuscinetti.
                    4. Lubrifica o sostituisci i cuscinetti.
                    5. Rimonta il mozzo e la ruota.`;

                case 'derailleur_adjustment':
                    return `Regolazione del deragliatore:

                    1. Controlla allineamento.
                    2. Regola le viti di fine corsa.
                    3. Regola la tensione del cavo.
                    4. Verifica il cambio in tutte le marce.`;

                case 'bottom_bracket_service':
                    return `Manutenzione movimento centrale:

                    1. Rimuovi la guarnitura.
                    2. Rimuovi il movimento centrale.
                    3. Pulisci e controlla i cuscinetti.
                    4. Lubrifica o sostituisci se necessario.
                    5. Rimonta tutto.`;

                default:
                    return `Intervento sconosciuto: ${task}. Usa 'list' per vedere gli interventi disponibili.`;
            }
        },

        clear: () => {
            // Comando clear
            outputDiv.innerHTML = '';
            return '';
        }

    };

    // Event listener per l'input dei comandi

    inputField.addEventListener('keydown', (e) => {

        if (e.key === 'Enter') {

            const input = inputField.value.trim(); // Ottieni il valore digitato
            const [command, ...args] = input.split(' '); // Dividi in comando e argomenti
            const response = commands[command] ? commands[command](...args) : `Comando sconosciuto: ${command}`; // Esegui comando

            // Mostra comando e risposta
            outputDiv.innerHTML += `> ${input}\n${response}\n\n`;
            inputField.value = ''; // Svuota il campo input
            outputDiv.scrollTop = outputDiv.scrollHeight; // Scrolla in fondo all’output

        }

    });

});
