package com.pink.itms.service;

import com.pink.itms.dto.product.ProductRequestDTO;
import com.pink.itms.dto.product.ProductResponseDTO;
import com.pink.itms.exception.product.ProductNotFoundException;
import com.pink.itms.exception.warehouse.WarehouseNotFoundException;
import com.pink.itms.mapper.ProductMapper;
import com.pink.itms.model.Product;
import com.pink.itms.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private ProductRequestDTO productRequestDTO;
    private ProductResponseDTO productResponseDTO;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setIsActive(true);

        productRequestDTO = new ProductRequestDTO();
        productRequestDTO.setName("Test Product");

        productResponseDTO = new ProductResponseDTO();
        productResponseDTO.setId(1L);
        productResponseDTO.setName("Test Product");
    }

    @Test
    void createProduct() {
        when(productMapper.toEntity(productRequestDTO)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toDto(product)).thenReturn(productResponseDTO);

        ProductResponseDTO result = productService.createProduct(productRequestDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Product", result.getName());
    }

    @Test
    void deleteProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).save(product);
        assertFalse(product.getIsActive());
    }

    @Test
    void deleteProductThrowsException() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(WarehouseNotFoundException.class, () -> productService.deleteProduct(1L));
    }

    @Test
    void editProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.getById(1L)).thenReturn(product);
        when(productMapper.toDto(product)).thenReturn(productResponseDTO);

        ProductResponseDTO result = productService.editProduct(1L, productRequestDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Product", result.getName());
    }

    @Test
    void editProductThrowsException() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> productService.editProduct(1L, productRequestDTO));
    }

    @Test
    void getAll() {
        List<Product> products = Arrays.asList(product);
        when(productRepository.findAllByIsActiveTrue()).thenReturn(products);
        when(productMapper.toDto(product)).thenReturn(productResponseDTO);

        List<ProductResponseDTO> result = productService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).getName());
    }

    @Test
    void getSingle() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.getById(1L)).thenReturn(product);
        when(productMapper.toDto(product)).thenReturn(productResponseDTO);

        ProductResponseDTO result = productService.getSingle(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Product", result.getName());
    }

    @Test
    void getSingleThrowsException() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> productService.getSingle(1L));
    }
}