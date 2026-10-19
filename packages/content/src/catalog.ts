import type { Topic } from '@parle/contracts';
import { defineTopic } from './catalog-factory';
import { additionalTopics } from './additional-catalog';

/** Initial source-cited lessons. Exercise answers remain server-only model fields. */
const originalTopics: Topic[] = [
  defineTopic({
    slug: 'articoli-determinativi',
    title: 'Articoli determinativi',
    cefrLevel: 'A1',
    category: 'Articles',
    estimatedMinutes: 12,
    theoryMarkdown: String.raw`# Articoli determinativi

> [!NOTE] 📍 Il punto di partenza
> *Il, lo, la, l’, i, gli, le* accompagnano un nome di cui vogliamo identificare la persona, la cosa o l’idea. Pensa a **quel libro** di cui stavamo parlando: entrambi sappiamo quale.

Un articolo cambia insieme al **genere** (maschile o femminile), al **numero** (singolare o plurale) e al **suono iniziale** del nome. Guarda prima il nome, poi scegli la forma.

## 🧭 La mappa delle forme

| Genere e numero | Consonante semplice | S + consonante, z, gn, ps e casi simili | Vocale |
| --- | --- | --- | --- |
| Maschile singolare | **il** libro | **lo** studente, **lo** zio | **l’** amico |
| Maschile plurale | **i** libri | **gli** studenti, **gli** zii | **gli** amici |
| Femminile singolare | **la** casa | **la** studentessa | **l’** amica |
| Femminile plurale | **le** case | **le** studentesse | **le** amiche |

> [!TIP] ✨ La domanda veloce
> Il suono iniziale decide tra *il/i* e *lo/gli*. La *s* di *studente* è seguita da un’altra consonante, quindi dici **lo studente / gli studenti**; la *s* di *sole* no, quindi dici **il sole / i soli**.

## 🛠️ Scegli l’articolo in tre passaggi

1. **Trova il nome.** È *libro*, *amica* o *zaino*?
2. **Controlla genere e numero.** *Il libro* è maschile singolare; *le amiche* è femminile plurale.
3. **Ascolta il primo suono.** Davanti a *zaino*, *gnomo*, *psicologo* e a *s + consonante*, il maschile usa *lo/gli*.

| Il nome comincia per… | Singolare | Plurale | Esempio |
| --- | --- | --- | --- |
| Consonante semplice (non il gruppo s + consonante) | *il* | *i* | il fiore → i fiori |
| s + consonante, z, gn, ps, x, y | *lo* | *gli* | lo specchio → gli specchi |
| Vocale, maschile | *l’* | *gli* | l’amico → gli amici |
| Vocale, femminile | *l’* | *le* | l’ora → le ore |

### 🔎 Apri le eccezioni e i dettagli

<details>
<summary>Vocale: l’ al singolare, ma il plurale segue genere e numero</summary>

- Maschile: **l’amico → gli amici**.
- Femminile: **l’amica → le amiche**. *Le* davanti a una vocale al plurale conserva la sua forma.
- Il segno *’* è un apostrofo tipografico: indica l’elisione della vocale di *lo* o *la*.

</details>

<details>
<summary>Quando la s è seguita da una consonante</summary>

Usa **lo/gli** in *lo studente / gli studenti*, *lo sport / gli sport*, *lo scaffale / gli scaffali*. Con una consonante semplice, usa invece **il/i**: *il fratello / i fratelli*, *il libro / i libri*.

</details>

<details>
<summary>Una nota sui nomi propri</summary>

L’articolo davanti ai nomi di battesimo è regionale e può risultare informale. Non trasformarlo in una regola universale: nello scritto neutro si dice **Luca arriva** e **Maria telefona**. Alcuni titoli d’opera e cognomi seguono convenzioni proprie.

</details>

## 🔊 Dai suono alla regola

<AudioButton phrase="lo studente" label="Ascolta: lo studente" />
<AudioButton phrase="gli amici" label="Ascolta: gli amici" />
<AudioButton phrase="l’amica" label="Ascolta: l’amica" />

## 🧠 Fai un ripasso attivo

- [ ] **Completa senza guardare la tabella:** ___ psicologi, ___ fiore, ___ ore.
- [ ] **Racconta la regola:** perché diciamo *gli amici* e *le amiche*?
- [ ] **Crea tre esempi tuoi:** un nome con *il*, uno con *lo*, uno con *l’*.

<Flashcard front="lo specchio → ?" back="gli specchi: al plurale maschile, lo diventa gli." />

## 📚 Riferimento

Regole e forme sono state rielaborate a partire da Treccani, *La grammatica italiana* (2012), [«Articoli determinativi»](https://www.treccani.it/enciclopedia/articoli-determinativi_%28La-grammatica-italiana%29/). Gli esempi di questa lezione sono originali.
`,
    keyRules: [
      {
        ruleTitle: 'Il genere guida la forma',
        explanation:
          'Gli articoli maschili e femminili cambiano in modo diverso: il/i oppure lo/gli per il maschile; la/le per il femminile.',
        italianExample: 'Il quaderno è nuovo; la penna è blu.',
        englishTranslation: 'The notebook is new; the pen is blue.',
      },
      {
        ruleTitle: 'Il suono iniziale sceglie il e lo',
        explanation:
          'Nel maschile singolare, il precede la maggior parte delle consonanti; lo precede s + consonante e altri gruppi difficili, come z, gn e ps.',
        italianExample: 'il libro, ma lo studente e lo zaino',
        englishTranslation: 'the book, but the student and the backpack',
      },
      {
        ruleTitle: 'i e gli sono i plurali maschili',
        explanation:
          'Il diventa i; lo diventa gli. L’articolo davanti a un nome maschile che inizia per vocale è l’ al singolare e gli al plurale.',
        italianExample: 'il libro → i libri; lo specchio → gli specchi; l’amico → gli amici',
        englishTranslation: 'the book/books; the mirror/mirrors; the male friend/friends',
      },
      {
        ruleTitle: 'L’ si usa davanti a una vocale al singolare',
        explanation:
          'Davanti a una vocale, il maschile il/lo e il femminile la si elidono in l’; il plurale resta gli per il maschile e le per il femminile.',
        italianExample: 'l’attore, gli attori; l’amica, le amiche',
        englishTranslation: 'the actor/actors; the female friend/friends',
      },
      {
        ruleTitle: 'Le precede tutti i nomi femminili plurali',
        explanation:
          'Le non si elide davanti a una vocale. In italiano neutro, di norma, si omette l’articolo davanti ai nomi propri di persona.',
        italianExample: 'le ore; Luca studia.',
        englishTranslation: 'the hours; Luca studies.',
      },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        prompt: 'Completa: «___ zaino di Chiara è vicino alla porta.»',
        options: ['Il', 'Lo', 'La', 'Gli'],
        correctAnswer: 'Lo',
        explanation:
          'Zaino è un nome maschile singolare che inizia per z. Lo zaino è la forma corretta; il si usa davanti alla maggior parte delle altre consonanti.',
      },
      {
        type: 'fill_in_the_blank',
        prompt: 'Completa con il plurale dell’articolo: «___ amiche arrivano alle otto.»',
        correctAnswer: 'le',
        explanation:
          'Amiche è femminile plurale. L’articolo plurale femminile è le anche quando il nome inizia per vocale: le amiche.',
      },
      {
        type: 'sentence_reorder',
        prompt: 'Ordina la frase: inizia con Il e metti oggi alla fine.',
        options: ['Il', 'museo', 'antico', 'apre', 'oggi'],
        correctAnswer: 'Il museo antico apre oggi',
        explanation:
          'La frase è: «Il museo antico apre oggi.» Il precede museo; antico concorda con museo al maschile singolare.',
      },
      {
        type: 'error_correction',
        prompt: 'Correggi articolo e verbo: «La psicologi arriva presto.»',
        correctAnswer: 'Gli psicologi arrivano presto.',
        explanation:
          'Psicologi è maschile plurale e inizia con ps: l’articolo è gli. Anche il verbo concorda al plurale, arrivano: «Gli psicologi arrivano presto.»',
      },
      {
        type: 'multiple_choice',
        prompt: 'Scegli l’articolo corretto: «___ alberi del parco sono alti.»',
        options: ['I', 'Gli', 'Le', 'L’'],
        correctAnswer: 'Gli',
        explanation:
          'Alberi è maschile plurale e inizia per vocale. Davanti a un nome maschile plurale che inizia per vocale si usa gli: gli alberi.',
      },
    ],
  }),
  defineTopic({
    slug: 'passato-prossimo',
    title: 'Passato prossimo',
    cefrLevel: 'A2',
    category: 'Verbs',
    estimatedMinutes: 16,
    theoryMarkdown: String.raw`# Passato prossimo

> [!NOTE] 📍 Il punto di partenza
> Usiamo il passato prossimo per raccontare un fatto passato visto come concluso: *Stamattina ho preso il treno; ieri siamo arrivati tardi.* Una storia è fatta di eventi, non solo di regole.

Pensa a una piccola **squadra di due parole**: una forma al presente di **avere** o **essere**, più il **participio passato**.

## 🧱 La formula

| Ausiliare al presente | + participio passato | = passato prossimo |
| --- | --- | --- |
| ho | studiato | ho studiato |
| ha | aperto | ha aperto |
| sono | arrivato / arrivata | sono arrivato / arrivata |
| siamo | partiti / partite | siamo partiti / partite |

### 🎛️ Scegli l’ausiliare

| In molti casi… | Prova… | Esempio |
| --- | --- | --- |
| Il verbo regge un oggetto diretto | **avere** | Ho preparato la cena. |
| Il verbo indica un cambiamento, un arrivo o una partenza senza oggetto diretto | **essere** | Sara è arrivata; il treno è partito. |
| Il verbo è riflessivo | **essere** | Mi sono svegliato presto. |
| Hai un dubbio su un verbo | Controlla l’uso del verbo; impara insieme la coppia verbo + ausiliare | Ho corso cinque chilometri; sono corso a casa. |

> [!IMPORTANT] 🎯 Non affidarti alla sola idea di “movimento”
> In molti casi *essere* accompagna verbi intransitivi di arrivo o cambiamento (*arrivare, partire, diventare*), ma la scelta dipende dalla costruzione. Un oggetto diretto può cambiare la costruzione: *Sono salito al terzo piano* / *Ho salito le scale*. Impara gli usi più comuni nel contesto.

## 🧬 Forma il participio

| Famiglia dell’infinito | Participio regolare | Esempio al passato prossimo |
| --- | --- | --- |
| -are | -ato | parlare → parlato → ho parlato |
| -ere | -uto | credere → creduto → abbiamo creduto |
| -ire | -ito | dormire → dormito → hai dormito |

Alcuni participi sono irregolari e vanno imparati con il verbo: *fare → fatto; dire → detto; leggere → letto; scrivere → scritto; vedere → visto; prendere → preso; venire → venuto; rimanere → rimasto*.

## 🤝 Fai concordare il participio

Con **essere**, il participio normalmente concorda in genere e numero con il soggetto. Con **avere**, normalmente resta invariato: non cercare di farlo concordare con il soggetto.

| Chi? | Essere + arrivare | Avere + mangiare |
| --- | --- | --- |
| Luca | Luca è arrivato. | Luca ha mangiato. |
| Giulia | Giulia è arrivata. | Giulia ha mangiato. |
| Luca e Paolo | Luca e Paolo sono arrivati. | Luca e Paolo hanno mangiato. |
| Giulia e Sara | Giulia e Sara sono arrivate. | Giulia e Sara hanno mangiato. |

### 🔎 Apri gli esempi e le sfumature

<details>
<summary>Una forma utile: essere al presente</summary>

| Persona | Essere | Persona | Avere |
| --- | --- | --- | --- |
| io | sono | io | ho |
| tu | sei | tu | hai |
| lui / lei | è | lui / lei | ha |
| noi | siamo | noi | abbiamo |
| voi | siete | voi | avete |
| loro | sono | loro | hanno |

</details>

<details>
<summary>Il participio con avere e i pronomi la / le / li</summary>

Quando un pronome oggetto diretto come *la, le* o *li* precede il verbo, il participio di solito concorda con quel pronome: **Le mele? Le ho comprate.** *Ho comprato le mele* resta la forma non pronominale. Questa concordanza non cambia la scelta dell’ausiliare.

</details>

<details>
<summary>Passato prossimo o imperfetto?</summary>

Il passato prossimo presenta un evento delimitato (*Ieri ho letto il primo capitolo*). L’imperfetto presenta spesso uno sfondo, un’abitudine o una situazione in corso (*Da bambino leggevo ogni sera; mentre leggevo, è suonato il telefono*). Nei racconti i due tempi possono lavorare insieme.

</details>

## 🔊 Ascolta e ripeti

<AudioButton phrase="Ieri siamo arrivati al museo." label="Ascolta la frase" />
<AudioButton phrase="Giulia ha scritto una lettera." label="Ascolta la frase" />
<AudioButton phrase="Mi sono svegliata presto." label="Ascolta la frase" />

## 🧠 Fai un ripasso attivo

- [ ] **Cerca l’ausiliare:** *La riunione è finita* — quale parola porta la persona e il tempo?
- [ ] **Cambia il soggetto:** *Marco è partito* → *Marco e Luca…*
- [ ] **Racconta tre eventi conclusi** di ieri usando un verbo in *-are*, uno in *-ere* e uno in *-ire*.

<Flashcard front="scrivere → participio?" back="scritto. Per esempio: Ho scritto un messaggio." />

## 📚 Riferimento

La spiegazione è stata scritta con riferimento a Treccani, *La grammatica italiana* (2012), [«Tempi verbali»](https://www.treccani.it/enciclopedia/tempi-verbali_%28La-grammatica-italiana%29/) e [«Pronomi personali»](https://www.treccani.it/enciclopedia/pronomi-personali_%28La-grammatica-italiana%29/), oltre a un controllo delle forme verbali in [Treccani, *Andare*](https://www.treccani.it/vocabolario/andare/). Il testo e gli esempi didattici sono originali.
`,
    keyRules: [
      {
        ruleTitle: 'La forma composta ha due parti',
        explanation:
          'Il passato prossimo si costruisce con il presente di avere o essere e il participio passato del verbo principale.',
        italianExample: 'Abbiamo visitato il museo; Chiara è tornata a casa.',
        englishTranslation: 'We visited the museum; Chiara came home.',
      },
      {
        ruleTitle: 'La scelta dell’ausiliare dipende dall’uso del verbo',
        explanation:
          'Avere accompagna molti verbi transitivi; essere si usa spesso con verbi intransitivi di arrivo e cambiamento e con i riflessivi. Impara l’ausiliare insieme al verbo.',
        italianExample: 'Ho preparato la cena; siamo arrivati alle otto; mi sono vestita.',
        englishTranslation: 'I prepared dinner; we arrived at eight; I got dressed.',
      },
      {
        ruleTitle: 'Il participio regolare segue tre schemi',
        explanation:
          'Per molti verbi regolari, il participio termina in -ato con -are, in -uto con -ere e in -ito con -ire.',
        italianExample: 'parlare → parlato; credere → creduto; dormire → dormito',
        englishTranslation: 'to speak → spoken; to believe → believed; to sleep → slept',
      },
      {
        ruleTitle: 'Essere concorda normalmente con il soggetto',
        explanation:
          'Con essere il participio si accorda in genere e numero con il soggetto: -o/-a al singolare e -i/-e al plurale.',
        italianExample: 'Luca è arrivato; Sara è arrivata; Sara e Luca sono arrivati.',
        englishTranslation: 'Luca arrived; Sara arrived; Sara and Luca arrived.',
      },
      {
        ruleTitle: 'Avere normalmente non concorda con il soggetto',
        explanation:
          'Con avere il participio normalmente rimane invariato rispetto al soggetto. Un pronome oggetto diretto anteposto può richiedere un accordo specifico.',
        italianExample: 'Sara ha mangiato; i panini? Li ho comprati.',
        englishTranslation: 'Sara ate; the sandwiches? I bought them.',
      },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        prompt: 'Completa: «Marco ___ al lavoro alle nove.»',
        options: ['è arrivato', 'ha arrivato', 'sono arrivato', 'è arrivata'],
        correctAnswer: 'è arrivato',
        explanation:
          'Il soggetto è Marco, maschile singolare. Arrivare qui è usato senza oggetto diretto e richiede essere; il participio concorda: Marco è arrivato.',
      },
      {
        type: 'fill_in_the_blank',
        prompt:
          'Scrivi il passato prossimo completo di finire per «io»: «Ieri ___ il lavoro alle cinque.»',
        correctAnswer: 'ho finito',
        explanation:
          'Finire qui ha l’oggetto diretto «il lavoro» e si usa con avere. La prima persona singolare del presente di avere è ho; il participio di finire è finito.',
      },
      {
        type: 'sentence_reorder',
        prompt: 'Ordina la frase: inizia con Abbiamo e metti ieri alla fine.',
        options: ['Abbiamo', 'visitato', 'il', 'museo', 'ieri'],
        correctAnswer: 'Abbiamo visitato il museo ieri',
        explanation:
          'La frase è: «Abbiamo visitato il museo ieri.» Avere è seguito dal participio visitato; il museo è l’oggetto della visita.',
      },
      {
        type: 'error_correction',
        prompt: 'Correggi il participio: «Giulia è andato dal medico.»',
        correctAnswer: 'Giulia è andata dal medico.',
        explanation:
          'Con essere il participio concorda con il soggetto. Giulia è femminile singolare, quindi la forma è andata: «Giulia è andata dal medico.»',
      },
      {
        type: 'multiple_choice',
        prompt: 'Completa con il participio corretto: «Le chiavi? Le ho ___.»',
        options: ['perso', 'perse', 'persa', 'persi'],
        correctAnswer: 'perse',
        explanation:
          'Le è il pronome oggetto diretto femminile plurale e precede il participio. In questa costruzione il participio concorda: le chiavi, le ho perse.',
      },
    ],
  }),
  defineTopic({
    slug: 'pronomi-diretti-e-indiretti',
    title: 'Pronomi diretti e indiretti',
    cefrLevel: 'B1',
    category: 'Pronouns',
    estimatedMinutes: 18,
    theoryMarkdown: String.raw`# Pronomi diretti e indiretti

> [!NOTE] 📍 Il punto di partenza
> Un pronome ci evita di ripetere un nome. Se sostituisce ciò che riceve direttamente l’azione, è **diretto**. Se sostituisce la persona a cui l’azione è rivolta, spesso introdotta da *a*, è **indiretto**.

**Vedo Giulia → La vedo.** Che cosa vedo? *Giulia*: complemento oggetto, pronome diretto.

**Scrivo a Giulia → Le scrivo.** A chi scrivo? *A Giulia*: complemento di termine, pronome indiretto.

## 🧭 Due domande, due funzioni

| Pronome | Funzione | Persone | Esempio |
| --- | --- | --- | --- |
| diretto | risponde spesso a **chi? / che cosa?** senza preposizione | mi, ti, **lo/la**, ci, vi, **li/le** | Compro la guida → **La** compro. |
| indiretto | indica **a chi? / a che cosa?** | mi, ti, **gli/le**, ci, vi, **gli / loro** | Telefono a Sara → **Le** telefono. |

Le forme *mi, ti, ci, vi* possono svolgere entrambe le funzioni: è il verbo e la domanda a chiarirle. **Ti vedo** (vedo chi?) è diretto; **ti telefono** (telefono a chi?) è indiretto.

## 🧭 Pronomi tonici dopo una preposizione

| Forma tonica | Dopo una preposizione | Esempio |
| --- | --- | --- |
| me, te | per me, con te | Questo regalo è per me. |
| lui, lei, noi, voi, loro | con / da / per + pronome | Vengo con loro; parlo di lei. |

Dopo una preposizione usa le forme toniche: **con me, per te, da lui, senza di loro**. Non usare i pronomi atoni *mi/ti* in questa posizione.

## 🪜 La costruzione in tre mosse

1. **Trova il verbo** e il suo significato: *vedere qualcuno*, *telefonare a qualcuno*.
2. **Fai la domanda.** *Chi?/che cosa?* senza *a* segnala spesso un oggetto diretto. *A chi?/a che cosa?* individua il termine.
3. **Scegli il pronome** e mettilo normalmente prima del verbo coniugato.

| Persona | Pronome diretto | Pronome indiretto | Esempio diretto | Esempio indiretto |
| --- | --- | --- | --- | --- |
| io | mi | mi | Mi vedi? | Mi parli? |
| tu | ti | ti | Ti chiamo. | Ti scrivo. |
| lui / lei | lo / la | gli / le | La conosco. | Le rispondo. |
| noi | ci | ci | Ci aspetti? | Ci racconti tutto? |
| voi | vi | vi | Vi accompagno. | Vi telefono. |
| loro | li / le | loro (formale) / gli (diffuso nel parlato) | Li incontro. | Gli scrivo domani. |

> [!TIP] ✨ Fai il test dell’oggetto
> Prova a sostituire il nome con **lo/la**. *Compro il biglietto → Lo compro.* Poi chiediti se resta una *a*: *Telefono a Luca → Gli telefono.* Il verbo *telefonare* regge *a*, quindi non usare *lo*.

### 🔊 Metti i pronomi all’ascolto

<AudioButton phrase="Ti vedo." label="Ascolta: ti vedo (pronome diretto)" />
<AudioButton phrase="Ti scrivo." label="Ascolta: ti scrivo (pronome indiretto)" />
<AudioButton phrase="Le ho comprate." label="Ascolta: le ho comprate" />

### 🔎 Apri costruzioni speciali

<details>
<summary>Il pronome con il passato prossimo</summary>

Con un oggetto diretto femminile o plurale anteposto, il participio di un verbo con *avere* normalmente concorda con quel pronome: **Ho comprato la guida → L’ho comprata.** / **Hai letto i messaggi? → Li ho letti.** L’apostrofo di *l’ho* separa il pronome la dal verbo ho.

</details>

<details>
<summary>Due pronomi insieme: glielo e me lo</summary>

In questo percorso, *gli* al plurale si incontra spesso nel parlato; **loro** dopo il verbo resta una scelta tradizionale più formale. Segui il registro richiesto dal contesto e dal tuo corso.

Quando un pronome di termine precede un pronome diretto, *mi, ti, ci, vi* diventano **me, te, ce, ve**: *te lo porto, ce la racconti*. Con *gli/le*, la combinazione si scrive unita: **glielo, gliela, glieli, gliele**. *Glielo* può riferirsi a un destinatario maschile oppure femminile: il contesto dice chi riceve la cosa.

</details>

<details>
<summary>Verbi all’infinito e verbi servili</summary>

Con un infinito il pronome si attacca al verbo: *Voglio chiamare Marco → Voglio chiamarlo.* Con un verbo servile sono possibili entrambe le posizioni: **Lo posso chiamare** e **Posso chiamarlo**. Scegli una forma e fai attenzione all’ortografia.

</details>

## 🔁 Una mini pratica di trasformazione

| Frase di partenza | Domanda | Riscrittura |
| --- | --- | --- |
| Cerco le mie chiavi. | Cerco che cosa? | **Le** cerco. |
| Rispondo a Luca. | Rispondo a chi? | **Gli** rispondo. |
| Accompagno voi alla stazione. | Accompagno chi? | **Vi** accompagno alla stazione. |
| Racconto la storia a Maria. | Racconto la storia a chi? | **Le** racconto la storia. |

## 🧠 Fai un ripasso attivo

- [ ] **Sostituisci il nome:** *Aspetto Marta → ___ aspetto.*
- [ ] **Ascolta il verbo:** *Scrivo a Marta → ___ scrivo.*
- [ ] **Spiega il cambio:** che differenza c’è fra *lo incontro* e *gli telefono*?

<Flashcard front="parlare a Luca → ?" back="Gli parlo: parlare regge la preposizione a, quindi il pronome è indiretto." />

## 📚 Riferimento

Le forme e le funzioni sono state rielaborate a partire da Treccani, *La grammatica italiana* (2012), [«Pronomi personali»](https://www.treccani.it/enciclopedia/pronomi-personali_%28La-grammatica-italiana%29/). Gli esempi di questa lezione sono originali.
`,
    keyRules: [
      {
        ruleTitle: 'Il pronome diretto sostituisce l’oggetto',
        explanation:
          'Un pronome diretto sostituisce spesso una persona o una cosa senza preposizione introdotta dal verbo e risponde a chi? o che cosa?',
        italianExample: 'Conosco Sara. → La conosco.',
        englishTranslation: 'I know Sara. → I know her.',
      },
      {
        ruleTitle: 'Il pronome indiretto sostituisce il termine',
        explanation:
          'Quando il verbo regge la preposizione a, il pronome indica spesso il destinatario e risponde alla domanda a chi? o a che cosa?',
        italianExample: 'Telefono a Marco. → Gli telefono.',
        englishTranslation: 'I phone Marco. → I phone him.',
      },
      {
        ruleTitle: 'Alcune persone hanno la stessa forma nei due gruppi',
        explanation:
          'Mi, ti, ci e vi possono essere diretti o indiretti. Per scegliere, guarda la costruzione del verbo e la funzione del nome sostituito.',
        italianExample: 'Ti vedo (diretto); ti telefono (indiretto).',
        englishTranslation: 'I see you (direct); I phone you (indirect).',
      },
      {
        ruleTitle: 'I pronomi atoni precedono normalmente il verbo coniugato',
        explanation:
          'Nella frase dichiarativa il pronome atono diretto o indiretto si colloca di norma prima del verbo finito.',
        italianExample: 'La compro; gli rispondiamo; vi accompagno.',
        englishTranslation: 'I buy it; we answer him; I accompany you.',
      },
      {
        ruleTitle: 'Il participio può concordare con un oggetto diretto anteposto',
        explanation:
          'Con avere, un pronome oggetto diretto femminile o plurale posto prima del participio di norma si riflette nella sua forma.',
        italianExample: 'Le fotografie? Le ho viste.',
        englishTranslation: 'The photographs? I saw them.',
      },
      {
        ruleTitle: 'Le combinazioni di pronomi seguono un ordine',
        explanation:
          'Quando sono presenti un pronome indiretto e uno diretto, l’indiretto viene prima; gli e le si uniscono al pronome diretto come glielo e gliela.',
        italianExample: 'Do il documento a Sara. → Glielo do.',
        englishTranslation: 'I give Sara the document. → I give it to her.',
      },
    ],
    exercises: [
      {
        type: 'multiple_choice',
        prompt: 'Scegli la frase in cui il pronome sostituisce «la pizza»: «Ordino la pizza.»',
        options: ['Le ordino.', 'La ordino.', 'Gli ordino.', 'Lo ordino.'],
        correctAnswer: 'La ordino.',
        explanation:
          'La pizza risponde alla domanda «ordino che cosa?» senza a ed è femminile singolare. Il pronome diretto è la: «La ordino.»',
      },
      {
        type: 'fill_in_the_blank',
        prompt: 'Completa: «Scrivo a Lucia ogni settimana. ___ scrivo ogni settimana.»',
        correctAnswer: 'Le',
        explanation:
          'Scrivere a Lucia risponde alla domanda «a chi scrivo?» Lucia è femminile singolare; il pronome indiretto è le: «Le scrivo.»',
      },
      {
        type: 'sentence_reorder',
        prompt: 'Ordina la frase: inizia con Gli e metti domani alla fine.',
        options: ['Gli', 'telefoniamo', 'domani'],
        correctAnswer: 'Gli telefoniamo domani',
        explanation:
          'La frase è: «Gli telefoniamo domani.» Telefonare regge la preposizione a: gli sostituisce «a lui» e precede il verbo.',
      },
      {
        type: 'error_correction',
        prompt:
          'Sostituisci «i biglietti» con il pronome corretto: «Ho comprato i biglietti. Le ho comprati.»',
        correctAnswer: 'Li ho comprati.',
        explanation:
          'Biglietti è maschile plurale e funziona da oggetto diretto; il pronome è li. Anteposto ad avere, porta con sé la concordanza: «Li ho comprati.»',
      },
      {
        type: 'multiple_choice',
        prompt:
          'Completa la frase con due pronomi: «Il documento? Do il documento a Sara. ___ do.»',
        options: ['Gli lo', 'Glielo', 'La le', 'Lo gli'],
        correctAnswer: 'Glielo',
        explanation:
          'Il destinatario indiretto le (a Sara) precede l’oggetto diretto lo (il documento). Le + lo si scrive unito: glielo.',
      },
    ],
  }),
];

export const grammarCatalog: Topic[] = [...originalTopics, ...additionalTopics];

if (new Set(grammarCatalog.map(({ slug }) => slug)).size !== grammarCatalog.length)
  throw new Error('Grammar topic slugs must be unique.');
