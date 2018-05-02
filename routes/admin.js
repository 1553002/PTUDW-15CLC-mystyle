var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');
var breadcrumbs = require('express-breadcrumbs');
var productsController = require('../controllers/productsController');
var categoriesController = require('../controllers/categoriesController');
var customerController = require('../controllers/customersController');
var suppliersController = require('../controllers/suppliersController');
var modelImageUploadController = require('../controllers/modelImageUploadController');

var crypto = require("crypto");

router.use(breadcrumbs.init());
// Set Breadcrumbs home information 
router.use(breadcrumbs.setHome({
    name: 'Home',
    url: '/admin'
}));

router.all('/*', function (req, res, next) {
    //Kiem tra da dang nhap hay chua
    //var isLogin = req.session.passport.user;

    req.app.locals.layout = 'admin_layout'; // set your layout here
    next(); // pass control to the next handler
});

router.get('/', (req, res)=>{
    res.render('admin', {layout:'admin_layout'});
})

router.get('/dangnhap', (req, res)=>{
    res.render("dangnhap", {layout: false});
});

router.get('/dangki', (req, res)=>{
    res.render("dangki", {layout: false});
});

router.get('/sanpham', (req, res)=>{
    //Lay toan bo san pham hien co
    productsController.getAll(function(products){
        
        // var page = parseInt(req.query.page);
        // if(isNaN(page)){
        //     page = 1;
        // }

        // var limit = 12;
        // var pagination = {
        //     limit: limit,
        //     page: page,
        //     totalRows: products.length
        // }

        // var offset = (page - 1) * limit;
        // products = products.slice(offset, offset + limit);

        req.breadcrumbs('Tất cả sản phẩm', '/admin/sanpham');
        res.render('sanpham', { 
            breadcrumbs: req.breadcrumbs(), 
            products : products,
            title: 'Tất cả sản phẩm'
        });
    });
})

router.get('/danhmucsanpham', (req, res)=>{
    //Lay toan bo san pham hien co
    categoriesController.getAll(function(categories){
        req.breadcrumbs('Tất cả danh mục', '/admin/danhmucsanpham');
        res.render('danhmucsanpham', { 
            breadcrumbs: req.breadcrumbs(), 
            categories : categories,
            title: 'Tất cả danh mục'
        });
    });
})


router.get('/taikhoankhachhang', (req, res)=>{
    //Lay toan bo san pham hien co
    customerController.getAll(function(customers){
        req.breadcrumbs('Tài khoản khách hàng', '/admin/taikhoankhachhang');
        res.render('taikhoankhachhang', { 
            breadcrumbs: req.breadcrumbs(), 
            customers : customers,
            title: 'Tài khoản khách hàng'
        });
    });
})


//1553002
//Note: Nho gọi hàm lồng nhau, bởi nó dùng callback nên ko thể gọi hàm này xong mới tới hàm kia
router.get('/sanpham/them', (req, res)=>{
    req.breadcrumbs('Tất cả sản phẩm', '/admin/sanpham');

    //Lay toan bo danh muc san pham
    categoriesController.getAll((categories)=>{
  
        //Lay toan bo danh sach nha cung cap
        suppliersController.getAll((suppliers)=>{

            modelImageUploadController.getAll((models)=>{
                    //Cua ham sua => phai goi them ham lay thong tin cua san pham XXX
               
                //console.log(models);
                res.render('them-san-pham', { 
                    breadcrumbs: req.breadcrumbs(),
                    title: 'Chi tiết sản phẩm',
                    categories: categories,
                    suppliers : suppliers,
                    modelImages : models,
                    
                });
            })
           
        })
    });
});

//them router.get -> sanpham/sua
//nhưng 
router.get('/sanpham/sua/:id', (req, res)=>{
    req.breadcrumbs('Tất cả sản phẩm', '/admin/sanpham');

    //Lay toan bo danh muc san pham
    categoriesController.getAll((categories)=>{
  
        //Lay toan bo danh sach nha cung cap
        suppliersController.getAll((suppliers)=>{

            modelImageUploadController.getAll((models)=>{
                    //Cua ham sua => phai goi them ham lay thong tin cua san pham XXX
                //console.log(req.params.id);
                productsController.getProductDetailById(req.params.id, function(productDetail){
                    
                    console.log(req.params.id);

                    res.render('them-san-pham', { 
                        breadcrumbs: req.breadcrumbs(),
                        title: 'Chi tiết sản phẩm',
                        categories: categories,
                        suppliers : suppliers,
                        modelImages : models,
                        productDetail: productDetail,
                        productId : req.params.id,
                        sua:'/sua'
                    });
                });
            })
           
        })
    });
});

router.post('/sanpham/sua', (req, res)=>{
    var product_name = req.body['product_description[1][name]'];
    var product_category = req.body['product_description[1][category]'];
    var product_supplier = req.body["product_description[1][supplier]"];
    var product_price = req.body["product_description[1][price]"];
    var product_sizeS = req.body['product_attribute[0][product_attribute_description][1][s]'];
    var product_sizeL = req.body['product_attribute[0][product_attribute_description][1][l]'];
    var product_sizeM = req.body['product_attribute[0][product_attribute_description][1][m]'];
    var product_sizeXL = req.body['product_attribute[0][product_attribute_description][1][xl]'];
    var image1 = req.body['product_image[1][image]'];
    var image2 = req.body['product_image[2][image]'];
    var image3 = req.body['product_image[3][image]'];
    var image4 = req.body['product_image[4][image]'];
    var discount_status = req.body['product_discount[0][status]'];
    var discount_percent = req.body['product_discount[0][percent]'];
    var discount_exp = req.body['product_discount[0][date]'];
    var id = req.body['product-id'];
        //Note: chưa xử lý TH người dùng ko nhập discount_percent
    function calDiscountPrice (gia_goc, muc_giam_gia){
        //Xoa bo toan bo dau ','
        gia_goc = gia_goc.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        gia_goc = parseInt(gia_goc);
        muc_giam_gia = parseInt(muc_giam_gia);
        return (gia_goc*muc_giam_gia)/100;
    }

    var discountPrice = calDiscountPrice(product_price, discount_percent);

    var Product = {
        name:product_name, 
        CategoryId : product_category, 
        SupplierId: product_supplier, 
        price : product_price, 
        s:product_sizeS, 
        l:product_sizeL,
        m:product_sizeM, 
        xl:product_sizeXL, 
        image1:image1, 
        image2:image2, 
        image3:image3, 
        image4:image4, 
        discountPrice: discountPrice,
        discountAvailable:discount_status, 
        discount:discount_percent, 
        salloffExpDate:discount_exp,
        unit:'cái',
        available:'true'};
    
    console.log(id);

    productsController.update(id, Product, function(product){
        if (product)
        {
            console.log("Update thanh cong");
        }
        else{
            console.log("Update failed");
        }
        res.redirect("/admin/sanpham");
    });
});

router.post('/', (req, res)=>{
    
    //console.log(req.body.nameFile);
    if (req.files){
        var file = req.files.myFile,
        //id = crypto.randomBytes(20).toString('hex'),
        //filename = "mystyle-model-"+id+'.png';
        filename = req.body.nameFile;
       // console.log(file);
        
        file.mv("./public/upload/"+filename, function(err){
            if (err){
              res.send("error occured");
            }
            else{
                modelImageUploadController.create(filename,function(imageloads){
                    console.log("modelImageUploadController");
                    console.log('Image is uploaded');
                });
              res.end();
            }
        });
    }
});

//Them
router.post('/sanpham', function(req, res){
    //console.log(req.body);
    var product_name = req.body['product_description[1][name]'];
    var product_category = req.body['product_description[1][category]'];
    var product_supplier = req.body["product_description[1][supplier]"];
    var product_price = req.body["product_description[1][price]"];
    var product_sizeS = req.body['product_attribute[0][product_attribute_description][1][s]'];
    var product_sizeL = req.body['product_attribute[0][product_attribute_description][1][l]'];
    var product_sizeM = req.body['product_attribute[0][product_attribute_description][1][m]'];
    var product_sizeXL = req.body['product_attribute[0][product_attribute_description][1][xl]'];
    var image1 = req.body['product_image[1][image]'];
    var image2 = req.body['product_image[2][image]'];
    var image3 = req.body['product_image[3][image]'];
    var image4 = req.body['product_image[4][image]'];
    var discount_status = req.body['product_discount[0][status]'];
    var discount_percent = req.body['product_discount[0][percent]'];
    var discount_exp = req.body['product_discount[0][date]'];
    console.log(discount_exp);

    //Note: chưa xử lý TH người dùng ko nhập discount_percent
    function calDiscountPrice (gia_goc, muc_giam_gia){
        //Xoa bo toan bo dau ','
        gia_goc = gia_goc.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        gia_goc = parseInt(gia_goc);
        muc_giam_gia = parseInt(muc_giam_gia);
        return (gia_goc*muc_giam_gia)/100;
    }

    var discountPrice = calDiscountPrice(product_price, discount_percent);
    console.log(product_price);
    var Product = {
        name:product_name, 
        CategoryId : product_category, 
        SupplierId: product_supplier, 
        price : product_price, 
        s:product_sizeS, 
        l:product_sizeL,
        m:product_sizeM, 
        xl:product_sizeXL, 
        image1:image1, 
        image2:image2, 
        image3:image3, 
        image4:image4, 
        discountPrice: discountPrice,
        discountAvailable:discount_status, 
        discount:discount_percent, 
        salloffExpDate:discount_exp,
        unit:'cái',
        available:'true'};
    
    productsController.create(Product, function(callback){
        console.log(callback);
    });
    res.redirect('/admin/sanpham');
});


//1553025 - CRUD danh muc san pham
router.delete('/:id', function (req, res) {
    categoriesController.destroy(req.params.id, function (categories) {
        res.sendStatus(204);
        res.end();
    });

    productsController.destroy(req.params.id, function (products) {
        res.sendStatus(204);
        res.end();
    });
});

module.exports = router;