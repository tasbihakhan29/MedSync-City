//package com.project.medsync.service.auth;
//
//
//import com.project.medsync.model.Hospital;
//import com.project.medsync.repository.HospitalRepository;
//import com.project.medsync.security.JwtUtil;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//public class AuthService {
//
//    private final HospitalRepository hospitalRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtUtil jwtUtil;
//
//    // Login: returns JWT token if credentials are valid
//    public String login(String hospitalCode, String password) {
//        Optional<Hospital> hospitalOpt = hospitalRepository.findByHospitalCode(hospitalCode);
//        if (hospitalOpt.isEmpty()) throw new RuntimeException("Invalid credentials");
//
//        Hospital hospital = hospitalOpt.get();
//        if (!passwordEncoder.matches(password, hospital.getPassword()))
//            throw new RuntimeException("Invalid credentials");
//
//        return jwtUtil.generateToken(hospital);
//    }
//}
