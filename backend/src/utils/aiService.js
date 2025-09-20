require('dotenv').config();
const OpenAI = require('openai');

let client = null;
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function generateDescriptionFromFields(fields) {
  const { title, category, return_rate, risk_level } = fields;
  if (client) {
    const prompt = `Write a short marketing description for "${title}", category ${category}, return ${return_rate}%, risk ${risk_level}. Keep 40-80 words.`;
    const resp = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role:'user', content: prompt }], max_tokens: 150 });
    return resp.choices?.[0]?.message?.content?.trim() || `${title} (${category}) — ${return_rate}% . Risk: ${risk_level}`;
  }
  return `${title} (${category}) — expected return ${return_rate}%. Risk: ${risk_level}.`;
}

async function summarizeErrors(logs) {
  if (!logs || logs.length === 0) return 'No errors logged.';
  if (client) {
    const short = logs.map(l => `Endpoint: ${l.endpoint} | Code: ${l.statusCode} | Error: ${l.errorMessage || 'none'}`).join('\n');
    const prompt = `Summarize these logs and give 3 suggestions:\n${short}`;
    const resp = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role:'user', content: prompt }], max_tokens: 300 });
    return resp.choices?.[0]?.message?.content?.trim();
  }
  const codes = [...new Set(logs.map(l => l.statusCode))].slice(0,3).join(', ');
  return `Found ${logs.length} error entries. Frequent codes: ${codes}.`;
}

module.exports = { generateDescriptionFromFields, summarizeErrors };
