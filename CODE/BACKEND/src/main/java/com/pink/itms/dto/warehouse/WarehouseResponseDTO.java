package com.pink.itms.dto.warehouse;

import lombok.Data;

@Data
public class WarehouseResponseDTO {
    private Long id;
    private String building;
    private String zone;
    private Long spaceId;
    private int spaceHeight;
    private int spaceWidth;
    private int spaceLength;
    private Long productId;
    private String productName;
    private String productCode;
    private Boolean isActive;
}
