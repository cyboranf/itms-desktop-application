package com.pink.itms.mapper;

import com.pink.itms.dto.product.ProductRequestDTO;
import com.pink.itms.dto.product.ProductResponseDTO;
import com.pink.itms.model.Product;
import com.pink.itms.repository.ProductRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProductMapper {
    ProductRepository productRepository;

    public ProductMapper(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public static Set<pdf.generator.model.Product> toPdfProductSet(Set<ProductResponseDTO> products) {
        return products.stream()
                .map(ProductMapper::toPdfProduct)
                .collect(Collectors.toSet());
    }


    public Product toEntity(ProductRequestDTO productRequestDTO) {
        Product product = new Product();
        product.setName(productRequestDTO.getName());
        product.setCode(productRequestDTO.getCode());
        product.setHeight(productRequestDTO.getHeight());
        product.setLength(productRequestDTO.getLength());
        product.setWidth(productRequestDTO.getWidth());
        product.setWeight(productRequestDTO.getWeight());
        product.setIsActive(true);

        return product;
    }

    public ProductResponseDTO toDto(Product product) {
        ProductResponseDTO productResponseDTO = new ProductResponseDTO();
        productResponseDTO.setId(product.getId());
        productResponseDTO.setName(product.getName());
        productResponseDTO.setCode(product.getCode());
        productResponseDTO.setHeight(product.getHeight());
        productResponseDTO.setLength(product.getLength());
        productResponseDTO.setWidth(product.getWidth());
        productResponseDTO.setWeight(product.getWeight());
        productResponseDTO.setIsActive(product.getIsActive());

        return productResponseDTO;
    }



    public static pdf.generator.model.Product toPdfProduct(ProductResponseDTO productDTO) {
        pdf.generator.model.Product product = new pdf.generator.model.Product();
        product.setId(productDTO.getId());
        product.setName(productDTO.getName());
        product.setCode(productDTO.getCode());
        product.setWidth(productDTO.getWidth());
        product.setHeight(productDTO.getHeight());
        product.setLength(productDTO.getLength());
        product.setWeight(productDTO.getWeight());
        product.setActive(productDTO.getIsActive());
        return product;
    }

    public static List<pdf.generator.model.Product> toPdfProductList(List<ProductResponseDTO> products) {
        return products.stream()
                .map(ProductMapper::toPdfProduct)
                .collect(Collectors.toList());
    }

}
