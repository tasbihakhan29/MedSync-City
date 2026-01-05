package com.project.medsync.security;


import com.project.medsync.model.Hospital;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret:medsyncsecretkey}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // 24 hours
    private long expirationTime;

    // Generate token for hospital
    public String generateToken(Hospital hospital) {
        return Jwts.builder()
                .setSubject(hospital.getHospitalCode())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    // Extract hospital code from token
    public String extractHospitalCode(String token) {
        return getClaims(token).getSubject();
    }

    // Validate token
    public boolean validateToken(String token, Hospital hospital) {
        String code = extractHospitalCode(token);
        return code.equals(hospital.getHospitalCode()) && !isTokenExpired(token);
    }

    private Claims getClaims(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }
}
