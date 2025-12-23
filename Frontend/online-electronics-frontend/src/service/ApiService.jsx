

  import axios from "axios";

 class ApiService {
  static BASE_URL = "http://localhost:8080/api";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /** CATEGORY ENDPOINTS */

  static async createCategory(body) {
    const response = await axios.post(`${this.BASE_URL}/categories`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllCategory() {
  const response = await axios.get(`${this.BASE_URL}/categories`, {
    headers: this.getHeader(),
  });
  return response.data;
}

  static async getCategoryById(categoryId) {
    const response = await axios.get(`${this.BASE_URL}/categories/${categoryId}`);
    return response.data;
  }

  static async updateCategory(categoryId, body) {
    const response = await axios.put(`${this.BASE_URL}/categories/${categoryId}`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteCategory(categoryId) {
    const response = await axios.delete(`${this.BASE_URL}/categories/${categoryId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }
  

  /** PRODUCT ENDPOINTS */
static async createProduct(formData) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${this.BASE_URL}/products/admin`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

static async getAllProducts() {
  const response = await axios.get(`${this.BASE_URL}/products`);
  return response.data;
}

static async getProductById(productId) {
  const response = await axios.get(`${this.BASE_URL}/products/${productId}`);
  return response.data;
}

static async updateProduct(productId, formData) {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${this.BASE_URL}/products/admin/${productId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

static async deleteProduct(productId) {
  const response = await axios.delete(`${this.BASE_URL}/products/admin/${productId}`, {
    headers: this.getHeader(),
  });
  return response.data;
}

};

export default ApiService;