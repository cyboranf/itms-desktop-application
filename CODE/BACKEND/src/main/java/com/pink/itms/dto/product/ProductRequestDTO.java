package com.pink.itms.dto.product;

import lombok.Data;

@Data
public class ProductRequestDTO {
    private String name;
    private String code;
    private double width;
    private double height;
    private double length;
    private double weight;
}
