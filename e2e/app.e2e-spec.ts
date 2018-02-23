import { ClickinnPage } from './app.po';

describe('clickinn App', () => {
  let page: ClickinnPage;

  beforeEach(() => {
    page = new ClickinnPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
