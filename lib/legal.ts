// เนื้อหาหน้าเชิงนโยบาย (สองภาษา) — เก็บเป็น data แทนใส่ใน messages เพราะเป็นข้อความยาว
export type LegalSection = { h: string; p: string[] }
export type LocalizedSections = { th: LegalSection[]; en: LegalSection[] }

export const TERMS_UPDATED = { th: "4 มิถุนายน 2569", en: "June 4, 2026" }
export const PRIVACY_UPDATED = {
  th: "4 มิถุนายน 2569 · สอดคล้องกับ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
  en: "June 4, 2026 · In line with Thailand’s PDPA",
}

export const termsSections: LocalizedSections = {
  th: [
    {
      h: "1. การยอมรับเงื่อนไข",
      p: [
        "การเข้าใช้งานเว็บไซต์ thapsakaefocus.com ถือว่าผู้ใช้ยอมรับเงื่อนไขการใช้บริการนี้ทั้งหมด หากไม่ยอมรับ โปรดงดใช้บริการ",
      ],
    },
    {
      h: "2. ลักษณะของแพลตฟอร์ม",
      p: [
        "ทับสะแกโฟกัสเป็นแพลตฟอร์มชุมชนเชิงพาณิชย์ที่รวบรวมข้อมูลข่าวสาร ร้านค้า และสถานที่ท่องเที่ยวของอำเภอทับสะแก ไม่ได้เป็นหน่วยงานราชการ และไม่มีส่วนเกี่ยวข้องกับหน่วยงานของรัฐ",
      ],
    },
    {
      h: "3. ความถูกต้องของข้อมูล",
      p: [
        "ทีมงานพยายามรักษาความถูกต้องของข้อมูล แต่ไม่รับประกันความครบถ้วนหรือเป็นปัจจุบันของข้อมูลร้านค้า/สถานที่ ผู้ใช้ควรตรวจสอบกับแหล่งข้อมูลโดยตรงก่อนตัดสินใจ",
      ],
    },
    {
      h: "4. บัญชีผู้ใช้",
      p: [
        "ผู้ใช้ที่สมัครสมาชิกผ่าน Google, Facebook หรือ LINE มีหน้าที่รักษาความปลอดภัยของบัญชีตนเอง และรับผิดชอบต่อกิจกรรมที่เกิดขึ้นภายใต้บัญชี",
      ],
    },
    {
      h: "5. การใช้งานที่ห้าม",
      p: [
        "ห้ามใช้แพลตฟอร์มเพื่อเผยแพร่เนื้อหาผิดกฎหมาย ละเมิดสิทธิผู้อื่น หรือก่อความเสียหายต่อระบบ ทีมงานสงวนสิทธิ์ในการลบเนื้อหาและระงับบัญชีที่ฝ่าฝืน",
      ],
    },
    {
      h: "6. การเปลี่ยนแปลงเงื่อนไข",
      p: [
        "ทีมงานอาจปรับปรุงเงื่อนไขนี้เป็นครั้งคราว การใช้บริการต่อหลังการเปลี่ยนแปลงถือเป็นการยอมรับเงื่อนไขฉบับใหม่",
      ],
    },
  ],
  en: [
    {
      h: "1. Acceptance of Terms",
      p: [
        "By using thapsakaefocus.com you agree to these Terms of Service in full. If you do not agree, please stop using the service.",
      ],
    },
    {
      h: "2. Nature of the Platform",
      p: [
        "Thapsakae Focus is a community platform compiling news, shops, and travel information for Thapsakae district. It is not a government agency and is not affiliated with any state body.",
      ],
    },
    {
      h: "3. Accuracy of Information",
      p: [
        "We strive to keep information accurate but do not guarantee the completeness or timeliness of shop/place data. Please verify with the source before making decisions.",
      ],
    },
    {
      h: "4. User Accounts",
      p: [
        "Users who sign up via Google, Facebook, or LINE are responsible for keeping their account secure and for activity under their account.",
      ],
    },
    {
      h: "5. Prohibited Use",
      p: [
        "Do not use the platform to publish illegal content, infringe others’ rights, or harm the system. We reserve the right to remove content and suspend violating accounts.",
      ],
    },
    {
      h: "6. Changes to Terms",
      p: [
        "We may update these terms from time to time. Continued use after changes constitutes acceptance of the updated terms.",
      ],
    },
  ],
}

export const privacySections: LocalizedSections = {
  th: [
    {
      h: "1. ข้อมูลที่เราเก็บ",
      p: [
        "เมื่อสมัครสมาชิกผ่าน Google, Facebook หรือ LINE เราจะเก็บข้อมูลเท่าที่จำเป็น ได้แก่ ชื่อที่แสดง และอีเมล (หากผู้ให้บริการส่งมา) เราไม่เก็บรหัสผ่านของผู้ใช้",
      ],
    },
    {
      h: "2. วัตถุประสงค์ในการใช้ข้อมูล",
      p: [
        "ใช้เพื่อระบุตัวตนในการเข้าสู่ระบบ แสดงชื่อผู้ใช้ และพัฒนาบริการ เราไม่ขายข้อมูลส่วนบุคคลให้บุคคลที่สาม",
      ],
    },
    {
      h: "3. คุกกี้และการวิเคราะห์",
      p: [
        "เราใช้คุกกี้ที่จำเป็นต่อการทำงานของระบบ และเครื่องมือวิเคราะห์ที่เคารพความเป็นส่วนตัว ซึ่งไม่ติดตามตัวบุคคล",
      ],
    },
    {
      h: "4. การจัดเก็บและความปลอดภัย",
      p: [
        "ข้อมูลถูกจัดเก็บบนโครงสร้างพื้นฐานของ Supabase ที่มีการเข้ารหัส เราใช้มาตรการที่เหมาะสมเพื่อป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต",
      ],
    },
    {
      h: "5. สิทธิของเจ้าของข้อมูล",
      p: [
        "ผู้ใช้มีสิทธิขอเข้าถึง แก้ไข หรือขอลบข้อมูลส่วนบุคคลของตนได้ โดยติดต่อผ่านช่องทางในหน้าติดต่อเรา เราจะดำเนินการภายในระยะเวลาที่กฎหมายกำหนด",
      ],
    },
  ],
  en: [
    {
      h: "1. Data We Collect",
      p: [
        "When you sign up via Google, Facebook, or LINE, we collect only what is needed: your display name and email (if the provider sends it). We do not store user passwords.",
      ],
    },
    {
      h: "2. How We Use Data",
      p: [
        "To identify you at sign-in, show your display name, and improve the service. We do not sell personal data to third parties.",
      ],
    },
    {
      h: "3. Cookies and Analytics",
      p: [
        "We use cookies essential to the system and privacy-respecting analytics that do not track individuals.",
      ],
    },
    {
      h: "4. Storage and Security",
      p: [
        "Data is stored on Supabase’s encrypted infrastructure. We apply appropriate measures to prevent unauthorized access.",
      ],
    },
    {
      h: "5. Your Rights",
      p: [
        "You may request access to, correction of, or deletion of your personal data via the contact page. We will act within the period required by law.",
      ],
    },
  ],
}
