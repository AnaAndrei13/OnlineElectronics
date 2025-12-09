package com.electronics.OnlineElectronics.service.impl;
import com.electronics.OnlineElectronics.model.Category;
import com.electronics.OnlineElectronics.model.Product;
import com.electronics.OnlineElectronics.repository.CategoryRepository;
import com.electronics.OnlineElectronics.repository.ProductRepository;
import com.electronics.OnlineElectronics.service.interfaces.IProductService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.NoSuchElementException;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Value("${upload.path:uploads}")
    private String uploadPath;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository=categoryRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with id: " + id));
    }

    public Product createProduct(String name, String description, String specifications,
                                  Double price, int stock, MultipartFile image, String categoryName) {

        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found " + categoryName));

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setSpecifications(specifications);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategory(category);


        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = saveImage(image);
                product.setImage(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Error saving image " + e.getMessage());
            }
        }

        return productRepository.save(product);
    }


    public String saveImage(MultipartFile image) throws IOException {
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            System.out.println("Upload directory created: " + created + " at path: " + uploadDir.getAbsolutePath());
        }

        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = Paths.get(uploadPath, fileName);
        Files.write(filePath, image.getBytes());

        System.out.println("Image saved successfully at: " + filePath.toAbsolutePath());

        return "/uploads/" + fileName;
    }

    public Product updateProduct(Long id, String name, String description, String specifications,
                                 Double price, int stock, String categoryName, MultipartFile image) {
        Product existingProduct = getProductById(id);
        existingProduct.setName(name);
        existingProduct.setDescription(description);
        existingProduct.setSpecifications(specifications);
        existingProduct.setPrice(price);
        existingProduct.setStock(stock);

        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existingProduct.setCategory(category);

        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = saveImage(image);
                existingProduct.setImage(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Error saving image", e);
            }

        }

        return productRepository.save(existingProduct);
    }



    @Override
    public void deleteProduct(Long id) {
        Product existingProduct = getProductById(id);
        productRepository.delete(existingProduct);
    }
}
