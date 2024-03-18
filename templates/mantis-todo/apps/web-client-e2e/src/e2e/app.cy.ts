import { getTitle } from '../support/app.po';

describe('web-client-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getTitle().contains(/Todos/);
  });
});
