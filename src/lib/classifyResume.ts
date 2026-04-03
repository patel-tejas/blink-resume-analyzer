export type ResumeCategory = 'technical' | 'business' | 'general';

const TECH_KEYWORDS = [
  'react', 'angular', 'vue', 'node.js', 'python', 'java', 'typescript', 'javascript',
  'c++', 'c#', 'golang', 'django', 'spring', 'aws', 'azure', 'gcp', 'docker', 
  'kubernetes', 'sql', 'mongodb', 'postgresql', 'machine learning', 'ai', 'data science',
  'leetcode', 'github', 'hackerrank', 'stack overflow', 'backend', 'frontend', 'front-end',
  'full-stack', 'fullstack', 'devops', 'flutter', 'react native'
];

const BUSINESS_KEYWORDS = [
  'mba', 'marketing', 'sales', 'business development', 'product management',
  'finance', 'accounting', 'p&l', 'roi', 'strategy', 'consulting',
  'operations', 'supply chain', 'human resources', 'project management',
  'agile', 'scrum', 'b2b', 'b2c', 'crm', 'salesforce', 'seo', 'sem', 'go-to-market',
  'pricing', 'kpi', 'stakeholder'
];

export function classifyResume(text: string): ResumeCategory {
  const lower = text.toLowerCase();
  
  let techScore = 0;
  for (const kw of TECH_KEYWORDS) {
    // Escape special characters in keywords and use word boundaries
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
    if (regex.test(lower)) {
      techScore++;
    }
  }

  let bizScore = 0;
  for (const kw of BUSINESS_KEYWORDS) {
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
    if (regex.test(lower)) {
      bizScore++;
    }
  }
  
  if (techScore > bizScore && techScore >= 2) return 'technical';
  if (bizScore > techScore && bizScore >= 2) return 'business';
  
  // Tie or neither meets threshold
  return 'general';
}
