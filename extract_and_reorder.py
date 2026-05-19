import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

main_start = content.find('<main>') + len('<main>')
main_end = content.find('</main>')

header_part = content[:main_start]
footer_part = content[main_end:]
main_part = content[main_start:main_end]

# We can regex each section. A section starts with optional HTML comments and then <section and ends with </section>.
# Let's use re.split with a regex that captures the sections.
# Actually, since we know there are no nested <section> tags in the document (based on the view_file),
# we can find all chunks starting possibly with a comment and ending with </section>.
# Let's just find the exact text we want to move.

pattern = r'(?:<!--.*?-->\s*)*<section\b[^>]*>.*?</section>'
sections = re.findall(pattern, main_part, flags=re.DOTALL | re.IGNORECASE)

section_map = {}
for s in sections:
    if 'Veja como são as <span class="highlight">receitas por dentro' in s:
        section_map['A'] = s
    elif 'Ideal pra você que deseja' in s:
        section_map['B'] = s
    elif 'Por que essas receitas são para você' in s:
        section_map['C'] = s
    elif 'Sinta o sabor de um doce de verdade' in s:
        section_map['D'] = s
    elif 'Olha o que você vai conseguir preparar' in s:
        section_map['E'] = s
    elif 'class="bonus-section"' in s:
        section_map['F'] = s
    elif 'Resultados de nossas <span class="highlight">alunas' in s:
        section_map['G'] = s
    elif 'Risco Zero: <span class="highlight">Garantia de 7' in s:
        section_map['H'] = s
    elif 'Seu Acesso Completo' in s:
        section_map['I'] = s
    elif 'Perguntas Frequentes' in s:
        section_map['J'] = s
    else:
        print("Unknown section!")
        print(s[:100])

print("Found sections:", section_map.keys())

new_order = ['E', 'D', 'B', 'C', 'A', 'G', 'F', 'H', 'I', 'J']

new_main = "\n"
for key in new_order:
    if key in section_map:
        new_main += section_map[key] + "\n"
    else:
        print(f"Missing section {key}")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(header_part + new_main + footer_part)
print("Done")
