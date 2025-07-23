package com.example.demo.dto;

public class UserResponse {
    private boolean registered;
    private String message;

    public UserResponse(boolean registered, String message) {
        this.registered = registered;
        this.message = message;
    }

	public boolean isRegistered() {
		return registered;
	}

	public void setRegistered(boolean registered) {
		this.registered = registered;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
    
}
