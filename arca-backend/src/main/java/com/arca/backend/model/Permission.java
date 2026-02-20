package com.arca.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "url_api", length = 255)
    private String urlApi;

    @Column(name = "url_client", length = 255)
    private String urlClient;

    public Permission() {
    }

    public Permission(Long id, String name, String description, String urlApi, String urlClient) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.urlApi = urlApi;
        this.urlClient = urlClient;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrlApi() {
        return urlApi;
    }

    public void setUrlApi(String urlApi) {
        this.urlApi = urlApi;
    }

    public String getUrlClient() {
        return urlClient;
    }

    public void setUrlClient(String urlClient) {
        this.urlClient = urlClient;
    }
}
