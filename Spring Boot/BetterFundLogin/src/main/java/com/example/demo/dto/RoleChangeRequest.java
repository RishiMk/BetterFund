package com.example.demo.dto;
public class RoleChangeRequest {
    private Long senderRoleId;      // Role ID of the person trying to change
    private String targetEmail;     // Email of user whose role is to be changed
    private Long newRoleId;         // New role to assign
    
	public Long getSenderRoleId() {
		return senderRoleId;
	}
	public void setSenderRoleId(Long senderRoleId) {
		this.senderRoleId = senderRoleId;
	}
	public String getTargetEmail() {
		return targetEmail;
	}
	public void setTargetEmail(String targetEmail) {
		this.targetEmail = targetEmail;
	}
	public Long getNewRoleId() {
		return newRoleId;
	}
	public void setNewRoleId(Long newRoleId) {
		this.newRoleId = newRoleId;
	}

    
}
