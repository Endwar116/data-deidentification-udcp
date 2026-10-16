import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Fork-identity regression tests: the page must present THIS project,
// crediting upstream in prose only — never linking out as if it were the live site.
const html = readFileSync('index.html', 'utf8');

describe('fork identity (page facade)', () => {
  it('keeps title and description present', () => {
    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta name="description"/);
  });

  it('links to this fork, not the upstream repo or site', () => {
    expect(html).not.toContain('github.com/dean9703111/data-deidentification');
    expect(html).not.toContain('deanlin.net');
    expect(html).toContain('github.com/Endwar116/data-deidentification-udcp');
  });

  it('carries no stale canonical pointing at another origin', () => {
    expect(html).not.toMatch(/<link rel="canonical"/);
  });
});
