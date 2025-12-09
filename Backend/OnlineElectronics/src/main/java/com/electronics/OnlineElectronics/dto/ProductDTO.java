package com.electronics.OnlineElectronics.dto;

public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String specifications;
    private Double price;
    private int stock;
    private String image;
    private String categoryName;

    public ProductDTO(Long id, String name, String description, String specifications,
                      Double price, int stock, String image, String categoryName ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.specifications = specifications;
        this.price=price;
        this.stock=stock;
        this.image= image;
        this.categoryName=categoryName;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getSpecifications() { return specifications; }
    public Double getPrice() { return price; }
    public int getStock() { return stock; }
    public String getImage() { return image; }
    public String getCategoryName() { return categoryName; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }
    public void setPrice(Double price) { this.price = price; }
    public void setStock(int stock) { this.stock = stock; }
    public void setImage(String image) { this.image = image; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}

