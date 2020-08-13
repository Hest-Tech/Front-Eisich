const express = require('express');
const sequelize = require('sequelize');
const db = require('../database/models');

const router = express.Router();

router.get('/mainCategories', async (req, res) => {
    try {
        const mainCategories = await db.MainCategory.findAll({
            attributes: ['name', 'sku', 'path', 'imgId']
        });

        return res.json({ data: mainCategories });
    } catch (e) {
        console.log(e);
    }
});

router.get("/subCategories/:name", async (req, res) => {
    try {
        const displayCategories = [];
        const mainCategoryId = await db.MainCategory.findOne({
            attributes: ['id'],
            where: {
                name: req.params.name
            }
        })
        const subCategories = await db.SubCategory.findAll({
            attributes: ['id', 'name', 'sku', 'path'],
            where: {
                mainCategoryId: mainCategoryId.id
            }
        });
        const innerCategoryList = await db.InnerSubCategory.findAll({
            attributes: ['subCategoryId', 'name', 'path', 'sku']
        });
        const subCategoryStr = JSON.stringify(subCategories);
        const parseSubCategory = JSON.parse(subCategoryStr);
        const innerCategoryStr = JSON.stringify(innerCategoryList);
        const parseInnerCategory = JSON.parse(innerCategoryStr);

        parseSubCategory.map(subCategory => {
            let subCategoryId = subCategory.id;

            const filteredList = parseInnerCategory.filter(
                innerCategory => innerCategory.subCategoryId === subCategoryId
            );
            filteredList.map(i => delete i.subCategoryId)

            const subCategoryMatch = {
                name: subCategory.name,
                path: subCategory.path,
                sku: subCategory.sku,
                innerCategory: filteredList
            }

            displayCategories.push(subCategoryMatch);
        });

        return res.json({ data: displayCategories });
    } catch (e) {
        console.log(e);
    }
});

// fetch categories' products
router.get('/:name/:mainSku/:subSku/:innerSku', async (req, res) => {
    try {
        const mainSku = req.params.mainSku || "";
        const subSku = req.params.subSku || "";
        const innerSku = req.params.innerSku || "";
        const breadCrumbs = [];
        let mainCategory;
        let subCategory;
        let innerCategory;

        switch(req.params.name) {
            case 'MAIN_CATEGORY':
                mainCategory = await db.MainCategory.findOne({
                    attributes: [ 'name', 'sku', 'path', 'title' ],
                    where: { sku: mainSku }
                });                
                !!mainCategory && breadCrumbs.push(mainCategory);
                break;
            case 'SUB_CATEGORY':
                mainCategory = await db.MainCategory.findOne({
                    attributes: [ 'name', 'sku', 'path', 'title' ],
                    where: { sku: mainSku }
                });
                subCategory = await db.SubCategory.findOne({
                    attributes: [ 'name', 'sku', 'path', 'title' ],
                    where: { sku: subSku }
                });

                !!mainCategory && breadCrumbs.push(mainCategory);
                !!subCategory && breadCrumbs.push(subCategory);
                break;
            case 'INNER_CATEGORY':
                mainCategory = await db.MainCategory.findOne({
                    attributes: [ 'name', 'sku', 'path', 'title' ],
                    where: { sku: mainSku }
                });
                subCategory = await db.SubCategory.findOne({
                    attributes: [ 'name', 'sku', 'path', 'title' ],
                    where: { sku: subSku }
                });
                innerCategory = await db.InnerSubCategory.findOne({
                    attributes: [ 'name', 'sku', 'path', 'title' ],
                    where: { sku: innerSku }
                });

                !!mainCategory && breadCrumbs.push(mainCategory);
                !!subCategory && breadCrumbs.push(subCategory);
                !!innerCategory && breadCrumbs.push(innerCategory);
                break;
        }
        
        return res.json({
            data: breadCrumbs            
        });
    } catch(e) {
        console.log(e);
    }
})

// fetch a product
router.get('/product/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await db.Product.findOne({
            attributes: [
                'imgId',
                'description',
                'path',
                'mainCategory',
                'subCategory',
                'oldPrice',
                'newPrice',
                'pieces',
                'title',
                'features',
                'saving',
                'seller',
                'innerCategory',
                'pid',
                'details',
                'sellerId'
            ],
            where: { pid }
        });

        return res.json({ data: product });
    } catch (e) {
        console.log(e);
    }
});

// fetch category breadcrumbs
router.get('/breadCrumbs/:name/:sku', async (req, res) => {
    const sku = req.params.sku;
    const name = req.params.name;
    const breadCrumbs = [];

    switch (name) {
        case 'MAIN_CATEGORY':
            try {
                const mainCategory = await db.MainCategory.findOne({
                    attributes: [ 'id' ],
                    where: { sku },
                    raw: true
                })

                const subCategory = await db.SubCategory.findOne({
                    attributes: ['name', 'sku', 'path', 'title'],
                    where: {
                        mainCategoryId: mainCategory.id
                    }
                });

                !!subCategory && breadCrumbs.push(subCategory);

            } catch(e) {
                console.log(e);
            }
            break;
        case 'SUB_CATEGORY':
            try {
                const subCategory = await db.SubCategory.findOne({
                    attributes: ['name', 'sku', 'path', 'title', 'mainCategoryId'],
                    where: { sku },
                    raw: true
                });

                const mainCategory = await db.MainCategory.findOne({
                    attributes: ['name', 'sku', 'path', 'title'],
                    where: {
                        id: subCategory.mainCategoryId
                    }
                })

                !!mainCategory && breadCrumbs.push(mainCategory);
                !!subCategory && breadCrumbs.push(subCategory);

            } catch(e) {
                console.log(e);
            }
            break;
        case 'INNER_CATEGORY':
            try {
                const innerCategory = await db.InnerSubCategory.findOne({
                    attributes: ['name', 'sku', 'path', 'title', 'subCategoryId'],
                    where: { sku },
                    raw: true
                });

                const subCategory = await db.SubCategory.findOne({
                    attributes: ['name', 'sku', 'path', 'title', 'mainCategoryId'],
                    where: {
                        id: innerCategory.subCategoryId
                    },
                    raw: true
                });
                console.log(subCategory);
                console.log('mainCategoryId: ',subCategory.mainCategoryId);
                console.log('name: ',subCategory.name);

                const mainCategory = await db.MainCategory.findOne({
                    attributes: ['name', 'sku', 'path', 'title'],
                    where: {
                        id: subCategory.mainCategoryId
                    }
                });

                !!mainCategory && breadCrumbs.push(mainCategory);
                !!subCategory && breadCrumbs.push(subCategory);
                !!innerCategory && breadCrumbs.push(innerCategory);

            } catch(e) {
                console.log(e);
            }
            break;
    }

    return res.json({ data: breadCrumbs });
})

// fetch related categories
router.get('/:name/:sku', async (req, res) => {
    const sku = req.params.sku;
    const name = req.params.name;
    let category;
    let displayCategory;

    switch (name) {
        case 'MAIN_CATEGORY':
            try {
                const mCategory = await db.MainCategory.findOne({
                    attributes: [ 'id' ],
                    where: { sku },
                    raw: true
                })

                console.log('mcategory: ',mCategory)

                const displaymCategory = await db.SubCategory.findAll({
                    attributes: ['name', 'sku', 'path', 'sort', 'filters'],
                    where: {
                        mainCategoryId: mCategory.id
                    }
                });

                return res.json({ data: displaymCategory });
            } catch(e) {
                console.log(e);
            }
            break;
        case 'SUB_CATEGORY':
            try {
                const sCategory = await db.SubCategory.findOne({
                    attributes: [ 'id' ],
                    where: { sku },
                    raw: true
                });
                console.log(name);
                console.log('sCategory: ', sCategory)

                const displaysCategory = await db.InnerSubCategory.findAll({
                    attributes: ['name', 'sku', 'path', 'sort', 'filters'],
                    where: {
                        subCategoryId: !!sCategory && sCategory.id
                    },
                    raw: true
                });
                console.log('displaysCategory: ', displaysCategory)

                return res.json({ data: displaysCategory });
            } catch(e) {
                console.log(e);
            }
            break;
        case 'INNER_CATEGORY':
            try {
                const iCategory = await db.InnerSubCategory.findOne({
                    attributes: [ 'subCategoryId' ],
                    where: { sku },
                    raw: true
                });
                console.log(name);
                console.log(sku);
                console.log('iCategory: ', iCategory)

                const displayiCategory = await db.InnerSubCategory.findAll({
                    attributes: ['name', 'sku', 'path', 'sort', 'filters'],
                    where: {
                        subCategoryId: iCategory.subCategoryId
                    }
                });

                return res.json({ data: displayiCategory });
            } catch(e) {
                console.log(e);
            }
            break;
    }
})

// fetch current category
router.get('/category/:name/:sku', async (req, res) => {
    const sku = req.params.sku;
    const name = req.params.name;
    console.log('sku: ',sku)
    console.log('name: ',name)

    switch (name) {
        case 'MAIN_CATEGORY':
            try {
                const mCategory = await db.MainCategory.findOne({
                    attributes: ['name', 'sku', 'path', 'sort', 'filters'],
                    where: { sku },
                    raw: true
                });

                return res.json({ data: mCategory });
            } catch(e) {
                console.log(e);
            }
            break;
        case 'SUB_CATEGORY':
            try {
                const sCategory = await db.SubCategory.findOne({
                    attributes: ['name', 'sku', 'path', 'sort', 'filters'],
                    where: { sku },
                    raw: true
                });
                console.log('OVER HERE: ',sCategory)

                return res.json({ data: sCategory });
            } catch(e) {
                console.log(e);
            }
            break;
        case 'INNER_CATEGORY':
            try {
                const iCategory = await db.InnerSubCategory.findOne({
                    attributes: ['name', 'sku', 'path', 'sort', 'filters'],
                    where: { sku },
                    raw: true
                });

                return res.json({ data: iCategory });
            } catch(e) {
                console.log(e);
            }
            break;
    }
});

// router.get('/:name', async (req, res) => {
//     try {
//         const products = await db.sequelize.query(`
//           SELECT *
//           FROM "MainCategories"
//           WHERE _search @@ plainto_tsquery('english', :query);
//         `, {
//           // model: 'MainCategory',
//           replacements: { query: `/${req.params.name}/` },
//           type: db.sequelize.QueryTypes.SELECT
//         });

//         return res.json({ data: products });
//     } catch (e) {
//         console.log(e);
//     }
// });


module.exports = router;