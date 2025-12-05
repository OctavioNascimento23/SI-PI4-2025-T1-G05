package com.consultoria.app.service;

import com.consultoria.app.dto.RoadmapDTO;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class RoadmapService {

    private static final String ROADMAP_DIRECTORY = "data/roadmaps/";

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

    public String saveRoadmapPdf(RoadmapDTO roadmap) {
        try {
            // Cria diretório se não existir
            Path directory = Paths.get(ROADMAP_DIRECTORY);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            // Gera nome único para o arquivo
            String filename = "roadmap_" + roadmap.getProjectId() + "_" + System.currentTimeMillis() + ".pdf";
            Path filePath = directory.resolve(filename);

            // Gera e salva o PDF
            byte[] pdfBytes = generateRoadmapPdf(roadmap);
            try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
                fos.write(pdfBytes);
            }

            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar PDF do roadmap", e);
        }
    }

    public byte[] getRoadmapPdf(String filename) {
        try {
            Path filePath = Paths.get(ROADMAP_DIRECTORY, filename);
            if (!Files.exists(filePath)) {
                throw new RuntimeException("Arquivo não encontrado: " + filename);
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao ler PDF do roadmap", e);
        }
    }
}
