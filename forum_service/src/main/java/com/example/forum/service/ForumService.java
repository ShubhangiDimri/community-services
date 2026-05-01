package com.example.forum.service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.forum.dto.CreatePostRequest;
import com.example.forum.dto.CreateReplyRequest;
import com.example.forum.dto.PostDetailResponse;
import com.example.forum.dto.PostSummaryResponse;
import com.example.forum.dto.ReplyResponse;
import com.example.forum.model.Post;
import com.example.forum.model.Reply;
import com.example.forum.repository.PostRepository;

@Service
public class ForumService {
	private final PostRepository postRepository;

	public ForumService(PostRepository postRepository) {
		this.postRepository = postRepository;
	}

	@Transactional
	public PostDetailResponse createPost(CreatePostRequest request) {
		Post post = new Post();
		post.setId(UUID.randomUUID().toString());
		post.setAuthorName(request.getAuthorName());
		post.setTitle(request.getTitle());
		post.setContent(request.getContent());
		post.setCreatedAt(Instant.now());

		Post saved = postRepository.save(post);
		return toPostDetailResponse(saved);
	}

	@Transactional(readOnly = true)
	public List<PostSummaryResponse> listPosts() {
		return postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
				.stream()
				.map(this::toPostSummaryResponse)
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public PostDetailResponse getPost(String postId) {
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Post not found"));
		return toPostDetailResponse(post);
	}

	@Transactional
	public ReplyResponse addReply(String postId, CreateReplyRequest request) {
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Post not found"));

		Reply reply = new Reply();
		reply.setId(UUID.randomUUID().toString());
		reply.setAuthorName(request.getAuthorName());
		reply.setContent(request.getContent());
		reply.setCreatedAt(Instant.now());
		post.addReply(reply);
		postRepository.save(post);
		return toReplyResponse(reply);
	}

	private PostSummaryResponse toPostSummaryResponse(Post post) {
		PostSummaryResponse response = new PostSummaryResponse();
		response.setId(post.getId());
		response.setAuthorName(post.getAuthorName());
		response.setTitle(post.getTitle());
		response.setCreatedAt(post.getCreatedAt());
		response.setReplyCount(post.getReplies() == null ? 0 : post.getReplies().size());
		return response;
	}

	private PostDetailResponse toPostDetailResponse(Post post) {
		PostDetailResponse response = new PostDetailResponse();
		response.setId(post.getId());
		response.setAuthorName(post.getAuthorName());
		response.setTitle(post.getTitle());
		response.setContent(post.getContent());
		response.setCreatedAt(post.getCreatedAt());
		response.setReplies(post.getReplies() == null ? Collections.emptyList() : post.getReplies().stream()
					.map(this::toReplyResponse)
					.collect(Collectors.toList()));
		return response;
	}

	private ReplyResponse toReplyResponse(Reply reply) {
		ReplyResponse response = new ReplyResponse();
		response.setId(reply.getId());
		response.setAuthorName(reply.getAuthorName());
		response.setContent(reply.getContent());
		response.setCreatedAt(reply.getCreatedAt());
		return response;
	}
}
