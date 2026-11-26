import './style.css';
import './app.css';
import { store } from './store';
import { EditorView } from './EditorView';
import { PresentationView } from './PresentationView';
import { renderSafeMarkdown } from './sanitizeHtml';
import { t, type TranslationKey } from './i18n';
import type { Language } from './types';
import exampleProject from '../docs/examples/photosynthese-90s.prompter?raw';

const contentFiles = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const contentPages = new Set(['hilfe', 'ueber', 'datenschutz', 'impressum', 'fuer-lehrkraefte', 'unterstuetzung', 'agb']);

const languageSelect = document.querySelector<HTMLSelectElement>('#lang-select');
languageSelect?.addEventListener('change', () => store.setLanguage(languageSelect.value as Language));

function updateShellTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n') as TranslationKey;
    if (key) {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label') as TranslationKey;
    if (key) el.setAttribute('aria-label', t(key));
  });
  if (languageSelect) languageSelect.value = store.getState().language;
  const repositoryLink = document.querySelector<HTMLAnchorElement>('.github-link');
  if (repositoryLink) {
    repositoryLink.title = t('nav.repository');
    repositoryLink.setAttribute('aria-label', t('nav.repository'));
  }
  document.documentElement.lang = store.getState().language;
}

function updateProjectTheme() {
  document.documentElement.dataset.theme = store.getState().project.theme;
}

// Initial translation
updateShellTranslations();
updateProjectTheme();

const appDiv = document.querySelector<HTMLDivElement>('#app')!;
const shellHeader = document.querySelector<HTMLElement>('.app-header');
const shellFooter = document.querySelector<HTMLElement>('.app-footer');
let contentTrigger: HTMLElement | null = null;

document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href^="#/"]');
  if (link && !window.location.hash.startsWith('#/')) contentTrigger = link;
});

let currentViewInstance: EditorView | PresentationView | null = null;
let currentViewMode = store.getState().viewMode;

let currentLanguage = store.getState().language;

function renderApp() {
  const state = store.getState();
  const langChanged = state.language !== currentLanguage;
  updateProjectTheme();
  
  if (langChanged) {
    currentLanguage = state.language;
    updateShellTranslations();
    const hash = window.location.hash;
    if (hash.startsWith('#/') && hash.length > 2) {
      renderContentPage(hash.substring(2), false);
      return;
    }
  }

  if (window.location.hash.startsWith('#/')) return;
  
  if (state.viewMode !== currentViewMode || !currentViewInstance || langChanged) {
    if (currentViewInstance) {
      currentViewInstance.unmount();
    }
    
    currentViewMode = state.viewMode;
    
    if (currentViewMode === 'presentation' || currentViewMode === 'preview') {
      // Hide shell header/footer during presentation
      if (shellHeader) shellHeader.style.display = 'none';
      if (shellFooter) shellFooter.style.display = 'none';
      appDiv.style.padding = '0'; // Remove workspace padding
      
      currentViewInstance = new PresentationView(
        appDiv,
        currentViewMode === 'preview' ? 'preview' : 'presentation',
      );
      currentViewInstance.mount();
    } else {
      // Show shell header/footer
      if (shellHeader) shellHeader.style.display = 'flex';
      if (shellFooter) shellFooter.style.display = 'flex';
      appDiv.style.removeProperty('padding');
      
      currentViewInstance = new EditorView(appDiv);
      currentViewInstance.mount();
    }
  }
}

store.subscribe(renderApp);

function renderContentPage(page: string, moveFocus = true) {
  if (currentViewInstance) {
    currentViewInstance.unmount();
    currentViewInstance = null;
  }
  
  // Show shell header/footer
  if (shellHeader) shellHeader.style.display = 'flex';
  if (shellFooter) shellFooter.style.display = 'flex';
  appDiv.style.removeProperty('padding');

  const lang = store.getState().language;
  const fileName = `../content/${page}${lang === 'de' ? '' : `_${lang}`}.md`;
  const mdContent = contentPages.has(page) ? contentFiles[fileName] : undefined;

  if (page === 'beispiele') {
    appDiv.innerHTML = `
      <div class="legal-page">
        <a href="#" class="back-link">&larr; ${t('content.back')}</a>
        <div class="markdown-body">
          <h1 tabindex="-1">${t('content.examplesTitle')}</h1>
          <p>${t('content.exampleDescription')}</p>
          <button id="load-example" class="button button--primary" type="button">${t('content.exampleOpen')}</button>
        </div>
      </div>
    `;
    appDiv.querySelector('#load-example')?.addEventListener('click', () => {
      if (!window.confirm(t('content.exampleConfirm'))) return;
      const result = store.importProject(exampleProject);
      if (result.ok) window.location.hash = '#';
    });
  } else if (mdContent) {
    const htmlContent = renderSafeMarkdown(mdContent);
    appDiv.innerHTML = `
      <div class="legal-page">
        <a href="#" class="back-link">&larr; ${t('content.back')}</a>
        <div class="markdown-body">
          ${htmlContent}
        </div>
      </div>
    `;
    appDiv.querySelectorAll<HTMLAnchorElement>('.markdown-body a[href^="http"]').forEach(link => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    if (page === 'unterstuetzung') {
      appDiv.querySelector('.markdown-body a[href^="https://buymeacoffee.com/"]')?.classList.add('support-cta');
    }
  } else {
    appDiv.innerHTML = `
      <div class="legal-page">
        <h1 tabindex="-1">${t('content.notFound')}</h1>
        <a href="#" class="back-link">&larr; ${t('content.back')}</a>
      </div>
    `;
  }
  appDiv.querySelector<HTMLHeadingElement>('h1')?.setAttribute('tabindex', '-1');
  if (moveFocus) appDiv.querySelector<HTMLHeadingElement>('h1')?.focus();
}

function router() {
  const hash = window.location.hash;
  if (hash.startsWith('#/') && hash.length > 2) {
    const page = hash.substring(2);
    renderContentPage(page);
    window.scrollTo(0, 0);
  } else {
    // Reset view instance to force re-mount if coming from a content page
    if (!currentViewInstance) {
      currentViewMode = store.getState().viewMode;
      // Triggers re-render
      renderApp();
      window.scrollTo(0, 0);
      if (contentTrigger?.isConnected) contentTrigger.focus();
      else appDiv.querySelector<HTMLHeadingElement>('h1')?.focus();
    }
  }
}

window.addEventListener('hashchange', router);

// Initial render
router();
