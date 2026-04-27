## Women Community Hall Management System

A microservices-based web application built using Spring Boot that helps manage women community halls, bookings, events, and notifications through a modular and scalable architecture.

The system replaces manual processes with a digital platform where users can register, book community halls, participate in events, and receive updates efficiently.

## Project Overview

The application is designed using Microservices Architecture, where each service performs a specific function and runs independently.

Main features include:

User registration and authentication

Community hall booking management

Event creation and participation

Notification and alert system

Each service communicates using REST APIs and is routed through an API Gateway.

## Microservices in the Project
1. User & Safety Service

Handles user registration, login, authentication, and role management.
It also stores user profiles and manages basic safety information.

2. Booking & Payment Service

Manages hall booking operations including availability checking, booking creation, and payment confirmation.

3. Event Service

Allows administrators to create events and users to register for workshops or community activities.

4. Notification Service

Sends notifications related to booking confirmations, event updates, and reminders.

Each microservice runs independently and communicates via REST APIs.

## Technology Stack

Backend: Spring Boot
Architecture: Microservices
Database: MongoDB
API Communication: REST APIs
Build Tool: Maven
IDE: IntelliJ IDEA
Language: Java

## Project Structure
WomenCommunityHall
│
├── user-service
├── booking-service
├── event-service
├── notification-service
├── api-gateway
└── discovery-server

Each service contains its own:

Controller

Service

Repository

Model/Entity

Configuration files

Running the Project
1. Clone the repository
2. 
3. Start MongoDB

Make sure MongoDB is running locally.

3. Run services in the following order

Discovery Server

API Gateway

User Service

Booking Service

Event Service

Notification Service

Each service runs on a different port.

Key Features

Microservices architecture

REST-based communication

Modular and scalable design

Transactional booking workflow

Event participation system

Notification service

Future Enhancements

SOS safety feature

AI-powered assistance

Analytics dashboard

Docker containerization

Message queue integration (Kafka/RabbitMQ)

## Author

Developed as part of a Spring Boot Microservices project for academic purposes.
