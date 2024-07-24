package com.pink.itms.controller;

import com.pink.itms.dto.login.LoginRequestDTO;
import com.pink.itms.dto.login.LoginResponseDTO;
import com.pink.itms.jwt.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.Cookie;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

public class LoginControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private LoginController loginController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void authenticateUser_ReturnsJwtInCookieAndResponse() {
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setUsername("user");
        loginRequest.setPassword("password");

        String jwt = "jwt-token";

        Authentication authentication = org.mockito.Mockito.mock(Authentication.class);
        when(authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())))
                .thenReturn(authentication);

        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("user");

        when(jwtTokenProvider.generateToken(authentication)).thenReturn(jwt);

        MockHttpServletResponse response = new MockHttpServletResponse();

        ResponseEntity<?> result = loginController.authenticateUser(loginRequest, response);

        assertThat(result.getStatusCodeValue()).isEqualTo(200);
        assertThat(result.getBody()).isInstanceOf(LoginResponseDTO.class);
        assertThat(((LoginResponseDTO) result.getBody()).getAccessToken()).isEqualTo(jwt);

        assertThat(response.getCookies()).isNotEmpty();
        Cookie jwtCookie = response.getCookie("cookieJwt");
        assertThat(jwtCookie).isNotNull();
        assertThat(jwtCookie.getValue()).isEqualTo(jwt);
        assertThat(jwtCookie.isHttpOnly()).isTrue();
        assertThat(jwtCookie.getMaxAge()).isEqualTo(60 * 60 * 24 * 7);
        assertThat(jwtCookie.getPath()).isEqualTo("/");
        assertThat(jwtCookie.getSecure()).isFalse();
    }
}