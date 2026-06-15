function mod97(numericString: string): number {
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i], 10)) % 97;
  }
  return remainder;
}

function generateNumericString(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

function generateAlphanumericString(length: number): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getCountryCodeNumeric(countryCode: string): string {
  const codes: Record<string, string> = {
    FR: "1575",
    DE: "1314",
    ES: "1426",
    IT: "1819",
    NL: "2126",
    BE: "1614",
    AT: "1612",
    PT: "2220",
    CH: "2300",
    GB: "1616",
    LU: "2300",
  };
  return codes[countryCode] || "1575";
}

function calculateIBANCheckDigits(
  countryCode: string,
  bban: string,
  countryCodeNumeric: string
): string {
  const rearranged = bban + countryCodeNumeric + "00";
  const mod97Result = mod97(rearranged);
  const checkDigits = 98 - mod97Result;
  return checkDigits.toString().padStart(2, "0");
}

export function generateValidIBAN(countryCode: string = "FR"): string {
  const bankCode = generateNumericString(5);
  const branchCode = generateNumericString(5);
  const accountNumber = generateAlphanumericString(11);
  const nationalCheck = generateNumericString(2);

  const bban = bankCode + branchCode + accountNumber + nationalCheck;
  const countryCodeNumeric = getCountryCodeNumeric(countryCode);
  const checkDigits = calculateIBANCheckDigits(countryCode, bban, countryCodeNumeric);

  return formatIBAN(`${countryCode}${checkDigits}${bban}`);
}

export function formatIBAN(iban: string): string {
  return iban
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .toUpperCase();
}

export function validateIBAN(iban: string): boolean {
  const cleanIban = iban.replace(/\s/g, "").toUpperCase();

  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban)) {
    return false;
  }

  const countryCode = cleanIban.substring(0, 2);
  const checkDigits = cleanIban.substring(2, 4);
  const bban = cleanIban.substring(4);

  const countryCodeNumeric = getCountryCodeNumeric(countryCode);
  const rearranged = bban + countryCodeNumeric + checkDigits;
  const mod97Result = mod97(rearranged);

  return mod97Result === 1;
}

export function generateBIC(bankCode: string = "AETB"): string {
  const countryCode = "FR";
  const locationCode = generateAlphanumericString(2).toUpperCase();
  const branchCode = "XXX";

  return `${bankCode}${countryCode}${locationCode}${branchCode}`;
}

export function generateSEPAReference(): string {
  const prefix = "FR";
  const timestamp = Date.now().toString().slice(-12);
  const random = generateNumericString(4);
  return `${prefix}${timestamp}${random}`;
}

export function generateCreditorReference(): string {
  const prefix = "REC";
  const timestamp = Date.now().toString().slice(-10);
  const random = generateAlphanumericString(6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function formatBIC(bic: string): string {
  return bic
    .replace(/(.{4})(.{2})(.{2})([A-Z0-9]{3})?/, "$1 $2 $3 $4")
    .trim()
    .replace(/ *$/, "")
    .toUpperCase();
}

export function validateBIC(bic: string): boolean {
  const cleanBic = bic.replace(/\s/g, "").toUpperCase();

  if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanBic)) {
    return false;
  }

  if (cleanBic.length !== 8 && cleanBic.length !== 11) {
    return false;
  }

  return true;
}

export function generateRUM(): string {
  const prefix = "FR29ZZZ";
  const timestamp = (Date.now() % 1000000000).toString().padStart(9, "0");
  return `${prefix}${timestamp}`;
}

export function generateMandateReference(): string {
  const prefix = "MDT";
  const timestamp = Date.now().toString().slice(-10);
  const random = generateNumericString(4);
  return `${prefix}${timestamp}${random}`;
}

export function generateSepaMessageId(): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
  const random = generateNumericString(6);
  return `MSG${timestamp}${random}`;
}

export function getBankInfoFromBIC(bic: string): {
  bankName: string;
  country: string;
  location: string;
} {
  const cleanBic = bic.replace(/\s/g, "").toUpperCase();
  const bankCode = cleanBic.substring(0, 4);

  const knownBanks: Record<string, { name: string; country: string }> = {
    AETB: { name: "Aether Bank", country: "FR" },
    BNPA: { name: "BNP Paribas", country: "FR" },
    CGDO: { name: "Crédit Agricole", country: "FR" },
    SOCA: { name: "Société Générale", country: "FR" },
    BDPA: { name: "Banque Populaire", country: "FR" },
    CEPA: { name: "Caisse Epargne", country: "FR" },
    LYSA: { name: "LCL", country: "FR" },
    CMCIF: { name: "Credit Mutuel", country: "FR" },
    DEUT: { name: "Deutsche Bank", country: "DE" },
    COBA: { name: "Commerzbank", country: "DE" },
  };

  const info = knownBanks[bankCode] || { name: "Unknown Bank", country: cleanBic.substring(4, 6) };
  const location = cleanBic.substring(6, 8);

  return {
    bankName: info.name,
    country: info.country,
    location,
  };
}

export interface SepaAccountDetails {
  iban: string;
  formattedIban: string;
  bic: string;
  formattedBic: string;
  isValid: boolean;
  country: string;
  bankCode: string;
  branchCode: string;
  accountNumber: string;
}

export function parseSepaAccountDetails(iban: string, bic?: string): SepaAccountDetails {
  const cleanIban = iban.replace(/\s/g, "").toUpperCase();
  const formattedIban = formatIBAN(cleanIban);
  const country = cleanIban.substring(0, 2);

  const bankCode = cleanIban.substring(4, 9);
  const branchCode = cleanIban.substring(9, 14);
  const accountNumber = cleanIban.substring(14);

  const actualBic = bic || generateBIC("AETB");
  const formattedBic = formatBIC(actualBic);

  return {
    iban: cleanIban,
    formattedIban,
    bic: actualBic,
    formattedBic,
    isValid: validateIBAN(cleanIban) && (!bic || validateBIC(bic)),
    country,
    bankCode,
    branchCode,
    accountNumber,
  };
}
