package com.pink.itms;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class ItmsApplicationTests {

	@Autowired
	private DataSource dataSource;

	@Test
	void contextLoads() {
	}

	@Test
	public void testDatabaseConnection() {
		try {
			assertTrue(dataSource.getConnection() != null, "Database connection is successful.");
		} catch (Exception e) {
			assertTrue(false, "Failed to connect to the database: " + e.getMessage());
		}
	}

}
