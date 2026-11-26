// Popula a API Core Catalog com dados de demonstração para a apresentação.
// Uso (com a API rodando em outra janela):  node seed-demo.mjs
// Pode rodar mais de uma vez: o que já existe é reaproveitado.

const API = process.env.API_URL ?? 'http://localhost:3001';

const USER = { name: 'Usuário Demo', email: 'demo@corecatalog.com', password: 'senha123' };
const PROFILE = { fullName: 'Usuário Demo', birthDate: '2004-03-15' };

const MANUFACTURERS = ['AMD', 'Intel', 'NVIDIA', 'ASUS', 'Corsair', 'Kingston', 'Samsung'];

// Preços em centavos, consumo em watts
const COMPONENTS = [
  ['Ryzen 5 7600', 'CPU', 119900, 65, 'AMD'],
  ['Ryzen 7 7800X3D', 'CPU', 189900, 120, 'AMD'],
  ['Core i5-14600K', 'CPU', 159900, 125, 'Intel'],
  ['GeForce RTX 4060', 'GPU', 189900, 115, 'NVIDIA'],
  ['GeForce RTX 4070 Super', 'GPU', 429900, 220, 'NVIDIA'],
  ['Radeon RX 7800 XT', 'GPU', 349900, 263, 'AMD'],
  ['TUF Gaming B650M-Plus', 'Placa-mãe', 109900, 40, 'ASUS'],
  ['Vengeance DDR5 32 GB', 'RAM', 79900, 10, 'Corsair'],
  ['Fury Beast DDR5 16 GB', 'RAM', 39900, 6, 'Kingston'],
  ['990 PRO 1 TB', 'Armazenamento', 74900, 8, 'Samsung'],
  ['NV2 1 TB', 'Armazenamento', 39900, 5, 'Kingston'],
  ['RM750e 750 W', 'Fonte', 64900, 0, 'Corsair'],
];

// Build de exemplo: R$ 7.746,00 de R$ 8.000,00 (cabem mais R$ 254,00)
const BUILD = {
  name: 'PC Gamer 2026',
  maxBudgetCents: 800000,
  parts: ['Ryzen 7 7800X3D', 'GeForce RTX 4070 Super', 'Vengeance DDR5 32 GB', '990 PRO 1 TB'],
};

let token = null;

async function call(method, path, body) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  let res;
  try {
    res = await fetch(API + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    console.error(`\nNão consegui acessar ${API}. A API está rodando (npm run start:dev)?`);
    process.exit(1);
  }
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new Error(`${method} ${path} -> ${res.status} ${msg ?? ''}`);
  }
  return data;
}

// 1. Conta de demonstração (entra se já existir)
try {
  token = (await call('POST', '/auth/login', { email: USER.email, password: USER.password })).access_token;
  console.log(`Conta ${USER.email} já existia: entrou.`);
} catch {
  token = (await call('POST', '/auth/register', USER)).access_token;
  console.log(`Conta criada: ${USER.email} / ${USER.password}`);
}

// 2. Perfil
let profile = await call('GET', '/profiles/me');
if (!profile) {
  profile = await call('POST', '/profiles/me', PROFILE);
  console.log('Perfil criado.');
}

// 3. Fabricantes
const existingMakers = await call('GET', '/manufacturers');
for (const name of MANUFACTURERS) {
  if (!existingMakers.some((m) => m.name === name)) await call('POST', '/manufacturers', { name });
}
const makers = await call('GET', '/manufacturers');
console.log(`Fabricantes: ${makers.length}`);

// 4. Peças
const existingParts = await call('GET', '/components');
for (const [name, category, priceCents, powerWatts, maker] of COMPONENTS) {
  if (existingParts.some((c) => c.name === name)) continue;
  const manufacturerId = makers.find((m) => m.name === maker).id;
  await call('POST', '/components', { name, category, priceCents, powerWatts, manufacturerId });
}
const parts = await call('GET', '/components');
console.log(`Peças no catálogo: ${parts.length}`);

// 5. Build de exemplo (só se ainda não existir)
const builds = await call('GET', '/builds/mine');
if (!builds.some((b) => b.name === BUILD.name)) {
  const build = await call('POST', '/builds', { name: BUILD.name, maxBudgetCents: BUILD.maxBudgetCents });
  for (const partName of BUILD.parts) {
    const part = parts.find((c) => c.name === partName);
    await call('POST', `/builds/${build.id}/items`, { componentId: part.id, quantity: 1 });
  }
  const summary = await call('GET', `/builds/${build.id}/summary`);
  console.log(`Build "${summary.name}": R$ ${(summary.totalCents / 100).toFixed(2)} de R$ ${(summary.maxBudgetCents / 100).toFixed(2)}, ${summary.totalWatts} W`);
} else {
  console.log(`Build "${BUILD.name}" já existia.`);
}

console.log(`\nPronto. Entre com ${USER.email} / ${USER.password}`);
