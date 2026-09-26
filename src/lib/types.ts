export type OpportunityView = {
  id: string;
  title: string;
  company: string;
  industry: string;
  description: string;
  skills: string[];
  duration: string;
  durationWeeks: number;
  paid: boolean;
  remote: boolean;
  budget: number | null;
  headcount: number;
  from: string;
  to: string;
};
