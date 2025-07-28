package com.example.demo.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
public class Documents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer documentId;

    @Lob
    private byte[] documents;

    @OneToOne(mappedBy = "document")
    @JsonIgnore
    private Campaign campaign;

	public Documents() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Integer getDocumentId() {
		return documentId;
	}



	public void setDocumentId(Integer documentId) {
		this.documentId = documentId;
	}



	public byte[] getDocuments() {
		return documents;
	}

	public void setDocuments(byte[] documents) {
		this.documents = documents;
	}

	public Campaign getCampaign() {
		return campaign;
	}

	public void setCampaign(Campaign campaign) {
		this.campaign = campaign;
	}

    
}
