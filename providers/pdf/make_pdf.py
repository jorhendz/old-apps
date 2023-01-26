from weasyprint import HTML, CSS
from django.template.loader import get_template
from django.http import HttpResponse


HTML('test.html').write_pdf('hej.pdf')


def generate(request):
    html_template = get_template('templates/test.html')
    pdf_file = HTML(string=html_template).write_pdf()
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = 'filename="home_page.pdf"'
    return response
