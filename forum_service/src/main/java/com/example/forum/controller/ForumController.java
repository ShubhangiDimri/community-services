package com.example.forum.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.forum.dto.CreatePostRequest;
import com.example.forum.dto.CreateReplyRequest;
import com.example.forum.dto.PostDetailResponse;
import com.example.forum.dto.PostSummaryResponse;
import com.example.forum.dto.ReplyResponse;
import com.example.forum.service.ForumService;

@RestController
@RequestMapping("/forums")
@Validated
public class ForumController {
	private final ForumService forumService;

	public ForumController(ForumService forumService) {
		this.forumService = forumService;
	}

	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping("/posts")
	public PostDetailResponse createPost(@Valid @RequestBody CreatePostRequest request) {
		return forumService.createPost(request);
	}

	@GetMapping("/posts")
	public List<PostSummaryResponse> listPosts() {
		return forumService.listPosts();
	}

	@GetMapping("/posts/{postId}")
	public PostDetailResponse getPost(@PathVariable String postId) {
		return forumService.getPost(postId);
	}

	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping("/posts/{postId}/replies")
	public ReplyResponse addReply(@PathVariable String postId, @Valid @RequestBody CreateReplyRequest request) {
		return forumService.addReply(postId, request);
	}
}
