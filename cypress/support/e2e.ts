// Import commands.ts using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in console
const app = window.top;
if (app && app.document && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Prevent TypeScript from showing type errors in Cypress command chain
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here if needed
      // login(email: string, password: string): Chainable<void>
    }
  }
}

export {}; 