import sys
import os
import random
from dataclasses import dataclass

# Add current directory to path to enable imports from 'app'
sys.path.append(os.getcwd())

try:
    from app.core.document_parser import parse_file
except ImportError:
    print("LOI: Khong the import document_parser. Hay chac chan ban dang chay script o thu muc 'backend/'.")
    sys.exit(1)

def simulate_grading(docx_path):
    print("="*60)
    print(f"🚀 KHOI DONG KIEM TRA: {docx_path}")
    print("="*60)
    
    if not os.path.exists(docx_path):
        print(f"❌ LOI: Khong tim thay file '{docx_path}'")
        return

    # 1. Parse Document
    print(f"1. Dang boc tach du lieu tu file Word...")
    try:
        questions = parse_file(docx_path)
    except Exception as e:
        print(f"❌ LOI parsing: {e}")
        return
        
    if not questions:
        print("❌ LOI: Khong tim thay cau hoi nao hop le (Cau X: ...)!")
        return

    print(f"✅ Da tim thay: {len(questions)} cau hoi MCQs.")
    
    # 2. Extract Keys and Correct Answers
    print("\n2. Kiem tra danh sach dap an dung (Boi dam/Mau do):")
    valid_questions = []
    for q in questions:
        status = "OK" if q.correct_answer else "THIEU DAP AN"
        print(f"   - Cau {q.number}: {status} (Dap an dung: {q.correct_answer})")
        if q.correct_answer:
            valid_questions.append(q)
            
    total_mcq = len(valid_questions)
    if total_mcq == 0:
        print("❌ LOI: Khong co cau hoi nao co dap anh dung. Hay kiem tra bôi dam/màu đỏ trong file Word.")
        return

    # 3. Simulate Student Submission (All Correct)
    # We use some mock IDs to simulate the shuffle logic
    mock_user_id = 12345
    mock_exam_id = 67890
    seed_val = f"{mock_user_id}_{mock_exam_id}"
    
    student_answers = {}
    print(f"\n3. Mo phong thi sinh (Hat giong shuffle: {seed_val})...")
    
    for i, q in enumerate(valid_questions):
        # SIMULATE WHAT THE STUDENT SEES (Shuffle logic from exams.py)
        # Using q.number as a stable ID for the test script simulation
        q_seed = f"{mock_user_id}_{mock_exam_id}_{q.number}"
        q_rng = random.Random(q_seed)
        
        # Sort items to ensure deterministic shuffle
        items = sorted(q.options.items()) 
        q_rng.shuffle(items)
        
        # Build the map of what student sees (A, B, C, D) back to content
        keys = sorted(q.options.keys())
        src_to_shuffled_key = {}
        
        for idx, (original_key, text) in enumerate(items):
            if idx < len(keys):
                src_to_shuffled_key[original_key] = keys[idx]
        
        # Student marks the CORRECT answer from the shuffled letters they see
        correct_letter_shuffled = src_to_shuffled_key.get(q.correct_answer)
        student_answers[str(i)] = correct_letter_shuffled
    
    print(f"   - Da mo phong xong {len(student_answers)} dap an (Chon dung 100%).")

    # 4. Grading Simulation (The exact same logic as in exams.py)
    print("\n4. Dang chay bo may cham diem...")
    sim_correct_count = 0
    
    for i, q in enumerate(valid_questions):
        ans_value = student_answers.get(str(i)) # Student choice (e.g., 'B')
        
        # Logic to map 'B' back to original 'A'
        # Matching the per-question seed logic
        q_seed = f"{mock_user_id}_{mock_exam_id}_{q.number}"
        q_rng = random.Random(q_seed)
        
        items = sorted(q.options.items())
        q_rng.shuffle(items)
        
        shuffled_to_orig_map = {}
        keys = sorted(q.options.keys())
        for idx, (orig_key, text) in enumerate(items):
            if idx < len(keys):
                shuffled_to_orig_map[keys[idx]] = orig_key
        
        mapped_key = shuffled_to_orig_map.get(str(ans_value))
        
        # Compare
        if mapped_key and str(mapped_key).strip().upper() == str(q.correct_answer).strip().upper():
            sim_correct_count += 1
        else:
            print(f"   ⚠️ LOI CHAM DIEM tai Cau {q.number}: Thí sinh chon {ans_value}, Map ve {mapped_key}, Nhung DB la {q.correct_answer}")

    # 5. Final Result
    final_score = round((sim_correct_count / total_mcq) * 10, 2)
    print("\n" + "="*60)
    print(f"📊 KET QUA CUOI CUNG")
    print(f"   - So cau dung: {sim_correct_count}/{total_mcq}")
    print(f"   - Diem so: {final_score}/10.0")
    
    if final_score == 10.0:
        print("\n✅ CHUC MUNG: Logic cham diem va file Word phoi hop hoan hao!")
        print("   Ket luan: He thong da sẵn sàng cho kỳ thi real-world.")
    else:
        print("\n❌ CANH BAO: Diem so không dat 10.0 mac du thi sinh da chon dung.")
        print("   Hay kiem tra lai logic map và shuffle.")
    print("="*60)

if __name__ == "__main__":
    # Check current directory for the file
    target_file = "FDB Talent - Round 1 - SV.docx"
    simulate_grading(target_file)
