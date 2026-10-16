import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
    ListFlowable,
    ListItem
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "VITALIS // Machine Learning Lab Examination — Teacher Demonstration Guide")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 45, letter[0] - 54, 45)
        self.drawString(54, 32, "Confidential — Academic Lab Defense & Viva Script | Kaggle Sleep Health Dataset")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 32, page_str)
        self.restoreState()


def build_pdf(filename="VITALIS_Teacher_Demonstration_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary = colors.HexColor("#1A365D")
    accent = colors.HexColor("#2B6CB0")
    dark = colors.HexColor("#2D3748")
    bg_light = colors.HexColor("#F7FAFC")
    border_color = colors.HexColor("#CBD5E0")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=primary,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#4A5568"),
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=accent,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=dark,
        spaceAfter=5
    )

    bold_body = ParagraphStyle(
        'BoldBodyCustom',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#2C5282")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1 # Center
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=dark
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=dark
    )

    q_style = ParagraphStyle(
        'QStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#9B2C2C"),
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    a_style = ParagraphStyle(
        'AStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1A202C"),
        spaceAfter=6
    )

    elements = []

    # Title & Banner
    elements.append(Paragraph("VITALIS // Machine Learning Lab Demonstration", title_style))
    elements.append(Paragraph("Complete Teacher Presentation Script, Scientific Results & Academic Viva Defense Guide", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=primary, spaceAfter=10))

    # Meta Overview Box
    meta_data = [
        [
            Paragraph("<b>Project:</b> VITALIS Multi-Class Sleep Disorder Classifier", body_style),
            Paragraph("<b>Dataset:</b> Kaggle Sleep Health & Lifestyle (374 Verified Patients)", body_style)
        ],
        [
            Paragraph("<b>Target Classes:</b> None (Healthy), Insomnia, Sleep Apnea", body_style),
            Paragraph("<b>Models Compared:</b> Logistic Reg. vs Random Forest vs Naive Bayes", body_style)
        ],
        [
            Paragraph("<b>Holdout Protocol:</b> 80/20 Stratified Split (299 Train / 75 Test)", body_style),
            Paragraph("<b>Winning Model:</b> Logistic Regression (Holdout Macro-F1: <b>0.908</b>)", body_style)
        ]
    ]
    t_meta = Table(meta_data, colWidths=[250, 254])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EDF2F7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_meta)
    elements.append(Spacer(1, 10))

    # ─────────────────────────────────────────────────────────────
    # PART 1: EXACT STEP-BY-STEP TEACHER PRESENTATION SCRIPT
    # ─────────────────────────────────────────────────────────────
    elements.append(Paragraph("Part 1: The 4-Minute Live Demonstration Walkthrough", h1_style))
    elements.append(Paragraph("Follow this exact 4-step sequence when presenting the screen to your teacher:", body_style))

    # Step 1
    elements.append(Paragraph("Step 1: The 30-Second Elevator Pitch (Start on the Hero Screen)", h2_style))
    p1 = (
        "<b>What to say to your teacher:</b><br/>"
        "<i>'Good morning, Professor. Our lab project is <b>VITALIS</b>, an end-to-end Machine Learning system "
        "for automated screening and classification of sleep disorders. Using 374 real clinical patient cohorts from Kaggle, "
        "we trained and benchmarked three distinct algorithms—Logistic Regression, Random Forest, and Gaussian Naive Bayes—to "
        "classify patients into three categories: <b>None (Healthy)</b>, <b>Insomnia</b>, and <b>Sleep Apnea</b>, based on 12 physiological "
        "and lifestyle biometrics.'</i>"
    )
    elements.append(Paragraph(p1, body_style))

    # Step 2
    elements.append(Paragraph("Step 2: Show the Dataset & Exploratory Analysis (Scroll to '#dataset')", h2_style))
    p2 = (
        "<b>What to point out on screen:</b><br/>"
        "• <b>Class Imbalance:</b> Point to the class distribution bars: <i>None</i> has 219 rows (58.6%), while <i>Sleep Apnea</i> has 78 (20.9%) and <i>Insomnia</i> has 77 (20.6%). Explain that this is why <b>Macro-F1</b> was chosen over raw accuracy.<br/>"
        "• <b>Biometric Distributions:</b> Highlight the histograms for Blood Pressure, Sleep Duration, and Stress Level.<br/>"
        "• <b>Key Insight:</b> <i>'We observed that patients with Sleep Apnea present significantly elevated Systolic/Diastolic blood pressure (often >140/90) and higher BMI, whereas Insomnia is strongly associated with high stress indices and shortened sleep duration.'</i>"
    )
    elements.append(Paragraph(p2, body_style))

    # Step 3
    elements.append(Paragraph("Step 3: Show the Model Benchmark & Holdout Metrics (Scroll to '#study')", h2_style))
    p3 = (
        "<b>What to explain to your teacher:</b><br/>"
        "• <b>Comparison Table:</b> Show that all three algorithms were trained on the exact same 80/20 stratified holdout split (299 train, 75 test) with 5-fold cross-validation.<br/>"
        "• <b>The Winner:</b> Point out that <b>Logistic Regression won with a Macro-F1 of 0.908 and 93.3% accuracy</b>, outperforming Random Forest (0.880 F1) and Naive Bayes (0.877 F1).<br/>"
        "• <b>Confusion Matrix:</b> Point to the 3x3 matrix showing 42/44 correct for None, 12/15 for Insomnia, and a perfect 16/16 (100% recall) for Sleep Apnea.<br/>"
        "• <b>Training & Loss Curves:</b> Show the SGD log-loss convergence curve and the Random Forest Out-of-Bag (OOB) error curve.<br/>"
        "• <b>Feature Importances:</b> Highlight that <b>Systolic Blood Pressure (15.5%)</b>, <b>Diastolic BP (12.7%)</b>, and <b>Sleep Duration (10.2%)</b> are the top predictive features."
    )
    elements.append(Paragraph(p3, body_style))

    # Step 4
    elements.append(Paragraph("Step 4: Live Telemetry Prediction Console (Scroll to '#telemetry')", h2_style))
    p4 = (
        "<b>Interactive actions to demonstrate:</b><br/>"
        "1. Click the preset <b>'None'</b>: Show that all three models agree on <i>None</i> with ~88-96% confidence (Consensus: Agreement).<br/>"
        "2. Click the preset <b>'Insomnia'</b>: Point out the shift to <i>Insomnia</i>, driven by high stress (8/10) and low sleep (6.5h).<br/>"
        "3. Click the preset <b>'Sleep Apnea'</b>: Show how high blood pressure (140/95) and overweight BMI trigger <i>Sleep Apnea</i>.<br/>"
        "4. <b>Fidget with sliders live:</b> Move Blood Pressure from 120/80 up to 145/95 and watch the Sleep Apnea probability bar climb in real time directly from the Scikit-Learn inference backend!"
    )
    elements.append(Paragraph(p4, body_style))
    elements.append(Spacer(1, 10))

    # ─────────────────────────────────────────────────────────────
    # PART 2: SCIENTIFIC RESULTS & EVALUATION METRICS
    # ─────────────────────────────────────────────────────────────
    elements.append(Paragraph("Part 2: Verified Model Evaluation Results", h1_style))
    elements.append(Paragraph("The exact metrics computed from our stratified 80/20 holdout split (75 test samples):", body_style))

    # Comparison Table
    comp_headers = [
        Paragraph("<b>Model Name</b>", table_header_style),
        Paragraph("<b>Test Accuracy</b>", table_header_style),
        Paragraph("<b>Holdout Macro-F1</b>", table_header_style),
        Paragraph("<b>5-Fold CV Macro-F1</b>", table_header_style),
        Paragraph("<b>Train Macro-F1</b>", table_header_style),
        Paragraph("<b>Status</b>", table_header_style),
    ]
    comp_rows = [
        comp_headers,
        [
            Paragraph("<b>Logistic Regression</b> (L2, C=1.0)", table_cell_bold),
            Paragraph("<b>93.33%</b>", table_cell_style),
            Paragraph("<b>0.9076</b>", table_cell_bold),
            Paragraph("0.8820 ± 0.046", table_cell_style),
            Paragraph("0.8923", table_cell_style),
            Paragraph("<font color='#22543D'><b>★ Winner</b></font>", table_cell_style),
        ],
        [
            Paragraph("<b>Random Forest</b> (100 Trees, OOB)", table_cell_style),
            Paragraph("92.00%", table_cell_style),
            Paragraph("0.8799", table_cell_style),
            Paragraph("0.8515 ± 0.026", table_cell_style),
            Paragraph("0.9141", table_cell_style),
            Paragraph("Benchmark", table_cell_style),
        ],
        [
            Paragraph("<b>Gaussian Naive Bayes</b>", table_cell_style),
            Paragraph("89.33%", table_cell_style),
            Paragraph("0.8768", table_cell_style),
            Paragraph("0.8514 ± 0.052", table_cell_style),
            Paragraph("0.8587", table_cell_style),
            Paragraph("Baseline", table_cell_style),
        ],
    ]
    t_comp = Table(comp_rows, colWidths=[140, 70, 75, 95, 70, 54])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
    ]))
    elements.append(t_comp)
    elements.append(Spacer(1, 8))

    # Per-Class Metrics Table for Winning Model
    elements.append(Paragraph("Class-by-Class Breakdown (Winning Logistic Regression Model):", h2_style))
    per_class_headers = [
        Paragraph("<b>Class Label</b>", table_header_style),
        Paragraph("<b>Support (Test Count)</b>", table_header_style),
        Paragraph("<b>Precision</b>", table_header_style),
        Paragraph("<b>Recall (Sensitivity)</b>", table_header_style),
        Paragraph("<b>F1-Score</b>", table_header_style),
        Paragraph("<b>Clinical Interpretation</b>", table_header_style),
    ]
    per_class_rows = [
        per_class_headers,
        [
            Paragraph("<b>None (Healthy)</b>", table_cell_bold),
            Paragraph("44 samples", table_cell_style),
            Paragraph("1.0000 (100%)", table_cell_style),
            Paragraph("0.9545 (95.5%)", table_cell_style),
            Paragraph("0.9767", table_cell_bold),
            Paragraph("Zero false positives; healthy cohorts screened cleanly", table_cell_style),
        ],
        [
            Paragraph("<b>Insomnia</b>", table_cell_bold),
            Paragraph("15 samples", table_cell_style),
            Paragraph("0.9231 (92.3%)", table_cell_style),
            Paragraph("0.8000 (80.0%)", table_cell_style),
            Paragraph("0.8571", table_cell_bold),
            Paragraph("Strong precision; 12/15 correctly identified", table_cell_style),
        ],
        [
            Paragraph("<b>Sleep Apnea</b>", table_cell_bold),
            Paragraph("16 samples", table_cell_style),
            Paragraph("0.8000 (80.0%)", table_cell_style),
            Paragraph("<b>1.0000 (100%)</b>", table_cell_bold),
            Paragraph("0.8889", table_cell_bold),
            Paragraph("Perfect recall; 0 missed apnea cases (critical for triage)", table_cell_style),
        ],
    ]
    t_pc = Table(per_class_rows, colWidths=[95, 75, 65, 75, 55, 139])
    t_pc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), accent),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('ALIGN', (1,0), (4,-1), 'CENTER'),
    ]))
    elements.append(t_pc)
    elements.append(Spacer(1, 8))

    # Feature Importance Table
    elements.append(Paragraph("Top Feature Importances (Random Forest Gini Impurity Reduction):", h2_style))
    feat_data = [
        [Paragraph("<b>Rank & Feature</b>", table_header_style), Paragraph("<b>Gini Importance</b>", table_header_style), Paragraph("<b>Physiological Rationale</b>", table_header_style)],
        [Paragraph("1. <b>Systolic Blood Pressure</b>", table_cell_style), Paragraph("<b>15.52%</b>", table_cell_bold), Paragraph("Vascular resistance and nocturnal sympathetic surges in obstructive sleep apnea", table_cell_style)],
        [Paragraph("2. <b>Diastolic Blood Pressure</b>", table_cell_style), Paragraph("<b>12.73%</b>", table_cell_bold), Paragraph("Persistent arterial load strongly correlated with sleep breathing disruption", table_cell_style)],
        [Paragraph("3. <b>Sleep Duration (Hours)</b>", table_cell_style), Paragraph("<b>10.22%</b>", table_cell_bold), Paragraph("Direct marker of sleep maintenance and sleep onset latency deficiency", table_cell_style)],
        [Paragraph("4. <b>Age</b>", table_cell_style), Paragraph("<b>9.24%</b>", table_cell_bold), Paragraph("Upper airway compliance loss and circadian shift with advancing age", table_cell_style)],
        [Paragraph("5. <b>BMI Category: Overweight</b>", table_cell_style), Paragraph("<b>8.80%</b>", table_cell_bold), Paragraph("Cervical adiposity narrowing the pharyngeal airway lumen", table_cell_style)],
        [Paragraph("6. <b>Physical Activity (Mins)</b>", table_cell_style), Paragraph("<b>7.51%</b>", table_cell_bold), Paragraph("Aerobic conditioning improves parasympathetic vagal tone", table_cell_style)],
    ]
    t_feat = Table(feat_data, colWidths=[150, 75, 279])
    t_feat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ]))
    elements.append(t_feat)
    elements.append(Spacer(1, 10))

    # ─────────────────────────────────────────────────────────────
    # PART 3: TOP VIVA & TEACHER QUESTIONS (WITH BULLETPROOF ANSWERS)
    # ─────────────────────────────────────────────────────────────
    elements.append(Paragraph("Part 3: Anticipated Teacher Viva Questions & Academic Answers", h1_style))
    elements.append(Paragraph("Study these 6 questions carefully. They represent 95% of questions professors ask during ML lab exams:", body_style))

    viva_qa = [
        (
            "Q1. Why did you choose Macro-F1 instead of Accuracy as your primary evaluation metric?",
            "<b>Answer:</b> 'Our dataset exhibits inherent class imbalance: 58.6% of patients belong to the <i>None</i> class, while <i>Insomnia</i> and <i>Sleep Apnea</i> comprise ~20.6% and ~20.9% each. "
            "If a dummy model simply predicted <i>None</i> for every patient, it would achieve 58.6% accuracy while completely failing to detect a single disease case. "
            "Macro-F1 computes the harmonic mean of Precision and Recall for each class independently and averages them unweighted: "
            "<font name='Courier'>Macro-F1 = (F1_None + F1_Insomnia + F1_Apnea) / 3</font>. "
            "This treats rare pathology classes with equal gravity to the dominant healthy class, which is standard clinical ML practice.'"
        ),
        (
            "Q2. Why did Logistic Regression beat Random Forest on this dataset?",
            "<b>Answer:</b> 'For three technical reasons: "
            "(1) <i>Sample size constraint:</i> We have 374 records and 12 features. On structured tabular data with a modest sample size, linear models with L2 regularization (<font name='Courier'>C=1.0</font>) generalize extremely well without memorizing noise. "
            "(2) <i>Overfitting in ensembles:</i> Random Forest achieved a higher training Macro-F1 (0.914) but dropped to 0.880 on the holdout test set, showing mild variance. "
            "(3) <i>Linear physiological separation:</i> The boundaries between healthy sleep, sleep apnea (driven monotonically by blood pressure and BMI), and insomnia (driven by stress and sleep deficit) are predominantly linear hyperplanes, where Logistic Regression with StandardScalar excels.'"
        ),
        (
            "Q3. How did you prevent data leakage during preprocessing?",
            "<b>Answer:</b> 'We utilized Scikit-Learn's <font name='Courier'>Pipeline</font> and <font name='Courier'>ColumnTransformer</font>. "
            "The <font name='Courier'>StandardScaler</font> (fitted on numeric columns) and <font name='Courier'>OneHotEncoder(handle_unknown='ignore')</font> (fitted on categorical columns) "
            "were only fitted on the 299 training samples inside each cross-validation fold, and then strictly transformed on the holdout test samples. "
            "No test set statistics ever leaked into the training pipeline.'"
        ),
        (
            "Q4. Is the prediction instantaneous on the frontend because of hardcoded rules or actual ML?",
            "<b>Answer:</b> 'It is 100% pure Scikit-Learn machine learning. "
            "It is instantaneous (<5 milliseconds) because the serialized pipeline package (<font name='Courier'>vitalis_model.pkl</font>) is pre-loaded into memory (RAM) once when the FastAPI server initializes via <font name='Courier'>@app.on_event(\"startup\")</font>. "
            "When a prediction is requested, computing <font name='Courier'>model.predict(X)</font> on a single row of 12 numbers only requires computing a dot product <font name='Courier'>z = W · X + b</font> and applying the softmax function, which a standard CPU executes in under 0.1 milliseconds.'"
        ),
        (
            "Q5. What is the difference between your training loss curve and the learning curve?",
            "<b>Answer:</b> 'The training loss curve shows epoch-by-epoch minimization of cross-entropy log-loss using Stochastic Gradient Descent (SGD) to verify convergence. "
            "The learning curve, on the other hand, plots training F1 versus 5-fold cross-validation F1 across varying training subset sizes (from 20% to 100% of the dataset). "
            "The narrowing gap between the training score and validation score on our learning curve confirms that our model has low variance and has reached healthy sample saturation.'"
        ),
        (
            "Q6. Can this system be used directly in a hospital as a medical diagnostic device?",
            "<b>Answer:</b> 'No, Professor. VITALIS is designed as an automated <i>screening and risk-stratification instrument</i>, not a diagnostic device. "
            "Gold-standard clinical diagnosis of Sleep Apnea requires overnight in-lab Polysomnography (PSG) measuring the Apnea-Hypopnea Index (AHI). "
            "VITALIS is intended for primary care triage—identifying high-risk individuals from standard vitals (blood pressure, BMI, sleep duration) so they can be prioritized for clinical PSG.'"
        ),
    ]

    for q, a in viva_qa:
        elements.append(Paragraph(q, q_style))
        elements.append(Paragraph(a, a_style))

    elements.append(Spacer(1, 10))

    # ─────────────────────────────────────────────────────────────
    # PART 4: HOW TO RUN & ARCHITECTURE CHEAT SHEET
    # ─────────────────────────────────────────────────────────────
    elements.append(Paragraph("Part 4: System Architecture & Quickstart Commands", h1_style))
    p_arch = (
        "<b>Repository Components:</b><br/>"
        "• <b>Backend (FastAPI):</b> <font name='Courier'>server.py</font> — Exposes <font name='Courier'>/api/predict</font> and <font name='Courier'>/api/lab</font>.<br/>"
        "• <b>ML Pipeline:</b> <font name='Courier'>train_pipeline.py</font> — Trains Logistic Regression, Naive Bayes, and Random Forest on <font name='Courier'>data/sleep_health.csv</font>.<br/>"
        "• <b>Study Data:</b> <font name='Courier'>vitalis_lab.json</font> — Contains all curves, confusion matrices, and benchmark metrics.<br/>"
        "• <b>Frontend (React + Vite):</b> <font name='Courier'>frontend/src/App.jsx</font> — Telemetry dashboard with Recharts visualizer.<br/><br/>"
        "<b>Terminal Startup Commands:</b><br/>"
        "<font name='Courier' color='#1A365D'><b># Terminal 1: Backend Inference Server</b><br/>"
        "python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload<br/><br/>"
        "<b># Terminal 2: Interactive Frontend</b><br/>"
        "cd frontend<br/>"
        "npm run dev</font>"
    )
    elements.append(Paragraph(p_arch, body_style))

    # Build the document
    doc.build(elements, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {os.path.abspath(filename)}")

if __name__ == "__main__":
    out_pdf = "VITALIS_Teacher_Demonstration_Guide.pdf"
    build_pdf(out_pdf)
