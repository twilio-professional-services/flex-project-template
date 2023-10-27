import { varNameMapping } from "./constants.mjs";

const acronyms = ['sid', 'id', 'ui', 'sip', 'pstn', 'sms', 'crm', 'sla', 'cbm', 'url'];
const ignoreKeys = ['ACCOUNT_SID', 'AUTH_TOKEN', 'TWILIO_API_KEY', 'TWILIO_API_SECRET'];

const formatName = (name) => {
  // First remove redundant information and normalize to lower case
  name = name.replace(/^(TWILIO_FLEX_)/, '').toLowerCase();
  
  // Capitalize first letter, replace underscores with spaces
  let formatted = name;
  if (name.length > 0) {
    formatted = name[0].toUpperCase() + name.slice(1).replaceAll('_', ' ');
  }
  
  // If any acronyms are in the name, format them correctly
  acronyms.forEach((acronym) => {
    if (name === acronym) {
      formatted = acronym.toUpperCase();
      return;
    }
  
    if (name.startsWith(`${acronym}_`)) {
      formatted = acronym.toUpperCase() + formatted.slice(acronym.length);
    }
  
    if (name.endsWith(`_${acronym}`)) {
      formatted = formatted.slice(0, formatted.length - acronym.length) + acronym.toUpperCase();
    }
  
    formatted = formatted.replaceAll(` ${acronym} `, ` ${acronym.toUpperCase()} `);
  });
  
  return formatted;
}

const printLine = (name, value) => {
  if (value == `<YOUR_${name}>`) {
    // Don't print placeholders
    value = "(missing)";
  }
  
  console.log(`${formatName(name)}:  ${value}`);
}

export default (allReplacements) => {
  const alreadyOutput = [];
  let printHeader = true;
  console.log("");
  console.log("Environment configuration summary:");
  for (const key in allReplacements) {
    if (!varNameMapping[key] || !(
      varNameMapping[key].type == "tr-workspace" || 
      varNameMapping[key].type == "sync-service" || 
      varNameMapping[key].type == "chat-service"
    )) {
      continue;
    }
    
    if (printHeader) {
      console.log("");
      console.log("---- INSTANCE SIDS -----------------------------------------");
      printHeader = false;
    }
    
    printLine(key, allReplacements[key]);
    alreadyOutput.push(key);
  }
  printHeader = true;
  for (const key in allReplacements) {
    if (!varNameMapping[key] || varNameMapping[key].type != "tr-workflow") {
      continue;
    }
    
    if (printHeader) {
      console.log("");
      console.log("---- WORKFLOW SIDS -----------------------------------------");
      printHeader = false;
    }
    
    printLine(key, allReplacements[key]);
    alreadyOutput.push(key);
  }
  printHeader = true;
  for (const key in allReplacements) {
    if (!varNameMapping[key] || varNameMapping[key].type != "serverless-domain") {
      continue;
    }
    
    if (printHeader) {
      console.log("");
      console.log("---- SERVERLESS DOMAINS ------------------------------------");
      printHeader = false;
    }
    
    printLine(key, allReplacements[key]);
    alreadyOutput.push(key);
  }
  printHeader = true;
  for (const key in allReplacements) {
    if (!varNameMapping[key] || !(
      varNameMapping[key].type == "serverless-service" ||
      varNameMapping[key].type == "serverless-environment" ||
      varNameMapping[key].type == "serverless-function"
    )) {
      continue;
    }
    
    if (printHeader) {
      console.log("");
      console.log("---- SERVERLESS SIDS ---------------------------------------");
      printHeader = false;
    }
    
    printLine(key, allReplacements[key]);
    alreadyOutput.push(key);
  }
  printHeader = true;
  for (const key in allReplacements) {
    if (alreadyOutput.includes(key) || ignoreKeys.includes(key)) {
      continue;
    }
    
    if (printHeader) {
      console.log("");
      console.log("---- CUSTOM DATA -------------------------------------------");
      printHeader = false;
    }
    
    printLine(key, allReplacements[key]);
  }
  
  console.log("");
}