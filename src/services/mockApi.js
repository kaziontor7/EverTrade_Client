const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockProducts = [
  {
    _id: "1",
    title: "Vintage Leather Jacket",
    description: "A beautiful vintage leather jacket in excellent condition. Perfect for autumn wear.",
    price: 150,
    category: "Clothing",
    condition: "Excellent",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80"],
    sellerId: "user_123",
    sellerName: "Vintage Vault",
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Sony PlayStation 5",
    description: "Hardly used PS5, includes one controller and all original cables.",
    price: 450,
    category: "Electronics",
    condition: "Like New",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80"],
    sellerId: "user_456",
    sellerName: "Tech Haven",
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Mid-Century Modern Chair",
    description: "Authentic mid-century design. Some minor wear on the fabric but structurally sound.",
    price: 320,
    category: "Furniture",
    condition: "Good",
    images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80"],
    sellerId: "user_123",
    sellerName: "Vintage Vault",
    status: "available",
    createdAt: new Date().toISOString(),
  },
];

let mockOrders = [
  {
    _id: "ord_1",
    buyerId: "buyer_789",
    productId: "2",
    productTitle: "Sony PlayStation 5",
    price: 450,
    status: "Delivered",
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
  {
    _id: "ord_2",
    buyerId: "buyer_789",
    productId: "1",
    productTitle: "Vintage Leather Jacket",
    price: 150,
    status: "Processing",
    date: new Date().toISOString(),
  },
];

export const mockApi = {
  // Product Endpoints
  getProducts: async () => {
    await delay(500); // Simulate network latency
    return [...mockProducts];
  },
  
  getProductById: async (id) => {
    await delay(300);
    return mockProducts.find((p) => p._id === id) || null;
  },

  getProductsBySeller: async (sellerId) => {
    await delay(500);
    return mockProducts.filter((p) => p.sellerId === sellerId);
  },
  
  createProduct: async (productData) => {
    await delay(600);
    const newProduct = {
      ...productData,
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: "available",
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id, updateData) => {
    await delay(500);
    const index = mockProducts.findIndex((p) => p._id === id);
    if (index === -1) throw new Error("Product not found");
    
    mockProducts[index] = { ...mockProducts[index], ...updateData };
    return mockProducts[index];
  },

  deleteProduct: async (id) => {
    await delay(400);
    mockProducts = mockProducts.filter((p) => p._id !== id);
    return { success: true };
  },

  // Order/Buyer Endpoints
  getBuyerOrders: async (buyerId) => {
    await delay(500);
    // In a real app we'd filter by buyerId, but for mock purposes we just return all
    return [...mockOrders];
  },
  
  createOrder: async (orderData) => {
    await delay(500);
    const newOrder = {
      ...orderData,
      _id: "ord_" + Math.random().toString(36).substr(2, 9),
      status: "Processing",
      date: new Date().toISOString(),
    };
    mockOrders.unshift(newOrder); // Add to the top of the list
    return newOrder;
  }
};
