const express = require('express')
const app = express();

const { createClient } = require('redis')
const client = createClient()


const getAllProducts = async () => {
    const time = Math.random() * 5000;
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(['Produto1', 'Produto2', 'Produto3'])
        }, time);
    })
}

app.get('/saved', async (req, res) => {
    await client.del('getAllProducts')
    res.send({ ok: true })
})

app.get('/', async (req, res) => {
    const productsFromCache = await client.get('getAllProducts')
    if (productsFromCache) {
        return res.send(JSON.parse(productsFromCache))
    }
    const products = await getAllProducts()
    //await client.set("getAllProducts", JSON.stringify(products), {EX: 20})
    await client.set("getAllProducts", JSON.stringify(products))
    res.send(products)
});

const startup = async () => {
    await client.connect();
    app.listen(3000, () => {
        console.log('server is running...');
    })
}
startup();

/* https://youtu.be/wVHBQILmd_8?si=EeeMwgLmaKbtSB4w&t=552
    docker run --name redis-cache -p 6379:6379 -d redis
*/