package com.electronics.OnlineElectronics.controller;

import com.electronics.OnlineElectronics.dto.ProductDTO;
import com.electronics.OnlineElectronics.mapper.ProductMapper;
import com.electronics.OnlineElectronics.model.Category;
import com.electronics.OnlineElectronics.model.Product;
import com.electronics.OnlineElectronics.service.interfaces.IProductService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final IProductService productService;

    public ProductController(IProductService productService){
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDTO> productDTOs= ProductMapper.toDTOList(products);
        return ResponseEntity.ok(productDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            ProductDTO productDTO=ProductMapper.toDTO(product);
            return ResponseEntity.ok(productDTO);
        } else {
            // Return 404 if product is not found
            return ResponseEntity.notFound().build();
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/admin", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> addProduct(@RequestParam String name,
                                              @RequestParam String description,
                                              @RequestParam String specifications,
                                              @RequestParam Double price,
                                              @RequestParam int stock,
                                              @RequestParam(value = "image", required = false) MultipartFile image,
                                              @RequestParam String categoryName) {


            Product product = productService.createProduct(name, description, specifications,
                    price, stock, image, categoryName);
            ProductDTO productDTO= ProductMapper.toDTO(product);
            return ResponseEntity.ok(productDTO);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/admin/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id,
                                                 @RequestParam String name,
                                                 @RequestParam String description,
                                                 @RequestParam String specifications,
                                                 @RequestParam Double price,
                                                 @RequestParam int stock,
                                                 @RequestParam String categoryName,
                                                 @RequestParam(value = "image", required = false) MultipartFile image) {

        Product product = productService.updateProduct(id, name, description, specifications,
                price, stock, categoryName, image);

        ProductDTO productDTO=ProductMapper.toDTO(product);
        return ResponseEntity.ok(productDTO);
    }



    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{id}")
    public void delete(@PathVariable Long id) {
        productService.deleteProduct(id);
    }



}
