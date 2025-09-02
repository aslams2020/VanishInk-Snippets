package in.sb.vink.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

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

import in.sb.vink.model.Vanish;
import in.sb.vink.service.FileUploadService;
import in.sb.vink.service.VanishService;

@RestController
@RequestMapping("/api/vanish")
public class VanishController {

	@Autowired
	private VanishService vanishService;
	
	@Autowired
    private FileUploadService fileUploadService;

//	@PostMapping
//    public ResponseEntity<VanishResponse> createVanish(@RequestBody VanishRequest vanishRequest) {
//
//        Vanish vanish = new Vanish();
//        vanish.setContent(vanishRequest.getContent());
//        vanish.setTitle(vanishRequest.getTitle());
//
//        if (vanishRequest.getExpiryTime() != null) {
//            vanish.setExpiresAt(calculateExpiryTime(vanishRequest.getExpiryTime()));
//        }
//
//        Vanish savedVanish = vanishService.createVanish(vanish);
////        VanishResponse response = new VanishResponse("http://localhost:8080/api/vanish/" + savedVanish.getVanishId());
//        VanishResponse response = new VanishResponse(savedVanish.getVanishId());
//        return new ResponseEntity<>(response, HttpStatus.CREATED);
//    }
	
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VanishResponse> createVanish(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "content", required = false) String textContent,
            @RequestParam(value = "expiryTime", required = false) String expiryTime,
            @RequestParam(value = "file", required = false) MultipartFile file) { 

        try {
            Vanish vanish = new Vanish();
            vanish.setTitle(title);

            if (file != null && !file.isEmpty()) {
                // This is a FILE/IMAGE upload
                String fileUrl = fileUploadService.uploadFile(file);
                vanish.setFileUrl(fileUrl);

                
                if (file.getContentType() != null && file.getContentType().startsWith("image/")) {
                    vanish.setContentType(Vanish.ContentType.IMAGE);
                } else {
                    vanish.setContentType(Vanish.ContentType.FILE);
                }
                vanish.setContent(file.getOriginalFilename());

            } else if (textContent != null && !textContent.trim().isEmpty()) {
                // This is TEXT/CODE
                vanish.setContentType(Vanish.ContentType.TEXT);
                vanish.setContent(textContent);
            } else {
                return ResponseEntity.badRequest().body(null);
            }

            // Handle expiration
            if (expiryTime != null) {
                vanish.setExpiresAt(calculateExpiryTime(expiryTime));
            }

            Vanish savedVanish = vanishService.createVanish(vanish);
            VanishResponse response = new VanishResponse(savedVanish.getVanishId()); // Return just the ID
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
	
	
	@GetMapping("/{vanishId}") 
    public ResponseEntity<Vanish> getVanishById(@PathVariable String vanishId) {
       
        Optional<Vanish> vanish = vanishService.getVanishByVanishId(vanishId);

        if (vanish.isPresent()) {
            return new ResponseEntity<>(vanish.get(), HttpStatus.OK);
        } else {
            // If not found, return 404 (NOT FOUND)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

	private LocalDateTime calculateExpiryTime(String expiryTime) {

        LocalDateTime now = LocalDateTime.now();
        switch (expiryTime.toLowerCase()) {
            case "1h":
                return now.plusHours(1);
            case "1d":
                return now.plusDays(1);
            case "1w":
                return now.plusWeeks(1);
            case "never":
            default:
                return null; // 'null' means never expire
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
        private String expiryTime; //"1h", "1d", "1w", "never"

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
    }

}
