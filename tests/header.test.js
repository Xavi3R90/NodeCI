
const Page = require('./helpers/page');

let page;

beforeEach( async () => {
    
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach( async () => {
    await page.close();
});

test('el header tiene el texto correcto', async () => {

    const text = await page.$eval('a.brand-logo', el => el.innerHTML );

    expect(text).toEqual('Blogster');

});

test('hacer click en el login oauth flow', async () => {

    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);

});

test('Cuando ingresamos, nos muestra el logout', async() => {

    await page.login();

    const text = await page.getContentsOf('a[href="/auth/logout"]');

    expect( text ).toEqual('Logout');

});
