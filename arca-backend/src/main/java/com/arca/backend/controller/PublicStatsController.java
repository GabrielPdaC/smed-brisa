package com.arca.backend.controller;

import com.arca.backend.dto.ArticleDTO;
import com.arca.backend.dto.JournalDTO;
import com.arca.backend.dto.VideoDTO;
import com.arca.backend.dto.RepositoryDTO;
import com.arca.backend.service.SchoolService;
import com.arca.backend.service.RepositoryService;
import com.arca.backend.service.JournalService;
import com.arca.backend.service.ArticleService;
import com.arca.backend.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/public")
public class PublicStatsController {
    
    @Autowired
    private SchoolService schoolService;
    
    @Autowired
    private JournalService journalService;
    
    @Autowired
    private ArticleService articleService;
    
    @Autowired
    private VideoService videoService;
    
    @Autowired
    private RepositoryService repositoryService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("schools", schoolService.count());
        stats.put("journals", journalService.count());
        stats.put("articles", articleService.count());
        stats.put("videos", videoService.count());
        stats.put("repositories", repositoryService.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/schools")
    public ResponseEntity<Map<String, Long>> getSchoolsCount() {
        Map<String, Long> response = new HashMap<>();
        response.put("count", schoolService.count());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/journals")
    public ResponseEntity<Map<String, Long>> getJournalsCount() {
        Map<String, Long> response = new HashMap<>();
        response.put("count", journalService.count());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/articles")
    public ResponseEntity<Map<String, Long>> getArticlesCount() {
        Map<String, Long> response = new HashMap<>();
        response.put("count", articleService.count());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/videos")
    public ResponseEntity<Map<String, Long>> getVideosCount() {
        Map<String, Long> response = new HashMap<>();
        response.put("count", videoService.count());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/repositories")
    public ResponseEntity<Map<String, Long>> getRepositoriesCount() {
        Map<String, Long> response = new HashMap<>();
        response.put("count", repositoryService.count());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/videos")
    public ResponseEntity<List<VideoDTO>> getPublicVideos() {
        List<VideoDTO> videos = videoService.findByStatus("APPROVED");
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/journals")
    public ResponseEntity<List<JournalDTO>> getPublicJournals() {
        List<JournalDTO> journals = journalService.findByStatus("OPEN");
        return ResponseEntity.ok(journals);
    }

    @GetMapping("/articles")
    public ResponseEntity<List<ArticleDTO>> getPublicArticles() {
        List<ArticleDTO> articles = articleService.findApprovedArticlesInOpenJournals();
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/repositories")
    public ResponseEntity<List<RepositoryDTO>> getPublicRepositories(@RequestParam(required = false) String type) {
        List<RepositoryDTO> repositories;
        if (type != null && !type.isEmpty()) {
            repositories = repositoryService.findByType(type);
        } else {
            repositories = repositoryService.findAll();
        }
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/journals/{id}")
    public ResponseEntity<JournalDTO> getPublicJournal(@PathVariable Long id) {
        try {
            JournalDTO journal = journalService.findById(id);
            // Apenas permite acesso se estiver OPEN
            if ("OPEN".equals(journal.getStatus())) {
                return ResponseEntity.ok(journal);
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<ArticleDTO> getPublicArticle(@PathVariable Long id) {
        try {
            ArticleDTO article = articleService.findById(id);
            // Verifica se o artigo está aprovado e se a revista está aberta
            if ("APPROVED".equals(article.getStatus())) {
                JournalDTO journal = journalService.findById(article.getJournalId());
                if ("OPEN".equals(journal.getStatus())) {
                    return ResponseEntity.ok(article);
                }
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/videos/{id}")
    public ResponseEntity<VideoDTO> getPublicVideo(@PathVariable Long id) {
        try {
            VideoDTO video = videoService.findById(id);
            // Apenas permite acesso se estiver APPROVED
            if ("APPROVED".equals(video.getStatus())) {
                return ResponseEntity.ok(video);
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/repositories/{id}")
    public ResponseEntity<RepositoryDTO> getPublicRepository(@PathVariable Long id) {
        try {
            RepositoryDTO repository = repositoryService.findById(id);
            return ResponseEntity.ok(repository);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
