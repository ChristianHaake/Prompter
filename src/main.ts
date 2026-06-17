import './style.css';
import './app.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { store } from './store';
import { EditorView } from './EditorView';
import { PresentationView } from './PresentationView';

import hilfeMd from '../content/hilfe.md?raw';
import ueberMd from '../content/ueber.md?raw';
import datenschutzMd from '../content/datenschutz.md?raw';
import impressumMd from '../content/impressum.md?raw';
import lehrkraefteMd from '../content/fuer-lehrkraefte.md?raw';

import hilfeEnMd from '../content/hilfe_en.md?raw';
import ueberEnMd from '../content/ueber_en.md?raw';
import datenschutzEnMd from '../content/datenschutz_en.md?raw';
import impressumEnMd from '../content/impressum_en.md?raw';
import lehrkraefteEnMd from '../content/fuer-lehrkraefte_en.md?raw';

import { t, TranslationKey } from './i18n';

const contentMap: Record<string, Record<'de' | 'en', string>> = {
  'hilfe': { de: hilfeMd, en: hilfeEnMd },
  'ueber': { de: ueberMd, en: ueberEnMd },
  'datenschutz': { de: datenschutzMd, en: datenschutzEnMd },
  'impressum': { de: impressumMd, en: impressumEnMd },
  'fuer-lehrkraefte': { de: lehrkraefteMd, en: lehrkraefteEnMd },
};

const langSwitchBtn = document.getElementById('lang-switch-btn');
if (langSwitchBtn) {
  langSwitchBtn.removeAttribute('onclick'); // Remove the alert
  langSwitchBtn.addEventListener('click', () => {
    const currentLang = store.getState().language;
    store.setLanguage(currentLang === 'de' ? 'en' : 'de');
  });
}

function updateShellTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n') as TranslationKey;
    if (key) {
      el.textContent = t(key);
    }
  });
  document.documentElement.lang = store.getState().language;
}

// Initial translation
updateShellTranslations();

const appDiv = document.querySelector<HTMLDivElement>('#app')!;
const shellHeader = document.querySelector<HTMLElement>('.app-header');
const shellFooter = document.querySelector<HTMLElement>('.app-footer');
const educationNotice = document.querySelector<HTMLElement>('#education-notice');

let currentViewInstance: EditorView | PresentationView | null = null;
let currentViewMode = store.getState().viewMode;

let currentLanguage = store.getState().language;

function renderApp() {
  const state = store.getState();
  const langChanged = state.language !== currentLanguage;
  
  if (langChanged) {
    currentLanguage = state.language;
    updateShellTranslations();
    
    // Rerender content page if we are on one
    const hash = window.location.hash;
    if (hash.startsWith('#/') && hash.length > 2) {
      const page = hash.substring(2);
      renderContentPage(page);
    }
  }
  
  if (state.viewMode !== currentViewMode || !currentViewInstance || langChanged) {
    if (currentViewInstance) {
      currentViewInstance.unmount();
    }
    
    currentViewMode = state.viewMode;
    
    if (currentViewMode === 'presentation') {
      // Hide shell header/footer during presentation
      if (shellHeader) shellHeader.style.display = 'none';
      if (shellFooter) shellFooter.style.display = 'none';
      if (educationNotice) educationNotice.style.display = 'none';
      appDiv.style.padding = '0'; // Remove workspace padding
      
      currentViewInstance = new PresentationView(appDiv);
      currentViewInstance.mount();
    } else {
      // Show shell header/footer
      if (shellHeader) shellHeader.style.display = 'flex';
      if (shellFooter) shellFooter.style.display = 'flex';
      if (educationNotice) educationNotice.style.display = 'flex';
      appDiv.style.padding = '2rem';
      
      currentViewInstance = new EditorView(appDiv);
      currentViewInstance.mount();
    }
  }
}

store.subscribe(renderApp);

function renderContentPage(page: string) {
  if (currentViewInstance) {
    currentViewInstance.unmount();
    currentViewInstance = null;
  }
  
  // Show shell header/footer
  if (shellHeader) shellHeader.style.display = 'flex';
  if (shellFooter) shellFooter.style.display = 'flex';
  if (educationNotice) educationNotice.style.display = 'flex';
  appDiv.style.padding = '2rem';

  const lang = store.getState().language;
  const mdContentObj = contentMap[page];
  
  if (mdContentObj && mdContentObj[lang]) {
    const rawHtml = marked.parse(mdContentObj[lang]) as string;
    const htmlContent = DOMPurify.sanitize(rawHtml);
    appDiv.innerHTML = `
      <div class="legal-page">
        <a href="#" class="back-link">&larr; ${t('content.back')}</a>
        <div class="markdown-body">
          ${htmlContent}
        </div>
      </div>
    `;
  } else {
    appDiv.innerHTML = `
      <div class="legal-page">
        <h2>${t('content.notFound')}</h2>
        <a href="#" class="back-link">&larr; ${t('content.back')}</a>
      </div>
    `;
  }
}

function router() {
  const hash = window.location.hash;
  if (hash.startsWith('#/') && hash.length > 2) {
    const page = hash.substring(2);
    renderContentPage(page);
  } else {
    // Reset view instance to force re-mount if coming from a content page
    if (!currentViewInstance) {
      currentViewMode = store.getState().viewMode;
      // Triggers re-render
      renderApp();
    }
  }
}

window.addEventListener('hashchange', router);

// Initial render
router();
