package in.sb.vink.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "vanish")
public class Vanish {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "vanish_id", unique = true, nullable = false, updatable = false)
	private String vanishId;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String content;

	private String title;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    public enum ContentType {
        TEXT, IMAGE, FILE
    }
    
    @Enumerated(EnumType.STRING)
    @Column(name = "content_type")
    private ContentType contentType = ContentType.TEXT; // Default to TEXT

    @Column(name = "file_url")
    private String fileUrl; 


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getVanishId() {
        return vanishId;
    }
    public void setVanishId(String vanishId) {
        this.vanishId = vanishId;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public ContentType getContentType() {
		return contentType;
	}
	public void setContentType(ContentType contentType) {
		this.contentType = contentType;
	}
	public String getFileUrl() {
		return fileUrl;
	}
	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}
	
	// () runs to set the createdAt time and generate the unique vanishId.
    // Right before a new Vanish object is saved for the first time...
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();

        if (this.vanishId == null) {
            this.vanishId = UUID.randomUUID().toString().substring(0, 8);
        }

    }
}
