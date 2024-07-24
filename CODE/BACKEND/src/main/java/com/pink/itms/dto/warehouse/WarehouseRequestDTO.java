package com.pink.itms.dto.warehouse;

import lombok.Data;

@Data
public class WarehouseRequestDTO {
    private String building;
    private String zone;
    private Long spaceId;
    private int spaceHeight;
    private int spaceWidth;
    private int spaceLength;
    private Long productId;
}
