var casual = require('casual');
const fs = require('fs');

const randomCategoryList = (n) => {
    if (n <= 0) return [];

    const categoryList = [];

    // loop and push category
    Array.from(new Array(n)).forEach(() => {
        const category = {
            id: casual.uuid,
            name: casual.card_type,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        categoryList.push(category);
    });

    return categoryList;
};

const randomProductList = (categoryList, numberOfProducts) => {
    if (numberOfProducts <= 0) return [];

    const productList = [];

    // random data
    for (const category of categoryList) {
        Array.from(new Array(numberOfProducts)).forEach(() => {
            const product = {
                categoryId: category.id,
                id: casual.uuid,
                name: casual.title,
                color: casual.color_name,
                price: Number.parseFloat(casual.random),
                description: casual.catch_phrase,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                thumbnailUrl: casual.url,
            };

            productList.push(product);
        });
    }

    return productList;
};

// IFFE
(() => {
    // random data
    const categoryList = randomCategoryList(4);
    const productList = randomProductList(categoryList, 5);

    // prepare db object
    const db = {
        categories: categoryList,
        products: productList,
        profile: {
            name: 'Po',
        },
    };

    // write db object to db.json
    fs.writeFile('./database_mocking/db.json', JSON.stringify(db), () => {
        console.log('Generate data successfully =))');
    });
})();
