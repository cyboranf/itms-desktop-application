package com.pink.itms.validation;

import com.pink.itms.dto.warehouse.WarehouseRequestDTO;
import com.pink.itms.exception.product.ProductNotFoundException;
import com.pink.itms.exception.warehouse.*;
import com.pink.itms.mapper.WarehouseMapper;
import com.pink.itms.model.Warehouse;
import com.pink.itms.repository.ProductRepository;
import com.pink.itms.repository.WarehouseRepository;
import org.springframework.stereotype.Component;

@Component
public class WarehouseValidator {
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;

    public WarehouseValidator(ProductRepository productRepository, WarehouseRepository warehouseRepository, WarehouseMapper warehouseMapper) {
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.warehouseMapper = warehouseMapper;
    }

    public Warehouse warehouseValidation(WarehouseRequestDTO warehouseRequestDTO) {
        if (warehouseRequestDTO.getBuilding() != "A" && warehouseRequestDTO.getBuilding() != "B" && warehouseRequestDTO.getBuilding() != "C" && warehouseRequestDTO.getBuilding() != null) {
            throw new BadWarehouseBuildingException("Building must be A, B or C and can not be null");
        }
        if (warehouseRequestDTO.getZone() != "a" && warehouseRequestDTO.getZone() != "b" && warehouseRequestDTO.getZone() != "c" && warehouseRequestDTO.getZone() != "d" && warehouseRequestDTO.getZone() == null) {
            throw new BadWarehouseZoneException("Zone must be a, b, c or d and can not be null.");
        }
        if (warehouseRequestDTO.getSpaceId() == null || warehouseRequestDTO.getSpaceId() < 1 || warehouseRequestDTO.getSpaceId() > 150) {
            throw new BadWarehouseSpaceIdException("SpaceId must be between 1 and 150 and can not be null.");
        }
        if (warehouseRequestDTO.getSpaceHeight() < 1 || warehouseRequestDTO.getSpaceHeight() > 150) {
            throw new BadWarehouseSpaceHeightException("SpaceHeight must be between 1 and 150 and can not be null.");
        }
        if (warehouseRequestDTO.getSpaceWidth() < 1 || warehouseRequestDTO.getSpaceWidth() > 150) {
            throw new BadWarehouseSpaceWidthException("SpaceWidth must be between 1 and 150 and can not be null.");
        }
        if (warehouseRequestDTO.getSpaceLength() < 1 || warehouseRequestDTO.getSpaceLength() > 150) {
            throw new BadWarehouseSpaceLengthException("SpaceLength must be between 1 and 150 and can not be null.");
        }
        productRepository.findById(warehouseRequestDTO.getProductId()).orElseThrow(() -> new ProductNotFoundException("Can not found Product with id = " + warehouseRequestDTO.getProductId()));

        Warehouse validatedWarehouse = new Warehouse();
        validatedWarehouse = warehouseMapper.toEntity(warehouseRequestDTO);
        return validatedWarehouse;
    }
}
