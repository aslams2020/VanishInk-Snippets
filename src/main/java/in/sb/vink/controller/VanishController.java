package in.sb.vink.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import in.sb.vink.model.FileMetadata;
import in.sb.vink.model.Vanish;
import in.sb.vink.service.VanishService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/vanish")
public class VanishController {
	
	private static final Logger logger = LoggerFactory.getLogger(VanishController.class);

    @Autowired
    private VanishService vanishService;
    
    @Autowired
    private Cloudinary cloudinary;
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VanishResponse> createVanish(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "expiryTime", required = false, defaultValue = "1h") String expiryTime,
            @RequestParam(value = "isOneTime", required = false, defaultValue = "false") Boolean isOneTime, 
            @RequestParam(value = "file", required = false) MultipartFile[] files) {

        try {
//        	logger.info("Creating new vanish with title: {}", title);
//            logger.info("Files received: {}", files != null ? files.length : 0);
            Vanish vanish = new Vanish();
            vanish.setTitle(title); 
            vanish.setIsOneTime(Boolean.TRUE.equals(isOneTime)); 
            
            LocalDateTime expiryDateTime = calculateExpiryTime(expiryTime);
            vanish.setExpiresAt(expiryDateTime);

            // Handle multiple files
            if (files != null && files.length > 0) {
//                logger.info("Processing {} files", files.length);
                vanish.setContentType(Vanish.ContentType.FILE);
                
                List<FileMetadata> fileMetadataList = new ArrayList<>();
                
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        try {
//                        	logger.info("Uploading file: {} (size: {} bytes)", 
//                                    file.getOriginalFilename(), file.getSize());
                            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                            String fileUrl = (String) uploadResult.get("secure_url");
                            
                            FileMetadata fileMetadata = new FileMetadata();
                            fileMetadata.setOriginalFileName(file.getOriginalFilename());
                            fileMetadata.setFileUrl(fileUrl);
                            fileMetadata.setFileSize(file.getSize());
                            fileMetadata.setFileType(file.getContentType());
                            fileMetadata.setVanish(vanish);
                           
                            fileMetadataList.add(fileMetadata);
                            if (fileMetadataList.size() == 1) {
                                vanish.setFileUrl(fileUrl); 
                                vanish.setContent(file.getOriginalFilename()); 
                            }
                            
                        } catch (IOException e) {
                            logger.error("Error uploading file: {}", file.getOriginalFilename(), e);
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
                        }
                    }
                }
                
                vanish.setFiles(fileMetadataList);
                
            } else if (content != null && !content.trim().isEmpty()) {
//            	logger.info("Processing text content");
                vanish.setContentType(Vanish.ContentType.TEXT);
                vanish.setContent(content);
            } else {
                // bad request if neither content nor files 
//            	logger.info("Processing text content");
//                return ResponseEntity.badRequest().body(null);
            	vanish.setContentType(Vanish.ContentType.TEXT);
                vanish.setContent("");
            }

//            logger.info("Saving vanish to database");
            Vanish savedVanish = vanishService.createVanish(vanish);
//            logger.info("Vanish created successfully with ID: {}", savedVanish.getVanishId());
            
            VanishResponse response = new VanishResponse(savedVanish.getVanishId());
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
        	logger.error("Error creating vanish", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/{vanishId}")
    public ResponseEntity<?> getVanishById(@PathVariable String vanishId) {
        Optional<Vanish> vanishOpt = vanishService.getVanishByVanishId(vanishId);

        // not found, return 404 (NOT FOUND)
        if (vanishOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Vanish vanish = vanishOpt.get();

        if (vanish.getExpiresAt() != null && vanish.getExpiresAt().isBefore(LocalDateTime.now())) {
            vanishService.deleteVanishById(vanish.getId());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Check if it's a one-time paste
        if (Boolean.TRUE.equals(vanish.getIsOneTime())) {
            try {
                vanishService.deleteVanishById(vanish.getId());
            } catch (Exception e) {
                System.err.println("Error deleting one-time vanish: " + e.getMessage());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("vanishId", vanish.getVanishId());
        response.put("title", vanish.getTitle());
        response.put("content", vanish.getContent());
        response.put("contentType", vanish.getContentType());
        response.put("createdAt", vanish.getCreatedAt());
        response.put("expiresAt", vanish.getExpiresAt());
        response.put("isOneTime", vanish.getIsOneTime());
        
     //  add single file properties if only one file exists
        if (vanish.getContentType() == Vanish.ContentType.FILE || vanish.getContentType() == Vanish.ContentType.IMAGE) {
            if (vanish.getFiles() != null && !vanish.getFiles().isEmpty()) {
                // Add the new files array
                List<Map<String, Object>> filesResponse = new ArrayList<>();
                for (FileMetadata file : vanish.getFiles()) {
                    Map<String, Object> fileInfo = new HashMap<>();
                    fileInfo.put("originalFileName", file.getOriginalFileName());
                    fileInfo.put("fileUrl", file.getFileUrl());
                    fileInfo.put("fileSize", file.getFileSize());
                    fileInfo.put("fileType", file.getFileType());
                    filesResponse.add(fileInfo);
                }
                response.put("files", filesResponse);
                
                FileMetadata firstFile = vanish.getFiles().get(0);
                response.put("fileUrl", firstFile.getFileUrl());
                response.put("originalFileName", firstFile.getOriginalFileName());
            } else {
                if (vanish.getFileUrl() != null) {
                    response.put("fileUrl", vanish.getFileUrl());
                }
            }
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    private LocalDateTime calculateExpiryTime(String expiryTime) {
        
        if ("never".equals(expiryTime)) {
            return null;
        }
        
        LocalDateTime now = LocalDateTime.now();
        
        if (expiryTime.matches("\\d+[mhdw]")) {  // custom format (e.g., "30m", "4h", "2d", "3w")
            int value = Integer.parseInt(expiryTime.substring(0, expiryTime.length() - 1));
            char unit = expiryTime.charAt(expiryTime.length() - 1);
            
            switch (unit) {
                case 'm': return now.plusMinutes(value);
                case 'h': return now.plusHours(value);
                case 'd': return now.plusDays(value);
                case 'w': return now.plusWeeks(value);
                default: return now.plusHours(1); 
            }
        }
        
        // predefined values
        switch (expiryTime) {
            case "1h": return now.plusHours(1);
            case "6h": return now.plusHours(6);
            case "1d": return now.plusDays(1);
            case "1w": return now.plusWeeks(1);
            default: return now.plusHours(1); // Default to 1 hour
        }
    }

    public static class VanishResponse {
        private String url;

        public VanishResponse(String url) {
            this.url = url;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }

    public static class VanishRequest {
        private String title;
        private String content;
        private String expiryTime; //"1h", "1d", "1w", "custom", "never"
        private Boolean isOneTime; 
        
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getExpiryTime() {
            return expiryTime;
        }

        public void setExpiryTime(String expiryTime) {
            this.expiryTime = expiryTime;
        }
        
        public Boolean getIsOneTime() {
            return isOneTime;
        }
        
        public void setIsOneTime(Boolean isOneTime) {
            this.isOneTime = isOneTime;
        }
    }
}