package com.fullstacktest.notelink.dto;

import com.fullstacktest.notelink.entity.NoteImage;
import lombok.Getter;

@Getter
public class ImageResponse {

    private final Long   id;
    private final String fileName;
    private final String url;

    public ImageResponse(NoteImage image) {
        this.id       = image.getId();
        this.fileName = image.getFileName();
        this.url      = "/uploads/" + image.getFileName();
    }
}
