import DOMPurify from 'dompurify';
import { marked, Renderer, type MarkedOptions } from 'marked';

const markdownRenderer = new Renderer();
markdownRenderer.html = () => '';

export function sanitizeMarkdownHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    FORBID_ATTR: ['style'],
    FORBID_TAGS: ['style'],
  });
}

export function renderSafeMarkdown(markdown: string, options: MarkedOptions = {}): string {
  const rawHtml = marked.parse(markdown, {
    ...options,
    renderer: markdownRenderer,
    async: false,
  }) as string;
  return sanitizeMarkdownHtml(rawHtml);
}
