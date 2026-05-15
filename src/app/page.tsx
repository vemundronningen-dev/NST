import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { getCategories } from '@/lib/actions'
import type { Category } from '@/types'

const CATEGORY_ICONS: Record<string, string> = {
  Gripar: '🦾',
  Skopor: '⛏️',
  Sopborste: '🔧',
}

const CATEGORY_DESC: Record<string, string> = {
  Gripar: 'Hydrauliska gripar för sortering, rivning och hantering av material.',
  Skopor: 'OEM-skopor för grävning och lastning — alla klasser och kapaciteter.',
  Sopborste: 'Roterande sopborstar för effektiv städning av gator och ytor.',
}

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <>
      <Header />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'var(--dark)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.3,
          }}
        />

        {/* Yellow accent bar */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: '20%',
            width: '4px',
            height: '60%',
            background: 'var(--yellow)',
            opacity: 0.6,
          }}
        />

        <div
          className="container"
          style={{ position: 'relative', zIndex: 1, paddingTop: '80px', paddingBottom: '80px' }}
        >
          {/* Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{ width: '32px', height: '2px', background: 'var(--yellow)' }}
              aria-hidden
            />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--yellow)',
              }}
            >
              Nordic Surface Technology
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(48px, 8vw, 96px)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              maxWidth: '900px',
              marginBottom: '32px',
            }}
          >
            OEM-kvalitet för{' '}
            <span style={{ color: 'var(--yellow)', display: 'block' }}>
              grävmaskins&shy;tillbehör
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: '18px',
              lineHeight: 1.7,
              color: 'var(--text-muted)',
              maxWidth: '540px',
              marginBottom: '48px',
            }}
          >
            Vi levererar tillbehör med OEM-specifikationer för alla ledande
            grävmaskinsmärken. Exakt passform, hög hållfasthet och snabb
            leverans direkt till arbetsplatsen.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/catalog" className="btn-primary" style={{ fontSize: '16px', padding: '14px 36px' }}>
              Se hela katalogen
            </Link>
            <a
              href="#categories"
              className="btn-secondary"
              style={{ fontSize: '16px', padding: '14px 36px' }}
            >
              Bläddra kategorier
            </a>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '48px',
              marginTop: '80px',
              paddingTop: '40px',
              borderTop: '1px solid var(--border)',
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '500+', label: 'Produkter i lager' },
              { value: 'OEM', label: 'Certifierad kvalitet' },
              { value: '24h', label: 'Leveranstid' },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '36px',
                    color: 'var(--yellow)',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: '13px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category cards ─────────────────────────────────────────────────── */}
      <section id="categories" className="section" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '36px',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Produktkategorier
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Välj kategori och hitta rätt tillbehör för din maskin.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {categories.length > 0
              ? categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)
              : DEFAULT_CATEGORIES.map((cat) => (
                  <StaticCategoryCard key={cat.name} name={cat.name} desc={cat.desc} />
                ))}
          </div>
        </div>
      </section>

      {/* ── Why NST ────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '36px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              marginBottom: '48px',
            }}
          >
            Varför NST?
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                title: 'OEM-certifierat',
                body: 'Alla produkter tillverkade enligt originaltillverkarens specifikationer.',
              },
              {
                title: 'Bred kompatibilitet',
                body: 'Tillbehör för Volvo, Komatsu, Caterpillar, Liebherr och fler.',
              },
              {
                title: 'Snabb leverans',
                body: 'Lagerförda produkter skickas inom 24 timmar efter bekräftad order.',
              },
              {
                title: 'Teknisk support',
                body: 'Våra tekniker hjälper dig välja rätt produkt för din applikation.',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: 'var(--dark-2)',
                  border: '1px solid var(--border)',
                  padding: '28px',
                  borderTop: '3px solid var(--yellow)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '20px',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--dark-2)',
          borderTop: '1px solid var(--border)',
          padding: '80px 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '40px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Redo att beställa?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '16px' }}>
            Bläddra bland hundratals OEM-tillbehör för din grävmaskin.
          </p>
          <Link href="/catalog" className="btn-primary" style={{ fontSize: '16px', padding: '14px 40px' }}>
            Gå till katalogen
          </Link>
        </div>
      </section>
    </>
  )
}

const DEFAULT_CATEGORIES = [
  { name: 'Gripar', desc: CATEGORY_DESC['Gripar'] },
  { name: 'Skopor', desc: CATEGORY_DESC['Skopor'] },
  { name: 'Sopborste', desc: CATEGORY_DESC['Sopborste'] },
]

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/catalog?category=${category.id}`} style={{ display: 'block' }}>
      <article
        className="product-card"
        style={{
          padding: '36px 28px',
          borderTop: '3px solid var(--border)',
          transition: 'border-color 0.2s, transform 0.2s',
        }}
      >
        <span style={{ fontSize: '36px', display: 'block', marginBottom: '16px' }}>
          {CATEGORY_ICONS[category.name] ?? '⚙️'}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '24px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          {category.name}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
          {CATEGORY_DESC[category.name] ?? category.description ?? ''}
        </p>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--yellow)',
          }}
        >
          Se produkter →
        </span>
      </article>
    </Link>
  )
}

function StaticCategoryCard({ name, desc }: { name: string; desc: string }) {
  return (
    <Link href={`/catalog?search=${encodeURIComponent(name)}`} style={{ display: 'block' }}>
      <article
        className="product-card"
        style={{ padding: '36px 28px', borderTop: '3px solid var(--border)' }}
      >
        <span style={{ fontSize: '36px', display: 'block', marginBottom: '16px' }}>
          {CATEGORY_ICONS[name] ?? '⚙️'}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '24px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          {name}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
          {desc}
        </p>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--yellow)',
          }}
        >
          Se produkter →
        </span>
      </article>
    </Link>
  )
}
