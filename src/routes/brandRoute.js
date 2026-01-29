
var {
    getBrandAll,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
}= require("../controllers/brandController");

const Brand = (app)=>{
    app.get("/api/brands", getBrandAll);
    app.get("/api/brands/:id", getBrandById);
    app.post("/api/brands",createBrand);
    app.put("/api/brands/:id",updateBrand);
    app.delete("/api/brands/:id",deleteBrand);
}

module.exports = Brand;