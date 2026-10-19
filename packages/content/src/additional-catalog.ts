import type { Exercise, Topic } from '@parle/contracts';
import { defineTopic } from './catalog-factory';

type Drill = [
  prompt: string,
  answer: string,
  choice1: string,
  choice2: string,
  explanation: string,
];
type Lesson = {
  slug: string;
  title: string;
  category: Topic['category'];
  level: Topic['cefrLevel'];
  intro: string;
  table: string;
  detail: string;
  drills: [Drill, Drill, Drill, Drill, Drill];
};

const lessons: Lesson[] = [
  {
    slug: 'genere-e-plurale-dei-nomi',
    title: 'Genere e plurale dei nomi',
    category: 'Nouns',
    level: 'A1',
    intro:
      'Il nome italiano ha un genere grammaticale e un numero. Le desinenze aiutano a prevedere la forma, ma il dizionario e l’articolo sono ottimi compagni per le eccezioni.',
    table:
      '| Singolare | Plurale | Esempio | Indizio comune |\n| --- | --- | --- | --- |\n| -o | -i | libro → libri | spesso maschile |\n| -a | -e | casa → case | spesso femminile |\n| -e | -i | fiore → fiori; notte → notti | può essere maschile o femminile |\n| -ca/-ga (f.) | -che/-ghe | amica → amiche | conserva il suono duro |\n| -co/-go | -chi/-ghi o -ci/-gi | albergo → alberghi; amico → amici | accento e parola determinano la forma |',
    detail:
      'Molti nomi in -ma di origine greca sono maschili (*il problema, i problemi*); *la mano* è femminile. Alcuni nomi restano uguali al plurale (*la città, le città; il film, i film*). Impara sempre nome e articolo insieme.',
    drills: [
      [
        'Completa: «___ problema è importante.»',
        'Il',
        'La',
        'Lo',
        'Problema è maschile, pur terminando in -a: si dice il problema.',
      ],
      [
        'Scegli il plurale di «amica».',
        'amiche',
        'amici',
        'amicae',
        'La c di amica mantiene il suono duro davanti a e con l’aggiunta di h: amiche.',
      ],
      [
        'Completa: «due ___ (notte) tranquille».',
        'notti',
        'notte',
        'notta',
        'Notte termina in -e; il plurale regolare è notti.',
      ],
      [
        'Scegli l’articolo: «___ mano è fredda.»',
        'La',
        'Il',
        'Lo',
        'Mano è un’eccezione femminile: la mano.',
      ],
      [
        'Completa: «tre ___ (città) italiane».',
        'città',
        'cittate',
        'cittai',
        'I nomi accentati in -à sono invariabili: la città, le città.',
      ],
    ],
  },
  {
    slug: 'articoli-indeterminativi',
    title: 'Articoli indeterminativi',
    category: 'Articles',
    level: 'A1',
    intro:
      'Un articolo indeterminativo presenta una persona o una cosa non identificata o menzionata per la prima volta. Al plurale si usano spesso forme partitive o nomi senza articolo.',
    table:
      '| Genere | Consonante semplice | s + consonante, z, gn, ps | Vocale |\n| --- | --- | --- | --- |\n| Maschile | un libro | uno studente | un amico |\n| Femminile | una casa | una studentessa | un’amica |',
    detail:
      'Davanti a un nome maschile, *un* non ha apostrofo: *un amico*. Il femminile *una* perde la a davanti a vocale e prende l’apostrofo: *un’amica*. Con *uno* e *una* la scelta dipende dal suono iniziale.',
    drills: [
      [
        'Completa: «___ studente arriva alle nove.»',
        'Uno',
        'Un',
        'Una',
        'Studente maschile inizia con s + consonante; si usa uno.',
      ],
      [
        'Completa: «Marco ha ___ amico a Roma.»',
        'un',
        'un’',
        'uno',
        'Amico è maschile: un precede la vocale senza apostrofo.',
      ],
      [
        'Completa: «È ___ amica di Sara.»',
        'un’',
        'un',
        'uno',
        'Amica è femminile e inizia per vocale: una diventa un’amica.',
      ],
      [
        'Scegli: «Vorrei ___ yogurt.»',
        'uno',
        'un',
        'una',
        'Yogurt maschile inizia con y, suono trattato come gruppo speciale: uno yogurt.',
      ],
      [
        'Completa: «Abito in ___ casa piccola.»',
        'una',
        'un',
        'un’',
        'Casa è femminile singolare con consonante: una casa.',
      ],
    ],
  },
  {
    slug: 'aggettivi-descrittivi',
    title: 'Aggettivi: accordo, colore e nazionalità',
    category: 'Adjectives',
    level: 'A1',
    intro:
      'L’aggettivo descrive un nome e concorda con esso in genere e numero. In italiano spesso segue il nome; gli aggettivi molto comuni possono precederlo e talvolta cambiare sfumatura.',
    table:
      '| Forma | Esempio |\n| --- | --- |\n| -o → -a, -i, -e | ragazzo italiano; ragazze italiane |\n| -e → -i | un film interessante; due film interessanti |\n| Colore variabile | scarpe rosse; cappelli neri |\n| Spesso dopo il nome | una casa moderna |\n| Comune prima o dopo | un vecchio amico / un amico vecchio |',
    detail:
      'La posizione può cambiare enfasi o significato: *un grande uomo* elogia statura morale o importanza; *un uomo grande* descrive soprattutto la taglia. I colori composti o derivati da nomi sono spesso invariabili (*due auto blu*).',
    drills: [
      [
        'Completa: «Le ragazze sono ___ (italiano).»',
        'italiane',
        'italiani',
        'italiana',
        'Il soggetto è femminile plurale: l’aggettivo diventa italiane.',
      ],
      [
        'Completa: «Due libri ___ (interessante).»',
        'interessanti',
        'interessante',
        'interessanto',
        'Gli aggettivi in -e formano il plurale in -i per entrambi i generi.',
      ],
      [
        'Completa: «una macchina ___ (rosso)».',
        'rossa',
        'rosso',
        'rosse',
        'Macchina è femminile singolare; rosso concorda: rossa.',
      ],
      [
        'Scegli la forma naturale: «gli studenti ___».',
        'bravi',
        'brave',
        'bravo',
        'Studenti è maschile plurale, quindi bravi.',
      ],
      [
        'Completa: «due biciclette ___ (blu)».',
        'blu',
        'blùe',
        'blui',
        'Blu, colore invariabile, resta blu anche al plurale.',
      ],
    ],
  },
  {
    slug: 'dimostrativi',
    title: 'Dimostrativi: questo e quello',
    category: 'Articles',
    level: 'A1',
    intro:
      'I dimostrativi indicano dove si trova una persona o una cosa rispetto a chi parla. *Questo* richiama ciò che è vicino; *quello* ciò che è più lontano o già individuato.',
    table:
      '| | Maschile singolare/plurale | Femminile singolare/plurale |\n| --- | --- | --- |\n| vicino | questo / questi | questa / queste |\n| lontano | quel, quello, quell’ / quei, quegli | quella, quell’ / quelle |',
    detail:
      'Davanti al nome, *quel/quello/quell’* segue gli stessi suoni dell’articolo determinativo: *quel libro, quello studente, quell’amico; quei libri, quegli studenti*. Il pronome dimostrativo può stare da solo: *Preferisco questo.*',
    drills: [
      [
        'Completa: «___ libro qui è mio.»',
        'Questo',
        'Quello',
        'Quella',
        'Libro è vicino a chi parla e maschile singolare: questo libro.',
      ],
      [
        'Completa: «___ studente laggiù è Luca.»',
        'Quello',
        'Quel',
        'Quella',
        'Studente inizia con s + consonante, quindi quello studente.',
      ],
      [
        'Completa: «___ amica qui si chiama Anna.»',
        'Questa',
        'Questo',
        'Quell’',
        'Amica è femminile e vicina: questa amica.',
      ],
      [
        'Completa: «___ alberi laggiù sono alti.»',
        'Quegli',
        'Quei',
        'Quelle',
        'Alberi è maschile plurale con vocale iniziale: quegli alberi.',
      ],
      [
        'Completa: «Preferisco ___ (femminile plurale, vicino).»',
        'queste',
        'questi',
        'questa',
        'Il nome sottinteso è femminile plurale: queste.',
      ],
    ],
  },
  {
    slug: 'possessivi',
    title: 'Possessivi e famiglia',
    category: 'Articles',
    level: 'A1',
    intro:
      'Il possessivo concorda con la cosa posseduta, non con la persona che possiede: *il mio libro, la mia penna*. Di norma precede il nome ed è accompagnato dall’articolo.',
    table:
      '| Persona | Maschile singolare | Femminile singolare | Maschile plurale | Femminile plurale |\n| --- | --- | --- | --- | --- |\n| io | mio | mia | miei | mie |\n| tu | tuo | tua | tuoi | tue |\n| lui/lei | suo | sua | suoi | sue |\n| noi / voi / loro | nostro / vostro / loro | nostra / vostra / loro | nostri / vostri / loro | nostre / vostre / loro |',
    detail:
      'Con un familiare singolare si omette normalmente l’articolo: *mia madre, tuo fratello*. L’articolo torna con il plurale (*i miei fratelli*), con un possessivo alterato (*la mia sorellina*) e con *loro* (*la loro madre*).',
    drills: [
      [
        'Completa: «___ libro (mio) è sul tavolo.»',
        'Il mio',
        'La mia',
        'I miei',
        'Libro è maschile singolare: il mio libro.',
      ],
      [
        'Completa: «___ sorella si chiama Elisa.»',
        'Mia',
        'La mia',
        'Mio',
        'Con il familiare singolare sorella, di norma, si omette l’articolo: mia sorella.',
      ],
      [
        'Completa: «___ genitori arrivano domani.»',
        'I miei',
        'Il mio',
        'Le mie',
        'Genitori è maschile plurale e richiede l’articolo: i miei genitori.',
      ],
      [
        'Completa: «___ loro casa è luminosa.»',
        'La',
        'Una',
        'Le',
        'Il possessivo loro è normalmente accompagnato dall’articolo: la loro casa.',
      ],
      [
        'Completa: «___ amiche (nostro) studiano italiano.»',
        'Le nostre',
        'I nostri',
        'La nostra',
        'Amiche è femminile plurale: le nostre amiche.',
      ],
    ],
  },
  {
    slug: 'quantificatori',
    title: 'Quantificatori',
    category: 'Adjectives',
    level: 'A2',
    intro:
      'I quantificatori esprimono quantità o intensità. Quando accompagnano un nome, molti concordano in genere e numero; *tutto* normalmente si combina con l’articolo.',
    table:
      '| Forma | Uso | Esempio |\n| --- | --- | --- |\n| molto / poco / tanto / troppo | quantità variabile; concordano | molte idee, poca acqua |\n| tutto | totalità; + articolo | tutti i giorni, tutta la sera |\n| molto avverbio | intensità; invariabile | studio molto |',
    detail:
      'Con un verbo, *molto* è avverbio e non cambia (*lavorano molto*). Prima di un nome cambia (*molti esercizi*). *Tutto* precede normalmente articolo e nome: *tutto il corso, tutti gli studenti*.',
    drills: [
      [
        'Completa: «Ho ___ libri da leggere.»',
        'molti',
        'molta',
        'molto',
        'Libri è maschile plurale; molto concorda: molti libri.',
      ],
      [
        'Completa: «Bevo ___ acqua.»',
        'poca',
        'pochi',
        'poco',
        'Acqua è femminile singolare: poca acqua.',
      ],
      [
        'Completa: «Camminiamo ___ ogni giorno.»',
        'molto',
        'molti',
        'molta',
        'Qui molto modifica il verbo, quindi è invariabile.',
      ],
      [
        'Completa: «___ gli studenti hanno un quaderno.»',
        'Tutti',
        'Tutto',
        'Tutta',
        'Studenti è maschile plurale: tutti gli studenti.',
      ],
      [
        'Completa: «Il caffè è ___ caldo!»',
        'troppo',
        'troppi',
        'troppe',
        'Troppo modifica l’aggettivo caldo come avverbio ed è invariabile.',
      ],
    ],
  },
  {
    slug: 'pronomi-soggetto',
    title: 'Pronomi soggetto e soggetto sottinteso',
    category: 'Pronouns',
    level: 'A1',
    intro:
      'La desinenza del verbo spesso rivela chi compie l’azione, quindi il pronome soggetto si omette quando è chiaro. Si esprime per contrasto, enfasi o chiarezza.',
    table:
      '| Persona | Pronome | essere | parlare |\n| --- | --- | --- | --- |\n| 1ª singolare | io | sono | parlo |\n| 2ª singolare | tu | sei | parli |\n| 3ª singolare | lui / lei / Lei | è | parla |\n| 1ª plurale | noi | siamo | parliamo |\n| 2ª plurale | voi | siete | parlate |\n| 3ª plurale | loro | sono | parlano |',
    detail:
      'Con *essere* la forma *sono* può significare io o loro; il contesto chiarisce, oppure il pronome esplicito evita ambiguità. *Lei* con iniziale maiuscola è il pronome formale di cortesia.',
    drills: [
      [
        'Completa senza pronome soggetto: «___ italiano.» (parlare, io)',
        'Parlo',
        'Parli',
        'Parlano',
        'La desinenza -o indica la prima persona singolare: parlo; io può essere omesso.',
      ],
      ['Completa: «Tu ___ di Milano.»', 'sei', 'è', 'sono', 'Con tu, essere è sei.'],
      [
        'Completa: «Marta? ___ studia medicina.»',
        'Lei',
        'Lui',
        'Loro',
        'Marta è una donna singolare; il pronome è lei.',
      ],
      [
        'Completa: «___ siamo pronti.» (noi)',
        'Noi',
        'Voi',
        'Loro',
        'Noi concorda con siamo; il pronome può essere espresso per enfasi.',
      ],
      [
        'Completa: «Signora, ___ è la guida?» (cortesia)',
        'Lei',
        'Tu',
        'Loro',
        'Il singolare formale di cortesia usa Lei e il verbo alla terza persona.',
      ],
    ],
  },
  {
    slug: 'pronomi-riflessivi',
    title: 'Pronomi e verbi riflessivi',
    category: 'Pronouns',
    level: 'A2',
    intro:
      'In un verbo riflessivo il pronome si riferisce al soggetto: la persona compie l’azione su sé stessa o la vive nella propria routine. L’infinito termina in -si.',
    table:
      '| Persona | Pronome | svegliarsi |\n| --- | --- | --- |\n| io | mi | mi sveglio |\n| tu | ti | ti svegli |\n| lui/lei | si | si sveglia |\n| noi | ci | ci svegliamo |\n| voi | vi | vi svegliate |\n| loro | si | si svegliano |',
    detail:
      'Il pronome precede il verbo coniugato (*mi lavo*) e si unisce all’infinito dopo aver tolto la -e finale (*voglio lavarmi*). Al passato prossimo i riflessivi usano essere: *mi sono svegliata*.',
    drills: [
      [
        'Completa: «Io ___ chiamo Paolo.»',
        'mi',
        'ti',
        'si',
        'Con io si usa il pronome riflessivo mi: mi chiamo.',
      ],
      [
        'Completa: «Tu ___ lavi la mattina.»',
        'ti',
        'mi',
        'vi',
        'Con tu il pronome riflessivo è ti.',
      ],
      [
        'Completa: «Noi ___ svegliamo presto.»',
        'ci',
        'si',
        'vi',
        'Con noi si usa ci: ci svegliamo.',
      ],
      [
        'Completa: «Anna ___ è vestita.»',
        'si',
        'la',
        'le',
        'Il verbo vestirsi è riflessivo e al passato prende si è vestita.',
      ],
      [
        'Completa: «Voglio ___ (lavarsi).»',
        'lavarmi',
        'mi lavare',
        'lavarsi',
        'Con l’infinito il pronome si attacca dopo aver tolto la -e: lavarmi.',
      ],
    ],
  },
  {
    slug: 'essere-e-avere',
    title: 'Essere, avere e le espressioni con avere',
    category: 'Verbs',
    level: 'A1',
    intro:
      'Essere e avere sono verbi fondamentali, con forme irregolari da imparare a memoria. In molte espressioni italiane una sensazione si “ha” invece di “essere”.',
    table:
      '| Persona | essere | avere |\n| --- | --- | --- |\n| io | sono | ho |\n| tu | sei | hai |\n| lui/lei | è | ha |\n| noi | siamo | abbiamo |\n| voi | siete | avete |\n| loro | sono | hanno |',
    detail:
      'Si dice *avere fame, sete, caldo, freddo, sonno, paura* e *avere ... anni*: *Ho vent’anni; avete fame?* Per l’età non si usa essere.',
    drills: [
      [
        'Completa: «Io ___ studentessa.»',
        'sono',
        'ho',
        'sei',
        'Per identità o professione si usa essere: io sono.',
      ],
      [
        'Completa: «Tu ___ una bicicletta.»',
        'hai',
        'ha',
        'hanno',
        'La seconda persona singolare di avere è hai.',
      ],
      [
        'Completa: «Noi ___ fame.»',
        'abbiamo',
        'siamo',
        'hanno',
        'L’espressione italiana è avere fame: noi abbiamo fame.',
      ],
      [
        'Completa: «Loro ___ caldo.»',
        'hanno',
        'sono',
        'avete',
        'Le sensazioni caldo/freddo si esprimono con avere: loro hanno caldo.',
      ],
      [
        'Completa: «Quanti anni ___?» (tu)',
        'hai',
        'sei',
        'ha',
        'Per chiedere l’età si usa avere: quanti anni hai?',
      ],
    ],
  },
  {
    slug: 'presente-verbi-regolari',
    title: 'Presente: verbi regolari in -are, -ere, -ire',
    category: 'Verbs',
    level: 'A1',
    intro:
      'Per coniugare un verbo regolare, togli la desinenza dell’infinito e aggiungi quella della persona. La terza coniugazione ha due modelli: *dormire* e *finire*.',
    table:
      '| Persona | parlare (-are) | credere (-ere) | dormire (-ire) | finire (-isc-) |\n| --- | --- | --- | --- | --- |\n| io | parlo | credo | dormo | finisco |\n| tu | parli | credi | dormi | finisci |\n| lui/lei | parla | crede | dorme | finisce |\n| noi | parliamo | crediamo | dormiamo | finiamo |\n| voi | parlate | credete | dormite | finite |\n| loro | parlano | credono | dormono | finiscono |',
    detail:
      'Il gruppo -isc- compare nelle forme io, tu, lui/lei e loro di alcuni verbi in -ire, come *finire, capire, preferire*. Non compare in noi e voi. Non tutti i verbi in -ire lo usano.',
    drills: [
      [
        'Completa: «Io ___ italiano.» (parlare)',
        'parlo',
        'parli',
        'parlano',
        'Parlare toglie -are e aggiunge -o per io: parlo.',
      ],
      [
        'Completa: «Tu ___ la lezione.» (credere)',
        'credi',
        'credo',
        'crede',
        'Credere toglie -ere e aggiunge -i per tu: credi.',
      ],
      [
        'Completa: «Noi ___ otto ore.» (dormire)',
        'dormiamo',
        'dormono',
        'dormite',
        'Dormire segue il modello senza -isc-; noi termina in -iamo.',
      ],
      [
        'Completa: «Luca ___ il lavoro.» (finire)',
        'finisce',
        'finisci',
        'finiscono',
        'Finire inserisce -isc- alla terza persona singolare: finisce.',
      ],
      [
        'Completa: «Voi ___ il caffè.» (preferire)',
        'preferite',
        'preferiscono',
        'preferisci',
        'Nei verbi -isc-, noi e voi non prendono -isc-: voi preferite.',
      ],
    ],
  },
  {
    slug: 'verbi-irregolari-al-presente',
    title: 'Verbi irregolari al presente',
    category: 'Verbs',
    level: 'A1',
    intro:
      'Alcuni verbi molto frequenti cambiano la radice o usano desinenze proprie. Imparali in frasi brevi e insieme alle espressioni in cui compaiono.',
    table:
      '| Infinito | io | tu | lui/lei | noi | voi | loro |\n| --- | --- | --- | --- | --- | --- | --- |\n| andare | vado | vai | va | andiamo | andate | vanno |\n| fare | faccio | fai | fa | facciamo | fate | fanno |\n| stare | sto | stai | sta | stiamo | state | stanno |\n| venire | vengo | vieni | viene | veniamo | venite | vengono |\n| uscire | esco | esci | esce | usciamo | uscite | escono |\n| dare / dire | do / dico | dai / dici | dà / dice | diamo / diciamo | date / dite | danno / dicono |',
    detail:
      'Nota l’accento in *dà* (verbo dare) per distinguerlo da *da* (preposizione). *Fare* è frequente nelle collocazioni: *fare colazione, fare una domanda, fare sport*.',
    drills: [
      [
        'Completa: «Io ___ al lavoro in autobus.» (andare)',
        'vado',
        'vai',
        'vanno',
        'La prima persona singolare di andare è vado.',
      ],
      [
        'Completa: «Tu ___ una domanda.» (fare)',
        'fai',
        'fa',
        'faccio',
        'La seconda persona singolare di fare è fai.',
      ],
      [
        'Completa: «Noi ___ a casa stasera.» (stare)',
        'stiamo',
        'stanno',
        'sto',
        'La prima persona plurale di stare è stiamo.',
      ],
      [
        'Completa: «Giulia ___ da Torino.» (venire)',
        'viene',
        'vieni',
        'vengono',
        'La terza persona singolare di venire è viene.',
      ],
      [
        'Completa: «Loro ___ alle otto.» (uscire)',
        'escono',
        'esce',
        'usciamo',
        'La terza persona plurale di uscire è escono.',
      ],
    ],
  },
  {
    slug: 'verbi-modali',
    title: 'Potere, volere e dovere',
    category: 'Verbs',
    level: 'A2',
    intro:
      'I verbi modali esprimono possibilità, desiderio e necessità. Sono seguiti da un infinito che completa il significato; il modale si coniuga secondo il soggetto.',
    table:
      '| Modale | Significato | Esempio |\n| --- | --- | --- |\n| potere | possibilità / permesso | posso entrare |\n| volere | volontà / desiderio | vuoi partire |\n| dovere | necessità / obbligo | dobbiamo studiare |',
    detail:
      'Con un pronome atono, sono spesso possibili entrambe le posizioni: *lo posso fare / posso farlo*. Al passato prossimo, con un modale seguito da infinito, l’ausiliare può dipendere dal verbo all’infinito: *ho dovuto studiare; sono dovuta partire*.',
    drills: [
      [
        'Completa: «___ aprire la finestra?» (posso, richiesta gentile)',
        'Posso',
        'Devo',
        'Voglio',
        'Potere esprime possibilità o permesso: posso aprire?',
      ],
      [
        'Completa: «Marta ___ visitare Roma.» (desiderio)',
        'vuole',
        'può',
        'deve',
        'Volere esprime volontà: Marta vuole visitare Roma.',
      ],
      [
        'Completa: «Noi ___ finire oggi.» (necessità)',
        'dobbiamo',
        'vogliamo',
        'possiamo',
        'Dovere esprime necessità; con noi si dice dobbiamo.',
      ],
      [
        'Completa: «Tu puoi ___ con noi.»',
        'venire',
        'vieni',
        'venuto',
        'Dopo il modale si usa l’infinito: puoi venire.',
      ],
      [
        'Completa: «Non ___ uscire, ho un esame.» (io, necessità)',
        'devo',
        'voglio',
        'posso',
        'Dovere alla prima persona singolare è devo; qui esprime necessità.',
      ],
    ],
  },
  {
    slug: 'piacere',
    title: 'Piacere e i pronomi indiretti',
    category: 'Verbs',
    level: 'A2',
    intro:
      'Con *piacere*, la cosa gradita è il soggetto grammaticale. Il pronome indica a chi piace: *Mi piace il gelato; mi piacciono i gelati*.',
    table:
      '| Pronome | Forma |\n| --- | --- |\n| a me | mi piace / piacciono |\n| a te | ti piace / piacciono |\n| a lui / a lei | gli / le piace / piacciono |\n| a noi / a voi / a loro | ci / vi / gli piace / piacciono |',
    detail:
      'Usa *piace* con un nome singolare o un infinito (*mi piace la musica; mi piace viaggiare*). Usa *piacciono* con un soggetto plurale (*mi piacciono i film*). La forma enfatica *a me* spesso si accompagna a *mi*: *A me piace il jazz.*',
    drills: [
      [
        'Completa: «Mi ___ la pasta.»',
        'piace',
        'piacciono',
        'piaci',
        'La pasta è un soggetto singolare: mi piace.',
      ],
      [
        'Completa: «A Luca ___ i musei.»',
        'piacciono',
        'piace',
        'piaci',
        'I musei è plurale e fa da soggetto: piacciono.',
      ],
      [
        'Completa: «Ti ___ viaggiare?»',
        'piace',
        'piacciono',
        'piaci',
        'Un infinito come viaggiare si tratta come un soggetto singolare: piace.',
      ],
      [
        'Completa: «A noi ___ il cinema italiano.»',
        'piace',
        'piacciono',
        'piaciamo',
        'Il cinema è singolare; con noi il pronome indiretto è ci: ci piace.',
      ],
      [
        'Completa: «A loro ___ le canzoni.»',
        'piacciono',
        'piace',
        'piacciono a',
        'Le canzoni è plurale; si dice a loro piacciono.',
      ],
    ],
  },
  {
    slug: 'ce-ci-sono',
    title: 'C’è e ci sono',
    category: 'Syntax',
    level: 'A1',
    intro:
      'Usiamo *c’è* per introdurre una cosa o una persona al singolare e *ci sono* al plurale. La forma presenta ciò che esiste o si trova in un luogo.',
    table:
      '| Numero | Forma | Esempio |\n| --- | --- | --- |\n| singolare | c’è (= ci è) | C’è una farmacia qui. |\n| plurale | ci sono | Ci sono due fermate. |\n| domanda | C’è…? / Ci sono…? | C’è un bagno? |\n| negazione | non c’è / non ci sono | Non c’è tempo. |',
    detail:
      'Non confondere *c’è* esistenziale con *è* che identifica o descrive: *C’è un bar* (esiste un bar); *Il bar è aperto* (il bar è aperto).',
    drills: [
      [
        'Completa: «___ un supermercato vicino?»',
        'C’è',
        'Ci sono',
        'È ci',
        'Un supermercato è singolare: c’è.',
      ],
      [
        'Completa: «In centro ___ molti ristoranti.»',
        'ci sono',
        'c’è',
        'sono c’è',
        'Molti ristoranti è plurale: ci sono.',
      ],
      [
        'Completa: «Oggi non ___ lezione.»',
        'c’è',
        'ci sono',
        'è ci',
        'Lezione è singolare; la negazione precede c’è.',
      ],
      [
        'Completa: «___ due biglietti sul tavolo.»',
        'Ci sono',
        'C’è',
        'Sono ci',
        'Due biglietti è plurale: ci sono.',
      ],
      [
        'Scegli: «La porta ___ aperta.»',
        'è',
        'c’è',
        'ci sono',
        'Qui descriviamo la porta: si usa essere, la porta è aperta.',
      ],
    ],
  },
  {
    slug: 'verbi-con-cambi-ortografici',
    title: 'Verbi in -care, -gare e -ciare',
    category: 'Verbs',
    level: 'A2',
    intro:
      'Alcuni cambi grafici mantengono lo stesso suono quando una desinenza comincia con e o i. La modifica conserva la pronuncia della radice.',
    table:
      '| Infinito | forma utile | Perché |\n| --- | --- | --- |\n| cercare | tu cerchi; noi cerchiamo | h conserva il suono duro di c |\n| pagare | tu paghi; noi paghiamo | h conserva il suono duro di g |\n| cominciare | tu cominci; noi cominciamo | si evita una i doppia non necessaria |\n| mangiare | tu mangi; noi mangiamo | la i della radice resta una sola |',
    detail:
      'Nel presente, il cambiamento si nota soprattutto nelle forme tu e noi per -care/-gare (*cerchi, cerchiamo; paghi, paghiamo*). Nei verbi in -ciare/-giare, la i della radice spesso non si raddoppia davanti a una desinenza che inizia con i.',
    drills: [
      [
        'Completa: «Tu ___ una parola nel dizionario.» (cercare)',
        'cerchi',
        'cerci',
        'cercchi',
        'La h conserva il suono duro di c davanti alla i: cerchi.',
      ],
      [
        'Completa: «Noi ___ il conto.» (pagare)',
        'paghiamo',
        'pagi siamo',
        'pagiamo',
        'La h conserva il suono duro di g davanti alla i: paghiamo.',
      ],
      [
        'Completa: «Tu ___ a cucinare.» (cominciare)',
        'cominci',
        'comincii',
        'comincihi',
        'La forma corretta ha una sola i: cominci.',
      ],
      [
        'Completa: «Noi ___ la pizza.» (mangiare)',
        'mangiamo',
        'mangiiamo',
        'mangiemo',
        'Davanti alla i della desinenza, la i della radice non raddoppia: mangiamo.',
      ],
      [
        'Completa: «Voi ___ il biglietto?» (pagare)',
        'pagate',
        'paghiate',
        'paggate',
        'La forma voi termina in -ate e non richiede h: pagate.',
      ],
    ],
  },
  {
    slug: 'passato-prossimo-con-avere',
    title: 'Passato prossimo con avere',
    category: 'Verbs',
    level: 'A2',
    intro:
      'Molti verbi transitivi formano il passato prossimo con avere al presente e il participio passato. Con l’ausiliare avere, il participio di norma non concorda con il soggetto.',
    table:
      '| Persona | avere + preparare |\n| --- | --- |\n| io | ho preparato |\n| tu | hai preparato |\n| lui / lei | ha preparato |\n| noi | abbiamo preparato |\n| voi | avete preparato |\n| loro | hanno preparato |',
    detail:
      'Participi regolari: -are → -ato (*parlato*), -ere → -uto (*creduto*), -ire → -ito (*dormito*). Se un pronome oggetto diretto precede il participio, l’accordo segue una regola ulteriore: *le ho comprate*.',
    drills: [
      [
        'Completa: «Ieri io ___ una pizza.» (mangiare)',
        'ho mangiato',
        'sono mangiato',
        'ha mangiato',
        'Mangiare usa avere: io ho mangiato.',
      ],
      [
        'Completa: «Tu ___ un film.» (vedere)',
        'hai visto',
        'sei visto',
        'ha visto',
        'Con tu si usa hai; vedere ha il participio irregolare visto.',
      ],
      [
        'Completa: «Noi ___ la cena.» (preparare)',
        'abbiamo preparato',
        'siamo preparati',
        'hanno preparato',
        'Preparare usa avere; con noi si dice abbiamo preparato.',
      ],
      [
        'Completa: «Loro ___ una lettera.» (scrivere)',
        'hanno scritto',
        'sono scritti',
        'ha scritto',
        'Scrivere usa avere e il participio irregolare scritto.',
      ],
      [
        'Completa: «Voi ___ molto.» (dormire)',
        'avete dormito',
        'siete dormiti',
        'hanno dormito',
        'Dormire al passato prossimo usa avere: avete dormito.',
      ],
    ],
  },
  {
    slug: 'passato-prossimo-con-essere',
    title: 'Passato prossimo con essere',
    category: 'Verbs',
    level: 'A2',
    intro:
      'Molti verbi intransitivi di arrivo, partenza o cambiamento e tutti i riflessivi usano essere. Il participio concorda normalmente con il soggetto.',
    table:
      '| Soggetto | arrivare | partire |\n| --- | --- | --- |\n| Marco | è arrivato | è partito |\n| Anna | è arrivata | è partita |\n| Marco e Luca | sono arrivati | sono partiti |\n| Anna e Sara | sono arrivate | sono partite |',
    detail:
      'Impara il verbo con il suo ausiliare e nel contesto: alcuni verbi possono avere entrambi a seconda della costruzione (*sono salito al piano; ho salito le scale*). Non basta chiedersi se c’è movimento.',
    drills: [
      [
        'Completa: «Giulia ___ a Roma.» (arrivare)',
        'è arrivata',
        'ha arrivato',
        'sono arrivata',
        'Arrivare usa essere e il participio concorda con Giulia: arrivata.',
      ],
      [
        'Completa: «Paolo e Marco ___ presto.» (partire)',
        'sono partiti',
        'hanno partito',
        'è partito',
        'Partire usa essere; il soggetto maschile plurale richiede partiti.',
      ],
      [
        'Completa: «Le ragazze ___ alle sette.» (uscire)',
        'sono uscite',
        'hanno uscito',
        'sono usciti',
        'Uscire usa essere; soggetto femminile plurale: uscite.',
      ],
      [
        'Completa: «Io (donna) ___ alle otto.» (svegliarsi)',
        'mi sono svegliata',
        'ho svegliata',
        'mi ha svegliato',
        'Il riflessivo usa essere: il participio concorda con io femminile, svegliata.',
      ],
      [
        'Completa: «Il tempo ___ rapidamente.» (cambiare)',
        'è cambiato',
        'ha cambiato',
        'sono cambiati',
        'Cambiare senza oggetto indica un cambiamento e usa essere: il tempo è cambiato.',
      ],
    ],
  },
  {
    slug: 'participi-passati-irregolari',
    title: 'Participi passati irregolari frequenti',
    category: 'Verbs',
    level: 'A2',
    intro:
      'Molti participi di uso comune non seguono le desinenze regolari. Memorizzali insieme all’infinito e a una frase al passato prossimo.',
    table:
      '| Infinito | Participio | Infinito | Participio |\n| --- | --- | --- | --- |\n| fare | fatto | vedere | visto |\n| prendere | preso | essere | stato |\n| dire | detto | leggere | letto |\n| scrivere | scritto | mettere | messo |\n| aprire | aperto | venire | venuto |',
    detail:
      'Il participio irregolare si usa con l’ausiliare corretto: *ho fatto una torta; ho visto il film; sono venuti a cena*. Il participio *stato* può essere il participio di essere e stare.',
    drills: [
      [
        'Completa: «Ho ___ una torta.» (fare)',
        'fatto',
        'facito',
        'fato',
        'Fare ha il participio irregolare fatto.',
      ],
      [
        'Completa: «Abbiamo ___ quel film.» (vedere)',
        'visto',
        'vedato',
        'vedito',
        'Il participio più comune di vedere è visto.',
      ],
      [
        'Completa: «Hai ___ le chiavi?» (prendere)',
        'preso',
        'prenduto',
        'prendato',
        'Prendere ha il participio irregolare preso.',
      ],
      [
        'Completa: «Sono ___ in anticipo.» (venire, loro)',
        'venuti',
        'venuto',
        'venendo',
        'Venire usa essere e il participio concorda con il soggetto plurale: venuti.',
      ],
      [
        'Completa: «Lei ha ___ la notizia.» (dire)',
        'detto',
        'dicito',
        'diciuto',
        'Dire ha il participio irregolare detto.',
      ],
    ],
  },
  {
    slug: 'stare-gerundio',
    title: 'Presente progressivo: stare + gerundio',
    category: 'Verbs',
    level: 'A2',
    intro:
      'Per mettere in primo piano un’azione in corso in questo momento, usa il presente di stare seguito dal gerundio.',
    table:
      '| Infinito | Formazione | Gerundio |\n| --- | --- | --- |\n| parlare (-are) | -ando | parlando |\n| leggere (-ere) | -endo | leggendo |\n| dormire (-ire) | -endo | dormendo |\n| fare (irregolare) | gerundio proprio | facendo |',
    detail:
      'Coniuga *stare* secondo il soggetto: *sto studiando, stai leggendo, stanno dormendo*. Il presente semplice descrive anche abitudini e fatti attuali; non occorre usare il progressivo in ogni frase.',
    drills: [
      ['Completa: «Io ___ studiando.»', 'sto', 'stai', 'sta', 'Con io, stare al presente è sto.'],
      [
        'Completa: «Che cosa ___ leggendo?» (tu)',
        'stai',
        'sto',
        'stanno',
        'Con tu, stare è stai: che cosa stai leggendo?',
      ],
      [
        'Completa: «Loro stanno ___.» (dormire)',
        'dormendo',
        'dormando',
        'dormito',
        'I verbi in -ere/-ire formano qui il gerundio in -endo: dormendo.',
      ],
      [
        'Completa: «Noi stiamo ___.» (parlare)',
        'parlando',
        'parlendo',
        'parlato',
        'I verbi in -are formano il gerundio in -ando: parlando.',
      ],
      [
        'Completa: «Luca sta ___.» (fare)',
        'facendo',
        'fareando',
        'fatto',
        'Il gerundio irregolare di fare è facendo.',
      ],
    ],
  },
  {
    slug: 'futuro-prossimo-e-presente',
    title: 'Parlare del futuro: presente e stare per',
    category: 'Verbs',
    level: 'A2',
    intro:
      'Un evento futuro programmato si esprime spesso con il presente e un riferimento temporale. *Stare per + infinito* indica che qualcosa sta per accadere.',
    table:
      '| Struttura | Uso tipico | Esempio |\n| --- | --- | --- |\n| presente + tempo futuro | programma o appuntamento | Domani parto alle otto. |\n| stare per + infinito | imminenza | Il treno sta per partire. |\n| non stare per… | non imminenza | Non sto per uscire. |',
    detail:
      'La costruzione *stare per* si coniuga al presente o al passato, mentre il verbo principale resta all’infinito: *stiamo per iniziare; stava per piovere*. Il contesto temporale rende chiaro il valore futuro del presente.',
    drills: [
      [
        'Completa: «Domani ___ per Firenze.» (io, partire)',
        'parto',
        'partirò per',
        'partendo',
        'Il presente con domani può indicare un programma futuro: domani parto.',
      ],
      [
        'Completa: «Il film ___ per iniziare.» (stare, lui)',
        'sta',
        'stanno',
        'sei',
        'Con il soggetto singolare il verbo è sta: il film sta per iniziare.',
      ],
      [
        'Completa: «Noi ___ per entrare.»',
        'stiamo',
        'stanno',
        'siamo',
        'Con noi, stare è stiamo: stiamo per entrare.',
      ],
      [
        'Completa: «Il taxi sta per ___.»',
        'arrivare',
        'arriva',
        'arrivato',
        'Dopo stare per si usa l’infinito: arrivare.',
      ],
      [
        'Completa: «Stasera ___ con gli amici.» (voi, cenare)',
        'cenate',
        'cenando',
        'cenato',
        'Il presente con un avverbio futuro esprime un programma: stasera cenate.',
      ],
    ],
  },
  {
    slug: 'imperativo-tu',
    title: 'Imperativo informale: tu',
    category: 'Verbs',
    level: 'A2',
    intro:
      'La forma tu dell’imperativo serve per istruzioni, inviti e consigli informali. Il soggetto non si esprime e il tono dipende molto dal contesto.',
    table:
      '| Infinito | Imperativo tu | Esempio |\n| --- | --- | --- |\n| parlare | parla | Parla più lentamente. |\n| prendere | prendi | Prendi l’autobus. |\n| dormire | dormi | Dormi bene! |\n| andare / fare / dare / stare | va’ / fa’ / da’ / sta’ | Va’ a casa! |',
    detail:
      'La negazione con tu si costruisce normalmente con *non + infinito*: *Non parlare! Non uscire!* I pronomi atoni si uniscono alla forma affermativa: *dimmi, ascoltami*; con le forme tronche: *dammi, fallo*.',
    drills: [
      [
        'Dai un comando informale: «___ la porta!» (aprire)',
        'Apri',
        'Apre',
        'Aprite',
        'La forma tu dell’imperativo di aprire è apri.',
      ],
      [
        'Completa: «___ il treno per Roma.» (prendere)',
        'Prendi',
        'Prendo',
        'Prendete',
        'La forma tu è prendi.',
      ],
      [
        'Completa: «___ attenzione!» (fare)',
        'Fa’',
        'Fate',
        'Fanno',
        'La forma breve dell’imperativo tu di fare è fa’.',
      ],
      [
        'Scegli la negazione: «___ parlare!»',
        'Non',
        'Niente',
        'Mai non',
        'Con l’imperativo tu negativo si usa non + infinito: non parlare.',
      ],
      [
        'Completa: «___ a casa!» (andare, tu)',
        'Va’',
        'Vai a',
        'Vanno',
        'La forma tronca tradizionale dell’imperativo è va’.',
      ],
    ],
  },
  {
    slug: 'preposizioni-semplici',
    title: 'Preposizioni semplici',
    category: 'Prepositions',
    level: 'A1',
    intro:
      'Le preposizioni collegano parole e indicano relazioni come possesso, destinazione, provenienza, compagnia, mezzo e scopo. La scelta dipende spesso dall’espressione completa.',
    table:
      '| Preposizione | Relazioni comuni | Esempio |\n| --- | --- | --- |\n| di | possesso, origine, materia | il libro di Anna |\n| a | destinazione, ora | vado a casa; alle nove |\n| da | provenienza, persona | vengo da Roma; da Luca |\n| in | paese, mezzo, luogo | in Italia; in treno |\n| con | compagnia, strumento | con gli amici |\n| su | argomento, posizione | un libro su Roma |\n| per | scopo, durata/percorso | per studiare; per due ore |\n| tra/fra | intervallo, posizione | tra due giorni |',
    detail:
      'Molte preposizioni fanno parte di espressioni fisse (*a casa, in ufficio, da bambino, per esempio*). Impara la combinazione con il nome o il verbo e ascolta l’uso, invece di tradurre parola per parola.',
    drills: [
      [
        'Completa: «Il quaderno ___ Paolo è blu.»',
        'di',
        'a',
        'da',
        'Di indica possesso: il quaderno di Paolo.',
      ],
      [
        'Completa: «Andiamo ___ scuola a piedi.»',
        'a',
        'in',
        'da',
        'La destinazione puntuale scuola si esprime comunemente con a: a scuola.',
      ],
      ['Completa: «Vengo ___ Napoli.»', 'da', 'a', 'su', 'Da indica provenienza: vengo da Napoli.'],
      [
        'Completa: «Viaggio ___ treno.»',
        'in',
        'a',
        'con',
        'Il mezzo di trasporto si esprime comunemente con in: in treno.',
      ],
      [
        'Completa: «Studio ___ superare l’esame.»',
        'per',
        'di',
        'tra',
        'Per + infinito esprime lo scopo: per superare l’esame.',
      ],
    ],
  },
  {
    slug: 'preposizioni-articolate',
    title: 'Preposizioni articolate',
    category: 'Prepositions',
    level: 'A2',
    intro:
      'Di, a, da, in e su si fondono con l’articolo determinativo successivo. La forma risultante dipende dalla preposizione e dall’articolo.',
    table:
      '| | il | lo | la | l’ | i | gli | le |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| di | del | dello | della | dell’ | dei | degli | delle |\n| a | al | allo | alla | all’ | ai | agli | alle |\n| da | dal | dallo | dalla | dall’ | dai | dagli | dalle |\n| in | nel | nello | nella | nell’ | nei | negli | nelle |\n| su | sul | sullo | sulla | sull’ | sui | sugli | sulle |',
    detail:
      'Con *con* si trovano sia *con il* sia la forma contratta *col*; le altre contrazioni sono normalmente obbligatorie quando la preposizione è seguita da un articolo. *Per, tra/fra* non si fondono con l’articolo.',
    drills: [
      [
        'Completa: «Il gatto dorme ___ divano.» (su + il)',
        'sul',
        'sullo',
        'sulla',
        'Su + il si contrae in sul.',
      ],
      ['Completa: «Abito ___ centro.» (in + il)', 'nel', 'nello', 'nella', 'In + il forma nel.'],
      ['Completa: «Andiamo ___ stazione.» (a + la)', 'alla', 'alla la', 'al', 'A + la forma alla.'],
      [
        'Completa: «Il regalo è ___ amici.» (da + gli)',
        'dagli',
        'dai',
        'delle',
        'Da + gli forma dagli.',
      ],
      [
        'Completa: «Parliamo ___ esame.» (di + l’)',
        'dell’',
        'del',
        'dallo',
        'Di + l’ si contrae in dell’.',
      ],
    ],
  },
  {
    slug: 'preposizioni-con-luoghi',
    title: 'Preposizioni con città, paesi e luoghi',
    category: 'Prepositions',
    level: 'A1',
    intro:
      'La preposizione cambia secondo il tipo di luogo e il significato: città, paese, istituzione o destinazione convenzionale. Per i luoghi comuni conviene imparare la locuzione intera.',
    table:
      '| Luogo / relazione | Forma frequente | Esempio |\n| --- | --- | --- |\n| città | a | a Roma, a Milano |\n| paese o regione | in | in Italia, in Toscana |\n| destinazione istituzionale | a | a scuola, al lavoro |\n| destinazione con articolo | in / a + articolo | in banca; al mare |\n| provenienza | da | da Roma; dall’Italia |',
    detail:
      'I nomi di luogo includono eccezioni e collocazioni: *a casa, in ufficio, al cinema, in montagna*. Quando impari una destinazione nuova, annota insieme il nome e la sua preposizione.',
    drills: [
      [
        'Completa: «Abito ___ Roma.»',
        'a',
        'in',
        'da',
        'Con il nome di una città si usa normalmente a: a Roma.',
      ],
      [
        'Completa: «Studio ___ Italia.»',
        'in',
        'a',
        'da',
        'Con il nome di un paese si usa in: in Italia.',
      ],
      [
        'Completa: «I bambini sono ___ scuola.»',
        'a',
        'in',
        'da',
        'La locuzione comune è a scuola.',
      ],
      [
        'Completa: «Domenica andiamo ___ mare.»',
        'al',
        'a',
        'in',
        'La locuzione è al mare: a + il.',
      ],
      [
        'Completa: «Vengo ___ Italia.»',
        'dall’',
        'a',
        'nel',
        'Da + l’Italia si contrae in dall’Italia per indicare provenienza.',
      ],
    ],
  },
  {
    slug: 'preposizioni-di-luogo-e-tempo',
    title: 'Preposizioni di luogo e di tempo',
    category: 'Prepositions',
    level: 'A2',
    intro:
      'Le locuzioni spaziali collocano persone e cose; le preposizioni temporali esprimono inizio, durata, scadenza o distanza nel tempo.',
    table:
      '| Relazione | Forma | Esempio |\n| --- | --- | --- |\n| posizione più alta / più bassa | sopra / sotto | sopra il tavolo; sotto la sedia |\n| orientamento | davanti a / dietro | davanti alla scuola |\n| prossimità | vicino a / accanto a | vicino al museo |\n| inizio | da | studio qui da maggio |\n| durata / tempo futuro | per / fra-tra | per due ore; fra tre giorni |\n| ora / mese / stagione | a / in | alle otto; in luglio; in primavera |',
    detail:
      'In italiano standard si dice *da lunedì* per un’attività che continua da quel momento, e *per due ore* per la durata. *Fra* e *tra* sono equivalenti; con il futuro possono indicare il tempo che manca: *tra una settimana*.',
    drills: [
      [
        'Completa: «Il quadro è ___ il divano.» (in posizione alta)',
        'sopra',
        'sotto',
        'dietro a',
        'Sopra indica una posizione più alta.',
      ],
      [
        'Completa: «La farmacia è ___ alla banca.» (prossimità)',
        'vicino',
        'dietro',
        'sotto',
        'Vicino a indica prossimità: vicino alla banca.',
      ],
      [
        'Completa: «Studio italiano ___ gennaio.» (inizio che continua)',
        'da',
        'per',
        'fra',
        'Da indica il momento iniziale di un’attività che continua.',
      ],
      [
        'Completa: «La lezione dura ___ un’ora.»',
        'per',
        'da',
        'fra',
        'Per indica la durata complessiva: per un’ora.',
      ],
      [
        'Completa: «Ci vediamo ___ due giorni.» (tempo futuro)',
        'fra',
        'da',
        'per',
        'Fra indica quanto tempo manca a un evento futuro.',
      ],
    ],
  },
  {
    slug: 'negazione-in-italiano',
    title: 'Negazione: non, mai, niente e nessuno',
    category: 'Syntax',
    level: 'A2',
    intro:
      'La negazione più comune si forma mettendo *non* davanti al verbo. Altri elementi negativi aggiungono informazioni e in italiano possono convivere con non.',
    table:
      '| Parola | Significato | Esempio |\n| --- | --- | --- |\n| non | negazione del verbo | Non lavoro oggi. |\n| mai | in nessun momento | Non viaggio mai in agosto. |\n| niente / nulla | nessuna cosa | Non vedo niente. |\n| nessuno | nessuna persona | Non conosco nessuno. |\n| neanche / nemmeno | inclusione negativa | Non viene neanche Luca. |',
    detail:
      'Quando *nessuno* o *niente* precede il verbo, *non* normalmente scompare: *Nessuno è arrivato; niente funziona*. Dopo il verbo si usa di norma *non*: *Non ho visto nessuno*.',
    drills: [
      [
        'Completa: «___ capisco la domanda.»',
        'Non',
        'Niente',
        'Nessuno',
        'Non precede il verbo per negare la frase.',
      ],
      [
        'Completa: «Non esco ___.» (in nessun momento)',
        'mai',
        'qualcosa',
        'sempre',
        'Mai aggiunge il valore “in nessun momento” alla negazione.',
      ],
      [
        'Completa: «Non ho comprato ___.»',
        'niente',
        'qualcuno',
        'mai',
        'Niente è il pronome negativo “nessuna cosa” e segue non.',
      ],
      [
        'Completa: «___ ha telefonato.» (nessuna persona, prima del verbo)',
        'Nessuno',
        'Non nessuno',
        'Qualcuno',
        'Quando nessuno precede il verbo, di norma non serve non.',
      ],
      [
        'Completa: «Non conosco ___.» (nessuna persona)',
        'nessuno',
        'qualcuno',
        'chiunque',
        'Dopo il verbo nessuno si combina con non: non conosco nessuno.',
      ],
    ],
  },
  {
    slug: 'fare-domande',
    title: 'Domande: parole interrogative e intonazione',
    category: 'Syntax',
    level: 'A1',
    intro:
      'In italiano le domande sì/no spesso mantengono l’ordine della frase e si distinguono con l’intonazione. Le parole interrogative specificano l’informazione richiesta.',
    table:
      '| Parola | Informazione | Esempio |\n| --- | --- | --- |\n| chi | persona | Chi arriva? |\n| che cosa / cosa | oggetto o azione | Che cosa studi? |\n| dove / quando | luogo / tempo | Dove abiti? Quando parti? |\n| perché / come | motivo / modo | Perché impari? Come stai? |\n| quanto/a/i/e | quantità | Quanti anni hai? |\n| quale/i | scelta | Quale libro preferisci? |',
    detail:
      'Una domanda sì/no può essere *Abiti a Roma?* con intonazione crescente. In una domanda con parola interrogativa, questa normalmente apre la frase: *Dove abiti?*; *perché* si scrive con accento acuto.',
    drills: [
      ['Chiedi il luogo: «___ abiti?»', 'Dove', 'Quando', 'Chi', 'Dove richiede un luogo.'],
      [
        'Chiedi la persona: «___ arriva alle otto?»',
        'Chi',
        'Che cosa',
        'Quanto',
        'Chi si riferisce a una persona.',
      ],
      [
        'Chiedi il motivo: «___ studi italiano?»',
        'Perché',
        'Quando',
        'Come',
        'Perché chiede una ragione e porta l’accento acuto.',
      ],
      [
        'Chiedi una quantità plurale: «___ libri hai?»',
        'Quanti',
        'Quanto',
        'Quanta',
        'Libri è maschile plurale: quanti libri.',
      ],
      [
        'Trasforma in domanda sì/no: «Tu lavori domani?»',
        'Tu lavori domani?',
        'Dove tu lavori domani?',
        'Chi lavori domani?',
        'La domanda sì/no può mantenere l’ordine e usare l’intonazione interrogativa.',
      ],
    ],
  },
  {
    slug: 'connettivi',
    title: 'Connettivi per unire le idee',
    category: 'Syntax',
    level: 'A2',
    intro:
      'I connettivi mostrano come le idee si collegano. Scegli quello che esprime il rapporto logico desiderato: aggiunta, contrasto, alternativa, motivo o conseguenza.',
    table:
      '| Connettivo | Relazione | Esempio |\n| --- | --- | --- |\n| e | aggiunta | Studio e prendo appunti. |\n| ma | contrasto | Vorrei venire, ma lavoro. |\n| o / oppure | alternativa | Prendiamo il bus o la metro? |\n| perché | motivo | Resto perché sono stanco. |\n| quindi | conseguenza | Piove, quindi prendo l’ombrello. |\n| allora | passaggio / conseguenza nel discorso | Allora, da dove cominciamo? |',
    detail:
      '*Perché* introduce spesso una causa; *quindi* presenta una conseguenza. *Allora* può segnare una conclusione o aiutare a riprendere il filo della conversazione.',
    drills: [
      [
        'Unisci due aggiunte: «Studio ___ lavoro.»',
        'e',
        'ma',
        'perché',
        'E collega elementi aggiungendo un’informazione.',
      ],
      [
        'Esprimi un contrasto: «Vorrei uscire, ___ piove.»',
        'ma',
        'quindi',
        'o',
        'Ma introduce un contrasto tra il desiderio e la situazione.',
      ],
      [
        'Scegli un’alternativa: «Tè ___ caffè?»',
        'o',
        'perché',
        'quindi',
        'O presenta un’alternativa.',
      ],
      [
        'Completa con la causa: «Prendo l’ombrello ___ piove.»',
        'perché',
        'quindi',
        'ma',
        'Perché introduce il motivo per cui prendo l’ombrello.',
      ],
      [
        'Completa con la conseguenza: «È tardi, ___ prendiamo un taxi.»',
        'quindi',
        'perché',
        'o',
        'Quindi introduce la conseguenza del fatto che è tardi.',
      ],
    ],
  },
  {
    slug: 'numeri-cardinali-e-ordinali',
    title: 'Numeri cardinali e ordinali',
    category: 'Time',
    level: 'A1',
    intro:
      'I cardinali contano quantità; gli ordinali indicano posizione in una sequenza. I primi dieci ordinali sono molto frequenti e si accordano con il nome.',
    table:
      '| Cardinali | | Ordinali |\n| --- | --- | --- |\n| 0–10 | zero, uno, due, tre, quattro, cinque, sei, sette, otto, nove, dieci | primo, secondo, terzo, quarto, quinto, sesto, settimo, ottavo, nono, decimo |\n| 11–20 | undici, dodici, tredici, quattordici, quindici, sedici, diciassette, diciotto, diciannove, venti | undicesimo, dodicesimo… |\n| decine | trenta, quaranta, cinquanta, sessanta, settanta, ottanta, novanta | l’ordinale concorda con il nome |\n| 100 / 1.000 / 2.000 | cento / mille / duemila | primo piano, seconda volta |\n| 1.000.000 | un milione | il milionesimo visitatore |',
    detail:
      'I numeri composti si scrivono uniti: *ventuno, ventotto, trentatré*. *Uno* cambia in *un* davanti a un nome maschile (*un libro*) e in *una* al femminile (*una casa*). Gli ordinali si accordano: *il primo giorno, la prima lezione*.',
    drills: [
      [
        'Come si scrive 21?',
        'ventuno',
        'ventiuno',
        'ventiduno',
        'Davanti a uno, venti perde la vocale finale: ventuno.',
      ],
      [
        'Come si scrive 33?',
        'trentatré',
        'trenta tre',
        'trenta trè',
        'Trentatré si scrive unito e porta l’accento finale.',
      ],
      [
        'Completa: «il ___ giorno» (1º)',
        'primo',
        'prima',
        'uno',
        'L’ordinale maschile singolare è primo.',
      ],
      [
        'Completa: «la ___ volta» (2ª)',
        'seconda',
        'secondo',
        'due',
        'Volta è femminile singolare: seconda volta.',
      ],
      ['Come si dice 100?', 'cento', 'centi', 'cento uno', 'Cento è la forma del numero 100.'],
    ],
  },
  {
    slug: 'ora-giorni-date-stagioni',
    title: 'Ora, giorni, mesi e date',
    category: 'Time',
    level: 'A1',
    intro:
      'Per parlare del calendario e dell’orario usa formule convenzionali. I giorni e i mesi si scrivono con la minuscola in italiano.',
    table:
      '| Contesto | Struttura | Esempio |\n| --- | --- | --- |\n| ora | Sono le + ora | Sono le tre. |\n| una | È l’una | È l’una e mezza. |\n| minuti | e / meno | le due e un quarto; le tre meno dieci |\n| giorno | lunedì… domenica | Ci vediamo martedì. |\n| data | il + numero + mese | il 5 maggio |\n| stagione | in + stagione | in autunno |\n\n### Il calendario, tutto qui\n\n| Gruppo | Le parole |\n| --- | --- |\n| Giorni | lunedì, martedì, mercoledì, giovedì, venerdì, sabato, domenica |\n| Mesi | gennaio, febbraio, marzo, aprile, maggio, giugno, luglio, agosto, settembre, ottobre, novembre, dicembre |\n| Stagioni | primavera, estate, autunno, inverno |',
    detail:
      'Per il primo giorno del mese si usa spesso *il primo*: *il primo aprile*. I giorni della settimana possono essere usati senza articolo per un appuntamento singolo (*lunedì parto*) e con articolo per un’abitudine (*il lunedì lavoro da casa*).',
    drills: [
      [
        'Completa: «___ l’una.»',
        'È',
        'Sono',
        'Fa',
        'Per l’ora una si usa la forma singolare: è l’una.',
      ],
      [
        'Completa: «___ le otto.»',
        'Sono',
        'È',
        'Fa',
        'Con le altre ore si usa normalmente sono le.',
      ],
      [
        'Completa: «Ci vediamo ___.» (lunedì, un appuntamento singolo)',
        'lunedì',
        'il lunedì',
        'a lunedì',
        'Per un appuntamento singolo, il giorno spesso non richiede articolo.',
      ],
      [
        'Completa: «Il ___ maggio è festa.» (1)',
        'primo',
        'uno',
        'prima',
        'Per il giorno 1 del mese si usa normalmente primo.',
      ],
      [
        'Completa: «Andiamo in vacanza ___ estate.»',
        'in',
        'a',
        'da',
        'La stagione si introduce comunemente con in: in estate.',
      ],
    ],
  },
  {
    slug: 'avverbi-di-frequenza-e-tempo',
    title: 'Avverbi di frequenza e di tempo',
    category: 'Time',
    level: 'A1',
    intro:
      'Gli avverbi collocano un’azione nel tempo o indicano quanto spesso accade. Alcuni hanno una posizione flessibile; *mai* si accompagna normalmente a non.',
    table:
      '| Avverbio | Significato | Esempio |\n| --- | --- | --- |\n| sempre | ogni volta | Studio sempre la sera. |\n| spesso | molte volte | Viaggiamo spesso. |\n| di solito | abitualmente | Di solito prendo il treno. |\n| mai | in nessuna occasione | Non fumo mai. |\n| oggi / domani | giorno presente / successivo | Oggi lavoro; domani riposo. |',
    detail:
      'Gli avverbi di frequenza spesso seguono il verbo semplice (*viaggio spesso*) e precedono l’infinito o il participio in alcune costruzioni. Con *mai* si usa normalmente *non* quando segue il verbo: *non esco mai*.',
    drills: [
      [
        'Completa: «Studio ___: ogni giorno.»',
        'sempre',
        'mai',
        'raramente',
        'Sempre significa ogni volta o in ogni occasione.',
      ],
      [
        'Completa: «Vado ___ al cinema, due volte al mese.»',
        'spesso',
        'domani',
        'mai',
        'Spesso indica un’azione che avviene molte volte.',
      ],
      [
        'Completa: «___ prendo il caffè dopo pranzo.» (abitualmente)',
        'Di solito',
        'Mai',
        'Domani',
        'Di solito indica un’abitudine.',
      ],
      [
        'Completa: «Non mangio ___ carne.»',
        'mai',
        'sempre',
        'oggi',
        'Mai con non significa “in nessuna occasione”.',
      ],
      [
        'Completa: «Oggi studio; ___ viaggio.» (giorno successivo)',
        'domani',
        'ieri',
        'spesso',
        'Domani indica il giorno dopo oggi.',
      ],
    ],
  },
  {
    slug: 'confronti-e-avverbi',
    title: 'Comparativi e avverbi comuni',
    category: 'Syntax',
    level: 'A2',
    intro:
      'Il comparativo confronta persone, cose o azioni. Gli avverbi descrivono come si svolge un’azione e non concordano con il soggetto.',
    table:
      '| Struttura | Uso | Esempio |\n| --- | --- | --- |\n| più… di | confronto tra entità | Roma è più grande di Siena. |\n| più… che | confronto tra qualità/azioni | È più utile che bello. |\n| meno… di/che | quantità o qualità inferiore | Meno caro di ieri. |\n| così… come / come | uguaglianza | Veloce come il treno. |\n| bene / male | modo | Canta bene; dormo male. |',
    detail:
      'In generale *di* confronta due nomi o pronomi; *che* si usa spesso tra due aggettivi, avverbi, verbi o preposizioni. *Buono* è aggettivo; *bene* è avverbio: *un buon libro; legge bene*.',
    drills: [
      [
        'Completa: «Milano è più grande ___ Parma.»',
        'di',
        'che',
        'come',
        'Di introduce qui il secondo termine di paragone, Parma.',
      ],
      [
        'Completa: «È più facile leggere ___ scrivere.»',
        'che',
        'di',
        'come',
        'Che confronta qui due attività espresse da infiniti.',
      ],
      [
        'Completa: «Questo zaino è meno caro ___ quello.»',
        'di',
        'che',
        'come',
        'Di introduce il termine di paragone nominale.',
      ],
      [
        'Completa: «Luca parla ___ italiano.» (in modo corretto)',
        'bene',
        'buono',
        'bella',
        'Bene è l’avverbio che descrive come parla.',
      ],
      [
        'Completa: «Il caffè è ___, ma il cameriere canta bene.»',
        'buono',
        'bene',
        'buona',
        'Buono è un aggettivo che descrive il caffè maschile singolare.',
      ],
    ],
  },
  {
    slug: 'ci-e-ne-primi-passi',
    title: 'Ci e ne: primi passi',
    category: 'Pronouns',
    level: 'B1',
    intro:
      'Ci e ne possono sostituire espressioni già note. Inizia da due usi frequenti: *ci* per un luogo introdotto da a/in e *ne* per una quantità o un’espressione con di.',
    table:
      '| Pronome | Richiama spesso | Esempio |\n| --- | --- | --- |\n| ci | a/in + luogo o argomento | Vai a Roma? Sì, ci vado. |\n| ci | complemento con a | Pensi al viaggio? Sì, ci penso. |\n| ne | di + qualcosa | Parli di musica? Sì, ne parlo. |\n| ne | quantità | Vuoi dei biscotti? Ne prendo due. |',
    detail:
      'La quantità resta dopo *ne*: *Ho tre sorelle → Ne ho tre.* Ci e ne hanno altri usi idiomatici (*ci vuole tempo; ne vale la pena*); qui impara solo i riferimenti più trasparenti e ascolta il contesto.',
    drills: [
      [
        'Completa: «Vai a Roma? Sì, ___ vado domani.»',
        'ci',
        'ne',
        'lo',
        'Ci riprende il luogo introdotto da a: a Roma → ci.',
      ],
      [
        'Completa: «Parli di cinema? Sì, ___ parlo spesso.»',
        'ne',
        'ci',
        'gli',
        'Ne riprende di cinema: parlare di qualcosa → parlarne.',
      ],
      [
        'Completa: «Quanti caffè bevi? ___ bevo due.»',
        'Ne',
        'Ci',
        'Li',
        'Ne sostituisce il nome della quantità; il numero resta espresso.',
      ],
      [
        'Completa: «Pensi al tuo futuro? Sì, ___ penso.»',
        'ci',
        'ne',
        'lo',
        'Pensare a qualcosa può essere ripreso con ci.',
      ],
      [
        'Completa: «Hai delle penne? Sì, ___ ho quattro.»',
        'ne',
        'ci',
        'le',
        'Ne riprende una quantità introdotta da di/delle.',
      ],
    ],
  },
  {
    slug: 'frasi-utili-in-viaggio',
    title: 'Al ristorante e chiedere indicazioni',
    category: 'Everyday',
    level: 'A1',
    intro:
      'Le formule funzionali ti aiutano a raggiungere subito un obiettivo comunicativo. Il condizionale di cortesia rende naturali richieste in un negozio, al ristorante o per strada.',
    table:
      '| Obiettivo | Formula utile |\n| --- | --- |\n| ordinare | Vorrei un’acqua, per favore. |\n| chiedere il menu | Possiamo vedere il menù? |\n| chiedere indicazioni | Scusi, dov’è la stazione? |\n| capire il percorso | Come arrivo al museo? |\n| ringraziare | Grazie mille; molto gentile. |\n| esprimere una preferenza | Preferisco la pasta al riso. Mi piace il caffè. |',
    detail:
      'Con una persona sconosciuta usa spesso *Scusi* (Lei) per attirare l’attenzione e *per favore* per una richiesta. Per ordinare, *vorrei* è una formula cortese; alla fine puoi chiedere *Il conto, per favore*.',
    drills: [
      [
        'Ordina con cortesia: «___ un caffè, per favore.»',
        'Vorrei',
        'Voglio',
        'Volere',
        'Vorrei è la formula cortese comune per ordinare.',
      ],
      [
        'Chiedi l’ubicazione: «Scusi, ___ il museo?»',
        'dov’è',
        'quando è',
        'chi è',
        'Dov’è chiede dove si trova il museo.',
      ],
      [
        'Completa una richiesta gentile: «Il conto, ___»',
        'per favore',
        'perché',
        'di niente',
        'Per favore rende cortese la richiesta del conto.',
      ],
      [
        'Completa: «Come ___ alla stazione?»',
        'arrivo',
        'arrivi',
        'arriva',
        'Con io, arrivare al presente è arrivo.',
      ],
      [
        'Attira l’attenzione con cortesia: «___, può aiutarmi?»',
        'Scusi',
        'Scusa',
        'Scusano',
        'Scusi è la forma di cortesia per attirare l’attenzione.',
      ],
    ],
  },
];

const exampleTranslations: Record<string, string> = {
  'genere-e-plurale-dei-nomi': 'The problem is important.',
  'articoli-indeterminativi': 'A student arrives at nine.',
  'aggettivi-descrittivi': 'The girls are Italian.',
  dimostrativi: 'This book here is mine.',
  possessivi: 'My book is on the table.',
  quantificatori: 'I have many books to read.',
  'pronomi-soggetto': 'I speak Italian.',
  'pronomi-riflessivi': 'My name is Paolo.',
  'essere-e-avere': 'I am a female student.',
  'presente-verbi-regolari': 'I speak Italian.',
  'verbi-irregolari-al-presente': 'I go to work by bus.',
  'verbi-modali': 'May I open the window?',
  piacere: 'I like pasta.',
  'ce-ci-sono': 'Is there a supermarket nearby?',
  'verbi-con-cambi-ortografici': 'You look up a word in the dictionary.',
  'passato-prossimo-con-avere': 'Yesterday I ate a pizza.',
  'passato-prossimo-con-essere': 'Giulia arrived in Rome.',
  'participi-passati-irregolari': 'I made a cake.',
  'stare-gerundio': 'I am studying.',
  'futuro-prossimo-e-presente': 'Tomorrow I am leaving for Florence.',
  'imperativo-tu': 'Open the door!',
  'preposizioni-semplici': 'Paolo’s notebook is blue.',
  'preposizioni-articolate': 'The cat sleeps on the sofa.',
  'preposizioni-con-luoghi': 'I live in Rome.',
  'preposizioni-di-luogo-e-tempo': 'The painting is above the sofa.',
  'negazione-in-italiano': 'I do not understand the question.',
  'fare-domande': 'Where do you live?',
  connettivi: 'I study and work.',
  'numeri-cardinali-e-ordinali': 'Twenty-one.',
  'ora-giorni-date-stagioni': 'It is one o’clock.',
  'avverbi-di-frequenza-e-tempo': 'I always study: every day.',
  'confronti-e-avverbi': 'Milan is bigger than Parma.',
  'ci-e-ne-primi-passi': 'Are you going to Rome? Yes, I am going there tomorrow.',
  'frasi-utili-in-viaggio': 'I would like a coffee, please.',
};

function drillsFor(lesson: Lesson): Exercise[] {
  return lesson.drills.map(([prompt, answer, choice1, choice2, explanation], index) => {
    const type = index === 1 || index === 3 ? 'fill_in_the_blank' : 'multiple_choice';
    if (type === 'fill_in_the_blank')
      return { type, prompt, correctAnswer: answer, explanation } as Exercise;
    return {
      type: 'multiple_choice',
      prompt,
      options: [answer, choice1, choice2].filter(
        (option, i, options) => options.indexOf(option) === i,
      ),
      correctAnswer: answer,
      explanation,
    } as Exercise;
  });
}

export const additionalTopics: Topic[] = lessons.map((lesson) =>
  defineTopic({
    slug: lesson.slug,
    title: lesson.title,
    cefrLevel: lesson.level,
    category: lesson.category,
    estimatedMinutes: 12,
    theoryMarkdown: String.raw`# ${lesson.title}

> [!NOTE] 📍 Il punto di partenza
> ${lesson.intro}

## 🧭 La mappa della regola

${lesson.table}

> [!TIP] ✨ Una strategia utile
> Leggi l’intera espressione, individua la parola che guida la scelta e controlla genere, numero e persona prima di completare la frase.

### 🔎 Apri la nota di approfondimento

<details>
<summary>La regola nel contesto</summary>

${lesson.detail}

</details>

## 🔊 Ascolta e osserva

<AudioButton phrase="${lesson.drills[0][1]}" label="Ascolta: ${lesson.drills[0][1]}" />

## 🧠 Ripasso attivo

- [ ] Spiega la regola con parole tue.
- [ ] Copri la tabella e crea due esempi.
- [ ] Torna alle eccezioni quando correggi un errore.

<Flashcard front="${lesson.title}: qual è la regola chiave?" back="${lesson.intro}" />

## 📚 Nota editoriale

Regole presentate in forma sintetica, con esempi redazionali. I riferimenti Treccani verificati per l’avvio del percorso sono raccolti nella [guida redazionale](../../docs/content-authoring.md).
`,
    keyRules: [
      {
        ruleTitle: lesson.title,
        explanation: lesson.intro,
        italianExample: (lesson.drills[0][0].match(/«([^»]+)»/)?.[1] || lesson.drills[0][1])
          .replace(/\s*\([^)]*\)/g, '')
          .replace(/___/g, lesson.drills[0][1]),
        englishTranslation: exampleTranslations[lesson.slug]!,
      },
    ],
    exercises: drillsFor(lesson),
  }),
);
