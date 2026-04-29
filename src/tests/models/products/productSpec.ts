import { PoolClient } from 'pg';
import postgres from '../../../models/database.js';
import { Product,getProducts, createProduct, updateProduct, deleteProduct, showProduct, getProductsByCategory, getTop5MostPopularProducts} from '../../../models/product/product.js';

const createTestProductsList = async () =>{
    const newProduct1: Product={
            name:"p1",
            price:10,
            category:"cat1"
    }
    const newProduct2: Product={
            name:"p2",
            price:20,
            category:"cat2"
    }
    const newProduct3: Product={
            name:"p3",
            price:30,
            category:"cat3"
    }
    const newProduct4: Product={
            name:"p4",
            price:40,
            category:"cat1"
    }

    await createProduct(newProduct1);
    await createProduct(newProduct2);
    await createProduct(newProduct3);
    await createProduct(newProduct4);
}

describe('Product model', () => {

    let client:PoolClient;
    beforeAll(async () => {
    client = await postgres.connect();
    await client.query(`
        TRUNCATE TABLE products RESTART IDENTITY CASCADE;
    `);
    });

    afterAll(async () => {

    await client.query(`
        TRUNCATE TABLE products RESTART IDENTITY CASCADE;
    `);
    client.release();
    });

    it('CREATE product',async () => {
        const newProd = {
            name:"TestProd",
            price:15.66,
            category:"TestCat"
        }
        const checkCreation: Product = await createProduct(newProd);
        
        expect(checkCreation).toBeDefined();
        expect(checkCreation.name).toBe("TestProd");
        expect(checkCreation.price).toBe(15.66);
        expect(checkCreation.category).toBe('TestCat');
    });

    it('Read products',async () => {
        //Creating list of products
        await createTestProductsList();

        const checkRead: Product[] = await getProducts();
        expect(checkRead).toBeInstanceOf(Array);

        expect(checkRead[1]?.name).toBe('p1');
        expect(checkRead[1]?.price).toBe(10);
        expect(checkRead[1]?.category).toBe('cat1');
    });

    it('Read a product by id', async ()=>{
        await createTestProductsList();

        const checkRead = await showProduct(3);

        expect(checkRead.id).toBe(3);
        expect(checkRead.name).toBe('p2');
        expect(checkRead.price).toEqual(20);
        expect(checkRead.category).toBe('cat2');
    }); 

    it('Read products by category', async ()=>{
        await createTestProductsList();

        const checkRead = await getProductsByCategory('cat1');

        expect(checkRead[0]?.category).toBe('cat1');
        expect(checkRead[1]?.category).toBe('cat1');
    }); 

    it('Read top 5 products', async ()=>{
        await createTestProductsList();

        const checkRead = await getTop5MostPopularProducts();

        expect(checkRead).toBeInstanceOf(Array);
        expect(checkRead.length).toBeLessThanOrEqual(5);
    }); 

    it('Update a product by id', async ()=>{
        await createTestProductsList();

        const updatedProduct: Product = {
            id:1,
            name:"UpdatedProduct",
            price:99.99,
            category:"UpdatedCat"
        }
        const checkRead = await updateProduct(updatedProduct);

        expect(checkRead.id).toBe(1);
        expect(checkRead.name).toBe('UpdatedProduct');
        expect(checkRead.price).toEqual(99.99);
        expect(checkRead.category).toBe('UpdatedCat');
    }); 

    
    it('Delete a product by id', async ()=>{
        await createTestProductsList();
        const checkRead = await deleteProduct(3);

        expect(checkRead.id).toBe(3);
        expect(checkRead.name).toBe('p2');
        expect(checkRead.price).toEqual(20);
        expect(checkRead.category).toBe('cat2');
    }); 
});
