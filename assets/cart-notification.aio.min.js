/**
 * Class representing a cart notification, extending a modal dialog functionality.
 */
class CartNotification extends ModalDialog {
  constructor() {
    super();
    // Cache elements to reduce repetitive DOM queries.
    this.notification = document.getElementById('cart-notification');
    this.productPageFreeDelivery = document.querySelector('#product-page-free-delivery');
    // Binding 'this' to ensure the correct context in event handlers.
    this.onBodyClick = this.handleBodyClick.bind(this);
    // Initialize event listeners for close buttons.
    this.initializeCloseButtons();
  }
  
  /**
   * Initialize event listeners for all close buttons.
   */
  initializeCloseButtons() {
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
  }

  /**
   * Opens the cart notification and adds a click listener to the body.
   */
  open() {
    document.body.addEventListener('click', this.onBodyClick);
    this.show(null);
  }

  /**
   * Closes the cart notification and removes the click listener from the body.
   */
  close() {
    document.body.removeEventListener('click', this.onBodyClick);
    removeTrapFocus(this.activeElement);
    this.hide();
  }

  /**
   * Renders the contents of the cart notification.
   * @param {Object} parsedState - The state object of the cart.
   */
  renderContents(parsedState) {
    this.cartItemKey = parsedState.key;
    const fragment = document.createDocumentFragment();
    
    // Update elements based on the sections to render.
    this.getSectionsToRender().forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
        element.innerHTML = innerHTML;
        fragment.appendChild(element);
      }
    });

    // Special handling for product page free delivery section.
    if (this.productPageFreeDelivery) {
      const freeDeliveryHTML = this.getSectionInnerHTML(parsedState.sections['cart-free-delivery'], '.shopify-section');
      this.productPageFreeDelivery.innerHTML = freeDeliveryHTML;
      fragment.appendChild(this.productPageFreeDelivery);
    }

    // Append the fragment to the notification element.
    this.notification.appendChild(fragment);
    this.open();
  }

  /**
   * Returns the sections to render in the cart notification.
   * @return {Array} Array of sections to render.
   */
  getSectionsToRender() {
    return [
      // Define sections to be rendered with their respective selectors.
      { id: 'cart-notification-product', selector: `[id="cart-notification-product-${this.cartItemKey}"]` },
      { id: 'cart-notification-button' },
      { id: 'cart-icon-bubble' },
      { id: 'cart-icon-bubble--mobile' },
      { id: 'cart-free-delivery' }
    ];
  }

  /**
   * Returns the inner HTML for a given section.
   * @param {string} html - The HTML string.
   * @param {string} [selector='.shopify-section'] - The selector to query within the HTML.
   * @return {string} The inner HTML of the selected element.
   */
  getSectionInnerHTML(html, selector = '.shopify-section') {
    // Parse the HTML string and return the inner HTML of the selected element.
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  /**
   * Handles body click to close the cart notification if the click is outside of it.
   * @param {Event} evt - The click event.
   */
  handleBodyClick(evt) {
    if (!this.notification.contains(evt.target) && !evt.target.closest('cart-notification')) {
      this.activeElement = evt.target.closest('details-disclosure')?.querySelector('summary') || null;
      this.close();
    }
  }

  /**
   * Sets the active element.
   * @param {HTMLElement} element - The element to set as active.
   */
  setActiveElement(element) {
    this.activeElement = element;
  }
}

// Define 'cart-notification' as a custom element.
customElements.define('cart-notification', CartNotification);
