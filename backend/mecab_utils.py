import MeCab
import re

# MeCab初期化（1回だけ）
tagger = MeCab.Tagger(
    r'-r "C:\Program Files\MeCab\etc\mecabrc" -d "C:\Program Files\MeCab\dic\ipadic"'
)
tagger.parse("")

def mecab_sep(text):
    node = tagger.parseToNode(str(text))

    words_list = []

    while node:
        features = node.feature.split(",")

        if len(features) > 7:
            pos = features[0]
            base = features[6] if features[6] != "*" else node.surface

            if pos in ["名詞", "形容詞", "動詞"]:
                if re.search("[ァ-ン一-龥]", node.surface):
                    words_list.append(base)

        node = node.next

    return words_list