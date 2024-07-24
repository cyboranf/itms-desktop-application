package com.pink.itms.jwt;

import com.pink.itms.config.security.UserDetailsServiceImpl;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecretStr;
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private SecretKey jwtSecret;

    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    public JwtTokenProvider(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        Set<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .setIssuedAt(now).setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("cookieJWT".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;

    }

    @PostConstruct
    protected void init() {
        byte [] decodedKey = Base64.getDecoder().decode(jwtSecretStr.getBytes(StandardCharsets.UTF_8));
        jwtSecret = new SecretKeySpec(decodedKey, 0, decodedKey.length, "HmacSHA512");
    }

    public String getUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(jwtSecret).build().parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(jwtSecret).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException | UnsupportedJwtException | IllegalArgumentException | ExpiredJwtException e) {
            return false;
        }
    }

    public Authentication getAuthentication(String token) {
          Claims claims = Jwts.parserBuilder()
                  .setSigningKey(jwtSecret)
                  .build()
                  .parseClaimsJws(token)
                  .getBody();

        Collection<? extends GrantedAuthority> authorities = ((List<String>) claims.get("roles")).stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        UserDetails userDetails = userDetailsService.loadUserByUsername(claims.getSubject());


        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }
}