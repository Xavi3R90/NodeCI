const Page = require('./helpers/page');

let page;

beforeEach( async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach( async () => {
    await page.close();
});




describe('Cuando estamos logeados', async () => {

    beforeEach( async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('Podemos ver el formulario de creacion', async () => {
    
        const label = await page.getContentsOf('form label');
    
        expect( label ).toEqual('Blog Title');
    
    });

    describe('Usando inputs validos', async () => {

        beforeEach( async () => {
            await page.type('.title input', 'Mi titulo');
            await page.type('.content input', 'Mi contenido');

            await page.click('form button');
        });

        test('Lleva a la pantalla de confirmacion', async () => {
            const text = await page.getContentsOf('h5');

            expect( text ).toEqual('Please confirm your entries');
        });

        test('Al confirmar agrega el blog a la pantalla principal', async () => {

            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            expect( title ).toEqual('Mi titulo');
            expect( content ).toEqual('Mi contenido');

        });

    });

    describe('Usando inputs invalidos', async () => {

        beforeEach( async () => {
            await page.click('form button');
        });

        test('El test form muestra mensaje de error', async () => {

            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');

        });

    });

});

describe('Cuando Usuario NO esta logeado', async() => {

    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'T',
                content: 'C'
            }
        }
    ];

    test('Acciones relacionadas con el Blog estan prohibidas', async () => {

        const results = await page.execRequests( actions );

        for( let result of results ){

            expect( result ).toEqual({ error: 'You must log in!' });

        }

    });



    // test('Usuario NO puede crear un blog post', async () => {

    //     const result = await page.post('/api/blogs', { title: 'T', content:'C' });

    //     expect( result ).toEqual({ error: 'You must log in!'});

    // });

    // test('Usuario no puede obtener un listado de blogs', async () => {

    //     const result = await page.get('/api/blogs');

    //     expect( result ).toEqual({ error: 'You must log in!'});

    // });

});

