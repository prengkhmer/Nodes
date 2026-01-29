const db = require("../models");
const Supplier = db.Supplier;
const getAllSupplier = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.status(200).json({
      message: "Suppliers retrieved successfully",
      suppliers,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error retrieving suppliers",
      error: e.message,
    });
  }
};
const getSupplierById = async(req ,res)=>{
    const {id}= req.params;
    try{
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }
        res.status(200).json({
            message:"Supplier found by ID",
            supplier,
        })
    }catch(e){
        res.status(500).json({
            message:'error supplier find',error:e.message,
        })
    }
}
const createSupplier = async (req, res) => {
  try {
    const { name, phone_first, phone_second, address } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        message: "Name is required"
      });
    }
    
    const newSupplier = await Supplier.create({
      name,
      phone_first,
      phone_second,
      address,
    });
    res.status(201).json({
        message:"create supplier success",
        newSupplier,
    });
  } catch (e) {
    res.status(500).json({
        message:"error supplier create",error:e.message,
    });
  }
};

const updateSupplier = async (req , res)=>{
    const {id}= req.params;
    const {name , phone_first , phone_second , address} = req.body;
    try{
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }
        await supplier.update({name , phone_first , phone_second , address});
        res.status(200).json({
            message:'update supplier success',
            supplier,
        });
    }catch(e){
        res.status(500).json({
            message:"error update supplier",error:e.message,
        });
    }
}

const deleteSupplier = async(req  ,res)=>{
    const {id}=req.params;
    try{
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }
        await supplier.destroy();
        res.status(200).json({
            message:"delete supplier success",
            supplier,
        });
    }catch(e){
        res.status(500).json({
            message:"error delete supplier",error:e.message,
        });
    }
}


module.exports = {
  getAllSupplier,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
