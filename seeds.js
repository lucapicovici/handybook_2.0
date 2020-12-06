var mongoose = require("mongoose"),
    Promise  = require("bluebird"),
    bcrypt   = require("bcrypt-nodejs");

var Category = require("./models/category.js"),
    County   = require("./models/county.js"),
    User     = require("./models/user.js"),
    Service  = require("./models/service.js");


var categoryData = [
    "cars",
    "mechanics",
    "miscellaneous",
    "electricians"
];

var countyData = [
    "Bucureşti",
    "Alba",
    "Arad",
    "Arges",
    "Bacău",
    "Bihor",
    "Bistriţa-Năsăud",
    "Botoşani",
    "Braşov",
    "Brăila",
    "Buzău",
    "Caraş-Severin",
    "Călăraşi",
    "Cluj",
    "Constanţa",
    "Covasna",
    "Dâmboviţa",
    "Dolj",
    "Galaţi",
    "Giurgiu",
    "Gorj",
    "Harghita",
    "Hunedoara",
    "Ialomiţa",
    "Iaşi",
    "Ilfov",
    "Maramureş",
    "Mehedinţi",
    "Mureş",
    "Neamţ",
    "Olt",
    "Prahova",
    "Satu Mare",
    "Sălaj",
    "Sibiu",
    "Suceava",
    "Teleorman",
    "Timiş",
    "Tulcea",
    "Vâlcea",
    "Vaslui",
    "Vrancea"
];

var userData = [
    {
        email: "VanDamme@gmail.com",
        password: "password",
        rating: 5,
        username: "Jean VM",
        name: "Jean Claude Van Damme",
        phone: "+440775595535",
        profession: "Martial Arts",
        skills: "Taikwando",
        photo: "https://scontent.fclj3-1.fna.fbcdn.net/v/t1.0-9/35629048_10160602612435046_4362811346731925504_n.jpg?_nc_cat=1&ccb=2&_nc_sid=09cbfe&_nc_ohc=-pvo6CRC4rIAX9mRmWv&_nc_ht=scontent.fclj3-1.fna&oh=567883dafa27f565a502f32319f04dc2&oe=5FF1CEA1"
    },
    {
        email: "john@gmail.com",
        password: "password",
        rating: 4.7,
        username: "John",
        name: "John Kennedy",
        phone: "+440775595535",
        profession: "Electrician",
        skills: "Electrician",
        photo: "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
    }
];

var servicesData = [
    {
        author: {
            id: "",
            name: "Van Damme"
        },
        title: "Leg Split",
        about: "I will teach you the art of leg splits. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis lobortis diam a cursus. Etiam ac nibh sem. Nunc at diam posuere, vehicula justo at, sodales sem. Donec lacinia tellus in odio euismod dapibus. Donec ut ultrices tellus. Vestibulum eu ex libero. Etiam magna dui, imperdiet vel quam quis, sollicitudin dictum dolor. Sed rhoncus nec odio eget vehicula. Quisque commodo mi ex, nec condimentum neque pellentesque ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque nec fermentum enim. Aliquam eu nisi feugiat, consectetur lorem sollicitudin, ultricies ipsum. Sed hendrerit purus augue, eu accumsan lorem rutrum in. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean at fermentum magna, sit amet finibus erat.",
        hourlyRate: "47",
        rating: 5,
        comments: [],
        photos: [
            {src: "https://media.npr.org/assets/img/2013/11/16/split162way-7d52e7a4d01dabf8125780baf381e0d340a74d6c-s1200.jpg"}
        ],
        category: "miscellaneous",
        county: "Cluj"
    },
    {
        author: {
            id: "",
            name: "Van Damme"
        },
        title: "Classic Car Restoration",
        about: "Classic Car Restoration. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis lobortis diam a cursus. Etiam ac nibh sem. Nunc at diam posuere, vehicula justo at, sodales sem. Donec lacinia tellus in odio euismod dapibus. Donec ut ultrices tellus. Vestibulum eu ex libero. Etiam magna dui, imperdiet vel quam quis, sollicitudin dictum dolor. Sed rhoncus nec odio eget vehicula. Quisque commodo mi ex, nec condimentum neque pellentesque ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque nec fermentum enim. Aliquam eu nisi feugiat, consectetur lorem sollicitudin, ultricies ipsum. Sed hendrerit purus augue, eu accumsan lorem rutrum in. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean at fermentum magna, sit amet finibus erat.",
        hourlyRate: "99",
        rating: 5,
        comments: [],
        photos: [
            {src: "https://images.unsplash.com/photo-1577801343081-0053b24f62c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"}
        ],
        category: "mechanics",
        county: "Cluj"
    },
    {
        author: {
            id: "",
            name: "John K."
        },
        title: "Engine diagnosis",
        about: "I will diagnose any issues with your car engine. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis lobortis diam a cursus. Etiam ac nibh sem. Nunc at diam posuere, vehicula justo at, sodales sem. Donec lacinia tellus in odio euismod dapibus. Donec ut ultrices tellus. Vestibulum eu ex libero. Etiam magna dui, imperdiet vel quam quis, sollicitudin dictum dolor. Sed rhoncus nec odio eget vehicula. Quisque commodo mi ex, nec condimentum neque pellentesque ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque nec fermentum enim. Aliquam eu nisi feugiat, consectetur lorem sollicitudin, ultricies ipsum. Sed hendrerit purus augue, eu accumsan lorem rutrum in. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean at fermentum magna, sit amet finibus erat.",
        hourlyRate: "19",
        rating: 4.9,
        comments: [],
        photos: [
            {src: "https://images.unsplash.com/photo-1583955275036-fd20a9c185bd?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDR8fG1lY2hhbmljcyUyMHNob3B8ZW58MHx8MHw%3D&auto=format&fit=crop&w=500&q=60"}
        ],
        category: "mechanics",
        county: "Timiş"
    },
    {
        author: {
            id: "",
            name: "John K."
        },
        title: "Oil change",
        about: "Oil change. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis lobortis diam a cursus. Etiam ac nibh sem. Nunc at diam posuere, vehicula justo at, sodales sem. Donec lacinia tellus in odio euismod dapibus. Donec ut ultrices tellus. Vestibulum eu ex libero. Etiam magna dui, imperdiet vel quam quis, sollicitudin dictum dolor. Sed rhoncus nec odio eget vehicula. Quisque commodo mi ex, nec condimentum neque pellentesque ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque nec fermentum enim. Aliquam eu nisi feugiat, consectetur lorem sollicitudin, ultricies ipsum. Sed hendrerit purus augue, eu accumsan lorem rutrum in. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean at fermentum magna, sit amet finibus erat.",
        hourlyRate: "10",
        rating: 5,
        comments: [],
        photos: [
            {src: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8bWVjaGFuaWN8ZW58MHx8MHw%3D&auto=format&fit=crop&w=500&q=60"}
        ],
        category: "mechanics",
        county: "Timiş"
    }
];


module.exports = async function seedDB() {
    try {
        await Promise.map(userData, async function(userItem){
            let hashedPassword = await bcrypt.hashSync(userItem.password, bcrypt.genSaltSync(5), null);
            userItem.password = hashedPassword;
            console.log(`updated password is ${userItem.password}`);
        });

        await Category.deleteMany({});
        console.log("Removed all categories from database.");

        await County.deleteMany({});
        console.log("Removed all counties from database");
       
        await Promise.map(categoryData, async function(categoryItem){
            let categ = await Category.create({category: categoryItem});
            console.log(`CREATED ${categ}`);
        }, {concurrency: 5});

        await Promise.map(countyData, async function(countyItem){
            let cnty = await County.create({county: countyItem})
            console.log(`CREATED ${cnty}`);
        }, {concurrency: 5});

        await Promise.map(userData, async function(userItem){
            let user = await User.create(userItem);
            console.log(`CREATED ${user}`);
        });

        // Service #1
        let obj = servicesData[0];
        let user = await User.findOne({email: "VanDamme@gmail.com"});
        let category = await Category.findOne({category: obj.category});
        let county = await County.findOne({county: obj.county});
        obj.author.id = user._id;
        obj.category = category._id;
        obj.county = county._id;
        let service = await Service.create(obj);
        console.log(`CREATED ${service}`);

        // Service #2
        obj = servicesData[1];
        user = await User.findOne({email: "VanDamme@gmail.com"});
        category = await Category.findOne({category: obj.category});
        county = await County.findOne({county: obj.county});
        obj.author.id = user._id;
        obj.category = category._id;
        obj.county = county._id;
        service = await Service.create(obj);
        console.log(`CREATED ${service}`);

        // Service #3
        obj = servicesData[2];
        user = await User.findOne({email: "john@gmail.com"});
        category = await Category.findOne({category: obj.category});
        county = await County.findOne({county: obj.county});
        obj.author.id = user._id;
        obj.category = category._id;
        obj.county = county._id;
        service = await Service.create(obj);
        console.log(`CREATED ${service}`);

        // Service #4
        obj = servicesData[3];
        user = await User.findOne({email: "john@gmail.com"});
        category = await Category.findOne({category: obj.category});
        county = await County.findOne({county: obj.county});
        obj.author.id = user._id;
        obj.category = category._id;
        obj.county = county._id;
        service = await Service.create(obj);
        console.log(`CREATED ${service}`);

    } catch(err) {
        console.log(err);
    }  
}





// Category.deleteMany({}, function(err){
    //     if (err) console.log(err);
    //     else {
    //         console.log("Removed all categories from database.");

    //         categoryData.forEach(function(categoryItem){
    //             Category.create({category: categoryItem}, function(err, cat){
    //                 if (err) console.log(err);
    //                 else {
    //                     console.log(`CREATED ${cat}`);
    //                 }
    //             })
    //         });
    //     }
    // });

    // County.deleteMany({}, function(err){
    //     if (err) console.log(err);
    //     else {
    //         console.log("Removed all counties from database");

    //         countyData.forEach(function(countyItem){
    //             County.create({county: countyItem}, function(err, cnty){
    //                 if (err) console.log(err);
    //                 else {
    //                     console.log(`CREATED ${cnty}`);
    //                 }
    //             })
    //         });
    //     }
    // })
