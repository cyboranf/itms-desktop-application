package com.pink.itms.service;

import com.pink.itms.dto.warehouse.WarehouseRequestDTO;
import com.pink.itms.dto.warehouse.WarehouseResponseDTO;
import com.pink.itms.exception.warehouse.WarehouseNotFoundException;
import com.pink.itms.mapper.WarehouseMapper;
import com.pink.itms.model.Warehouse;
import com.pink.itms.repository.WarehouseRepository;
import com.pink.itms.validation.WarehouseValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WarehouseServiceTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private WarehouseMapper warehouseMapper;

    @Mock
    private WarehouseValidator warehouseValidator;

    @InjectMocks
    private WarehouseService warehouseService;

    private WarehouseRequestDTO warehouseRequestDTO;
    private Warehouse warehouse;
    private WarehouseResponseDTO warehouseResponseDTO;

    @BeforeEach
    public void setUp() {
        warehouseRequestDTO = new WarehouseRequestDTO();
        warehouseRequestDTO.setBuilding("Building A");
        warehouseRequestDTO.setZone("Zone 1");
        warehouseRequestDTO.setSpaceId(1L);
        warehouseRequestDTO.setSpaceHeight(10);
        warehouseRequestDTO.setSpaceWidth(20);
        warehouseRequestDTO.setSpaceLength(30);

        warehouse = new Warehouse();
        warehouse.setBuilding("Building A");
        warehouse.setZone("Zone 1");
        warehouse.setSpaceId(1L);
        warehouse.setSpaceHeight(10);
        warehouse.setSpaceWidth(20);
        warehouse.setSpaceLength(30);

        warehouseResponseDTO = new WarehouseResponseDTO();
        warehouseResponseDTO.setBuilding("Building A");
        warehouseResponseDTO.setZone("Zone 1");
        warehouseResponseDTO.setSpaceHeight(10);
        warehouseResponseDTO.setSpaceWidth(20);
        warehouseResponseDTO.setSpaceLength(30);
    }

    @Test
    public void testCreateWarehouse() {
        when(warehouseMapper.toEntity(any(WarehouseRequestDTO.class))).thenReturn(warehouse);
        when(warehouseRepository.save(any(Warehouse.class))).thenReturn(warehouse);
        when(warehouseMapper.toDto(any(Warehouse.class))).thenReturn(warehouseResponseDTO);

        WarehouseResponseDTO response = warehouseService.createWarehouse(warehouseRequestDTO);

        assertNotNull(response);
        assertEquals(warehouseResponseDTO.getBuilding(), response.getBuilding());
        verify(warehouseRepository, times(1)).save(any(Warehouse.class));
    }

    @Test
    public void testEditWarehouse_WarehouseNotFound() {
        when(warehouseRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            warehouseService.editWarehouse(1L, warehouseRequestDTO);
        });

        assertTrue(exception.getMessage().contains("Warehouse with id 1 does not exist."));
    }

    @Test
    public void testEditWarehouse_Success() {
        when(warehouseRepository.findById(anyLong())).thenReturn(Optional.of(warehouse));
        when(warehouseMapper.toDto(any(Warehouse.class))).thenReturn(warehouseResponseDTO);

        WarehouseResponseDTO response = warehouseService.editWarehouse(1L, warehouseRequestDTO);

        assertNotNull(response);
        assertEquals(warehouseResponseDTO.getBuilding(), response.getBuilding());
        verify(warehouseRepository, times(1)).findById(1L);
    }

    @Test
    public void testDeleteWarehouse_WarehouseNotFound() {
        when(warehouseRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(WarehouseNotFoundException.class, () -> {
            warehouseService.deleteWarehouse(1L);
        });

        assertTrue(exception.getMessage().contains("Warehouse with id 1 doesn't exist."));
    }

    @Test
    public void testDeleteWarehouse_Success() {
        when(warehouseRepository.findById(anyLong())).thenReturn(Optional.of(warehouse));

        warehouseService.deleteWarehouse(1L);

        ArgumentCaptor<Warehouse> warehouseCaptor = ArgumentCaptor.forClass(Warehouse.class);
        verify(warehouseRepository).save(warehouseCaptor.capture());
        assertFalse(warehouseCaptor.getValue().getIsActive());
    }

    @Test
    public void testGetAll() {
        when(warehouseRepository.findAllByIsActiveTrue()).thenReturn(Collections.singletonList(warehouse));
        when(warehouseMapper.toDto(any(Warehouse.class))).thenReturn(warehouseResponseDTO);

        List<WarehouseResponseDTO> responseList = warehouseService.getAll();

        assertNotNull(responseList);
        assertEquals(1, responseList.size());
        assertEquals(warehouseResponseDTO.getBuilding(), responseList.get(0).getBuilding());
        verify(warehouseRepository, times(1)).findAllByIsActiveTrue();
    }
}
