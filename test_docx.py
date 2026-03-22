import sys
import os
sys.path.insert(0, r"e:\FDBTalent\online-exam\backend")
from app.core.document_parser import parse_file

def test():
    try:
        res = parse_file(r"e:\FDBTalent\online-exam\tmp_import_test.docx")
        print("Success. Parsed questions:", len(res))
        if res:
            print("Sample question:", res[0])
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
