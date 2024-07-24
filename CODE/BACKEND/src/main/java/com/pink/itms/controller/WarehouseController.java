package com.pink.itms.controller;

import com.pink.itms.dto.warehouse.WarehouseRequestDTO;
import com.pink.itms.dto.warehouse.WarehouseResponseDTO;
import com.pink.itms.jwt.JwtTokenProvider;
import com.pink.itms.service.WarehouseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/warehouse")
public class WarehouseController {
    private final WarehouseService warehouseService;
    private final JwtTokenProvider jwtTokenProvider;

    public WarehouseController(WarehouseService warehouseService, JwtTokenProvider jwtTokenProvider) {
        this.warehouseService = warehouseService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("")
    public ResponseEntity<?> createWarehouse(@RequestBody WarehouseRequestDTO warehouseRequestDTO, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            WarehouseResponseDTO warehouseResponseDTO = warehouseService.createWarehouse(warehouseRequestDTO);
            return new ResponseEntity<>(warehouseResponseDTO, HttpStatus.CREATED);
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editWarehouse(@PathVariable long id, @RequestBody WarehouseRequestDTO warehouseRequestDTO, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                WarehouseResponseDTO warehouseResponseDTO = warehouseService.editWarehouse(id, warehouseRequestDTO);
                return new ResponseEntity<>(warehouseResponseDTO, HttpStatus.OK);
            } catch(Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWarehouse(@PathVariable long id, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                warehouseService.deleteWarehouse(id);
                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.notFound().build();
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("")
    public ResponseEntity<List<WarehouseResponseDTO>> getAll(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                List<WarehouseResponseDTO> warehouses = warehouseService.getAll();
                return ResponseEntity.ok(warehouses);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}