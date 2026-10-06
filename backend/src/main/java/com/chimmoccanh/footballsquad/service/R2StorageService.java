package com.chimmoccanh.footballsquad.service;

import com.chimmoccanh.footballsquad.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class R2StorageService {

    private final S3Client s3Client;

    @Value("${app.r2.bucket}")
    private String bucket;

    @Value("${app.r2.public-url}")
    private String publicUrl;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    /**
     * Upload an avatar image to Cloudflare R2 bucket and return the public URL
     */
    public String uploadAvatar(MultipartFile file, UUID userId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Tệp ảnh đại diện không được để trống");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Kích thước tệp vượt quá giới hạn cho phép (tối đa 5MB)");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh JPG, PNG, WEBP hoặc GIF");
        }

        String extension = getFileExtension(file.getOriginalFilename(), contentType);
        String objectKey = "avatars/" + userId + "_" + System.currentTimeMillis() + extension;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String baseUrl = publicUrl.endsWith("/") ? publicUrl.substring(0, publicUrl.length() - 1) : publicUrl;
            String resultUrl = baseUrl + "/" + objectKey;

            log.info("Uploaded avatar successfully to Cloudflare R2: {}", resultUrl);
            return resultUrl;
        } catch (IOException e) {
            log.error("Failed to read input stream for avatar upload: {}", e.getMessage(), e);
            throw new BadRequestException("Không thể đọc dữ liệu tệp hình ảnh: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error uploading to Cloudflare R2: {}", e.getMessage(), e);
            throw new BadRequestException("Không thể tải ảnh lên máy chủ lưu trữ Cloudflare R2: " + e.getMessage());
        }
    }

    /**
     * Delete an existing file from Cloudflare R2
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        try {
            String baseUrl = publicUrl.endsWith("/") ? publicUrl.substring(0, publicUrl.length() - 1) : publicUrl;
            if (fileUrl.startsWith(baseUrl)) {
                String objectKey = fileUrl.substring(baseUrl.length());
                if (objectKey.startsWith("/")) {
                    objectKey = objectKey.substring(1);
                }

                DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(objectKey)
                        .build();

                s3Client.deleteObject(deleteRequest);
                log.info("Deleted object from Cloudflare R2: {}", objectKey);
            }
        } catch (Exception e) {
            log.warn("Could not delete file from Cloudflare R2: {}", e.getMessage());
        }
    }

    private String getFileExtension(String filename, String contentType) {
        if (filename != null && filename.contains(".")) {
            String ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
            if (ext.length() <= 5) {
                return ext;
            }
        }

        return switch (contentType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }
}
