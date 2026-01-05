package com.electronics.OnlineElectronics.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String specifications;
    private Double price;

    private int stock;
    @Column(length =500)
    private String image; // save in DB

    @ManyToOne
    @JoinColumn(name = "category_name")
    @JsonBackReference
    private Category category;

    public Product(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSpecifications() {
        return specifications;
    }

    public void setSpecifications(String specifications) {
        this.specifications = specifications;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public void setCategory(Category category){
        this.category=category;
    }

   public Category getCategory(){
        return category;
   }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
