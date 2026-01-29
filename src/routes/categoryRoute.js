
var{
    getCategory ,
    getOne,
    createCategory,
    updateCategory,
    deleteCategory,


} = require("../controllers/categoryController");

const category = (app)=>{
    app.get("/api/category",getCategory);
    app.get("/api/category/:id",getOne);
    app.post("/api/category",createCategory);
    app.put("/api/category/:id", updateCategory);
    app.delete("/api/category/:id", deleteCategory);
}
module.exports = category;