const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockUsers = [
  { _id: "user_123", name: "Vintage Vault", email: "vintage@example.com", role: "seller", isVerified: false, joinedAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  { _id: "user_456", name: "Tech Haven", email: "tech@example.com", role: "seller", isVerified: true, joinedAt: new Date(Date.now() - 86400000 * 60).toISOString() },
  { _id: "buyer_789", name: "John Doe", email: "john@example.com", role: "buyer", joinedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { _id: "admin_001", name: "Admin Setup", email: "admin@evertrade.com", role: "admin", joinedAt: new Date(Date.now() - 86400000 * 365).toISOString() },
];

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
  ...Array.from({ length: 25 }).map((_, i) => ({
    _id: `mock_${i + 4}`,
    title: `Premium Item ${i + 4}`,
    description: "High quality pre-owned item verified by our team.",
    price: Math.floor(Math.random() * 500) + 50,
    category: ["Electronics", "Clothing", "Furniture", "Automotive", "Fashion"][Math.floor(Math.random() * 5)],
    condition: ["Excellent", "Like New", "Good", "Fair"][Math.floor(Math.random() * 4)],
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"],
    sellerId: "user_456",
    sellerName: "Tech Haven",
    status: "available",
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }))
];

let mockOrders = [
  {
    _id: "ord_1",
    buyerId: "buyer_789",
    productId: "2",
    productTitle: "Sony PlayStation 5",
    price: 450,
    status: "Delivered",
    transactionId: "TRX-9876543210",
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
  {
    _id: "ord_2",
    buyerId: "buyer_789",
    productId: "1",
    productTitle: "Vintage Leather Jacket",
    price: 150,
    status: "Processing",
    transactionId: "TRX-1234567890",
    date: new Date().toISOString(),
  },
];

export const mockApi = {
  // Product Endpoints
  getProducts: async () => {
    await delay(500); // Simulate network latency
    return [...mockProducts];
  },

  getPaginatedProducts: async ({ page = 1, limit = 8, category = "All", search = "", sortBy = "" }) => {
    await delay(600);
    
    let filtered = [...mockProducts];
    
    if (category && category !== "All") {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(lowerSearch) || p.description.toLowerCase().includes(lowerSearch));
    }
    
    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // Default sort by newest
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
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

  reportProduct: async (id) => {
    await delay(300);
    const index = mockProducts.findIndex((p) => p._id === id);
    if (index === -1) throw new Error("Product not found");
    
    mockProducts[index] = { ...mockProducts[index], isReported: true };
    return mockProducts[index];
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
      transactionId: "TRX-" + Math.floor(Math.random() * 10000000000),
      date: new Date().toISOString(),
    };
    mockOrders.unshift(newOrder); // Add to the top of the list
    return newOrder;
  },

  // Admin Endpoints
  getAllOrders: async () => {
    await delay(500);
    return [...mockOrders];
  },

  getAllUsers: async () => {
    await delay(500);
    return [...mockUsers];
  },

  verifySeller: async (userId) => {
    await delay(400);
    const index = mockUsers.findIndex((u) => u._id === userId);
    if (index === -1) throw new Error("User not found");
    
    mockUsers[index] = { ...mockUsers[index], isVerified: true };
    return mockUsers[index];
  },

  deleteUser: async (userId) => {
    await delay(400);
    mockUsers = mockUsers.filter((u) => u._id !== userId);
    return { success: true };
  }
};
