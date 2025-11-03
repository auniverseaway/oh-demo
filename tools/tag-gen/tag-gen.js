import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { LitElement, html, nothing } from 'da-lit';
import { loadPageTags, loadGenTags } from './utils.js';

// Super Lite components
import 'https://da.live/nx/public/sl/components.js';

// Application styles
import loadStyle from '../../scripts/utils/styles.js';
const styles = await loadStyle(import.meta.url);

class ADLTagGen extends LitElement {
  static properties = {
    path: { attribute: false },
    token: { attribute: false },
    _pageTags: { state: true },
    _genTags: { state: true },
    _status: { state: true },
  };

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [styles];
    this.getPageTags();
  }

  async getPageTags() {
    this._status = '';
    this._pageTags = await loadPageTags(this.path, this.token);
    this._status = undefined;
  }

  async generateTags() {
    this._status = 'Reading document and generating tags.';
    this._genTags = await loadGenTags(this.path, this.token);
    this._status = undefined;
  }

  get title() {
    return this._genTags ? 'Generated tags' : 'Current tags';
  }

  get tags() {
    return this._genTags || this._pageTags;
  }

  renderTags() {
    if (!this.tags) return nothing;

    return html`
      <p class="title">${this.title}</p>
      <ul>
        ${this.tags.map((tag) => html`<li>${tag}</li>`)}
      </ul>
      <div class="action-area">
      ${this.title === 'Current tags'
        ? html`<sl-button @click=${this.generateTags}>Generate tags</sl-button>`
        : html`<sl-button @click=${this.updateTags}>Save tags</sl-button>`}
      </div>
    `;
  }

  renderStatus() {
    return html`<p class="status">${this._status}</p>`;
  }

  render() {
    return html`
      ${this._status !== undefined ? this.renderStatus() : this.renderTags()}
    `;
  }
}

customElements.define('adl-tag-gen', ADLTagGen);

(async function init() {
  const { context, token } = await DA_SDK;
  const { org, repo, path } = context;

  const cmp = document.createElement('adl-tag-gen');
  cmp.path = `/${org}/${repo}${path}`;
  cmp.token = token;

  document.body.append(cmp);
}());
