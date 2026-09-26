import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { matchScore } from "../src/lib/matching";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! }) });

/** Anchor dates to the upcoming October so the demo always looks current. */
const now = new Date();
const year = now.getMonth() >= 10 ? now.getFullYear() + 1 : now.getFullYear();
const d = (month: number, day: number) => new Date(Date.UTC(year, month - 1, day));

const SKILLS: [string, string][] = [
  ["Excel", "Analytics"],
  ["Financial Modelling", "Finance"],
  ["Valuation", "Finance"],
  ["Accounting", "Finance"],
  ["Power BI", "Analytics"],
  ["SQL", "Analytics"],
  ["Python", "Analytics"],
  ["Data Storytelling", "Communication"],
  ["Market Research", "Strategy"],
  ["Survey Design", "Strategy"],
  ["Business Writing", "Communication"],
  ["Figma", "Design"],
];

type SeedStudent = {
  name: string;
  email: string;
  education: string;
  program: string;
  location: string;
  bio: string;
  skills: [string, number | null][]; // null → unverified
  avail: [number, number, number, number] | null; // m1,d1,m2,d2
};

const STUDENTS: SeedStudent[] = [
  {
    name: "Vaibhav Rai",
    email: "vaibhav@sarasmer.dev",
    education: "Shri Ram College of Commerce",
    program: "B.Com (Hons), Final year",
    location: "New Delhi",
    bio: "Finance student who likes turning messy spreadsheets into decisions. Built valuation models for two student-run funds.",
    skills: [["Financial Modelling", 94], ["Excel", 97], ["Valuation", 88], ["Power BI", 91], ["Accounting", null], ["Python", null]],
    avail: [10, 12, 10, 28],
  },
  { name: "Meher Kapoor", email: "meher@sarasmer.dev", education: "NMIMS Mumbai", program: "MBA Finance, Year 1", location: "Mumbai", bio: "Ex-audit intern, now obsessed with FP&A.", skills: [["Financial Modelling", 92], ["Excel", 95], ["Accounting", 90]], avail: [10, 10, 11, 2] },
  { name: "Aarav Mehta", email: "aarav@sarasmer.dev", education: "IIT Madras", program: "B.Tech + Minor in Economics", location: "Chennai", bio: "Data person. Dashboards, SQL, and the occasional Python notebook.", skills: [["Power BI", 91], ["SQL", 89], ["Python", 93], ["Data Storytelling", 84]], avail: [10, 14, 11, 10] },
  { name: "Ishita Rao", email: "ishita@sarasmer.dev", education: "Christ University", program: "BBA, Final year", location: "Bengaluru", bio: "Consumer research and interviews; I like talking to customers.", skills: [["Market Research", 90], ["Survey Design", 86], ["Business Writing", 88], ["Excel", null]], avail: [10, 12, 10, 28] },
  { name: "Kabir Nair", email: "kabir@sarasmer.dev", education: "St. Xavier’s College", program: "BA Economics", location: "Kolkata", bio: "Econometrics nerd with a writing habit.", skills: [["Python", 82], ["Market Research", 79], ["Business Writing", 91]], avail: [10, 20, 11, 15] },
  { name: "Ananya Iyer", email: "ananya@sarasmer.dev", education: "Symbiosis Pune", program: "MBA Marketing", location: "Pune", bio: "Brand strategy with a quantitative streak.", skills: [["Market Research", 93], ["Data Storytelling", 90], ["Figma", 78], ["Power BI", null]], avail: [10, 5, 10, 25] },
  { name: "Rohan Gupta", email: "rohan@sarasmer.dev", education: "Delhi School of Economics", program: "MA Economics", location: "New Delhi", bio: "Modelling, forecasting, and a lot of coffee.", skills: [["Financial Modelling", 87], ["Valuation", 90], ["Excel", 93], ["SQL", null]], avail: [10, 15, 11, 5] },
  { name: "Sana Qureshi", email: "sana@sarasmer.dev", education: "Jamia Millia Islamia", program: "B.Tech CSE", location: "New Delhi", bio: "Analytics engineer in training.", skills: [["SQL", 94], ["Power BI", 88], ["Python", 90]], avail: [11, 1, 11, 30] },
  { name: "Dev Malhotra", email: "dev@sarasmer.dev", education: "IIM Indore (IPM)", program: "IPM, Year 4", location: "Indore", bio: "Consulting-style problem solving, clean decks.", skills: [["Market Research", 85], ["Excel", 90], ["Business Writing", 87], ["Financial Modelling", null]], avail: [10, 12, 11, 12] },
  { name: "Priya Menon", email: "priya@sarasmer.dev", education: "Loyola College", program: "B.Com Accounting & Finance", location: "Chennai", bio: "CA inter cleared; detail-oriented reconciler.", skills: [["Accounting", 95], ["Excel", 92], ["Financial Modelling", 80]], avail: null },
];

const COMPANIES = [
  { name: "Northwind Capital", industry: "Finance", email: "hiring@northwind.dev", contact: "Ritika Bansal" },
  { name: "Aster Labs", industry: "Consumer", email: "talent@asterlabs.dev", contact: "Neel Joshi" },
  { name: "Kestrel Logistics", industry: "Operations", email: "people@kestrel.dev", contact: "Farah Siddiqui" },
  { name: "Meridian Health", industry: "Healthcare", email: "ops@meridian.dev", contact: "Arjun Pillai" },
  { name: "Lumen Retail", industry: "Retail", email: "growth@lumen.dev", contact: "Tara Sen" },
];

type SeedProject = {
  id?: string;
  company: string;
  title: string;
  description: string;
  skills: string[];
  weeks: number;
  from: [number, number];
  to: [number, number];
  headcount: number;
  budget: number | null;
  remote?: boolean;
};

const PROJECTS: SeedProject[] = [
  { id: "opp-financial-analysis", company: "Northwind Capital", title: "Financial Analysis Intern", description: "Build a three-statement model and quarterly variance pack for a mid-market portfolio company. You’ll present findings to the deal team in week three.", skills: ["Financial Modelling", "Excel", "Valuation"], weeks: 4, from: [10, 12], to: [11, 8], headcount: 2, budget: 24000 },
  { id: "opp-market-research", company: "Aster Labs", title: "Market Research Project", description: "Size the D2C wellness market in tier-2 cities and synthesise 30 customer interviews into a positioning memo.", skills: ["Market Research", "Power BI", "Survey Design"], weeks: 3, from: [10, 14], to: [11, 2], headcount: 3, budget: 18000 },
  { id: "opp-sales-dashboard", company: "Kestrel Logistics", title: "Sales Dashboard Build", description: "Replace a weekly spreadsheet ritual with a live Power BI dashboard for regional sales heads.", skills: ["Power BI", "SQL", "Data Storytelling"], weeks: 2, from: [10, 20], to: [11, 1], headcount: 1, budget: null, remote: false },
  { company: "Northwind Capital", title: "Q3 Forecasting Sprint", description: "Rebuild the rolling forecast for two portfolio companies and stress-test three downside scenarios.", skills: ["Financial Modelling", "Excel"], weeks: 3, from: [10, 14], to: [10, 30], headcount: 2, budget: 21000 },
  { company: "Meridian Health", title: "Clinic Unit Economics", description: "Model contribution margin per clinic and recommend where to open the next five.", skills: ["Financial Modelling", "Excel", "Data Storytelling"], weeks: 4, from: [10, 19], to: [11, 16], headcount: 1, budget: 26000 },
  { company: "Lumen Retail", title: "Customer Survey Redesign", description: "Redesign our NPS and post-purchase surveys, then analyse the first 2,000 responses.", skills: ["Survey Design", "Market Research", "Python"], weeks: 3, from: [11, 2], to: [11, 23], headcount: 2, budget: 15000 },
  { company: "Aster Labs", title: "Pricing Page Copy & Research", description: "Interview ten customers and draft pricing page copy that explains our plans in plain language.", skills: ["Business Writing", "Market Research"], weeks: 2, from: [10, 12], to: [10, 26], headcount: 1, budget: 9000 },
  { company: "Kestrel Logistics", title: "Warehouse Cost Model", description: "Cost-to-serve model across six warehouses, with a recommendation on consolidation.", skills: ["Excel", "Financial Modelling", "SQL"], weeks: 5, from: [10, 26], to: [11, 30], headcount: 1, budget: 30000 },
  { company: "Meridian Health", title: "Patient Journey Research", description: "Map the outpatient journey across three hospitals; unpaid, with a certificate and reference letter.", skills: ["Market Research", "Figma"], weeks: 2, from: [11, 3], to: [11, 17], headcount: 2, budget: null },
  { company: "Lumen Retail", title: "Store Performance Analytics", description: "SQL + Power BI analysis of 140 stores to find the patterns behind top-quartile performance.", skills: ["SQL", "Power BI", "Python"], weeks: 4, from: [10, 15], to: [11, 12], headcount: 2, budget: 22000 },
  { company: "Northwind Capital", title: "Equity Research Support", description: "Help our analysts build comps and write initiation notes on two listed mid-caps.", skills: ["Valuation", "Business Writing", "Excel"], weeks: 6, from: [11, 1], to: [12, 12], headcount: 1, budget: 36000 },
  { company: "Aster Labs", title: "Month-End Close Support", description: "Reconciliations and close checklist for a fast-growing D2C brand.", skills: ["Accounting", "Excel"], weeks: 2, from: [10, 28], to: [11, 11], headcount: 1, budget: 12000 },
];

async function main() {
  console.log("↺ Clearing tables");
  await db.application.deleteMany();
  await db.project.deleteMany();
  await db.studentSkill.deleteMany();
  await db.availability.deleteMany();
  await db.student.deleteMany();
  await db.company.deleteMany();
  await db.user.deleteMany();
  await db.skill.deleteMany();

  const passwordHash = await bcrypt.hash("sarasmer2026", 11);

  console.log("✦ Skills");
  const skillIds = new Map<string, string>();
  for (const [name, category] of SKILLS) {
    const s = await db.skill.create({ data: { name, category } });
    skillIds.set(name, s.id);
  }

  console.log("✦ Students");
  const students: { id: string; name: string; skills: { name: string; verified: boolean; score: number | null }[]; availability: { from: Date; to: Date; status: string } | null }[] = [];
  for (const [i, s] of STUDENTS.entries()) {
    const user = await db.user.create({
      data: {
        email: s.email,
        name: s.name,
        role: "STUDENT",
        passwordHash,
        student: {
          create: {
            education: s.education,
            program: s.program,
            location: s.location,
            bio: s.bio,
            skills: {
              create: s.skills.map(([name, score], k) => ({
                skillId: skillIds.get(name)!,
                verified: score !== null,
                score,
                verifiedAt: score !== null ? new Date(Date.UTC(year, 8, 2 + ((i + k) % 24))) : null,
              })),
            },
            availability: s.avail
              ? { create: { from: d(s.avail[0], s.avail[1]), to: d(s.avail[2], s.avail[3]), status: "AVAILABLE" } }
              : { create: { from: d(10, 1), to: d(10, 31), status: "UNAVAILABLE" } },
          },
        },
      },
      include: { student: { include: { availability: true } } },
    });
    students.push({
      id: user.student!.id,
      name: s.name,
      skills: s.skills.map(([name, score]) => ({ name, verified: score !== null, score })),
      availability: user.student!.availability,
    });
  }

  console.log("✦ Companies & projects");
  const companyIds = new Map<string, string>();
  for (const c of COMPANIES) {
    const user = await db.user.create({
      data: { email: c.email, name: c.contact, role: "COMPANY", passwordHash, company: { create: { name: c.name, industry: c.industry } } },
      include: { company: true },
    });
    companyIds.set(c.name, user.company!.id);
  }

  const projects = [];
  for (const [i, p] of PROJECTS.entries()) {
    const company = COMPANIES.find((c) => c.name === p.company)!;
    projects.push(
      await db.project.create({
        data: {
          id: p.id,
          companyId: companyIds.get(p.company)!,
          title: p.title,
          description: p.description,
          skills: p.skills,
          industry: company.industry,
          duration: `${p.weeks} ${p.weeks === 1 ? "week" : "weeks"}`,
          durationWeeks: p.weeks,
          paid: p.budget !== null,
          remote: p.remote ?? true,
          availabilityFrom: d(...p.from),
          availabilityTo: d(...p.to),
          headcount: p.headcount,
          budget: p.budget,
          createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 19),
        },
      }),
    );
  }

  console.log("✦ Applications");
  const statuses = ["APPLIED", "SHORTLISTED", "MATCHED"] as const;
  let n = 0;
  for (const st of students) {
    const ranked = projects
      .map((p) => ({ p, score: matchScore(p.skills, st.skills, { from: p.availabilityFrom, to: p.availabilityTo }, st.availability) }))
      .filter((r) => r.score >= 55)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    for (const [k, r] of ranked.entries()) {
      await db.application.create({ data: { studentId: st.id, projectId: r.p.id, matchScore: r.score, status: statuses[(n + k) % 3] } });
    }
    n++;
  }

  const counts = await Promise.all([db.user.count(), db.project.count(), db.application.count()]);
  console.log(`✓ Seeded ${counts[0]} users · ${counts[1]} projects · ${counts[2]} applications`);
  console.log("  Student login: vaibhav@sarasmer.dev / sarasmer2026");
  console.log("  Company login: hiring@northwind.dev / sarasmer2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
