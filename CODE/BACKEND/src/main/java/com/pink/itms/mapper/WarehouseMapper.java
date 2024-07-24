package com.pink.itms.mapper;

import com.pink.itms.dto.user.UserResponseWithoutTasksDTO;
import com.pink.itms.dto.warehouse.WarehouseRequestDTO;
import com.pink.itms.dto.warehouse.WarehouseResponseDTO;
import com.pink.itms.exception.product.ProductNotFoundException;
import com.pink.itms.model.Warehouse;
import com.pink.itms.repository.ProductRepository;
import org.springframework.stereotype.Component;
import pdf.generator.model.User;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class WarehouseMapper {
    private final ProductRepository productRepository;

    public WarehouseMapper(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public static Set<pdf.generator.model.Warehouse> toPdfWarehouseSet(Set<WarehouseResponseDTO> warehouses) {
        return warehouses.stream()
                .map(WarehouseMapper::toPdfWarehouse)
                .collect(Collectors.toSet());
    }

    public Warehouse toEntity(WarehouseRequestDTO warehouseRequestDTO) {
        Warehouse warehouse = new Warehouse();
        warehouse.setBuilding(warehouseRequestDTO.getBuilding());
        warehouse.setZone(warehouseRequestDTO.getZone());
        warehouse.setSpaceId(warehouseRequestDTO.getSpaceId());
        warehouse.setSpaceHeight(warehouseRequestDTO.getSpaceHeight());
        warehouse.setSpaceWidth(warehouseRequestDTO.getSpaceWidth());
        warehouse.setSpaceLength(warehouseRequestDTO.getSpaceLength());
        warehouse.setProduct(productRepository.findById(warehouseRequestDTO.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Cannot find Product with id = " + warehouseRequestDTO.getProductId())));

        warehouse.setIsActive(true);
        return warehouse;
    }

    public WarehouseResponseDTO toDto(Warehouse warehouse) {
        WarehouseResponseDTO warehouseResponseDTO = new WarehouseResponseDTO();
        warehouseResponseDTO.setId(warehouse.getId());
        warehouseResponseDTO.setBuilding(warehouse.getBuilding());
        warehouseResponseDTO.setZone(warehouse.getZone());
        warehouseResponseDTO.setSpaceId(warehouse.getSpaceId());
        warehouseResponseDTO.setSpaceHeight(warehouse.getSpaceHeight());
        warehouseResponseDTO.setSpaceWidth(warehouse.getSpaceWidth());
        warehouseResponseDTO.setSpaceLength(warehouse.getSpaceLength());
        warehouseResponseDTO.setIsActive(warehouse.getIsActive());

        if (warehouse.getProduct() != null) {
            warehouseResponseDTO.setProductId(warehouse.getProduct().getId());
            warehouseResponseDTO.setProductName(warehouse.getProduct().getName());
            warehouseResponseDTO.setProductCode(warehouse.getProduct().getCode());
        } else {
            warehouseResponseDTO.setProductId(null);
            warehouseResponseDTO.setProductName("No Product");
            warehouseResponseDTO.setProductCode("N/A");
        }

        return warehouseResponseDTO;
    }

    public static pdf.generator.model.Warehouse toPdfWarehouse(WarehouseResponseDTO warehouse) {
        pdf.generator.model.Warehouse pdfWarehouse = new pdf.generator.model.Warehouse();
        pdfWarehouse.setBuilding(warehouse.getBuilding());
        pdfWarehouse.setZone(warehouse.getZone());
        pdfWarehouse.setSpaceId(warehouse.getSpaceId());
        pdfWarehouse.setSpaceHeight(warehouse.getSpaceHeight());
        pdfWarehouse.setSpaceWidth(warehouse.getSpaceWidth());
        pdfWarehouse.setSpaceLength(warehouse.getSpaceLength());
        pdfWarehouse.setProductId(warehouse.getProductId());
        return pdfWarehouse;
    }

    public static List<pdf.generator.model.Warehouse> toPdfWarehouseList(List<WarehouseResponseDTO> warehouses) {
        return warehouses.stream()
                .map(WarehouseMapper::toPdfWarehouse)
                .collect(Collectors.toList());
    }
}