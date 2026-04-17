import { useState } from 'react'

const SIZE_CHARTS = {
  kurta: {
    label: 'Kurtas & Tunics',
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Length (in)'],
    rows: [
      ['XS', '32', '26', '35', '42'],
      ['S',  '34', '28', '37', '42'],
      ['M',  '36', '30', '39', '43'],
      ['L',  '38', '32', '41', '43'],
      ['XL', '40', '34', '43', '44'],
      ['XXL','42', '36', '45', '44'],
      ['XXXL','44','38', '47', '45'],
    ],
  },
  sharara: {
    label: 'Sharara & Palazzo Sets',
    headers: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
    rows: [
      ['XS', '26', '35', '38'],
      ['S',  '28', '37', '38'],
      ['M',  '30', '39', '39'],
      ['L',  '32', '41', '39'],
      ['XL', '34', '43', '40'],
      ['XXL','36', '45', '40'],
      ['XXXL','38','47', '40'],
    ],
  },
  blouse: {
    label: 'Blouses (Saree)',
    headers: ['Size', 'Bust (in)', 'Shoulder (in)', 'Length (in)'],
    rows: [
      ['XS', '32', '13.5', '14'],
      ['S',  '34', '14',   '14'],
      ['M',  '36', '14.5', '14.5'],
      ['L',  '38', '15',   '14.5'],
      ['XL', '40', '15.5', '15'],
      ['XXL','42', '16',   '15'],
    ],
  },
}

const TIPS = [
  { title: 'Measure over fitted clothing', desc: 'Tight-fitting innerwear pehen ke measurements lein for accuracy.' },
  { title: 'Keep the tape level', desc: 'Measuring tape ko parallel to floor rakhein — dhila ya tight na kharcho.' },
  { title: 'Bust', desc: 'Tape ko fullest part of bust ke around wrap karein.' },
  { title: 'Waist', desc: 'Natural waistline pe — belly button se thoda upar.' },
  { title: 'Hip', desc: 'Fullest part of hips ke around, usually belly button se 8 inch neeche.' },
  { title: 'Custom sizes', desc: 'Agar aapka size chart mein nahi hai, toh Custom / Made-to-Order option available hai — hum aapke measurements ke according banate hain.' },
]

export default function SizeGuidePage() {
  const [active, setActive] = useState('kurta')
  const chart = SIZE_CHARTS[active]

  return (
    <div className="pt-[108px] lg:pt-[108px] pb-16 lg:pb-24 bg-white">

      {/* Hero */}
      <section className="bg-cream py-12 lg:py-20 px-4 sm:px-6 lg:px-8 mb-10 lg:mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-medium mb-3">Fit your best</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-light text-charcoal uppercase tracking-wide">Size Guide</h1>
          <div className="w-16 h-px bg-charcoal mx-auto mt-6" />
          <p className="text-charcoal text-sm lg:text-base font-light leading-relaxed mt-6 max-w-2xl mx-auto">
            Ek perfect fit hi outfit ko outfit banata hai. Hamari measurements mein select karein ya custom size ke liye humein bolein.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap gap-2 lg:gap-3 justify-center">
          {Object.entries(SIZE_CHARTS).map(([key, c]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`text-xs lg:text-sm tracking-[0.2em] uppercase px-5 lg:px-8 py-3 border-2 font-semibold transition-colors ${
                active === key
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-white text-charcoal border-charcoal hover:bg-charcoal/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-20">
        <div className="overflow-x-auto border-2 border-charcoal">
          <table className="w-full text-charcoal">
            <thead className="bg-charcoal text-white">
              <tr>
                {chart.headers.map(h => (
                  <th key={h} className="text-[10px] lg:text-xs tracking-[0.2em] uppercase font-semibold py-4 px-3 lg:px-6 text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row, i) => (
                <tr key={i} className={i % 2 ? 'bg-cream' : 'bg-white'}>
                  {row.map((cell, j) => (
                    <td key={j} className={`text-center py-3 lg:py-4 px-3 lg:px-6 text-sm lg:text-base ${j === 0 ? 'font-semibold tracking-wider uppercase' : 'font-light'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-charcoal font-light text-center mt-4 tracking-wide">
          * All measurements are in inches. 1 inch = 2.54 cm
        </p>
      </section>

      {/* Tips */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-semibold mb-2">How to measure</p>
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-charcoal uppercase">Measuring Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {TIPS.map((t, i) => (
            <div key={i} className="border border-charcoal p-6">
              <p className="text-[10px] tracking-[0.25em] uppercase text-charcoal font-semibold mb-2">0{i + 1}</p>
              <h3 className="font-serif text-lg text-charcoal font-medium mb-2">{t.title}</h3>
              <p className="text-sm text-charcoal font-light leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
