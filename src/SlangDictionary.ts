export interface SlangAliasGroup {
  readonly term: string;
  readonly aliases: readonly string[];
  readonly amount?: number;
  readonly category: string;
}

/**
 * Curated South African vernacular & township currency slang matrix.
 */
export const PHONETIC_ALIAS_MATRIX: readonly SlangAliasGroup[] = [
  {
    term: 'tiger',
    aliases: ['tiger', 'taiga', 'tiga', 'tyger', 'tigers', 'ithayiga'],
    amount: 10,
    category: 'General Expense'
  },
  {
    term: 'choco',
    aliases: ['choco', 'choko', 'choc', 'chock', 'chok', 'ichoko', 'i-choko', 'chocos'],
    amount: 20,
    category: 'General Expense'
  },
  {
    term: 'clipa',
    aliases: ['clipa', 'clipper', 'clippers', 'klipa', 'kliper', 'iclipa', 'i-clipa', 'stikka', 'steka'],
    amount: 100,
    category: 'General Expense'
  },
  {
    term: 'grand',
    aliases: ['grand', 'grands', 'thousand', 'nkani'],
    amount: 1000,
    category: 'General Expense'
  },
  {
    term: 'stokvel',
    aliases: ['stokvel', 'stokfele', 'umgalelo', 'mogodisano'],
    category: 'Group Savings'
  },
  {
    term: 'mashonisa',
    aliases: ['mashonisa', 'umashonisa', 'bomashonisa', 'machonisa', 'skopper', 'skoper'],
    category: 'Unregistered Credit / Loan'
  },
  {
    term: 'tjotjo',
    aliases: ['tjotjo', 'tjo-tjo', 'cooldrink money', 'cold drink fee', 'inyoba'],
    category: 'Bribe / Upfront Fee'
  }
];

export const expandVernacularAliasesForSecurity = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/\b(tjotjo|tjo[\s-]?tjo|cooldrink\s+money|cold\s+drink\s+fee|inyoba)\b/giu, 'upfront release fee')
    .replace(/\b(umashonisa|bomashonisa|machonisa|skopper|skoper)\b/giu, 'mashonisa')
    .replace(/\b(\d+|one|two|three|four|five)\s+(tiger|taiga|tiga|tyger|tigers|ithayiga)\b/giu, 'R10')
    .replace(/\b(\d+|one|two|three|four|five)\s+(choko|choco|choc|chock|ichoko|chocos)\b/giu, 'R20')
    .replace(/\b(\d+|one|two|three|four|five)\s+(clipa|clipper|clippers|klipa|iclipa|stikka|steka)\b/giu, 'R100');
};

export interface ParsedVoiceEntry {
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  tags: string[];
}

export interface ParsedVoiceTransaction {
  entries: ParsedVoiceEntry[];
  slangTags: string[];
}

interface AliasMatch {
  group: SlangAliasGroup;
  alias: string;
  index: number;
  end: number;
}

interface NumberMatch {
  value: number;
  index: number;
  end: number;
  isWordNumber: boolean;
}

interface CategoryMatch {
  category: string;
  type: ParsedVoiceEntry['type'];
  index: number;
  end: number;
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  unye: 1,
  eele: 1,
  mme: 1,
  'one rand': 1,
  two: 2,
  zimbini: 2,
  mabeli: 2,
  'two rand': 2,
  three: 3,
  zintathu: 3,
  aroaro: 3,
  'three rand': 3,
  four: 4,
  zine: 4,
  nne: 4,
  five: 5,
  zintlanu: 5,
  hlano: 5,
  six: 6,
  isithupha: 6,
  eletshela: 6,
  seven: 7,
  isikhombisa: 7,
  supu: 7,
  eight: 8,
  isibhozo: 8,
  robedi: 8,
  nine: 9,
  isishiyagalolunye: 9,
  nege: 9,
  ten: 10,
  ishumi: 10,
  lesome: 10,
  tien: 10,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  hundred: 100
};

/**
 * Normalise amount text: handle thousands separators ("1,200", "2 500", "1.200") and decimals ("12,50", "1,200.50").
 */
const normaliseAmountText = (text: string): string => {
  let res = text.replace(/(\d)[,\s](\d{3})(?!\d)/g, '$1$2');
  res = res.replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2');
  res = res.replace(/(\d{1,3})\.(\d{3}),(\d{1,2})\b/g, '$1$2.$3');
  res = res.replace(/(\d),(\d{1,2})\b/g, '$1.$2');
  return res;
};

/**
 * Category patterns ordered so explicit income patterns take precedence.
 */
const CATEGORY_PATTERNS: readonly {
  pattern: RegExp;
  category: string;
  type: ParsedVoiceEntry['type'];
}[] = [
  {
    pattern: /\b(salaries|salary|wage|wages|payslip|stipend|piece\s*job|sassa\s*grant|grant\s*payout|sold\s+[\d\w\s]+|sold|sell|selling|spaza\s+sales|market\s+sales|got\s+paid|get\s+paid|gets\s+paid|got\s+[\d\w\s]+\s+from|customer\s+paid|client\s+paid|received|receive|earned|paid\s+me|gave\s+me|tip|tips|allowance|pocket\s+money|commission|from\s+my\s+aunt)\b/giu,
    category: 'Salary / Income',
    type: 'income'
  },
  {
    pattern: /\b(spaza|market|emakethe)\b/giu,
    category: 'Market Sales Income',
    type: 'income'
  },
  {
    pattern: /\b(taxi|taxis|transport|bus|train|fare|rank)\b/giu,
    category: 'Transport / Taxi Expense',
    type: 'expense'
  },
  {
    pattern: /\b(data|airtime|internet|wifi|wi-fi|bundle)\b/giu,
    category: 'Connectivity',
    type: 'expense'
  },
  {
    pattern: /\b(electricity|ugesi|motlakase|krag|water|utilities|prepaid\s+token)\b/giu,
    category: 'Utilities',
    type: 'expense'
  },
  {
    pattern: /\b(rent|irenti|housing|accommodation)\b/giu,
    category: 'Housing / Rent',
    type: 'expense'
  },
  {
    pattern: /\b(bread|milk|maize|mealie|groceries|food|chocolate|meat|cooking\s+oil|ukudla|kos)\b/giu,
    category: 'Groceries',
    type: 'expense'
  },
  {
    pattern: /\b(school|uniform|chalk|stationery|books|creche|fees)\b/giu,
    category: 'School / Education',
    type: 'expense'
  }
];

const findAliases = (text: string): AliasMatch[] => {
  const norm = normaliseAmountText(text);
  const matches: AliasMatch[] = [];
  for (const group of PHONETIC_ALIAS_MATRIX) {
    for (const alias of group.aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'giu');
      for (const match of norm.matchAll(regex)) {
        if (match.index === undefined) continue;
        matches.push({
          group,
          alias,
          index: match.index,
          end: match.index + match[0].length
        });
      }
    }
  }
  return matches.sort((left, right) => left.index - right.index);
};

const NUMBER_WORD_KEYS = Object.keys(NUMBER_WORDS).filter(k => !k.includes('_'));

const findNumberMatches = (text: string): NumberMatch[] => {
  const norm = normaliseAmountText(text);
  const wordAlternation = NUMBER_WORD_KEYS.join('|');
  const pattern = new RegExp(
    `\\b(\\d+(?:[.,]\\d{1,2})?(?!\\s*k\\b)|${wordAlternation})\\b`,
    'giu'
  );
  const matches: NumberMatch[] = [];

  for (const match of norm.matchAll(pattern)) {
    if (match.index === undefined) continue;
    const token = match[1].toLocaleLowerCase();
    const isDigit = /^\d/.test(token);
    const value = isDigit ? Number(token.replace(',', '.')) : NUMBER_WORDS[token];
    if (Number.isFinite(value)) {
      matches.push({
        value,
        index: match.index,
        end: match.index + match[0].length,
        isWordNumber: !isDigit
      });
    }
  }

  return matches;
};

const findCategoryMatches = (text: string): CategoryMatch[] => {
  const norm = normaliseAmountText(text);
  const matches: CategoryMatch[] = [];
  for (const definition of CATEGORY_PATTERNS) {
    for (const match of norm.matchAll(definition.pattern)) {
      if (match.index === undefined) continue;
      matches.push({
        category: definition.category,
        type: definition.type,
        index: match.index,
        end: match.index + match[0].length
      });
    }
  }
  return matches.sort((left, right) => left.index - right.index);
};

const categoryForPosition = (
  text: string,
  aliasIndex: number,
  aliasEnd: number,
  categories: readonly CategoryMatch[]
): CategoryMatch | undefined => {
  let best: CategoryMatch | undefined;
  let minDistance = Infinity;

  for (const cat of categories) {
    const distance =
      cat.index >= aliasEnd
        ? cat.index - aliasEnd
        : aliasIndex >= cat.end
        ? aliasIndex - cat.end
        : 0;

    if (distance <= 45 && distance < minDistance) {
      minDistance = distance;
      best = cat;
    }
  }
  return best;
};

const isSameClause = (text: string, start: number, end: number): boolean => {
  const segment = text.slice(start, end);
  return !/[.!?;]\s*$/u.test(segment);
};

const quantityBeforeAlias = (
  transcript: string,
  alias: AliasMatch,
  numbers: readonly NumberMatch[],
  previousAliasEnd: number
): number => {
  const candidate = numbers
    .slice()
    .reverse()
    .find(
      number =>
        number.index < alias.index &&
        number.index >= previousAliasEnd &&
        alias.index - number.end <= 28 &&
        isSameClause(transcript, number.index, alias.index)
    );
  if (!candidate || candidate.value <= 0) return 1;

  const between = transcript.slice(candidate.end, alias.index);
  if (!/^[\s,.'’\-]*(?:(?:u|i|a|an|the|x|×)[\s.'’\-]*)*$/iu.test(between)) return 1;
  return candidate.value;
};

const extractCurrencyAmounts = (text: string): NumberMatch[] => {
  const norm = normaliseAmountText(text);
  const matches: NumberMatch[] = [];
  const patterns: readonly { regex: RegExp; multiplier: number }[] = [
    {
      regex: /\b(?:u)?R\s*(\d+(?:[.,]\d{1,2})?)\s*k\b/giu,
      multiplier: 1000
    },
    {
      regex: /\b(\d+(?:[.,]\d{1,2})?)\s*k\b/giu,
      multiplier: 1000
    },
    {
      regex: /\b(?:u)?R\s*(\d+(?:[.,]\d{1,2})?)(?![\d\p{L}])/giu,
      multiplier: 1
    },
    {
      regex: /\b(\d+(?:[.,]\d{1,2})?)\s*(?:rand|rands|zar)\b/giu,
      multiplier: 1
    }
  ];

  for (const { regex, multiplier } of patterns) {
    for (const match of norm.matchAll(regex)) {
      if (match.index === undefined) continue;
      const numericText = match[1];
      const rawVal = Number(numericText.replace(',', '.'));
      const value = Math.round(rawVal * multiplier * 100) / 100;
      if (!Number.isFinite(value) || value <= 0) continue;

      const start = match.index;
      const end = match.index + match[0].length;
      const overlaps = matches.some(m => start < m.end && end > m.index);
      if (!overlaps) {
        matches.push({
          value,
          index: start,
          end,
          isWordNumber: false
        });
      }
    }
  }
  return matches.sort((left, right) => left.index - right.index);
};

export const parseVernacularTransaction = (transcript: string): ParsedVoiceTransaction => {
  const norm = normaliseAmountText(transcript);
  const aliases = findAliases(norm);
  const numbers = findNumberMatches(norm);
  const categories = findCategoryMatches(norm);
  const slangTags = [...new Set(aliases.map(match => match.group.term))];
  const positionedEntries: { index: number; entry: ParsedVoiceEntry }[] = [];
  let previousAliasEnd = 0;

  for (const alias of aliases) {
    if (alias.group.amount !== undefined) {
      const categoryMatch = categoryForPosition(norm, alias.index, alias.end, categories);
      const quantity = quantityBeforeAlias(norm, alias, numbers, previousAliasEnd);
      const amount = Math.round(alias.group.amount * quantity * 100) / 100;
      const category = categoryMatch?.category ?? alias.group.category;
      positionedEntries.push({
        index: alias.index,
        entry: {
          type: categoryMatch?.type ?? 'expense',
          title: `${category} (${quantity} x R${alias.group.amount} ${alias.group.term})`,
          amount,
          category,
          tags: [alias.group.term]
        }
      });
      previousAliasEnd = alias.end;
    }
  }

  const currencyAmounts = extractCurrencyAmounts(norm);
  for (const curr of currencyAmounts) {
    const categoryMatch = categoryForPosition(norm, curr.index, curr.end, categories);
    const category = categoryMatch?.category ?? 'General Expense';
    const type = categoryMatch?.type ?? 'expense';
    positionedEntries.push({
      index: curr.index,
      entry: {
        type,
        title: `${category} (Voice R${curr.value})`,
        amount: curr.value,
        category,
        tags: []
      }
    });
  }

  // Fallback if numbers matched and category matched
  if (positionedEntries.length === 0 && categories.length > 0) {
    const primaryCat = categories[0];
    const fallbackNum = numbers.find(n => n.value > 0);
    if (fallbackNum) {
      positionedEntries.push({
        index: primaryCat.index,
        entry: {
          type: primaryCat.type,
          title: `${primaryCat.category} (Voice)`,
          amount: fallbackNum.value,
          category: primaryCat.category,
          tags: []
        }
      });
    }
  }

  positionedEntries.sort((a, b) => a.index - b.index);
  return {
    entries: positionedEntries.map(item => item.entry),
    slangTags
  };
};
