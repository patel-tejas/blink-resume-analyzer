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
  let bizScore = 0;

  // 1. Explicit Domain Overrides (Primary Tie-Breaker)
  // If the parsed text explicitly contains a technical platform URL, practically guarantee it as technical
  if (lower.includes('github.com/') || lower.includes('leetcode.com/') || lower.includes('codeforces.com/')) {
    techScore += 10;
  }

  // 2. Weighted Keyword Matching
  // Add weight per occurrence (capped to prevent keyword stuffing from heavily swaying the score)
  for (const kw of TECH_KEYWORDS) {
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) {
      techScore += Math.min(matches.length, 3); 
    }
  }

  for (const kw of BUSINESS_KEYWORDS) {
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) {
      bizScore += Math.min(matches.length, 3);
    }
  }
  
  // 3. Margin Verification & Output
  if (techScore > bizScore && techScore >= 2) return 'technical';
  if (bizScore > techScore && bizScore >= 2) return 'business';
  
  // Handled tie-breakers and ambiguous scoring
  if (techScore === bizScore && techScore >= 5) {
     return 'technical'; // Defaults to technical for hybrid roles if highly saturated
  }

  // Tie or neither meets baseline threshold
  return 'general';
}
