import pandas as pd

# ===== CONFIG =====
excel_file = "phrases.xlsx"   # Path to your Excel file
output_js_file = "evaluationItems.js"

# Audio folder patterns
model_a_path = "audios/audios_qwen_female/sample_{index:04d}.wav"
model_b_path = "audios/audios_qwen_male/sample_{index:04d}.wav"
model_c_path = "audios/audios_xtts/output_M2_{index:03d}.wav"

# ===== READ EXCEL =====
df = pd.read_excel(excel_file)

# Make sure required column exists
if "phrase" not in df.columns:
    raise ValueError("The Excel file must contain a 'phrase' column.")

# Optional: remove empty phrases
df = df[df["phrase"].notna()].reset_index(drop=True)

# ===== GENERATE JS CONTENT =====
lines = []
lines.append("const evaluationItems = [")

for i, row in enumerate(df.itertuples(index=False), start=1):
    phrase = str(row.phrase).replace("\\", "\\\\").replace('"', '\\"')

    item_id = f"item_{i:03d}"

    # model_a and model_b start at 0000
    ab_index = i - 1

    # model_c starts at 001
    c_index = i

    item_block = f"""  {{
    id: "{item_id}",
    text: "{phrase}",
    audios: [
      {{ modelId: "model_a", file: "{model_a_path.format(index=ab_index)}" }},
      {{ modelId: "model_b", file: "{model_b_path.format(index=ab_index)}" }},
      {{ modelId: "model_c", file: "{model_c_path.format(index=c_index)}" }}
    ]
  }}"""

    if i < len(df):
        item_block += ","

    lines.append(item_block)

lines.append("];")

# ===== WRITE JS FILE =====
with open(output_js_file, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"JS file generated successfully: {output_js_file}")