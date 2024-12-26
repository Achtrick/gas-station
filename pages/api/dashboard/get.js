export default function handler(req, res) {
    // Sample product data
    const products = [
      { _id: 1, designation: "Product A", subCategory: { name: "Category 1" }, qty: 5 },
      { _id: 2, designation: "Product B", subCategory: { name: "Category 2" }, qty: 15 },
      { _id: 3, designation: "Product C", subCategory: { name: "Category 1" }, qty: 8 },
    ];
  
    // Filter products with quantity less than 10
    const filteredProducts = products.filter(product => product.qty < 10);
  
    // Simulate pagination and search (optional)
    const { page = 1, searchTerm = "" } = req.body;
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
  
    const filteredAndSearched = filteredProducts.filter(product =>
      product.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const paginated = filteredAndSearched.slice(startIndex, startIndex + pageSize);
  
    res.status(200).json({
      products: paginated,
      count: filteredAndSearched.length,
    });
  }
  