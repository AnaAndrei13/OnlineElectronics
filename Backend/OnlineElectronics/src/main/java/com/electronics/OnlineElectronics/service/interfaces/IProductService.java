package com.electronics.OnlineElectronics.service.interfaces;

import com.electronics.OnlineElectronics.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IProductService {
    List<Product> getAllProducts();

    Product getProductById(Long id);

 Product createProduct(String name, String description, String specifications,
                                 Double price, int stock, MultipartFile image,String categoryName);

    public Product updateProduct(Long id, String name, String description, String specifications,
                                 Double price, int stock, String categoryName, MultipartFile image);

    void deleteProduct(Long id);
}
