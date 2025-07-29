from django import template

register = template.Library()

@register.filter(name='add_class')
def add_class(field, css):
    existing_classes = field.field.widget.attrs.get("class", "")
    combined = f"{existing_classes} {css}".strip()
    return field.as_widget(attrs={"class": combined})
