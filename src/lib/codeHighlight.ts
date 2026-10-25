import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

export function languageFor(language?: string): string | undefined {
  const value = (language ?? '').toLowerCase();
  if (value.includes('typescript') || value === 'ts' || value === 'tsx') return 'typescript';
  if (value.includes('javascript') || value === 'js' || value === 'jsx') return 'javascript';
  if (value.includes('json')) return 'json';
  if (value.includes('css')) return 'css';
  if (value.includes('html') || value.includes('xml')) return 'xml';
  if (value.includes('python') || value === 'py') return 'python';
  if (value.includes('shell') || value.includes('bash')) return 'bash';
  return undefined;
}

export function highlightSource(source: string, language?: string): string {
  const target = languageFor(language);
  return target ? hljs.highlight(source, { language: target }).value : hljs.highlightAuto(source).value;
}
