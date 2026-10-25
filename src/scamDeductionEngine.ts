/**
 * @fileoverview Heuristic Scam Deduction & Contextual Template Manager for MoniBuddy.
 * Deterministically maps detected threat signals from `scamParser.ts` to pre-configured
 * Scam Context Templates, enforces tiered friction (`NONE`, `PASSIVE_MICROCOPY`, `VOICE_CONFIRMATION_MODAL`),
 * supports Shadow Mode rule evaluation, and generates multilingual voice warning scripts
 * across English (`en`), isiZulu (`zu`), isiXhosa (`xh`), Sesotho (`st`), Afrikaans (`af`), and Sepedi (`nso`).
 */

import {
  DetectedThreatSignal,
  FrictionTier,
  ScamEvaluationOptions,
  ScamParserEvaluation,
  TransactionTelemetryPayload,
  evaluateScamRisk,
  sanitizeTelemetry
} from './scamParser';

export type ScamTemplateId =
  | 'TEMPLATE_PREDATORY_LENDER'
  | 'TEMPLATE_IMPERSONATION_URGENT'
  | 'TEMPLATE_UNAUTHORIZED_AGENT_FEE'
  | 'TEMPLATE_GENERAL_SAFE';

export type SupportedWarningLanguage = 'en' | 'zu' | 'xh' | 'st' | 'af' | 'nso';

export interface LocalizedTextMap {
  readonly en: string;
  readonly zu: string;
  readonly xh: string;
  readonly st: string;
  readonly af: string;
  readonly nso: string;
}

export interface LocalizedActionStepsMap {
  readonly en: readonly string[];
  readonly zu: readonly string[];
  readonly xh: readonly string[];
  readonly st: readonly string[];
  readonly af: readonly string[];
  readonly nso: readonly string[];
}

export interface ScamContextTemplate {
  readonly templateId: ScamTemplateId;
  readonly title: LocalizedTextMap;
  readonly summary: LocalizedTextMap;
  readonly reportingAuthority: string;
  readonly reportingContact: string;
  readonly recommendedActions: LocalizedActionStepsMap;
  /** Plain-language, TTS-ready audio warning templates with optional `{amount}` / `{maxFee}` slots. */
  readonly audioScriptTemplate: LocalizedTextMap;
}

export interface ContextualIncidentReportPayload {
  readonly reportId: string;
  readonly createdAtIso: string;
  readonly deducedTemplateId: ScamTemplateId;
  readonly deducedScamTitle: string;
  /** Normalized risk score (0.0 – 1.0). */
  readonly riskScore: number;
  readonly severity: ScamParserEvaluation['severity'];
  readonly frictionTier: FrictionTier;
  /** True when `riskScore >= 0.70` (triggers VoiceConfirmationModal). */
  readonly recommendedBlockTransfer: boolean;
  readonly reportingAuthority: string;
  readonly reportingHotline: string;
  readonly transactionMetadata: {
    readonly transactionId: string;
    readonly recipientId: string;
    readonly recipientName: string;
    readonly amountZar: number;
    readonly recipientAccountAgeDays: number;
    readonly isNewlyAddedRecipient: boolean;
    readonly recentTransferCountLastHour: number;
    readonly operationType: string;
    readonly agentFeeChargedZar: number | null;
  };
  readonly detectedTriggerKeywords: readonly string[];
  readonly triggeredRuleIds: readonly string[];
  readonly shadowLoggedRuleIds: readonly string[];
  readonly obfuscationIndicators: readonly string[];
  readonly localizedActionSteps: readonly string[];
  readonly audioWarningScripts: LocalizedTextMap;
  readonly activeAudioScript: string;
  readonly userNarrativeSummary: string;
}

export interface ScamDeductionResult {
  readonly template: ScamContextTemplate;
  readonly evaluation: ScamParserEvaluation;
  readonly frictionTier: FrictionTier;
  readonly requiresVoiceConfirmationModal: boolean;
  readonly localizedTitle: string;
  readonly localizedSummary: string;
  readonly localizedActions: readonly string[];
  readonly audioWarningScripts: LocalizedTextMap;
  readonly activeAudioScript: string;
  readonly incidentReport: ContextualIncidentReportPayload;
}

/**
 * Deterministic Scam Context Templates for offline heuristic deduction and dispute auto-population.
 */
export const SCAM_CONTEXT_TEMPLATES: Readonly<Record<ScamTemplateId, ScamContextTemplate>> = {
  TEMPLATE_PREDATORY_LENDER: {
    templateId: 'TEMPLATE_PREDATORY_LENDER',
    title: {
      en: 'Predatory Micro-Loan / Advance-Fee Trap',
      zu: 'Umkhonyovu Wemalimboleko Yamanga (Imali Yokuvula)',
      xh: 'Ubuqhophololo Bemali-mboleko (Imali Yokuvula Ngaphambili)',
      st: 'Bomenemene ba Kadimo ea Chelete (Tefo ea Pele)',
      af: 'Roof-lening / Vooraf-fooi Slaggat',
      nso: 'Boradia bja Kadimo ya Tšhelete ya Tebogo ya Pele'
    },
    summary: {
      en: 'Registered South African credit providers NEVER demand an upfront admin, release, or voucher fee before paying out a loan, and are prohibited from holding your SASSA or bank card.',
      zu: 'Abambolekisi bemali abasemthethweni abaze bacele imali yokuvula noma ivawusha ngaphambi kokukhipha imalimboleko, futhi akuvumelekile ukuthi bagcine ikhadi lakho lakwa-SASSA.',
      xh: 'Ababolekisi bemali ababhalisiweyo abaze bafune imali yokuvula okanye ivawutsha phambi kokukhupha imali-mboleko, kwaye akuvumelekanga ukuba bagcine ikhadi lakho lakwa-SASSA.',
      st: 'Bafani ba likalimo ba ngolisitsoeng ha ba batle tefo ea admin kapa voucher pele ba lefa kalimo, ebile ha ho molaong ho tšoara karete ea hau ea SASSA.',
      af: 'Geregistreerde Suid-Afrikaanse kredietverskaffers vra NOOIT ’n vooraf-adminfooi of bewys (voucher) voordat ’n lening uitbetaal word nie, en mag nooit jou SASSA- of bankkaart hou nie.',
      nso: 'Baabi ba dikadimo ba semolao ga ba nke ba nyaka tefo ya go bula pele ba ntšha kadimo, gomme ga ba dumelelwe go swara karata ya gago ya SASSA.'
    },
    reportingAuthority: 'National Credit Regulator (NCR) & SAPS Crime Stop',
    reportingContact: '0860 627 627 / 08600 10111',
    recommendedActions: {
      en: [
        'Stop immediately: Do NOT pay any processing, admin, or voucher release fee.',
        'Never hand over your SASSA card, ID book, or secret PIN to a mashonisa or online lender.',
        'Verify the lender with the National Credit Regulator (NCR) on 0860 627 627.',
        'Use your MoniBuddy Emergency Fund instead of high-interest unregulated loans.'
      ],
      zu: [
        'Yima ngokushesha: UNGAKHOKHI mali yokuvula, i-admin fee, noma ivawusha.',
        'Ungaze unikeze umashonisa ikhadi lakho lakwa-SASSA, umazisi (ID), noma i-PIN yakho.',
        'Qinisekisa umbolekisi kwa-National Credit Regulator (NCR) ku-0860 627 627.',
        'Sebenzisa Isikhwama Esiphuthumayo se-MoniBuddy esikhundleni sokuboleka komashonisa.'
      ],
      xh: [
        'Yima ngoko nangoko: UNGAHLALELI mali yokuvula, eye-admin, okanye ivawutsha.',
        'Ungaze unike umashonisa ikhadi lakho lakwa-SASSA, incwadi yesazisi (ID), okanye i-PIN.',
        'Qinisekisa umbolekisi kwi-National Credit Regulator (NCR) ku-0860 627 627.',
        'Sebenzisa iSikhuseli sikaXakeka se-MoniBuddy endaweni yokuboleka koomashonisa.'
      ],
      st: [
        'Ema hang-hang: SE KE UA lefa tefo ea admin kapa voucher ho lokolla kalimo.',
        'Le ka mohla u se ke ua fa mashonisa karete ea SASSA, bukana ea ID, kapa PIN ea hau.',
        'Netefatsa mofani oa kalimo ho National Credit Regulator (NCR) ho 0860 627 627.',
        'Sebelisa Letlole la Tšohanyetso la MoniBuddy ho qoba likalimo tse tsoala e phahameng.'
      ],
      af: [
        'Stop dadelik: Moet GEEN verwerkings-, admin- of vrystellingsbewys betaal nie.',
        'Moet nooit jou SASSA-kaart, ID-boek of geheime PIN aan ’n mashonisa oorhandig nie.',
        'Bevestig die uitlener by die Nasionale Kredietreguleerder (NCR) by 0860 627 627.',
        'Gebruik jou MoniBuddy Noodfonds in plaas van ongereguleerde woekerlenings.'
      ],
      nso: [
        'Ema gonabjale: O SE KE wa lefa tefo ya admin goba voucher go lokolla kadimo.',
        'O se ke wa fa motho karata ya gago ya SASSA, pukwana ya boitsebišo (ID), goba PIN.',
        'Netefatša moabi wa kadimo go National Credit Regulator (NCR) mo go 0860 627 627.',
        'Šomiša Letlole la Tšhoganetšo la MoniBuddy go efoga dikadimo tša tswalo ya godimo.'
      ]
    },
    audioScriptTemplate: {
      en: 'Warning: Never pay a fee to receive a loan. Legitimate lenders deduct regulated fees inside the loan agreement and never ask for vouchers or upfront deposits. This matches an advance-fee scam.',
      zu: 'Isixwayiso: Ungaze ukhokhe imali kuqala ukuze uthole imalimboleko. Abambolekisi abasemthethweni abaceli idiphozithi noma amavawusha ngaphambili. Lona ngumkhonyovu ojwayelekile.',
      xh: 'Isilumkiso: Ungaze uhlawule imali kuqala ukuze ufumane imali-mboleko. Ababolekisi abasemthethweni abaceli idiphozithi okanye iivawutsha kwangaphambili.',
      st: 'Tlhokomeliso: Se ke ua lefa chelete pele ho fumana kalimo. Bafani ba molaong ha ba kope litefo tsa pele kapa li-voucher.',
      af: 'Waarskuwing: Moet nooit ’n fooi vooraf betaal om ’n lening te kry nie. Wettige kredietverskaffers vra nooit vir bewyse of vooraf-deposito’s nie.',
      nso: 'Temošo: O se ke wa lefa tšhelete pele gore o hwetše kadimo. Baabi ba semolao ga ba kgopele ditefo tša pele goba di-voucher. Ye ke boradia bjo bo tlwaelegilego.'
    }
  },

  TEMPLATE_IMPERSONATION_URGENT: {
    templateId: 'TEMPLATE_IMPERSONATION_URGENT',
    title: {
      en: 'Urgent Impersonation / Social Engineering Alert',
      zu: 'Umkhonyovu Wokuzenza Isikhulu Noma Isimo Esiphuthumayo',
      xh: 'Ubuqhophololo Bokuzenza Igosa Okanye Imeko Engxamisekileyo',
      st: 'Tlhokomeliso ea Boikaketsi le Tšohanyetso ea Bohata',
      af: 'Dringende Voordoenings- of Manipulasie-waarskuwing',
      nso: 'Boradia bja go Itira Mohlankedi ka Tšhoganetšo'
    },
    summary: {
      en: 'High-pressure urgency cues combined with official entity impersonation (SASSA, bank fraud desk, police, or hospital crisis) targeting an unverified or newly added recipient.',
      zu: 'Amagama akuxhamazelisayo ahambisana nokuzenza isikhulu sakwa-SASSA, ibhange, amaphoyisa noma isibhedlela ukuze uthumele imali ku-akhawunti entsha engaqinisekisiwe.',
      xh: 'Amagama abangela uloyiko nokungxama edityaniswa nokuzenza igosa lakwa-SASSA, ibhanki, amapolisa okanye isibhedlele ukuthumela imali kumntu ongaziwayo.',
      st: 'Mantsoe a u tšosang ka potlako a kopantsoeng le ho iketsa ofisiri ea SASSA, banka, sepolesa kapa sepetlele ho romela chelete ho motho e mocha.',
      af: 'Hoëdruk-dringendheid gekombineer met voordoen as SASSA, ’n bank-bedrogafdeling, polisie of hospitaalkrisis na ’n onbekende ontvanger.',
      nso: 'Mantšu a go go tšhošetša ka tšhoganetšo a kopane le go itira mohlankedi wa SASSA, panka, maphodisa goba sepetlele go akhaonto ye mpsha.'
    },
    reportingAuthority: 'SABRIC Bank Fraud Helpline & SASSA Fraud',
    reportingContact: '0860 101 248 / 0800 60 10 11',
    recommendedActions: {
      en: [
        'Pause for 5 minutes: Scammers manufacture panic so you transfer money before verifying.',
        'Hang up and call your family member, bank (number on the back of your card), or SASSA (0800 60 10 11) directly.',
        'Do NOT click unofficial links or reverse alleged "mistaken eWallet" SMS deposits.',
        'Block and report this recipient number before sending any funds.'
      ],
      zu: [
        'Thatha imizuzu emihlanu ucabange: Abakhohlisi bakufaka uvalo ukuze uthumele imali ungakaqinisekisi.',
        'Vala ucingo bese ushayela ilungu lomndeni, ibhange lakho (inombolo engemuva kwekhadi), noma i-SASSA (0800 60 10 11) ngqo.',
        'UNGACINDEZELI izixhumanisi zamanga futhi ungabuyiseli imali ye-SMS ye-eWallet mbumbulu.',
        'Vimba futhi ubike le nombolo ngaphambi kokuthumela imali.'
      ],
      xh: [
        'Phumla imizuzu emihlanu: Abaqhophololienza uloyiko ukuze uthumele imali ungakhange uqinisekise.',
        'Beka ifowuni uze ufowunele ilungu losapho, ibhanki yakho, okanye u-SASSA (0800 60 10 11) ngqo.',
        'UNGACOFI amakhonkco obuxoki kwaye ungabuyiseli mali ye-SMS ye-eWallet yobuxoki.',
        'Thintela kwaye uxele le nombolo phambi kokuthumela imali.'
      ],
      st: [
        'Ema metsotso e mehlano: Bomenemene bo baka letšoho hore u romele chelete pele u netefatsa.',
        'Khaola mohala u letsetse lelapa, banka ea hau, kapa SASSA (0800 60 10 11) ka kotloloho.',
        'SE KE UA tobetsa li-link tsa bohata kapa ho khutlisa chelete ea SMS ea bohata ea eWallet.',
        'Thibela le ho tlaleha nomoro ena pele u romela chelete.'
      ],
      af: [
        'Wag 5 minute: Swendelaars skep paniek sodat jy geld stuur voordat jy dit bevestig.',
        'Lê neer en skakel jou familielid, jou bank (nommer agterop jou kaart), of SASSA (0800 60 10 11) direk.',
        'Moet NIE op onamptelike skakels klik of beweerde foutiewe eWallet-deposito’s terugstuur nie.',
        'Blokkeer en rapporteer hierdie nommer voordat jy enige geld stuur.'
      ],
      nso: [
        'Khutša metsotso ye mehlano: Baradia ba hlola letšhogo gore o romele tšhelete o sa netefatša.',
        'Kgaola mogala gomme o leletše leloko la lapa, panka ya gago (nomoro ya ka morago ga karata), goba SASSA (0800 60 10 11) thwii.',
        'O SE KE wa kgotla di-link tša bofora goba wa bušetša tšhelete ya SMS ya bofora ya eWallet.',
        'Thibela le go bega nomoro ye pele o romela tšhelete.'
      ]
    },
    audioScriptTemplate: {
      en: 'Warning: Slow down and verify first. This message uses urgent panic tactics or pretends to be SASSA, the police, or your bank. Hang up and call the official helpline directly before sending {amount}.',
      zu: 'Isixwayiso: Yehlisa umoya uqinisekise kuqala. Lo mlayezo usebenzisa uvalo noma uzenza abakwa-SASSA, amaphoyisa, noma ibhange lakho. Vala ucingo ushayele inombolo esemthethweni ngaphambi kokuthumela u-{amount}.',
      xh: 'Isilumkiso: Yehlisa umoya uqinisekise kuqala. Lo myalezo usebenzisa uloyiko okanye uzenza u-SASSA, amapolisa, okanye ibhanki yakho. Fowunela inombolo esemthethweni phambi kokuthumela u-{amount}.',
      st: 'Tlhokomeliso: Theola maikutlo u netefatse pele. Molaetsa ona o sebelisa letšoho kapa o iketsa SASSA, sepolesa, kapa banka ea hau. Letsetsa nomoro ea semmuso pele u romela {amount}.',
      af: 'Waarskuwing: Haal asem en bevestig eers. Hierdie boodskap gebruik paniektaktieke of gee voor om SASSA, die polisie of jou bank te wees. Skakel die amptelike hulplyn direk voordat jy {amount} stuur.',
      nso: 'Temošo: Theoša maswafo o netefatše pele. Molaetša wo o šomiša letšhogo goba o itira SASSA, maphodisa, goba panka ya gago. Leletša nomoro ya semolao pele o romela {amount}.'
    }
  },

  TEMPLATE_UNAUTHORIZED_AGENT_FEE: {
    templateId: 'TEMPLATE_UNAUTHORIZED_AGENT_FEE',
    title: {
      en: 'Unauthorized Agent Fee / Cash-Out PIN Extortion',
      zu: 'Ukukhokhiswa Ngokungemthetho Kwe-Agent Noma Ukucelwa Kwe-PIN',
      xh: 'Intlawulo Engavumelekanga Ye-Arhente Okanye Ukucelwa Kwe-PIN',
      st: 'Tefo e Seng Molaong ea Moemeli Kapa Kopo ea PIN',
      af: 'Ongemagtigde Agentfooi / Kontant-uitbetaling PIN-afpersing',
      nso: 'Tefo ye e sa Dumelelwago ya Agent Goba Kgopelo ya PIN'
    },
    summary: {
      en: 'Detected an excessive cash-out surcharge above the reference retail tariff tier or a demand to disclose your secret PIN / One-Time PIN (OTP) to an agent.',
      zu: 'Kubanjwe imali engaphezulu kwemali esemthethweni yokukhipha imali noma isicelo sokuthi unikeze i-agent i-PIN yakho eyimfihlo noma i-OTP.',
      xh: 'Kufunyenwe intlawulo engaphezulu kwexabiso eliqhelekileyo lokukhupha imali okanye isicelo sokunika i-arhente i-PIN yakho okanye i-OTP.',
      st: 'Ho fumanoe tefo e phahameng ea ho ntša chelete kapa kopo ea ho fa moemeli PIN ea hau ea lekunutu kapa OTP.',
      af: '’n Oormatige kontant-onttrekkingsfooi bo die verwysingstarief of ’n versoek om jou geheime PIN of OTP met ’n agent te deel is opgespoor.',
      nso: 'Go lemogilwe tefo ya godimo ga kelo ya semolao ya go ntšha tšhelete goba kgopelo ya go fa agent PIN ya gago ya sephiri goba OTP.'
    },
    reportingAuthority: 'Banking Ombud & Mobile Network Fraud Desk',
    reportingContact: '0860 800 900 / 0860 101 248',
    recommendedActions: {
      en: [
        'Refuse to pay unofficial "extra cash-out" or "system offline" surcharges above {maxFee}.',
        'Shield your keypad: NEVER read out or hand your 4/5-digit PIN or OTP to a spaza or kiosk agent.',
        'Cancel the cash-out and use an official retail till (Shoprite, Pick n Pay, Boxer) or bank ATM.',
        'Save this incident report to flag the agent terminal ID.'
      ],
      zu: [
        'Nqaba ukukhokha imali engaphezulu kuka-{maxFee} yokukhipha imali okungeyona esemthethweni.',
        'Fihla izinombolo zakho: UNGAZE usho noma unikeze i-agent i-PIN yakho noma i-OTP.',
        'Khansela ukukhipha imali usebenzise ithili esemthethweni (Shoprite, Pick n Pay, Boxer) noma i-ATM.',
        'Gcina lo mbiko ukuze kubikwe leyo agent.'
      ],
      xh: [
        'Yala ukuhlawula intlawulo engaphezulu kuka-{maxFee} yokukhupha imali.',
        'Khusela amaqhosha: UNGAZE uxelele i-arhente i-PIN yakho okanye i-OTP.',
        'Rhoxisa uze usebenzise itili yasevenkileni (Shoprite, Pick n Pay, Boxer) okanye i-ATM.',
        'Gcina le ngxelo ukuze i-arhenteixelwe.'
      ],
      st: [
        'Hana ho lefa tefo e ka holimo ho {maxFee} ha u ntša chelete.',
        'Sireletsa linotlolo: SE KE UA bolella moemeli PIN ea hau kapa OTP.',
        'Hlakola tšebetso ena u sebelise Shoprite, Pick n Pay, Boxer kapa ATM ea banka.',
        'Boloka tlaleho ena ho tlaleha moemeli eo.'
      ],
      af: [
        'Weier om onamptelike ekstra kontant-onttrekkingsfooie bo {maxFee} te betaal.',
        'Beskerm jou sleutelbord: Moet NOOIT jou PIN of OTP vir ’n winkel- of kiosk-agent gee nie.',
        'Kanselleer die onttrekking en gebruik ’n amptelike kasregister (Shoprite, Pick n Pay, Boxer) of OTM.',
        'Stoor hierdie verslag om die agent aan te meld.'
      ],
      nso: [
        'Gana go lefa tefo ya tlaleletšo ya ka godimo ga {maxFee} ge o ntšha tšhelete.',
        'Šireletša dinomoro tša gago: O SE KE wa botša agent PIN ya gago ya sephiri goba OTP.',
        'Khansela modiro wo gomme o šomiše lebenkele la semolao (Shoprite, Pick n Pay, Boxer) goba ATM.',
        'Romela pego ye go bega agent yeo.'
      ]
    },
    audioScriptTemplate: {
      en: 'Warning: Do not hand over your PIN or pay extra cash-out fees. The typical reference cap for this withdrawal is {maxFee}. Never share your One-Time PIN with any agent.',
      zu: 'Isixwayiso: Unganikezi muntu i-PIN yakho futhi ungakhokhi imali engaphezulu. Imali ejwayelekile ephezulu yokukhipha le mali ngu-{maxFee}. Ungaze wabelane nge-OTP yakho ne-agent.',
      xh: 'Isilumkiso: Unganiki mntu i-PIN yakho kwaye ungahlawuli imali engaphezulu kuka-{maxFee}. Ungaze wabelane nge-OTP yakho.',
      st: 'Tlhokomeliso: Se ke ua fana ka PIN ea hau kapa ho lefa tefo e fetang {maxFee}. Le ka mohla u se ke ua arolelana OTP ea hau.',
      af: 'Waarskuwing: Moenie jou PIN oorhandig of ekstra fooie bo {maxFee} betaal nie. Deel nooit jou eenmalige PIN met enige agent nie.',
      nso: 'Temošo: O se ke wa fa motho PIN ya gago goba wa lefa tefo ya tlaleletšo. Tefo ya godimo ya semolao ke {maxFee}. O se ke wa abelana ka OTP ya gago le agent.'
    }
  },

  TEMPLATE_GENERAL_SAFE: {
    templateId: 'TEMPLATE_GENERAL_SAFE',
    title: {
      en: 'No Known Scam Pattern Matched',
      zu: 'Azikho Izimpawu Zomkhonyovu Ezaziwayo Ezitholiwe',
      xh: 'Akukho Mqondiso Wobuqhophololo Waziwayo Ufunyenweyo',
      st: 'Ha ho Letšoao le Tsebahalang la Bomenemene le Fumanoeng',
      af: 'Geen Bekende Swendelpatroon Opgespoor Nie',
      nso: 'Ga go na Maano a Boradia a a Lemogilwego'
    },
    summary: {
      en: 'No known advance-fee, impersonation, or agent extortion rules matched this text. Because new scams appear daily, still verify the recipient independently before sending cash.',
      zu: 'Azikho izimpawu zomkhonyovu ezaziwayo ezitholiwe kulo mlayezo. Ngenxa yokuthi imikhonyovu emisha iyavela nsuku zonke, qinisekisa umuntu othumela kuye imali ngaphambi kokukhokha.',
      xh: 'Akukho miqondiso yobuqhophololo yaziwayo ifunyenweyo. Ngenxa yokuba ubuqhophololo obutsha buyavela yonke imihla, qinisekisa umntu ngaphambi kokuthumela imali.',
      st: 'Ha ho matšoao a bomenemene a fumanoeng molaetseng ona. Kaha bomenemene bo bocha bo hlaha letsatsi le leng le le leng, netefatsa moamoheli pele u lefa.',
      af: 'Geen bekende vooraf-fooi-, voordoenings- of afpersingspatrone het gepas nie. Nuwe swendelary ontstaan daagliks — bevestig steeds die ontvanger onafhanklik voordat jy betaal.',
      nso: 'Ga go na dika tša boradia tše di lemogilwego. Netefatša dintlha tša moamogedi ka mehla pele o romela tšhelete.'
    },
    reportingAuthority: 'SABRIC Fraud Prevention',
    reportingContact: '0860 101 248',
    recommendedActions: {
      en: [
        'Double-check the recipient mobile or account number via a separate call before paying.',
        'Keep your bank PIN and One-Time PIN (OTP) strictly private at all times.'
      ],
      zu: [
        'Hlola kabusha inombolo yocingo noma eye-akhawunti ngocingo olwehlukile ngaphambi kokuqinisekisa.',
        'Gcina i-PIN yakho yasebhange kanye ne-OTP kuyimfihlo ngaso sonke isikhathi.'
      ],
      xh: [
        'Qinisekisa inombolo yefowuni okanye eye-akhawunti ngokufowuna ngqo phambi kokuhlawula.',
        'Gcina i-PIN yakho yebhanki kunye ne-OTP ziyimfihlo ngalo lonke ixesha.'
      ],
      st: [
        'Hlahloba hape nomoro ea mohala kapa ea akhaonto pele u netefatsa tefo.',
        'Boloka PIN ea hau ea banka le OTP e le lekunutu ka linako tsohle.'
      ],
      af: [
        'Kontroleer die ontvanger se selfoon- of rekeningnommer voor jy betaal.',
        'Hou jou bank-PIN en eenmalige PIN (OTP) te alle tye streng privaat.'
      ],
      nso: [
        'Lekola gape nomoro ya mogala goba akhaonto pele o tiišetša.',
        'Boloka PIN ya gago ya panka le OTP e le sephiri ka mehla.'
      ]
    },
    audioScriptTemplate: {
      en: 'No known scam rules matched this message, but passing a local pattern check never guarantees safety. Confirm the recipient independently and keep your secret PIN private.',
      zu: 'Azikho izimpawu zomkhonyovu ezaziwayo ezitholiwe, kodwa hlala uqinisekisa umuntu ngaphambi kokuthumela imali futhi ugcine i-PIN yakho iyimfihlo.',
      xh: 'Akukho miqondiso yobuqhophololo ifunyenweyo, kodwa qinisekisa umntu ngaphambi kokuthumela imali uze ugcine i-PIN yakho iyimfihlo.',
      st: 'Ha ho matšoao a bomenemene a fumanoeng, empa netefatsa moamoheli ka mehla pele u romela chelete mme u boloke PIN e le lekunutu.',
      af: 'Geen bekende swendelpatrone is gevind nie, maar bevestig steeds die ontvanger self en hou jou PIN geheim.',
      nso: 'Ga go na dika tša boradia tše di lemogilwego. Gopola go boloka PIN ya gago e le sephiri ka mehla.'
    }
  }
};

const DEFAULT_AMOUNT_FALLBACK: LocalizedTextMap = {
  en: 'any money',
  zu: 'noma iyiphi imali',
  xh: 'nayiphi na imali',
  st: 'chelete efe kapa efe',
  af: 'enige geld',
  nso: 'tšhelete efe goba efe'
};

const DEFAULT_MAX_FEE_FALLBACK: LocalizedTextMap = {
  en: 'the official tariff',
  zu: 'umkhawulo osemthethweni',
  xh: 'ixabiso elisemthethweni',
  st: 'tefiso ea semmuso',
  af: 'die amptelike tarief',
  nso: 'tefelo ya semolao'
};

export const SEPEDI_SCAM_BANNER_COPY = {
  highRiskTitle:
    'Temošo ye Kotsi ya Boradia — Ema gomme o se ke wa Romela Tšhelete goba Voucher',
  highRiskBody:
    'Dika tše dintši tša boradia di lemogilwe kgopelong ye. O se ke wa lefa tefo ya pele ya kadimo goba mošomo, o se ke wa fa motho PIN goba OTP ya gago, gomme o netefatše ka nomoro ya semolao pele.',
  cautionTitle: 'Temošo ya Tlhokomelo — Go Lemogilwe Dika tše di Belaetšago',
  cautionBody:
    'Theoša maswafo o netefatše ka bowena: Baradia ba šomiša lebelo le dinomoro tše di sa tsebjego go go akgofiša. Leletša motho thwii pele o lefa.'
} as const;

const LOCALIZED_RULE_DESCRIPTIONS: Readonly<Record<string, LocalizedTextMap>> = {
  RULE_PREDATORY_UPFRONT_FEE: {
    en: 'Demands an upfront processing, admin, job uniform, or release fee before paying out.',
    zu: 'Ifuna imali yokuvula ngaphambili (i-admin fee, imifaniswano yomsebenzi, noma ivawusha) ngaphambi kokukhipha imali.',
    xh: 'Ifuna intlawulo yokuvula ngaphambili (i-admin, iimpahla zomsebenzi, okanye ivawutsha) phambi kokuhlawula.',
    st: 'E batla tefiso ea pele (admin, junifomo ea mosebetsi, kapa vouche) pele e ntša chelete.',
    af: 'Eis ’n vooraf-verwerkings-, admin-, werkuniform- of vrystellingsfooi voor uitbetaling.',
    nso: 'E nyaka tefo ya pele ya admin, yunifomo ya mošomo goba voucher pele tšhelete e ntšhwa.'
  },
  RULE_PREDATORY_UNREALISTIC_TERMS: {
    en: 'Promises guaranteed instant loans without credit checks, compounding mashonisa interest, WhatsApp stokvel multipliers, or SASSA card confiscation.',
    zu: 'Ithembisa izikweletu ezisheshayo ngaphandle kokuhlolwa, inzalo kamashonisa ekhula nsuku zonke, izitokofela ze-WhatsApp eziphinda imali, noma ukuthathwa kwekhadi le-SASSA.',
    xh: 'Ithembisa iimboleko ezikhawulezayo ngaphandle kokuhlolwa, inzala kamashonisa, izitokfela ze-WhatsApp eziphinda imali, okanye ukuthathwa kwekhadi le-SASSA.',
    st: 'E tšepisa likalimo tsa hang-hang ntle le tlhahlobo, tsoala ea mashonisa ea letsatsi le letsatsi, stokvel sa WhatsApp se imenneng, kapa ho nka karete ea SASSA.',
    af: 'Beloof kitslenings sonder krediettoetse, daaglikse mashonisa-rente, WhatsApp-stokvelvermenigvuldigers of SASSA-kaartterughouding.',
    nso: 'E tshepiša dikadimo tša ka pela ntle le tlhahlobo, tswalo ya mashonisa, goba go tšea karata ya SASSA.'
  },
  RULE_SOCIAL_URGENCY_PRESSURE: {
    en: 'Applies high-pressure urgency, panic emergencies (police/hospital), or imminent account lock threats.',
    zu: 'Isebenzisa uvalo nokuxhamazelisa (amaphoyisa, isibhedlela, noma ukuvalwa kwe-akhawunti ngokushesha) ukuze uthumele imali ungacabanganga.',
    xh: 'Isebenzisa uloyiko nokungxama (amapolisa, isibhedlele, okanye ukuvalwa kwe-akhawunti) ukuze uthumele imali ngoko nangoko.',
    st: 'E sebelisa letšoho le potlako e kholo (sepolesa, sepetlele, kapa ho koaloa ha akhaonto) ho u qobella ho romela chelete hang-hang.',
    af: 'Gebruik hoëdruk-dringendheid, paniekkrisisse (polisie/hospitaal) of dreigemente dat jou rekening gesluit word.',
    nso: 'E šomiša letšhogo le tšhoganetšo (maphodisa, sepetlele goba go tswalelwa ga akhaonto) go go gapeletša go romela tšhelete.'
  },
  RULE_OFFICIAL_IMPERSONATION: {
    en: 'Claims authority as a SASSA official, bank fraud investigator, SARS agent, courier customs desk, or unofficial link.',
    zu: 'Izenza isikhulu sakwa-SASSA, umaseshi womkhonyovu ebhange, i-SARS, ikhuriya yempahla, noma isixhumanisi sombombayi.',
    xh: 'Izenza igosa lakwa-SASSA, umphengululi webhanki, u-SARS, ikhuriya yempahla, okanye ikhonkco lobuxoki.',
    st: 'E iketsa ofisiri ea SASSA, mofuputsi oa bomenemene ba banka, SARS, poso ea liphutheloana, kapa link ea bohata.',
    af: 'Gee voor om ’n SASSA-beampte, bankbedrogondersoeker, SARS-agent, koerier of onamptelike skakel te wees.',
    nso: 'E itira mohlankedi wa SASSA, mofatišiši wa panka, SARS, poso ya diphuthelwana goba link ya bofora.'
  },
  RULE_PIN_OTP_DISCLOSURE: {
    en: 'Requests your secret bank PIN, One-Time PIN (OTP), USSD auth code, or cash-send PIN.',
    zu: 'Icela i-PIN yakho eyimfihlo yasebhange, i-OTP, ikhodi ye-USSD noma i-PIN yokukhipha imali.',
    xh: 'Icela i-PIN yakho eyimfihlo yebhanki, i-OTP, ikhowudi ye-USSD okanye i-PIN yokuthumela imali.',
    st: 'E kopa PIN ea hau ea lekunutu ea banka, One-Time PIN (OTP), khoutu ea USSD kapa PIN ea chelete.',
    af: 'Vra vir jou geheime bank-PIN, eenmalige PIN (OTP), USSD-kode of kontantstuur-PIN.',
    nso: 'E kgopela PIN ya gago ya sephiri ya panka, OTP, khoutu ya USSD goba PIN ya go ntšha tšhelete.'
  },
  RULE_AGENT_FEE_EXTORTION_TEXT: {
    en: 'Demands an unauthorized extra agent cash-out commission or "system offline" surcharge.',
    zu: 'Ifuna imali eyengeziwe okungeyona esemthethweni yokukhipha imali e-spaza noma esitolo ("system offline fee").',
    xh: 'Ifuna intlawulo eyongezelelweyo engavumelekanga yokukhupha imali kwi-arhente ("system offline fee").',
    st: 'E batla tefiso e eketsehileng e seng molaong ea ho ntša chelete lebenkeleng kapa ho agent.',
    af: 'Eis ’n ongemagtigde ekstra kontant-onttrekkingsfooi of "stelsel vanlyn"-toeslag.',
    nso: 'E nyaka tefo ya tlaleletšo ye e sa dumelelwago ya go ntšha tšhelete go agent.'
  },
  RULE_ADVERSARIAL_OBFUSCATION_DETECTED: {
    en: 'Uses disguised characters or split letters (such as O.T.P or f-e-e) to hide scam keywords.',
    zu: 'Isebenzisa izinhlamvu ezicashisiwe noma ezehlukanisiwe (njengo-O.T.P noma f-e-e) ukufihla amagama omkhonyovu.',
    xh: 'Isebenzisa oonobumba abafihliweyo okanye abahluliweyo (njengo-O.T.P okanye f-e-e) ukufihla ubuqhophololo.',
    st: 'E sebelisa litlhaku tse patiloeng kapa tse arotsoeng (joalo ka O.T.P kapa f-e-e) ho pata mantsoe a bomenemene.',
    af: 'Gebruik vermomde karakters of gesplete letters (soos O.T.P of f-e-e) om bedrogwoorde weg te steek.',
    nso: 'E šomiša ditlhaka tše di aroganego (bjalo ka O.T.P goba f-e-e) go uta mantšu a boradia.'
  },
  TELEMETRY_BURNER_ACCOUNT_AGE: {
    en: 'Recipient account was opened very recently — common for temporary scammer accounts.',
    zu: 'I-akhawunti yomamukeli isanda kuvulwa muva nje — okuvamile kuma-akhawunti abakhohlisi.',
    xh: 'I-akhawunti yomamkeli isandula ukuvulwa — into eqhelekileyo kwii-akhawunti zabaqhophololi.',
    st: 'Akhaonto ea moamoheli e sa tsoa buloa haufinyane — ho tloaelehileng ho li-akhaonto tsa bomenemene.',
    af: 'Ontvanger se rekening is baie onlangs oopgemaak — algemeen by tydelike bedrogrekeninge.',
    nso: 'Akhaonto ya moamogedi e sa tšwa go bulwa — go tlwaelegile go diakhaonto tša baradia.'
  },
  TELEMETRY_NEW_RECIPIENT_RISK: {
    en: 'First-time or unknown recipient with no prior trusted payment history.',
    zu: 'Umamukeli omusha noma ongaziwa ongakaze ukhokhele kuye phambilini.',
    xh: 'Umamkeli omtsha okanye ongaziwayo ongazange uhlawule kuye ngaphambili.',
    st: 'Moamoheli e mocha kapa ea sa tsejoeng eo u e-s’o ka u mo lefa pele.',
    af: 'Eerstekeer of onbekende ontvanger sonder enige vorige betroubare betalingsgeskiedenis.',
    nso: 'Moamogedi yo mofsa goba yo a sa tsebjego yo o sego wa ka wa mo lefa pele.'
  },
  TELEMETRY_HIGH_TRANSFER_VELOCITY: {
    en: 'Multiple rapid outbound transfers within the past hour.',
    zu: 'Ukuthunyelwa kwemali kaningi ngokushesha phakathi nehora elidlule.',
    xh: 'Ukuthunyelwa kwemali kaninzi ngokukhawuleza kwiyure edlulileyo.',
    st: 'Ho romeloa ha chelete hangata ka potlako nakong ea hora e fetileng.',
    af: 'Verskeie vinnige uitgaande oorplasings binne die afgelope uur.',
    nso: 'Go romelwa ga tšhelete ga mmalwa ka lebelo iri ye e fetilego.'
  },
  TELEMETRY_UNREGISTERED_LENDER: {
    en: 'Lender is not registered with the National Credit Regulator (NCR) and is requesting loan-related fees.',
    zu: 'Umbolekisi akabhalisiwe kwa-National Credit Regulator (NCR) futhi ucela izimali ezihlobene nesikweletu.',
    xh: 'Umbolekisi akabhaliswanga kwi-National Credit Regulator (NCR) kwaye ucela iintlawulo zemali-mboleko.',
    st: 'Mokolotisi ha a ngolisoa ho National Credit Regulator (NCR) ’me o batla litefiso tsa kalimo.',
    af: 'Uitlener is nie by die Nasionale Kredietreguleerder (NCR) geregistreer nie en vra leningsverwante fooie.',
    nso: 'Moabi wa kadimo ga a ngwadišwa go National Credit Regulator (NCR) gomme o kgopela ditefo tša kadimo.'
  },
  TELEMETRY_UNAUTHORIZED_AGENT_FEE_TIER: {
    en: 'Agent fee demanded exceeds the official retail cash-out tariff cap for this withdrawal amount.',
    zu: 'Imali ye-agent efunwayo yeqa umkhawulo osemthethweni wokukhipha le mali.',
    xh: 'Intlawulo ye-arhente ecelwayo igqitha umda osemthethweni wokukhupha le mali.',
    st: 'Tefiso ea agent e batloang e feta moeli oa semmuso oa ho ntša chelete ena.',
    af: 'Agentfooi geëis oorskry die amptelike kontant-onttrekkingstarief vir hierdie bedrag.',
    nso: 'Tefiso ya agent ye e nyakwago e feta moedi wa semolao wa go ntšha tšhelete ye.'
  }
};

export const getLocalizedSignalDescription = (
  signal: DetectedThreatSignal,
  lang: SupportedWarningLanguage = 'en'
): string => {
  const entry = LOCALIZED_RULE_DESCRIPTIONS[signal.ruleId];
  if (entry) {
    return entry[lang] || entry.en;
  }
  return signal.description;
};

const interpolateSlots = (
  rawText: string,
  lang: SupportedWarningLanguage,
  amountZar?: number,
  maxFeeZar?: number
): string => {
  const formattedAmount =
    typeof amountZar === 'number' && Number.isFinite(amountZar) && amountZar > 0
      ? `R${amountZar.toFixed(0)}`
      : DEFAULT_AMOUNT_FALLBACK[lang];
  const formattedMaxFee =
    typeof maxFeeZar === 'number' && Number.isFinite(maxFeeZar) && maxFeeZar > 0
      ? `R${maxFeeZar.toFixed(0)}`
      : DEFAULT_MAX_FEE_FALLBACK[lang];

  return rawText
    .replace(/\{amount\}/g, formattedAmount)
    .replace(/\{maxFee\}/g, formattedMaxFee);
};

/**
 * Deduces the highest-priority Scam Context Template from a parser evaluation and transaction metadata.
 */
export const selectScamContextTemplate = (
  evaluation: ScamParserEvaluation,
  rawTelemetry?: TransactionTelemetryPayload
): ScamTemplateId => {
  const telemetry = sanitizeTelemetry(rawTelemetry);

  if (evaluation.riskScore < 0.30 && evaluation.signals.length === 0) {
    return 'TEMPLATE_GENERAL_SAFE';
  }

  const { categoryBreakdown, feeTierViolation } = evaluation;

  const predatoryScore =
    categoryBreakdown.PREDATORY_LENDING_UPFRONT_FEE +
    categoryBreakdown.PREDATORY_LENDING_UNREALISTIC_RETURN;

  const agentExtortionScore =
    categoryBreakdown.AGENT_FEE_EXTORTION +
    (telemetry?.operationType === 'cash_out' || telemetry?.operationType === 'cash_in'
      ? categoryBreakdown.PIN_OTP_DISCLOSURE
      : 0);

  const impersonationUrgentScore =
    categoryBreakdown.OFFICIAL_IMPERSONATION +
    categoryBreakdown.SOCIAL_ENGINEERING_URGENCY +
    (telemetry?.operationType !== 'cash_out' && telemetry?.operationType !== 'cash_in'
      ? categoryBreakdown.PIN_OTP_DISCLOSURE * 0.85
      : 0) +
    (telemetry?.isNewlyAddedRecipient &&
    (categoryBreakdown.OFFICIAL_IMPERSONATION > 0 ||
      categoryBreakdown.SOCIAL_ENGINEERING_URGENCY > 0)
      ? 0.2
      : 0);

  if (feeTierViolation && agentExtortionScore >= predatoryScore) {
    return 'TEMPLATE_UNAUTHORIZED_AGENT_FEE';
  }

  if (
    predatoryScore > 0 &&
    predatoryScore >= impersonationUrgentScore &&
    predatoryScore >= agentExtortionScore
  ) {
    return 'TEMPLATE_PREDATORY_LENDER';
  }

  if (
    agentExtortionScore > 0 &&
    agentExtortionScore >= impersonationUrgentScore &&
    agentExtortionScore >= predatoryScore
  ) {
    return 'TEMPLATE_UNAUTHORIZED_AGENT_FEE';
  }

  if (impersonationUrgentScore > 0 || evaluation.riskScore >= 0.30) {
    return 'TEMPLATE_IMPERSONATION_URGENT';
  }

  return 'TEMPLATE_GENERAL_SAFE';
};

/**
 * Generates plain-language, Web Speech API synthesizer-ready warning scripts
 * across all 6 supported South African languages.
 */
export const generateLocalizedAudioScripts = (
  templateId: ScamTemplateId,
  amountZar?: number,
  officialMaxFeeZar?: number
): LocalizedTextMap => {
  const template = SCAM_CONTEXT_TEMPLATES[templateId];
  return {
    en: interpolateSlots(template.audioScriptTemplate.en, 'en', amountZar, officialMaxFeeZar),
    zu: interpolateSlots(template.audioScriptTemplate.zu, 'zu', amountZar, officialMaxFeeZar),
    xh: interpolateSlots(template.audioScriptTemplate.xh, 'xh', amountZar, officialMaxFeeZar),
    st: interpolateSlots(template.audioScriptTemplate.st, 'st', amountZar, officialMaxFeeZar),
    af: interpolateSlots(template.audioScriptTemplate.af, 'af', amountZar, officialMaxFeeZar),
    nso: interpolateSlots(template.audioScriptTemplate.nso, 'nso', amountZar, officialMaxFeeZar)
  };
};

/**
 * Heuristic Scam Deduction & Incident Reporting Pipeline.
 */
export const deduceScamAndBuildIncidentReport = (params: {
  transcriptOrMessage: string;
  telemetry?: TransactionTelemetryPayload;
  preferredLanguage?: SupportedWarningLanguage;
  existingEvaluation?: ScamParserEvaluation;
  evaluationOptions?: ScamEvaluationOptions;
}): ScamDeductionResult => {
  const {
    transcriptOrMessage,
    telemetry: rawTelemetry,
    preferredLanguage = 'en',
    existingEvaluation,
    evaluationOptions
  } = params;

  const safeInput = typeof transcriptOrMessage === 'string' ? transcriptOrMessage : '';
  const sanitizedTelemetry = sanitizeTelemetry(rawTelemetry);

  const evaluation =
    existingEvaluation ??
    evaluateScamRisk(safeInput, sanitizedTelemetry, evaluationOptions);

  const templateId = selectScamContextTemplate(evaluation, sanitizedTelemetry);
  const template = SCAM_CONTEXT_TEMPLATES[templateId];

  const amountZar = sanitizedTelemetry?.amountZar;
  const maxFeeZar = evaluation.feeTierViolation?.officialMaxFeeZar;

  const audioWarningScripts = generateLocalizedAudioScripts(
    templateId,
    amountZar,
    maxFeeZar
  );

  const localizedActions = template.recommendedActions[preferredLanguage].map(step =>
    interpolateSlots(step, preferredLanguage, amountZar, maxFeeZar)
  );

  const reportTimestamp = evaluation.evaluatedAtIso;
  const deterministicSuffix = Math.abs(
    Array.from(`${safeInput.slice(0, 256)}|${sanitizedTelemetry?.recipientId ?? 'local'}`).reduce(
      (hash, ch) => (hash * 31 + ch.charCodeAt(0)) | 0,
      7
    )
  )
    .toString(36)
    .toUpperCase()
    .slice(0, 6);

  const incidentReport: ContextualIncidentReportPayload = {
    reportId: `MB-SHIELD-${deterministicSuffix}`,
    createdAtIso: reportTimestamp,
    deducedTemplateId: templateId,
    deducedScamTitle: template.title[preferredLanguage],
    riskScore: evaluation.riskScore,
    severity: evaluation.severity,
    frictionTier: evaluation.frictionTier,
    recommendedBlockTransfer: evaluation.isBlockedRecommended,
    reportingAuthority: template.reportingAuthority,
    reportingHotline: template.reportingContact,
    transactionMetadata: {
      transactionId: sanitizedTelemetry?.transactionId ?? 'TX-LOCAL-UNCOMMITTED',
      recipientId: sanitizedTelemetry?.recipientId ?? 'UNSPECIFIED_RECIPIENT',
      recipientName: sanitizedTelemetry?.recipientName ?? 'Unknown / Unverified Contact',
      amountZar: sanitizedTelemetry?.amountZar ?? 0,
      recipientAccountAgeDays: sanitizedTelemetry?.recipientAccountAgeDays ?? -1,
      isNewlyAddedRecipient: sanitizedTelemetry?.isNewlyAddedRecipient ?? false,
      recentTransferCountLastHour: sanitizedTelemetry?.recentTransferCountLastHour ?? 0,
      operationType: sanitizedTelemetry?.operationType ?? 'message_inspection',
      agentFeeChargedZar: sanitizedTelemetry?.agentFeeChargedZar ?? null
    },
    detectedTriggerKeywords: evaluation.matchedKeywords,
    triggeredRuleIds: evaluation.signals.map(sig => sig.ruleId),
    shadowLoggedRuleIds: evaluation.shadowSignals.map(sig => sig.ruleId),
    obfuscationIndicators: evaluation.obfuscationIndicators,
    localizedActionSteps: localizedActions,
    audioWarningScripts,
    activeAudioScript: audioWarningScripts[preferredLanguage],
    userNarrativeSummary: `[${templateId}] Risk ${(evaluation.riskScore * 100).toFixed(
      0
    )}% (${evaluation.severity} / ${evaluation.frictionTier}). Triggers: ${
      evaluation.matchedKeywords.length > 0
        ? evaluation.matchedKeywords.join(', ')
        : 'none'
    }.`
  };

  return {
    template,
    evaluation,
    frictionTier: evaluation.frictionTier,
    requiresVoiceConfirmationModal: evaluation.frictionTier === 'VOICE_CONFIRMATION_MODAL',
    localizedTitle: template.title[preferredLanguage],
    localizedSummary: template.summary[preferredLanguage],
    localizedActions,
    audioWarningScripts,
    activeAudioScript: audioWarningScripts[preferredLanguage],
    incidentReport
  };
};
