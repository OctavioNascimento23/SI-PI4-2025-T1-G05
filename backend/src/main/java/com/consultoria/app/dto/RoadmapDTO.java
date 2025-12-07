// Criado por Gabriel dos Santos
package com.consultoria.app.dto;

import java.util.List;

public class RoadmapDTO {
    private Long projectId;
    private String title;
    private String description;
    private List<RoadmapStep> steps;

    public static class RoadmapStep {
        private String title;
        private String description;
        private String estimatedTime;

        public RoadmapStep() {}

        public RoadmapStep(String title, String description, String estimatedTime) {
            this.title = title;
            this.description = description;
            this.estimatedTime = estimatedTime;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getEstimatedTime() {
            return estimatedTime;
        }

        public void setEstimatedTime(String estimatedTime) {
            this.estimatedTime = estimatedTime;
        }
    }

    public RoadmapDTO() {}

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<RoadmapStep> getSteps() {
        return steps;
    }

    public void setSteps(List<RoadmapStep> steps) {
        this.steps = steps;
    }
}
