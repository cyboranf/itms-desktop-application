package com.pink.itms.controller;

import com.pink.itms.dto.taskType.TaskTypeRequestDTO;
import com.pink.itms.dto.taskType.TaskTypeResponseDTO;
import com.pink.itms.jwt.JwtTokenProvider;
import com.pink.itms.service.TaskTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class TaskTypeController {
    TaskTypeService taskTypeService;
    JwtTokenProvider jwtTokenProvider;

    public TaskTypeController(TaskTypeService taskTypeService, JwtTokenProvider jwtTokenProvider) {
        this.taskTypeService = taskTypeService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/tasks/types")
    public ResponseEntity<?> createTaskType(@RequestBody TaskTypeRequestDTO taskTypeRequestDTO, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                TaskTypeResponseDTO taskTypeResponseDTO = taskTypeService.createTaskType(taskTypeRequestDTO);
                return new ResponseEntity<>(taskTypeResponseDTO, HttpStatus.CREATED);
            } catch(Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/tasks/types/{id}")
    public ResponseEntity<?> editTaskType(@PathVariable long id, @RequestBody TaskTypeRequestDTO taskTypeRequestDTO, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                TaskTypeResponseDTO taskTypeResponseDTO = taskTypeService.editTaskType(id, taskTypeRequestDTO);
                return new ResponseEntity<>(taskTypeResponseDTO, HttpStatus.OK);
            } catch(Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/tasks/types/{id}")
    public ResponseEntity<?> deleteTaskType(@PathVariable long id, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                taskTypeService.deleteTaskType(id);
                return ResponseEntity.ok().build();
            } catch(Exception e) {
                return ResponseEntity.notFound().build();
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/tasks/types")
    public ResponseEntity<?> getallTasksTypes(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(taskTypeService.getAll(), HttpStatus.OK);
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/tasks/types/{id}")
    public ResponseEntity<?> getSignleTaskType(@PathVariable long id, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                TaskTypeResponseDTO responseDTO = taskTypeService.getSingle(id);
                return new ResponseEntity<>(responseDTO, HttpStatus.OK);
            } catch(Exception e) {
                return ResponseEntity.notFound().build();
            }
        } else if (token == null || !jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}