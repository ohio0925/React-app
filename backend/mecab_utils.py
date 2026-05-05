from fugashi import Tagger
import re

# 初期化（パス指定いらない）
tagger = Tagger()

def mecab_sep(text):
    words_list = []

    for token in tagger(str(text)):
        pos = token.feature.pos1

        if pos in ["名詞", "形容詞", "動詞"]:
            if re.search("[ァ-ン一-龥]", token.surface):

                if pos == "名詞":
                    word = token.surface
                else:
                    word = token.feature.lemma or token.surface

                words_list.append(word)

    return words_list