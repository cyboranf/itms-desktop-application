package com.pink.itms.model;

import javax.persistence.*;

import lombok.Data;

import java.util.Set;

@Entity
@Table(name = "warehouse")
@Data
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String building;
    private String zone;
    @Column(name = "space_id")
    private Long spaceId;
    @Column(name = "space_height")
    private int spaceHeight;
    @Column(name = "space_width")
    private int spaceWidth;
    @Column(name = "space_length")
    private int spaceLength;
    private Boolean isActive = true;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "product_id")
    private Product product;

}
