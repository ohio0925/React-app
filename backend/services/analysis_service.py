from mecab_utils import mecab_sep
from collections import Counter

def analyze_comments(comments):
    docs = []
    all_words = []

    for c in comments:
        words = mecab_sep(c["text"])
        docs.append(words)
        all_words.extend(set(words))

    counter = Counter(all_words)
    ranking = counter.most_common(20)

    return docs, ranking
