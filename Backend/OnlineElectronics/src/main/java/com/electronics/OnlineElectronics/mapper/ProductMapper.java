package com.electronics.OnlineElectronics.mapper;

import com.electronics.OnlineElectronics.dto.ProductDTO;
import com.electronics.OnlineElectronics.model.Product;

import java.util.List;
import java.util.stream.Collectors;

public class ProductMapper {

    public static ProductDTO toDTO(Product product) {
        if (product == null) return null;

        String categoryName = product.getCategory() != null
                ? product.getCategory().getName()
                : null;

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getSpecifications(),
                product.getPrice(),
                product.getStock(),
                product.getImage(),
                categoryName  //Doar string
        );
    }

    public static List<ProductDTO> toDTOList(List<Product> products) {
        return products.stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }
}