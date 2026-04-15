package com.fullstacktest.notelink.security.jwt;

import com.fullstacktest.notelink.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
public class JwtUtils {

    @Value("${notelink.app.jwtSecret}")
    private String jwtSecret;

    @Value("${notelink.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();
        return Jwts.builder()
                   .subject(principal.getUsername())
                   .issuedAt(new Date())
                   .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                   .signWith(key())
                   .compact();
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
                   .verifyWith(key())
                   .build()
                   .parseSignedClaims(token)
                   .getPayload()
                   .getSubject();
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException e)  { log.error("Invalid JWT token: {}", e.getMessage()); }
        catch (ExpiredJwtException e)      { log.error("JWT token expired: {}", e.getMessage()); }
        catch (UnsupportedJwtException e)  { log.error("Unsupported JWT: {}", e.getMessage()); }
        catch (IllegalArgumentException e) { log.error("Empty JWT claims: {}", e.getMessage()); }
        return false;
    }

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(jwtSecret.getBytes())));
    }
}
