package com.example.forum.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.forum.model.Post;

public interface PostRepository extends MongoRepository<Post, String> {
}
