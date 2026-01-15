function normalizeQuestionText(text) {
  // ตัดเลขข้อหน้าโจทย์ เช่น "1. ...", "35. ..." หรือ "ข้อที่ 1 ..."
  return text
    .replace(/^\s*ข้อที่\s*\d+\s*[:.]?\s*/u, "")
    .replace(/^\s*\d+\s*[.)]\s*/u, "")
    .trim();
}

function normalizeChoiceText(rawText, totalChoices) {
  // ตัด A. / B. / C. / D. / E. / F. หรือ a) / b) / c) / d) / e) / f) นำหน้า (ครอบคลุมทุกรูปแบบ)
  let text = rawText
    .replace(/^\s*[A-F]\.\s*/u, "")  // A. B. C. D. E. F.
    .replace(/^\s*[a-f]\.\s*/u, "")  // a. b. c. d. e. f.
    .replace(/^\s*[A-F]\)\s*/u, "")  // A) B) C) D) E) F)
    .replace(/^\s*[a-f]\)\s*/u, "")   // a) b) c) d) e) f)
    .replace(/^\s*[A-F]:\s*/u, "")   // A: B: C: D: E: F:
    .replace(/^\s*[a-f]:\s*/u, "")   // a: b: c: d: e: f:
    .replace(/^\s*[A-F]\s+/, "")     // A B C D E F (มีช่องว่าง)
    .replace(/^\s*[a-f]\s+/, "")     // a b c d e f (มีช่องว่าง)
    .trim();

  // แปลงรูปแบบ "ข้อ a และ b", "ข้อ b และ c" เป็น "ถูก 2 ข้อ" / "ถูก 3 ข้อ"
  // รองรับ "ข้อ a และ b และ c" เป็นต้น
  if (/^ข้อ\s*[a-fA-F]/.test(text)) {
    // นับจำนวนตัวอักษร a-f หรือ A-F ที่พบ
    const matches = text.match(/[a-fA-F]/gu);
    if (matches && matches.length >= 2) {
      const count = matches.length;
      return `ถูก ${count} ข้อ`;
    }
  }

  return text;
}

function createTOCQuizForm2() {
  const form = FormApp.create("ข้อสอบจำลองสอบกลางภาค Theory of Computation (ชุด 2)");
  form.setDescription(
    "คำแนะนำ: ข้อสอบนี้เป็นข้อสอบปรนัย 6 ตัวเลือก จำนวน 100 ข้อ โดยเน้นเนื้อหา Finite Automata, Regular Expression และ Regular Language โปรดเลือกคำตอบที่ถูกต้องที่สุดเพียงคำตอบเดียว"
  );
  form.setIsQuiz(true);
  
  // ตั้งค่าให้แสดงคะแนนและเฉลยทันทีหลังส่งคำตอบ
  form.setConfirmationMessage("ขอบคุณที่ทำข้อสอบ! คุณจะเห็นคะแนนและเฉลยทันที");
  form.setShowLinkToRespondAgain(false);
  
  // ตั้งค่า Quiz settings ให้แสดงผลทันที
  // หมายเหตุ: ใน Google Forms Quiz mode จะแสดงคะแนนและเฉลยอัตโนมัติ
  // แต่ต้องตั้งค่าใน Form Settings > Quizzes > "Release grade" = "Immediately after each submission"
  // และ "Respondents can see" = "Missed questions, Correct answers, and Point values"

  const questions = [
    // ===== ส่วนที่ 1: Regular Expression และ Regular Language (ข้อ 1-35) =====
    {
      q: "1. ให้ Σ = {0,1} ภาษา L = {w | w ขึ้นต้นด้วย 0} มี Regular Expression ที่ถูกต้องคือข้อใด",
      c: [
        "a) 0(0|1)*",
        "b) (0|1)*0",
        "c) 0*1*",
        "d) 1*0*",
        "e) (0|1)*",
        "f) 0+1*"
      ],
      a: 0
    },
    {
      q: "2. Regular Expression (a+b)*a(a+b)* อธิบายภาษาใด",
      c: [
        "a) ภาษาที่มี a อย่างน้อย 1 ตัว",
        "b) ภาษาที่ขึ้นต้นด้วย a",
        "c) ภาษาที่ลงท้ายด้วย a",
        "d) ภาษาที่มี a เพียง 1 ตัว",
        "e) ภาษาที่มี a อย่างน้อย 2 ตัว",
        "f) ภาษาทั้งหมดที่มี a และ b"
      ],
      a: 0
    },
    {
      q: "3. ข้อใดคือ Regular Expression ของภาษา L = {w | w มี a เพียง 2 ตัว} โดย Σ = {a,b}",
      c: [
        "a) (a+b)*aa(a+b)*",
        "b) b*ab*ab*",
        "c) (a|b){2}",
        "d) a{2}(a|b)*",
        "e) b*a{2}b*",
        "f) (b*ab*){2}"
      ],
      a: 1
    },
    {
      q: "4. Empty string มีสัญลักษณ์คือข้อใด",
      c: [
        "a) ∅",
        "b) {}",
        "c) ε หรือ λ",
        "d) Σ",
        "e) 0",
        "f) null"
      ],
      a: 2
    },
    {
      q: "5. ข้อใดถูกต้องเกี่ยวกับ Star Operation (*)",
      c: [
        "a) a* = {a, aa, aaa, ...}",
        "b) a* = {λ, a, aa, aaa, ...}",
        "c) a* = {aa, aaa, aaaa, ...}",
        "d) a* = a+",
        "e) a* ไม่รวม empty string",
        "f) a* = {a}"
      ],
      a: 1
    },
    {
      q: "6. ถ้า L1 = {a, b} และ L2 = {c, d} แล้ว L1 ∘ L2 คือข้อใด",
      c: [
        "a) {a, b, c, d}",
        "b) {ac, ad, bc, bd}",
        "c) {ca, cb, da, db}",
        "d) {abcd}",
        "e) {a, b} ∪ {c, d}",
        "f) ∅"
      ],
      a: 1
    },
    {
      q: "7. Positive Closure (L+) แตกต่างจาก Kleene Star (L*) อย่างไร",
      c: [
        "a) L+ รวม empty string แต่ L* ไม่รวม",
        "b) L+ ไม่รวม empty string แต่ L* รวม",
        "c) L+ = L* - {λ}",
        "d) L+ และ L* เหมือนกัน",
        "e) ข้อ b และ c ถูก",
        "f) ข้อ a และ c ถูก"
      ],
      a: 4
    },
    {
      q: "8. ถ้า w = \"abba\" แล้ว wR (reverse ของ w) คือข้อใด",
      c: [
        "a) abba",
        "b) abab",
        "c) baab",
        "d) bbaa",
        "e) aabb",
        "f) baba"
      ],
      a: 0
    },
    {
      q: "9. ให้ u = \"ab\" และ v = \"cd\" แล้ว |uv| เท่ากับเท่าใด",
      c: [
        "a) 2",
        "b) 3",
        "c) 4",
        "d) 5",
        "e) 6",
        "f) 0"
      ],
      a: 2
    },
    {
      q: "10. ข้อใดเป็น substring ของ \"abcde\"",
      c: [
        "a) ace",
        "b) bcd",
        "c) edc",
        "d) abf",
        "e) ba",
        "f) de"
      ],
      a: 1
    },
    {
      q: "11. Prefix ของ \"hello\" มีกี่ตัว (รวม empty string และตัวเอง)",
      c: [
        "a) 4",
        "b) 5",
        "c) 6",
        "d) 7",
        "e) 10",
        "f) 11"
      ],
      a: 2
    },
    {
      q: "12. Regular Expression (0+1)*00(0+1)* อธิบายภาษาใด",
      c: [
        "a) ภาษาที่มี substring \"00\"",
        "b) ภาษาที่ขึ้นต้นด้วย 00",
        "c) ภาษาที่ลงท้ายด้วย 00",
        "d) ภาษาที่มี 0 อย่างน้อย 2 ตัว",
        "e) ภาษาที่มี 0 เพียง 2 ตัว",
        "f) ภาษาที่ไม่มี substring \"00\""
      ],
      a: 0
    },
    {
      q: "13. ถ้า Σ = {a, b} แล้ว Σ* คืออะไร",
      c: [
        "a) {a, b}",
        "b) {λ, a, b}",
        "c) ภาษาที่มีทุก string ที่เป็นไปได้จาก a และ b",
        "d) {ab, ba}",
        "e) ∅",
        "f) {a*, b*}"
      ],
      a: 2
    },
    {
      q: "14. Regular Expression (ab)* สร้างภาษาใด",
      c: [
        "a) {λ, ab, abab, ababab, ...}",
        "b) {a, b, ab, ba, ...}",
        "c) {ab}",
        "d) {a*, b*}",
        "e) {λ, a, b, aa, bb, ...}",
        "f) {aba, bab, ...}"
      ],
      a: 0
    },
    {
      q: "15. ข้อใดแสดง Regular Expression ของภาษาที่ลงท้ายด้วย \"01\"",
      c: [
        "a) (0+1)*01",
        "b) 01(0+1)*",
        "c) (0+1)01",
        "d) 01*",
        "e) (01)*",
        "f) 0*1"
      ],
      a: 0
    },
    {
      q: "16. ถ้า L = {anb | n ≥ 0} แล้ว Regular Expression ที่ถูกต้องคือ",
      c: [
        "a) a*b",
        "b) ab*",
        "c) (ab)*",
        "d) a+b",
        "e) (a+b)*",
        "f) ba*"
      ],
      a: 0
    },
    {
      q: "17. ความแตกต่างระหว่าง Regular Language (RL) กับ Regular Expression (RE) คือข้อใด",
      c: [
        "a) RL คือภาษา ส่วน RE คือรูปแบบที่ใช้อธิบาย RL",
        "b) RL และ RE คือสิ่งเดียวกัน",
        "c) RE คือภาษา ส่วน RL คือรูปแบบ",
        "d) RL ใช้สัญลักษณ์ | ส่วน RE ใช้ ∪",
        "e) RL เป็น finite language แต่ RE เป็น infinite",
        "f) ไม่มีความแตกต่าง"
      ],
      a: 0
    },
    {
      q: "18. ข้อใดคือ empty language",
      c: [
        "a) ∅",
        "b) {λ}",
        "c) {∅}",
        "d) λ",
        "e) {}",
        "f) ข้อ a และ e"
      ],
      a: 5
    },
    {
      q: "19. ถ้า L1 = {a, ab} และ L2 = {b, ba} แล้ว L1 ∪ L2 คือ",
      c: [
        "a) {a, ab, b, ba}",
        "b) {ab, aba, abb, abba}",
        "c) {a, b}",
        "d) {ab, ba}",
        "e) ∅",
        "f) {aabba}"
      ],
      a: 0
    },
    {
      q: "20. Regular Expression a{3} หมายถึง",
      c: [
        "a) {aaa}",
        "b) {a, aa, aaa}",
        "c) {λ, a, aa, aaa}",
        "d) a*",
        "e) a+",
        "f) {a}{3}"
      ],
      a: 0
    },
    {
      q: "21. ข้อใดไม่ใช่ operation ของ Regular Language",
      c: [
        "a) Union (∪)",
        "b) Concatenation (∘)",
        "c) Star (*)",
        "d) Intersection (∩)",
        "e) Complement",
        "f) Division (÷)"
      ],
      a: 5
    },
    {
      q: "22. ถ้า w = \"abc\" แล้ว w0 คืออะไร",
      c: [
        "a) abc",
        "b) λ",
        "c) ∅",
        "d) {abc}",
        "e) 0",
        "f) undefined"
      ],
      a: 1
    },
    {
      q: "23. Regular Expression (a+bc)* สร้าง string ใดได้บ้าง",
      c: [
        "a) λ, a, bc, aa, abc, bca",
        "b) a, bc เท่านั้น",
        "c) abc, abcabc",
        "d) a*, bc*",
        "e) aaa, bcbcbc",
        "f) ทุกข้อถูก"
      ],
      a: 0
    },
    {
      q: "24. ถ้า Σ = {0,1} ภาษา L = {w | w มี 0 และ 1 สลับกัน} มี RE คือ",
      c: [
        "a) (01)*+(10)*",
        "b) 0*1*",
        "c) (0+1)*",
        "d) (01)+(10)",
        "e) (01)*+(10)*+(01)+(10)",
        "f) (01)|(10)"
      ],
      a: 0
    },
    {
      q: "25. ข้อใดคือ suffix ของ \"computer\"",
      c: [
        "a) com",
        "b) puter",
        "c) put",
        "d) comp",
        "e) ter",
        "f) ข้อ b และ e"
      ],
      a: 5
    },
    {
      q: "26. (a*)* เท่ากับข้อใด",
      c: [
        "a) a*",
        "b) a+",
        "c) (a+)*",
        "d) a",
        "e) λ",
        "f) ข้อ a และ c"
      ],
      a: 0
    },
    {
      q: "27. ถ้า L = {w | w ความยาวเป็นเลขคู่} โดย Σ = {0,1} แล้ว RE คือ",
      c: [
        "a) ((0|1)(0|1))*",
        "b) (0|1)*",
        "c) (00|11)*",
        "d) (01|10)*",
        "e) (0|1){2}*",
        "f) ข้อ a และ e"
      ],
      a: 5
    },
    {
      q: "28. Regular Expression 0(0|1)*1 อธิบายว่า",
      c: [
        "a) ขึ้นต้น 0 ลงท้าย 1",
        "b) มี 0 และ 1 เท่านั้น",
        "c) มีความยาวอย่างน้อย 2",
        "d) ทุก string ที่เป็นไปได้",
        "e) ข้อ a และ c ถูก",
        "f) ข้อ b และ c ถูก"
      ],
      a: 4
    },
    {
      q: "29. ข้อใดเป็นจริงเกี่ยวกับ (a+b)* และ (a*+b*)",
      c: [
        "a) เท่ากัน",
        "b) ต่างกัน เพราะ (a+b)* สามารถสร้าง \"ab\" ได้",
        "c) ต่างกัน เพราะ (a*+b*) ไม่สามารถสร้าง string ที่มี a และ b ปนกันได้",
        "d) เท่ากัน ถ้า a = b",
        "e) ข้อ b และ c ถูก",
        "f) ไม่มีข้อถูก"
      ],
      a: 4
    },
    {
      q: "30. ถ้า L เป็น Regular Language แล้ว LR (reverse) เป็น",
      c: [
        "a) Regular Language เสมอ",
        "b) ไม่เป็น Regular Language",
        "c) Context-free Language",
        "d) ขึ้นอยู่กับ L",
        "e) Regular ก็ต่อเมื่อ L เป็น finite",
        "f) ไม่สามารถบอกได้"
      ],
      a: 0
    },
    {
      q: "31. |λ| เท่ากับเท่าใด",
      c: [
        "a) 0",
        "b) 1",
        "c) ∞",
        "d) undefined",
        "e) λ",
        "f) ∅"
      ],
      a: 0
    },
    {
      q: "32. ถ้า L = {anbn | n ≥ 0} ภาษานี้เป็น Regular Language หรือไม่",
      c: [
        "a) ใช่ เพราะมี pattern ชัดเจน",
        "b) ไม่ใช่ เพราะต้องจำจำนวน a",
        "c) ใช่ เพราะเขียน RE ได้",
        "d) ไม่ใช่ เพราะเป็น Context-Free Language",
        "e) ข้อ b และ d ถูก",
        "f) ข้อ a และ c ถูก"
      ],
      a: 4
    },
    {
      q: "33. Regular Expression ใดตรงกับ string \"aaa\"",
      c: [
        "a) a{3}",
        "b) aaa",
        "c) a+",
        "d) a*",
        "e) (a)*",
        "f) ทุกข้อถูก"
      ],
      a: 5
    },
    {
      q: "34. ถ้า w = \"10110\" และ v = \"01\" แล้ว wv คือ",
      c: [
        "a) 1011001",
        "b) 0110110",
        "c) 10110 01",
        "d) 1101001",
        "e) 011010110",
        "f) 1011101"
      ],
      a: 0
    },
    {
      q: "35. Language L = {w | w ไม่มี substring \"00\"} มี RE คือ",
      c: [
        "a) (1+01)*(0+λ)",
        "b) (0+1)*",
        "c) 1*0*",
        "d) (10)*",
        "e) (1*01)*",
        "f) (01+1)*(λ+0)"
      ],
      a: 0
    },

    // ===== ส่วนที่ 2: Finite Automata - DFA (ข้อ 36-65) =====
    {
      q: "36. DFA ย่อมาจากอะไร",
      c: [
        "a) Deterministic Finite Automaton",
        "b) Direct Finite Automaton",
        "c) Deterministic Function Automaton",
        "d) Detailed Finite Analysis",
        "e) Dynamic Finite Automaton",
        "f) Determined Finite Algorithm"
      ],
      a: 0
    },
    {
      q: "37. ส่วนประกอบของ DFA M = (Q, Σ, δ, q0, F) ที่เป็น start state คือ",
      c: [
        "a) Q",
        "b) Σ",
        "c) δ",
        "d) q0",
        "e) F",
        "f) M"
      ],
      a: 3
    },
    {
      q: "38. จำนวน accept state ใน DFA",
      c: [
        "a) ต้องมีอย่างน้อย 1 state",
        "b) สามารถมี 0 หรือมากกว่าได้",
        "c) ต้องมีเพียง 1 state",
        "d) ต้องเท่ากับจำนวน state ทั้งหมด",
        "e) ขึ้นอยู่กับ alphabet",
        "f) ต้องเป็นเลขคู่"
      ],
      a: 1
    },
    {
      q: "39. Dead State หรือ Trash State คืออะไร",
      c: [
        "a) State ที่ไม่มีทางออก",
        "b) State ที่ไม่ใช่ accept state และทุก transition กลับมาที่ตัวเอง",
        "c) State เริ่มต้น",
        "d) State ที่ถูกลบออก",
        "e) State ที่ไม่มีทางเข้า",
        "f) Accept state"
      ],
      a: 1
    },
    {
      q: "40. ใน DFA จาก state หนึ่งด้วย input หนึ่งตัว สามารถไปได้กี่ state",
      c: [
        "a) 0 หรือ 1",
        "b) เพียง 1 state",
        "c) มากกว่า 1 ได้",
        "d) ไม่จำกัด",
        "e) ขึ้นอยู่กับ alphabet",
        "f) 2 state"
      ],
      a: 1
    },
    {
      q: "41. ถ้า DFA มี 3 states และ Σ = {0,1} จำนวน transition ทั้งหมดคือ",
      c: [
        "a) 3",
        "b) 6",
        "c) 5",
        "d) 9",
        "e) 2",
        "f) 12"
      ],
      a: 1
    },
    {
      q: "42. DFA ที่ accept string \"101\" ต้องมี state อย่างน้อยกี่ state",
      c: [
        "a) 1",
        "b) 2",
        "c) 3",
        "d) 4",
        "e) 5",
        "f) 6"
      ],
      a: 3
    },
    {
      q: "43. δ(q0, 0) = q1 หมายความว่า",
      c: [
        "a) จาก q0 รับ 0 ไปที่ q1",
        "b) จาก q1 รับ 0 ไปที่ q0",
        "c) q0 และ q1 เท่ากับ 0",
        "d) transition function มีค่า 0",
        "e) q0 ไป q1 ด้วย input ใดก็ได้",
        "f) ไม่มีความหมาย"
      ],
      a: 0
    },
    {
      q: "44. ข้อใดเป็นเงื่อนไขของ DFA",
      c: [
        "a) ทุก state ต้องมี transition ครบทุก symbol ใน Σ",
        "b) จาก state หนึ่งด้วย input เดียวกันไปได้หลาย state",
        "c) สามารถมี λ-transition ได้",
        "d) ไม่จำเป็นต้องมี accept state",
        "e) ข้อ a และ d",
        "f) ข้อ b และ c"
      ],
      a: 0
    },
    {
      q: "45. Regular Language L(M) ของ DFA M คือ",
      c: [
        "a) เซตของทุก string ที่ M accept",
        "b) เซตของทุก state ใน M",
        "c) Alphabet ของ M",
        "d) Transition function ของ M",
        "e) Accept state ของ M",
        "f) เซตของทุก string ที่ M reject"
      ],
      a: 0
    },
    {
      q: "46. ถ้า DFA อยู่ที่ accept state แต่ยังมี input เหลือ ผลลัพธ์คือ",
      c: [
        "a) accept",
        "b) reject",
        "c) continue",
        "d) ขึ้นอยู่กับ input ที่เหลือ",
        "e) error",
        "f) undefined"
      ],
      a: 1
    },
    {
      q: "47. Self-loop ใน DFA คืออะไร",
      c: [
        "a) Transition จาก state กลับมาที่ตัวเอง",
        "b) Loop ไม่สิ้นสุด",
        "c) Error state",
        "d) Start state",
        "e) Dead state",
        "f) Accept state loop"
      ],
      a: 0
    },
    {
      q: "48. DFA ที่ accept ภาษา {w | w มีเลข 0 เป็นจำนวนคู่} ต้องมี state อย่างน้อย",
      c: [
        "a) 1",
        "b) 2",
        "c) 3",
        "d) 4",
        "e) 5",
        "f) ไม่จำกัด"
      ],
      a: 1
    },
    {
      q: "49. ข้อใดถูกต้องเกี่ยวกับ DFA",
      c: [
        "a) สามารถวาดได้หลายรูปแบบสำหรับภาษาเดียวกัน",
        "b) มีเพียงรูปแบบเดียวสำหรับแต่ละภาษา",
        "c) ต้องมี dead state เสมอ",
        "d) ไม่สามารถมี self-loop",
        "e) ทุก state ต้องเป็น accept state ได้",
        "f) ต้องมี start state มากกว่า 1"
      ],
      a: 0
    },
    {
      q: "50. ถ้า L1 และ L2 เป็น Regular Language แล้ว L1 ∪ L2 เป็น",
      c: [
        "a) Regular Language",
        "b) Context-free Language",
        "c) ไม่เป็น Regular Language",
        "d) ขึ้นอยู่กับ L1 และ L2",
        "e) Recursive Language",
        "f) ไม่สามารถบอกได้"
      ],
      a: 0
    },
    {
      q: "51. ใน DFA transition table ถ้า state q มี 2 ช่องว่าง แสดงว่า",
      c: [
        "a) ต้องเติม transition ให้ครบ",
        "b) DFA ไม่สมบูรณ์",
        "c) ต้องมี dead state",
        "d) เป็น NFA",
        "e) ข้อ a, b, c ถูก",
        "f) ไม่มีปัญหา"
      ],
      a: 4
    },
    {
      q: "52. DFA สำหรับภาษา L = {λ} มีลักษณะ",
      c: [
        "a) Start state เป็น accept state และไม่มี state อื่น",
        "b) มี 2 states",
        "c) ไม่สามารถสร้างได้",
        "d) ต้องมี dead state",
        "e) Start state ไม่เป็น accept state",
        "f) มี loop"
      ],
      a: 0
    },
    {
      q: "53. ข้อใดเป็นจริงถ้า DFA ยอมรับ string w",
      c: [
        "a) มีเส้นทางจาก start state ไป accept state ที่อ่าน w",
        "b) ทุกเส้นทางต้องไป accept state",
        "c) w ต้องมีความยาวเฉพาะ",
        "d) ต้องผ่าน dead state",
        "e) ต้องผ่านทุก state",
        "f) ไม่มีข้อถูก"
      ],
      a: 0
    },
    {
      q: "54. Minimized DFA คือ",
      c: [
        "a) DFA ที่มีจำนวน state น้อยที่สุดสำหรับภาษานั้น",
        "b) DFA ที่มี transition น้อยที่สุด",
        "c) DFA ที่ไม่มี dead state",
        "d) DFA ที่มี accept state น้อยที่สุด",
        "e) DFA ที่ง่ายที่สุด",
        "f) DFA แบบสั้น"
      ],
      a: 0
    },
    {
      q: "55. ถ้า DFA มี n states และ |Σ| = k จำนวน transition สูงสุดคือ",
      c: [
        "a) n × k",
        "b) n + k",
        "c) n^k",
        "d) k^n",
        "e) n!",
        "f) k!"
      ],
      a: 0
    },
    {
      q: "56. ข้อใดไม่ใช่ข้อดีของ DFA",
      c: [
        "a) Easy to implement",
        "b) Fast execution",
        "c) Deterministic behavior",
        "d) ใช้ memory น้อย",
        "e) สามารถแก้ปัญหาทุกแบบได้",
        "f) มี algorithm ชัดเจน"
      ],
      a: 4
    },
    {
      q: "57. ภาษา L = {0n1n | n ≥ 0} สามารถสร้าง DFA ได้หรือไม่",
      c: [
        "a) ได้",
        "b) ไม่ได้ เพราะต้องนับ",
        "c) ได้ถ้า n มีค่าจำกัด",
        "d) ได้ด้วย infinite states",
        "e) ข้อ b ถูก",
        "f) ข้อ c ถูก"
      ],
      a: 4
    },
    {
      q: "58. Complete DFA คือ",
      c: [
        "a) DFA ที่ทุก state มี transition ครบทุก symbol",
        "b) DFA ที่มี accept state",
        "c) DFA ที่ minimal",
        "d) DFA ที่ใหญ่ที่สุด",
        "e) DFA ที่ไม่มี dead state",
        "f) DFA ปกติ"
      ],
      a: 0
    },
    {
      q: "59. ข้อใดเป็น 5-tuple ที่ถูกต้องของ DFA",
      c: [
        "a) M = (Q, Σ, δ, q0, F)",
        "b) M = (Σ, Q, F, δ, q0)",
        "c) M = (Q, F, Σ, q0, δ)",
        "d) M = (q0, Q, Σ, F, δ)",
        "e) M = (δ, Q, Σ, q0, F)",
        "f) M = (F, Q, Σ, δ, q0)"
      ],
      a: 0
    },
    {
      q: "60. ถ้า L(M1) = L(M2) แสดงว่า",
      c: [
        "a) M1 และ M2 equivalent",
        "b) M1 = M2",
        "c) M1 และ M2 มี state เท่ากัน",
        "d) M1 และ M2 มีโครงสร้างเหมือนกัน",
        "e) M1 copy จาก M2",
        "f) ไม่มีความหมาย"
      ],
      a: 0
    },
    {
      q: "61. Complement of DFA M สร้างได้โดย",
      c: [
        "a) สลับ accept states กับ non-accept states",
        "b) reverse ทุก transition",
        "c) เพิ่ม state ใหม่",
        "d) ลบ accept states",
        "e) เปลี่ยน start state",
        "f) ทำไม่ได้"
      ],
      a: 0
    },
    {
      q: "62. ภาษา L = ∅ มี DFA ที่ยอมรับคือ",
      c: [
        "a) DFA ที่ไม่มี accept state",
        "b) DFA ที่มี accept state แต่ไปไม่ถึง",
        "c) DFA ที่มีแต่ dead state",
        "d) ทุกข้อถูก",
        "e) ข้อ a และ b",
        "f) ข้อ b และ c"
      ],
      a: 3
    },
    {
      q: "63. ข้อใดเป็นข้อจำกัดของ Finite Automata",
      c: [
        "a) ไม่มี memory",
        "b) ไม่สามารถนับได้",
        "c) แก้ปัญหาที่ต้องจำข้อมูลไม่ได้",
        "d) จำกัดแค่ Regular Language",
        "e) ทุกข้อถูก",
        "f) ข้อ a, b, c ถูก"
      ],
      a: 4
    },
    {
      q: "64. ถ้า DFA อยู่ที่ non-accept state และ input หมด",
      c: [
        "a) reject",
        "b) accept",
        "c) continue",
        "d) error",
        "e) undefined",
        "f) ขึ้นอยู่กับ state"
      ],
      a: 0
    },
    {
      q: "65. DFA และ Regular Expression มีความสัมพันธ์อย่างไร",
      c: [
        "a) ทุก DFA สามารถแปลงเป็น RE ได้",
        "b) ทุก RE สามารถแปลงเป็น DFA ได้",
        "c) DFA และ RE มีพลังเท่ากัน",
        "d) ทุกข้อถูก",
        "e) ข้อ a และ b ถูก",
        "f) ไม่มีความสัมพันธ์"
      ],
      a: 3
    },

    // ===== ส่วนที่ 3: NFA และการแปลง NFA เป็น DFA (ข้อ 66-80) =====
    {
      q: "66. NFA ย่อมาจาก",
      c: [
        "a) Non-deterministic Finite Automaton",
        "b) New Finite Automaton",
        "c) Normal Finite Automaton",
        "d) Numerical Finite Automaton",
        "e) Natural Finite Automaton",
        "f) Next Finite Automaton"
      ],
      a: 0
    },
    {
      q: "67. ข้อใดเป็นความแตกต่างระหว่าง DFA และ NFA",
      c: [
        "a) NFA สามารถมีหลาย transition จาก state เดียวด้วย input เดียวกัน",
        "b) NFA สามารถมี λ-transition",
        "c) DFA ต้อง deterministic แต่ NFA ไม่ต้อง",
        "d) ทุกข้อถูก",
        "e) ข้อ a และ b",
        "f) ข้อ a และ c"
      ],
      a: 3
    },
    {
      q: "68. ใน NFA ถ้ามีทางเลือกหลายทาง และมีทางหนึ่งที่ accept",
      c: [
        "a) NFA accept string นั้น",
        "b) NFA reject string นั้น",
        "c) ต้องเลือกทางเดียว",
        "d) error",
        "e) ขึ้นอยู่กับทางที่เลือกก่อน",
        "f) ต้องคำนวณทุกทาง"
      ],
      a: 0
    },
    {
      q: "69. λ-transition ใน NFA หมายถึง",
      c: [
        "a) Transition โดยไม่อ่าน input",
        "b) Transition ด้วย empty string",
        "c) ε-transition",
        "d) ทุกข้อถูก",
        "e) ข้อ a และ b",
        "f) ข้อ b และ c"
      ],
      a: 3
    },
    {
      q: "70. ทุก DFA เป็น NFA หรือไม่",
      c: [
        "a) ใช่ เพราะ DFA เป็นกรณีพิเศษของ NFA",
        "b) ไม่ เพราะมีคุณสมบัติต่างกัน",
        "c) ใช่ แต่ต้องแปลงก่อน",
        "d) ไม่ เพราะ DFA เข้มงวดกว่า",
        "e) ขึ้นอยู่กับภาษา",
        "f) ไม่สามารถบอกได้"
      ],
      a: 0
    },
    {
      q: "71. เมื่อแปลง NFA เป็น DFA state ใหม่ใน DFA ประกอบด้วย",
      c: [
        "a) เซตของ states จาก NFA",
        "b) State เดียวจาก NFA",
        "c) Transition จาก NFA",
        "d) Accept states เท่านั้น",
        "e) Start state เท่านั้น",
        "f) Dead states"
      ],
      a: 0
    },
    {
      q: "72. ถ้า NFA มี n states DFA ที่แปลงได้อาจมี state สูงสุด",
      c: [
        "a) n",
        "b) 2n",
        "c) 2^n",
        "d) n^2",
        "e) n!",
        "f) ∞"
      ],
      a: 2
    },
    {
      q: "73. ใน transition table ของ NFA ช่องหนึ่งอาจมีค่า",
      c: [
        "a) เซตของ states",
        "b) ∅",
        "c) state เดียว",
        "d) ทุกข้อถูก",
        "e) ข้อ a และ b",
        "f) ข้อ b และ c"
      ],
      a: 3
    },
    {
      q: "74. NFA reject string เมื่อไร",
      c: [
        "a) ทุกทางเลือกไม่นำไป accept state",
        "b) มีทางเลือกหนึ่งที่ reject",
        "c) ไม่มี transition",
        "d) อยู่ที่ dead state",
        "e) input หมดที่ non-accept state",
        "f) ข้อ a ถูก"
      ],
      a: 5
    },
    {
      q: "75. ข้อดีของ NFA คืออะไร",
      c: [
        "a) ง่ายต่อการออกแบบ",
        "b) ใช้ state น้อยกว่า DFA",
        "c) สามารถแสดงภาษาได้สั้นกว่า",
        "d) ทุกข้อถูก",
        "e) ไม่มีข้อดี",
        "f) ข้อ a และ b"
      ],
      a: 3
    },
    {
      q: "76. Subset Construction คือ",
      c: [
        "a) Algorithm แปลง NFA เป็น DFA",
        "b) การสร้าง subset ของ states",
        "c) Powerset construction",
        "d) ทุกข้อถูก",
        "e) ข้อ a และ c",
        "f) ข้อ b และ c"
      ],
      a: 3
    },
    {
      q: "77. ใน DFA ที่แปลงจาก NFA accept state คือ",
      c: [
        "a) State ที่มี accept state ของ NFA เป็นสมาชิก",
        "b) ทุก state",
        "c) State แรก",
        "d) State สุดท้าย",
        "e) ไม่มี",
        "f) State ที่มีสมาชิกมากที่สุด"
      ],
      a: 0
    },
    {
      q: "78. NFA และ DFA มีกำลังในการยอมรับภาษา",
      c: [
        "a) เท่ากัน",
        "b) NFA มากกว่า",
        "c) DFA มากกว่า",
        "d) ไม่สามารถเปรียบเทียบได้",
        "e) ขึ้นอยู่กับภาษา",
        "f) ต่างกัน"
      ],
      a: 0
    },
    {
      q: "79. δ(q0, λ) = {q0, q1} ใน NFA หมายความว่า",
      c: [
        "a) จาก q0 โดยไม่อ่าน input ไปได้ทั้ง q0 และ q1",
        "b) จาก q0 อ่าน λ ไป q1",
        "c) q0 เชื่อมกับ q1",
        "d) λ-transition จาก q0",
        "e) ข้อ a และ d",
        "f) ข้อ b และ c"
      ],
      a: 4
    },
    {
      q: "80. ข้อใดไม่ใช่ขั้นตอนในการแปลง NFA เป็น DFA",
      c: [
        "a) สร้าง transition table",
        "b) เริ่มจาก start state",
        "c) รวม states ที่ไปได้เป็น state ใหม่",
        "d) ลบ λ-transition",
        "e) กำหนด accept states",
        "f) เพิ่ม dead state ให้ DFA"
      ],
      a: 5
    },

    // ===== ส่วนที่ 4: FA with Operations (ข้อ 81-90) =====
    {
      q: "81. การสร้าง FA จาก L1 ∪ L2 accept state คือ",
      c: [
        "a) State ที่เป็น accept ใน L1 หรือ L2",
        "b) State ที่เป็น accept ทั้ง L1 และ L2",
        "c) State ที่เป็น accept ใน L1 เท่านั้น",
        "d) State ที่เป็น accept ใน L2 เท่านั้น",
        "e) ทุก state",
        "f) ไม่มี accept state"
      ],
      a: 0
    },
    {
      q: "82. การสร้าง FA จาก L1 ∩ L2 accept state คือ",
      c: [
        "a) State ที่เป็น accept ทั้ง L1 และ L2",
        "b) State ที่เป็น accept ใน L1 หรือ L2",
        "c) State ที่เป็น accept ใน L1 เท่านั้น",
        "d) State ใดก็ได้",
        "e) State แรก",
        "f) State สุดท้าย"
      ],
      a: 0
    },
    {
      q: "83. การสร้าง FA จาก L1 - L2 accept state คือ",
      c: [
        "a) State ที่เป็น accept ใน L1 แต่ไม่ใช่ใน L2",
        "b) State ที่เป็น accept ใน L2 แต่ไม่ใช่ใน L1",
        "c) State ที่เป็น accept ทั้งสองภาษา",
        "d) ไม่มี accept state",
        "e) ทุก state",
        "f) State ที่ไม่เป็น accept ทั้งสอง"
      ],
      a: 0
    },
    {
      q: "84. ถ้า M1 มี 3 states และ M2 มี 2 states FA จาก L1 ∪ L2 มีกี่ state",
      c: [
        "a) 6",
        "b) 5",
        "c) 3",
        "d) 2",
        "e) 4",
        "f) 8"
      ],
      a: 0
    },
    {
      q: "85. ใน Product Construction state ใหม่ตั้งชื่อว่า",
      c: [
        "a) (q1, q2) โดย q1 จาก M1 และ q2 จาก M2",
        "b) q1 + q2",
        "c) q1q2",
        "d) ชื่อใหม่ทั้งหมด",
        "e) ใช้ตัวเลข",
        "f) ตามใจชอบ"
      ],
      a: 0
    },
    {
      q: "86. Closure properties ของ Regular Languages รวมถึง",
      c: [
        "a) Union, Intersection, Complement",
        "b) Concatenation, Star",
        "c) Reversal",
        "d) ทุกข้อถูก",
        "e) ข้อ a และ b",
        "f) ข้อ a, b, c"
      ],
      a: 3
    },
    {
      q: "87. ถ้า L1 = {a, ab} และ L2 = {b, bb} แล้ว L1 ∩ L2 คือ",
      c: [
        "a) ∅",
        "b) {b}",
        "c) {ab, bb}",
        "d) {a, b}",
        "e) {ab}",
        "f) L1 ∪ L2"
      ],
      a: 0
    },
    {
      q: "88. Symmetric Difference (L1 ⊕ L2) คือ",
      c: [
        "a) (L1 ∪ L2) - (L1 ∩ L2)",
        "b) L1 - L2",
        "c) L2 - L1",
        "d) L1 ∩ L2",
        "e) L1 ∪ L2",
        "f) ไม่มีนิยาม"
      ],
      a: 0
    },
    {
      q: "89. ถ้า L1 และ L2 เป็น Regular แล้ว L1 ∩ L2 เป็น",
      c: [
        "a) Regular",
        "b) Context-free",
        "c) ไม่เป็น Regular",
        "d) ขึ้นอยู่กับภาษา",
        "e) Recursive",
        "f) ไม่สามารถบอกได้"
      ],
      a: 0
    },
    {
      q: "90. Initial state ของ FA จาก L1 ∪ L2 คือ",
      c: [
        "a) (q0 ของ L1, q0 ของ L2)",
        "b) q0 ของ L1",
        "c) q0 ของ L2",
        "d) State ใหม่",
        "e) Accept state",
        "f) Dead state"
      ],
      a: 0
    },

    // ===== ส่วนที่ 5: Mealy Machine (FA with Output) (ข้อ 91-100) =====
    {
      q: "91. Mealy Machine คือ",
      c: [
        "a) FA ที่มี output",
        "b) FA ที่มี input พิเศษ",
        "c) FA with output บน transition",
        "d) ทุกข้อถูก",
        "e) ข้อ a และ c",
        "f) DFA พิเศษ"
      ],
      a: 4
    },
    {
      q: "92. ส่วนประกอบของ Mealy Machine ไม่รวม",
      c: [
        "a) Accept states",
        "b) States (Q)",
        "c) Input alphabet (Σ)",
        "d) Output alphabet (τ)",
        "e) Start state",
        "f) Transition function"
      ],
      a: 0
    },
    {
      q: "93. รูปแบบบน transition ของ Mealy Machine คือ",
      c: [
        "a) input/output",
        "b) input",
        "c) output",
        "d) input, output",
        "e) input → output",
        "f) input:output"
      ],
      a: 0
    },
    {
      q: "94. Mealy Machine ต่างจาก Moore Machine ตรงที่",
      c: [
        "a) Mealy มี output บน transition, Moore มี output บน state",
        "b) Mealy มี state น้อยกว่า",
        "c) Moore ทำงานเร็วกว่า",
        "d) Mealy ใช้งานง่ายกว่า",
        "e) ไม่มีความต่าง",
        "f) ข้อ a และ b"
      ],
      a: 0
    },
    {
      q: "95. จำนวน input และ output จาก state หนึ่งใน Mealy Machine",
      c: [
        "a) input หนึ่งตัวมี output หนึ่งตัว",
        "b) input หลายตัวมี output หนึ่งตัว",
        "c) input หนึ่งตัวมี output หลายตัว",
        "d) ไม่จำกัด",
        "e) ขึ้นอยู่กับ state",
        "f) เท่ากับจำนวน state"
      ],
      a: 0
    },
    {
      q: "96. Mealy Machine ใช้ใน application ใด",
      c: [
        "a) Pattern matching",
        "b) Sequence detector",
        "c) Binary adder",
        "d) ทุกข้อถูก",
        "e) ข้อ b และ c",
        "f) ไม่มีการใช้จริง"
      ],
      a: 3
    },
    {
      q: "97. ถ้า Mealy Machine ตรวจจับ \"110\" เมื่อพบจะ output",
      c: [
        "a) 1",
        "b) 0",
        "c) ขึ้นอยู่กับโจทย์",
        "d) 110",
        "e) λ",
        "f) error"
      ],
      a: 2
    },
    {
      q: "98. จำนวน states ใน Mealy Machine เทียบกับ Moore Machine",
      c: [
        "a) Mealy ใช้ state น้อยกว่าหรือเท่ากัน",
        "b) Mealy ใช้ state มากกว่า",
        "c) เท่ากันเสมอ",
        "d) ไม่สามารถเปรียบเทียบได้",
        "e) ขึ้นอยู่กับโจทย์",
        "f) Moore ใช้น้อยกว่า"
      ],
      a: 0
    },
    {
      q: "99. Mealy Machine สำหรับเครื่องขายของ output คือ",
      c: [
        "a) สินค้า, เงินทอน, หรือ nothing",
        "b) ราคา",
        "c) จำนวนเงิน",
        "d) สถานะเครื่อง",
        "e) ชื่อสินค้า",
        "f) ทุกข้อถูก"
      ],
      a: 0
    },
    {
      q: "100. ข้อใดไม่ใช่คุณสมบัติของ Mealy Machine",
      c: [
        "a) มี accept state",
        "b) ทุก transition ต้องมี output",
        "c) มี start state เดียว",
        "d) input หนึ่งตัวไปได้ state เดียว",
        "e) มี output alphabet",
        "f) ไม่มี λ-transition"
      ],
      a: 0
    }
  ];

  const questionsPerPage = 10;
  
  questions.forEach((q, index) => {
    // เพิ่ม page break หลังจากทุก 10 ข้อ (ยกเว้นข้อแรก)
    if (index > 0 && index % questionsPerPage === 0) {
      const pageNumber = Math.floor(index / questionsPerPage) + 1;
      const startQuestion = index + 1;
      const endQuestion = Math.min(index + questionsPerPage, questions.length);
      form.addPageBreakItem()
        .setTitle(`--- หน้า ${pageNumber} ---`)
        .setHelpText(`ข้อ ${startQuestion} - ${endQuestion}`);
    }
    
    const item = form.addMultipleChoiceItem();
    const title = normalizeQuestionText(q.q);

    // สร้าง array ของ choices พร้อม index เดิม
    const choicesWithIndex = q.c.map((text, i) => ({
      text: normalizeChoiceText(text, q.c.length),
      originalIndex: i,
      isCorrect: i === q.a
    }));

    // Shuffle choices (สลับตำแหน่งช้อยส์)
    // ใช้ Fisher-Yates shuffle algorithm
    for (let i = choicesWithIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choicesWithIndex[i], choicesWithIndex[j]] = [choicesWithIndex[j], choicesWithIndex[i]];
    }

    // ป้องกันไม่ให้ช้อยส์ซ้ำกันในคำถามเดียวกัน
    const usedChoiceLabels = {};
    const choices = choicesWithIndex.map((choice) => {
      let label = choice.text;
      while (Object.prototype.hasOwnProperty.call(usedChoiceLabels, label)) {
        // เพิ่ม zero-width space ทำให้ value ไม่ซ้ำ แต่ผู้สอบแทบไม่เห็นความต่าง
        label += "\u200B";
      }
      usedChoiceLabels[label] = true;
      return item.createChoice(label, choice.isCorrect);
    });

    item.setTitle(title)
      .setChoices(choices)
      .setPoints(1)
      .setRequired(false);
    
    // ตั้งค่า feedback เพื่อแสดงเฉลย (ใช้ข้อความที่ถูก normalize แล้ว แต่ไม่ต้องใส่ zero-width space)
    const correctAnswer = normalizeChoiceText(q.c[q.a], q.c.length);
    item.setFeedbackForCorrect(
      FormApp.createFeedback()
        .setText(`✓ คำตอบถูกต้อง!\n\nคำตอบที่ถูกต้องคือ: ${correctAnswer}`)
        .build()
    );
    item.setFeedbackForIncorrect(
      FormApp.createFeedback()
        .setText(`✗ คำตอบไม่ถูกต้อง\n\nคำตอบที่ถูกต้องคือ: ${correctAnswer}`)
        .build()
    );
  });

  Logger.log("FORM URL (ใช้ส่งผู้สอบ): " + form.getPublishedUrl());
  Logger.log("EDIT URL (แก้ไขฟอร์ม): " + form.getEditUrl());
  Logger.log("\n=== คำแนะนำการตั้งค่าแสดงเฉลย ===");
  Logger.log("1. ไปที่ Form Settings (⚙️) > Quizzes");
  Logger.log("2. ตั้งค่า 'Release grade' = 'Immediately after each submission'");
  Logger.log("3. ตั้งค่า 'Respondents can see' = 'Missed questions, Correct answers, and Point values'");
  Logger.log("4. บันทึกการตั้งค่า");
  Logger.log("\nเมื่อตั้งค่าเสร็จแล้ว ผู้สอบจะเห็น:");
  Logger.log("- คะแนนทันทีหลังส่งคำตอบ");
  Logger.log("- คำตอบที่ถูกต้องสำหรับทุกข้อ");
  Logger.log("- Feedback ที่ระบุว่าตอบถูกหรือผิด");
}
