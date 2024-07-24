package com.pink.itms.controller;

import com.pink.itms.dto.product.ProductResponseDTO;
import com.pink.itms.dto.task.TaskResponseDTO;
import com.pink.itms.dto.user.UserRequestDTO;
import com.pink.itms.dto.user.UserResponseWithoutTasksDTO;
import com.pink.itms.dto.warehouse.WarehouseRequestDTO;
import com.pink.itms.dto.warehouse.WarehouseResponseDTO;
import com.pink.itms.jwt.JwtTokenProvider;
import com.pink.itms.mapper.ProductMapper;
import com.pink.itms.mapper.TaskMapper;
import com.pink.itms.mapper.UserMapper;
import com.pink.itms.mapper.WarehouseMapper;
import com.pink.itms.service.ProductService;
import com.pink.itms.service.TaskService;
import com.pink.itms.service.UserService;
import com.pink.itms.service.WarehouseService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import pdf.generator.PdfGeneratorService;
import pdf.generator.model.Tasks;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PdfController {

    private final PdfGeneratorService pdfReportGenerator;
    private final UserService userService;
    private final WarehouseService warehouseService;
    private final ProductService productService;
    private final TaskService taskService;
    private final JwtTokenProvider jwtTokenProvider;

    public PdfController(PdfGeneratorService pdfReportGenerator, UserService userService, WarehouseService warehouseService, ProductService productService, TaskService taskService, JwtTokenProvider jwtTokenProvider) {
        this.pdfReportGenerator = pdfReportGenerator;
        this.userService = userService;
        this.warehouseService = warehouseService;
        this.productService = productService;
        this.taskService = taskService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/generate-user-report")
    public ResponseEntity<InputStreamResource> generateUserReport(
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "includeTasks", required = false, defaultValue = "false") boolean includeTasks,
            HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            List<UserResponseWithoutTasksDTO> users = userService.getAll();

            // Filtering
            if (username != null && !username.isEmpty()) {
                users = users.stream()
                        .filter(user -> user.getUsername().equalsIgnoreCase(username))
                        .collect(Collectors.toList());
            }
            if (email != null && !email.isEmpty()) {
                users = users.stream()
                        .filter(user -> user.getEmail().equalsIgnoreCase(email))
                        .collect(Collectors.toList());
            }
            if (phoneNumber != null && !phoneNumber.isEmpty()) {
                users = users.stream()
                        .filter(user -> user.getPhoneNumber().equalsIgnoreCase(phoneNumber))
                        .collect(Collectors.toList());
            }

            List<pdf.generator.model.User> pdfUsers = UserMapper.toPdfUserList(users);

            ByteArrayInputStream bis = pdfReportGenerator.generateUserReport(pdfUsers, includeTasks);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=user-report.pdf");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(bis));
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/generate-warehouse-report")
    public ResponseEntity<InputStreamResource> generateWarehouseReport(
            @RequestParam(value = "building", required = false) String building,
            @RequestParam(value = "zone", required = false) String zone,
            @RequestParam(value = "spaceId", required = false) Long spaceId

            ) {

        List<WarehouseResponseDTO> warehouses = warehouseService.getFilteredWarehouses(building, zone, spaceId);
        List<pdf.generator.model.Warehouse> pdfWarehouses = WarehouseMapper.toPdfWarehouseList(warehouses);

        ByteArrayInputStream bis = pdfReportGenerator.generateWarehouseReport(pdfWarehouses);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=warehouse-report.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @GetMapping("/generate-items-report")
    public ResponseEntity<InputStreamResource> generateItemsReport(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "code", required = false) String code) {

        List<ProductResponseDTO> products = productService.getFilteredProduct(name, code);
        List<pdf.generator.model.Product> pdfProducts = ProductMapper.toPdfProductList(products);


        ByteArrayInputStream bis = pdfReportGenerator.generateProductReport(pdfProducts);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=user-report.pdf");

        // Zwrócenie odpowiedzi zawierającej raport PDF
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @GetMapping("/generate-task-report")
    public ResponseEntity<InputStreamResource> generateTaskReport(
            @RequestParam(value = "priority", required = false) Integer priority,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "taskId", required = false) Long taskId,
            @RequestParam(value = "includeUsers", required = false, defaultValue = "false") boolean includeUsers,
            @RequestParam(value = "includeProducts", required = false, defaultValue = "false") boolean includeProducts,
            @RequestParam(value = "includeWarehouses", required = false, defaultValue = "false") boolean includeWarehouses,
            @RequestParam(value = "includePieChart", required = false, defaultValue = "false") boolean includePieChart,
            HttpServletRequest request) {

            String token = jwtTokenProvider.resolveToken(request);

            if (token != null && jwtTokenProvider.validateToken(token)) {

                List<TaskResponseDTO> tasks = taskService.getFilteredTasks(priority, userId, taskId);
                List<Tasks> pdfTasks = TaskMapper.toPdfTaskList(tasks);

                ByteArrayInputStream bis = pdfReportGenerator.generateTaskReport(pdfTasks, includeUsers, includeProducts, includeWarehouses, includePieChart);

                System.out.println("Number of tasks retrieved: " + tasks.size());

                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "inline; filename=task-report.pdf");

                return ResponseEntity
                        .ok()
                        .headers(headers)
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(new InputStreamResource(bis));
            }else if (token == null || !jwtTokenProvider.validateToken(token)) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

    }
}