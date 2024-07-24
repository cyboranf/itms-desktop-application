package com.pink.itms.controller;

import com.pink.itms.dto.task.TaskRequestDTO;
import com.pink.itms.dto.task.TaskResponseDTO;
import com.pink.itms.exception.task.TaskNotFoundException;
import com.pink.itms.jwt.JwtTokenProvider;
import com.pink.itms.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    private final JwtTokenProvider jwtTokenProvider;

    public TaskController(TaskService taskService, JwtTokenProvider jwtTokenProvider) {
        this.taskService = taskService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    //TODO: Make sure that tasks creates with state 0
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequestDTO taskRequestDTO, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                TaskResponseDTO taskResponseDTO = taskService.createTask(taskRequestDTO);
                return new ResponseEntity<>(taskResponseDTO, HttpStatus.CREATED);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable long id, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                TaskResponseDTO taskResponseDTO = taskService.getTaskById(id);
                return ResponseEntity.ok(taskResponseDTO);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); // Return 500 Internal Server Error for other exceptions
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable long id, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                taskService.deleteTask(id);
                return ResponseEntity.ok().build();
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()); // Return 500 Internal Server Error for other exceptions
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("")
    public ResponseEntity<List<TaskResponseDTO>> getAll(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.ok(taskService.getAll());
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> editTask(@PathVariable Long id, @RequestBody TaskRequestDTO taskRequestDTO, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            TaskResponseDTO responseDTO = taskService.editTask(id, taskRequestDTO);
            return ResponseEntity.ok(responseDTO);
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/{taskId}/join/products/{productId}")
    public ResponseEntity<?> attachProduct(@PathVariable Long taskId, @PathVariable Long productId, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                taskService.attachProduct(taskId, productId);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }

            return ResponseEntity.ok().build();
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/{taskId}/join/warehouse/{warehouseId}")
    public ResponseEntity<?> attachWarehouse(@PathVariable Long taskId, @PathVariable Long warehouseId, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                taskService.attachWarehouse(taskId, warehouseId);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }

            return ResponseEntity.ok().build();
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskResponseDTO>> getAllTasksByUserId(@PathVariable Long userId, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.ok(taskService.getAllTasksByUserId(userId));
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    /*
    TODO: add verification if task is assigned for given user, now it's only checks if user has correct role for that task's state
     */
    @PostMapping("/{taskId}/finished")
    public ResponseEntity<?> nextStage(@PathVariable Long taskId, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        System.out.println(jwtTokenProvider.getAuthentication(token).getAuthorities().toArray()[0]);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                return ResponseEntity.ok(taskService.nextStage(taskId, jwtTokenProvider.getAuthentication(token).getAuthorities().toArray()[0].toString()));
            } catch (TaskNotFoundException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e);
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/self/assigned")
    public ResponseEntity<?> getAssignedForSelf(HttpServletRequest request){
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
           return  ResponseEntity.ok(taskService.getAssignedForSelf(jwtTokenProvider.getAuthentication(token).getName()));
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    /*
        it's diffrent from /user/{userId}, because it's returns only tasks that's in correct state for that user
     */
    @GetMapping("/user/{userName}/assigned")
    public ResponseEntity<?> getAssignedForUser(@PathVariable String userName, HttpServletRequest request){
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            return  ResponseEntity.ok(taskService.getAssignedForSelf(userName));
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


}