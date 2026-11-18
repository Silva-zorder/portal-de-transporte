type MockRecord = { id: number } & Record<string, unknown>;
type MockDatabase = Record<string, MockRecord[]>;

const CARRIER_NAMES = [
  "Transporte Inteligente",
  "Movilidad Conectada",
  "Transporte Eficiente",
  "Transporte Avanzado",
  "Transporte Sostenible",
  "Transporte Futurista",
  "Transporte Rápido",
  "Transporte Innovador",
  "Transporte Ecológico",
  "Transporte Ágil",
  "Transporte Seguro",
  "Transporte Conectado",
  "Transporte Moderno",
  "Transporte Integrado",
];

const SERVICES = [
  "J&T Express · Standard",
  "Jadlog · .Package",
  "Correios · SEDEX",
  "Loggi · Expresso",
  "Braspress · Rodoviário",
  "Azul Cargo · Expresso",
  "Rodonaves · Standard",
  "Smart2C · Econômico",
];

const PEOPLE = [
  "Lucas Pereira",
  "Mariana Costa",
  "Thiago Almeida",
  "Fernanda Oliveira",
  "Gabriel Santos",
  "Juliana Lima",
  "Rafael Martins",
  "Camila Rocha",
  "Edgar Ferreira",
  "Beatriz Nunes",
];

const ACCESS_NAMES = [
  "Admin",
  "Master",
  "Manutenção",
  "Analista",
  "Standart",
  "Operação",
  "Financeiro",
  "Tabelas de frete",
  "Conciliação",
  "Suporte",
];

const UFS = ["SC", "PR", "RS", "SP", "RJ", "MG", "BA", "GO", "PE", "CE"];

const pick = <TItem>(items: readonly TItem[], index: number) =>
  items[index % items.length];

const range = (length: number) => Array.from({ length }, (_, index) => index);

const slug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const acronym = (value: string) =>
  value
    .split(" ")
    .map((word, index) => (index === 0 ? word[0] : word.slice(0, 2)))
    .join("")
    .toUpperCase()
    .slice(0, 3);

const pad = (value: number, size = 2) => String(value).padStart(size, "0");

const dateOf = (index: number) =>
  `${pad(28 - (index % 27))}/${pad(11 - (index % 3))}/2026`;

const cteKey = (index: number) =>
  `4226 1108 1234 5600 0190 5700 1000 1842 ${2110 + index * 101}`;

const money = (index: number, base: number, step: number) =>
  Math.round((base + ((index * step) % 60)) * 100) / 100;

function createMockDatabase(): MockDatabase {
  const carriers = range(64).map((index) => ({
    id: 1234 + index * 37,
    name:
      index < CARRIER_NAMES.length
        ? pick(CARRIER_NAMES, index)
        : `${pick(CARRIER_NAMES, index)} ${Math.floor(index / CARRIER_NAMES.length) + 1}`,
    partner: index % 3 === 0,
    active: index % 9 !== 8,
  }));

  const carrierServices = carriers.map((carrier, index) => ({
    id: carrier.id,
    acronym: acronym(carrier.name),
    name: carrier.name,
    carrierName: carrier.name,
    cnpj: `12.345.${pad(100 + index, 3)}/0001-${pad(10 + (index % 89))}`,
    tarAcronym: `${acronym(carrier.name)}-TAR`,
    freightTimeout: 3000 + (index % 5) * 500,
    active: carrier.active,
  }));

  const customers = range(58).map((index) => {
    const name =
      index < CARRIER_NAMES.length
        ? pick(CARRIER_NAMES, index)
        : `${pick(CARRIER_NAMES, index)} ${Math.floor(index / CARRIER_NAMES.length) + 1}`;
    return {
      id: 1234 + index * 41,
      platform: "MZ",
      name,
      identifier: slug(name),
      cnpj: `12.345.${pad(678 + index, 3)}/0001-${pad(90 - (index % 80))}`,
      token: `tk_live_${pad(index, 4)}9f2a`,
      analyst: pick(PEOPLE, index),
      melhorEnvioId: index % 4 === 3 ? "" : String(48213 + index),
      melhorEnvioToken: index % 4 === 3 ? "" : `me_${pad(index, 4)}c7d1e9a4b2`,
      melhorEnvioAuthCode: index % 4 === 3 ? "" : `AUTH-${pad(73100 + index * 17, 6)}`,
      active: index % 11 !== 10,
    };
  });

  const marketplaces = [
    { prefix: "ML", name: "Mercado Livre", description: "Loja oficial ML" },
    { prefix: "ML", name: "Mercado Livre", description: "Mercado Livre Full" },
    { prefix: "ML", name: "Mercado Livre", description: "Mercado Livre Flex" },
  ];
  const customerMarketplaces = customers.slice(0, 12).flatMap((customer, c) =>
    marketplaces.slice(0, c === 0 ? 3 : 1 + (c % 3)).map((market, m) => {
      const id = 1021 + c * 3 + m;
      return {
        id,
        identifier: `${market.prefix}-${id}`,
        customerId: customer.id,
        customerName: customer.name,
        marketplace: market.name,
        description: market.description,
        userId: String(482193771 - c * 7001 - m * 913),
        active: !(c === 0 && m === 2),
      };
    }),
  );

  const marketplaceCarriers = customerMarketplaces.flatMap((market, index) =>
    range(index === 0 ? 4 : 2).map((position) => {
      const service = pick(SERVICES, index + position);
      return {
        id: 5000 + index * 4 + position,
        customerMarketplaceId: market.id,
        carrierService: service,
        marketplaceCode: `${service.slice(0, 3).toUpperCase()}-${service.split(" · ")[1].slice(0, 3).toUpperCase()}`,
        active: position !== 3,
      };
    }),
  );

  const customerGroups = [
    "Sul e Sudeste",
    "Norte e Nordeste",
    "Centro-Oeste",
    "Clientes Enterprise",
    "Clientes Starter",
    "Marketplaces",
    "Magazord Envios",
    "Pilotos",
  ].map((description, index) => ({
    id: [12, 31, 44, 51, 66, 86, 89, 53][index],
    platform: "MZ",
    description,
    active: index !== 7,
  }));

  const customerGroupMembers = customerGroups.flatMap((group, g) =>
    customers.slice(g, g + (g === 0 ? 12 : 4)).map((customer, position) => ({
      id: 9000 + g * 20 + position,
      customerGroupId: group.id,
      name: customer.name,
      identifier: customer.identifier,
    })),
  );

  const deadlineTables = range(42).map((index) => {
    const carrier = pick(CARRIER_NAMES, index);
    return {
      id: 1234 + index * 43,
      platform: "MZ",
      carrierService: pick(SERVICES, index),
      name:
        index < CARRIER_NAMES.length
          ? `${carrier} 21-03-2026`
          : `${carrier} 21-03-2026 (rev. ${Math.floor(index / CARRIER_NAMES.length)})`,
      sharedPlatforms: index % 2 === 0 ? "MZ, Tray" : "MZ",
      active: index % 10 !== 9,
    };
  });

  const zipRanges = deadlineTables.slice(0, 8).flatMap((table, t) =>
    range(t === 0 ? 40 : 10).map((position) => {
      const uf = pick(UFS, Math.floor(position / 2));
      const start = 88000 + position * 310;
      return {
        id: 88001 + t * 100 + position,
        deadlineTableId: table.id,
        tariffAcronym: `${uf}-${position % 2 === 0 ? "CAP" : "INT"}`,
        zipStart: `${pad(start % 100000, 5)}-000`,
        zipEnd: `${pad((start + 309) % 100000, 5)}-999`,
        days: 1 + ((position * 3) % 5),
        maxDays: 3 + ((position * 3) % 5),
      };
    }),
  );

  const priceTableNames = [
    ["J&T 2026-11-01 SC Prazo Tres e ja", "J&T Express"],
    ["Smart2C 2026-11-01 Plantas", "Smart2c"],
    ["Smart2C 2026-11-01 Especial", "Smart2c"],
    ["Smart2C 2026-11-01 Oficial e Frete Barato", "Smart2c"],
    ["Disk Tenha 2026-11-01 Feirão de Toalhas", "Disk Tenha"],
    ["Recrie 2026-11-01 Oficial", "Recrie Transportes"],
    ["Braspress 2026-11-01 Cofari", "Braspress"],
    ["Intermediação J&T 2026-11-01 Magazord Envios - Caeju", "J&T Magazord Envios SC"],
    ["J&T 2026-11-01 Tier D", "J&T Express"],
    ["Jadlog 2026-10-15 Oficial", "Jadlog"],
    ["Rodonaves 2026-10-15 Oficial", "Rodonaves"],
    ["Correios 2026-10-15 Sedex", "Correios"],
    ["Azul Cargo 2026-10-15 Expresso", "Azul Cargo"],
    ["Loggi 2026-10-15 Oficial", "Loggi"],
  ];
  const priceTables = range(36).map((index) => {
    const [name, service] = pick(priceTableNames, index);
    const cycle = Math.floor(index / priceTableNames.length);
    return {
      id: 3108 - index,
      name: cycle === 0 ? name : `${name} (rev. ${cycle})`,
      carrierService: service,
      type: index % 7 === 6 ? "Transferência" : "Preço",
      platform: "MZ",
      sharedPlatforms: "Magazord",
      valueLimit: 0,
      minWeight: 0,
      weightLimit: index % 4 === 0 ? 0 : 30,
      heightLimit: 0,
      widthLimit: 0,
      lengthLimit: 0,
      active: index % 12 !== 11,
    };
  });

  const priceLoads = priceTables.slice(0, 6).flatMap((table, t) =>
    range(t === 0 ? 60 : 12).map((position) => {
      const uf = pick(UFS, Math.floor(position / 6));
      return {
        id: 78643873 + t * 1000 + position,
        priceTableId: table.id,
        tariffAcronym: `${uf}-${Math.floor(position / 3) % 2 === 0 ? "CAP" : "INT"}`,
        type: position % 4 === 3 ? "2 - Valor da nota" : "1 - Peso",
        calculationBase: position % 4 === 3 ? "1 - % da nota" : "3 - Valor fixo",
        weightLimit: [1, 5, 10][position % 3],
        value: Math.round((27.91 + position * 0.84 + t) * 100) / 100,
      };
    }),
  );

  const feeKinds = [
    { type: "4 - Advalorem", base: "1 - % da nota", value: 0.2, order: 1 },
    { type: "3 - Gris", base: "1 - % da nota", value: 0.4, order: 1 },
    { type: "8 - ICMS", base: "2 - % do frete", value: 7, order: 99 },
    { type: "2 - Pedágio", base: "3 - Valor fixo", value: 9.9, order: 2 },
  ];
  const priceFees = priceTables.slice(0, 6).flatMap((table, t) =>
    range(t === 0 ? 32 : 6).map((position) => {
      const kind = position < 2 ? feeKinds[position] : pick(feeKinds, position);
      const start = position < 2 ? 1 : 40000000 + position * 1000000;
      return {
        id: 2772259 + t * 100 + position,
        priceTableId: table.id,
        tariffAcronym: `${pick(UFS, position)}-${position % 2 === 0 ? "CAP" : "INT"}`,
        zipStart: String(start),
        zipEnd: String(position < 2 ? 99999999 : start + 999999),
        type: kind.type,
        originUf: pick(UFS, t + position),
        calculationBase: kind.base,
        baseValueStart: 0,
        baseValueEnd: position % 3 === 0 ? 0 : 5000,
        value: kind.value,
        minValue: position % 2 === 0 ? 0 : 3.5,
        order: kind.order,
      };
    }),
  );

  const tableRelations = range(38).map((index) => {
    const customer = pick(customers, index + 3);
    const deadlineTable = pick(deadlineTables, index);
    const priceTable = pick(priceTables, index);
    const transferTable = index % 4 === 0 ? pick(priceTables, index + 6) : undefined;
    const magazordEnvios = index % 3 === 0;
    const intermediationTable = magazordEnvios ? priceTables[7] : undefined;
    const notifiesByEmail = index % 2 === 0;
    return {
      id: 1234 + index * 47,
      name: customer.name,
      customerId: customer.id,
      customerName: customer.name,
      customerToken: customer.token,
      carrierService: pick(SERVICES, index),
      deadlineTableId: deadlineTable.id,
      deadlineTable: deadlineTable.name,
      priceTableId: priceTable.id,
      priceTable: priceTable.name,
      transferTableId: transferTable?.id ?? 0,
      transferTable: transferTable?.name ?? "",
      magazordEnvios,
      intermediationTableId: intermediationTable?.id ?? 0,
      intermediationTable: intermediationTable?.name ?? "",
      cubage: index % 2 === 1,
      validatesDimensions: index % 3 !== 2,
      validatesWeight: true,
      freightCalculationType: pick(["Peso real", "Peso cubado", "Maior peso"], index),
      limitsDimensions: index % 4 !== 1,
      volumeLimit: [10, 20, 50][index % 3],
      splitsVolumes: index % 5 === 0,
      timeout: 3000 + (index % 4) * 500,
      notifiesByEmail,
      notificationEmail: notifiesByEmail ? `${customer.identifier}@magazord.com.br` : "",
      sendsPdf: notifiesByEmail && index % 4 === 0,
      notifiesByFtp: index % 6 === 5,
      carrierApiType: pick(["J&T Express", "Jadlog", "Correios", "Loggi", "Melhor Envio"], index),
      trackingLink: `https://rastreio.magazord.com.br/${customer.identifier}/{codigo}`,
      apiToken: `api_${pad(index, 4)}b81f3c`,
      active: index % 13 !== 12,
    };
  });

  const ctes = range(72).map((index) => {
    const customer = pick(customers, index * 3);
    const day = 8 + (Math.floor(index / 3) % 20);
    return {
      id: 184221 + index,
      number: String(184221 + index),
      customerIdentifier: customer.identifier,
      customerName: customer.name,
      competence: index % 5 > 2 ? "10/2026" : "11/2026",
      key: cteKey(index % 4),
      issuedAt: `${pad(day)}/11/2026`,
      dueDate: `${pad(day)}/12/2026`,
      carrierService: pick(SERVICES, index),
      storeCnpj: customer.cnpj,
      issuerCnpj: pick(carrierServices, index).cnpj,
      recipientCnpj: `98.765.${pad(100 + index, 3)}/0001-${pad(20 + (index % 70))}`,
      invoice: `FAT-${2026110 + Math.floor(index / 6)}`,
      freightValue: money(index, 18.75, 7.35),
      reconciled: index % 4 !== 1 && index % 4 !== 3,
    };
  });

  const reconciliations = range(30).map((index) => {
    const totalValue = [9842.1, 6110.55, 18420, 2904.3, 4380.9][index % 5];
    const reconciledPercent = [92, 100, 87, 99, 95, 100, 97, 91, 100, 98][index % 10];
    const customer = pick(customers, [0, 1, 2, 3, 6][index % 5]);
    const cteCount = [312, 208, 544, 97, 150, 288, 310, 122, 405, 260][index % 10];
    const calculatedFreight = Math.round(totalValue * 0.9766 * 100) / 100;
    return {
      id: 4821 - index,
      date: dateOf(index * 4),
      customerName: customer.name,
      cnpj: customer.cnpj,
      tolerance: [2, 2, 5, 2, 3][index % 5],
      cteCount,
      itemCount: cteCount + (index % 4) * 3,
      totalValue,
      calculatedFreight,
      difference: Math.round((totalValue - calculatedFreight) * 100) / 100,
      reconciledPercent,
      status: reconciledPercent === 100 ? "Concluída" : "Em análise",
    };
  });

  const reconciliationCtes = reconciliations.slice(0, 6).flatMap((item, r) =>
    range(r === 0 ? 48 : 10).map((position) => {
      const cteValue = [23.9, 41.1, 18.75, 56.3, 32][position % 5];
      const difference = [0, 4.3, 0, 0, 0.6][position % 5];
      const cteId = 184221 + r * 100 + position;
      return {
        id: 900100 + r * 100 + position,
        reconciliationId: item.id,
        cteId,
        number: String(cteId),
        series: String(1 + (position % 3)),
        key: cteKey(position % 4),
        dueDate: `${pad(8 + (position % 3))}/12/2026`,
        customerName: item.customerName,
        cteValue,
        intermediationValue: Math.round(cteValue * 0.08 * 100) / 100,
        freightValue: Math.round((cteValue - difference) * 100) / 100,
        reconciled: difference <= 1,
      };
    }),
  );

  const billingDocuments = range(40).map((index) => {
    const type = index % 2 === 0 ? "NFS-e" : "Boleto";
    const id = 7731 - index;
    return {
      id,
      type,
      identifier: slug(pick(CARRIER_NAMES, [0, 1, 2, 3, 6][index % 5])),
      competence: index % 5 > 2 ? "09/2026" : "10/2026",
      value: [9842.1, 6110.55, 18420, 2904.3, 4380.9][index % 5],
      file: `${type === "NFS-e" ? "nfse" : "boleto"}-${id}.pdf`,
      status: ["Enviado", "Pago", "Enviado", "Pago", "Pendente"][index % 5],
      date: `${pad(10 - (index % 7))}/11/2026`,
    };
  });

  const stores = [
    "Mindsup",
    "Vidacosteira",
    "modalove",
    "miniconceito",
    "archeer",
    "lojaflorybal",
    "lojaexemplo",
    "casamodelo",
  ];
  const notifications = range(52).map((index) => ({
    id: 6000 + index,
    identifier: pick(stores, index),
    trackingCode: `XJ${pad(9 + index, 3)}K3L8M2Q4R${index % 10}`,
    number: String(123456 + index * 811),
    key: `XyZ9aB3cD4eF5gH6iJ7kL8mN9oP${pad(index, 2)}q`,
    issuedAt: `${dateOf(index)} - ${pad(9 + (index % 9))}h${pad(5 + (index % 50))}m${pad(index % 60)}s`,
    carrierService: pick(SERVICES, index),
    platform: pick(["MZ", "MZ", "Tray", "Nuvemshop"], index),
    status: index % 8 === 7 ? "Falha" : "Enviado",
  }));

  const mongoSyncs = range(28).map((index) => ({
    id: 300 + index,
    status: index === 0 ? "Em andamento" : index % 9 === 8 ? "Erro" : "Concluída",
    requestedAt: `${dateOf(index * 2)} - 19h39`,
    duration: `00:00:${pad(12 + ((index * 7) % 45))}`,
    tables: index % 3 === 0 ? "VW_Client_Service" : "VW_Price_Table",
    filters: "JET",
  }));

  const logActions = ["Alteração", "Exclusão", "Alteração", "Nova", "Nova", "Alteração"];
  const logTables = ["tr_embalagem", "tr_prazo", "tr_transportadora", "tr_preço"];
  const logs = range(46).map((index) => {
    const action = pick(logActions, index);
    return {
      id: 7000 + index,
      action,
      table: pick(logTables, index),
      user: pick(PEOPLE, index),
      dbUser: "Magazord",
      date: `${dateOf(index)} ${pad(9 + (index % 9))}h30m12s`,
      data: JSON.stringify(
        { id: 3108 - index, nome: pick(priceTableNames, index)[0], ativo: true },
        null,
        2,
      ),
      changes:
        action === "Alteração"
          ? JSON.stringify({ ativo: { de: false, para: true } }, null, 2)
          : "{}",
    };
  });

  const users = range(34).map((index) => {
    const name = pick(PEOPLE, index);
    return {
      id: [12, 31, 44, 51, 66, 86, 89, 53][index] ?? 100 + index,
      platform: "MZ",
      name: index < PEOPLE.length ? name : `${name} ${index}`,
      email: `${slug(name).replace("-", ".")}${index < PEOPLE.length ? "" : index}@magazord.com.br`,
      type: index % 6 === 0 ? "Master" : "Cognito",
      active: index % 12 !== 11,
    };
  });

  const userGroups = users.flatMap((user, u) =>
    range(2).map((position) => ({
      id: 12 + u * 12 + position * 6,
      userId: user.id,
      description: pick(["Operação", "Financeiro", "Suporte"], u + position),
      platform: "MZ",
    })),
  );

  const userProfiles = users.flatMap((user, u) =>
    range(3).map((position) => ({
      id: 20 + u * 5 + position,
      userId: user.id,
      description: pick(["Master", "Tabelas de frete", "Conciliação", "Analista"], u + position),
      platform: "MZ",
    })),
  );

  const profiles = range(26).map((index) => ({
    id: [12, 31, 44, 51, 66, 86, 89, 53][index] ?? 100 + index,
    platform: "MZ",
    name: pick(ACCESS_NAMES, index),
    active: index % 10 !== 9,
  }));

  const ROUTES = [
    "api/rastreio",
    "api/conciliacaoFrete",
    "api/tabelasDeFrete",
    "api/clientes",
    "api/transportadoras",
    "api/notificacoes",
  ];
  const profileRoutes = profiles.flatMap((profile, p) =>
    range(4 + (p % 3)).map((position) => ({
      id: 9000 + p * 10 + position,
      profileId: profile.id,
      method: pick(["GET", "POST", "GET", "DELETE"], p + position),
      route: pick(ROUTES, p + position),
    })),
  );

  return {
    carriers,
    "carrier-services": carrierServices,
    customers,
    "customer-marketplaces": customerMarketplaces,
    "marketplace-carriers": marketplaceCarriers,
    "customer-groups": customerGroups,
    "customer-group-members": customerGroupMembers,
    "deadline-tables": deadlineTables,
    "zip-ranges": zipRanges,
    "price-tables": priceTables,
    "price-loads": priceLoads,
    "price-fees": priceFees,
    "table-relations": tableRelations,
    ctes,
    reconciliations,
    "reconciliation-ctes": reconciliationCtes,
    "billing-documents": billingDocuments,
    notifications,
    "mongo-syncs": mongoSyncs,
    logs,
    users,
    "user-groups": userGroups,
    "user-profiles": userProfiles,
    profiles,
    "profile-routes": profileRoutes,
  };
}

export { createMockDatabase, type MockDatabase, type MockRecord };
