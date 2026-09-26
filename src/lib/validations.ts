import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

export const signupSchema = z
  .object({
    role: z.enum(["STUDENT", "COMPANY"]),
    name: z.string().trim().min(2, "Tell us your name"),
    email: z.string().trim().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[0-9]/, "Include a number"),
    companyName: z.string().trim().optional(),
  })
  .refine((v) => v.role !== "COMPANY" || (v.companyName && v.companyName.length >= 2), {
    path: ["companyName"],
    message: "Company name is required",
  });

export const projectSchema = z
  .object({
    title: z.string().trim().min(4, "Give the project a clear title").max(90),
    description: z.string().trim().min(20, "A sentence or two, at least").max(1200),
    skills: z.array(z.string()).min(1, "Pick at least one skill").max(6, "Up to six skills"),
    durationWeeks: z.coerce.number().int().min(1).max(12),
    availabilityFrom: z.union([z.string().min(1, "Pick a date"), z.date()]).pipe(z.coerce.date()),
    availabilityTo: z.union([z.string().min(1, "Pick a date"), z.date()]).pipe(z.coerce.date()),
    headcount: z.coerce.number().int().min(1, "At least one").max(20, "Up to 20"),
    budget: z.coerce.number().int().min(0).max(1_000_000).optional(),
    industry: z.string().trim().min(2).default("Finance"),
  })
  .refine((v) => v.availabilityTo > v.availabilityFrom, { path: ["availabilityTo"], message: "End must be after start" });

export type ProjectInput = z.input<typeof projectSchema>;
export type ProjectOutput = z.output<typeof projectSchema>;

export const availabilitySchema = z
  .object({
    status: z.enum(["AVAILABLE", "UNAVAILABLE"]),
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((v) => v.to >= v.from, { path: ["to"], message: "End must be after start" });
