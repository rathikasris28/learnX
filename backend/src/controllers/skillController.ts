import { Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';

const searchSchema = z.object({
  q: z.string().trim().max(120).default(''),
  domain: z.enum(['technical', 'non-technical']).optional(),
  category: z.string().trim().max(120).optional()
});

type SkillRow = {
  id: string;
  name: string;
  domain: 'technical' | 'non-technical';
  category: string;
  description: string;
  levels: string[];
};

export async function listSkills(request: Request, response: Response) {
  const input = searchSchema.parse(request.query);
  const filters: string[] = [];
  const values: string[] = [];
  if (input.q) {
    values.push(`%${input.q}%`);
    filters.push(`name ILIKE $${values.length}`);
  }
  if (input.domain) {
    values.push(input.domain);
    filters.push(`domain = $${values.length}`);
  }
  if (input.category) {
    values.push(input.category);
    filters.push(`category = $${values.length}`);
  }

  const result = await query<SkillRow>(
    `SELECT id, name, domain, category, description, levels
     FROM skills ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
     ORDER BY domain, category, name`,
    values
  );
  response.json({ skills: result.rows });
}

export async function listCategories(_request: Request, response: Response) {
  const result = await query<{ domain: string; category: string }>(
    'SELECT DISTINCT domain, category FROM skills ORDER BY domain, category'
  );
  response.json({ categories: result.rows });
}

export async function listDomains(_request: Request, response: Response) {
  const result = await query<{ domain: string }>('SELECT DISTINCT domain FROM skills ORDER BY domain');
  response.json({ domains: result.rows.map((row) => row.domain) });
}
