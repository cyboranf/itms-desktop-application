package com.pink.itms.service;

import com.pink.itms.dto.product.ProductRequestDTO;
import com.pink.itms.dto.product.ProductResponseDTO;
import com.pink.itms.dto.warehouse.WarehouseResponseDTO;
import com.pink.itms.exception.product.ProductNotFoundException;
import com.pink.itms.exception.warehouse.WarehouseNotFoundException;
import com.pink.itms.mapper.ProductMapper;
import com.pink.itms.model.Product;
import com.pink.itms.model.Warehouse;
import com.pink.itms.repository.ProductRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;

    public ProductService(ProductMapper productMapper, ProductRepository productRepository) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    /**
     * creates and saves product entity
     *
     * @param productRequestDTO product to create
     * @return {@link ProductResponseDTO} - response from created product
     */
    public ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO) {
        Product product = productMapper.toEntity(productRequestDTO);
        Product savedProduct = productRepository.save(product);

        return productMapper.toDto(savedProduct);
    }

    /**
     * deletes product with given id
     *
     * @param id id of product to delete
     * @throws ProductNotFoundException if product doesn't exist if product repository
     * Deletes product with given id
     *
     * @param id id of product to delete
     * @throws ProductNotFoundException if product doesn't exist
     */
    public void deleteProduct(long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new WarehouseNotFoundException("Product with id " + id + " doesn't exist."));
        product.setIsActive(false);
        productRepository.save(product);
    }

    /**
     * edits product of given id
     *
     * @param id         id of product to edit
     * @param requestDTO data for product to update with
     * @return {@link ProductResponseDTO} response from edited product
     * @throws ProductNotFoundException if product doesn't exist in product repository
     */
    public ProductResponseDTO editProduct(long id, ProductRequestDTO requestDTO) {
        productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product with id " + id + " doesn't exist."));

        Product product = productRepository.getById(id);

        product.setName(requestDTO.getName());
        product.setCode(requestDTO.getCode());
        product.setWeight(requestDTO.getWeight());
        product.setWidth(requestDTO.getWidth());
        product.setHeight(requestDTO.getHeight());
        product.setLength(requestDTO.getLength());

        return productMapper.toDto(product);
    }

     /** Returns all products
     *
     * @return list of all products
     */
    public List<ProductResponseDTO> getAll() {
        return productRepository.findAllByIsActiveTrue()
                .stream()
                .map(productMapper::toDto)
                .toList();
    }

    /**
     * Returns product with given ID
     *
     * @param id id of product to find
     * @return {@link ProductResponseDTO} - found product
     * @throws ProductNotFoundException in case given product can't be found
     */
    public ProductResponseDTO getSingle(long id) {
        productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product with id " + id + " not found"));

        return productMapper.toDto(productRepository.getById(id));
    }

    public List<ProductResponseDTO> getFilteredProduct(String name, String code) {

        List<ProductResponseDTO> products = productRepository.findAllByIsActiveTrue()
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());


        if (name != null && !name.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getName().equalsIgnoreCase(name))
                    .collect(Collectors.toList());
        }
        if (code != null && !code.isEmpty()) {
            products = products.stream()
                    .filter(product -> product.getCode().equalsIgnoreCase(code))
                    .collect(Collectors.toList());
        }

        return products;
    }
}
