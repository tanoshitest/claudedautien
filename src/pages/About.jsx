import { Link } from 'react-router-dom';
import styles from './About.module.css';

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.badge}>Câu chuyện của chúng tôi</div>
          <h1>Tanoshi Store — <span>Niềm vui từ Nhật Bản</span></h1>
          <p>
            "Tanoshi" (楽しい) trong tiếng Nhật có nghĩa là "vui vẻ, thú vị". Đó chính là triết lý
            mà chúng tôi gửi gắm vào mỗi sản phẩm — mang lại niềm vui nhỏ bé trong cuộc sống hàng ngày.
          </p>
        </section>

        <section className={styles.values}>
          {[
            { icon: '🌸', title: 'Chất lượng Nhật Bản', desc: 'Tất cả sản phẩm được chọn lọc kỹ càng, mang đậm tinh thần tỉ mỉ và chất lượng của người Nhật.' },
            { icon: '💚', title: 'Thân thiện môi trường', desc: 'Chúng tôi ưu tiên các sản phẩm bền vững, đóng gói tái chế và giảm thiểu rác thải.' },
            { icon: '🤝', title: 'Khách hàng là trung tâm', desc: 'Mỗi trải nghiệm mua sắm đều được chúng tôi chăm chút để bạn cảm thấy hài lòng nhất.' },
          ].map((v) => (
            <div key={v.title} className={styles.valueCard}>
              <span>{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </section>

        <section className={styles.stats}>
          {[
            { num: '5,000+', label: 'Khách hàng hài lòng' },
            { num: '200+', label: 'Sản phẩm độc quyền' },
            { num: '4.8★', label: 'Điểm đánh giá TB' },
            { num: '2 năm', label: 'Kinh nghiệm' },
          ].map((s) => (
            <div key={s.label} className={styles.stat}>
              <strong>{s.num}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </section>

        <section className={styles.cta}>
          <h2>Sẵn sàng khám phá?</h2>
          <p>Hãy để chúng tôi mang niềm vui Nhật Bản đến tận tay bạn.</p>
          <Link to="/shop" className={styles.shopBtn}>Vào cửa hàng ngay →</Link>
        </section>
      </div>
    </main>
  );
}
