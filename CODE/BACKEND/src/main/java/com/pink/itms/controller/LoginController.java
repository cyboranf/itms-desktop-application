package com.pink.itms.controller;

import com.pink.itms.dto.login.LoginRequestDTO;
import com.pink.itms.dto.login.LoginResponseDTO;
import com.pink.itms.exception.user.UserNotFoundException;
import com.pink.itms.jwt.JwtTokenProvider;
import com.pink.itms.model.User;
import com.pink.itms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

/**
 * Controller class for handling user authentication.
 */
@RestController
@RequestMapping("/api")
public class LoginController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    /**
     * Constructor for LoginController.
     *
     * @param authenticationManager the AuthenticationManager instance for authentication.
     * @param jwtTokenProvider      the JwtTokenProvider instance for generating JWT tokens.
     */
    public LoginController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    /**
     * Endpoint to authenticate a user.
     *
     * @param loginRequest the DTO containing login credentials.
     * @param response     the HttpServletResponse to set JWT token cookie.
     * @return ResponseEntity containing the response DTO with JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequestDTO loginRequest, HttpServletResponse response) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails user = (UserDetails) authentication.getPrincipal();
        User userD = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new UserNotFoundException("User with username " + loginRequest.getUsername() + " doesn't exist."));

        String jwt = jwtTokenProvider.generateToken(authentication);

        Cookie jwtCookie = new Cookie("cookieJwt", jwt);

        jwtCookie.setHttpOnly(true);
        jwtCookie.setMaxAge(60 * 60 * 24 * 7); // 1 day
        jwtCookie.setPath("/");
        jwtCookie.setSecure(false);
        response.addCookie(jwtCookie);


        return ResponseEntity.ok(new LoginResponseDTO(userD.getId(), jwt, user.getUsername(), user.getAuthorities()));
    }
}
