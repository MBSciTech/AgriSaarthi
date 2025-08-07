import os
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from django.http import HttpResponse

def generate_blog_pdf(blog):
    buffer = io.BytesIO()  # Create in-memory buffer

    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph(f"<b>Blog ID:</b> {blog.id}", styles['Title']))
    story.append(Spacer(1, 12))

    # Author and Tags
    # story.append(Paragraph(f"<b>Author:</b> {blog.author.username}", styles['Normal']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"<b>Tags:</b> {blog.tags or 'N/A'}", styles['Normal']))
    story.append(Spacer(1, 12))

    # Content
    story.append(Paragraph("<b>Content:</b>", styles['Heading2']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(blog.content, styles['Normal']))
    story.append(Spacer(1, 20))

    # Optional image
    if blog.image:
        try:
            image_path = blog.image.path  # assumes ImageField with MEDIA_ROOT
            if os.path.exists(image_path):
                story.append(Paragraph("<b>Image:</b>", styles['Heading2']))
                story.append(Spacer(1, 6))
                img = Image(image_path, width=4*inch, height=3*inch)
                story.append(img)
                story.append(Spacer(1, 12))
        except Exception as e:
            story.append(Paragraph("Error loading image.", styles['Normal']))
            print("PDF image error:", e)

    # Build PDF into memory
    doc.build(story)

    # Get PDF content from buffer
    buffer.seek(0)
    pdf_bytes = buffer.getvalue()
    buffer.close()

    # Return as HTTP response
    response = HttpResponse(pdf_bytes, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="blog_{blog.id}.pdf"'
    return response
