
const permissions = {
  admin: {
    products: ["read", "create", "update", "delete"],
    employees: ["read", "create", "update", "delete"],
    brand: ["read", "create", "update", "delete"],
    company: ["read", "create", "update", "delete"],
    devis: ["read", "create", "update", "delete"],
    orders: ["read", "create", "update", "delete"],
    suppliers: ["read", "create", "update", "delete"],
    categories: ["read", "create", "update", "delete"],
    customers: ["read", "create", "update", "delete"],
  },

  sales_manager: {
    products: ["read", "create", "update"],
    employees: [],
    brand: ["read", "create", "update"],
    company: ["read", "create", "update"],
    devis: ["read", "create", "update"],
    orders: ["read", "create", "update"],
    suppliers: ["read", "create", "update"],
    categories: ["read", "create", "update"],
    customers: ["read", "create", "update"],
  },

  sales: {
    products: ["read", "create", "update"],
    employees: [],
    brand: ["read", "create", "update"],
    company: ["read", "create", "update"],
    devis: ["read", "create", "update"],
    orders: ["read", "create", "update"],
    suppliers: ["read", "create", "update"],
    categories: ["read", "create", "update"],
    customers: ["read", "create", "update"],
  },

  engineer: {
    products: ["read"],
    employees: [],
    brand: ["read"],
    company: ["read"],
    devis: ["read"],
    orders: ["read"],
    suppliers: ["read"],
    categories: ["read"],
    customers: ["read"],
  },

  customer: {
    products: [],
    employees: [],
    brand: [],
    company: [],
    devis: [],
    orders: [],
    suppliers: [],
    categories: [],
    customers: [],
  },
};

export default permissions;
