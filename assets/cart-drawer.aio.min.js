class CartDrawer extends HTMLElement {
  constructor() {
    super();

    // Use arrow functions for cleaner event handlers
    this.addEventListener('keyup', evt => {
      if (evt.code === 'Escape') this.close();
    });

    const overlay = this.querySelector('#CartDrawer-Overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.close());
    }

    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    document.querySelectorAll('[id*="cart-icon-bubble"]').forEach(cartLink => {
      cartLink.setAttribute('role', 'button');
      cartLink.setAttribute('aria-haspopup', 'dialog');
      cartLink.addEventListener('click', event => {
        event.preventDefault();
        this.open(cartLink);
      });
      cartLink.addEventListener('keydown', event => {
        if (event.code.toUpperCase() === 'SPACE') {
          event.preventDefault();
          this.open(cartLink);
        }
      });
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);

    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener('transitionend', () => {
      const containerToTrapFocusOn = this.classList.contains('is-empty') ? this.querySelector('.drawer__inner-empty') : document.getElementById('CartDrawer');
      const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
      trapFocus(containerToTrapFocusOn, focusElement);
    }, { once: true });

    document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
    document.body.style.paddingRight = '';
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', event => {
      const expanded = event.currentTarget.closest('details').hasAttribute('open');
      event.currentTarget.setAttribute('aria-expanded', !expanded);
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    const drawerInner = this.querySelector('.drawer__inner');
    if (drawerInner && drawerInner.classList.contains('is-empty')) {
      drawerInner.classList.remove('is-empty');
    }

    this.productId = parsedState.id;
    this.getSectionsToRender().forEach(section => {
      const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
      if (sectionElement) {
        sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }
      if (section.id === 'cart-free-delivery' && document.querySelector('#product-page-free-delivery')) {
        document.querySelector('#product-page-free-delivery').innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }
    });

    setTimeout(() => {
      const overlay = this.querySelector('#CartDrawer-Overlay');
      if (overlay) {
        overlay.addEventListener('click', () => this.close());
      }
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      { id: 'cart-drawer', selector: '#CartDrawer' },
      { id: 'cart-icon-bubble' },
      { id: 'cart-icon-bubble--mobile' },
      { id: 'cart-free-delivery' }
    ];
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      { id: 'CartDrawer', section: 'cart-drawer', selector: '.drawer__inner' },
      { id: 'cart-icon-bubble', section: 'cart-icon-bubble', selector: '.shopify-section' },
      { id: 'cart-icon-bubble--mobile', section: 'cart-icon-bubble--mobile', selector: '.shopify-section' }
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
