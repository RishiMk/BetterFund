package com.example.demo.dto;

public class UserAuth {
	
	private boolean present;
	private int roleid;
	
	public UserAuth() {}

	public boolean isPresent() {
		return present;
	}

	public void setPresent(boolean present) {
		this.present = present;
	}

	public int getRoleid() {
		return roleid;
	}

	public void setRoleId(int roleid) {
		this.roleid = roleid;
	}
	
}
