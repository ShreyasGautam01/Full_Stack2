package com.fullstacktest.notelink.dto;

import com.fullstacktest.notelink.entity.Relationship;
import lombok.Getter;

@Getter
public class RelationshipResponse {

    private final Long   id;
    private final Long   sourceNoteId;
    private final String sourceNoteTitle;
    private final Long   targetNoteId;
    private final String targetNoteTitle;
    private final String type;

    public RelationshipResponse(Relationship r) {
        this.id              = r.getId();
        this.sourceNoteId    = r.getSourceNote().getId();
        this.sourceNoteTitle = r.getSourceNote().getTitle();
        this.targetNoteId    = r.getTargetNote().getId();
        this.targetNoteTitle = r.getTargetNote().getTitle();
        this.type            = r.getType();
    }
}