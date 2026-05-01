import google.generativeai as genai

genai.configure(api_key="AIzaSyClmskTYllA8H8f7gInKnZ8U9eDLbCBOf4")

for m in genai.list_models():
    print(m.name)
