// Criado por Octavio Nascimento
package com.consultoria.app.service;

import com.consultoria.app.dto.RoadmapDTO;
import com.consultoria.app.model.Project;
import com.consultoria.app.model.Roadmap;
import com.consultoria.app.model.User;
import com.consultoria.app.repository.ProjectRepository;
import com.consultoria.app.repository.RoadmapRepository;
import com.consultoria.app.repository.UserRepository;
import com.google.gson.Gson;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    @Autowired
    private RoadmapRepository roadmapRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Gson gson = new Gson();

    /**
     * Gera PDF do roadmap em memória
     */
    public byte[] generateRoadmapPdf(RoadmapDTO roadmap) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Cores personalizadas
            DeviceRgb primaryColor = new DeviceRgb(59, 130, 246); // Blue-500
            DeviceRgb darkColor = new DeviceRgb(31, 41, 55); // Gray-800

            // Título principal
            Paragraph title = new Paragraph(roadmap.getTitle())
                    .setFontSize(24)
                    .setBold()
                    .setFontColor(primaryColor)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10);
            document.add(title);

            // Data de geração
            String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
            Paragraph date = new Paragraph("Gerado em: " + dateStr)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(date);

            // Descrição
            if (roadmap.getDescription() != null && !roadmap.getDescription().isEmpty()) {
                Paragraph description = new Paragraph(roadmap.getDescription())
                        .setFontSize(12)
                        .setMarginBottom(20);
                document.add(description);
            }

            // Linha separadora
            document.add(new Paragraph("\n"));

            // Etapas do Roadmap
            Paragraph stepsHeader = new Paragraph("Etapas do Projeto")
                    .setFontSize(18)
                    .setBold()
                    .setFontColor(darkColor)
                    .setMarginBottom(15);
            document.add(stepsHeader);

            int stepNumber = 1;
            for (RoadmapDTO.RoadmapStep step : roadmap.getSteps()) {
                // Número da etapa
                Paragraph stepTitle = new Paragraph()
                        .add(new Text("Etapa " + stepNumber + ": ")
                                .setFontSize(14)
                                .setBold()
                                .setFontColor(primaryColor))
                        .add(new Text(step.getTitle())
                                .setFontSize(14)
                                .setBold())
                        .setMarginTop(15)
                        .setMarginBottom(5);
                document.add(stepTitle);

                // Descrição da etapa
                Paragraph stepDesc = new Paragraph(step.getDescription())
                        .setFontSize(11)
                        .setMarginBottom(5);
                document.add(stepDesc);

                // Tempo estimado
                if (step.getEstimatedTime() != null && !step.getEstimatedTime().isEmpty()) {
                    Paragraph stepTime = new Paragraph()
                            .add(new Text("⏱ Tempo estimado: ")
                                    .setFontSize(10)
                                    .setFontColor(ColorConstants.GRAY))
                            .add(new Text(step.getEstimatedTime())
                                    .setFontSize(10)
                                    .setBold()
                                    .setFontColor(primaryColor))
                            .setMarginBottom(10);
                    document.add(stepTime);
                }

                stepNumber++;
            }

            // Rodapé
            document.add(new Paragraph("\n\n"));
            Paragraph footer = new Paragraph("Este roadmap foi criado especialmente para você pela plataforma de Consultoria.")
                    .setFontSize(9)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setItalic();
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF do roadmap: " + e.getMessage(), e);
        }
    }

    /**
     * Cria e salva roadmap no banco de dados
     */
    public Roadmap createRoadmap(Long projectId, Long userId, RoadmapDTO roadmapDTO) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        byte[] pdfContent = generateRoadmapPdf(roadmapDTO);
        String stepsJson = gson.toJson(roadmapDTO.getSteps());

        Roadmap roadmap = new Roadmap();
        roadmap.setProject(project);
        roadmap.setCreatedBy(user);
        roadmap.setTitle(roadmapDTO.getTitle());
        roadmap.setDescription(roadmapDTO.getDescription());
        roadmap.setPdfContent(pdfContent);
        roadmap.setPdfFilename("roadmap_" + projectId + "_" + System.currentTimeMillis() + ".pdf");
        roadmap.setStepsJson(stepsJson);

        return roadmapRepository.save(roadmap);
    }

    /**
     * Obtém roadmap por ID
     */
    public Roadmap getRoadmapById(Long roadmapId) {
        return roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new RuntimeException("Roadmap não encontrado"));
    }

    /**
     * Obtém todos os roadmaps de um projeto
     */
    public List<Roadmap> getRoadmapsByProject(Long projectId) {
        return roadmapRepository.findByProjectId(projectId);
    }

    /**
     * Obtém todos os roadmaps criados por um usuário
     */
    public List<Roadmap> getRoadmapsByUser(Long userId) {
        return roadmapRepository.findByCreatedById(userId);
    }

    /**
     * Retorna o PDF do roadmap
     */
    public byte[] getRoadmapPdf(Long roadmapId) {
        Roadmap roadmap = getRoadmapById(roadmapId);
        return roadmap.getPdfContent();
    }

    /**
     * Deleta um roadmap
     */
    public void deleteRoadmap(Long roadmapId) {
        roadmapRepository.deleteById(roadmapId);
    }

    /**
     * Atualiza roadmap
     */
    public Roadmap updateRoadmap(Long roadmapId, RoadmapDTO roadmapDTO) {
        Roadmap roadmap = getRoadmapById(roadmapId);
        
        roadmap.setTitle(roadmapDTO.getTitle());
        roadmap.setDescription(roadmapDTO.getDescription());
        roadmap.setStepsJson(gson.toJson(roadmapDTO.getSteps()));
        roadmap.setPdfContent(generateRoadmapPdf(roadmapDTO));

        return roadmapRepository.save(roadmap);
    }
}
