package com.example.forum.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CreatePostRequest {
	@NotBlank(message = "authorName is required")
	@Size(max = 80, message = "authorName must be <= 80 characters")
	private String authorName;

	@NotBlank(message = "title is required")
	@Size(max = 120, message = "title must be <= 120 characters")
	private String title;

	@NotBlank(message = "content is required")
	@Size(max = 5000, message = "content must be <= 5000 characters")
	private String content;

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
}
