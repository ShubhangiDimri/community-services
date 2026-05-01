package com.example.forum.dto;

import java.time.Instant;
import java.util.List;

public class PostDetailResponse {
	private String id;
	private String authorName;
	private String title;
	private String content;
	private Instant createdAt;
	private List<ReplyResponse> replies;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getAuthorName() {
		return authorName;
	}

	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}

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

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public List<ReplyResponse> getReplies() {
		return replies;
	}

	public void setReplies(List<ReplyResponse> replies) {
		this.replies = replies;
	}
}
