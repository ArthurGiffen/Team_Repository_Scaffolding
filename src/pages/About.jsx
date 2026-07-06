import './About.css'

// Team bios. Each member edits their own entry below.
// That gives everyone a simple commit to make.
const members = [
  { name: 'Member One', role: 'Frontend', bio: 'Replace with your bio.' },
  { name: 'Member Two', role: 'Backend', bio: 'Replace with your bio.' },
  { name: 'Member Three', role: 'Database', bio: 'Replace with your bio.' },
  { name: 'Member Four', role: 'Design / QA', bio: 'Replace with your bio.' },
]

function About() {
  return (
    <section>
      <h1>Meet the Team</h1>
      <p className="lead">The people building Shelf.</p>

      <div className="team">
        {members.map((m) => (
          <article className="member" key={m.name}>
            <h3 className="member__name">{m.name}</h3>
            <span className="member__role">{m.role}</span>
            <p className="member__bio">{m.bio}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default About
