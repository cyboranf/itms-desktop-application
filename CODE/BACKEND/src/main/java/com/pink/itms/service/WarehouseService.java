package com.pink.itms.service;

import com.pink.itms.dto.warehouse.WarehouseRequestDTO;
import com.pink.itms.dto.warehouse.WarehouseResponseDTO;
import com.pink.itms.exception.warehouse.WarehouseNotFoundException;
import com.pink.itms.mapper.WarehouseMapper;
import com.pink.itms.model.Warehouse;
import com.pink.itms.repository.WarehouseRepository;
import com.pink.itms.validation.WarehouseValidator;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;
    private final WarehouseValidator warehouseValidator;

    public WarehouseService(WarehouseRepository warehouseRepository, WarehouseMapper warehouseMapper, WarehouseValidator warehouseValidator) {
        this.warehouseRepository = warehouseRepository;
        this.warehouseMapper = warehouseMapper;
        this.warehouseValidator = warehouseValidator;
    }

    /**
     * creates and saves warehouse entity
     *
     * @param warehouseRequestDTO warehouse to create
     * @return {@link WarehouseResponseDTO} - response from created warehouse
     */
    public WarehouseResponseDTO createWarehouse(WarehouseRequestDTO warehouseRequestDTO) {
        Warehouse warehouse = warehouseMapper.toEntity(warehouseRequestDTO);
        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        return warehouseMapper.toDto(savedWarehouse);
    }

    /**
     * Edits existing warehouse entity pointed by given id
     *
     * @param id                  of entity to edit
     * @param warehouseRequestDTO values to replace with
     * @return {@link WarehouseResponseDTO} - response from changed entity
     */
    @Transactional
    public WarehouseResponseDTO editWarehouse(Long id, WarehouseRequestDTO warehouseRequestDTO) {
        Optional<Warehouse> existingWarehouse = warehouseRepository.findById(id);

        if (existingWarehouse.isEmpty()) {
            throw new EntityNotFoundException("Warehouse with id " + id + " does not exist.");
        }

        Warehouse warehouse = existingWarehouse.get();
        warehouse.setBuilding(warehouseRequestDTO.getBuilding());
        warehouse.setZone(warehouseRequestDTO.getZone());
        warehouse.setSpaceId(warehouseRequestDTO.getSpaceId());
        warehouse.setSpaceHeight(warehouseRequestDTO.getSpaceHeight());
        warehouse.setSpaceWidth(warehouseRequestDTO.getSpaceWidth());
        warehouse.setSpaceLength(warehouseRequestDTO.getSpaceLength());

        return warehouseMapper.toDto(warehouse);
    }

    /**
     * Deletes warehouse with given id
     *
     * @param id id of warehouse to delete
     * @throws WarehouseNotFoundException if warehouse doesn't exist
     */
    public void deleteWarehouse(long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new WarehouseNotFoundException("Warehouse with id " + id + " doesn't exist."));
        warehouse.setIsActive(false);
        warehouseRepository.save(warehouse);
    }

    /**
     * Get all warehouses
     *
     * @return List of WarehouseResponseDTO
     */
    public List<WarehouseResponseDTO> getAll() {
        return warehouseRepository.findAllByIsActiveTrue()
                .stream()
                .map(warehouseMapper::toDto)
                .toList();
    }

    /**
     * Get all warehouses with optional filtering
     *
     * @param building   filter by building name
     * @param zone       filter by zone
     * @param spaceId    filter by space ID
     * @return List of WarehouseResponseDTO
     */
    public List<WarehouseResponseDTO> getFilteredWarehouses(String building, String zone, Long spaceId) {
        List<Warehouse> warehouses = warehouseRepository.findAllByIsActiveTrue();

        if (building != null && !building.isEmpty()) {
            warehouses = warehouses.stream()
                    .filter(warehouse -> warehouse.getBuilding().equalsIgnoreCase(building))
                    .collect(Collectors.toList());
        }
        if (zone != null && !zone.isEmpty()) {
            warehouses = warehouses.stream()
                    .filter(warehouse -> warehouse.getZone().equalsIgnoreCase(zone))
                    .collect(Collectors.toList());
        }
        if (spaceId != null) {
            warehouses = warehouses.stream()
                    .filter(warehouse -> warehouse.getSpaceId().equals(spaceId))
                    .collect(Collectors.toList());
        }

        return warehouses.stream()
                .map(warehouseMapper::toDto)
                .collect(Collectors.toList());
    }


}
