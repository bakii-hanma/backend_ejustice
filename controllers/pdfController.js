const { jsPDF } = require('jspdf');
const { JSDOM } = require('jsdom');

const convertHtmlToPdf = async (req, res) => {
    try {
        const { html_content } = req.body;

        if (!html_content) {
            return res.status(400).json({
                message: 'Le contenu HTML est requis',
                error: 'MISSING_HTML_CONTENT'
            });
        }

        // Générer un nom unique pour le document
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `plainte_${timestamp}_${randomString}.pdf`;

        // Nettoyer le HTML des attributs de style Quill
        const cleanHtml = html_content
            .replace(/data-list="[^"]*"/g, '')
            .replace(/class="ql-ui"[^>]*>/g, '>')
            .replace(/contenteditable="false"/g, '')
            .replace(/style="[^"]*"/g, '');

        // Créer un nouveau document PDF
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        // Configurer la police pour le support du français
        doc.setFont('helvetica');

        // Position initiale
        let yPosition = 20;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.width;
        const maxWidth = pageWidth - (2 * margin);

        // Parser le HTML
        const dom = new JSDOM(cleanHtml);
        const document = dom.window.document;
        const elements = document.body.children;

        // Fonction pour traiter le texte
        function processText(text, fontSize = 12, indent = 0) {
            doc.setFontSize(fontSize);
            const lines = doc.splitTextToSize(text.trim(), maxWidth - indent);
            lines.forEach(line => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, margin + indent, yPosition);
                yPosition += fontSize * 0.5;
            });
            yPosition += 5;
        }

        // Traiter chaque élément
        Array.from(elements).forEach(element => {
            switch (element.tagName.toLowerCase()) {
                case 'h1':
                    processText(element.textContent, 24);
                    break;
                case 'h2':
                    processText(element.textContent, 20);
                    break;
                case 'h3':
                    processText(element.textContent, 16);
                    break;
                case 'p':
                    if (element.querySelector('strong')) {
                        doc.setFont('helvetica', 'bold');
                        processText(element.textContent, 12);
                        doc.setFont('helvetica', 'normal');
                    } else {
                        processText(element.textContent, 12);
                    }
                    break;
                case 'ol':
                case 'ul':
                    Array.from(element.children).forEach((li, index) => {
                        const bullet = element.tagName.toLowerCase() === 'ol' ? 
                            `${index + 1}.` : '•';
                        processText(`${bullet} ${li.textContent}`, 12, 10);
                    });
                    break;
            }
        });

        // Obtenir le PDF sous forme de bytes
        const pdfBytes = doc.output();
        
        // Envoyer le PDF avec le nom du fichier dans un objet JSON
        res.json({
            fileName: fileName,
            content: Buffer.from(pdfBytes, 'binary').toString('base64')
        });

    } catch (error) {
        console.error('Erreur lors de la conversion en PDF:', error);
        res.status(500).json({
            message: 'Erreur lors de la conversion en PDF',
            error: 'PDF_CONVERSION_ERROR'
        });
    }
};

module.exports = {
    convertHtmlToPdf
}; 