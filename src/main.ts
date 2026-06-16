import './style.css';
import './app.css';
import { marked } from 'marked';
import { store } from './store';
import { EditorView } from './EditorView';
import { PresentationView } from './PresentationView';

import hilfeMd from '../content/hilfe.md?raw';
import ueberMd from '../content/ueber.md?raw';
import datenschutzMd from '../content/datenschutz.md?raw';
import impressumMd from '../content/impressum.md?raw';

const contentMap: Record<string, string> = {
  'hilfe': hilfeMd,
  'ueber': ueberMd,
  'datenschutz': datenschutzMd,
  'impressum': impressumMd,
};

const appDiv = document.querySelector<HTMLDivElement>('#app')!;
const shellHeader = document.querySelector<HTMLElement>('.app-header');
const shellFooter = document.querySelector<HTMLElement>('.app-footer');

let currentViewInstance: EditorView | PresentationView | null = null;
let currentViewMode = store.getState().viewMode;

function renderApp() {
  const state = store.getState();
  
  if (state.viewMode !== currentViewMode || !currentViewInstance) {
    if (currentViewInstance) {
      currentViewInstance.unmount();
    }
    
    currentViewMode = state.viewMode;
    
    if (currentViewMode === 'presentation') {
      // Hide shell header/footer during presentation
      if (shellHeader) shellHeader.style.display = 'none';
      if (shellFooter) shellFooter.style.display = 'none';
      appDiv.style.padding = '0'; // Remove workspace padding
      
      currentViewInstance = new PresentationView(appDiv);
      currentViewInstance.mount();
    } else {
      // Show shell header/footer
      if (shellHeader) shellHeader.style.display = 'flex';
      if (shellFooter) shellFooter.style.display = 'flex';
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
  appDiv.style.padding = '2rem';

  const mdContent = contentMap[page];
  if (mdContent) {
    const htmlContent = marked.parse(mdContent);
    appDiv.innerHTML = `
      <div class="surface" style="max-width: 800px; margin: 0 auto; width: 100%;">
        <a href="#" style="display: inline-block; margin-bottom: 1rem; color: var(--color-primary); text-decoration: none;">&larr; Zurück zur App</a>
        <div class="content-body">
          ${htmlContent}
        </div>
      </div>
    `;
  } else {
    appDiv.innerHTML = `
      <div class="surface">
        <h2>Seite nicht gefunden</h2>
        <a href="#">&larr; Zurück zur App</a>
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
