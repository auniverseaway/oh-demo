import { LitElement, html, nothing } from 'lit';

import 'https://da.live/nx/public/sl/components.js';

class ProductBoard extends LitElement {
  static properties = {
    _name: { state: true },
  }

  connectedCallback() {
    super.connectedCallback();
  }

  handleInput(e) {
    const { target } = e;
    this._name = target.value;
  }

  render() {
    return html`
      <div style="max-width: 600px; margin: 0 auto;">
        <h1>Hello ${this._name || 'world'}!</h1>
        <sl-input type="text" name="name" @input=${this.handleInput}></sl-input>
        <div>
          <sl-button class="negative">This is cool</sl-button>
        </div>
      </div>
    `;
  }
}

customElements.define('da-product-board', ProductBoard);

export default function init(el) {
  const cmp = document.createElement('da-product-board');
  el.append(cmp);
}
