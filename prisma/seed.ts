import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const dbUrl = process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL ?? "file:E:/crm-mvp/dev.db";
const authToken = process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@admin.com",
      password: adminPassword,
      role: "admin",
      active: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "corretor@imob.com" },
    update: {},
    create: {
      name: "Corretor Teste",
      email: "corretor@imob.com",
      password: userPassword,
      role: "corretor",
      active: true,
    },
  });

  const properties = await Promise.all([
    prisma.property.create({ data: { title: "Apartamento 2 quartos", type: "Apartamento", area: 65, bedrooms: 2, bathrooms: 1, garageSpots: 1, address: "Rua das Flores, 123 - Vila Mariana, São Paulo - SP", description: "Apartamento bem localizado, próximo a metrô.", salePrice: 450000, rentPrice: 2500, status: "Disponível", latitude: -23.588, longitude: -46.632 } }),
    prisma.property.create({ data: { title: "Casa 3 quartos", type: "Casa", area: 120, bedrooms: 3, bathrooms: 2, garageSpots: 2, address: "Av. dos Pássaros, 500 - Moema, São Paulo - SP", description: "Casa ampla com piscina e jardim.", salePrice: 890000, status: "Disponível", latitude: -23.605, longitude: -46.662 } }),
    prisma.property.create({ data: { title: "Cobertura 4 quartos", type: "Cobertura", area: 200, bedrooms: 4, bathrooms: 3, garageSpots: 3, address: "Rua Augusta, 1500 - Itaim Bibi, São Paulo - SP", description: "Cobertura duplex com vista panorâmica.", salePrice: 1200000, status: "Vendido", latitude: -23.581, longitude: -46.678 } }),
    prisma.property.create({ data: { title: "Kitnet mobiliada", type: "Kitnet", area: 30, bedrooms: 1, bathrooms: 1, address: "Rua do Centro, 50 - Centro, São Paulo - SP", description: "Kitnet completa e mobiliada.", salePrice: 180000, rentPrice: 1800, status: "Alugado", latitude: -23.548, longitude: -46.634 } }),
    prisma.property.create({ data: { title: "Sala comercial", type: "Comercial", area: 80, address: "Av. Engenheiro, 300 - Brooklin, São Paulo - SP", description: "Sala comercial em prédio corporativo.", salePrice: 320000, rentPrice: 3500, status: "Disponível", latitude: -23.619, longitude: -46.693 } }),
  ]);

  const customers = await Promise.all([
    prisma.customer.create({ data: { name: "João Silva", email: "joao@email.com", phone: "(11) 99999-0001", document: "000.000.000-00", type: "Comprador", birthDate: "15/03/1985", address: "Rua A, 100 - São Paulo, SP", notes: "Interessado em apartamentos de 2 quartos na Zona Sul." } }),
    prisma.customer.create({ data: { name: "Maria Souza", email: "maria@email.com", phone: "(11) 99999-0002", document: "111.111.111-11", type: "Vendedor", birthDate: "22/07/1990", address: "Rua B, 200 - São Paulo, SP", notes: "Vendendo casa em Moema." } }),
    prisma.customer.create({ data: { name: "Pedro Costa", email: "pedro@email.com", phone: "(11) 99999-0003", document: "222.222.222-22", type: "Comprador", birthDate: "10/01/1978", notes: "Procura cobertura de alto padrão." } }),
    prisma.customer.create({ data: { name: "Ana Oliveira", email: "ana@email.com", phone: "(11) 99999-0004", document: "333.333.333-33", type: "Locatário", address: "Rua C, 300 - São Paulo, SP" } }),
    prisma.customer.create({ data: { name: "Carlos Santos", email: "carlos@email.com", phone: "(11) 99999-0005", document: "444.444.444-44", type: "Vendedor", notes: "Vendendo sala comercial no Brooklin." } }),
  ]);

  const agents = await Promise.all([
    prisma.agent.create({ data: { name: "Lucas Mendes", email: "lucas@imob.com", phone: "(11) 98888-0001", document: "555.555.555-55", creci: "123456-F", commission: 6, status: "Ativo", notes: "Corretor sênior - alto padrão." } }),
    prisma.agent.create({ data: { name: "Fernanda Rocha", email: "fernanda@imob.com", phone: "(11) 98888-0002", document: "666.666.666-66", creci: "654321-F", commission: 5, status: "Ativo" } }),
    prisma.agent.create({ data: { name: "Ricardo Oliveira", email: "ricardo@imob.com", phone: "(11) 98888-0003", creci: "789012-F", commission: 6, status: "Inativo" } }),
    prisma.agent.create({ data: { name: "Juliana Costa", email: "juliana@imob.com", phone: "(11) 98888-0004", document: "777.777.777-77", creci: "345678-F", commission: 5, status: "Ativo" } }),
  ]);

  await Promise.all([
    prisma.contract.create({ data: { type: "Venda", value: 1200000, date: new Date("2026-04-20"), status: "Concluído", customerId: customers[2].id, agentId: agents[0].id, propertyId: properties[2].id } }),
    prisma.contract.create({ data: { type: "Aluguel", value: 1800, date: new Date("2026-03-10"), status: "Ativo", notes: "Contrato de 12 meses.", customerId: customers[3].id, agentId: agents[3].id, propertyId: properties[3].id } }),
  ]);

  await Promise.all([
    prisma.visit.create({ data: { date: new Date("2026-06-04T14:00:00"), status: "Confirmada", customerId: customers[0].id, propertyId: properties[0].id, agentId: agents[0].id } }),
    prisma.visit.create({ data: { date: new Date("2026-06-05T10:00:00"), status: "Confirmada", customerId: customers[1].id, propertyId: properties[1].id, agentId: agents[1].id } }),
    prisma.visit.create({ data: { date: new Date("2026-06-06T15:30:00"), status: "Pendente", customerId: customers[2].id, propertyId: properties[2].id, agentId: agents[0].id } }),
  ]);

  const configs = [
    { key: "site_name", value: "Minha Imobiliária" },
    { key: "site_logo", value: "" },
    { key: "site_favicon", value: "" },
    { key: "hero_title", value: "Encontre o imóvel perfeito para você" },
    { key: "hero_subtitle", value: "Casas, apartamentos e salas comerciais nas melhores regiões" },
    { key: "hero_image", value: "" },
    { key: "about_title", value: "Por que escolher nossa imobiliária?" },
    { key: "about_text", value: "Somos referência no mercado imobiliário há mais de 10 anos, com centenas de imóveis comercializados e clientes satisfeitos." },
    { key: "about_image", value: "" },
    { key: "contact_email", value: "contato@imobiliaria.com.br" },
    { key: "contact_phone", value: "(11) 3000-0000" },
    { key: "contact_address", value: "Av. Paulista, 1000 - São Paulo, SP" },
    { key: "social_instagram", value: "" },
    { key: "social_facebook", value: "" },
    { key: "social_whatsapp", value: "" },
    { key: "menu_imoveis", value: "Imóveis" },
    { key: "menu_contato", value: "Contato" },
    { key: "footer_text", value: "© 2026 Minha Imobiliária. Todos os direitos reservados." },
  ];
  for (const c of configs) {
    await prisma.siteConfig.upsert({
      where: { key: c.key },
      update: { value: c.value },
      create: { key: c.key, value: c.value },
    });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
